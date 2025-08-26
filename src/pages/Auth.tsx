import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, User, Mail, Lock, Scale, Ruler, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (action: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome to HealthyLife!",
        description: "Your account has been created successfully.",
      });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center animate-pulse-glow">
              <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-white">HealthyLife</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Your Health Journey</h1>
          <p className="text-white/80">Start transforming your life today</p>
        </div>

        <Card className="rounded-3xl border-2 shadow-float backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-center text-2xl font-bold">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-muted">
                <TabsTrigger value="signup" className="rounded-xl">Sign Up</TabsTrigger>
                <TabsTrigger value="signin" className="rounded-xl">Sign In</TabsTrigger>
              </TabsList>

              <TabsContent value="signup" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Full Name</span>
                    </Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your full name" 
                      className="rounded-xl border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      className="rounded-xl border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Password</span>
                    </Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Create a password" 
                      className="rounded-xl border-2 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Health Information */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4 text-center text-muted-foreground">
                    Optional Health Information (for personalized recommendations)
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height" className="flex items-center space-x-2">
                        <Ruler className="w-4 h-4" />
                        <span>Height</span>
                      </Label>
                      <Input 
                        id="height" 
                        placeholder="5'8&quot;" 
                        className="rounded-xl border-2 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight" className="flex items-center space-x-2">
                        <Scale className="w-4 h-4" />
                        <span>Weight</span>
                      </Label>
                      <Input 
                        id="weight" 
                        placeholder="150 lbs" 
                        className="rounded-xl border-2 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label className="flex items-center space-x-2">
                      <Activity className="w-4 h-4" />
                      <span>Activity Level</span>
                    </Label>
                    <Select>
                      <SelectTrigger className="rounded-xl border-2 focus:border-primary">
                        <SelectValue placeholder="Select your activity level" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                        <SelectItem value="light">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                        <SelectItem value="very">Very Active (hard exercise 6-7 days/week)</SelectItem>
                        <SelectItem value="extra">Extra Active (very hard exercise, physical job)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={() => handleAuth("signup")}
                  disabled={isLoading}
                  className="w-full bg-gradient-primary hover:shadow-glow rounded-2xl py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </TabsContent>

              <TabsContent value="signin" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input 
                      id="signin-email" 
                      type="email" 
                      placeholder="Enter your email" 
                      className="rounded-xl border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input 
                      id="signin-password" 
                      type="password" 
                      placeholder="Enter your password" 
                      className="rounded-xl border-2 focus:border-primary"
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleAuth("signin")}
                  disabled={isLoading}
                  className="w-full bg-gradient-primary hover:shadow-glow rounded-2xl py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="text-center mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;