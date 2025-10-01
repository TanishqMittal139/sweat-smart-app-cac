import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FloatingChatButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate("/chatbot")}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
      size="icon"
      aria-label="Open chat"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};

export default FloatingChatButton;
