import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RotateCcw, Clock, Trophy, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  category: string;
}

interface MatchCard {
  id: string;
  content: string;
  type: 'question' | 'answer';
  questionId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchGameProps {
  onBack: () => void;
}

const MemoryMatchGame = ({ onBack }: MemoryMatchGameProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameComplete) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameComplete]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('category', 'memory')
        .limit(6);

      if (error) throw error;

      if (!data || data.length < 6) {
        toast({
          title: "Error",
          description: "Not enough questions available. Please try again later.",
          variant: "destructive"
        });
        return;
      }

      // Parse the JSON options field
      const parsedQuestions = data.map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string)
      }));
      setQuestions(parsedQuestions);
      createMatchingCards(parsedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createMatchingCards = (questionData: Question[]) => {
    const matchingCards: MatchCard[] = [];
    
    questionData.forEach((q, index) => {
      // Create question card
      matchingCards.push({
        id: `q-${q.id}`,
        content: q.question,
        type: 'question',
        questionId: q.id,
        isFlipped: false,
        isMatched: false
      });

      // Create answer card
      const correctAnswer = q.options[q.correct_answer];
      matchingCards.push({
        id: `a-${q.id}`,
        content: correctAnswer,
        type: 'answer',
        questionId: q.id,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    const shuffledCards = [...matchingCards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  };

  const handleCardClick = (cardId: string) => {
    if (!gameStarted) setGameStarted(true);
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card state
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      checkForMatch(newFlippedCards);
    }
  };

  const checkForMatch = (flippedCardIds: string[]) => {
    const [card1Id, card2Id] = flippedCardIds;
    const card1 = cards.find(c => c.id === card1Id);
    const card2 = cards.find(c => c.id === card2Id);

    if (!card1 || !card2) return;

    const isMatch = card1.questionId === card2.questionId && card1.type !== card2.type;

    setTimeout(() => {
      if (isMatch) {
        // Match found
        const newMatchedPairs = [...matchedPairs, card1.questionId];
        setMatchedPairs(newMatchedPairs);
        setScore(prev => prev + Math.max(100 - moves * 2, 20));

        setCards(prev => prev.map(c => 
          c.questionId === card1.questionId 
            ? { ...c, isMatched: true, isFlipped: true }
            : c
        ));

        // Check if game is complete
        if (newMatchedPairs.length === questions.length) {
          setGameComplete(true);
          const bonus = Math.max(500 - timeElapsed * 2, 100);
          setScore(prev => prev + bonus);
        }
      } else {
        // No match - flip cards back
        setCards(prev => prev.map(c => 
          flippedCardIds.includes(c.id) ? { ...c, isFlipped: false } : c
        ));
      }
      setFlippedCards([]);
    }, 1000);
  };

  const resetGame = () => {
    setCards([]);
    setFlippedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setMoves(0);
    setTimeElapsed(0);
    setGameComplete(false);
    setGameStarted(false);
    setIsLoading(true);
    fetchQuestions();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreRating = () => {
    if (score >= 800) return { text: "Perfect Memory!", color: "text-warning", icon: Trophy };
    if (score >= 600) return { text: "Excellent!", color: "text-success", icon: Star };
    if (score >= 400) return { text: "Good Job!", color: "text-primary", icon: Star };
    return { text: "Keep Practicing!", color: "text-muted-foreground", icon: Star };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Memory Match Game...</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    const rating = getScoreRating();
    const IconComponent = rating.icon;

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="rounded-3xl border-2 shadow-float">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <IconComponent className={`w-8 h-8 ${rating.color}`} />
              </div>
              <CardTitle className="text-3xl font-bold">Game Complete!</CardTitle>
              <p className={`text-xl font-semibold ${rating.color}`}>{rating.text}</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">{score}</p>
                  <p className="text-sm text-muted-foreground">Final Score</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-secondary">{moves}</p>
                  <p className="text-sm text-muted-foreground">Moves Used</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-warning">{formatTime(timeElapsed)}</p>
                  <p className="text-sm text-muted-foreground">Time Taken</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-success">{questions.length}</p>
                  <p className="text-sm text-muted-foreground">Pairs Matched</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={resetGame}
                  className="flex-1 rounded-2xl py-3 bg-gradient-primary hover:shadow-glow"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="flex-1 rounded-2xl py-3"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Games
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = (matchedPairs.length / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 rounded-2xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Memory Match</h1>
              <p className="text-muted-foreground">Match health questions with their correct answers</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-primary/10 text-primary rounded-full px-4 py-2">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">{score} Points</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/10 text-secondary rounded-full px-4 py-2">
                <span className="text-sm font-medium">{moves} Moves</span>
              </div>
              <div className="flex items-center space-x-2 bg-warning/10 text-warning rounded-full px-4 py-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {matchedPairs.length} / {questions.length} pairs matched
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`
                aspect-square cursor-pointer transition-all duration-300 hover:scale-105 rounded-2xl border-2
                ${card.isFlipped || card.isMatched 
                  ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20' 
                  : 'bg-gradient-to-br from-muted/50 to-muted border-muted hover:border-primary/30'
                }
                ${card.isMatched ? 'opacity-75 scale-95' : ''}
              `}
              onClick={() => handleCardClick(card.id)}
            >
              <CardContent className="h-full flex items-center justify-center p-4">
                {card.isFlipped || card.isMatched ? (
                  <div className="text-center">
                    <Badge 
                      variant={card.type === 'question' ? 'default' : 'secondary'} 
                      className="mb-3 rounded-full"
                    >
                      {card.type === 'question' ? 'Q' : 'A'}
                    </Badge>
                    <p className="text-sm font-medium leading-tight">
                      {card.content}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="w-8 h-8 bg-muted rounded-full mx-auto mb-2"></div>
                    <p className="text-xs">Flip Card</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        {!gameStarted && (
          <Card className="mt-8 rounded-2xl border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">How to Play</h3>
              <p className="text-muted-foreground">
                Flip cards to reveal health questions and answers. Match each question with its correct answer. 
                Complete all pairs with fewer moves and less time for a higher score!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MemoryMatchGame;