import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, ScorePopup, CountdownOverlay } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound, playFlipSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";

interface WordLadderStep {
  clue: string;
  answer: string;
}

interface WordLadderGameProps {
  gameData: { ladders: { start_word: string; steps: WordLadderStep[] }[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

// Animated climbing dog component
function ClimbingDog({ stepIndex, totalSteps }: { stepIndex: number; totalSteps: number }) {
  // Dog climbs from bottom to top based on progress
  const progress = totalSteps > 1 ? stepIndex / (totalSteps - 1) : 0;
  const bottomPercent = 5 + progress * 80; // 5% to 85%

  return (
    <motion.div
      className="absolute right-0 z-10"
      style={{ bottom: `${bottomPercent}%` }}
      animate={{
        bottom: `${bottomPercent}%`,
        rotate: [0, -3, 3, 0],
      }}
      transition={{
        bottom: { type: "spring", damping: 12, stiffness: 100 },
        rotate: { duration: 0.4, ease: "easeInOut" },
      }}
    >
      <motion.div
        className="text-4xl"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
      >
        🐕
      </motion.div>
    </motion.div>
  );
}

export function WordLadderGame({ gameData, gameId, onExit, instructionLang = "en" }: WordLadderGameProps) {
  const ladders = gameData.ladders;
  const [started, setStarted] = useState(false);
  const [currentLadder, setCurrentLadder] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [scorePopup, setScorePopup] = useState<{ points: number; streak: number } | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [dogStep, setDogStep] = useState(0);
  const [theme] = useState(getRandomTheme);
  const inputRef = useRef<HTMLInputElement>(null);

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  const ladder = ladders[currentLadder];
  const step = ladder?.steps[currentStep];
  const totalSteps = ladders.reduce((sum, l) => sum + l.steps.length, 0);

  useEffect(() => {
    if (started && !showResult && inputRef.current) inputRef.current.focus();
  }, [started, showResult, currentStep]);

  const handleSubmit = useCallback(() => {
    if (!typed.trim() || showResult || !started) return;
    const correct = typed.trim().toLowerCase() === step.answer.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playCorrectSound();
      if (streak >= 1) playComboSound(streak + 1);
      addCorrect();
      setCompletedSteps(prev => [...prev, step.answer]);
      setDogStep(prev => prev + 1);
      setShowConfetti(true);
      setShowFlash("correct");
      const streakBonus = Math.min(streak, 5);
      setScorePopup({ points: 100 + streakBonus * 50, streak: streak + 1 });
      setTimeout(() => speak(step.answer), 400);
      setTimeout(() => { setShowConfetti(false); setShowFlash(null); setScorePopup(null); }, 1200);
    } else {
      playIncorrectSound();
      addIncorrect();
      setShowFlash("incorrect");
      setScorePopup(null);
      setTimeout(() => setShowFlash(null), 500);
    }

    setTimeout(advance, 2500);
  }, [typed, showResult, started, step, streak]);

  const advance = useCallback(() => {
    if (currentStep + 1 < ladder.steps.length) {
      setCurrentStep(s => s + 1);
      setTyped("");
      setShowResult(false);
    } else if (currentLadder + 1 < ladders.length) {
      setCurrentLadder(l => l + 1);
      setCurrentStep(0);
      setCompletedSteps([]);
      setDogStep(0);
      setTyped("");
      setShowResult(false);
    } else {
      stop();
      setGameOver(true);
    }
  }, [currentStep, currentLadder, ladder, ladders, stop]);

  const resetGame = () => {
    setCurrentLadder(0);
    setCurrentStep(0);
    setTyped("");
    setShowResult(false);
    setIsCorrect(false);
    setGameOver(false);
    setStarted(false);
    setCompletedSteps([]);
    setDogStep(0);
  };

  if (gameOver) {
    return <GameComplete score={score} correctCount={correctCount} totalQuestions={totalSteps}
      timeElapsed={timeElapsed} gameId={gameId} onPlayAgain={resetGame} onExit={onExit} instructionLang={instructionLang} />;
  }

  const completedCount = ladders.slice(0, currentLadder).reduce((sum, l) => sum + l.steps.length, 0) + currentStep;

  return (
    <ThemedBackground theme={theme}>
      <AnimatePresence>{!started && <CountdownOverlay onComplete={() => setStarted(true)} />}</AnimatePresence>
      {showConfetti && <ConfettiBurst count={20} />}
      {showFlash && <ScreenFlash type={showFlash} />}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <AnimatePresence>{scorePopup && <ScorePopup points={scorePopup.points} streak={scorePopup.streak} />}</AnimatePresence>
        <GameHeader score={score} currentQuestion={completedCount + 1} totalQuestions={totalSteps}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Word Ladder" emoji="🪜" onQuit={onExit} />

        <div className="w-full max-w-lg">
          {/* Ladder visualization */}
          <div className="bg-card/95 backdrop-blur rounded-2xl p-6 border border-border shadow-xl mb-4 relative">
            {/* Climbing Dog */}
            <ClimbingDog stepIndex={dogStep} totalSteps={ladder.steps.length} />

            {/* Ladder rails visual */}
            <div className="absolute left-8 top-16 bottom-8 w-1 bg-amber-600/40 rounded-full" />
            <div className="absolute left-14 top-16 bottom-8 w-1 bg-amber-600/40 rounded-full" />

            {/* Start word */}
            <div className="text-center mb-6">
              <span className="px-5 py-2.5 rounded-xl font-display font-black text-xl text-white inline-block shadow-lg"
                style={{ backgroundColor: "hsl(262, 83%, 58%)" }}>
                {ladder.start_word}
              </span>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {ladder.steps.map((s, i) => {
                const isCompleted = i < currentStep || (i === currentStep && showResult && isCorrect);
                const isCurrent = i === currentStep && !showResult;
                const isFailed = i === currentStep && showResult && !isCorrect;
                return (
                  <motion.div key={i} className="flex items-center gap-4 relative z-10"
                    animate={isCurrent ? { x: [0, 2, -2, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}>
                    {/* Rung */}
                    <div className="absolute left-6 w-10 h-1 bg-amber-700/30 rounded" style={{ top: "50%" }} />

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-base shrink-0 shadow-md ${
                      isCompleted ? "bg-game-green text-white" : isCurrent ? "bg-primary text-primary-foreground" : isFailed ? "bg-destructive text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {isCompleted ? "✓" : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      {isCompleted ? (
                        <span className="font-display font-black text-lg text-game-green">{completedSteps[i] || s.answer}</span>
                      ) : isCurrent || isFailed ? (
                        <SpeakableText text={s.clue} showIcon>
                          <span className="font-display font-bold text-lg text-foreground">{s.clue}</span>
                        </SpeakableText>
                      ) : (
                        <span className="text-muted-foreground text-base font-display">???</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Input */}
          {!showResult && started && step && (
            <div className="flex gap-2">
              <input ref={inputRef} value={typed}
                onChange={(e) => { setTyped(e.target.value); playFlipSound(); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Type your answer..."
                className="flex-1 px-4 py-3 rounded-xl bg-card border-2 border-border font-display font-bold text-lg text-foreground text-center focus:border-primary focus:outline-none"
                disabled={!started} />
              <motion.button onClick={handleSubmit}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl font-display font-bold text-white shadow-lg"
                style={{ backgroundColor: "hsl(var(--primary))" }}>
                Go
              </motion.button>
            </div>
          )}

          {showResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-4">
              {isCorrect ? (
                <p className="font-display text-2xl font-black text-game-green">🐕 Climb! 🪜</p>
              ) : (
                <p className="font-display text-lg font-bold">
                  <span className="text-muted-foreground">Answer: </span>
                  <span className="text-foreground font-black text-xl">{step.answer}</span>
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </ThemedBackground>
  );
}
