import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Target, Calendar, TrendingUp, Award, Zap, Activity, MessageCircle, BarChart3, LogOut, Settings, User, Ruler, Scale } from "lucide-react";
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
    height: '',
    weight: '',
    biologicalSex: '' as 'male' | 'female' | '',
    unitSystem: 'metric' as 'metric' | 'imperial'
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

  // Fetch user profile
  useEffect(() => {
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
          // Set edit data for the dialog
          setEditData({
            height: data.height_cm ? String(data.height_cm) : '',
            weight: data.weight_kg ? String(data.weight_kg) : '',
            biologicalSex: data.biological_sex === 'male' || data.biological_sex === 'female' ? data.biological_sex : '',
            unitSystem: data.preferred_unit_system === 'imperial' ? 'imperial' : 'metric'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [user]);
  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updateData: any = {};

      // Convert and validate height
      if (editData.height) {
        const heightValue = parseFloat(editData.height);
        if (editData.unitSystem === 'imperial') {
          // Convert inches to cm
          updateData.height_cm = Math.round(heightValue * 2.54);
        } else {
          updateData.height_cm = Math.round(heightValue);
        }
      }

      // Convert and validate weight
      if (editData.weight) {
        const weightValue = parseFloat(editData.weight);
        if (editData.unitSystem === 'imperial') {
          // Convert lbs to kg
          updateData.weight_kg = Math.round(weightValue * 0.453592 * 100) / 100;
        } else {
          updateData.weight_kg = Math.round(weightValue * 100) / 100;
        }
      }
      if (editData.biologicalSex) {
        updateData.biological_sex = editData.biologicalSex;
      }
      updateData.preferred_unit_system = editData.unitSystem;
      const {
        error
      } = await supabase.from('profiles').update(updateData).eq('user_id', user.id);
      if (error) throw error;

      // Refetch profile data
      const {
        data
      } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (data) {
        setProfile(data);
      }
      setIsEditDialogOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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
  const achievements: any[] = [];
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

            {/* Today's Progress */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-primary" />
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

            {/* Achievements */}
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-warning" />
                <span>Recent Achievements</span>
              </h3>
              
              <Card className="rounded-2xl border-2">
                <CardContent className="p-4 space-y-4">
                  {achievements.length === 0 ? <div className="text-center py-6">
                      <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Achievements Yet</h3>
                      <p className="text-sm text-muted-foreground">Complete activities to unlock achievements.</p>
                    </div> : achievements.map((achievement, index) => <div key={index} className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${achievement.earned ? "bg-success/10 border border-success/20" : "bg-muted/50"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.earned ? "bg-success text-white" : "bg-muted"}`}>
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{achievement.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {achievement.description}
                          </div>
                        </div>
                        {achievement.earned && <div className="text-success animate-bounce-gentle">
                            <Heart className="w-4 h-4" fill="currentColor" />
                          </div>}
                      </div>)}
                </CardContent>
              </Card>
            </section>

            {/* AI Insight */}
            <section>
              <Card className="rounded-2xl border-2 bg-gradient-accent text-white">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold">AI Insight</div>
                      <div className="text-sm text-white/80">Personalized tip</div>
                    </div>
                  </div>
                  <p className="text-white/90 mb-4">
                    Complete some activities to get personalized insights and recommendations!
                  </p>
                  <Button onClick={() => navigate("/chat")} variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 rounded-xl">
                    Chat with AI
                  </Button>
                </CardContent>
              </Card>
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