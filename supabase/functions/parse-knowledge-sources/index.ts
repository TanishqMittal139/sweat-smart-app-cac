import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SOURCES = [
  "https://www.cdc.gov/obesity/data-and-statistics/adult-obesity-prevalence-maps.html",
  "https://www.cdc.gov/obesity/adult-obesity-facts/",
  "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight",
  "https://www.cdc.gov/nchs/products/databriefs/db508.htm",
  "https://www.niddk.nih.gov/health-information/health-statistics/overweight-obesity",
  "https://www.niddk.nih.gov/health-information/health-statistics/diabetes-statistics",
  "https://www.niddk.nih.gov/health-information/health-statistics/diabetes-statistics/national-diabetes-survey",
  "https://www.henryford.com/blog/2025/02/american-obesity-rates-are-increasing",
  "https://obesitymedicine.org/blog/rising-obesity-rates-in-america-a-public-health-crisis/",
  "https://www.healthdata.org/news-events/newsroom/news-releases/lancet-without-immediate-action-nearly-260-million-people-usa",
  "https://usafacts.org/articles/obesity-rate-nearly-triples-united-states-over-last-50-years/",
  "https://www.visualcapitalist.com/mapped-u-s-obesity-rates-by-state/",
  "https://www.usnews.com/news/best-states/slideshows/the-most-obese-states-in-america",
  "https://www.tfah.org/report-details/state-of-obesity-2024/",
  "https://jamanetwork.com/journals/jama/fullarticle/192032",
  "https://www.wvdhhr.org/bph/oehp/obesity/mortality.htm",
  "https://pmc.ncbi.nlm.nih.gov/articles/PMC9065308/",
  "https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00153-4/fulltext",
  "https://www.cdc.gov/obesity/php/about/index.html",
  "https://stop.publichealth.gwu.edu/sites/g/files/zaxdzs4356/files/2022-06/fast-facts-costs-of-obesity.pdf",
  "https://stop.publichealth.gwu.edu/LFD-oct23",
  "https://www.cdc.gov/obesity/adult-obesity-facts/index.html",
  "https://www.cdc.gov/nchs/products/nvsr.htm",
  "https://www.cdc.gov/nchs/products/nhsr.htm",
  "https://www.cdc.gov/nchs/products/life_tables.htm",
  "https://www.cdc.gov/diabetes/php/data-research/index.html",
  "https://diabetes.org/about-diabetes/statistics/about-diabetes",
  "https://www.niddk.nih.gov/health-information/health-statistics/diabetes-statistics",
  "https://www.cdc.gov/chronic-disease/about/index.html",
  "https://www.chartspan.com/blog/top-chronic-disease-risk-factors/"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Starting to parse ${SOURCES.length} knowledge sources...`);
    let successCount = 0;
    let errorCount = 0;

    for (const url of SOURCES) {
      try {
        console.log(`Fetching: ${url}`);
        
        // Check if already exists
        const { data: existing } = await supabase
          .from('knowledge_sources')
          .select('id')
          .eq('url', url)
          .single();

        if (existing) {
          console.log(`Skipping (already exists): ${url}`);
          continue;
        }

        // Fetch the content
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; HealthBot/1.0)'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        
        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : url;

        // Extract text content (basic HTML stripping)
        let content = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        // Limit content size
        if (content.length > 50000) {
          content = content.substring(0, 50000);
        }

        // Insert source
        const { data: source, error: sourceError } = await supabase
          .from('knowledge_sources')
          .insert({
            url,
            title,
            content,
            fetched_at: new Date().toISOString()
          })
          .select()
          .single();

        if (sourceError) throw sourceError;

        // Chunk the content (split into ~1000 char chunks)
        const chunkSize = 1000;
        const chunks = [];
        for (let i = 0; i < content.length; i += chunkSize) {
          chunks.push({
            source_id: source.id,
            content: content.substring(i, i + chunkSize),
            chunk_index: Math.floor(i / chunkSize)
          });
        }

        // Insert chunks
        const { error: chunksError } = await supabase
          .from('knowledge_chunks')
          .insert(chunks);

        if (chunksError) throw chunksError;

        console.log(`✓ Parsed: ${title} (${chunks.length} chunks)`);
        successCount++;
        
        // Small delay to avoid overwhelming servers
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`✗ Error parsing ${url}:`, error.message);
        errorCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Parsing complete: ${successCount} successful, ${errorCount} failed`,
        successCount,
        errorCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-knowledge-sources:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
