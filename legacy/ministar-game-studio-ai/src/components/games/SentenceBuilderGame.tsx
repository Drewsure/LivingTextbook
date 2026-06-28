import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, ScorePopup, CountdownOverlay } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound, playSelectSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";

interface SentenceQuestion {
  sentence: string;
  hint?: string;
}

interface SentenceBuilderGameProps {
  gameData: { sentences: SentenceQuestion[] };
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

const WORD_COLORS = [
  "hsl(262, 83%, 58%)", "hsl(145, 72%, 45%)", "hsl(28, 100%, 53%)",
  "hsl(340, 82%, 57%)", "hsl(210, 100%, 50%)", "hsl(262, 83%, 50%)",
  "hsl(180, 60%, 45%)", "hsl(45, 90%, 50%)",
];

export function SentenceBuilderGame({ gameData, gameId, onExit, instructionLang = "en" }: SentenceBuilderGameProps) {
  const sentences = gameData.sentences;
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [scorePopup, setScorePopup] = useState<{ points: number; streak: number } | null>(null);
  const [theme] = useState(getRandomTheme);
  const [scrambled, setScrambled] = useState<string[]>(() => {
    const words = sentences[0].sentence.split(/\s+/);
    return shuffle(words);
  });

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  const current = sentences[currentIndex];
  const correctWords = current.sentence.split(/\s+/);

  const handleWordTap = useCallback((word: string, fromPlaced: boolean, index: number) => {
    if (showResult || !started) return;
    playSelectSound();

    if (fromPlaced) {
      setPlaced(prev => prev.filter((_, i) => i !== index));
      setScrambled(prev => [...prev, word]);
    } else {
      setScrambled(prev => prev.filter((_, i) => i !== index));
      setPlaced(prev => [...prev, word]);
    }
  }, [showResult, started]);

  // Auto-check when all words placed
  const checkAnswer = useCallback(() => {
    if (placed.length !== correctWords.length) return;
    const correct = placed.join(" ") === correctWords.join(" ");
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
      setTimeout(() => speak(current.sentence), 400);
      setTimeout(() => { setShowConfetti(false); setShowFlash(null); setScorePopup(null); }, 1200);
    } else {
      playIncorrectSound();
      addIncorrect();
      setShowFlash("incorrect");
      setScorePopup(null);
      setTimeout(() => setShowFlash(null), 500);
    }

    setTimeout(advanceQuestion, 3000);
  }, [placed, correctWords, streak, current.sentence]);

  // Trigger check when all placed
  const prevPlacedLen = placed.length;
  if (prevPlacedLen === correctWords.length && !showResult && started) {
    setTimeout(checkAnswer, 500);
  }

  const advanceQuestion = useCallback(() => {
    if (currentIndex + 1 >= sentences.length) {
      stop();
      setGameOver(true);
    } else {
      const nextWords = sentences[currentIndex + 1].sentence.split(/\s+/);
      setCurrentIndex(i => i + 1);
      setPlaced([]);
      setScrambled(shuffle(nextWords));
      setShowResult(false);
      setScorePopup(null);
    }
  }, [currentIndex, sentences, stop]);

  const resetGame = () => {
    setCurrentIndex(0);
    setPlaced([]);
    setScrambled(shuffle(sentences[0].sentence.split(/\s+/)));
    setShowResult(false);
    setIsCorrect(false);
    setGameOver(false);
    setStarted(false);
  };

  if (gameOver) {
    return <GameComplete score={score} correctCount={correctCount} totalQuestions={sentences.length}
      timeElapsed={timeElapsed} gameId={gameId} onPlayAgain={resetGame} onExit={onExit} instructionLang={instructionLang} />;
  }

  return (
    <ThemedBackground theme={theme}>
      <AnimatePresence>{!started && <CountdownOverlay onComplete={() => setStarted(true)} />}</AnimatePresence>
      {showConfetti && <ConfettiBurst count={25} />}
      {showFlash && <ScreenFlash type={showFlash} />}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <AnimatePresence>{scorePopup && <ScorePopup points={scorePopup.points} streak={scorePopup.streak} />}</AnimatePresence>
        <GameHeader score={score} currentQuestion={currentIndex + 1} totalQuestions={sentences.length}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Sentence Builder" emoji="🏗️" onQuit={onExit} />

        <div className="w-full max-w-2xl">
          {/* Hint */}
          {current.hint && (
            <SpeakableText text={current.hint}>
              <p className="text-center text-muted-foreground font-body text-sm mb-4 italic">💡 {current.hint}</p>
            </SpeakableText>
          )}

          {/* Sentence drop zone */}
          <motion.div className={`min-h-[80px] bg-card/80 backdrop-blur rounded-2xl p-4 mb-6 border-2 border-dashed flex flex-wrap gap-2 items-center justify-center transition-all ${
            showResult ? (isCorrect ? "border-game-green" : "border-destructive") : "border-border"
          }`}
            animate={showResult && !isCorrect ? { x: [0, -8, 8, -8, 0] } : {}}>
            {placed.length === 0 && !showResult && (
              <p className="text-muted-foreground/50 text-sm font-display">Tap words to build the sentence...</p>
            )}
            <AnimatePresence>
              {placed.map((word, i) => (
                <motion.button key={`placed-${i}-${word}`}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  onClick={() => handleWordTap(word, true, i)}
                  className="px-4 py-2 rounded-xl font-display font-bold text-white shadow-lg cursor-pointer"
                  style={{ backgroundColor: WORD_COLORS[i % WORD_COLORS.length] }}
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Word bank */}
          <div className="flex flex-wrap gap-3 justify-center">
            <AnimatePresence>
              {scrambled.map((word, i) => (
                <motion.button key={`bank-${i}-${word}`}
                  layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0 }}
                  onClick={() => handleWordTap(word, false, i)}
                  className="px-5 py-3 rounded-2xl font-display font-bold text-lg text-white shadow-lg cursor-pointer"
                  style={{ backgroundColor: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
                  whileHover={{ scale: 1.1, y: -4, backgroundColor: "hsl(262, 83%, 58%)", color: "#fff" }}
                  whileTap={{ scale: 0.92 }}>
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-6 text-center">
                {isCorrect ? (
                  <p className="font-display text-2xl font-black text-game-green">✨ Perfect! ✨</p>
                ) : (
                  <div>
                    <p className="font-display text-lg font-bold text-destructive mb-2">Not quite!</p>
                    <p className="font-display text-base text-foreground">{current.sentence}</p>
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
