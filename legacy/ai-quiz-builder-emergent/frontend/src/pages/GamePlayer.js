import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/App";
import { toast } from "sonner";
import { 
  Loader2, Trophy, Star, Home, RotateCcw,
  Sparkles, ArrowRight, X
} from "lucide-react";
import { translate } from "@/utils/translations";
import LeaderboardEntry, { LeaderboardDisplay } from "@/components/Leaderboard";

// Import ultimate game components
import UltimateQuizGame from "@/components/games/UltimateQuizGame";
import UltimateSpellingGame from "@/components/games/UltimateSpellingGame";
import WordMatchGame from "@/components/games/WordMatchGame";
import FlashcardsGame from "@/components/games/FlashcardsGame";
import WordSearchGame from "@/components/games/WordSearchGame";
import MatchingPairsGame from "@/components/games/MatchingPairsGame";
import DonkeyKongGame from "@/components/games/DonkeyKongGame";

export default function GamePlayer() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [worksheet, setWorksheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showLeaderboardEntry, setShowLeaderboardEntry] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [instructionLanguage, setInstructionLanguage] = useState('ja');

  useEffect(() => {
    loadGame();
  }, [code]);

  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameCompleted]);

  async function loadGame() {
    try {
      const response = await api.get(`/games/by-code/${code}`);
      setGame(response.data);
      
      // Get worksheet for instruction language
      try {
        const wsResponse = await api.get(`/worksheets/${response.data.worksheet_id}`);
        setWorksheet(wsResponse.data);
        setInstructionLanguage(wsResponse.data.instruction_language || 'ja');
      } catch (e) {
        console.log('Could not load worksheet details');
      }
    } catch (error) {
      toast.error('Game not found');
      setTimeout(() => navigate('/'), 2000);
    }
    setLoading(false);
  }

  async function loadLeaderboard() {
    try {
      const response = await api.get(`/leaderboard/game/${game.id}`);
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('Failed to load leaderboard');
    }
  }

  async function handleGameComplete(finalScore) {
    setScore(finalScore);
    setGameCompleted(true);
    
    try {
      await api.post('/game-sessions', {
        game_id: game.id,
        score: finalScore,
        completed: true,
        time_spent: timeSpent
      });
    } catch (error) {
      console.error('Failed to save game session', error);
    }
    
    // Load leaderboard
    await loadLeaderboard();
  }

  function handleLeaderboardComplete() {
    setShowLeaderboardEntry(false);
    setShowLeaderboard(true);
    loadLeaderboard();
  }

  function handleRestart() {
    setGameStarted(false);
    setGameCompleted(false);
    setScore(0);
    setTimeSpent(0);
    setShowLeaderboard(false);
    setShowLeaderboardEntry(false);
  }

  function renderGame() {
    if (!game) return null;

    const gameProps = {
      content: game.content,
      onComplete: handleGameComplete,
      instructionLanguage
    };

    switch(game.game_type) {
      case 'Word Match':
        return <WordMatchGame {...gameProps} />;
      case 'Quiz':
      case 'Gameshow quiz':
        return <UltimateQuizGame {...gameProps} />;
      case 'Flashcards':
        return <FlashcardsGame {...gameProps} />;
      case 'Spelling Practice':
        return <UltimateSpellingGame {...gameProps} />;
      case 'Word Search':
        return <WordSearchGame {...gameProps} />;
      case 'Matching Pairs':
        return <MatchingPairsGame {...gameProps} />;
      case 'Word Climber':
      case 'Donkey Kong':
        return <DonkeyKongGame {...gameProps} />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">This game type is coming soon!</p>
            <p className="text-sm text-slate-500 mt-2">{game.game_type}</p>
          </div>
        );
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 to-fuchsia-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-lg font-bold text-violet-900">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 to-fuchsia-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Game Not Found</h2>
            <p className="text-slate-600 mb-4">Please check your game code</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 to-fuchsia-50 flex items-center justify-center p-4 student-theme">
        {!showLeaderboard && !showLeaderboardEntry && (
          <>
            <Confetti />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg w-full"
            >
              <Card className="border-4 border-yellow-300 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center pb-8">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 1 }}
                    className="mx-auto mb-4"
                  >
                    <Trophy className="w-20 h-20" />
                  </motion.div>
                  <CardTitle className="text-4xl font-black">
                    {translate("Great work", instructionLanguage)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="text-6xl font-black text-violet-900 mb-2">{score}%</div>
                    <p className="text-lg font-bold text-violet-700">{translate("You scored", instructionLanguage)}</p>
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`w-8 h-8 ${i < Math.floor(score / 20) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>

                  <div className="bg-violet-50 p-4 rounded-2xl mb-6">
                    <p className="text-sm font-bold text-violet-700">
                      {translate("Time", instructionLanguage)}: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                    </p>
                  </div>

                  <div className="flex gap-3 mb-4">
                    <Button
                      onClick={handleRestart}
                      className="flex-1 h-14 text-lg font-black rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                      data-testid="play-again-button"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      {translate("Play Again", instructionLanguage)}
                    </Button>
                    <Button
                      onClick={() => navigate('/student')}
                      variant="outline"
                      className="flex-1 h-14 text-lg font-black rounded-full border-4 border-violet-300"
                      data-testid="home-button"
                    >
                      <Home className="w-5 h-5 mr-2" />
                      {translate("Home", instructionLanguage)}
                    </Button>
                  </div>

                  <Button
                    onClick={() => setShowLeaderboardEntry(true)}
                    className="w-full h-14 text-lg font-black rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    data-testid="join-leaderboard-button"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Join Leaderboard
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {showLeaderboardEntry && !showLeaderboard && (
          <LeaderboardEntry 
            gameId={game.id}
            gameTitle={game.title}
            score={score}
            onComplete={handleLeaderboardComplete}
            instructionLanguage={instructionLanguage}
          />
        )}

        {showLeaderboard && (
          <div className="w-full max-w-4xl">
            <LeaderboardDisplay 
              entries={leaderboardData} 
              currentScore={score}
              instructionLanguage={instructionLanguage}
            />
            <div className="flex gap-3 mt-6 justify-center">
              <Button
                onClick={handleRestart}
                className="h-14 px-8 text-lg font-black rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600"
              >
                {translate("Play Again", instructionLanguage)}
              </Button>
              <Button
                onClick={() => navigate('/student')}
                variant="outline"
                className="h-14 px-8 text-lg font-black rounded-full border-4 border-violet-300"
              >
                {translate("Home", instructionLanguage)}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 to-fuchsia-50 flex items-center justify-center p-4 student-theme">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <Card className="border-4 border-violet-300 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-center pb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mx-auto mb-4"
              >
                <Sparkles className="w-16 h-16" />
              </motion.div>
              <CardTitle className="text-4xl font-black">{game.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="bg-violet-50 p-6 rounded-2xl border-2 border-violet-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-violet-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="font-bold text-violet-900">Game Type: {game.game_type}</p>
                  </div>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-violet-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="font-bold text-violet-900">Theme: {game.theme || 'General'}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-violet-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="font-bold text-violet-900">Level: {game.grade_level || 'All Levels'}</p>
                  </div>
                </div>

                <Button
                  onClick={() => setGameStarted(true)}
                  className="w-full h-16 text-2xl font-black rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-[0_6px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_3px_0_0_rgba(0,0,0,0.2)] hover:translate-y-[3px] active:translate-y-[6px] active:shadow-none transition-all"
                  data-testid="start-game-button"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  {translate("Start Game", instructionLanguage)}
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-fuchsia-50 p-4 student-theme">
      <div className="container mx-auto max-w-5xl py-8">
        {/* Game Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-4 border-violet-200"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-violet-900">{game.title}</h2>
              <p className="text-sm font-bold text-violet-600">{game.game_type}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-violet-600">{translate("Time", instructionLanguage)}</p>
                <p className="text-xl font-black text-violet-900">{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student')}
                className="rounded-full border-2 border-violet-300"
                data-testid="exit-game-button"
              >
                <Home className="w-4 h-4 mr-2" />
                {translate("Exit", instructionLanguage)}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Game Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {renderGame()}
        </motion.div>
      </div>
    </div>
  );
}
