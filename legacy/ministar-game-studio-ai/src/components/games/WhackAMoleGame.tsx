import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, CountdownOverlay } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";

interface WhackQuestion {
  question: string;
  correct_answer: string;
  wrong_answers: string[];
}

interface WhackAMoleGameProps {
  gameData: { questions: WhackQuestion[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

const MOLE_POSITIONS = [
  { top: "5%", left: "15%" }, { top: "5%", left: "50%" }, { top: "5%", left: "85%" },
  { top: "40%", left: "10%" }, { top: "40%", left: "50%" }, { top: "40%", left: "90%" },
  { top: "75%", left: "20%" }, { top: "75%", left: "55%" }, { top: "75%", left: "80%" },
];

const MOLE_COLORS = [
  "hsl(262, 83%, 58%)", "hsl(145, 72%, 50%)", "hsl(28, 100%, 58%)",
  "hsl(340, 82%, 62%)", "hsl(210, 100%, 56%)",
];

interface Mole {
  id: number;
  text: string;
  isCorrect: boolean;
  position: number;
  visible: boolean;
}

export function WhackAMoleGame({ gameData, gameId, onExit, instructionLang = "en" }: WhackAMoleGameProps) {
  const questions = gameData.questions;
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [moles, setMoles] = useState<Mole[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [theme] = useState(getRandomTheme);
  const moleTimerRef = useRef<ReturnType<typeof setInterval>>();
  const moleIdRef = useRef(0);

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  const current = questions[currentIndex];

  // Spawn moles
  useEffect(() => {
    if (!started || showResult || gameOver) return;

    const allAnswers = [current.correct_answer, ...current.wrong_answers];
    const usedPositions = new Set<number>();

    const spawnMole = () => {
      const answer = allAnswers[Math.floor(Math.random() * allAnswers.length)];
      let pos: number;
      do { pos = Math.floor(Math.random() * MOLE_POSITIONS.length); } while (usedPositions.has(pos));
      usedPositions.add(pos);

      const id = moleIdRef.current++;
      const mole: Mole = {
        id, text: answer, isCorrect: answer === current.correct_answer,
        position: pos, visible: true,
      };
      setMoles(prev => [...prev.filter(m => m.visible).slice(-5), mole]);

      // Auto-hide after 2.5s
      setTimeout(() => {
        usedPositions.delete(pos);
        setMoles(prev => prev.map(m => m.id === id ? { ...m, visible: false } : m));
      }, 2500);
    };

    spawnMole();
    moleTimerRef.current = setInterval(spawnMole, 1200);
    return () => clearInterval(moleTimerRef.current);
  }, [started, showResult, gameOver, currentIndex, current]);

  const handleWhack = useCallback((mole: Mole) => {
    if (showResult || !started) return;
    clearInterval(moleTimerRef.current);

    setMoles(prev => prev.map(m => m.id === mole.id ? { ...m, visible: false } : m));

    if (mole.isCorrect) {
      playCorrectSound();
      if (streak >= 1) playComboSound(streak + 1);
      addCorrect();
      setIsCorrect(true);
      setShowConfetti(true);
      setShowFlash("correct");
      setTimeout(() => speak(current.correct_answer), 300);
      setTimeout(() => { setShowConfetti(false); setShowFlash(null); }, 1200);
    } else {
      playIncorrectSound();
      addIncorrect();
      setIsCorrect(false);
      setShowFlash("incorrect");
      setTimeout(() => setShowFlash(null), 500);
    }

    setShowResult(true);
    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        stop();
        setGameOver(true);
      } else {
        setCurrentIndex(i => i + 1);
        setShowResult(false);
        setMoles([]);
      }
    }, 2000);
  }, [showResult, started, streak, current, currentIndex, questions.length, stop]);

  const resetGame = () => {
    setCurrentIndex(0);
    setMoles([]);
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

      <div className="min-h-screen flex flex-col items-center p-4 relative">
        <GameHeader score={score} currentQuestion={currentIndex + 1} totalQuestions={questions.length}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Whack-a-Mole" emoji="🔨" onQuit={onExit} />

        {/* Question */}
        <SpeakableText text={current.question} showIcon>
          <h2 className="font-display text-xl md:text-3xl font-black text-foreground text-center mb-4 max-w-lg">
            {current.question}
          </h2>
        </SpeakableText>

        {/* Mole field */}
        <div className="flex-1 w-full max-w-lg relative" style={{ minHeight: "400px" }}>
          <AnimatePresence>
            {moles.filter(m => m.visible).map(mole => {
              const pos = MOLE_POSITIONS[mole.position];
              return (
                <motion.button key={mole.id}
                  initial={{ scale: 0, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: 30 }}
                  transition={{ type: "spring", damping: 12 }}
                  onClick={() => handleWhack(mole)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 px-5 py-3 rounded-2xl font-display font-bold text-white shadow-xl cursor-pointer select-none"
                  style={{
                    top: pos.top, left: pos.left,
                    backgroundColor: MOLE_COLORS[mole.id % MOLE_COLORS.length],
                    boxShadow: "0 6px 0 rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.2)",
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85, y: 4 }}
                >
                  {mole.text}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {showResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center mt-4">
              {isCorrect ? (
                <p className="font-display text-2xl font-black text-game-green">🎯 Got it! 🎯</p>
              ) : (
                <p className="font-display text-lg font-bold text-muted-foreground">
                  Answer: <span className="text-foreground">{current.correct_answer}</span>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemedBackground>
  );
}
