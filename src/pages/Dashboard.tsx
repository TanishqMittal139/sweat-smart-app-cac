import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import WeightTracker from "@/components/WeightTracker";
import PersonalizedHealthPlan from "@/components/PersonalizedHealthPlan";
import { SleepTracker } from "@/components/SleepTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Heart, Target, TrendingUp, Zap, Activity, MessageCircle, BarChart3, LogOut, Settings, User, Ruler, Scale, Calendar as CalendarIcon2, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
interface UserProfile {
  full_name: string;
  height_cm?: number;
  weight_kg?: number;
  biological_sex?: string;
  activity_level?: string;
  preferred_unit_system?: string;
}
const Dashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    loading,
    signOut
  } = useAuth();
  const {
    toast
  } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    weight: '',
    unitSystem: 'metric' as 'metric' | 'imperial',
    date: new Date()
  });
  const [isSaving, setIsSaving] = useState(false);
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      if (data) {
        setProfile(data);
        // Set edit data for weight editing
        const displayWeight = data.weight_kg && data.preferred_unit_system === 'imperial' 
          ? Math.round(data.weight_kg * 2.20462 * 100) / 100 
          : data.weight_kg;
        
        setEditData({
          weight: displayWeight ? String(displayWeight) : '',
          unitSystem: data.preferred_unit_system === 'imperial' ? 'imperial' : 'metric',
          date: new Date()
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Fetch user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, [user]);
  
  const handleSaveWeight = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updateData: any = {};
      let weightInKg: number | null = null;

      // Convert and validate weight
      if (editData.weight) {
        const weightValue = parseFloat(editData.weight);
        if (editData.unitSystem === 'imperial') {
          // Convert lbs to kg
          weightInKg = Math.round(weightValue * 0.453592 * 100) / 100;
        } else {
          weightInKg = Math.round(weightValue * 100) / 100;
        }
        updateData.weight_kg = weightInKg;
      }

      // Update profile
      const {
        error: profileError
      } = await supabase.from('profiles').update(updateData).eq('user_id', user.id);
      if (profileError) throw profileError;

      // Create or update weight entry if weight was updated
      if (weightInKg) {
        const selectedDate = editData.date.toISOString().split('T')[0]; // Selected date in YYYY-MM-DD format
        
        // First, delete any existing entries for the selected date
        const { error: deleteError } = await supabase
          .from('weight_entries')
          .delete()
          .eq('user_id', user.id)
          .eq('recorded_date', selectedDate);
        
        if (deleteError) throw deleteError;
        
        // Then insert the new entry
        const { error: entryError } = await supabase
          .from('weight_entries')
          .insert({
            user_id: user.id,
            weight_kg: weightInKg,
            recorded_date: selectedDate
          });
        if (entryError) throw entryError;
      }

      // Refetch profile data
      await fetchProfile();
      
      toast({
        title: "Weight Updated",
        description: "Your weight has been updated and recorded successfully."
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update weight.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateActivityLevel = async (activityLevel: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ activity_level: activityLevel })
        .eq('user_id', user.id);
      
      if (error) throw error;

      // Update local profile state
      setProfile(prev => prev ? { ...prev, activity_level: activityLevel } : null);
      
      toast({
        title: "Activity Level Updated",
        description: "Your activity level has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update activity level.",
        variant: "destructive"
      });
    }
  };
  const handleSignOut = async () => {
    await signOut();
  };

  // Show loading if still checking auth
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>;
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!user) {
    return null;
  }
  const todayStats: any[] = [];
  const weeklyProgress: any[] = [];
  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {greeting}, {firstName}! 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            You're doing amazing! Let's keep building healthy habits.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Weight Tracking */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Scale className="w-6 h-6 text-accent" />
                <span>Weight Tracking</span>
              </h2>
              
              <WeightTracker 
                profile={profile} 
                onProfileUpdate={fetchProfile}
              />
            </section>

            {/* Personalized Health Plan */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Heart className="w-6 h-6 text-secondary" />
                <span>Personalized Health Plan</span>
              </h2>
              
              <PersonalizedHealthPlan />
            </section>

            {/* Sleep Tracking */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Moon className="w-6 h-6 text-accent" />
                <span>Sleep Tracking</span>
              </h2>
              
              <SleepTracker userId={user.id} />
            </section>

            {/* Today's Progress */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <CalendarIcon2 className="w-6 h-6 text-primary" />
                <span>Today's Progress</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {todayStats.length === 0 ? <Card className="rounded-2xl border-2">
                    <CardContent className="p-8 text-center">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Data Yet</h3>
                      <p className="text-sm text-muted-foreground">Start tracking your activities to see progress here.</p>
                    </CardContent>
                  </Card> : todayStats.map((stat, index) => <Card key={index} className="rounded-2xl border-2 hover:shadow-bubble transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-foreground">
                              {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              of {stat.target}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{stat.label}</span>
                            <span className="text-muted-foreground">
                              {Math.round(stat.value / stat.target * 100)}%
                            </span>
                          </div>
                          <Progress value={stat.value / stat.target * 100} className="h-2 rounded-full" />
                        </div>
                      </CardContent>
                    </Card>)}
              </div>
            </section>

            {/* Weekly Overview */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-secondary" />
                <span>Weekly Overview</span>
              </h2>
              
              <Card className="rounded-2xl border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Habit Completion Rate</span>
                    <Badge variant="secondary" className="rounded-full">
                      This Week
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {weeklyProgress.length === 0 ? <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Weekly Data</h3>
                      <p className="text-sm text-muted-foreground">Complete some activities this week to see your progress.</p>
                    </div> : <div className="grid grid-cols-7 gap-4">
                      {weeklyProgress.map((day, index) => <div key={index} className="text-center space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">
                            {day.day}
                          </div>
                          <div className="relative">
                            <div className="w-12 h-32 bg-muted rounded-2xl mx-auto overflow-hidden">
                              <div className="w-full bg-gradient-primary rounded-2xl transition-all duration-500" style={{
                          height: `${day.completed}%`
                        }} />
                            </div>
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold">
                              {day.completed}%
                            </div>
                          </div>
                        </div>)}
                    </div>}
                </CardContent>
              </Card>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Health Information */}
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>Health Information</span>
              </h3>
              
              <Card className="rounded-2xl border-2">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="weight" className="text-sm font-medium">
                      Weight {editData.unitSystem === 'imperial' ? '(lbs)' : '(kg)'}
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={editData.weight}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setEditData(prev => ({ ...prev, weight: value }));
                        }
                      }}
                      className="rounded-xl border-2 text-base"
                      placeholder={editData.unitSystem === 'imperial' ? 'e.g., 154' : 'e.g., 70'}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal rounded-xl border-2"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editData.date ? format(editData.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50" align="start" side="bottom" sideOffset={4}>
                        <Calendar
                          mode="single"
                          selected={editData.date}
                          onSelect={(date) => {
                            if (date) {
                              setEditData(prev => ({ ...prev, date }));
                            }
                          }}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Activity Level</Label>
                    <Select
                      value={profile?.activity_level || ''}
                      onValueChange={(value) => {
                        // Update the profile immediately
                        updateActivityLevel(value);
                      }}
                    >
                      <SelectTrigger className="rounded-xl border-2 text-base">
                        <SelectValue placeholder="Select your activity level" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                        <SelectItem value="light">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                        <SelectItem value="active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                        <SelectItem value="very_active">Extra Active (very hard exercise, physical job)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleSaveWeight} 
                    disabled={isSaving} 
                    className="w-full bg-gradient-primary hover:shadow-glow rounded-2xl py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
                  >
                    {isSaving ? "Updating..." : "Update Weight"}
                  </Button>
                </CardContent>
              </Card>
            </section>

            {/* Quick Actions */}
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-warning" />
                <span>Quick Actions</span>
              </h3>
              
              <div className="space-y-3">
                <Button onClick={() => navigate("/quiz")} variant="outline" className="w-full justify-start rounded-2xl py-3 border-2 hover:border-secondary hover:text-secondary transition-all duration-300 hover:scale-105">
                  <Target className="w-4 h-4 mr-2" />
                  Take Health Quiz
                </Button>
                
                <Button onClick={() => navigate("/chat")} variant="outline" className="w-full justify-start rounded-2xl py-3 border-2 hover:border-accent hover:text-accent transition-all duration-300 hover:scale-105">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with AI Coach
                </Button>
              </div>
            </section>

          </div>
        </div>

        {/* Sign Out Button - Fixed Bottom Right */}
        <div className="fixed bottom-6 right-6">
          
        </div>
      </div>
    </div>;
};
export default Dashboard;