import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Navigation from "@/components/Navigation";

const motivationalQuotes = [
  "You are stronger than you think! 💪",
  "This too shall pass ✨",
  "You've got this! 🌟",
  "One step at a time 🚶‍♀️",
  "Breathe and believe 🌸",
  "You are enough 💕",
  "Tomorrow is a new day 🌅",
  "Progress, not perfection 🎯",
  "You are not alone 🤗",
  "Courage over comfort 🦋",
  "Your feelings are valid 💙",
  "This is temporary 🌈",
  "You can do hard things 🔥",
  "One moment at a time ⏰",
  "You are resilient 🌳",
  "Keep going, warrior! ⚔️",
  "Your mental health matters 🧠",
  "Small wins count too 🏆",
  "You are worthy of love 💖",
  "This feeling will pass 🌊",
  "You are brave 🦁",
  "Rest is productive too 😴",
  "You are making progress 📈",
  "It's okay to not be okay 🫂",
  "You have survived 100% of your worst days 💯",
  "Believe in yourself 🌺",
  "You matter 💝",
  "Take it one breath at a time 🌬️",
  "You are loved 💕",
  "This moment will pass 🕰️",
  "You're doing your best ⭐",
  "Every day is a fresh start 🌄",
  "You have inner strength 🔋",
  "Be gentle with yourself 🤲",
  "You are capable 🎪",
  "Trust the process 🌀",
  "You're exactly where you need to be 🧭",
  "Healing takes time ⏳",
  "You are precious 💎",
  "Keep moving forward 🚀",
  "You deserve happiness 😊",
  "Your story isn't over yet 📖",
  "You are valuable 🏆",
  "Take care of yourself 🌸",
  "You've overcome so much already 🏔️",
  "Your courage inspires others 🌟",
  "You are unique and special 🦄",
  "Everything will be okay 🌈",
  "You have so much to offer 🎁",
  "Your life has meaning 📍",
  "You are growing stronger 🌱",
  "Peace is possible 🕊️",
  "You deserve good things 🍀",
  "Your feelings matter 💭",
  "You are not broken 🔧",
  "Hope is always there 🕯️",
  "You shine bright ✨",
  "Your journey is unique 🛤️",
  "You are wonderfully made 🎨",
  "Tomorrow brings new possibilities 🌅",
  "You have the power to heal 🩹"
];

interface Quote {
  text: string;
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  shape: 'round' | 'square' | 'oval';
  sideMovement: number;
  animationDuration: number;
}

const colors = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--primary-glow))",
  "hsl(var(--bubble-1))",
  "hsl(var(--bubble-2))",
  "hsl(var(--bubble-3))"
];

const Emergency = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [nextId, setNextId] = useState(0);

  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };

  const getRandomPosition = () => {
    return {
      x: Math.random() * 80 + 10, // 10% to 90% of screen width
      y: Math.random() * 60 + 20, // 20% to 80% of screen height
    };
  };

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRandomSize = () => {
    return Math.random() * 20 + 12; // 12px to 32px
  };

  const getRandomShape = () => {
    const shapes: ('round' | 'square' | 'oval')[] = ['round', 'square', 'oval'];
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  const addQuotes = useCallback(() => {
    const numberOfQuotes = Math.floor(Math.random() * 6) + 10; // 10-15 quotes
    const newQuotes: Quote[] = [];
    
    for (let i = 0; i < numberOfQuotes; i++) {
      const newQuote: Quote = {
        text: getRandomQuote(),
        id: nextId + i,
        x: Math.random() * 80 + 10, // Random horizontal position
        y: 120, // Start below the viewport
        color: getRandomColor(),
        size: getRandomSize(),
        shape: getRandomShape(),
        sideMovement: (Math.random() - 0.5) * 40, // Side-to-side movement range
        animationDuration: Math.random() * 3 + 4, // 4-7 seconds animation
      };
      newQuotes.push(newQuote);
    }

    setQuotes(prev => [...prev, ...newQuotes]);
    setNextId(prev => prev + numberOfQuotes);

    // Remove quotes after animation completes
    newQuotes.forEach(quote => {
      setTimeout(() => {
        setQuotes(prev => prev.filter(q => q.id !== quote.id));
      }, quote.animationDuration * 1000);
    });
  }, [nextId]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
        {/* Motivational quotes */}
        {quotes.map((quote) => {
          const shapeClass = quote.shape === 'round' ? 'rounded-full' : 
                            quote.shape === 'square' ? 'rounded-lg' : 'rounded-[50%]';
          
          return (
            <div
              key={quote.id}
              className={`fixed pointer-events-none z-10 animate-fly-up animate-sway`}
              style={{
                left: `${quote.x}%`,
                bottom: '0px',
                color: quote.color,
                fontSize: `${quote.size}px`,
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                animationDuration: `${quote.animationDuration}s, ${quote.animationDuration * 0.8}s`,
                animationDelay: `0s, ${Math.random() * 0.5}s`,
                '--side-movement': `${quote.sideMovement}px`,
              } as React.CSSProperties & { '--side-movement': string }}
            >
              <div className={`animate-pulse-glow bg-white/20 backdrop-blur-sm ${shapeClass} px-4 py-2 border border-white/30 shadow-bubble whitespace-nowrap`}>
                {quote.text}
              </div>
            </div>
          );
        })}

        {/* Center button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={addQuotes}
            size="lg"
            className="bg-gradient-primary text-white hover:scale-110 transition-all duration-300 rounded-full w-32 h-32 text-lg font-bold shadow-bubble hover:shadow-glow animate-pulse-glow"
          >
            <div className="flex flex-col items-center">
              <AlertTriangle className="w-8 h-8 mb-2" fill="currentColor" />
              <span>Help Me!</span>
            </div>
          </Button>
        </div>

        {/* Floating background bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-gradient-to-br from-white/10 to-white/5 animate-bounce-gentle`}
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Emergency;