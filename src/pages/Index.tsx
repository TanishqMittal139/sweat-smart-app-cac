import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain, Target, TrendingUp, Users, Shield, Sparkles, ArrowRight, AlertTriangle, Activity, MapPin, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
const Index = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const features = [{
    icon: Brain,
    title: "AI Health Coach",
    description: "Personalized guidance trained on hundreds of research papers",
    color: "text-primary",
    bgColor: "bg-primary/10"
  }, {
    icon: Target,
    title: "Smart Habit Tracking",
    description: "Track weight and sleep activity with actionable insights",
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  }, {
    icon: Sparkles,
    title: "Interactive Quizzes",
    description: "Learn through gamified health challenges and earn points",
    color: "text-accent",
    bgColor: "bg-accent/10"
  }, {
    icon: TrendingUp,
    title: "Data Visualization",
    description: "Understand obesity trends and health disparities",
    color: "text-warning",
    bgColor: "bg-warning/10"
  }, {
    icon: MapPin,
    title: "Food Finder",
    description: "Discover healthy food options near you with our interactive map",
    color: "text-primary",
    bgColor: "bg-primary/10"
  }, {
    icon: Zap,
    title: "Emergency Motivation",
    description: "Get instant encouragement and support when you need it most",
    color: "text-accent",
    bgColor: "bg-accent/10"
  }];
  const healthStats = [{
    stat: "41.9%",
    label: "of US adults are obese",
    trend: "↑ Rising",
    severity: "high"
  }, {
    stat: "97.6M",
    label: "adults have prediabetes",
    trend: "↑ Critical",
    severity: "critical"
  }, {
    stat: "$413B",
    label: "annual diabetes costs",
    trend: "↑ Growing",
    severity: "high"
  }, {
    stat: "38.4M",
    label: "Americans with diabetes",
    trend: "⚠ Impact",
    severity: "critical"
  }];
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Health Crisis Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              The Obesity Epidemic in America
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Understanding the scope of America's health crisis is the first step toward meaningful change.
              These statistics drive our mission to help you take control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {healthStats.map((item, index) => <Card key={index} className="rounded-2xl border-2 hover:shadow-bubble transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center min-h-[180px] flex flex-col justify-center">
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {item.stat}
                  </div>
                  <div className="text-muted-foreground">{item.label}</div>
                </CardContent>
              </Card>)}
          </div>

          <div className="text-center">
            <Button size="lg" onClick={() => navigate("/data")} className="rounded-2xl px-8 py-4 bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105">
              Explore Full Data Analysis
              <TrendingUp className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Your Complete Health Companion
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to build lasting healthy habits, powered by AI and backed by science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <Card key={index} className="rounded-2xl border-2 hover:shadow-bubble transition-all duration-300 hover:scale-105 group">
                <CardHeader className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:animate-bounce-gentle`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>

          <div className="text-center mt-16">
            <Button size="lg" onClick={() => navigate("/dashboard")} className="rounded-2xl px-8 py-4 bg-gradient-secondary hover:shadow-glow transition-all duration-300 hover:scale-105">
              Try the Dashboard
              <Activity className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section - Only show when user is not signed in */}
      {!user}
      
      <Footer />
    </div>;
};
export default Index;