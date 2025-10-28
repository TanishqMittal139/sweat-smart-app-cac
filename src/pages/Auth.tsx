import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Heart, User, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
const Auth = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    signUp,
    signIn,
    user,
    loading
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);
  const handleSignUp = async () => {
    if (!signUpData.fullName || !signUpData.email || !signUpData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);

    const {
      error
    } = await signUp(signUpData.email, signUpData.password, signUpData.fullName);
    setIsLoading(false);
    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome to SweatSmart!",
        description: "Please check your email to verify your account."
      });
    }
  };
  const handleSignIn = async () => {
    if (!signInData.email || !signInData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter your email and password.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    const {
      error
    } = await signIn(signInData.email, signInData.password);
    setIsLoading(false);
    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive"
      });
    }
  };
  return <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center animate-pulse-glow">
              <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-white">SweatSmart</span>
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
                    <Input id="name" placeholder="Enter your full name" value={signUpData.fullName} onChange={e => setSignUpData(prev => ({
                    ...prev,
                    fullName: e.target.value
                  }))} className="rounded-xl border-2 focus:border-primary" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </Label>
                    <Input id="email" type="email" placeholder="Enter your email" value={signUpData.email} onChange={e => setSignUpData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))} className="rounded-xl border-2 focus:border-primary" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Password</span>
                    </Label>
                    <Input id="password" type="password" placeholder="Create a password" value={signUpData.password} onChange={e => setSignUpData(prev => ({
                    ...prev,
                    password: e.target.value
                  }))} className="rounded-xl border-2 focus:border-primary" />
                  </div>
                </div>


                <Button onClick={handleSignUp} disabled={isLoading} className="w-full bg-gradient-primary hover:shadow-glow rounded-2xl py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </TabsContent>

              <TabsContent value="signin" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input id="signin-email" type="email" placeholder="Enter your email" value={signInData.email} onChange={e => setSignInData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))} className="rounded-xl border-2 focus:border-primary" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input id="signin-password" type="password" placeholder="Enter your password" value={signInData.password} onChange={e => setSignInData(prev => ({
                    ...prev,
                    password: e.target.value
                  }))} className="rounded-xl border-2 focus:border-primary" />
                  </div>
                </div>

                <Button onClick={handleSignIn} disabled={isLoading} className="w-full bg-gradient-primary hover:shadow-glow rounded-2xl py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </TabsContent>
            </Tabs>

            
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl">
            ← Back to Home
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>;
};
export default Auth;