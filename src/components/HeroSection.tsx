import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp, AlertTriangle, DollarSign, Heart, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const words = ["Health", "Fitness", "Confidence", "Wellness"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  
  const longestLen = Math.max(...words.map(w => w.length));
  const spanWidthCh = longestLen + 1;
  
  const impactfulStats = [
    {
      icon: AlertTriangle,
      value: "41.9%",
      label: "US Adults with Obesity",
      description: "An alarming national health crisis affecting over 100 million Americans",
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      icon: DollarSign,
      value: "$413B",
      label: "Annual Diabetes Cost",
      description: "Total estimated cost in 2022 - $306.6B direct medical costs + $106.3B productivity losses",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      icon: Heart,
      value: "38.4M",
      label: "Americans with Diabetes",
      description: "11.6% of the US population living with diagnosed diabetes",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Activity,
      value: "97.6M",
      label: "Adults Prediabetic",
      description: "32.8% of Americans at high risk of developing type 2 diabetes",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: TrendingUp,
      value: "58%",
      label: "Higher Diabetes Risk",
      description: "Adults with obesity face dramatically increased risk of type 2 diabetes",
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setCurrentWordIndex(prev => (prev + 1) % words.length);
      }, 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (!carouselApi) return;
    
    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [carouselApi]);
  return <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-bounce-gentle" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/20 rounded-full animate-bounce-gentle delay-500" />
      <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-accent/20 rounded-full animate-bounce-gentle delay-1000" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Obesity Crisis in America</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight text-center lg:text-left">
                Take Control of Your{" "}
                <span className="relative overflow-hidden" style={{
                minWidth: `${spanWidthCh}ch`,
                height: '1.2em',
                display: 'inline-block'
              }}>
                  <span key={currentWordIndex} className={`absolute left-0 top-0 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent transition-transform duration-1000 ${isAnimating ? "translate-y-full" : "translate-y-0"}`}>
                    {words[currentWordIndex]}
                  </span>
                  <span className={`absolute left-0 top-0 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent ${isAnimating ? "translate-y-0 transition-transform duration-1000" : "-translate-y-full"}`}>
                    {words[(currentWordIndex + 1) % words.length]}
                  </span>
                </span>{" "}
                Journey
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">With intelligent tracking and personalized insights, SweatSmart helps you stay consistent, build healthy habits, and achieve your wellness goals.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 py-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">41.9%</div>
                <div className="text-white/80 text-sm">US Adults Obese</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">97.6M</div>
                <div className="text-white/80 text-sm">Adults Prediabetic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">38.4M</div>
                <div className="text-white/80 text-sm">Americans w/ Diabetes</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={() => navigate(user ? "/dashboard" : "/auth")} className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 py-4 text-lg font-semibold shadow-float hover:shadow-glow transition-all duration-300 hover:scale-105">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button variant="outline" size="lg" onClick={() => navigate("/data")} className="border-2 border-white/30 bg-accent text-accent-foreground rounded-2xl px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <Play className="w-5 h-5 mr-2" />
                View The Data
              </Button>
            </div>

            {/* Social Proof */}
            
          </div>

          {/* Data Carousel */}
          <div className="relative">
            <Carousel 
              setApi={setCarouselApi}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {impactfulStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <CarouselItem key={index}>
                      <Card className="rounded-3xl border-2 border-white/20 bg-white/10 backdrop-blur-md shadow-float hover:shadow-glow transition-all duration-500">
                        <CardContent className="p-4 sm:p-8 space-y-4 sm:space-y-6 min-h-[320px] sm:min-h-[400px] flex flex-col justify-between">
                          <div className={`w-16 h-16 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                            <Icon className={`w-8 h-8 ${stat.color}`} />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-5xl md:text-6xl font-bold text-white">
                              {stat.value}
                            </div>
                            <div className="text-xl font-semibold text-white/90">
                              {stat.label}
                            </div>
                          </div>
                          
                          <p className="text-white/80 leading-relaxed text-base">
                            {stat.description}
                          </p>
                          
                          <div className="flex items-center space-x-2 pt-2">
                            <div className="flex space-x-1">
                              {impactfulStats.map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    i === index ? 'w-8 bg-white' : 'w-1.5 bg-white/40'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;