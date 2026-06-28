import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, ScorePopup, CountdownOverlay } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";

interface OddOneOutQuestion {
  words: string[];
  odd_word: string;
  explanation: string;
}

interface OddOneOutGameProps {
  gameData: { questions: OddOneOutQuestion[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

const WORD_COLORS = [
  "hsl(262, 83%, 58%)", "hsl(210, 100%, 56%)", "hsl(28, 100%, 58%)",
  "hsl(340, 82%, 62%)", "hsl(145, 72%, 50%)", "hsl(180, 60%, 45%)",
];

export function OddOneOutGame({ gameData, gameId, onExit, instructionLang = "en" }: OddOneOutGameProps) {
  const questions = gameData.questions;
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

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  const current = questions[currentIndex];

  // Speak instruction when each question appears
  useEffect(() => {
    if (started && !showResult) {
      speak("Which word doesn't belong?");
    }
  }, [started, currentIndex, showResult]);

  const handleSelect = useCallback((word: string) => {
    if (showResult || !started) return;
    setSelected(word);
    const correct = word === current.odd_word;
    setIsCorrect(correct);

    setTimeout(() => {
      setShowResult(true);

      if (correct) {
        playCorrectSound();
        if (streak >= 1) playComboSound(streak + 1);
        addCorrect();
        setShowConfetti(true);
        setShowFlash("correct");
        const streakBonus = Math.min(streak, 5);
        setScorePopup({ points: 100 + streakBonus * 50, streak: streak + 1 });
        setTimeout(() => speak(current.explanation), 400);
        setTimeout(() => { setShowConfetti(false); setShowFlash(null); setScorePopup(null); }, 1200);
      } else {
        playIncorrectSound();
        addIncorrect();
        setShowFlash("incorrect");
        setScorePopup(null);
        setTimeout(() => setShowFlash(null), 500);
      }

      setTimeout(advanceQuestion, 3000);
    }, 500);
  }, [showResult, started, current, streak]);

  const advanceQuestion = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      stop();
      setGameOver(true);
    } else {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setShowResult(false);
      setScorePopup(null);
    }
  }, [currentIndex, questions.length, stop]);

  const resetGame = () => {
    setCurrentIndex(0);
    setSelected(null);
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
          streak={streak} timeElapsed={timeElapsed} gameTitle="Odd One Out" emoji="🔮" onQuit={onExit} />

        <AnimatePresence mode="wait">
          <motion.div key={currentIndex}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg text-center">

            <h2 className="font-display text-xl md:text-2xl font-black text-foreground mb-2">
              Which word doesn't belong?
            </h2>
            <p className="text-muted-foreground text-sm mb-8 font-display">Find the odd one out! 🔮</p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {current.words.map((word, i) => {
                const isSelected = selected === word;
                const isOdd = word === current.odd_word;

                let bg = WORD_COLORS[i % WORD_COLORS.length];
                let opacity = 1;
                let border = "none";
                let scale = 1;

                if (showResult) {
                  if (isOdd) {
                    bg = "hsl(145, 72%, 45%)";
                    border = "3px solid hsl(145, 72%, 60%)";
                    scale = 1.05;
                  } else if (isSelected && !isOdd) {
                    bg = "hsl(0, 72%, 52%)";
                    border = "3px solid hsl(0, 72%, 60%)";
                  } else {
                    opacity = 0.3;
                  }
                } else if (isSelected) {
                  scale = 0.95;
                }

                return (
                  <motion.button key={word} onClick={() => handleSelect(word)}
                    disabled={selected !== null || !started}
                    animate={{ opacity, scale: showResult && isOdd ? [1, 1.08, 1.05] : scale }}
                    transition={{ duration: 0.3 }}
                    whileHover={!selected && started ? { scale: 1.08, y: -4 } : {}}
                    whileTap={!selected && started ? { scale: 0.92 } : {}}
                    className="py-6 px-4 rounded-2xl font-display font-black text-lg text-white shadow-xl cursor-pointer select-none"
                    onMouseEnter={() => { if (!selected && started) speak(word); }}
                    style={{ backgroundColor: bg, border, boxShadow: "0 6px 0 rgba(0,0,0,0.2), 0 8px 20px rgba(0,0,0,0.15)" }}>
                    {word}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-6">
                  {isCorrect ? (
                    <p className="font-display text-2xl font-black text-game-green">🎯 Correct! 🎯</p>
                  ) : (
                    <p className="font-display text-lg font-bold text-muted-foreground">
                      The odd one was: <span className="text-foreground font-black">{current.odd_word}</span>
                    </p>
                  )}
                  <SpeakableText text={current.explanation}>
                    <p className="text-sm text-muted-foreground mt-2 font-body">{current.explanation}</p>
                  </SpeakableText>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </ThemedBackground>
  );
}
