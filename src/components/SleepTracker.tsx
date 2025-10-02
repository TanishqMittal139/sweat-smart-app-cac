import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, TrendingUp, TrendingDown, Moon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchSleepEntries();
      
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
          () => {
            fetchSleepEntries();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId]);

  const fetchSleepEntries = async () => {
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
      toast({
        title: "Error",
        description: "Failed to load sleep data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!hours || parseFloat(hours) <= 0 || parseFloat(hours) > 24) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number of hours (0-24)",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('sleep_entries')
        .insert({
          user_id: userId,
          hours: parseFloat(hours),
          recorded_date: formattedDate,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sleep entry added successfully",
      });
      setHours("");
      setDate(new Date());
    } catch (error) {
      console.error('Error adding sleep entry:', error);
      toast({
        title: "Error",
        description: "Failed to add sleep entry",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    try {
      const { error } = await supabase
        .from('sleep_entries')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "All sleep data has been reset",
      });
    } catch (error) {
      console.error('Error resetting sleep data:', error);
      toast({
        title: "Error",
        description: "Failed to reset sleep data",
        variant: "destructive",
      });
    }
  };

  const chartData = sleepEntries.map((entry, index) => ({
    day: index === 0 ? 0 : Math.floor(
      (new Date(entry.recorded_date).getTime() - new Date(sleepEntries[0].recorded_date).getTime()) / 
      (1000 * 60 * 60 * 24)
    ),
    hours: entry.hours,
    date: entry.recorded_date,
  }));

  const getSleepFeedback = () => {
    if (sleepEntries.length === 0) {
      return {
        message: "Start tracking your sleep to receive personalized feedback!",
        icon: <Moon className="w-5 h-5 text-muted-foreground" />,
        color: "text-muted-foreground"
      };
    }

    const recentEntries = sleepEntries.slice(-7);
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

    let message = "";
    let icon = <Moon className="w-5 h-5" />;
    let color = "";

    if (avgHours >= 8 && avgHours <= 10) {
      message = "Excellent! You're getting optimal sleep. ";
      color = "text-green-600";
      icon = <TrendingUp className="w-5 h-5 text-green-600" />;
    } else if (avgHours >= 6 && avgHours < 8) {
      message = "You're getting decent sleep, but aim for 8-10 hours for optimal health. ";
      color = "text-yellow-600";
      icon = <Moon className="w-5 h-5 text-yellow-600" />;
    } else if (avgHours > 10) {
      message = "You're sleeping more than recommended. Consider consulting a healthcare provider. ";
      color = "text-orange-600";
      icon = <TrendingDown className="w-5 h-5 text-orange-600" />;
    } else {
      message = "You're not getting enough sleep. Aim for 8-10 hours for better health. ";
      color = "text-red-600";
      icon = <TrendingDown className="w-5 h-5 text-red-600" />;
    }

    if (trend === "improving") {
      message += "Great job! Your sleep habits are improving. Keep it up!";
    } else if (trend === "declining") {
      message += "Your sleep has been declining recently. Try to prioritize rest.";
    } else {
      message += "Your sleep patterns are consistent.";
    }

    return { message, icon, color };
  };

  const feedback = getSleepFeedback();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sleep Tracking</span>
            {sleepEntries.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">Reset</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Sleep Data</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your sleep entries. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetData}>Reset</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hours of Sleep</label>
              <Input
                type="number"
                placeholder="8"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                step="0.5"
                min="0"
                max="24"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddEntry} 
                disabled={saving}
                className="w-full"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Entry"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {sleepEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sleep Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  label={{ value: 'Days', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                  domain={[0, 12]}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{format(new Date(payload[0].payload.date), 'MMM dd, yyyy')}</p>
                          <p className="text-sm">{payload[0].value} hours</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className={cn("mt-6 p-4 rounded-lg bg-muted/50 flex items-start gap-3", feedback.color)}>
              {feedback.icon}
              <p className="text-sm flex-1">{feedback.message}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
