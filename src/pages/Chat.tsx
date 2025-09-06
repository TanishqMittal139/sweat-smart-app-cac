import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const DEFAULT_MESSAGE: Message = {
  id: "1",
  content: "Hello! I'm your health assistant. I can help you with questions about nutrition, fitness, wellness, and healthy lifestyle choices. What would you like to discuss today?",
  sender: "ai",
  timestamp: new Date(),
};

const STORAGE_KEY = "health-chat-messages";

const Chat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([DEFAULT_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  }, [messages]);

  const clearChat = () => {
    setMessages([DEFAULT_MESSAGE]);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "Chat cleared",
      description: "Your conversation has been reset.",
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Get conversation context (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content
      }));

      // Add current message
      conversationHistory.push({
        role: "user",
        content: currentInput
      });

      const { data, error } = await supabase.functions.invoke('chat-health-ai', {
        body: { messages: conversationHistory }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      if (data?.error) {
        console.error('AI function error:', data.error);
        throw new Error(data.error);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try asking your question again in a moment.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-4rem)]">
        <div className="bg-card/80 backdrop-blur-lg rounded-3xl shadow-bubble border border-border h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center animate-pulse-glow">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Health Assistant</h1>
                  <p className="text-sm text-muted-foreground">Your AI companion for health and wellness</p>
                </div>
              </div>
              <Button
                onClick={clearChat}
                variant="ghost"
                size="icon"
                className="rounded-2xl hover:bg-muted"
                title="Clear chat"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    message.sender === "user" 
                      ? "bg-primary" 
                      : "bg-gradient-primary animate-pulse-glow"
                  }`}>
                    {message.sender === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[80%] ${
                    message.sender === "user" ? "text-right" : ""
                  }`}>
                    <div className={`rounded-2xl p-4 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-2xl flex items-center justify-center animate-pulse-glow">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 border-t border-border">
            <div className="flex space-x-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about nutrition, fitness, wellness..."
                className="flex-1 rounded-2xl border-2 focus:border-primary transition-all duration-200"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="rounded-2xl px-6 bg-gradient-primary hover:opacity-90 transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI responses are for informational purposes only. Consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;