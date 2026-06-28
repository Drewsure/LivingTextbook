import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gamepad2, ArrowRight, Loader2, User, Star } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
import { CrosswordGame } from "@/components/games/CrosswordGame";
import { JeopardyGame } from "@/components/games/JeopardyGame";
import { BossBattleGame } from "@/components/games/BossBattleGame";
import { MysteryDetectiveGame } from "@/components/games/MysteryDetectiveGame";
import { DictationGame } from "@/components/games/DictationGame";

type Game = Database["public"]["Tables"]["games"]["Row"];

const Play = () => {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const isDirect = searchParams.get("direct") === "true";
  const navigate = useNavigate();
  const { student, isOnboarded, loading: studentLoading, createProfile } = useStudent();
  const [shareCode, setShareCode] = useState(code || "");
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<Game | null>(null);

  const loadGame = async (codeToLoad: string) => {
    if (!codeToLoad.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("share_code", codeToLoad.trim().toUpperCase())
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        toast.error("Game not found. Check your code and try again.");
        return;
      }
      if (isDirect) {
        // Teacher preview: load the game directly inline
        setGame(data);
      } else {
        // Student flow: redirect to the games landing page
        navigate(`/games/${data.worksheet_id}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load game");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code && (isDirect || isOnboarded)) loadGame(code);
  }, [code, isOnboarded, isDirect]);

  const handleExit = () => {
    setGame(null);
    setShareCode("");
    navigate("/play");
  };

  // Show loading while checking student status
  if (studentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show onboarding if not onboarded (skip for direct teacher preview)
  if (!isOnboarded && !isDirect) {
    return (
      <StudentOnboarding
        onComplete={async (name, avatar) => {
          await createProfile(name, avatar);
          if (code) loadGame(code);
        }}
      />
    );
  }

  if (game) {
    const gameData = game.game_data as any;

    switch (game.game_type) {
      case "quiz":
        return <QuizGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "spelling":
        return <SpellingGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "true_false":
        return <TrueFalseGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "drag_drop":
        return <MatchingGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "memory":
        return <MemoryGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "group_sort":
        return <GroupSortGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "fill_blank":
        return <FillBlankGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "word_search":
        return <WordSearchGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "hangman":
        return <HangmanGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "typing_race":
        return <TypingRaceGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "whack_a_mole":
        return <WhackAMoleGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "sentence_builder":
        return <SentenceBuilderGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "balloon_pop":
        return <BalloonPopGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "flashcards":
        return <FlashcardsGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "word_ladder":
        return <WordLadderGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "odd_one_out":
        return <OddOneOutGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "scramble_race":
        return <ScrambleRaceGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "crossword":
        return <CrosswordGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "jeopardy":
        return <JeopardyGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "boss_battle":
        return <BossBattleGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "mystery_detective":
        return <MysteryDetectiveGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      case "dictation":
        return <DictationGame gameData={gameData} gameId={game.id} onExit={handleExit} />;
      default:
        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-xl font-display font-bold text-foreground mb-4">
                Unknown game type: {game.game_type}
              </p>
              <Button onClick={handleExit} className="rounded-xl">Go Back</Button>
            </div>
          </div>
        );
    }
  }

  const levelInfo = student ? getLevelFromXp(student.xp) : null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
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

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
        >
          <Gamepad2 className="h-16 w-16 text-primary mx-auto mb-4" />
        </motion.div>
        
        <h1 className="font-display text-3xl font-black text-foreground mb-2">Play a Game!</h1>
        <p className="text-muted-foreground mb-8 font-body">Enter the code your teacher gave you</p>

        <div className="bg-card rounded-3xl p-6 border border-border shadow-xl space-y-4">
          <Input
            placeholder="Enter game code"
            value={shareCode}
            onChange={(e) => setShareCode(e.target.value.toUpperCase())}
            className="text-center text-2xl font-display font-bold tracking-widest h-14 rounded-xl"
            maxLength={8}
            onKeyDown={(e) => e.key === "Enter" && loadGame(shareCode)}
          />
          <Button
            className="w-full rounded-xl text-lg py-6 font-display font-bold"
            onClick={() => loadGame(shareCode)}
            disabled={!shareCode.trim() || loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <ArrowRight className="h-5 w-5 mr-2" />
            )}
            Let's Go!
          </Button>
        </div>

        <div className="flex gap-2 mt-4 justify-center">
          <Button variant="link" onClick={() => navigate("/")}>
            ← Home
          </Button>
          <Button variant="link" onClick={() => navigate("/profile")}>
            <User className="h-4 w-4 mr-1" />
            My Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Play;
