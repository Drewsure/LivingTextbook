import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/App";
import { toast } from "sonner";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  Trophy, TrendingUp, Clock, Users, Target, Star, 
  Gamepad2, BarChart3, PieChart as PieChartIcon, Loader2, X
} from "lucide-react";

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#6366f1', '#ef4444'];

export default function AnalyticsDashboard({ onClose }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const response = await api.get('/teacher/analytics');
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-violet-600 mx-auto mb-4" />
            <p className="text-lg font-bold">Loading Analytics...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) return null;

  const { summary, game_metrics, game_type_distribution, theme_distribution, top_performers } = analytics;

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b shadow-sm z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Analytics Dashboard</h1>
              <p className="text-sm text-slate-500">Game Performance Insights</p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose} data-testid="close-analytics">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="container mx-auto px-4 pb-2">
          <div className="flex gap-2">
            {['overview', 'games', 'distribution'].map((tab) => (
              <Button
                key={tab}
                size="sm"
                variant={activeTab === tab ? 'default' : 'ghost'}
                className={activeTab === tab ? 'bg-violet-600' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-violet-500 to-violet-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-200 text-sm">Total Games</p>
                  <p className="text-3xl font-black">{summary.total_games}</p>
                </div>
                <Gamepad2 className="w-10 h-10 text-violet-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-200 text-sm">Total Plays</p>
                  <p className="text-3xl font-black">{summary.total_plays}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-pink-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-200 text-sm">Completed</p>
                  <p className="text-3xl font-black">{summary.total_completed}</p>
                </div>
                <Target className="w-10 h-10 text-cyan-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-200 text-sm">Avg Score</p>
                  <p className="text-3xl font-black">{summary.overall_avg_score}%</p>
                </div>
                <Trophy className="w-10 h-10 text-amber-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-200 text-sm">Players</p>
                  <p className="text-3xl font-black">{summary.unique_players}</p>
                </div>
                <Users className="w-10 h-10 text-emerald-300" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top by Plays */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-pink-600" />
                  Most Played Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {top_performers.by_plays.map((game, i) => (
                    <div key={game.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-slate-300'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{game.title}</p>
                        <p className="text-xs text-slate-500">{game.game_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-pink-600">{game.total_plays}</p>
                        <p className="text-xs text-slate-500">plays</p>
                      </div>
                    </div>
                  ))}
                  {top_performers.by_plays.length === 0 && (
                    <p className="text-slate-500 text-center py-4">No data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top by Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="w-5 h-5 text-amber-600" />
                  Highest Scoring Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {top_performers.by_score.map((game, i) => (
                    <div key={game.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-slate-300'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{game.title}</p>
                        <p className="text-xs text-slate-500">{game.game_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-600">{game.avg_score}%</p>
                        <p className="text-xs text-slate-500">avg score</p>
                      </div>
                    </div>
                  ))}
                  {top_performers.by_score.length === 0 && (
                    <p className="text-slate-500 text-center py-4">No scores recorded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top by Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-emerald-600" />
                  Best Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {top_performers.by_completion.map((game, i) => (
                    <div key={game.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-slate-300'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{game.title}</p>
                        <p className="text-xs text-slate-500">{game.game_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">{game.completion_rate}%</p>
                        <p className="text-xs text-slate-500">completed</p>
                      </div>
                    </div>
                  ))}
                  {top_performers.by_completion.length === 0 && (
                    <p className="text-slate-500 text-center py-4">No completions yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'games' && (
          <Card>
            <CardHeader>
              <CardTitle>All Games Performance</CardTitle>
              <CardDescription>Detailed metrics for each game</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">Game</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">Theme</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-600">Plays</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-600">Avg Score</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-600">Avg Time</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-600">Completion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {game_metrics.map((game) => (
                      <tr key={game.id} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {game.is_favorite && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                            <span className="font-medium">{game.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-full text-xs font-medium">
                            {game.game_type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-medium">
                            {game.theme}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-pink-600">{game.total_plays}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-bold ${game.avg_score >= 70 ? 'text-emerald-600' : game.avg_score >= 50 ? 'text-amber-600' : 'text-slate-400'}`}>
                            {game.avg_score > 0 ? `${game.avg_score}%` : '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-600">
                          {game.avg_time_seconds > 0 ? `${Math.floor(game.avg_time_seconds / 60)}:${String(Math.floor(game.avg_time_seconds % 60)).padStart(2, '0')}` : '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-bold ${game.completion_rate >= 70 ? 'text-emerald-600' : game.completion_rate >= 50 ? 'text-amber-600' : 'text-slate-400'}`}>
                            {game.completion_rate > 0 ? `${game.completion_rate}%` : '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {game_metrics.length === 0 && (
                  <p className="text-slate-500 text-center py-8">No games created yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'distribution' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Game Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-violet-600" />
                  Games by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                {game_type_distribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={game_type_distribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, games }) => `${name} (${games})`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="games"
                      >
                        {game_type_distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-500 text-center py-12">No data available</p>
                )}
              </CardContent>
            </Card>

            {/* Plays by Game Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-pink-600" />
                  Plays by Game Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                {game_type_distribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={game_type_distribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="plays" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-500 text-center py-12">No data available</p>
                )}
              </CardContent>
            </Card>

            {/* Theme Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-teal-600" />
                  Games by Theme
                </CardTitle>
              </CardHeader>
              <CardContent>
                {theme_distribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={theme_distribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, games }) => `${name} (${games})`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="games"
                      >
                        {theme_distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-500 text-center py-12">No data available</p>
                )}
              </CardContent>
            </Card>

            {/* Plays by Theme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  Plays by Theme
                </CardTitle>
              </CardHeader>
              <CardContent>
                {theme_distribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={theme_distribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="plays" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-500 text-center py-12">No data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
