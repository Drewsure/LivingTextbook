import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, CountdownOverlay } from "./effects/Particles";
import { playCorrectSound, playIncorrectSound, playComboSound, playTickSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";
import { X, Volume2, VolumeX, Check } from "lucide-react";
import { isMuted, toggleMute } from "@/utils/audio";

// ─── Types ──────────────────────────────────────────

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  hint?: string;
}

interface QuizGameProps {
  gameData: { questions: QuizQuestion[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

// ─── Constants ──────────────────────────────────────

const QUESTION_TIME = 20;

// Wordwall-style color blocks — bold, distinct, 3D
const ANSWER_COLORS = [
  { bg: "210, 70%, 55%",  label: "A" },  // Blue
  { bg: "0, 72%, 52%",    label: "B" },  // Red
  { bg: "28, 90%, 52%",   label: "C" },  // Orange
  { bg: "145, 60%, 40%",  label: "D" },  // Green
];

// ─── Main Quiz Game ─────────────────────────────────

export function QuizGame({ gameData, gameId, onExit, instructionLang = "en" }: QuizGameProps) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(QUESTION_TIME);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [muted, setMuted] = useState(isMuted());
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Scoring
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);

  const questions = gameData.questions;
  const current = questions[currentIndex];

  // Per-question countdown
  useEffect(() => {
    if (!started || showResult || gameOver) return;
    timerRef.current = setInterval(() => {
      setQuestionTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        if (t <= 6) playTickSound();
        return t - 1;
      });
      setTotalTimeElapsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, showResult, gameOver, currentIndex]);

  const handleTimeUp = useCallback(() => {
    if (showResult) return;
    setShowResult(true);
    setIsCorrect(false);
    setSelected(null);
    playIncorrectSound();
    setStreak(0);
    setShowFlash("incorrect");
    setTimeout(() => setShowFlash(null), 400);
    setTimeout(() => advanceQuestion(), 2500);
  }, [showResult]);

  const advanceQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setGameOver(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setShowResult(false);
      setQuestionTimeLeft(QUESTION_TIME);
    }
  }, [currentIndex, questions.length]);

  const handleSelect = useCallback(
    (option: string) => {
      if (showResult || !started) return;
      clearInterval(timerRef.current);
      setSelected(option);
      const correct = option === current.correct_answer;
      setIsCorrect(correct);

      // Delay reveal for suspense
      setTimeout(() => {
        setShowResult(true);

        if (correct) {
          playCorrectSound();
          const newStreak = streak + 1;
          if (newStreak >= 2) playComboSound(newStreak);
          setStreak(newStreak);
          setCorrectCount((c) => c + 1);
          const timeBonus = Math.round((questionTimeLeft / QUESTION_TIME) * 50);
          const streakBonus = Math.min(streak, 5) * 50;
          const pts = 100 + streakBonus + timeBonus;
          setScore((s) => s + pts);
          setShowConfetti(true);
          setShowFlash("correct");
          // Speak the correct answer
          setTimeout(() => speak(current.correct_answer), 400);
          setTimeout(() => { setShowConfetti(false); setShowFlash(null); }, 1200);
        } else {
          playIncorrectSound();
          setStreak(0);
          setShowFlash("incorrect");
          setTimeout(() => setShowFlash(null), 400);
        }

        setTimeout(() => advanceQuestion(), 2200);
      }, 500); // 500ms suspense before reveal
    },
    [showResult, started, current, streak, questionTimeLeft, advanceQuestion]
  );

  const resetGame = () => {
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setIsCorrect(false);
    setGameOver(false);
    setShowConfetti(false);
    setStarted(false);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setTotalTimeElapsed(0);
    setQuestionTimeLeft(QUESTION_TIME);
  };

  if (gameOver) {
    return (
      <GameComplete
        score={score}
        correctCount={correctCount}
        totalQuestions={questions.length}
        timeElapsed={totalTimeElapsed}
        gameId={gameId}
        onPlayAgain={resetGame}
        onExit={onExit}
        instructionLang={instructionLang}
      />
    );
  }

  // Timer bar calculations
  const timerPct = (questionTimeLeft / QUESTION_TIME) * 100;
  const timerUrgent = questionTimeLeft <= 5;
  const timerCritical = questionTimeLeft <= 3;
  const timerColor = timerCritical ? "0, 84%, 60%" : timerUrgent ? "28, 100%, 55%" : "210, 70%, 55%";

  return (
    <div className="min-h-screen bg-[#1a1a2e] relative overflow-hidden flex flex-col">
      {/* Countdown overlay */}
      <AnimatePresence>
        {!started && <CountdownOverlay onComplete={() => setStarted(true)} />}
      </AnimatePresence>

      {/* Effects */}
      {showConfetti && <ConfettiBurst count={25} duration={1} />}
      {showFlash && <ScreenFlash type={showFlash} />}

      {/* Quit confirmation */}
      <AnimatePresence>
        {showQuitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#000]/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowQuitConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#2a2a4a] rounded-2xl p-6 border border-[#444] shadow-2xl max-w-sm w-full text-center"
            >
              <div className="text-5xl mb-3">🚪</div>
              <h3 className="font-display text-xl font-black text-[#fff] mb-2">Quit Game?</h3>
              <p className="text-sm text-[#aaa] font-body mb-5">Your progress will be lost.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQuitConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-display font-bold text-sm bg-[#3a3a5a] text-[#fff] hover:bg-[#4a4a6a] transition-colors"
                >
                  Keep Playing
                </button>
                <button
                  onClick={() => { setShowQuitConfirm(false); onExit(); }}
                  className="flex-1 py-3 rounded-xl font-display font-bold text-sm bg-[hsl(0,72%,52%)] text-[#fff] hover:bg-[hsl(0,72%,45%)] transition-colors"
                >
                  Quit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Minimal HUD ─── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        {/* Left: Timer */}
        <div className="font-mono font-bold text-lg text-[#fff]/80 flex items-center gap-2 min-w-[60px]">
          <motion.span
            animate={timerCritical ? { scale: [1, 1.15, 1], color: ["hsl(0,84%,60%)", "hsl(0,84%,70%)", "hsl(0,84%,60%)"] } : {}}
            transition={timerCritical ? { duration: 0.5, repeat: Infinity } : {}}
          >
            0:{questionTimeLeft.toString().padStart(2, "0")}
          </motion.span>
        </div>

        {/* Center: Progress dots */}
        <div className="flex items-center gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  i < currentIndex ? "hsl(145, 60%, 50%)" :
                  i === currentIndex ? "#fff" :
                  "rgba(255,255,255,0.2)",
                transform: i === currentIndex ? "scale(1.4)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {/* Right: Score + controls */}
        <div className="flex items-center gap-2 min-w-[60px] justify-end">
          <AnimatePresence>
            {streak >= 2 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="font-display font-bold text-sm"
                style={{ color: "hsl(28, 100%, 55%)" }}
              >
                🔥{streak}
              </motion.span>
            )}
          </AnimatePresence>
          <span className="font-display font-bold text-[#fff]/80 flex items-center gap-1">
            <Check className="h-3.5 w-3.5" /> {correctCount}
          </span>
          <button
            onClick={() => { const m = toggleMute(); setMuted(m); }}
            className="p-1.5 rounded-lg hover:bg-[#fff]/10 transition-colors"
          >
            {muted ? <VolumeX className="h-4 w-4 text-[#fff]/50" /> : <Volume2 className="h-4 w-4 text-[#fff]/50" />}
          </button>
          <button
            onClick={() => setShowQuitConfirm(true)}
            className="p-1.5 rounded-lg hover:bg-[#fff]/10 transition-colors"
          >
            <X className="h-4 w-4 text-[#fff]/50" />
          </button>
        </div>
      </div>

      {/* Timer bar — full width, thin */}
      <div className="w-full h-1.5 bg-[#fff]/10 relative">
        <motion.div
          className="absolute inset-y-0 left-0"
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.3, ease: "linear" }}
          style={{ backgroundColor: `hsl(${timerColor})` }}
        />
        {timerUrgent && started && !showResult && (
          <motion.div
            className="absolute inset-y-0 left-0"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ width: `${timerPct}%`, backgroundColor: `hsl(${timerColor})` }}
          />
        )}
      </div>

      {/* ─── Main Content — fills viewport ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-3xl flex flex-col items-center"
          >
            {/* ─── Question — MASSIVE, viewport-filling ─── */}
            <motion.div
              className="text-center mb-6 md:mb-10 px-2"
              animate={
                showResult && !isCorrect && selected
                  ? { x: [0, -8, 8, -5, 5, 0] }
                  : {}
              }
              transition={{ duration: 0.4 }}
            >
              <SpeakableText text={current.question} showIcon>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#fff] leading-tight tracking-tight">
                  {current.question}
                </h1>
              </SpeakableText>

              {/* Time's up */}
              <AnimatePresence>
                {showResult && !selected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4"
                  >
                    <span className="font-display font-bold text-[hsl(0,84%,60%)] text-xl">⏰ Time's up!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ─── Answer Blocks — Wordwall style 4-grid ─── */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-2xl">
              {current.options.map((option, i) => {
                const color = ANSWER_COLORS[i % ANSWER_COLORS.length];
                const isSelected = selected === option;
                const isAnswer = option === current.correct_answer;
                const isLocked = selected !== null; // any selection locks all

                // Visual state
                let cardBg = `hsl(${color.bg})`;
                let cardShadow = `0 6px 0 hsl(${color.bg.split(",")[0]}, ${color.bg.split(",")[1]}, 30%), 0 8px 20px rgba(0,0,0,0.3)`;
                let cardOpacity = 1;
                let cardScale = 1;
                let borderStyle = "none";
                let labelBg = "rgba(255,255,255,0.2)";

                if (showResult) {
                  if (isAnswer) {
                    // Correct answer — bright green glow
                    cardBg = "hsl(145, 65%, 45%)";
                    cardShadow = "0 0 30px hsl(145, 65%, 50% / 0.6), 0 6px 0 hsl(145, 65%, 30%), 0 8px 20px rgba(0,0,0,0.3)";
                    borderStyle = "3px solid hsl(145, 65%, 65%)";
                    cardScale = 1.04;
                  } else if (isSelected && !isAnswer) {
                    // Wrong selection — red
                    cardBg = "hsl(0, 72%, 48%)";
                    cardShadow = "0 0 15px hsl(0, 72%, 50% / 0.3), 0 4px 0 hsl(0, 72%, 30%)";
                    borderStyle = "3px solid hsl(0, 72%, 60%)";
                  } else {
                    // Non-selected, non-answer — fade
                    cardOpacity = 0.2;
                    cardShadow = "none";
                  }
                } else if (isSelected) {
                  // Selected but result not yet shown (suspense phase)
                  cardShadow = `0 2px 0 hsl(${color.bg.split(",")[0]}, ${color.bg.split(",")[1]}, 30%), inset 0 2px 4px rgba(0,0,0,0.2)`;
                  cardScale = 0.97;
                }

                return (
                  <SpeakableText key={option} text={option} speakOnHover={!isLocked}>
                    <motion.button
                      onClick={() => handleSelect(option)}
                      disabled={isLocked || !started}
                      layout
                      animate={{
                        opacity: cardOpacity,
                        scale: showResult && isAnswer ? [1, 1.06, 1.04] : cardScale,
                      }}
                      transition={{
                        delay: showResult ? (isAnswer ? 0.15 : 0) : 0,
                        duration: showResult && isAnswer ? 0.5 : 0.25,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      whileHover={!isLocked && started ? { scale: 1.03, y: -4, transition: { duration: 0.15 } } : {}}
                      whileTap={!isLocked && started ? { scale: 0.96, y: 2 } : {}}
                      style={{
                        backgroundColor: cardBg,
                        boxShadow: cardShadow,
                        border: borderStyle,
                      }}
                      className="w-full text-[#fff] font-display font-black text-base sm:text-lg md:text-xl p-4 sm:p-5 md:p-6 rounded-xl text-center relative overflow-hidden cursor-pointer disabled:cursor-default select-none"
                    >
                      {/* Letter label */}
                      <span
                        className="absolute top-2 left-3 text-xs sm:text-sm font-black opacity-70"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {color.label}
                      </span>

                      {/* Answer text */}
                      <span className="relative z-10 block pt-1">
                        {option}
                      </span>

                      {/* Result icons */}
                      {showResult && isAnswer && (
                        <motion.span
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3, type: "spring", damping: 10 }}
                          className="absolute top-2 right-3 text-lg"
                        >
                          ✓
                        </motion.span>
                      )}
                      {showResult && isSelected && !isAnswer && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-3 text-lg"
                        >
                          ✗
                        </motion.span>
                      )}

                      {/* 3D highlight edge */}
                      <div
                        className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl"
                        style={{ background: "rgba(255,255,255,0.25)" }}
                      />
                    </motion.button>
                  </SpeakableText>
                );
              })}
            </div>

            {/* ─── Feedback text ─── */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="mt-6 text-center"
                >
                  {isCorrect ? (
                    <p className="font-display text-2xl font-black" style={{ color: "hsl(145, 65%, 55%)" }}>
                      ✨ Correct! ✨
                    </p>
                  ) : selected ? (
                    <SpeakableText text={`The answer was ${current.correct_answer}`}>
                      <p className="font-display text-base font-bold text-[#aaa]">
                        Answer: <span className="text-[#fff] font-black">{current.correct_answer}</span>
                      </p>
                    </SpeakableText>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Bottom bar ─── */}
      <div className="flex items-center justify-center pb-4 px-4">
        <span className="text-[#fff]/40 text-sm font-display">
          {currentIndex + 1} of {questions.length}
        </span>
      </div>
    </div>
  );
}
