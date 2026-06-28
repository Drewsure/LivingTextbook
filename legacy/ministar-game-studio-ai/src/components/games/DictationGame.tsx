import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, ScorePopup, CountdownOverlay } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound, playSelectSound, playTickSound } from "@/utils/audio";
import { speak } from "./SpeakableText";
import { Volume2, RotateCcw } from "lucide-react";

interface DictationSentence {
  sentence: string;
  hint?: string;
}

interface DictationGameProps {
  gameData: { sentences: DictationSentence[] };
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
  "hsl(340, 82%, 57%)", "hsl(210, 100%, 50%)", "hsl(180, 60%, 45%)",
  "hsl(45, 90%, 50%)", "hsl(280, 65%, 55%)",
];

const QUESTION_TIME = 20;

export function DictationGame({ gameData, gameId, onExit, instructionLang = "en" }: DictationGameProps) {
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
  const [hasPlayed, setHasPlayed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(QUESTION_TIME);
  const timerRef = useRef<number | null>(null);
  const advanceRef = useRef<number | null>(null);
  const checkingRef = useRef(false);

  const [scrambled, setScrambled] = useState<string[]>(() => {
    const words = sentences[0].sentence.split(/\s+/);
    return shuffle(words);
  });

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  const current = sentences[currentIndex];
  const correctWords = current.sentence.split(/\s+/);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (advanceRef.current) clearTimeout(advanceRef.current);
    };
  }, []);

  // Start per-question timer
  useEffect(() => {
    if (!started || showResult || gameOver) return;
    setTimeRemaining(QUESTION_TIME);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        if (prev <= 6) playTickSound();
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, started, showResult, gameOver]);

  const handleTimeout = useCallback(() => {
    if (showResult || checkingRef.current) return;
    checkingRef.current = true;
    setIsCorrect(false);
    setShowResult(true);
    playIncorrectSound();
    addIncorrect();
    setShowFlash("incorrect");
    setTimeout(() => { setShowFlash(null); }, 500);
    setTimeout(() => speak(current.sentence), 400);
    advanceRef.current = window.setTimeout(advanceQuestion, 3000);
    setTimeout(() => { checkingRef.current = false; }, 3100);
  }, [showResult, current.sentence]);

  // Auto-speak on question start
  useEffect(() => {
    if (started && !showResult && !gameOver) {
      setHasPlayed(false);
      const t = setTimeout(() => {
        speak(current.sentence);
        setHasPlayed(true);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [currentIndex, started, showResult, gameOver]);

  const handleReplay = () => {
    speak(current.sentence);
  };

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

  const checkAnswer = useCallback(() => {
    if (placed.length !== correctWords.length || checkingRef.current) return;
    checkingRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

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
      const timeBonus = Math.floor(timeRemaining * 5);
      setScorePopup({ points: 100 + streakBonus * 50 + timeBonus, streak: streak + 1 });
      setTimeout(() => speak(current.sentence), 400);
      setTimeout(() => { setShowConfetti(false); setShowFlash(null); setScorePopup(null); }, 1200);
    } else {
      playIncorrectSound();
      addIncorrect();
      setShowFlash("incorrect");
      setScorePopup(null);
      setTimeout(() => setShowFlash(null), 500);
      setTimeout(() => speak(current.sentence), 400);
    }

    advanceRef.current = window.setTimeout(() => {
      advanceQuestion();
      checkingRef.current = false;
    }, 3000);
  }, [placed, correctWords, streak, current.sentence, timeRemaining]);

  // Trigger check when all placed
  useEffect(() => {
    if (placed.length === correctWords.length && !showResult && started && !checkingRef.current) {
      const t = setTimeout(checkAnswer, 400);
      return () => clearTimeout(t);
    }
  }, [placed.length, correctWords.length, showResult, started]);

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
      setHasPlayed(false);
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
    setHasPlayed(false);
    checkingRef.current = false;
  };

  if (gameOver) {
    return <GameComplete score={score} correctCount={correctCount} totalQuestions={sentences.length}
      timeElapsed={timeElapsed} gameId={gameId} onPlayAgain={resetGame} onExit={onExit} instructionLang={instructionLang} />;
  }

  const timerPct = (timeRemaining / QUESTION_TIME) * 100;
  const timerUrgent = timeRemaining <= 5;

  return (
    <ThemedBackground theme={theme}>
      <AnimatePresence>{!started && <CountdownOverlay onComplete={() => setStarted(true)} />}</AnimatePresence>
      {showConfetti && <ConfettiBurst count={25} />}
      {showFlash && <ScreenFlash type={showFlash} />}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <AnimatePresence>{scorePopup && <ScorePopup points={scorePopup.points} streak={scorePopup.streak} />}</AnimatePresence>
        <GameHeader score={score} currentQuestion={currentIndex + 1} totalQuestions={sentences.length}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Dictation" emoji="🎧" onQuit={onExit} />

        <div className="w-full max-w-2xl">
          {/* Timer bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: timerUrgent ? "hsl(var(--destructive))" : "hsl(var(--primary))" }}
              animate={{ width: `${timerPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Listen button */}
          <div className="flex justify-center mb-6 gap-3">
            <motion.button
              onClick={handleReplay}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-display font-bold text-lg bg-primary text-primary-foreground shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={!hasPlayed ? { scale: [1, 1.08, 1] } : {}}
              transition={!hasPlayed ? { duration: 1.5, repeat: Infinity } : {}}
            >
              <Volume2 className="h-5 w-5" />
              Listen
            </motion.button>
            <motion.button
              onClick={handleReplay}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl font-display font-bold text-sm bg-muted text-foreground shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="h-4 w-4" />
              Replay
            </motion.button>
          </div>

          {/* Hint */}
          {current.hint && (
            <p className="text-center text-muted-foreground font-body text-sm mb-4 italic">💡 {current.hint}</p>
          )}

          {/* Sentence drop zone */}
          <motion.div className={`min-h-[80px] bg-card/80 backdrop-blur rounded-2xl p-4 mb-6 border-2 border-dashed flex flex-wrap gap-2 items-center justify-center transition-all ${
            showResult ? (isCorrect ? "border-game-green" : "border-destructive") : "border-border"
          }`}
            animate={showResult && !isCorrect ? { x: [0, -8, 8, -8, 0] } : {}}>
            {placed.length === 0 && !showResult && (
              <p className="text-muted-foreground/50 text-sm font-display">Listen, then tap words to build the sentence...</p>
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
                  className="px-5 py-3 rounded-2xl font-display font-bold text-lg shadow-lg cursor-pointer"
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
