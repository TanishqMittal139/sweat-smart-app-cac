import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Chatbot = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-semibold">Chat with SweatSmart AI</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <iframe
        src="https://api.chattermate.chat/api/v1/widgets/ce1cbda9-598a-4059-b342-b45aafc1e1d6/data"
        className="w-full h-[calc(100vh-73px)] border-0"
        allow="clipboard-write"
        title="ChatterMate AI Chatbot"
      />
    </div>
  );
};

export default Chatbot;
