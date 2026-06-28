import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Gamepad2, Play, Trophy, Users, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";
import { useStudent, getLevelFromXp, getLevelTitle } from "@/lib/student";
import { StudentOnboarding } from "@/components/StudentOnboarding";
import { QuizGame } from "@/components/games/QuizGame";
import { SpellingGame } from "@/components/games/SpellingGame";
import { TrueFalseGame } from "@/components/games/TrueFalseGame";
import { MatchingGame } from "@/components/games/MatchingGame";
import { MemoryGame } from "@/components/games/MemoryGame";
import { GroupSortGame } from "@/components/games/GroupSortGame";
import { FillBlankGame } from "@/components/games/FillBlankGame";
import { WordSearchGame } from "@/components/games/WordSearchGame";
import { HangmanGame } from "@/components/games/HangmanGame";
import { TypingRaceGame } from "@/components/games/TypingRaceGame";
import { WhackAMoleGame } from "@/components/games/WhackAMoleGame";
import { SentenceBuilderGame } from "@/components/games/SentenceBuilderGame";
import { BalloonPopGame } from "@/components/games/BalloonPopGame";
import { FlashcardsGame } from "@/components/games/FlashcardsGame";
import { WordLadderGame } from "@/components/games/WordLadderGame";
import { OddOneOutGame } from "@/components/games/OddOneOutGame";
import { ScrambleRaceGame } from "@/components/games/ScrambleRaceGame";
import { SpeakableText } from "@/components/games/SpeakableText";
import { CrosswordGame } from "@/components/games/CrosswordGame";
import { JeopardyGame } from "@/components/games/JeopardyGame";
import { BossBattleGame } from "@/components/games/BossBattleGame";
import { MysteryDetectiveGame } from "@/components/games/MysteryDetectiveGame";
import { DictationGame } from "@/components/games/DictationGame";
import { Star } from "lucide-react";

type Game = Database["public"]["Tables"]["games"]["Row"];

const GAME_META: Record<string, { icon: string; label: string; color: string }> = {
  quiz: { icon: "🎯", label: "クイズ / Quiz", color: "hsl(var(--primary))" },
  spelling: { icon: "✏️", label: "スペリング / Spelling", color: "hsl(var(--game-green))" },
  true_false: { icon: "✅", label: "〇✕ / True or False", color: "hsl(var(--game-blue))" },
  drag_drop: { icon: "🧩", label: "マッチング / Matching", color: "hsl(var(--game-orange))" },
  memory: { icon: "🃏", label: "メモリー / Memory", color: "hsl(var(--game-pink))" },
  group_sort: { icon: "📦", label: "グループ分け / Group Sort", color: "hsl(var(--game-purple))" },
  fill_blank: { icon: "📝", label: "穴埋め / Fill in the Blank", color: "hsl(var(--game-blue))" },
  word_search: { icon: "🔍", label: "ワードサーチ / Word Search", color: "hsl(var(--game-green))" },
  hangman: { icon: "🪢", label: "ハングマン / Hangman", color: "hsl(var(--game-orange))" },
  typing_race: { icon: "⌨️", label: "タイピングレース / Typing Race", color: "hsl(var(--game-pink))" },
  whack_a_mole: { icon: "🔨", label: "モグラたたき / Whack-a-Mole", color: "hsl(var(--game-purple))" },
  sentence_builder: { icon: "🏗️", label: "文章作り / Sentence Builder", color: "hsl(var(--primary))" },
  balloon_pop: { icon: "🎈", label: "バルーンポップ / Balloon Pop", color: "hsl(var(--game-pink))" },
  flashcards: { icon: "🃏", label: "フラッシュカード / Flashcards", color: "hsl(var(--game-blue))" },
  word_ladder: { icon: "🪜", label: "ワードラダー / Word Ladder", color: "hsl(var(--game-green))" },
  odd_one_out: { icon: "🔮", label: "仲間はずれ / Odd One Out", color: "hsl(var(--game-orange))" },
  scramble_race: { icon: "🏃", label: "スクランブル / Scramble Race", color: "hsl(var(--game-purple))" },
  crossword: { icon: "🧩", label: "クロスワード / Crossword", color: "hsl(var(--game-blue))" },
  jeopardy: { icon: "🏆", label: "ジェパディ / Jeopardy!", color: "hsl(var(--secondary))" },
  boss_battle: { icon: "👹", label: "ボスバトル / Boss Battle", color: "hsl(var(--destructive))" },
  mystery_detective: { icon: "🕵️", label: "探偵ミステリー / Mystery Detective", color: "hsl(var(--game-purple))" },
  dictation: { icon: "🎧", label: "ディクテーション / Dictation", color: "hsl(var(--game-blue))" },
};

