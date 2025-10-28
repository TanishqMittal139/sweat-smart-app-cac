import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Games", href: "/games" },
    { name: "Data Insights", href: "/data" },
    { name: "AI Chat", href: "/chat" },
    { name: "Food Finder", href: "/food-finder" },
  ];

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="SweatSmart Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SweatSmart
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4 max-w-sm">
              Your comprehensive health and wellness companion. Track your fitness, manage your nutrition, 
              and achieve your health goals with personalized insights and AI-powered guidance.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-primary" />
              <span>Empowering healthier lives since 2024</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
