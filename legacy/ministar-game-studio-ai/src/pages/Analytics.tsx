import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Users, FileText, Trophy, TrendingUp, BarChart3, ArrowLeft, Loader2, PieChart } from "lucide-react";
import { t } from "@/utils/translations";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, LineChart, Line } from "recharts";

const CHART_COLORS = [
  "hsl(262, 83%, 58%)",
  "hsl(45, 100%, 65%)",
  "hsl(340, 82%, 62%)",
  "hsl(145, 72%, 50%)",
  "hsl(210, 100%, 56%)",
  "hsl(28, 100%, 58%)",
];

const Analytics = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorksheets: 0,
    totalGames: 0,
    totalPlays: 0,
    totalStudents: 0,
    avgScore: 0,
    gameTypeBreakdown: [] as { name: string; value: number }[],
    contentTypeBreakdown: [] as { name: string; value: number }[],
    recentActivity: [] as { date: string; games: number; plays: number }[],
    topGames: [] as { name: string; plays: number; avgScore: number }[],
  });

  useEffect(() => {
    if (user) loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    try {
      // Fetch worksheets
      const { data: worksheets } = await supabase
        .from("worksheets")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch games
      const worksheetIds = worksheets?.map((w) => w.id) || [];
      let allGames: any[] = [];
      if (worksheetIds.length > 0) {
        const { data: games } = await supabase
          .from("games")
          .select("*")
          .in("worksheet_id", worksheetIds);
        allGames = games || [];
      }

      // Fetch leaderboard entries
      const gameIds = allGames.map((g) => g.id);
      let allEntries: any[] = [];
      if (gameIds.length > 0) {
        const { data: entries } = await supabase
          .from("leaderboard_entries")
          .select("*")
          .in("game_id", gameIds);
        allEntries = entries || [];
      }

      // Fetch unique students
      const { data: students } = await supabase
        .from("student_profiles")
        .select("id");

      // Game type breakdown
      const gameTypeCounts: Record<string, number> = {};
      allGames.forEach((g) => {
        gameTypeCounts[g.game_type] = (gameTypeCounts[g.game_type] || 0) + 1;
      });
      const gameTypeBreakdown = Object.entries(gameTypeCounts).map(([name, value]) => ({
        name: name.replace("_", " "),
        value,
      }));

      // Content type breakdown
      const contentTypeCounts: Record<string, number> = {};
      worksheets?.forEach((w) => {
        contentTypeCounts[w.content_type] = (contentTypeCounts[w.content_type] || 0) + 1;
      });
      const contentTypeBreakdown = Object.entries(contentTypeCounts).map(([name, value]) => ({
        name,
        value,
      }));

      // Recent activity (last 7 days)
      const now = new Date();
      const recentActivity = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const dayGames = allGames.filter(
          (g) => g.created_at.split("T")[0] === dateStr
        ).length;
        const dayPlays = allEntries.filter(
          (e) => e.created_at.split("T")[0] === dateStr
        ).length;
        recentActivity.push({
          date: date.toLocaleDateString("en", { weekday: "short" }),
          games: dayGames,
          plays: dayPlays,
        });
      }

      // Top games by plays
      const gamePlayCounts: Record<string, { plays: number; totalScore: number; type: string }> = {};
      allEntries.forEach((e) => {
        if (!gamePlayCounts[e.game_id]) {
          gamePlayCounts[e.game_id] = { plays: 0, totalScore: 0, type: "" };
        }
        gamePlayCounts[e.game_id].plays++;
        gamePlayCounts[e.game_id].totalScore += e.score;
      });
      allGames.forEach((g) => {
        if (gamePlayCounts[g.id]) {
          gamePlayCounts[g.id].type = g.game_type;
        }
      });
      const topGames = Object.entries(gamePlayCounts)
        .sort(([, a], [, b]) => b.plays - a.plays)
        .slice(0, 5)
        .map(([, data]) => ({
          name: data.type.replace("_", " "),
          plays: data.plays,
          avgScore: Math.round(data.totalScore / data.plays),
        }));

      const avgScore =
        allEntries.length > 0
          ? Math.round(allEntries.reduce((sum, e) => sum + e.score, 0) / allEntries.length)
          : 0;

      setStats({
        totalWorksheets: worksheets?.length || 0,
        totalGames: allGames.length,
        totalPlays: allEntries.length,
        totalStudents: students?.length || 0,
        avgScore,
        gameTypeBreakdown,
        contentTypeBreakdown,
        recentActivity,
        topGames,
      });
    } catch (err) {
      console.error("Analytics load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">
              Analytics <span className="text-primary">Dashboard</span>
            </span>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">{profile?.display_name}</span>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Worksheets", value: stats.totalWorksheets, icon: FileText, color: "text-primary" },
            { label: "Games Created", value: stats.totalGames, icon: Gamepad2, color: "text-accent" },
            { label: "Total Plays", value: stats.totalPlays, icon: Trophy, color: "text-secondary-foreground" },
            { label: "Avg Score", value: `${stats.avgScore}%`, icon: TrendingUp, color: "text-primary" },
          ].map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <p className="font-display text-3xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">7-Day Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats.recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Line type="monotone" dataKey="plays" stroke="hsl(262, 83%, 58%)" strokeWidth={2} dot={{ r: 4 }} name="Plays" />
                  <Line type="monotone" dataKey="games" stroke="hsl(340, 82%, 62%)" strokeWidth={2} dot={{ r: 4 }} name="Games Created" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Game Type Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Game Types</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.gameTypeBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={stats.gameTypeBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.gameTypeBreakdown.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  <PieChart className="h-8 w-8 mr-2 opacity-40" />
                  No games yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Games */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Top Games by Plays</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.topGames.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.topGames}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Bar dataKey="plays" fill="hsl(262, 83%, 58%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No play data yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Types */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Worksheet Types</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.contentTypeBreakdown.length > 0 ? (
                <div className="space-y-4 pt-4">
                  {stats.contentTypeBreakdown.map((ct, i) => (
                    <div key={ct.name} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="capitalize text-foreground font-medium flex-1">{ct.name}</span>
                      <span className="font-display font-bold text-foreground">{ct.value}</span>
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(ct.value / stats.totalWorksheets) * 100}%`,
                            backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No worksheets yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
