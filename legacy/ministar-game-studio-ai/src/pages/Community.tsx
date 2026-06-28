import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Globe, Search, Loader2, ArrowLeft, Gamepad2, Play, BookOpen, GraduationCap, Users
} from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type CommunityGame = Database["public"]["Views"]["community_games"]["Row"];

const GAME_EMOJIS: Record<string, string> = {
  quiz: "🎯", spelling: "✏️", true_false: "✅", drag_drop: "🔗",
  memory: "🃏", group_sort: "📦", fill_blank: "📝", word_search: "🔍",
  hangman: "🪢", typing_race: "⌨️", whack_a_mole: "🔨", sentence_builder: "🏗️",
  balloon_pop: "🎈", flashcards: "💡", word_ladder: "🪜", odd_one_out: "🦎",
  scramble_race: "🏃", crossword: "🗓️", jeopardy: "🏆",
};

const GAME_TYPES = [
  "quiz", "spelling", "true_false", "drag_drop", "memory", "group_sort",
  "fill_blank", "word_search", "hangman", "typing_race", "whack_a_mole",
  "sentence_builder", "balloon_pop", "flashcards", "word_ladder",
  "odd_one_out", "scramble_race", "crossword", "jeopardy",
];

const Community = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<CommunityGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gameTypeFilter, setGameTypeFilter] = useState<string>("all");
  const [audienceFilter, setAudienceFilter] = useState<string>("all");

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("community_games")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      toast.error("Failed to load community games");
      console.error(error);
    } else {
      setGames(data || []);
    }
    setLoading(false);
  };

  const filteredGames = games.filter((g) => {
    const searchMatch =
      search === "" ||
      (g.worksheet_title || "").toLowerCase().includes(search.toLowerCase()) ||
      (g.theme || "").toLowerCase().includes(search.toLowerCase()) ||
      (g.content_summary || "").toLowerCase().includes(search.toLowerCase());
    const typeMatch = gameTypeFilter === "all" || g.game_type === gameTypeFilter;
    const audienceMatch = audienceFilter === "all" || g.audience_level === audienceFilter;
    return searchMatch && typeMatch && audienceMatch;
  });

  // Unique audience levels from data
  const audienceLevels = Array.from(new Set(games.map((g) => g.audience_level).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">
              Community Bank
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Intro */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4 flex items-start gap-4">
            <Users className="h-10 w-10 text-primary shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-1">
                Discover games from teachers around the world
              </h2>
              <p className="text-sm text-muted-foreground">
                Browse games that other teachers have shared publicly. Play them instantly, or use them for inspiration for your own worksheets.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by theme, title, or summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Select value={gameTypeFilter} onValueChange={setGameTypeFilter}>
            <SelectTrigger className="w-auto min-w-[140px] rounded-xl">
              <Gamepad2 className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Game type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All games</SelectItem>
              {GAME_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {GAME_EMOJIS[t] || "🧩"} {t.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={audienceFilter} onValueChange={setAudienceFilter}>
            <SelectTrigger className="w-auto min-w-[150px] rounded-xl">
              <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {audienceLevels.map((lvl) => (
                <SelectItem key={lvl!} value={lvl!}>
                  {lvl}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredGames.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                No games found
              </h3>
              <p className="text-muted-foreground">
                {search || gameTypeFilter !== "all" || audienceFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No games have been shared to the Community Bank yet. Be the first!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map((game) => (
              <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{GAME_EMOJIS[game.game_type || ""] || "🧩"}</span>
                      <div>
                        <CardTitle className="text-base leading-tight">
                          {game.worksheet_title || "Untitled"}
                        </CardTitle>
                        <CardDescription className="text-xs capitalize">
                          {(game.game_type || "").replace(/_/g, " ")}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {game.theme && (
                      <Badge variant="secondary" className="text-xs">
                        {game.theme}
                      </Badge>
                    )}
                    {game.grade_level && (
                      <Badge variant="outline" className="text-xs">
                        Grade {game.grade_level}
                      </Badge>
                    )}
                    {game.audience_level && (
                      <Badge variant="outline" className="text-xs capitalize">
                        {game.audience_level}
                      </Badge>
                    )}
                  </div>
                  {game.content_summary && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {game.content_summary}
                    </p>
                  )}
                  <Button
                    size="sm"
                    className="w-full rounded-xl"
                    onClick={() => navigate(`/play/${game.share_code}`)}
                  >
                    <Play className="h-4 w-4 mr-1" /> Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Community;