const GamesLanding = () => {
  const { worksheetId } = useParams();
  const navigate = useNavigate();
  const { student, isOnboarded, loading: studentLoading, createProfile } = useStudent();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [instructionLang, setInstructionLang] = useState("en");

  useEffect(() => {
    if (!worksheetId) return;
    loadGames();
  }, [worksheetId]);

  const loadGames = async () => {
    if (worksheetId) {
      const { data: ws } = await supabase
        .from("worksheets")
        .select("instruction_language")
        .eq("id", worksheetId)
        .single();
      if (ws?.instruction_language) setInstructionLang(ws.instruction_language);
    }

    const { data } = await supabase
      .from("games")
      .select("*")
      .eq("worksheet_id", worksheetId!)
      .eq("is_active", true);
    setGames(data || []);

    if (data) {
      const gameIds = data.map((g) => g.id);
      if (gameIds.length > 0) {
        const { data: entries } = await supabase
          .from("leaderboard_entries")
          .select("game_id")
          .in("game_id", gameIds);
        const c: Record<string, number> = {};
        entries?.forEach((e) => {
          c[e.game_id] = (c[e.game_id] || 0) + 1;
        });
        setCounts(c);
      }
    }
    setLoading(false);
  };

  const handleExit = () => setActiveGame(null);

  if (loading || studentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isOnboarded) {
    return (
      <StudentOnboarding
        onComplete={async (name, avatar) => {
          await createProfile(name, avatar);
        }}
      />
    );
  }

  if (activeGame) {
    const gameData = activeGame.game_data as any;
    const props = { gameData, gameId: activeGame.id, onExit: handleExit, instructionLang };

    switch (activeGame.game_type) {
      case "quiz": return <QuizGame {...props} />;
      case "spelling": return <SpellingGame {...props} />;
      case "true_false": return <TrueFalseGame {...props} />;
      case "drag_drop": return <MatchingGame {...props} />;
      case "memory": return <MemoryGame {...props} />;
      case "group_sort": return <GroupSortGame {...props} />;
      case "fill_blank": return <FillBlankGame {...props} />;
      case "word_search": return <WordSearchGame {...props} />;
      case "hangman": return <HangmanGame {...props} />;
      case "typing_race": return <TypingRaceGame {...props} />;
      case "whack_a_mole": return <WhackAMoleGame {...props} />;
      case "sentence_builder": return <SentenceBuilderGame {...props} />;
      case "balloon_pop": return <BalloonPopGame {...props} />;
      case "flashcards": return <FlashcardsGame {...props} />;
      case "word_ladder": return <WordLadderGame {...props} />;
      case "odd_one_out": return <OddOneOutGame {...props} />;
      case "scramble_race": return <ScrambleRaceGame {...props} />;
      case "crossword": return <CrosswordGame {...props} />;
      case "jeopardy": return <JeopardyGame {...props} />;
      case "boss_battle": return <BossBattleGame {...props} />;
      case "mystery_detective": return <MysteryDetectiveGame {...props} />;
      case "dictation": return <DictationGame {...props} />;
      default:
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-xl font-display font-bold text-foreground mb-4">
                Unknown game type: {activeGame.game_type}
              </p>
              <Button onClick={handleExit} className="rounded-xl">Go Back</Button>
            </div>
          </div>
        );
    }
  }

  const levelInfo = student ? getLevelFromXp(student.xp) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-6">
        {/* Student identity bar */}
        {student && (
          <motion.button
            onClick={() => navigate("/profile")}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            className="w-full bg-card rounded-2xl p-3 border border-border shadow-lg mb-6 flex items-center gap-3 text-left cursor-pointer hover:border-primary/30 transition-colors"
          >
            <span className="text-4xl">{student.avatar}</span>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-foreground truncate">
                {student.player_name}
              </div>
              <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                <Star className="h-3 w-3 text-primary" />
                Level {levelInfo?.level} · {getLevelTitle(levelInfo?.level || 1)}
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-primary text-sm">{student.xp} XP</div>
              <div className="text-xs text-muted-foreground">{student.total_games_played} games</div>
            </div>
          </motion.button>
        )}

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl mb-3"
          >
            🎮
          </motion.div>
          <SpeakableText text="Choose a game and start playing!">
            <h1 className="font-display text-3xl md:text-4xl font-black text-foreground mb-2">
              ゲームを選んでプレイを始めよう!
            </h1>
          </SpeakableText>
          <SpeakableText text="Choose a game and start playing">
            <p className="text-muted-foreground font-body">Choose a game and start playing!</p>
          </SpeakableText>
        </motion.div>

        {games.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">😕</div>
            <p className="text-muted-foreground font-display font-bold">No games available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {games.map((game, i) => {
              const meta = GAME_META[game.game_type] || { icon: "🎮", label: game.game_type, color: "hsl(var(--primary))" };
              const playCount = counts[game.id] || 0;

              return (
                <SpeakableText key={game.id} text={meta.label.split(" / ")[1] || meta.label}>
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.05, type: "spring", damping: 15 }}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveGame(game)}
                    className="bg-card rounded-2xl p-4 border-2 border-border shadow-xl cursor-pointer hover:border-primary/30 transition-colors relative overflow-hidden group w-full"
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                      style={{ backgroundColor: meta.color }}
                    />

                    <div className="text-4xl mb-2">{meta.icon}</div>
                    <h3 className="font-display text-sm font-black text-foreground mb-1 leading-tight">{meta.label}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {playCount}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                        <Play className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                </SpeakableText>
              );
            })}
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => navigate("/play")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Enter a different code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GamesLanding;
