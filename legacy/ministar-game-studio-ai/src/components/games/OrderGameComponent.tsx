import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, ScorePopup, CountdownOverlay } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound, playSelectSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";

interface OrderQuestion {
  instruction: string;
  items: string[];
  correct_order: string[];
}

interface OrderGameProps {
  gameData: { questions: OrderQuestion[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ITEM_COLORS = [
  "hsl(262, 83%, 58%)", "hsl(210, 100%, 56%)", "hsl(28, 100%, 58%)",
  "hsl(340, 82%, 62%)", "hsl(145, 72%, 50%)", "hsl(180, 60%, 45%)",
];

export function OrderGame({ gameData, gameId, onExit, instructionLang = "en" }: OrderGameProps) {
  const questions = gameData.questions;
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [pool, setPool] = useState<string[]>(() => shuffle([...questions[0].items]));
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [scorePopup, setScorePopup] = useState<{ points: number; streak: number } | null>(null);
  const [theme] = useState(getRandomTheme);

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  const current = questions[currentIndex];

  const handleTap = useCallback((item: string, fromPlaced: boolean, index: number) => {
    if (showResult || !started) return;
    playSelectSound();
    if (fromPlaced) {
      setPlaced(prev => prev.filter((_, i) => i !== index));
      setPool(prev => [...prev, item]);
    } else {
      setPool(prev => prev.filter((_, i) => i !== index));
      setPlaced(prev => [...prev, item]);
    }
  }, [showResult, started]);

  const checkAnswer = useCallback(() => {
    if (showResult) return;
    const correct = placed.every((item, i) => item === current.correct_order[i]);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playCorrectSound();
      if (streak >= 1) playComboSound(streak + 1);
      addCorrect();
      setShowConfetti(true);
      setShowFlash("correct");
      const streakBonus = Math.min(streak, 5);
      setScorePopup({ points: 100 + streakBonus * 50, streak: streak + 1 });
      setTimeout(() => speak(current.correct_order.join(", ")), 400);
      setTimeout(() => { setShowConfetti(false); setShowFlash(null); setScorePopup(null); }, 1200);
    } else {
      playIncorrectSound();
      addIncorrect();
      setShowFlash("incorrect");
      setTimeout(() => setShowFlash(null), 500);
    }

    setTimeout(advance, 3000);
  }, [placed, current, showResult, streak]);

  const advance = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      stop();
      setGameOver(true);
    } else {
      setCurrentIndex(i => i + 1);
      setPlaced([]);
      setPool(shuffle([...questions[currentIndex + 1].items]));
      setShowResult(false);
      setScorePopup(null);
    }
  }, [currentIndex, questions, stop]);

  // Auto-check when all items placed
  useEffect(() => {
    if (placed.length === current.correct_order.length && !showResult && started) {
      const timer = setTimeout(checkAnswer, 500);
      return () => clearTimeout(timer);
    }
  }, [placed, current.correct_order.length, showResult, started, checkAnswer]);


  const resetGame = () => {
    setCurrentIndex(0);
    setPlaced([]);
    setPool(shuffle([...questions[0].items]));
    setShowResult(false);
    setIsCorrect(false);
    setGameOver(false);
    setStarted(false);
  };

  if (gameOver) {
    return <GameComplete score={score} correctCount={correctCount} totalQuestions={questions.length}
      timeElapsed={timeElapsed} gameId={gameId} onPlayAgain={resetGame} onExit={onExit} instructionLang={instructionLang} />;
  }

  return (
    <ThemedBackground theme={theme}>
      <AnimatePresence>{!started && <CountdownOverlay onComplete={() => setStarted(true)} />}</AnimatePresence>
      {showConfetti && <ConfettiBurst count={25} />}
      {showFlash && <ScreenFlash type={showFlash} />}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <AnimatePresence>{scorePopup && <ScorePopup points={scorePopup.points} streak={scorePopup.streak} />}</AnimatePresence>
        <GameHeader score={score} currentQuestion={currentIndex + 1} totalQuestions={questions.length}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Put in Order" emoji="📊" onQuit={onExit} />

        <div className="w-full max-w-lg">
          <SpeakableText text={current.instruction}>
            <h2 className="font-display text-lg md:text-xl font-black text-foreground text-center mb-6">{current.instruction}</h2>
          </SpeakableText>

          {/* Drop zone */}
          <motion.div className={`min-h-[80px] bg-card/80 backdrop-blur rounded-2xl p-4 mb-6 border-2 border-dashed flex flex-wrap gap-2 items-center justify-center transition-all ${
            showResult ? (isCorrect ? "border-game-green" : "border-destructive") : "border-border"
          }`} animate={showResult && !isCorrect ? { x: [0, -8, 8, -8, 0] } : {}}>
            {placed.length === 0 && <p className="text-muted-foreground/50 text-sm font-display">Tap items in the correct order...</p>}
            <AnimatePresence>
              {placed.map((item, i) => (
                <motion.button key={`p-${i}-${item}`}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  onClick={() => handleTap(item, true, i)}
                  className="px-4 py-2 rounded-xl font-display font-bold text-white shadow-lg cursor-pointer flex items-center gap-2"
                  style={{ backgroundColor: ITEM_COLORS[i % ITEM_COLORS.length] }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>
                  <span className="text-xs opacity-60">{i + 1}</span>
                  {item}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pool */}
          <div className="flex flex-wrap gap-3 justify-center">
            <AnimatePresence>
              {pool.map((item, i) => (
                <motion.button key={`pool-${i}-${item}`}
                  layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0 }}
                  onClick={() => handleTap(item, false, i)}
                  className="px-5 py-3 rounded-2xl font-display font-bold text-lg shadow-lg cursor-pointer"
                  style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
                  whileHover={{ scale: 1.1, y: -4 }} whileTap={{ scale: 0.92 }}>
                  {item}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 text-center">
                {isCorrect ? (
                  <p className="font-display text-2xl font-black text-game-green">📊 Perfect order! 📊</p>
                ) : (
                  <div>
                    <p className="font-display text-lg font-bold text-destructive mb-2">Correct order:</p>
                    <p className="font-display text-base text-foreground">{current.correct_order.join(" → ")}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ThemedBackground>
  );
}
