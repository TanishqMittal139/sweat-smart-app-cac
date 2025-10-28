import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
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

  const resources = [
    { name: "About Us", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Health Tips", href: "/data" },
    { name: "Community", href: "#" },
    { name: "Blog", href: "#" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Disclaimer", href: "#" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
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
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
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

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>support@sweatsmart.com</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>1-800-SWEAT-SMART</span>
              </li>
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>123 Health Way, Wellness City, CA 94102</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} SweatSmart. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground text-center sm:text-right">
              Made with <Heart className="w-3 h-3 inline text-primary" /> for your health and wellness
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
