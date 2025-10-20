import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database, Loader2, CheckCircle2, RefreshCw } from "lucide-react";

export const KnowledgeBaseStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ count: number; lastFetch: string | null } | null>(null);
  const { toast } = useToast();

  const checkStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('id, fetched_at')
        .order('fetched_at', { ascending: false });

      if (error) throw error;

      setStatus({
        count: data?.length || 0,
        lastFetch: data?.[0]?.fetched_at || null
      });
    } catch (error: any) {
      console.error('Error checking status:', error);
    }
  };

  const parseKnowledge = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "Refreshing Knowledge Base",
        description: "Fetching and parsing health data sources...",
      });

      const { data, error } = await supabase.functions.invoke('parse-knowledge-sources');

      if (error) throw error;

      await checkStatus();
      
      toast({
        title: "Success",
        description: "Knowledge base updated successfully",
      });
    } catch (error: any) {
      console.error('Error parsing knowledge:', error);
      toast({
        title: "Error",
        description: "Failed to parse knowledge sources",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeKnowledge = async () => {
      await checkStatus();
      // Auto-parse if no sources exist
      if (status?.count === 0) {
        await parseKnowledge();
      }
    };
    
    initializeKnowledge();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          AI Knowledge Base
        </CardTitle>
        <CardDescription>
          Health data sources powering the AI chatbot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm text-muted-foreground">Loading health data sources...</p>
          </div>
        ) : status && status.count > 0 ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium">
                {status.count} sources available
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={parseKnowledge}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Initializing knowledge base...</p>
        )}
      </CardContent>
    </Card>
  );
};
