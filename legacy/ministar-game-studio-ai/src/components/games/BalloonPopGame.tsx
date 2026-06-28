import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, CountdownOverlay } from "./effects/Particles";
import { playCorrectSound, playIncorrectSound, playComboSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";

interface BalloonQuestion {
  question: string;
  correct_answer: string;
  wrong_answers: string[];
}

interface BalloonPopGameProps {
  gameData: { questions: BalloonQuestion[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

const BALLOON_COLORS = [
  "hsl(0, 84%, 60%)", "hsl(210, 100%, 56%)", "hsl(145, 72%, 50%)",
  "hsl(28, 100%, 58%)", "hsl(262, 83%, 58%)", "hsl(340, 82%, 62%)",
];

interface Balloon {
  id: number;
  text: string;
  isCorrect: boolean;
  x: number;
  speed: number;
  color: string;
  popped: boolean;
}

export function BalloonPopGame({ gameData, gameId, onExit, instructionLang = "en" }: BalloonPopGameProps) {
  const questions = gameData.questions;
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const balloonIdRef = useRef(0);

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  const current = questions[currentIndex];

  // Spawn balloons for current question
  useEffect(() => {
    if (!started || showResult || gameOver) return;

    // Speak the question aloud when it appears
    speak(current.question);

    const allAnswers = [current.correct_answer, ...current.wrong_answers];
    const spawned: Balloon[] = allAnswers.map((text, i) => ({
      id: balloonIdRef.current++,
      text,
      isCorrect: text === current.correct_answer,
      x: 10 + (i / allAnswers.length) * 70 + Math.random() * 10,
      speed: 12 + Math.random() * 6,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      popped: false,
    }));
    setBalloons(spawned);
  }, [started, showResult, gameOver, currentIndex]);

  const handlePop = useCallback((balloon: Balloon) => {
    if (showResult || !started || balloon.popped) return;

    setBalloons(prev => prev.map(b => b.id === balloon.id ? { ...b, popped: true } : b));

    if (balloon.isCorrect) {
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
        setBalloons([]);
      }
    }, 2500);
  }, [showResult, started, streak, current, currentIndex, questions.length, stop]);

  const resetGame = () => {
    setCurrentIndex(0);
    setBalloons([]);
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
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #87CEEB 0%, #E0F7FA 50%, #C8E6C9 100%)" }}>
      <AnimatePresence>{!started && <CountdownOverlay onComplete={() => setStarted(true)} />}</AnimatePresence>
      {showConfetti && <ConfettiBurst count={30} />}
      {showFlash && <ScreenFlash type={showFlash} />}

      <div className="relative z-10 p-4">
        <GameHeader score={score} currentQuestion={currentIndex + 1} totalQuestions={questions.length}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Balloon Pop" emoji="🎈" onQuit={onExit} />
      </div>

      {/* Question */}
      <div className="text-center px-4 relative z-10 mx-auto max-w-2xl">
        <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl">
          <SpeakableText text={current.question} showIcon>
            <h2 className="font-display text-xl md:text-3xl font-black text-white mb-1">{current.question}</h2>
          </SpeakableText>
          <p className="text-sm text-white/70 font-display">Pop the correct balloon! 🎈</p>
        </div>
      </div>

      {/* Balloons */}
      <div className="flex-1 relative">
        <AnimatePresence>
          {balloons.filter(b => !b.popped).map((balloon, index) => (
            <motion.button key={balloon.id}
              initial={{ y: "100vh", x: `${balloon.x}%` }}
              animate={{ y: "-20vh" }}
              exit={{ scale: [1, 1.5, 0], opacity: [1, 0.5, 0] }}
              transition={{ duration: balloon.speed, ease: "linear" }}
              onClick={() => handlePop(balloon)}
              className="absolute cursor-pointer select-none"
              style={{ left: `${balloon.x}%`, transform: "translateX(-50%)" }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.8 }}>
              {/* Balloon shape */}
              <div className="relative">
                <div className="w-20 h-24 rounded-[50%] flex items-center justify-center shadow-xl relative"
                  style={{ backgroundColor: balloon.color }}>
                  {/* Number label for verbal reference */}
                  <span className="absolute -top-2 -right-1 bg-white text-gray-800 font-display font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm z-20">
                    {index + 1}
                  </span>
                  {/* Shine */}
                  <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-white/30" />
                  <span className="font-display font-bold text-white text-sm text-center px-2 relative z-10">{balloon.text}</span>
                </div>
                {/* String */}
                <div className="w-[2px] h-10 mx-auto" style={{ backgroundColor: balloon.color }} />
                {/* Knot */}
                <div className="w-3 h-3 rounded-full mx-auto -mt-1" style={{ backgroundColor: balloon.color }} />
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute bottom-20 left-0 right-0 text-center z-20">
            {isCorrect ? (
              <p className="font-display text-3xl font-black text-game-green drop-shadow-lg">💥 POP! Correct! 💥</p>
            ) : (
              <p className="font-display text-xl font-bold text-[#1a1a2e]">
                Answer: <span className="text-primary font-black">{current.correct_answer}</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
