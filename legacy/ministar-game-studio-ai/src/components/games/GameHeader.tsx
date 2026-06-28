import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Trophy, Star, Zap, Heart, Volume2, VolumeX, Shield, Clock, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StreakFire } from "./effects/Particles";
import { isMuted, toggleMute } from "@/utils/audio";

interface GameHeaderProps {
  score: number;
  currentQuestion: number;
  totalQuestions: number;
  streak: number;
  timeElapsed: number;
  gameTitle: string;
  emoji: string;
  lives?: number;
  maxLives?: number;
  showLives?: boolean;
  combo?: number;
  onQuit?: () => void;
}

export function GameHeader({
  score,
  currentQuestion,
  totalQuestions,
  streak,
  timeElapsed,
  gameTitle,
  emoji,
  lives = 3,
  maxLives = 3,
  showLives = false,
  combo = 0,
  onQuit,
}: GameHeaderProps) {
  const [muted, setMuted] = useState(isMuted());
  const [prevScore, setPrevScore] = useState(score);
  const [scoreAnimating, setScoreAnimating] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const progress = (currentQuestion / totalQuestions) * 100;
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = Math.floor(timeElapsed % 60);

  useEffect(() => {
    if (score > prevScore) {
      setScoreAnimating(true);
      setTimeout(() => setScoreAnimating(false), 400);
    }
    setPrevScore(score);
  }, [score, prevScore]);

  const handleToggleMute = () => {
    const nowMuted = toggleMute();
    setMuted(nowMuted);
  };

  return (
    <>
      {/* Quit confirmation overlay */}
      <AnimatePresence>
        {showQuitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowQuitConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl p-6 border-2 border-border shadow-2xl max-w-sm w-full text-center"
            >
              <div className="text-5xl mb-3">🚪</div>
              <h3 className="font-display text-xl font-black text-foreground mb-2">Quit Game?</h3>
              <p className="text-sm text-muted-foreground font-body mb-5">
                Your progress will be lost. Are you sure?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQuitConfirm(false)}
                  className="flex-1 py-3 rounded-2xl font-display font-bold text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors"
                >
                  Keep Playing
                </button>
                <button
                  onClick={() => { setShowQuitConfirm(false); onQuit?.(); }}
                  className="flex-1 py-3 rounded-2xl font-display font-bold text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  Quit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-2xl mx-auto mb-6 px-2">
        {/* Top row: title, lives, controls */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {emoji}
            </motion.span>
            <h2 className="font-display text-lg font-bold text-foreground">{gameTitle}</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Mute toggle */}
            <button
              onClick={handleToggleMute}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              {muted ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {/* Quit button */}
            {onQuit && (
              <button
                onClick={() => setShowQuitConfirm(true)}
                className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors group"
                title="Quit game"
              >
                <X className="h-5 w-5 text-muted-foreground group-hover:text-destructive transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {/* Timer */}
          <div className="flex items-center gap-1 text-muted-foreground bg-muted/50 rounded-full px-3 py-1">
            <Timer className="h-3.5 w-3.5" />
            <span className="text-sm font-mono font-semibold">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>

          {/* Score */}
          <motion.div
            animate={scoreAnimating ? { scale: [1, 1.3, 1] } : {}}
            className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1 relative"
          >
            <Star className="h-3.5 w-3.5" />
            <span className="text-sm font-bold font-display">{score}</span>
          </motion.div>

          {/* Streak */}
          <AnimatePresence>
            {streak >= 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-1 bg-game-orange/15 text-game-orange rounded-full px-3 py-1 relative"
              >
                <StreakFire streak={streak} />
                <Zap className="h-3.5 w-3.5" />
                <span className="text-sm font-bold font-display">{streak}x</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lives */}
          {showLives && (
            <div className="flex items-center gap-0.5 ml-auto">
              {Array.from({ length: maxLives }, (_, i) => (
                <motion.span
                  key={i}
                  animate={i >= lives ? { scale: 0.7, opacity: 0.3 } : { scale: 1 }}
                  className="text-lg"
                >
                  {i < lives ? "❤️" : "🖤"}
                </motion.span>
              ))}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="h-4 bg-muted rounded-full overflow-hidden border border-border">
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--game-purple)), hsl(var(--game-pink)))",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground font-semibold">
              {currentQuestion}/{totalQuestions}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function useGameTimer() {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const stop = useCallback(() => setIsRunning(false), []);
  return { timeElapsed, stop };
}

export function useGameScore() {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const addCorrect = useCallback(() => {
    setStreak((s) => s + 1);
    setCorrectCount((c) => c + 1);
    setScore((prev) => {
      const streakBonus = Math.min(streak, 5);
      return prev + 100 + streakBonus * 50;
    });
  }, [streak]);

  const addIncorrect = useCallback(() => {
    setStreak(0);
  }, []);

  return { score, streak, correctCount, addCorrect, addIncorrect };
}
