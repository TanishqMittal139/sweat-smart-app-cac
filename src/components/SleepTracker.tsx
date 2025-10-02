import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Moon, TrendingUp, TrendingDown, RotateCcw } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SleepEntry {
  id: string;
  user_id: string;
  hours: number;
  recorded_date: string;
  created_at: string;
}

interface Props {
  userId: string;
}

export const SleepTracker = ({ userId }: Props) => {
  const { toast } = useToast();
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchSleepEntries();
  }, [userId]);

  // Real-time subscription for sleep entries
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('sleep-entries-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sleep_entries',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Sleep entry changed:', payload);
          fetchSleepEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchSleepEntries = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('sleep_entries')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_date', { ascending: true });

      if (error) throw error;
      setSleepEntries(data || []);
    } catch (error) {
      console.error('Error fetching sleep entries:', error);
    }
  };

  const handleResetData = async () => {
    if (!userId) return;
    
    setIsResetting(true);
    try {
      const { error } = await supabase
        .from('sleep_entries')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      // Clear local state
      setSleepEntries([]);
      
      toast({
        title: "Data Reset",
        description: "All sleep data has been successfully deleted."
      });
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset sleep data.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Prepare chart data with actual calendar days
  const chartData = sleepEntries.map((entry) => {
    // Calculate days from first entry
    const firstEntryDate = new Date(sleepEntries[0]?.recorded_date);
    const entryDate = new Date(entry.recorded_date);
    const daysDiff = Math.floor((entryDate.getTime() - firstEntryDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      day: daysDiff,
      hours: entry.hours,
      date: entry.recorded_date
    };
  });

  // Calculate sleep feedback based on recent entries
  const getSleepFeedback = () => {
    if (sleepEntries.length === 0) {
      return null;
    }

    const recentEntries = sleepEntries.slice(-7); // Last 7 entries
    const avgHours = recentEntries.reduce((sum, entry) => sum + parseFloat(entry.hours.toString()), 0) / recentEntries.length;
    
    let trend = "stable";
    if (recentEntries.length >= 3) {
      const firstHalf = recentEntries.slice(0, Math.floor(recentEntries.length / 2));
      const secondHalf = recentEntries.slice(Math.floor(recentEntries.length / 2));
      const firstAvg = firstHalf.reduce((sum, e) => sum + parseFloat(e.hours.toString()), 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, e) => sum + parseFloat(e.hours.toString()), 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 0.5) trend = "improving";
      if (secondAvg < firstAvg - 0.5) trend = "declining";
    }

    let feedback = "";
    let isOnTrack = false;

    if (avgHours >= 8 && avgHours <= 10) {
      feedback = "Excellent! You're getting optimal sleep (8-10 hours). ";
      isOnTrack = true;
    } else if (avgHours >= 6 && avgHours < 8) {
      feedback = "You're getting decent sleep, but aim for 8-10 hours for optimal health. ";
      isOnTrack = false;
    } else if (avgHours > 10) {
      feedback = "You're sleeping more than recommended. Consider consulting a healthcare provider. ";
      isOnTrack = false;
    } else {
      feedback = "You're not getting enough sleep. Aim for 8-10 hours for better health. ";
      isOnTrack = false;
    }

    if (trend === "improving") {
      feedback += "Great job! Your sleep habits are improving. Keep it up!";
    } else if (trend === "declining") {
      feedback += "Your sleep has been declining recently. Try to prioritize rest.";
    } else {
      feedback += "Your sleep patterns are consistent.";
    }

    return { feedback, isOnTrack };
  };

  const sleepFeedback = getSleepFeedback();

  return (
    <div className="space-y-6">
      {/* Sleep Trend Chart */}
      <Card className="rounded-2xl border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Moon className="w-5 h-5 text-secondary" />
              <span>Sleep Trend</span>
            </div>
            {sleepEntries.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-2 hover:border-destructive hover:text-destructive"
                    disabled={isResetting}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Sleep Data</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your sleep entries and clear your sleep trend graph.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleResetData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={isResetting}
                    >
                      {isResetting ? "Resetting..." : "Reset Data"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="day" 
                    label={{ value: 'Days', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                    domain={[0, 12]}
                  />
                  <Tooltip 
                    labelFormatter={(value) => `Day ${value}`}
                    formatter={(value: any, name: string) => [`${value} hours`, 'Sleep']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Sleep Feedback */}
              {sleepFeedback && (
                <div className={`p-4 rounded-xl border-2 ${
                  sleepFeedback.isOnTrack 
                    ? 'bg-success/10 border-success/20' 
                    : 'bg-warning/10 border-warning/20'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {sleepFeedback.isOnTrack ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-warning" />
                    )}
                    <h4 className="font-semibold">
                      {sleepFeedback.isOnTrack ? 'Great Sleep!' : 'Needs Attention'}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {sleepFeedback.feedback}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Moon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Sleep Data</h3>
              <p className="text-sm text-muted-foreground">
                Update your sleep in the Health Information section to see your progress.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepTracker;
