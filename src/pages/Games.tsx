import { useState } from "react";
import Navigation from "@/components/Navigation";
import QuizGame from "@/components/QuizGame";
import MemoryMatchGame from "@/components/MemoryMatchGame";
import DailyChallengeGame from "@/components/DailyChallengeGame";
import FitnessTriviaGame from "@/components/FitnessTriviaGame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Trophy,
  Target,
  Zap,
  Star,
  Gamepad2,
  ArrowRight,
  Lock
} from "lucide-react";

type GameType = 'dashboard' | 'quiz' | 'memory' | 'challenge' | 'trivia';

const Games = () => {
  const [currentGame, setCurrentGame] = useState<GameType>('dashboard');

  const games = [
    {
      id: 'quiz',
      title: 'Health Quiz',
      description: 'Test your knowledge with health-related questions and earn badges!',
      icon: Brain,
      difficulty: 'Beginner',
      estimatedTime: '5-10 min',
      points: '50-100 points',
      available: true,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Match health concepts and improve your memory skills.',
      icon: Target,
      difficulty: 'Intermediate',
      estimatedTime: '10-15 min',
      points: '75-150 points',
      available: true,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      id: 'challenge',
      title: 'Daily Challenge',
      description: 'Complete daily health challenges and build streaks.',
      icon: Zap,
      difficulty: 'Varied',
      estimatedTime: '15-30 min',
      points: '100-300 points',
      available: true,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      id: 'trivia',
      title: 'Fitness Trivia',
      description: 'Quick-fire trivia questions about fitness and wellness.',
      icon: Star,
      difficulty: 'Advanced',
      estimatedTime: '10-20 min',
      points: '200-500 points',
      available: true,
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  if (currentGame === 'quiz') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <QuizGame onBack={() => setCurrentGame('dashboard')} />
        </div>
      </div>
    );
  }

  if (currentGame === 'memory') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <MemoryMatchGame onBack={() => setCurrentGame('dashboard')} />
        </div>
      </div>
    );
  }

  if (currentGame === 'challenge') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <DailyChallengeGame onBack={() => setCurrentGame('dashboard')} />
        </div>
      </div>
    );
  }

  if (currentGame === 'trivia') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <FitnessTriviaGame onBack={() => setCurrentGame('dashboard')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
            <Gamepad2 className="w-4 h-4" />
            <span className="text-sm font-medium">Interactive Learning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Health & Fitness Games
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn, play, and improve your health knowledge through engaging games and challenges
          </p>
        </div>


        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <Card 
                key={game.id} 
                className={`rounded-3xl border-2 shadow-float transition-all duration-300 hover:shadow-bubble hover:scale-105 ${
                  game.available ? 'cursor-pointer' : 'opacity-60'
                }`}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${game.bgColor} rounded-2xl flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${game.color}`} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={`rounded-full ${game.color}`}
                      >
                        {game.difficulty}
                      </Badge>
                      {!game.available && (
                        <Badge variant="outline" className="rounded-full">
                          <Lock className="w-3 h-3 mr-1" />
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground mb-2">
                      {game.title}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {game.description}
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{game.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{game.points}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => game.available && setCurrentGame(game.id as GameType)}
                    disabled={!game.available}
                    className={`w-full rounded-2xl py-3 text-lg font-semibold transition-all duration-300 ${
                      game.available 
                        ? 'bg-gradient-primary hover:shadow-glow hover:scale-105' 
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {game.available ? (
                      <>
                        Play Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Coming Soon
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon Games */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">More Games Coming Soon!</h2>
          <p className="text-muted-foreground mb-8">
            We're working on exciting new games to make your health journey even more fun and engaging.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="rounded-full px-4 py-2">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Workout Challenges
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              Nutrition Puzzles
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboards
            </Badge>
            <Badge variant="outline" className="rounded-full px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Achievement System
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;