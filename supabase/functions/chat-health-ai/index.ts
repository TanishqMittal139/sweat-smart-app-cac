import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { messages } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare messages with health system prompt
    const systemPrompt = `You are a knowledgeable health assistant focused on providing evidence-based information about nutrition, fitness, wellness, and general health topics. 

Your guidelines:
- Provide helpful, accurate information based on current health science
- Focus on nutrition, exercise, mental wellness, sleep, and general healthy lifestyle topics
- Always remind users that your advice is for informational purposes only
- Encourage users to consult healthcare professionals for medical concerns, diagnosis, or treatment
- Be supportive, encouraging, and non-judgmental in your responses
- If asked about specific medical conditions, provide general information but emphasize the need for professional medical advice
- Stay positive and motivational while being realistic about health goals
- Cite general health principles rather than specific studies unless asked

Formatting rules (CRITICAL - Always follow):
- Use # for main titles (largest font)
- Use ## for section headers
- Use ### for sub-headers when needed
- Use bullet points (- or numbered lists) for exercises, meals, or steps
- Use **bold** for highlighting key words inside lists
- Keep paragraphs short (2–3 sentences)
- Ensure output is scannable, visually structured, and easy to distinguish between headings, subheadings, and details

Remember: You're a wellness coach and health information resource, not a medical doctor.`;

    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    console.log('Sending request to OpenAI with', aiMessages.length, 'messages');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: aiMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-health-ai function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get AI response',
        details: errorMessage 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});