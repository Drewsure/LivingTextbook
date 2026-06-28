import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, CountdownOverlay } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playFlipSound, playComboSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";

interface Flashcard { front: string; back: string; }
interface FlashcardsGameProps {
  gameData: { cards: Flashcard[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

export function FlashcardsGame({ gameData, gameId, onExit, instructionLang = "en" }: FlashcardsGameProps) {
  const cards = gameData.cards;
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [theme] = useState(getRandomTheme);

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect } = useGameScore();

  const current = cards[currentIndex];

  const handleFlip = () => {
    if (!started || swipeDirection) return;
    playFlipSound();
    setIsFlipped(!isFlipped);
    if (!isFlipped) setTimeout(() => speak(current.back), 400);
  };

  const handleRate = useCallback((knew: boolean) => {
    if (!started || !isFlipped) return;

    setSwipeDirection(knew ? "right" : "left");

    if (knew) {
      playCorrectSound();
      if (streak >= 1) playComboSound(streak + 1);
      addCorrect();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }

    setTimeout(() => {
      if (currentIndex + 1 >= cards.length) {
        stop();
        setGameOver(true);
      } else {
        setCurrentIndex(i => i + 1);
        setIsFlipped(false);
        setSwipeDirection(null);
      }
    }, 600);
  }, [started, isFlipped, streak, currentIndex, cards.length, stop]);

  const resetGame = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setGameOver(false);
    setStarted(false);
    setSwipeDirection(null);
  };

  if (gameOver) {
    return <GameComplete score={score} correctCount={correctCount} totalQuestions={cards.length}
      timeElapsed={timeElapsed} gameId={gameId} onPlayAgain={resetGame} onExit={onExit} instructionLang={instructionLang} />;
  }

  const CARD_COLORS = ["hsl(262, 83%, 58%)", "hsl(210, 100%, 56%)", "hsl(28, 100%, 58%)", "hsl(340, 82%, 62%)", "hsl(145, 72%, 50%)"];

  return (
    <ThemedBackground theme={theme}>
      <AnimatePresence>{!started && <CountdownOverlay onComplete={() => setStarted(true)} />}</AnimatePresence>
      {showConfetti && <ConfettiBurst count={20} />}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <GameHeader score={score} currentQuestion={currentIndex + 1} totalQuestions={cards.length}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Flashcards" emoji="🃏" onQuit={onExit} />

        <AnimatePresence mode="wait">
          <motion.div key={currentIndex}
            initial={{ opacity: 0, x: swipeDirection === "right" ? -200 : swipeDirection === "left" ? 200 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: swipeDirection === "right" ? 300 : swipeDirection === "left" ? -300 : 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full max-w-lg cursor-pointer"
            onClick={handleFlip} style={{ perspective: 1000 }}>

            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", damping: 18 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-full aspect-[4/3]">

              {/* Front */}
              <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-6 shadow-2xl border-2 border-white/10"
                style={{ backfaceVisibility: "hidden", backgroundColor: CARD_COLORS[currentIndex % CARD_COLORS.length] }}>
                <span className="absolute top-3 left-3 bg-white/25 text-white font-display font-black text-sm px-2 py-0.5 rounded-full">
                  Card {currentIndex + 1}
                </span>
                <span className="text-4xl mb-3">📖</span>
                <SpeakableText text={current.front} showIcon>
                  <h2 className="font-display text-2xl md:text-4xl font-black text-white text-center">{current.front}</h2>
                </SpeakableText>
                <p className="text-white/60 text-sm mt-3 font-display">Tap to flip</p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-6 shadow-2xl border-2 border-white/10 bg-card"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <span className="text-4xl mb-3">💡</span>
                <SpeakableText text={current.back} showIcon>
                  <h2 className="font-display text-xl md:text-3xl font-black text-foreground text-center">{current.back}</h2>
                </SpeakableText>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Rating buttons */}
        <AnimatePresence>
          {isFlipped && !swipeDirection && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex gap-4 mt-4">
              <motion.button onClick={() => handleRate(false)}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="px-8 py-4 rounded-2xl font-display font-bold text-lg shadow-xl"
                style={{ backgroundColor: "hsl(0, 72%, 52%)", color: "#fff" }}>
                ❌ Still Learning
              </motion.button>
              <motion.button onClick={() => handleRate(true)}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="px-8 py-4 rounded-2xl font-display font-bold text-lg shadow-xl"
                style={{ backgroundColor: "hsl(145, 72%, 45%)", color: "#fff" }}>
                ✅ I Knew It!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemedBackground>
  );
}
