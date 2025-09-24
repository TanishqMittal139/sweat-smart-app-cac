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

  // Prepare chart data
  const chartData = weightEntries.map((entry, index) => {
    const displayWeight = isImperial 
      ? Math.round(entry.weight_kg * 2.20462 * 100) / 100
      : entry.weight_kg;
    
    return {
      day: index + 1,
      weight: displayWeight,
      date: entry.recorded_date
    };
  });

  // Calculate progress feedback
  const getProgressFeedback = () => {
    if (!profile?.weight_goal_type || !profile?.weight_goal_amount_kg || weightEntries.length < 2) {
      return null;
    }

    const latestWeight = weightEntries[weightEntries.length - 1]?.weight_kg;
    const previousWeight = weightEntries[0]?.weight_kg;
    
    if (!latestWeight || !previousWeight) return null;

    const weightChange = previousWeight - latestWeight; // Positive = weight loss, Negative = weight gain
    const isLosingWeight = weightChange > 0;
    const goalAmount = profile.weight_goal_amount_kg;

    let feedback = "";
    let isOnTrack = false;

    if (profile.weight_goal_type === 'loss') {
      isOnTrack = isLosingWeight && weightChange >= goalAmount * 0.1; // At least 10% progress
      feedback = isOnTrack 
        ? "Great job! You're on track with your weight loss goal." 
        : isLosingWeight 
          ? "You're losing weight, but consider increasing your efforts to reach your goal faster."
          : "You're gaining weight. Consider adjusting your diet and exercise routine.";
    } else {
      isOnTrack = !isLosingWeight && Math.abs(weightChange) >= goalAmount * 0.1;
      feedback = isOnTrack
        ? "Excellent! You're making good progress toward your weight gain goal."
        : !isLosingWeight
          ? "You're gaining weight, but consider increasing your caloric intake to reach your goal faster."
          : "You're losing weight. Focus on increasing healthy calories and strength training.";
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