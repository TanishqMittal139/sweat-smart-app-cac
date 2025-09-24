import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Scale, Target, TrendingUp, TrendingDown } from "lucide-react";
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

  const isImperial = profile?.preferred_unit_system === 'imperial';
  const weightUnit = isImperial ? 'lbs' : 'kg';

  useEffect(() => {
    fetchWeightEntries();
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

  // Calculate progress feedback based on last 7 days average
  const getProgressFeedback = () => {
    if (!profile?.weight_goal_type || !profile?.weight_goal_amount_kg || weightEntries.length === 0) {
      return null;
    }

    // Filter entries from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentEntries = weightEntries.filter(entry => 
      new Date(entry.recorded_date) >= sevenDaysAgo
    );

    // Need at least 2 entries in the last 7 days to calculate progress
    if (recentEntries.length < 2) {
      return {
        feedback: "Not enough recent data. Track your weight for at least 2 days in the past week to see personalized advice.",
        isOnTrack: false
      };
    }

    // Calculate average weights for first and second half of the period
    const midPoint = Math.floor(recentEntries.length / 2);
    const firstHalf = recentEntries.slice(0, midPoint || 1);
    const secondHalf = recentEntries.slice(midPoint);
    
    const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.weight_kg, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.weight_kg, 0) / secondHalf.length;
    
    const avgWeightChange = firstHalfAvg - secondHalfAvg; // Positive = weight loss, Negative = weight gain
    const isLosingWeight = avgWeightChange > 0;
    const goalAmount = profile.weight_goal_amount_kg;
    
    // Calculate expected weekly rate (goal amount over reasonable timeframe)
    const expectedWeeklyRate = goalAmount / 12; // Assuming 12 weeks to reach goal
    const actualWeeklyRate = Math.abs(avgWeightChange);

    let feedback = "";
    let isOnTrack = false;

    if (profile.weight_goal_type === 'loss') {
      isOnTrack = isLosingWeight && actualWeeklyRate >= expectedWeeklyRate * 0.5; // 50% of expected rate
      feedback = isOnTrack 
        ? `Great progress! You're losing an average of ${actualWeeklyRate.toFixed(1)}kg per week. Keep up the excellent work!`
        : isLosingWeight 
          ? `You're losing weight (${actualWeeklyRate.toFixed(1)}kg/week), but consider increasing your efforts to reach your ${goalAmount}kg loss goal faster.`
          : avgWeightChange === 0
            ? "Your weight has remained stable this week. To lose weight, consider adjusting your diet and exercise routine."
            : `You've gained an average of ${Math.abs(avgWeightChange).toFixed(1)}kg this week. Focus on your diet and exercise plan to get back on track.`;
    } else {
      isOnTrack = !isLosingWeight && actualWeeklyRate >= expectedWeeklyRate * 0.5;
      feedback = isOnTrack
        ? `Excellent! You're gaining an average of ${actualWeeklyRate.toFixed(1)}kg per week. You're making great progress toward your ${goalAmount}kg gain goal.`
        : !isLosingWeight
          ? `You're gaining weight (${actualWeeklyRate.toFixed(1)}kg/week), but consider increasing your caloric intake and strength training to reach your ${goalAmount}kg goal faster.`
          : avgWeightChange === 0
            ? "Your weight has remained stable this week. To gain weight, focus on increasing healthy calories and strength training."
            : `You've lost an average of ${Math.abs(avgWeightChange).toFixed(1)}kg this week. Increase your caloric intake and focus on strength training.`;
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
            <Label>Target Amount ({weightUnit})</Label>
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
          <CardTitle className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-secondary" />
            <span>Weight Trend</span>
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