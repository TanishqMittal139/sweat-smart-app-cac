import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SOURCES = [
  // CDC data sources
  "https://stacks.cdc.gov/view/cdc/147179",
  "https://www.cdc.gov/dnpao-data-trends-maps/cbs-heals/index.html",
  "https://www.cdc.gov/dnpao-data-trends-maps/healthy-people-2030/index.html",
  "https://www.cdc.gov/dnpao-state-local-programs/php/data-statistics/health-equity.html",
  "https://www.cdc.gov/nutrition/php/data-research/index.html",
  "https://www.cdc.gov/breastfeeding-data/about/index.html",
  "https://www.cdc.gov/obesity/childhood-obesity-facts/childhood-obesity-facts.html",
  "https://gis.cdc.gov/grasp/diabetes/diabetesatlas-surveillance.html",
  "https://gis.cdc.gov/grasp/diabetes/diabetesatlas-analysis.html",
  "https://www.cdc.gov/nchs/fastats/obesity-overweight.htm",
  "https://www.cdc.gov/obesity/data-and-statistics/adult-obesity-prevalence-maps.html",
  "https://www.cdc.gov/obesity/adult-obesity-facts/",
  "https://www.cdc.gov/nchs/products/databriefs/db508.htm",
  "https://www.cdc.gov/diabetes/php/data-research/index.html",
  "https://www.cdc.gov/chronicdisease/resources/publications/factsheets/heart-disease-stroke.htm",
  "https://www.cdc.gov/mental-health/data-research/facts-stats/index.html",
  "https://www.cdc.gov/physical-activity-basics/guidelines/index.html",
  "https://www.cdc.gov/nutrition/resources-publications/data-statistics.html",
  "https://www.cdc.gov/obesity/php/about/index.html",
  "https://www.cdc.gov/obesity/adult-obesity-facts/index.html",
  "https://www.cdc.gov/nchs/products/nvsr.htm",
  "https://www.cdc.gov/nchs/products/nhsr.htm",
  "https://www.cdc.gov/nchs/products/life_tables.htm",
  "https://www.cdc.gov/chronic-disease/about/index.html",
  "https://www.cdc.gov/active-people-healthy-nation/php/tools/sports-and-fitness.html",
  "https://www.cdc.gov/diabetes-prevention/php/lifestyle-change-resources/t2-curriculum.html",
  "https://blogs.cdc.gov/nchs/2013/01/30/215/",
  "https://www.cdc.gov/pcd/issues/2015/14_0392.htm",
  "https://blogs.cdc.gov/nchs/2014/05/28/2271/",
  "https://www.cdc.gov/disability-and-health/conditions/physical-activity.html",
  "https://www.cdc.gov/disability-and-health/articles-documents/cdc-and-special-olympics-inclusive-health.html",
  "https://blogs.cdc.gov/niosh-science-blog/2022/01/31/fitness-equipment/",
  "https://www.cdc.gov/physical-activity-education/guidelines/",
  "https://www.cdc.gov/obesity/family-action/",
  
  // World health organizations
  "https://data.worldobesity.org/",
  "https://gateway.euro.who.int/en/",
  "https://www.who.int/news/item/01-03-2024-one-in-eight-people-are-now-living-with-obesity",
  "https://www.paho.org/en/news/1-3-2024-one-eight-people-are-now-living-obesity",
  "https://www.worldobesity.org/about/about-obesity/prevalence-of-obesity",
  "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight",
  "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  "https://www.who.int/westernpacific/newsroom/feature-stories/item/10-health-tips-for-2025",
  
  // NIH and research
  "https://www.niddk.nih.gov/about-niddk/research-areas/obesity",
  "https://www.niddk.nih.gov/health-information/health-statistics/overweight-obesity",
  "https://www.niddk.nih.gov/health-information/health-statistics/diabetes-statistics",
  "https://www.niddk.nih.gov/health-information/health-statistics/diabetes-statistics/national-diabetes-survey",
  "https://www.nimh.nih.gov/health/statistics/mental-illness",
  "https://www.nih.gov/health-information/your-healthiest-self-wellness-toolkits",
  "https://www.nih.gov/news-events/nih-research-matters/2024-nih-research-highlights-promising-medical-findings",
  
  // Statistics and reports
  "https://www.nationmaster.com/country-info/stats/Health/Obesity#google_vignette",
  "https://www.massgeneralbrigham.org/en/about/newsroom/press-releases/dramatic-increase-in-adults-who-meet-new-definition-of-obesity",
  "https://www.statista.com/topics/1005/obesity-and-overweight/",
  "https://www.tfah.org/report-details/state-of-obesity-report-2025/",
  "https://www.tfah.org/report-details/state-of-obesity-2024/",
  "https://www.oecd.org/en/publications/2023/11/health-at-a-glance-2023_e04f8239/full-report/overweight-and-obesity_590d3909.html",
  "https://www.healthsystemtracker.org/indicator/health-well-being/body-mass-index-bmi/",
  "https://newsroom.heart.org/news/obesity-related-heart-disease-deaths-increased-in-the-u-s-over-the-past-two-decades",
  "https://www.henryford.com/blog/2025/02/american-obesity-rates-are-increasing",
  "https://obesitymedicine.org/blog/rising-obesity-rates-in-america-a-public-health-crisis/",
  "https://www.healthdata.org/news-events/newsroom/news-releases/lancet-without-immediate-action-nearly-260-million-people-usa",
  "https://usafacts.org/articles/obesity-rate-nearly-triples-united-states-over-last-50-years/",
  "https://www.visualcapitalist.com/mapped-u-s-obesity-rates-by-state/",
  "https://www.usnews.com/news/best-states/slideshows/the-most-obese-states-in-america",
  "https://diabetes.org/about-diabetes/statistics/about-diabetes",
  "https://www.chartspan.com/blog/top-chronic-disease-risk-factors/",
  
  // Health resources and tips
  "https://www.southbendclinic.com/health-topic/tips-for-maintaining-wellness-at-every-age",
  "https://medlineplus.gov/healthyaging.html",
  "https://fairbanks.indianapolis.iu.edu/doc/10-Tips-Healthy-Lifestyle.pdf",
  "https://www.sciencedaily.com/news/health_medicine/",
  
  // Healthcare insights and industry
  "https://asmbs.org/resources/metabolic-and-bariatric-surgery/",
  "https://www.wolterskluwer.com/en/expert-insights/health",
  "https://www.deloitte.com/us/en/insights/industry/government-public-sector-services/measuring-health-campaign-impact.html",
  "https://www.deloitte.com/us/en/insights/multimedia/podcasts/ai-to-improve-health-care-access.html",
  "https://www.deloitte.com/us/en/insights/industry/health-care/health-equity-economic-impact.html",
  "https://www.deloitte.com/us/en/insights/industry/government-public-sector-services/preparing-federal-healthcare-providers-for-the-healthcare-revolution.html",
  "https://www.deloitte.com/us/en/insights/industry/health-care/health-care-cfos-embrace-comprehensive-approach-to-profitability.html",
  "https://www.deloitte.com/us/en/insights/industry/health-care/consumer-trust-in-health-care-generative-ai.html",
  "https://www.deloitte.com/us/en/insights/industry/health-care/economic-burden-mental-health-inequities.html",
  "https://www.deloitte.com/us/en/insights/industry/health-care/how-digital-tools-can-help-the-maternal-health-crisis.html",
  "https://www.deloitte.com/us/en/insights/industry/health-care/health-tech-and-womens-health-investment-trends.html",
  "https://www.deloitte.com/us/en/insights/industry/health-care/future-of-healthcare-in-europe.html",
  
  // Academic research
  "https://jamanetwork.com/journals/jama/fullarticle/192032",
  "https://www.wvdhhr.org/bph/oehp/obesity/mortality.htm",
  "https://pmc.ncbi.nlm.nih.gov/articles/PMC9065308/",
  "https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(24)00153-4/fulltext",
  "https://stop.publichealth.gwu.edu/sites/g/files/zaxdzs4356/files/2022-06/fast-facts-costs-of-obesity.pdf",
  "https://stop.publichealth.gwu.edu/LFD-oct23",
  "https://www.annualreviews.org/content/journals/10.1146/annurev-publhealth-040119-094247",
  "https://ncmedicaljournal.com/article/55247",
  "https://www.sciencedirect.com/science/article/pii/S0277953617306639?via%3Dihub",
  "https://bmjopen.bmj.com/content/5/6/e007079",
  "https://www.sciencedirect.com/science/article/abs/pii/S0165032716324545?via%3Dihub",
  "https://ajph.aphapublications.org/doi/full/10.2105/AJPH.2014.302110",
  "https://www.nature.com/articles/s41416-021-01542-3",
  "https://mentalhealth.bmj.com/content/23/4/133",
  "https://journals.lww.com/md-journal/fulltext/2019/05030/prevalence_of_mental_health_problems_among_medical.19.aspx",
  "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2821176",
  "https://www.jmir.org/2020/8/e19950/",
  "https://www.jmir.org/2019/11/e13873/",
  "https://www.jmir.org/2018/12/e12244/",
  "https://link.springer.com/article/10.1007/s00787-016-0930-6",
  "https://bmcpsychiatry.biomedcentral.com/articles/10.1186/s12888-018-1613-2",
  "https://link.springer.com/article/10.1007/s11845-024-03806-2",
  "https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2024.1342361/full",
  "https://www.mdpi.com/1660-4601/17/1/347",
  "https://bmcpsychiatry.biomedcentral.com/articles/10.1186/s12888-018-1635-9",
  "https://hqlo.biomedcentral.com/articles/10.1186/s12955-018-0909-8",
  "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0269516",
  "https://www.aging-us.com/article/206031/text",
  "https://www.jssm.org/jssm-22-367.xml%3EFulltext",
  "https://www.mdpi.com/2072-6643/12/6/1804",
  "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0237019",
  "https://www.mayoclinicproceedings.org/article/S0025-6196(21)00422-5/fulltext",
  "https://link.springer.com/article/10.1007/s11916-011-0214-2",
  "https://www.nature.com/articles/s41598-021-86903-x",
  "https://www.mdpi.com/1660-4601/19/9/5060",
  "https://bmcpublichealth.biomedcentral.com/articles/10.1186/s12889-021-12403-2",
  "https://www.sciencedirect.com/science/article/pii/S0195666322003634?via%3Dihub",
  "https://jamanetwork.com/journals/jamapediatrics/fullarticle/2763829",
  "https://www.neurotherapeuticsjournal.org/article/S1878-7479(23)01250-3/fulltext",
  "https://onlinelibrary.wiley.com/doi/10.1155/2024/9835396",
  "https://www.nutricionhospitalaria.org/articles/03861/show",
  "https://www.mdpi.com/1660-4601/20/11/5930",
  "https://link.springer.com/article/10.1007/s40279-020-01373-x",
  "https://bmcgeriatr.biomedcentral.com/articles/10.1186/s12877-022-03564-9",
  "https://www.mdpi.com/1660-4601/19/22/14660",
  "https://www.tandfonline.com/doi/full/10.1080/09638288.2019.1573932",
  "https://www.nature.com/articles/s41598-024-61905-7",
  "https://bmcpediatr.biomedcentral.com/articles/10.1186/s12887-025-05738-x",
  "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0304912",
  "https://www.jsams.org/article/S1440-2440(18)31221-0/abstract",
  "https://bmcpublichealth.biomedcentral.com/articles/10.1186/s12889-024-19895-8",
  "https://www.mdpi.com/1660-4601/17/17/6216",
  
  // Dietary guidelines
  "https://www.dietaryguidelines.gov/sites/default/files/2021-03/Dietary_Guidelines_for_Americans-2020-2025.pdf"
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
