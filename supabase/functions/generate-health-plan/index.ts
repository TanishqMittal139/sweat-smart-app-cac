import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client with the user's token
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Generating health plan for user:', user.id);

    // Fetch user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    // Fetch recent weight entries
    const { data: weightEntries, error: weightError } = await supabase
      .from('weight_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_date', { ascending: false })
      .limit(10);

    if (weightError) {
      console.error('Weight entries fetch error:', weightError);
    }

    // Construct detailed prompt for OpenAI
    const userInfo = {
      name: profile?.full_name || 'User',
      height: profile?.height_cm ? `${profile.height_cm} cm` : 'not provided',
      weight: profile?.weight_kg ? `${profile.weight_kg} kg` : 'not provided',
      biologicalSex: profile?.biological_sex || 'not provided',
      activityLevel: profile?.activity_level || 'not provided',
      weightGoalType: profile?.weight_goal_type || 'not provided',
      weightGoalAmount: profile?.weight_goal_amount_kg ? `${profile.weight_goal_amount_kg} kg` : 'not provided',
      preferredUnit: profile?.preferred_unit_system || 'metric',
      recentWeightEntries: weightEntries?.length ? weightEntries.map(entry => 
        `${entry.recorded_date}: ${entry.weight_kg} kg`
      ).join(', ') : 'no recent weight data'
    };

    const systemPrompt = `You are a certified health and fitness expert creating a personalized health plan. Generate a comprehensive, actionable health plan based on the user's data.

    CRITICAL: Format your response using proper Markdown syntax:
    - Use # for the main title
    - Use ## for section headers
    - Use - for bullet points
    - Use **bold** for emphasis

    Structure your response exactly like this format:

    # Personalized Health Plan for [NAME]

    ## Current Health Assessment
    - [Assessment points based on provided data]
    - [Note any missing data and its impact]

    ## Nutrition Recommendations
    - [Specific dietary advice]
    - [Calorie targets if applicable]
    - [Meal timing suggestions]

    ## Exercise Plan
    - [Specific workout recommendations]
    - [Frequency and duration]
    - [Progressive suggestions]

    ## Lifestyle Recommendations
    - [Sleep, stress, hydration advice]
    - [Daily habit suggestions]

    ## Goal Tracking
    - [Specific metrics to monitor]
    - [Expected timeline for results]

    ## Important Notes
    - [Any safety considerations]
    - [When to consult healthcare providers]

    Make the plan specific, actionable, and encouraging. If data is missing, acknowledge it but still provide valuable general recommendations.`;

    const userPrompt = `Please create a personalized health plan based on this information:

    Name: ${userInfo.name}
    Height: ${userInfo.height}
    Current Weight: ${userInfo.weight}
    Biological Sex: ${userInfo.biologicalSex}
    Activity Level: ${userInfo.activityLevel}
    Weight Goal: ${userInfo.weightGoalType}
    Target Weight: ${userInfo.weightGoalAmount}
    Preferred Unit System: ${userInfo.preferredUnit}
    Recent Weight History: ${userInfo.recentWeightEntries}

    Please provide a comprehensive, personalized health plan that addresses their specific goals and current situation.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const healthPlan = data.choices[0].message.content;

    console.log('Generated health plan successfully');

    // Delete any existing health plan for this user
    const { error: deleteError } = await supabase
      .from('health_plans')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting old health plan:', deleteError);
    }

    // Save the new health plan
    const { data: savedPlan, error: saveError } = await supabase
      .from('health_plans')
      .insert({
        user_id: user.id,
        plan_content: healthPlan,
        generated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) {
      throw new Error(`Failed to save health plan: ${saveError.message}`);
    }

    console.log('Health plan saved successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      healthPlan: savedPlan 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-health-plan function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate health plan';
    return new Response(JSON.stringify({ 
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});