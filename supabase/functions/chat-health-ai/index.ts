import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    // Initialize Supabase client for RAG
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract the user's latest message for RAG search
    const userMessage = messages[messages.length - 1]?.content || '';
    
    // Search for relevant knowledge chunks
    let relevantContext = '';
    try {
      // Simple keyword-based search using PostgreSQL full-text search
      const { data: chunks, error: searchError } = await supabase
        .from('knowledge_chunks')
        .select('content, knowledge_sources(title, url)')
        .textSearch('content', userMessage, {
          type: 'websearch',
          config: 'english'
        })
        .limit(5);

      if (!searchError && chunks && chunks.length > 0) {
        relevantContext = '\n\n--- RELEVANT HEALTH DATA ---\n' +
          chunks.map((chunk: any) => 
            `Source: ${chunk.knowledge_sources?.title || 'Unknown'}\n${chunk.content}`
          ).join('\n\n---\n\n') +
          '\n--- END OF HEALTH DATA ---\n\n';
        
        console.log(`Found ${chunks.length} relevant chunks for RAG`);
      }
    } catch (ragError) {
      console.error('RAG search error:', ragError);
      // Continue without RAG if search fails
    }

    // Prepare messages with health system prompt
    const systemPrompt = `You are a knowledgeable and empathetic health assistant focused on obesity, diabetes, chronic diseases, and related health topics.

Your capabilities include:
- Providing evidence-based information on obesity, diabetes, and chronic disease statistics
- Offering guidance on health management, prevention strategies, and lifestyle changes
- Explaining complex health data and research findings in accessible language
- Supporting users in understanding their health journey

Important guidelines:
1. Always base your responses on scientific evidence and reliable health data from the provided sources
2. When relevant health data is provided below, USE IT to answer questions with specific statistics and facts
3. Be empathetic and non-judgmental when discussing sensitive health topics
4. Encourage users to consult healthcare professionals for personalized medical advice
5. Provide clear, actionable information that users can understand and apply
6. When discussing statistics or research from the provided data, cite them specifically
7. If you're unsure about something, acknowledge it rather than guessing

Format your responses using:
- Clear paragraphs for readability
- Bullet points for lists
- **Bold** for emphasis on key points
- Headers (##) for different sections when appropriate

${relevantContext}

Remember: You're here to inform, support, and guide based on the latest health data - not to diagnose or replace medical professionals.`;

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