import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Award, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  Trophy,
  Target,
  Zap,
  ArrowRight,
  RotateCcw,
  Loader2
} from "lucide-react";
import confetti from "canvas-confetti";
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

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answerChecked, setAnswerChecked] = useState(false);
  const { toast } = useToast();

  // Fetch 5 random questions from the database
  const fetchRandomQuestions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .limit(30); // Get all questions first

      if (error) throw error;

      if (data && data.length > 0) {
        // Randomly select 5 questions from all available
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, 5).map(q => ({
          id: q.id,
          question: q.question,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          category: q.category
        }));
        setQuestions(selectedQuestions);
      } else {
        toast({
          title: "No questions found",
          description: "Unable to load quiz questions. Please try again later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error loading quiz",
        description: "Unable to load quiz questions. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomQuestions();
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newUserAnswers);

    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    setShowResult(true);
    setAnswerChecked(true);
  };

  const handleNextQuestion = () => {
    if (!answerChecked) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnswerChecked(false);
    } else {
      setIsQuizComplete(true);
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsQuizComplete(false);
    setUserAnswers([]);
    setAnswerChecked(false);
    fetchRandomQuestions();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-8">
            <div className="animate-bounce-gentle">
              <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Loading Quiz...
            </h1>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if no questions loaded
  if (!isLoading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-8">
            <div>
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Unable to Load Quiz
            </h1>
            <p className="text-xl text-muted-foreground">
              Please try again later or contact support if the problem persists.
            </p>
            <Button 
              onClick={fetchRandomQuestions}
              className="bg-gradient-primary hover:shadow-glow rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return { message: "Outstanding! You're a health expert!", badge: "Expert", color: "text-success" };
    if (percentage >= 60) return { message: "Great job! You know your health basics!", badge: "Advanced", color: "text-primary" };
    if (percentage >= 40) return { message: "Good start! Keep learning!", badge: "Intermediate", color: "text-warning" };
    return { message: "Keep studying - you've got this!", badge: "Beginner", color: "text-secondary" };
  };

  if (isQuizComplete) {
    const scoreInfo = getScoreMessage();
    
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-8">
            <div className="animate-bounce-gentle">
              <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Quiz Complete! 🎉
              </h1>
              <p className="text-xl text-muted-foreground">
                {scoreInfo.message}
              </p>
            </div>

            <Card className="max-w-md mx-auto rounded-3xl border-2 shadow-float">
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-foreground">
                    {score}/{questions.length}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {Math.round((score / questions.length) * 100)}% Correct
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className={`rounded-full px-4 py-2 text-lg ${scoreInfo.color}`}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    {scoreInfo.badge}
                  </Badge>
                </div>

                <Progress 
                  value={(score / questions.length) * 100} 
                  className="h-3 rounded-full"
                />
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={resetQuiz}
                className="bg-gradient-primary hover:shadow-glow rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
              
              <Button 
                variant="outline"
                className="rounded-2xl px-6 py-3 text-lg font-semibold border-2 hover:border-secondary hover:text-secondary transition-all duration-300 hover:scale-105"
              >
                <Target className="w-5 h-5 mr-2" />
                View Explanations
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = (currentQuestion / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-medium">Health Knowledge Quiz</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Test Your Health IQ
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn while you play - earn badges and build healthy habits!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>

        {/* Question Card */}
        <Card className="rounded-3xl border-2 shadow-float mb-8">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="rounded-full">
                {currentQ.category}
              </Badge>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">+10 points</span>
              </div>
            </div>
            <CardTitle className="text-xl md:text-2xl leading-relaxed">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedAnswer === index
                    ? showResult
                      ? index === currentQ.correct_answer
                        ? "border-success bg-success/10 text-success"
                        : "border-destructive bg-destructive/10 text-destructive"
                      : "border-primary bg-primary/10 text-primary"
                    : showResult && index === currentQ.correct_answer
                    ? "border-success bg-success/10 text-success"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1 pr-4">{option}</span>
                  {showResult && (
                    <div>
                      {index === currentQ.correct_answer ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : selectedAnswer === index ? (
                        <XCircle className="w-5 h-5 text-destructive" />
                      ) : null}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Result Explanation */}
        {showResult && (
          <Card className="rounded-2xl border-2 bg-muted/30 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedAnswer === currentQ.correct_answer ? "bg-success" : "bg-destructive"
                }`}>
                  {selectedAnswer === currentQ.correct_answer ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <XCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${
                    selectedAnswer === currentQ.correct_answer ? "text-success" : "text-destructive"
                  }`}>
                    {selectedAnswer === currentQ.correct_answer ? "Correct! 🎉" : "Not quite right"}
                  </h3>
                  <p className="text-muted-foreground">{currentQ.explanation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Buttons */}
        <div className="text-center mt-8 space-y-4">
          {/* Check Answer Button */}
          <div>
            <Button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null || answerChecked}
              className="bg-gradient-primary hover:shadow-glow rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Check Answer
            </Button>
          </div>

          {/* Next Question Button */}
          <div>
            <Button
              onClick={handleNextQuestion}
              disabled={!answerChecked}
              className="bg-secondary hover:bg-secondary/80 rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  <Trophy className="w-5 h-5 mr-2" />
                  Finish Quiz
                </>
              ) : (
                <>
                  Next Question
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

         {/* Current Score */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-warning" />
              <span>Current Score: {score}/{answerChecked ? currentQuestion + 1 : currentQuestion}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;