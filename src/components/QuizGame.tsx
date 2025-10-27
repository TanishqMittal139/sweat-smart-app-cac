import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RotateCcw, Brain, Trophy, Star, CheckCircle, X, Clock, Target } from "lucide-react";
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

interface QuestionResult {
  question: Question;
  selectedAnswer: number;
  isCorrect: boolean;
  timeToAnswer: number;
  pointsEarned: number;
}

interface QuizGameProps {
  onBack: () => void;
}

const QuizGame = ({ onBack }: QuizGameProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gameComplete, setGameComplete] = useState(false);
  const [perfectAnswers, setPerfectAnswers] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, isLoading, questions]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .neq('category', 'trivia')
        .neq('category', 'memory')
        .neq('category', 'challenge')
        .limit(15);

      if (error) throw error;

      if (!data || data.length < 15) {
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
      setQuestionStartTime(Date.now());
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz questions. Please try again.",
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

  const calculatePoints = (isCorrect: boolean, timeToAnswer: number) => {
    if (!isCorrect) return 0;
    
    // Base points for health quiz
    const basePoints = 125;
    
    // Time bonus (faster answers get more points)
    // Perfect time bonus for answers under 5 seconds
    let timeBonus = 0;
    if (timeToAnswer < 5000) {
      timeBonus = 25; // Perfect answer (150 total)
    } else if (timeToAnswer < 10000) {
      timeBonus = 15;
    } else if (timeToAnswer < 15000) {
      timeBonus = 10;
    } else if (timeToAnswer < 20000) {
      timeBonus = 5;
    }

    return basePoints + timeBonus;
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const timeToAnswer = Date.now() - questionStartTime;
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    const pointsEarned = calculatePoints(isCorrect, timeToAnswer);

    // Track perfect answers (under 5 seconds and correct)
    if (isCorrect && timeToAnswer < 5000) {
      setPerfectAnswers(prev => prev + 1);
    }

    const result: QuestionResult = {
      question: currentQuestion,
      selectedAnswer,
      isCorrect,
      timeToAnswer,
      pointsEarned
    };

    setQuestionResults(prev => [...prev, result]);
    setScore(prev => prev + pointsEarned);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      setGameComplete(true);
      return;
    }

    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuestionResults([]);
    setQuestionStartTime(0);
    setGameComplete(false);
    setPerfectAnswers(0);
    setIsLoading(true);
    fetchQuestions();
  };

  const getScoreRating = () => {
    const correctCount = questionResults.filter(r => r.isCorrect).length;
    const percentage = (correctCount / questions.length) * 100;
    
    if (percentage >= 95 && perfectAnswers >= 10) return { text: "Health Expert!", color: "text-primary", icon: Trophy };
    if (percentage >= 90) return { text: "Excellent Knowledge!", color: "text-primary", icon: Star };
    if (percentage >= 80) return { text: "Great Understanding!", color: "text-primary", icon: Brain };
    if (percentage >= 70) return { text: "Good Progress!", color: "text-primary", icon: Target };
    return { text: "Keep Learning!", color: "text-muted-foreground", icon: Brain };
  };

  const formatTime = (ms: number) => {
    const seconds = (ms / 1000).toFixed(1);
    return `${seconds}s`;
  };

  const getAnswerResultClass = (optionIndex: number) => {
    if (!showResult) {
      return selectedAnswer === optionIndex 
        ? 'border-primary bg-primary/10 text-primary' 
        : 'hover:border-primary/50';
    }

    const correctIndex = questions[currentQuestionIndex].correct_answer;
    
    if (optionIndex === correctIndex) {
      return 'border-success bg-success/10 text-success';
    }
    
    if (selectedAnswer === optionIndex && optionIndex !== correctIndex) {
      return 'border-destructive bg-destructive/10 text-destructive';
    }
    
    return 'opacity-50';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Health Quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    const rating = getScoreRating();
    const IconComponent = rating.icon;
    const correctCount = questionResults.filter(r => r.isCorrect).length;
    const avgTime = questionResults.reduce((acc, r) => acc + r.timeToAnswer, 0) / questionResults.length;

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="rounded-3xl border-2 shadow-float">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <IconComponent className={`w-8 h-8 ${rating.color}`} />
              </div>
              <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
              <p className={`text-xl font-semibold ${rating.color}`}>{rating.text}</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">{score}</p>
                  <p className="text-sm text-muted-foreground">Total Score</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-success">{correctCount}/{questions.length}</p>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-warning">{perfectAnswers}</p>
                  <p className="text-sm text-muted-foreground">Perfect Answers</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-secondary">{formatTime(avgTime)}</p>
                  <p className="text-sm text-muted-foreground">Avg Time</p>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="max-h-60 overflow-y-auto space-y-2">
                <h3 className="font-semibold text-center mb-3">Question Results</h3>
                {questionResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div className="flex items-center space-x-3">
                      {result.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <X className="w-5 h-5 text-destructive" />
                      )}
                      <span className="text-sm">Question {index + 1}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{formatTime(result.timeToAnswer)}</span>
                      <Badge variant={result.pointsEarned > 140 ? "default" : "secondary"}>
                        {result.pointsEarned} pts
                      </Badge>
                    </div>
                  </div>
                ))}
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

  if (!questions.length) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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
              <h1 className="text-3xl font-bold text-foreground mb-2">Health Quiz</h1>
              <p className="text-muted-foreground">Test your health and wellness knowledge</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-primary/10 text-primary rounded-full px-4 py-2">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">{score} Points</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/10 text-secondary rounded-full px-4 py-2">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">{perfectAnswers} Perfect</span>
              </div>
              <Badge variant="outline" className="rounded-full border-primary/20 text-primary">
                Beginner-Intermediate
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question */}
        <Card className="rounded-3xl border-2 shadow-float mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="rounded-full">
                {currentQuestion.category}
              </Badge>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Time: {showResult ? formatTime(Date.now() - questionStartTime) : 'Counting...'}</span>
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-center">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Answer Options */}
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  variant="outline"
                  className={`
                    w-full text-left justify-start p-4 h-auto rounded-2xl border-2 transition-all duration-200
                    ${getAnswerResultClass(index)}
                  `}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                  <span className="ml-2">{option}</span>
                  {showResult && index === currentQuestion.correct_answer && (
                    <CheckCircle className="w-5 h-5 ml-auto text-success" />
                  )}
                  {showResult && selectedAnswer === index && index !== currentQuestion.correct_answer && (
                    <X className="w-5 h-5 ml-auto text-destructive" />
                  )}
                </Button>
              ))}
            </div>

            {/* Result and Explanation */}
            {showResult && (
              <div className="mt-6 p-4 rounded-2xl bg-muted/50">
                <div className={`text-center mb-3 ${selectedAnswer === currentQuestion.correct_answer ? 'text-success' : 'text-destructive'}`}>
                  {selectedAnswer === currentQuestion.correct_answer ? (
                    <>
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-semibold">Excellent!</p>
                      <p className="text-sm text-muted-foreground">
                        +{questionResults[questionResults.length - 1]?.pointsEarned || 0} points
                        {formatTime(Date.now() - questionStartTime) < '5.0s' && (
                          <span className="text-primary font-medium"> (Perfect timing!)</span>
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <X className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-semibold">Not quite right</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        The correct answer was: {currentQuestion.options[currentQuestion.correct_answer]}
                      </p>
                    </>
                  )}
                </div>
                <div className="border-t pt-3 mt-3">
                  <h4 className="font-medium mb-2">Explanation:</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentQuestion.explanation}
                  </p>
                </div>
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
                  Submit Answer
                </Button>
              )}
              
              {showResult && (
                <Button
                  onClick={handleNextQuestion}
                  className="flex-1 rounded-2xl py-3 bg-gradient-primary hover:shadow-glow"
                >
                  {currentQuestionIndex >= questions.length - 1 ? 'View Results' : 'Next Question'}
                  <Brain className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizGame;