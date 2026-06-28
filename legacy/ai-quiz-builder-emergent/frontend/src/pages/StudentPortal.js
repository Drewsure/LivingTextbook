import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/App";
import { toast } from "sonner";
import { Sparkles, LogOut, Gamepad2, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentPortal({ user, setUser }) {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAccessGame() {
    if (!code.trim()) {
      toast.error('Please enter a game code');
      return;
    }
    
    setLoading(true);
    try {
      await api.get(`/games/by-code/${code.toUpperCase()}`);
      navigate(`/play/${code.toUpperCase()}`);
    } catch (error) {
      toast.error('Game not found. Please check the code.');
    }
    setLoading(false);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
    toast.success('Logged out successfully');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-fuchsia-50 student-theme">
      {/* Header */}
      <nav className="bg-white/90 backdrop-blur-md border-b-4 border-violet-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-3 rounded-2xl animate-float">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-violet-900">Game Arcade</h1>
              <p className="text-sm text-violet-600 font-bold">Let's Learn & Play!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-violet-900">{user.name}</p>
            </div>
            <Button 
              onClick={handleLogout}
              className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black shadow-lg"
              data-testid="student-logout-button"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 p-8 rounded-3xl shadow-2xl">
              <Gamepad2 className="w-20 h-20 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl lg:text-7xl font-black mb-4 text-violet-900">
            Ready to Play?
          </h1>
          <p className="text-xl font-bold text-violet-700 mb-8">
            Enter your game code to start learning!
          </p>
        </motion.div>

        {/* Code Entry Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-4 border-violet-200 shadow-2xl rounded-3xl bg-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white pb-8">
              <CardTitle className="text-3xl font-black text-center flex items-center justify-center gap-3">
                <Trophy className="w-8 h-8" />
                Enter Game Code
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <Input
                    type="text"
                    placeholder="ABC123"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && handleAccessGame()}
                    className="h-16 text-center text-3xl font-black tracking-widest border-4 border-violet-200 rounded-2xl bg-violet-50 text-violet-900 focus:ring-4 focus:ring-violet-300 focus:border-violet-400"
                    maxLength={6}
                    data-testid="game-code-input"
                  />
                </div>
                
                <Button
                  onClick={handleAccessGame}
                  disabled={loading || !code}
                  className="w-full h-16 text-2xl font-black rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-[0_6px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_3px_0_0_rgba(0,0,0,0.2)] hover:translate-y-[3px] active:translate-y-[6px] active:shadow-none transition-all"
                  data-testid="access-game-button"
                >
                  {loading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    <>
                      <Gamepad2 className="w-6 h-6 mr-3" />
                      Start Game!
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fun Decorations */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="bg-white p-6 rounded-3xl border-4 border-pink-200 shadow-lg text-center"
          >
            <div className="text-5xl mb-3">🎯</div>
            <p className="font-bold text-violet-900">Fun Games</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="bg-white p-6 rounded-3xl border-4 border-yellow-200 shadow-lg text-center"
          >
            <div className="text-5xl mb-3">⭐</div>
            <p className="font-bold text-violet-900">Learn English</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="bg-white p-6 rounded-3xl border-4 border-green-200 shadow-lg text-center"
          >
            <div className="text-5xl mb-3">🏆</div>
            <p className="font-bold text-violet-900">Win Prizes</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}