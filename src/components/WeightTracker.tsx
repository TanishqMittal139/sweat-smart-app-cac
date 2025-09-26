import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Scale, Target, TrendingUp, TrendingDown, RotateCcw } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface WeightEntry {
  id: string;
  weight_kg: number;
  recorded_date: string;
}

interface UserProfile {
  weight_goal_type?: string;
  weight_goal_amount_kg?: number;
  preferred_unit_system?: string;
  weight_kg?: number;
}

interface Props {
  profile: UserProfile | null;
  onProfileUpdate: () => void;
}

const WeightTracker = ({ profile, onProfileUpdate }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [goalType, setGoalType] = useState<string>(profile?.weight_goal_type || '');
  const [goalAmount, setGoalAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const isImperial = profile?.preferred_unit_system === 'imperial';
  const weightUnit = isImperial ? 'lbs' : 'kg';

  useEffect(() => {
    fetchWeightEntries();
  }, [user, profile]); // Add profile as dependency to refetch when profile updates

  // Real-time subscription for weight entries
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('weight-entries-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weight_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Weight entry changed:', payload);
          fetchWeightEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (profile?.weight_goal_amount_kg) {
      const displayAmount = isImperial 
        ? Math.round(profile.weight_goal_amount_kg * 2.20462 * 100) / 100
        : profile.weight_goal_amount_kg;
      setGoalAmount(displayAmount.toString());
    }
    setGoalType(profile?.weight_goal_type || '');
  }, [profile, isImperial]);

  const fetchWeightEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_date', { ascending: true });

      if (error) throw error;
      setWeightEntries(data || []);
    } catch (error) {
      console.error('Error fetching weight entries:', error);
    }
  };

  const handleGoalSave = async () => {
    if (!user || !goalType || !goalAmount) return;
    
    setIsLoading(true);
    try {
      let goalAmountKg = parseFloat(goalAmount);
      
      // Convert to kg if imperial
      if (isImperial) {
        goalAmountKg = goalAmountKg * 0.453592;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          weight_goal_type: goalType,
          weight_goal_amount_kg: Math.round(goalAmountKg * 100) / 100
        })
        .eq('user_id', user.id);

      if (error) throw error;

      onProfileUpdate();
      toast({
        title: "Goal Updated",
        description: "Your weight goal has been saved successfully."
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update goal.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetData = async () => {
    if (!user) return;
    
    setIsResetting(true);
    try {
      const { error } = await supabase
        .from('weight_entries')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      // Clear local state
      setWeightEntries([]);
      
      toast({
        title: "Data Reset",
        description: "All weight data has been successfully deleted."
      });
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset weight data.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Prepare chart data with actual calendar days
  const chartData = weightEntries.map((entry) => {
    const displayWeight = isImperial 
      ? Math.round(entry.weight_kg * 2.20462 * 100) / 100
      : entry.weight_kg;
    
    // Calculate days from first entry
    const firstEntryDate = new Date(weightEntries[0]?.recorded_date);
    const entryDate = new Date(entry.recorded_date);
    const daysDiff = Math.floor((entryDate.getTime() - firstEntryDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      day: daysDiff,
      weight: displayWeight,
      date: entry.recorded_date
    };
  });

  // Calculate progress feedback based on recent entries
  const getProgressFeedback = () => {
    if (!profile?.weight_goal_type || !profile?.weight_goal_amount_kg || weightEntries.length === 0) {
      return null;
    }

    // Filter entries from the last 30 days to get recent data, but ignore very old data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEntries = weightEntries
      .filter(entry => new Date(entry.recorded_date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(a.recorded_date).getTime() - new Date(b.recorded_date).getTime());

    // Need at least 2 entries to calculate progress
    if (recentEntries.length < 2) {
      return {
        feedback: "Not enough recent data. Track your weight for at least 2 days in the past month to see personalized advice.",
        isOnTrack: false
      };
    }

    // Get the earliest and latest entries from recent data
    const earliestEntry = recentEntries[0];
    const latestEntry = recentEntries[recentEntries.length - 1];
    
    // Calculate the actual time difference in days
    const earliestDate = new Date(earliestEntry.recorded_date);
    const latestDate = new Date(latestEntry.recorded_date);
    const daysDifference = Math.max(1, Math.floor((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate actual weight change and convert to weekly rate
    const weightChangeKg = earliestEntry.weight_kg - latestEntry.weight_kg; // Positive = weight loss
    const weeklyRateKg = (weightChangeKg / daysDifference) * 7; // Convert to weekly rate
    
    const isLosingWeight = weeklyRateKg > 0;
    const goalAmount = profile.weight_goal_amount_kg;
    
    // Calculate expected weekly rate (goal amount over reasonable timeframe)
    const expectedWeeklyRate = goalAmount / 12; // Assuming 12 weeks to reach goal
    const actualWeeklyRate = Math.abs(weeklyRateKg);

    // Convert values to user's preferred unit for display
    const displayActualWeeklyRate = isImperial 
      ? Math.round(actualWeeklyRate * 2.20462 * 100) / 100
      : Math.round(actualWeeklyRate * 100) / 100;
    const displayGoalAmount = isImperial 
      ? Math.round(goalAmount * 2.20462 * 100) / 100
      : Math.round(goalAmount * 100) / 100;

    let feedback = "";
    let isOnTrack = false;

    if (profile.weight_goal_type === 'loss') {
      isOnTrack = isLosingWeight && actualWeeklyRate >= expectedWeeklyRate * 0.5; // 50% of expected rate
      feedback = isOnTrack 
        ? `Great progress! You're losing an average of ${displayActualWeeklyRate}${weightUnit} per week. Keep up the excellent work!`
        : isLosingWeight 
          ? `You're losing weight (${displayActualWeeklyRate}${weightUnit}/week), but consider increasing your efforts to reach your ${displayGoalAmount}${weightUnit} loss goal faster.`
          : weeklyRateKg === 0
            ? "Your weight has remained stable recently. To lose weight, consider adjusting your diet and exercise routine."
            : `You've been gaining an average of ${displayActualWeeklyRate}${weightUnit} per week. Focus on your diet and exercise plan to get back on track.`;
    } else {
      isOnTrack = !isLosingWeight && actualWeeklyRate >= expectedWeeklyRate * 0.5;
      feedback = isOnTrack
        ? `Excellent! You're gaining an average of ${displayActualWeeklyRate}${weightUnit} per week. You're making great progress toward your ${displayGoalAmount}${weightUnit} gain goal.`
        : !isLosingWeight
          ? `You're gaining weight (${displayActualWeeklyRate}${weightUnit}/week), but consider increasing your caloric intake and strength training to reach your ${displayGoalAmount}${weightUnit} goal faster.`
          : weeklyRateKg === 0
            ? "Your weight has remained stable recently. To gain weight, focus on increasing healthy calories and strength training."
            : `You've been losing an average of ${displayActualWeeklyRate}${weightUnit} per week. Increase your caloric intake and focus on strength training.`;
    }

    return { feedback, isOnTrack };
  };

  const progressFeedback = getProgressFeedback();

  return (
    <div className="space-y-6">
      {/* Weight Goal Setting */}
      <Card className="rounded-2xl border-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Weight Goal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Goal Type</Label>
            <Select value={goalType} onValueChange={setGoalType}>
              <SelectTrigger className="rounded-xl border-2">
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="loss">Weight Loss</SelectItem>
                <SelectItem value="gain">Weight Gain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Target Amount per Week ({weightUnit})</Label>
            <Input
              type="number"
              step="0.1"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              className="rounded-xl border-2"
              placeholder={`How many ${weightUnit} to ${goalType === 'loss' ? 'lose' : 'gain'}?`}
            />
          </div>

          <Button 
            onClick={handleGoalSave}
            disabled={isLoading || !goalType || !goalAmount}
            className="w-full bg-gradient-primary hover:shadow-glow rounded-2xl py-3"
          >
            {isLoading ? "Saving..." : "Set Goal"}
          </Button>
        </CardContent>
      </Card>

      {/* Weight Trend Chart */}
      <Card className="rounded-2xl border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-secondary" />
              <span>Weight Trend</span>
            </div>
            {weightEntries.length > 0 && (
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
                    <AlertDialogTitle>Reset Weight Data</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your weight entries and clear your weight trend graph.
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
                    label={{ value: `Weight (${weightUnit})`, angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    labelFormatter={(value) => `Day ${value}`}
                    formatter={(value: any, name: string) => [`${value} ${weightUnit}`, 'Weight']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Progress Feedback */}
              {progressFeedback && (
                <div className={`p-4 rounded-xl border-2 ${
                  progressFeedback.isOnTrack 
                    ? 'bg-success/10 border-success/20' 
                    : 'bg-warning/10 border-warning/20'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {progressFeedback.isOnTrack ? (
                      <TrendingUp className="w-5 h-5 text-success" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-warning" />
                    )}
                    <h4 className="font-semibold">
                      {progressFeedback.isOnTrack ? 'On Track!' : 'Needs Attention'}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {progressFeedback.feedback}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Scale className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Weight Data</h3>
              <p className="text-sm text-muted-foreground">
                Update your weight in the Health Information section to see your progress.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightTracker;