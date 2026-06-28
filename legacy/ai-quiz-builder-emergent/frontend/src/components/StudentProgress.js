import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/App";
import { toast } from "sonner";
import { translate } from "@/utils/translations";
import { 
  Trophy, Star, Medal, Flame, Target, Gamepad2, 
  Calendar, TrendingUp, Award, Loader2, Search
} from "lucide-react";

const badgeConfig = {
  starter: { icon: '🌟', name: 'Starter', description: '10 games played' },
  dedicated: { icon: '🔥', name: 'Dedicated', description: '50 games played' },
  master: { icon: '👑', name: 'Master', description: '100 games played' },
  perfectionist: { icon: '💯', name: 'Perfectionist', description: '90%+ score' },
  streak_week: { icon: '📅', name: 'Week Warrior', description: '7 day streak' },
  streak_month: { icon: '🏆', name: 'Month Master', description: '30 day streak' }
};

export default function StudentProgress({ instructionLanguage = 'ja' }) {
  const [studentName, setStudentName] = useState('');
  const [progress, setProgress] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function searchProgress() {
    if (!studentName.trim()) {
      toast.error('Please enter your name!');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get(`/student/progress/${encodeURIComponent(studentName)}`);
      setProgress(response.data.progress);
      setRecentSessions(response.data.recent_sessions);
      setSearched(true);
    } catch (error) {
      if (error.response?.status === 404) {
        setProgress(null);
        setSearched(true);
        toast.info('No progress found. Play some games first!');
      } else {
        toast.error('Failed to load progress');
      }
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search Card */}
      <Card className="border-4 border-violet-300 rounded-3xl shadow-xl mb-6">
        <CardHeader className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-t-2xl">
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            <Trophy className="w-8 h-8" />
            {translate("Your Progress", instructionLanguage) || "My Progress"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Input
              placeholder={translate("Enter your name", instructionLanguage)}
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchProgress()}
              className="h-14 text-xl font-bold border-4 border-violet-200 rounded-xl"
              data-testid="student-name-search"
            />
            <Button
              onClick={searchProgress}
              disabled={loading}
              className="h-14 px-8 bg-violet-600 hover:bg-violet-700 rounded-xl"
              data-testid="search-progress-button"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Search className="w-6 h-6" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Display */}
      {searched && progress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-0 rounded-2xl">
              <CardContent className="p-4 text-center">
                <Gamepad2 className="w-10 h-10 mx-auto mb-2 opacity-80" />
                <p className="text-4xl font-black">{progress.total_games_played}</p>
                <p className="text-sm opacity-80">Games Played</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 rounded-2xl">
              <CardContent className="p-4 text-center">
                <Star className="w-10 h-10 mx-auto mb-2 opacity-80" />
                <p className="text-4xl font-black">{progress.average_score}%</p>
                <p className="text-sm opacity-80">Avg Score</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 rounded-2xl">
              <CardContent className="p-4 text-center">
                <Trophy className="w-10 h-10 mx-auto mb-2 opacity-80" />
                <p className="text-4xl font-black">{progress.best_score}%</p>
                <p className="text-sm opacity-80">Best Score</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0 rounded-2xl">
              <CardContent className="p-4 text-center">
                <Flame className="w-10 h-10 mx-auto mb-2 opacity-80" />
                <p className="text-4xl font-black">{progress.streak_days}</p>
                <p className="text-sm opacity-80">Day Streak</p>
              </CardContent>
            </Card>
          </div>

          {/* Badges */}
          <Card className="border-4 border-yellow-300 rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Award className="w-6 h-6 text-yellow-600" />
                Badges Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              {progress.badges && progress.badges.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {progress.badges.map((badge) => (
                    <motion.div
                      key={badge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-3 rounded-2xl border-2 border-yellow-300"
                    >
                      <span className="text-4xl">{badgeConfig[badge]?.icon || '🏅'}</span>
                      <div>
                        <p className="font-bold text-amber-900">{badgeConfig[badge]?.name || badge}</p>
                        <p className="text-xs text-amber-700">{badgeConfig[badge]?.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Medal className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No badges yet. Keep playing to earn badges!</p>
                </div>
              )}
              
              {/* Locked badges preview */}
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-slate-500 mb-3">Badges to unlock:</p>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(badgeConfig)
                    .filter(([key]) => !progress.badges?.includes(key))
                    .map(([key, config]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl opacity-50"
                      >
                        <span className="text-2xl grayscale">{config.icon}</span>
                        <span className="text-sm text-slate-600">{config.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-4 border-violet-200 rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calendar className="w-6 h-6 text-violet-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          session.score >= 80 ? 'bg-emerald-100' : session.score >= 50 ? 'bg-amber-100' : 'bg-red-100'
                        }`}>
                          {session.score >= 80 ? (
                            <Trophy className="w-6 h-6 text-emerald-600" />
                          ) : session.score >= 50 ? (
                            <Star className="w-6 h-6 text-amber-600" />
                          ) : (
                            <Target className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">Game Session</p>
                          <p className="text-sm text-slate-500">
                            {new Date(session.created_at).toLocaleDateString()} • {Math.floor(session.time_spent / 60)}m {session.time_spent % 60}s
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-black ${
                          session.score >= 80 ? 'text-emerald-600' : session.score >= 50 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {session.score}%
                        </p>
                        <p className="text-xs text-slate-500">
                          {session.completed ? '✓ Completed' : 'In Progress'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* No Progress Found */}
      {searched && !progress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Gamepad2 className="w-20 h-20 mx-auto mb-4 text-slate-300" />
          <h3 className="text-2xl font-bold text-slate-600 mb-2">No Progress Found</h3>
          <p className="text-slate-500">Play some games and enter your name on the leaderboard to track your progress!</p>
        </motion.div>
      )}
    </div>
  );
}
