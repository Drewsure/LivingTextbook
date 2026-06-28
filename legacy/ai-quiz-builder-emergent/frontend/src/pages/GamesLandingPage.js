import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/App";
import { toast } from "sonner";
import { 
  Loader2, Sparkles, Trophy, Star, Play, 
  Gamepad2, BookOpen, Users, ArrowRight
} from "lucide-react";
import { translate } from "@/utils/translations";

const gameTypeIcons = {
  'Word Match': '🎯',
  'Quiz': '❓',
  'Gameshow quiz': '🎮',
  'Flashcards': '📝',
  'Spelling Practice': '✏️',
  'Word Search': '🔍',
  'Matching Pairs': '🃏',
  'Fill in the Blank': '📄',
  'True or False': '✅'
};

const gameTypeColors = {
  'Word Match': 'from-pink-500 to-rose-600',
  'Quiz': 'from-violet-500 to-purple-600',
  'Gameshow quiz': 'from-amber-500 to-orange-600',
  'Flashcards': 'from-cyan-500 to-teal-600',
  'Spelling Practice': 'from-green-500 to-emerald-600',
  'Word Search': 'from-blue-500 to-indigo-600',
  'Matching Pairs': 'from-fuchsia-500 to-pink-600',
  'Fill in the Blank': 'from-slate-500 to-gray-600',
  'True or False': 'from-lime-500 to-green-600'
};

export default function GamesLandingPage() {
  const { worksheetId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [instructionLanguage, setInstructionLanguage] = useState('ja');

  useEffect(() => {
    loadLandingPage();
  }, [worksheetId]);

  async function loadLandingPage() {
    try {
      const response = await api.get(`/worksheets/landing/${worksheetId}`);
      setData(response.data);
      setInstructionLanguage(response.data.worksheet.instruction_language || 'ja');
    } catch (error) {
      toast.error('Could not load games');
      setTimeout(() => navigate('/'), 2000);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100 flex items-center justify-center">
        <motion.div 
          className="text-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Loader2 className="w-20 h-20 animate-spin text-violet-600 mx-auto mb-4" />
          <p className="text-2xl font-black text-violet-900">Loading games...</p>
        </motion.div>
      </div>
    );
  }

  if (!data || !data.games || data.games.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="max-w-md border-4 border-violet-300 rounded-3xl">
          <CardContent className="p-8 text-center">
            <Gamepad2 className="w-20 h-20 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-700 mb-2">No Games Found</h2>
            <p className="text-slate-600 mb-6">This worksheet doesn't have any games yet.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-violet-600 hover:bg-violet-700 rounded-full px-8"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100 p-4 student-theme">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 text-4xl"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              y: [0, -100, 0],
              rotate: [0, 360],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: i * 0.3
            }}
          >
            {['⭐', '🎮', '📚', '🎯', '✨'][i % 5]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto max-w-5xl py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-4 rounded-2xl inline-block">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl font-black text-violet-900 mb-3 drop-shadow-lg">
            {data.worksheet.title}
          </h1>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="bg-violet-200 text-violet-800 px-6 py-2 rounded-full font-bold text-lg">
              {data.worksheet.theme}
            </span>
            <span className="bg-fuchsia-200 text-fuchsia-800 px-6 py-2 rounded-full font-bold text-lg">
              {data.worksheet.grade_level}
            </span>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-8 border-4 border-violet-200 shadow-xl"
        >
          <p className="text-center text-2xl font-bold text-violet-800">
            {translate("Choose a game to start playing", instructionLanguage)}! 🎮
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer overflow-hidden border-4 border-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all"
                onClick={() => navigate(`/play/${game.share_code}`)}
                data-testid={`game-card-${game.id}`}
              >
                {/* Gradient Header */}
                <div className={`h-28 bg-gradient-to-br ${gameTypeColors[game.game_type] || 'from-violet-500 to-purple-600'} flex items-center justify-center relative overflow-hidden`}>
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  />
                  
                  <span className="text-6xl z-10">{gameTypeIcons[game.game_type] || '🎮'}</span>
                </div>
                
                <CardContent className="p-5">
                  <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-2">
                    {game.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-violet-600 bg-violet-100 px-3 py-1 rounded-full">
                      {game.game_type}
                    </span>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-bold">{game.plays}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4 h-14 text-lg font-black rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] hover:translate-y-[2px] transition-all"
                    data-testid={`play-game-${game.id}`}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {translate("Play", instructionLanguage)}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center space-y-4"
        >
          <Button
            onClick={() => navigate('/progress')}
            variant="outline"
            className="border-2 border-violet-400 text-violet-700 hover:bg-violet-50 rounded-full px-8"
            data-testid="view-progress-button"
          >
            <Trophy className="w-5 h-5 mr-2" />
            {translate("View My Progress", instructionLanguage) || "View My Progress"}
          </Button>
          <p className="text-violet-600 font-bold text-lg">
            Powered by Ministar Game Studio ✨
          </p>
        </motion.div>
      </div>
    </div>
  );
}
