import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
        
        {/* Embedded Chatbot Widget */}
        <div className="fixed bottom-5 right-5 w-[350px] h-[500px] rounded-xl overflow-hidden z-[9999] shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
          <iframe
            src="https://nextjs-ai-chatbot-git-main-tanishqmittal139s-projects.vercel.app/"
            className="w-full h-full border-0"
            title="AI Chatbot"
          />
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
