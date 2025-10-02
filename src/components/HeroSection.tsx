import { Button } from "@/components/ui/button";
import { ArrowRight, Play, TrendingUp, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/health-hero.jpg";
import { useState, useEffect } from "react";
const HeroSection = () => {
  const navigate = useNavigate();
  const words = ["Health", "Fitness", "Confidence", "Wellness"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const longestLen = Math.max(...words.map((w) => w.length));
  const spanWidthCh = longestLen + 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        // End animation before switching the word to avoid "next-next" sliding
        setIsAnimating(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
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
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Take Control of Your
                <br />
                <span className="block relative overflow-hidden flex items-center" style={{ width: `${spanWidthCh}ch`, height: '1.2em' }}>
                  <span
                    key={currentWordIndex}
                    className={`absolute inset-0 flex items-center bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent transition-transform duration-1000 ${
                      isAnimating ? "translate-y-full" : "translate-y-0"
                    }`}
                  >
                    {words[currentWordIndex]}
                  </span>
                  <span
                    className={`absolute inset-0 flex items-center bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent ${
                      isAnimating ? "translate-y-0 transition-transform duration-1000" : "-translate-y-full"
                    }`}
                  >
                    {words[(currentWordIndex + 1) % words.length]}
                  </span>
                </span>{" "}
                Journey
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
                Join thousands transforming their lives through AI-powered guidance, 
                habit tracking, and community support. Your healthiest self awaits!
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
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
              <Button size="lg" onClick={() => navigate("/auth")} className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 py-4 text-lg font-semibold shadow-float hover:shadow-glow transition-all duration-300 hover:scale-105">
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

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-float bg-white/10 backdrop-blur-sm p-6">
              <img src={heroImage} alt="Healthy lifestyle illustration with fruits, exercise, and wellness elements" className="w-full h-auto rounded-2xl shadow-lg" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-bubble animate-bounce-gentle">
              <div className="flex items-center space-x-2">
                <Zap className="w-6 h-6 text-warning" />
                <div>
                  <div className="font-bold text-sm">85% Success Rate</div>
                  <div className="text-xs text-muted-foreground">Goal Achievement</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-bubble animate-bounce-gentle delay-700">
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-info" />
                <div>
                  <div className="font-bold text-sm">Community</div>
                  <div className="text-xs text-muted-foreground">Support & Tips</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;