import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Target, 
  Calendar, 
  TrendingUp, 
  CheckCircle2,
  Scale,
  Moon,
  Droplets,
  Activity,
  Apple,
  Clock,
  Edit3,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: number;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  target: number;
  current: number;
  unit: string;
  category: string;
}

const Habits = () => {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      name: "Daily Steps",
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
      target: 10000,
      current: 7834,
      unit: "steps",
      category: "Exercise"
    },
    {
      id: 2,
      name: "Water Intake",
      icon: Droplets,
      color: "text-accent",
      bgColor: "bg-accent/10", 
      target: 8,
      current: 6,
      unit: "glasses",
      category: "Hydration"
    },
    {
      id: 3,
      name: "Sleep Hours",
      icon: Moon,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      target: 8,
      current: 7.5,
      unit: "hours",
      category: "Rest"
    },
    {
      id: 4,
      name: "Weight Check",
      icon: Scale,
      color: "text-warning",
      bgColor: "bg-warning/10",
      target: 1,
      current: 0,
      unit: "times",
      category: "Tracking"
    }
  ]);

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    target: "",
    unit: "",
    category: "Health"
  });

  const habitIcons = [
    { icon: Activity, name: "Activity", color: "text-primary", bgColor: "bg-primary/10" },
    { icon: Droplets, name: "Water", color: "text-accent", bgColor: "bg-accent/10" },
    { icon: Moon, name: "Sleep", color: "text-secondary", bgColor: "bg-secondary/10" },
    { icon: Scale, name: "Weight", color: "text-warning", bgColor: "bg-warning/10" },
    { icon: Apple, name: "Nutrition", color: "text-success", bgColor: "bg-success/10" },
    { icon: Clock, name: "Time", color: "text-info", bgColor: "bg-info/10" }
  ];

  const updateHabit = (habitId: number, newCurrent: number) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, current: Math.max(0, newCurrent) }
        : habit
    ));
    
    const habit = habits.find(h => h.id === habitId);
    if (habit && newCurrent >= habit.target) {
      toast({
        title: "Goal Achieved! 🎉",
        description: `Great job completing your ${habit.name} goal!`,
      });
    }
  };

  const addHabit = () => {
    if (!newHabit.name || !newHabit.target) return;

    const selectedIcon = habitIcons[Math.floor(Math.random() * habitIcons.length)];
    const habit: Habit = {
      id: Date.now(),
      name: newHabit.name,
      icon: selectedIcon.icon,
      color: selectedIcon.color,
      bgColor: selectedIcon.bgColor,
      target: parseFloat(newHabit.target),
      current: 0,
      unit: newHabit.unit || "times",
      category: newHabit.category
    };

    setHabits([...habits, habit]);
    setNewHabit({ name: "", target: "", unit: "", category: "Health" });
    setShowAddHabit(false);
    
    toast({
      title: "New Habit Added! ✨",
      description: `Started tracking ${habit.name}. Let's build this healthy habit together!`,
    });
  };

  const deleteHabit = (habitId: number) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
    toast({
      title: "Habit Removed",
      description: "The habit has been removed from your tracker.",
    });
  };

  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Daily Habit Tracker
          </h1>
          <p className="text-xl text-muted-foreground">
            {todayDate} - Track your healthy habits and build consistency
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-2xl border-2">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {habits.filter(h => h.current >= h.target).length}
              </div>
              <div className="text-muted-foreground">Goals Completed Today</div>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border-2">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                {habits.length}
              </div>
              <div className="text-muted-foreground">Active Habits</div>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border-2">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {Math.round((habits.filter(h => h.current >= h.target).length / habits.length) * 100) || 0}%
              </div>
              <div className="text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Habit */}
        {showAddHabit && (
          <Card className="rounded-2xl border-2 mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-6 h-6 text-primary" />
                <span>Add New Habit</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="habit-name">Habit Name</Label>
                  <Input
                    id="habit-name"
                    placeholder="e.g., Drink Water"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    className="rounded-xl border-2 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="habit-target">Daily Target</Label>
                  <Input
                    id="habit-target"
                    placeholder="e.g., 8"
                    type="number"
                    value={newHabit.target}
                    onChange={(e) => setNewHabit({ ...newHabit, target: e.target.value })}
                    className="rounded-xl border-2 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="habit-unit">Unit</Label>
                  <Input
                    id="habit-unit"
                    placeholder="e.g., glasses, minutes, times"
                    value={newHabit.unit}
                    onChange={(e) => setNewHabit({ ...newHabit, unit: e.target.value })}
                    className="rounded-xl border-2 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="habit-category">Category</Label>
                  <Input
                    id="habit-category"
                    placeholder="e.g., Health, Fitness, Wellness"
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                    className="rounded-xl border-2 focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={addHabit}
                  className="bg-gradient-primary hover:shadow-glow rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Add Habit
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowAddHabit(false)}
                  className="rounded-2xl border-2"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Habits Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <Target className="w-6 h-6 text-primary" />
              <span>Today's Habits</span>
            </h2>
            
            {!showAddHabit && (
              <Button 
                onClick={() => setShowAddHabit(true)}
                className="bg-gradient-secondary hover:shadow-glow rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {habits.map((habit) => {
              const progress = Math.min((habit.current / habit.target) * 100, 100);
              const isCompleted = habit.current >= habit.target;
              
              return (
                <Card 
                  key={habit.id} 
                  className={`rounded-2xl border-2 transition-all duration-300 hover:shadow-bubble hover:scale-105 ${
                    isCompleted ? "ring-2 ring-success/50 bg-success/5" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-2xl ${habit.bgColor} flex items-center justify-center ${
                          isCompleted ? "animate-bounce-gentle" : ""
                        }`}>
                          <habit.icon className={`w-6 h-6 ${habit.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{habit.name}</h3>
                          <Badge variant="secondary" className="rounded-full text-xs">
                            {habit.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 rounded-lg hover:bg-muted"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHabit(habit.id)}
                          className="w-8 h-8 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {habit.current}
                          <span className="text-sm text-muted-foreground ml-1">
                            / {habit.target} {habit.unit}
                          </span>
                        </span>
                        {isCompleted && (
                          <div className="flex items-center space-x-1 text-success">
                            <CheckCircle2 className="w-5 h-5 fill-current" />
                            <span className="text-sm font-medium">Complete!</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Progress</span>
                          <span className="text-muted-foreground">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted 
                                ? "bg-gradient-to-r from-success to-success/80" 
                                : "bg-gradient-primary"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateHabit(habit.id, habit.current - 1)}
                          disabled={habit.current <= 0}
                          className="rounded-xl"
                        >
                          -
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateHabit(habit.id, habit.current + 1)}
                          className="flex-1 rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary"
                        >
                          Log Progress
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateHabit(habit.id, habit.current + 1)}
                          className="rounded-xl"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* AI Suggestions */}
        <Card className="rounded-2xl border-2 bg-gradient-accent text-white mt-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold">AI Habit Coach</div>
                <div className="text-sm text-white/80">Personalized recommendations</div>
              </div>
            </div>
            <p className="text-white/90 mb-4">
              You're crushing your water intake goals! Consider adding a "mindful eating" habit 
              to complement your hydration success. Small wins lead to big transformations.
            </p>
            <Button 
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10 rounded-xl"
            >
              Get More Tips
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Habits;