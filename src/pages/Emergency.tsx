import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Heart, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";

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
  "You have the power to heal 🩹",
  "Stars can't shine without darkness 🌟",
  "You are a work in progress and that's beautiful 🎨",
  "Fall seven times, stand up eight 🥋",
  "Your potential is limitless 🚀",
  "Every setback is a setup for a comeback 💪",
  "You are the author of your story 📝",
  "Difficult roads lead to beautiful destinations 🛣️",
  "Your best days are ahead of you 🌅",
  "You are braver than you believe 🦁",
  "Embrace the journey, trust the process 🌀",
  "You are creating your own sunshine ☀️",
  "Growth happens outside your comfort zone 🌱",
  "You are meant for great things 🌟",
  "Keep your face toward the sunshine 🌻",
  "You are unstoppable 🔥",
  "Today is your day to shine ✨",
  "You inspire others more than you know 💫",
  "Your mindset is everything 🧠",
  "You are capable of amazing things 🎯",
  "Never give up on yourself 💪",
  "You have everything you need within you 💎",
  "Rise above the storm and you will find sunshine 🌈",
  "You are a champion 🏆",
  "Believe in the magic within you ✨",
  "You are destined for greatness 🌟",
  "Keep pushing forward 🚀",
  "You are a warrior, not a worrier ⚔️",
  "Your comeback will be stronger than your setback 💪",
  "You light up the world 🌍",
  "You are making a difference 🌟",
  "Stay positive, work hard, make it happen 💫"
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
  const [userInput, setUserInput] = useState("");
  const [questionType, setQuestionType] = useState<"feeling" | "boxer" | "general">("general");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [showInput, setShowInput] = useState(false);

  const personalizedResponses = {
    sad: [
      "Even the darkest night will end and the sun will rise 🌅",
      "Your sadness is valid, but it doesn't define you 💙",
      "Every storm runs out of rain eventually 🌈",
      "You're allowed to feel sad, but don't forget you're also allowed to heal ✨"
    ],
    anxious: [
      "Anxiety is temporary, but your strength is permanent 💪",
      "You've survived every anxious moment so far - you'll survive this one too 🌟",
      "Breathe in courage, breathe out fear 🌬️",
      "Your anxiety doesn't control you - you control your response to it 🧠"
    ],
    tired: [
      "Rest when you need to, but don't quit when you're tired 😴",
      "Even Superman needed to recharge sometimes ⚡",
      "Your body is asking for rest, not giving up 🛌",
      "Sometimes the most productive thing you can do is rest 🌙"
    ],
    motivated: [
      "That's the spirit! Channel that energy into action! 🔥",
      "Your motivation is contagious - keep spreading it! ✨",
      "Strike while the iron is hot - you've got this! ⚡",
      "Motivation gets you started, but habit keeps you going! 🚀"
    ],
    stressed: [
      "Stress is temporary, but your resilience is permanent 🌟",
      "You've handled stress before - you can handle it again 💪",
      "Take it one breath at a time 🌬️",
      "Stress is your body's way of saying you care - channel that energy positively ⚡"
    ]
  };

  const boxerQuestions = [
    "What's your favorite boxer?",
    "Who's your fitness inspiration?",
    "Which athlete motivates you most?",
    "Who's your sports hero?"
  ];

  const generateBoxerResponse = (boxer: string) => {
    const responses = [
      `If ${boxer} didn't quit, then why are you? 🥊`,
      `${boxer} trained when nobody was watching - what's your excuse? 💪`,
      `${boxer} faced their fears in the ring - time to face yours! 🔥`,
      `${boxer} got knocked down and got back up - just like you can! ⚡`,
      `Channel your inner ${boxer} - champions don't quit! 🏆`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generatePersonalizedQuote = (input: string, type: string) => {
    if (type === "boxer") {
      return generateBoxerResponse(input);
    }

    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes("sad") || lowercaseInput.includes("depressed") || lowercaseInput.includes("down")) {
      return personalizedResponses.sad[Math.floor(Math.random() * personalizedResponses.sad.length)];
    }
    if (lowercaseInput.includes("anxious") || lowercaseInput.includes("worry") || lowercaseInput.includes("nervous")) {
      return personalizedResponses.anxious[Math.floor(Math.random() * personalizedResponses.anxious.length)];
    }
    if (lowercaseInput.includes("tired") || lowercaseInput.includes("exhausted") || lowercaseInput.includes("drained")) {
      return personalizedResponses.tired[Math.floor(Math.random() * personalizedResponses.tired.length)];
    }
    if (lowercaseInput.includes("motivated") || lowercaseInput.includes("excited") || lowercaseInput.includes("pumped")) {
      return personalizedResponses.motivated[Math.floor(Math.random() * personalizedResponses.motivated.length)];
    }
    if (lowercaseInput.includes("stressed") || lowercaseInput.includes("overwhelmed") || lowercaseInput.includes("pressure")) {
      return personalizedResponses.stressed[Math.floor(Math.random() * personalizedResponses.stressed.length)];
    }

    // Default motivational response
    return getRandomQuote();
  };

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

  const getConsistentSize = () => {
    return 28; // Consistent larger size for all quotes
  };

  const getRandomShape = () => {
    const shapes: ('round' | 'square' | 'oval')[] = ['round', 'square', 'oval'];
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  const addQuotes = useCallback(() => {
    const numberOfQuotes = Math.floor(Math.random() * 2) + 5; // 5-6 quotes
    const basePositions = [15, 30, 45, 60, 75]; // Evenly spaced horizontal positions
    
    for (let i = 0; i < numberOfQuotes; i++) {
      setTimeout(() => {
        // Use evenly spaced positions to prevent overlap
        const xPosition = basePositions[i % basePositions.length] + (Math.random() * 5 - 2.5);
        
        const newQuote: Quote = {
          text: getRandomQuote(),
          id: nextId + i,
          x: xPosition,
          y: 110, // Start below the viewport
          color: getRandomColor(),
          size: getConsistentSize(),
          shape: getRandomShape(),
          sideMovement: (Math.random() - 0.5) * 20, // Slight side-to-side movement
          animationDuration: Math.random() * 2 + 7, // 7-9 seconds animation
        };

        setQuotes(prev => [...prev, newQuote]);

        // Remove quote after animation completes
        setTimeout(() => {
          setQuotes(prev => prev.filter(q => q.id !== newQuote.id));
        }, newQuote.animationDuration * 1000);
      }, i * 100); // Short stagger (100ms) so all appear together quickly
    }
    
    setNextId(prev => prev + numberOfQuotes);
    toast("🌟 Motivation incoming! You've got this!");
  }, [nextId]);

  const addPersonalizedQuote = useCallback((customQuote: string) => {
    const newQuote: Quote = {
      text: customQuote,
      id: nextId,
      x: 40 + Math.random() * 20, // Center area with some variation
      y: 110,
      color: getRandomColor(),
      size: getConsistentSize(), // Same consistent size
      shape: getRandomShape(),
      sideMovement: (Math.random() - 0.5) * 20,
      animationDuration: Math.random() * 2 + 7,
    };

    setQuotes(prev => [...prev, newQuote]);

    setTimeout(() => {
      setQuotes(prev => prev.filter(q => q.id !== newQuote.id));
    }, newQuote.animationDuration * 1000);

    setNextId(prev => prev + 1);
  }, [nextId]);

  const handlePersonalizedInput = () => {
    if (!userInput.trim()) {
      toast("Please share something with us first! 💭");
      return;
    }

    const personalizedQuote = generatePersonalizedQuote(userInput, questionType);
    addPersonalizedQuote(personalizedQuote);
    
    toast("🎯 Here's something just for you!");
    setUserInput("");
    setShowInput(false);
    setQuestionType("general");
  };

  const showQuestionInput = (type: "feeling" | "boxer") => {
    setQuestionType(type);
    setShowInput(true);
    
    if (type === "boxer") {
      const randomQuestion = boxerQuestions[Math.floor(Math.random() * boxerQuestions.length)];
      setCurrentQuestion(randomQuestion);
      toast("🥊 " + randomQuestion);
    } else {
      setCurrentQuestion("How are you feeling right now?");
      toast("💭 How are you feeling right now?");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
        {/* Motivational quotes */}
        {quotes.map((quote) => {
          const shapeClass = quote.shape === 'round' ? 'rounded-full' : 
                            quote.shape === 'square' ? 'rounded-lg' : 'rounded-[50%]';
          
          const animationName = `floatUp-${quote.id}`;
          
          return (
            <>
              <style key={`style-${quote.id}`}>
                {`
                  @keyframes ${animationName} {
                    0% {
                      transform: translateY(0vh) translateX(0px) scale(0.8);
                      opacity: 0;
                    }
                    5% {
                      opacity: 1;
                      transform: translateY(-5vh) translateX(${quote.sideMovement * 0.1}px) scale(1);
                    }
                    85% {
                      opacity: 1;
                    }
                    100% {
                      transform: translateY(-85vh) translateX(${quote.sideMovement}px) scale(0.7);
                      opacity: 0;
                    }
                  }
                `}
              </style>
              <div
                key={quote.id}
                className={`fixed pointer-events-none z-10`}
                style={{
                  left: `${quote.x}%`,
                  bottom: '0px',
                  color: quote.color,
                  fontSize: `${quote.size}px`,
                  textShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  animation: `${animationName} ${quote.animationDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                }}
              >
                <div className={`animate-pulse-glow bg-white/25 backdrop-blur-md ${shapeClass} px-6 py-3 border border-white/40 shadow-bubble whitespace-nowrap hover:scale-105 transition-transform`}>
                  {quote.text}
                </div>
              </div>
            </>
          );
        })}

        {/* Interactive Control Panel */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-bubble">
            <h2 className="text-foreground text-xl font-bold mb-4 text-center">Emergency Motivation Hub 🌟</h2>
            
            {!showInput ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button
                  onClick={addQuotes}
                  className="bg-gradient-primary text-white hover:scale-105 transition-all duration-300 rounded-full px-6 py-3 font-bold shadow-bubble hover:shadow-glow"
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  General Motivation
                </Button>
                
                <Button
                  onClick={() => showQuestionInput("feeling")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 transition-all duration-300 rounded-full px-6 py-3 font-bold shadow-bubble hover:shadow-glow"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Share Feelings
                </Button>
                
                <Button
                  onClick={() => showQuestionInput("boxer")}
                  className="bg-gradient-to-r from-red-500 to-orange-600 text-white hover:scale-105 transition-all duration-300 rounded-full px-6 py-3 font-bold shadow-bubble hover:shadow-glow"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Hero Inspiration
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 min-w-[300px]">
                <div className="text-foreground text-center font-medium">
                  {currentQuestion}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={questionType === "boxer" ? "e.g., Mike Tyson" : "e.g., stressed, excited, tired..."}
                    className="bg-background border-2 text-foreground placeholder:text-muted-foreground"
                    onKeyPress={(e) => e.key === 'Enter' && handlePersonalizedInput()}
                  />
                  <Button
                    onClick={handlePersonalizedInput}
                    className="bg-gradient-primary text-white hover:scale-105 transition-all duration-300 rounded-lg px-4 shadow-bubble"
                  >
                    Send
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    setShowInput(false);
                    setUserInput("");
                    setQuestionType("general");
                  }}
                  variant="outline"
                  className="text-foreground border-border hover:bg-accent rounded-lg"
                >
                  Back
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Center main button - now more prominent */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={addQuotes}
            size="lg"
            className="bg-gradient-primary text-white hover:scale-110 transition-all duration-500 rounded-full w-40 h-40 text-xl font-bold shadow-bubble hover:shadow-glow animate-pulse-glow"
          >
            <div className="flex flex-col items-center">
              <AlertTriangle className="w-12 h-12 mb-2 animate-bounce" fill="currentColor" />
              <span className="text-lg">Help Me!</span>
              <span className="text-sm opacity-80">Emergency Mode</span>
            </div>
          </Button>
        </div>

        {/* Enhanced floating background bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-gradient-to-br from-white/15 to-white/5 animate-bounce-gentle`}
              style={{
                width: `${Math.random() * 120 + 60}px`,
                height: `${Math.random() * 120 + 60}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 4 + 3}s`,
              }}
            />
          ))}
        </div>

        {/* Bottom motivation text */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20">
            <p className="text-foreground text-center font-medium">
              🌟 Motivation is the foundation of health goals! You've got this! 🌟
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;