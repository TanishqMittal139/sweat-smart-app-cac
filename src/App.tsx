import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Games from "./pages/Games";
import DataVisualization from "./pages/DataVisualization";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Emergency from "./pages/Emergency";
import FoodFinder from "./pages/FoodFinder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/games" element={<Games />} />
            <Route path="/data" element={<DataVisualization />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/food-finder" element={<FoodFinder />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        
        {/* Floating AI Chatbot Button */}
        <Button
          onClick={() => window.open('https://nextjs-ai-chatbot-git-main-tanishqmittal139s-projects.vercel.app/', '_blank')}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-[9999] bg-primary hover:bg-primary/90"
          aria-label="Open AI Chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
