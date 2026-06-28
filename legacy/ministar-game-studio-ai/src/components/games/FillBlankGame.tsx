import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/utils/translations";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, ScorePopup, CountdownOverlay, EmojiBurst } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { PowerUpBar, useGamePowerUps, PowerUpType } from "./PowerUps";
import { playCorrectSound, playIncorrectSound, playComboSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";

interface FillBlankQuestion {
  sentence: string;
  answer: string;
  options: string[];
}

interface FillBlankGameProps {
  gameData: { questions: FillBlankQuestion[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

const OPTION_COLORS = [
  "hsl(262, 83%, 58%)",
  "hsl(145, 72%, 45%)",
  "hsl(28, 100%, 53%)",
  "hsl(340, 82%, 57%)",
];

export function FillBlankGame({ gameData, gameId, onExit, instructionLang = "en" }: FillBlankGameProps) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [scorePopup, setScorePopup] = useState<{ points: number; streak: number } | null>(null);
  const [theme] = useState(getRandomTheme);
  const [hiddenOptions, setHiddenOptions] = useState<Set<string>>(new Set());
  const [hintRevealed, setHintRevealed] = useState(false);

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();
  const powerUps = useGamePowerUps({ availablePowerUps: ["fifty_fifty", "skip", "hint"] });

  const questions = gameData.questions;
  const current = questions[currentIndex];
  const sentenceParts = current.sentence.split(/_+/);

  // Auto-speak the sentence on question start (replace blank with "what")
  useEffect(() => {
    if (!started) return;
    // Cancel any lingering speech from previous question's reveal
    window.speechSynthesis?.cancel();
    const spokenSentence = current.sentence.replace(/_+/g, "what");
    // Use a robust delay to avoid overlap with previous question's TTS
    const timer = setTimeout(() => speak(spokenSentence), 600);
    return () => {
      clearTimeout(timer);
      window.speechSynthesis?.cancel();
    };
  }, [currentIndex, started, current.sentence]);

  const advanceQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      stop();
      setGameOver(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setShowResult(false);
      setScorePopup(null);
      setHiddenOptions(new Set());
      setHintRevealed(false);
      powerUps.resetForNextQuestion();
    }
  }, [currentIndex, questions.length, stop, powerUps]);

  const handleSelect = useCallback(
    (option: string) => {
      if (showResult || !started) return;
      setSelected(option);
      const correct = option.toLowerCase() === current.answer.toLowerCase();
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
        setTimeout(() => { setShowConfetti(false); setShowFlash(null); }, 1500);
      } else {
        playIncorrectSound();
        addIncorrect();
        setShowFlash("incorrect");
        setScorePopup(null);
        setTimeout(() => setShowFlash(null), 500);
      }

      // Always speak the full completed sentence on reveal
      const fullSentence = current.sentence.replace(/_+/g, current.answer);
      setTimeout(() => speak(fullSentence), 1200);

      setTimeout(advanceQuestion, 3500);
    },
    [showResult, current, addCorrect, addIncorrect, streak, started, advanceQuestion]
  );

  const handlePowerUp = useCallback(
    (type: PowerUpType) => {
      if (showResult || !started) return;

      if (type === "fifty_fifty") {
        if (!powerUps.use("fifty_fifty")) return;
        const wrongOptions = current.options.filter((o) => o.toLowerCase() !== current.answer.toLowerCase());
        const toHide = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
        setHiddenOptions(new Set(toHide));
      } else if (type === "skip") {
        if (!powerUps.use("skip")) return;
        addCorrect();
        setTimeout(advanceQuestion, 500);
      } else if (type === "hint") {
        if (!powerUps.use("hint")) return;
        setHintRevealed(true);
        // Hint is spoken on hover only, not auto-spoken
      }
    },
    [showResult, started, powerUps, current, addCorrect, advanceQuestion]
  );

  const resetGame = () => {
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setIsCorrect(false);
    setGameOver(false);
    setStarted(false);
    setHiddenOptions(new Set());
    setHintRevealed(false);
    powerUps.resetAll();
  };

  if (gameOver) {
    return (
      <GameComplete score={score} correctCount={correctCount} totalQuestions={questions.length}
        timeElapsed={timeElapsed} gameId={gameId} onPlayAgain={resetGame} onExit={onExit}
        instructionLang={instructionLang} />
    );
  }

  return (
    <ThemedBackground theme={theme}>
      <AnimatePresence>
        {!started && <CountdownOverlay onComplete={() => setStarted(true)} />}
      </AnimatePresence>

      {showConfetti && <ConfettiBurst count={30} />}
      {showFlash && <ScreenFlash type={showFlash} />}
      {showResult && isCorrect && <EmojiBurst emoji="🎯" count={6} />}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <AnimatePresence>
          {scorePopup && <ScorePopup points={scorePopup.points} streak={scorePopup.streak} />}
        </AnimatePresence>

        <GameHeader score={score} currentQuestion={currentIndex + 1} totalQuestions={questions.length}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Fill in the Blank" emoji="📝" onQuit={onExit} />

        <PowerUpBar
          counts={powerUps.counts}
          usedThisQuestion={powerUps.usedThisQuestion}
          activatedPopup={powerUps.activatedPopup}
          availablePowerUps={powerUps.availablePowerUps}
          disabled={showResult || !started}
          onUse={handlePowerUp}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 18 }}
            className="w-full max-w-2xl"
          >
            {/* Sentence card */}
            <motion.div
              className="bg-card/95 backdrop-blur-sm rounded-3xl p-8 md:p-10 mb-6 border-2 border-border text-center shadow-2xl relative"
              animate={
                showResult
                  ? isCorrect
                    ? { scale: [1, 1.04, 1], borderColor: "hsl(145, 72%, 50%)" }
                    : { x: [0, -10, 10, -10, 0], borderColor: "hsl(0, 84%, 60%)" }
                  : {}
              }
            >

              <SpeakableText text={t("fill_blank_instruction", instructionLang)} inline>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-display font-bold mb-4">
                  {t("fill_blank_instruction", instructionLang)}
                </div>
              </SpeakableText>

              <SpeakableText text={current.sentence.replace(/_+/g, "blank")} showIcon>
                <div className="font-display text-xl md:text-3xl font-black text-foreground leading-relaxed">
                  {sentenceParts.map((part, i) => (
                    <span key={i}>
                      {part}
                      {i < sentenceParts.length - 1 && (
                        <motion.span
                          className={`inline-block mx-1 px-4 py-1 rounded-xl border-2 border-dashed min-w-[100px] transition-all ${
                            showResult && isCorrect
                              ? "bg-game-green/15 border-game-green text-game-green"
                              : showResult && !isCorrect
                              ? "bg-destructive/15 border-destructive text-destructive"
                              : selected
                              ? "bg-primary/15 border-primary text-primary"
                              : "border-muted-foreground/40 text-muted-foreground"
                          }`}
                          animate={selected ? { scale: [1, 1.06, 1] } : {}}
                        >
                          {showResult ? current.answer : selected || "______"}
                        </motion.span>
                      )}
                    </span>
                  ))}
                </div>
              </SpeakableText>

              {/* Hint */}
              <AnimatePresence>
                {hintRevealed && !showResult && (
                  <SpeakableText text={`Starts with ${current.answer.charAt(0)}, ${current.answer.length} letters`}>
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm mt-3 font-display font-bold bg-game-orange/10 text-game-orange rounded-xl p-2 inline-block"
                    >
                      👁️ Starts with "{current.answer.charAt(0)}" — {current.answer.length} letters
                    </motion.p>
                  </SpeakableText>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Word bank */}
            <div className="flex flex-wrap gap-3 justify-center">
              {current.options.map((option, i) => {
                const isSelected = selected === option;
                const isAnswer = option.toLowerCase() === current.answer.toLowerCase();
                const isHidden = hiddenOptions.has(option);

                if (isHidden) {
                  return (
                    <motion.div
                      key={option}
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ opacity: 0, scale: 0.5, width: 0, padding: 0, margin: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden"
                    />
                  );
                }

                let bgColor = OPTION_COLORS[i % OPTION_COLORS.length];
                let opacity = 1;
                let ring = "";

                if (showResult) {
                  if (isAnswer) {
                    bgColor = "hsl(145, 72%, 45%)";
                    ring = "0 0 0 4px hsl(145, 72%, 50%, 0.4)";
                  } else if (isSelected && !isAnswer) {
                    bgColor = "hsl(0, 84%, 60%)";
                    ring = "0 0 0 4px hsl(0, 84%, 60%, 0.3)";
                    opacity = 0.8;
                  } else {
                    opacity = 0.25;
                  }
                }

                const optionLetter = String.fromCharCode(65 + i); // A, B, C, D
                return (
                  <motion.button
                    key={option}
                    onClick={() => handleSelect(option)}
                    disabled={showResult || !started}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, type: "spring" }}
                    whileHover={!showResult && started ? { scale: 1.1, y: -4 } : {}}
                    whileTap={!showResult && started ? { scale: 0.92 } : {}}
                    className="px-7 py-4 rounded-2xl font-display font-bold text-lg text-white shadow-lg transition-all cursor-pointer relative"
                    style={{
                      backgroundColor: bgColor,
                      opacity,
                      boxShadow: ring ? `${ring}, 0 6px 20px rgba(0,0,0,0.2)` : "0 6px 20px rgba(0,0,0,0.2)",
                    }}
                  >
                    {/* Letter label for verbal reference */}
                    <span className="absolute -top-1.5 -left-1.5 bg-white text-gray-800 font-display font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                      {optionLetter}
                    </span>
                    <SpeakableText text={option} inline speakOnHover={!showResult}>{option}</SpeakableText>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 text-center"
                >
                  {isCorrect ? (
                    <p className="font-display text-2xl md:text-3xl font-black text-game-green mb-3">✨ Correct! ✨</p>
                  ) : (
                    <p className="font-display text-xl font-bold text-destructive mb-3">
                      The answer was: <span className="text-foreground">{current.answer}</span>
                    </p>
                  )}
                  {/* Bounce-animated full sentence */}
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {current.sentence.replace(/_+/g, current.answer).split(/\s+/).map((word, i) => {
                      const isAnswer = word.toLowerCase().includes(current.answer.toLowerCase());
                      return (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: [20, -8, 0] }}
                          transition={{ delay: 0.8 + i * 0.1, duration: 0.5, type: "spring", damping: 12 }}
                          className={`font-display text-lg md:text-xl font-bold ${
                            isAnswer ? "text-primary bg-primary/15 px-2 py-0.5 rounded-lg" : "text-foreground"
                          }`}
                        >
                          {word}
                        </motion.span>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </ThemedBackground>
  );
}
