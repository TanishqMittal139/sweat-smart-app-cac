import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Target, 
  Calendar, 
  TrendingUp, 
  Award, 
  Zap, 
  Moon, 
  Droplets,
  Activity,
  Plus,
  MessageCircle,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon"; 
    return "Good Evening";
  });

  const todayStats = [
    { 
      label: "Steps", 
      value: 7834, 
      target: 10000, 
      icon: Activity, 
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    { 
      label: "Water", 
      value: 6, 
      target: 8, 
      icon: Droplets, 
      color: "text-accent",
      bgColor: "bg-accent/10",
      unit: "glasses"
    },
    { 
      label: "Sleep", 
      value: 7.5, 
      target: 8, 
      icon: Moon, 
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      unit: "hours"
    },
  ];

  const weeklyProgress = [
    { day: "Mon", completed: 85 },
    { day: "Tue", completed: 92 },
    { day: "Wed", completed: 78 },
    { day: "Thu", completed: 96 },
    { day: "Fri", completed: 88 },
    { day: "Sat", completed: 94 },
    { day: "Sun", completed: 82 },
  ];

  const achievements = [
    { title: "7-Day Streak", description: "Logged habits for 7 days", earned: true },
    { title: "Water Champion", description: "Hit water goal 5 days", earned: true },
    { title: "Early Bird", description: "Wake up before 7 AM", earned: false },
    { title: "Step Master", description: "10K steps in a day", earned: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {greeting}, Sarah! 👋
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {todayStats.map((stat, index) => (
                  <Card key={index} className="rounded-2xl border-2 hover:shadow-bubble transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">
                            {stat.value}{stat.unit && <span className="text-sm"> {stat.unit}</span>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            of {stat.target}{stat.unit && ` ${stat.unit}`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{stat.label}</span>
                          <span className="text-muted-foreground">
                            {Math.round((stat.value / stat.target) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(stat.value / stat.target) * 100} 
                          className="h-2 rounded-full"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                  <div className="grid grid-cols-7 gap-4">
                    {weeklyProgress.map((day, index) => (
                      <div key={index} className="text-center space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          {day.day}
                        </div>
                        <div className="relative">
                          <div className="w-12 h-32 bg-muted rounded-2xl mx-auto overflow-hidden">
                            <div 
                              className="w-full bg-gradient-primary rounded-2xl transition-all duration-500"
                              style={{ height: `${day.completed}%` }}
                            />
                          </div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold">
                            {day.completed}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                <Button 
                  onClick={() => navigate("/habits")}
                  className="w-full justify-start bg-gradient-primary hover:shadow-glow rounded-2xl py-3 transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log New Habit
                </Button>
                
                <Button 
                  onClick={() => navigate("/quiz")}
                  variant="outline"
                  className="w-full justify-start rounded-2xl py-3 border-2 hover:border-secondary hover:text-secondary transition-all duration-300 hover:scale-105"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Take Health Quiz
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full justify-start rounded-2xl py-3 border-2 hover:border-accent hover:text-accent transition-all duration-300 hover:scale-105"
                >
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
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                        achievement.earned 
                          ? "bg-success/10 border border-success/20" 
                          : "bg-muted/50"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        achievement.earned ? "bg-success text-white" : "bg-muted"
                      }`}>
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {achievement.description}
                        </div>
                      </div>
                      {achievement.earned && (
                        <div className="text-success animate-bounce-gentle">
                          <Heart className="w-4 h-4" fill="currentColor" />
                        </div>
                      )}
                    </div>
                  ))}
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
                    You're most consistent with habits in the morning. Try scheduling your water intake 
                    goals earlier in the day for better success!
                  </p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10 rounded-xl"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;