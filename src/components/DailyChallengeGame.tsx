import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RotateCcw, Clock, Zap, Target, Trophy, AlertTriangle, CheckCircle } from "lucide-react";
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

interface Challenge {
  question: Question;
  timeLimit: number;
  pointMultiplier: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface DailyChallengeGameProps {
  onBack: () => void;
}

const DailyChallengeGame = ({ onBack }: DailyChallengeGameProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gameComplete, setGameComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeLeft > 0 && !showResult && !gameComplete) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft, showResult, gameComplete]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('category', 'challenge')
        .limit(10);

      if (error) throw error;

      if (!data || data.length < 10) {
        toast({
          title: "Error",
          description: "Not enough questions available. Please try again later.",
          variant: "destructive"
        });
        return;
      }

      // Parse the JSON options field and create challenges
      const parsedQuestions = data.map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string)
      }));
      
      const challengeData: Challenge[] = parsedQuestions.map((question, index) => {
        let difficulty: 'Easy' | 'Medium' | 'Hard';
        let timeLimit: number;
        let pointMultiplier: number;

        // Vary difficulty based on position
        if (index < 3) {
          difficulty = 'Easy';
          timeLimit = 30;
          pointMultiplier = 1;
        } else if (index < 7) {
          difficulty = 'Medium';
          timeLimit = 20;
          pointMultiplier = 1.5;
        } else {
          difficulty = 'Hard';
          timeLimit = 15;
          pointMultiplier = 2;
        }

        return {
          question,
          timeLimit,
          pointMultiplier,
          difficulty
        };
      });

      setChallenges(challengeData);
      setTimeLeft(challengeData[0]?.timeLimit || 30);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load challenges. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
  };

  const handleTimeUp = () => {
    if (showResult) return;
    
    setSelectedAnswer(-1); // Indicate time's up
    setShowResult(true);
    setStreak(0); // Break streak on timeout
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    const currentChallenge = challenges[currentChallengeIndex];
    const isCorrect = selectedAnswer === currentChallenge.question.correct_answer;
    const timeBonus = Math.floor(timeLeft / currentChallenge.timeLimit * 50);
    const basePoints = 100;

    if (isCorrect) {
      const points = Math.floor((basePoints + timeBonus) * currentChallenge.pointMultiplier * (1 + streak * 0.1));
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setCorrectAnswers(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTotalTime(prev => prev + (currentChallenge.timeLimit - timeLeft));
    setShowResult(true);
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex >= challenges.length - 1) {
      setGameComplete(true);
      return;
    }

    const nextIndex = currentChallengeIndex + 1;
    setCurrentChallengeIndex(nextIndex);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(challenges[nextIndex].timeLimit);
  };

  const resetGame = () => {
    setCurrentChallengeIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(0);
    setGameComplete(false);
    setCorrectAnswers(0);
    setTotalTime(0);
    setIsLoading(true);
    fetchQuestions();
  };

  const getScoreRating = () => {
    const percentage = (correctAnswers / challenges.length) * 100;
    if (percentage >= 90) return { text: "Challenge Master!", color: "text-primary", icon: Trophy };
    if (percentage >= 75) return { text: "Excellent Performance!", color: "text-primary", icon: CheckCircle };
    if (percentage >= 60) return { text: "Good Effort!", color: "text-primary", icon: Target };
    return { text: "Keep Challenging Yourself!", color: "text-muted-foreground", icon: Zap };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-primary/10 text-primary';
      case 'Medium': return 'bg-primary/20 text-primary';
      case 'Hard': return 'bg-primary/30 text-primary';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Daily Challenge...</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    const rating = getScoreRating();
    const IconComponent = rating.icon;
    const avgTimePerQuestion = totalTime / challenges.length;

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="rounded-3xl border-2 shadow-float">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <IconComponent className={`w-8 h-8 ${rating.color}`} />
              </div>
              <CardTitle className="text-3xl font-bold">Challenge Complete!</CardTitle>
              <p className={`text-xl font-semibold ${rating.color}`}>{rating.text}</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">{score}</p>
                  <p className="text-sm text-muted-foreground">Total Score</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-success">{correctAnswers}</p>
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-warning">{avgTimePerQuestion.toFixed(1)}s</p>
                  <p className="text-sm text-muted-foreground">Avg Time/Question</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-secondary">{Math.max(streak, 0)}</p>
                  <p className="text-sm text-muted-foreground">Best Streak</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={resetGame}
                  className="flex-1 rounded-2xl py-3 bg-gradient-primary hover:shadow-glow"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Challenge
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

  if (!challenges.length) return null;

  const currentChallenge = challenges[currentChallengeIndex];
  const progress = ((currentChallengeIndex + 1) / challenges.length) * 100;
  const timeProgress = (timeLeft / currentChallenge.timeLimit) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Daily Challenge</h1>
              <p className="text-muted-foreground">Answer varied difficulty questions against the clock</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-primary/10 text-primary rounded-full px-4 py-2">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">{score} Points</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/10 text-secondary rounded-full px-4 py-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">{streak} Streak</span>
              </div>
              <Badge className={`rounded-full ${getDifficultyColor(currentChallenge.difficulty)}`}>
                {currentChallenge.difficulty}
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  Question {currentChallengeIndex + 1} of {challenges.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Timer */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Time Remaining</span>
                </div>
                <span className={`text-sm font-medium ${timeLeft <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {timeLeft}s
                </span>
              </div>
              <Progress 
                value={timeProgress} 
                className={`h-2 ${timeLeft <= 5 ? 'bg-destructive/20' : ''}`}
              />
              {timeLeft <= 5 && (
                <div className="flex items-center space-x-1 mt-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Hurry up!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question */}
        <Card className="rounded-3xl border-2 shadow-float mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">
              {currentChallenge.question.question}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Answer Options */}
            <div className="grid gap-3">
              {currentChallenge.question.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  variant="outline"
                  className={`
                    w-full text-left justify-start p-4 h-auto rounded-2xl border-2 transition-all duration-200
                    ${selectedAnswer === index 
                      ? showResult
                        ? index === currentChallenge.question.correct_answer
                          ? 'border-success bg-success/10 text-success'
                          : 'border-destructive bg-destructive/10 text-destructive'
                        : 'border-primary bg-primary/10 text-primary'
                      : showResult && index === currentChallenge.question.correct_answer
                        ? 'border-success bg-success/10 text-success'
                        : 'hover:border-primary/50'
                    }
                  `}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                  <span className="ml-2">{option}</span>
                </Button>
              ))}
            </div>

            {/* Result and Explanation */}
            {showResult && (
              <div className="mt-6 p-4 rounded-2xl bg-muted/50">
                {selectedAnswer === -1 ? (
                  <div className="text-center text-destructive">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-semibold">Time's Up!</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      The correct answer was: {currentChallenge.question.options[currentChallenge.question.correct_answer]}
                    </p>
                  </div>
                ) : selectedAnswer === currentChallenge.question.correct_answer ? (
                  <div className="text-center text-success">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-semibold">Correct!</p>
                  </div>
                ) : (
                  <div className="text-center text-destructive">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-semibold">Incorrect</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      The correct answer was: {currentChallenge.question.options[currentChallenge.question.correct_answer]}
                    </p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  {currentChallenge.question.explanation}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              {!showResult && selectedAnswer !== null && (
                <Button
                  onClick={handleCheckAnswer}
                  className="flex-1 rounded-2xl py-3 bg-gradient-primary hover:shadow-glow"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check Answer
                </Button>
              )}
              
              {showResult && (
                <Button
                  onClick={handleNextChallenge}
                  className="flex-1 rounded-2xl py-3 bg-gradient-primary hover:shadow-glow"
                >
                  {currentChallengeIndex >= challenges.length - 1 ? 'Complete Challenge' : 'Next Question'}
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyChallengeGame;