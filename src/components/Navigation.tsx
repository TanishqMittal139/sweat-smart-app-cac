import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, Activity, Target, TrendingUp, User, Bot, Gamepad2, AlertTriangle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Activity },
    { name: "Games", href: "/games", icon: Gamepad2 },
    { name: "Data", href: "/data", icon: TrendingUp },
    { name: "Chat", href: "/chat", icon: Bot },
    { name: "Food Finder", href: "/food-finder", icon: MapPin },
    { name: "Emergency", href: "/emergency", icon: AlertTriangle },
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center animate-pulse-glow">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SweatSmart
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
            {user ? (
              <Button
                variant="ghost"
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2 text-foreground hover:text-foreground hover:bg-muted rounded-xl"
              >
                <User className="w-4 h-4" />
                <span className="font-medium">
                  {user.user_metadata?.full_name?.split(' ')[0] || user.user_metadata?.first_name || user.email?.split('@')[0]}
                </span>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/auth")}
                className="rounded-xl border-2 hover:bg-muted/50 hover:border-muted-foreground/50 hover:text-current transition-all duration-200"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-xl"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute left-0 right-0 top-16 bg-card/95 backdrop-blur-lg border-b border-border shadow-bubble rounded-b-2xl">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-all duration-200 w-full text-left py-2 px-3 rounded-xl hover:bg-muted"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
              {user ? (
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 text-foreground hover:text-foreground py-2 px-3 rounded-xl hover:bg-muted w-full text-left"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">
                    {user.user_metadata?.full_name?.split(' ')[0] || user.user_metadata?.first_name || user.email?.split('@')[0]}
                  </span>
                </button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigate("/auth");
                    setIsOpen(false);
                  }}
                  className="w-full rounded-xl border-2 hover:bg-muted/50 hover:border-muted-foreground/50 hover:text-current transition-all duration-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;