import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Clock, Flame, ArrowLeft, Medal, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type LeaderboardEntry = Database["public"]["Tables"]["leaderboard_entries"]["Row"];

const MEDALS = ["🥇", "🥈", "🥉"];

const Leaderboard = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"score" | "time" | "recent">("score");

  useEffect(() => {
    if (!gameId) return;
    loadEntries();
  }, [gameId]);

  const loadEntries = async () => {
    const { data } = await supabase
      .from("leaderboard_entries")
      .select("*")
      .eq("game_id", gameId!)
      .order("score", { ascending: false })
      .limit(50);
    setEntries(data || []);
    setLoading(false);
  };

  const sorted = [...entries].sort((a, b) => {
    if (tab === "score") return b.score - a.score;
    if (tab === "time") return (a.time_taken_seconds ?? 9999) - (b.time_taken_seconds ?? 9999);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-6">
          <div className="text-5xl mb-2">🏆</div>
          <h1 className="font-display text-3xl font-black text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground text-sm">Top players for this game</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {([
            { key: "score" as const, icon: <Trophy className="h-4 w-4" />, label: "Top Score" },
            { key: "time" as const, icon: <Clock className="h-4 w-4" />, label: "Fastest" },
            { key: "recent" as const, icon: <Star className="h-4 w-4" />, label: "Recent" },
          ]).map((t) => (
            <Button
              key={t.key}
              variant={tab === t.key ? "default" : "outline"}
              size="sm"
              onClick={() => setTab(t.key)}
              className="rounded-full gap-1"
            >
              {t.icon} {t.label}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Loading...</div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-muted-foreground font-display font-bold">No scores yet!</p>
            <p className="text-sm text-muted-foreground">Be the first to play and submit your score.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((entry, i) => {
              const mins = entry.time_taken_seconds ? Math.floor(entry.time_taken_seconds / 60) : 0;
              const secs = entry.time_taken_seconds ? entry.time_taken_seconds % 60 : 0;
              const isTop3 = i < 3;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border ${
                    isTop3 ? "bg-primary/5 border-primary/20" : "bg-card border-border"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-lg bg-muted">
                    {isTop3 ? MEDALS[i] : <span className="text-muted-foreground">{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-foreground truncate">{entry.player_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-primary">{entry.score}</div>
                    {entry.time_taken_seconds != null && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" />
                        {mins}:{secs.toString().padStart(2, "0")}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
