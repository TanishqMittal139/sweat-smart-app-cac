import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database, Loader2, CheckCircle2, XCircle } from "lucide-react";

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
      const { data, error } = await supabase.functions.invoke('parse-knowledge-sources');

      if (error) throw error;

      toast({
        title: "Knowledge base updated",
        description: data.message,
      });

      await checkStatus();
    } catch (error: any) {
      console.error('Error parsing knowledge:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to parse knowledge sources",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          AI Knowledge Base
        </CardTitle>
        <CardDescription>
          Manage the health data sources used to train the AI chatbot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            {status ? (
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium">
                  {status.count} sources loaded
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">Not checked</p>
              </div>
            )}
          </div>
          <Button
            onClick={checkStatus}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            Check Status
          </Button>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={parseKnowledge}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Parsing 30 sources...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Update Knowledge Base
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This will fetch and parse all 30 health data sources
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
