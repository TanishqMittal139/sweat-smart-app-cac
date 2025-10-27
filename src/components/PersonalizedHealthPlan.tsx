import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2, RefreshCw, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

interface HealthPlan {
  id: string;
  plan_content: string;
  generated_at: string;
  created_at: string;
}

const PersonalizedHealthPlan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [healthPlan, setHealthPlan] = useState<HealthPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHealthPlan();
    }
  }, [user]);

  const fetchHealthPlan = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching health plan:', error);
        return;
      }

      setHealthPlan(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateHealthPlan = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-health-plan', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Health Plan Generated!",
        description: "Your personalized health plan has been created successfully.",
      });

      // Refresh the health plan
      await fetchHealthPlan();
    } catch (error: any) {
      console.error('Error generating health plan:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate health plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };


  if (isLoading) {
    return (
      <Card className="rounded-2xl border-2">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your health plan...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-primary" />
            <span>Personalized Health Plan</span>
          </div>
          {healthPlan && (
            <Badge variant="secondary" className="rounded-full flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Generated {format(new Date(healthPlan.generated_at), 'MMM d')}</span>
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!healthPlan ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Health Plan Yet
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Generate a personalized health plan based on your fitness data, goals, and activity level. 
              Our AI will create a comprehensive plan tailored just for you.
            </p>
            <Button
              onClick={generateHealthPlan}
              disabled={isGenerating}
              className="bg-gradient-primary hover:shadow-glow rounded-2xl px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Generate My Health Plan
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-subtle rounded-2xl p-6 border border-primary/20">
              <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                <div className="prose max-w-none text-foreground prose-headings:font-bold prose-headings:text-foreground prose-h1:text-3xl prose-h1:mb-4 prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2 prose-p:my-3 prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground prose-ul:my-3 prose-ul:text-foreground prose-ol:my-3 prose-ol:text-foreground prose-li:my-1.5 prose-li:text-base prose-li:text-foreground prose-strong:text-foreground prose-strong:font-semibold">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeHighlight]}
                  >
                    {healthPlan.plan_content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button
                onClick={generateHealthPlan}
                disabled={isGenerating}
                variant="outline"
                className="rounded-2xl border-2 hover:border-primary hover:text-primary transition-all duration-300 hover:scale-105"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating New Plan...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate New Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalizedHealthPlan;