import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, ScorePopup, CountdownOverlay } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound, playFlipSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";

interface TypingWord { word: string; hint: string; }
interface TypingRaceGameProps {
  gameData: { words: TypingWord[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

export function TypingRaceGame({ gameData, gameId, onExit, instructionLang = "en" }: TypingRaceGameProps) {
  // Sanitize words — strip non-Latin characters
  const words = gameData.words
    .map(w => ({
      ...w,
      word: String(w.word).normalize("NFKD").replace(/[^A-Za-z\s'-]/g, "").trim(),
    }))
    .filter(w => w.word.length >= 2);

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [scorePopup, setScorePopup] = useState<{ points: number; streak: number } | null>(null);
  const [theme] = useState(getRandomTheme);
  const inputRef = useRef<HTMLInputElement>(null);

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  // Use refs to avoid stale closures
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;
  const showResultRef = useRef(showResult);
  showResultRef.current = showResult;
  const streakRef = useRef(streak);
  streakRef.current = streak;

  const current = words[currentIndex] || { word: "WORD", hint: "" };

  const focusInput = () => inputRef.current?.focus();

  useEffect(() => {
    if (started && !showResult) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [started, showResult, currentIndex]);

  useEffect(() => {
    if (!started || showResult) return;
    speak(current.hint);
  }, [currentIndex, started]);

  const advanceWord = useCallback(() => {
    const idx = currentIndexRef.current;
    if (idx + 1 >= words.length) {
      stop();
      setGameOver(true);
    } else {
      setCurrentIndex(idx + 1);
      setTyped("");
      setShowResult(false);
      setScorePopup(null);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [words.length, stop]);

  const handleInput = useCallback((value: string) => {
    if (showResultRef.current || !started) return;
    setTyped(value);
    playFlipSound();

    const currentWord = words[currentIndexRef.current]?.word || "";
    if (value.toLowerCase() === currentWord.toLowerCase()) {
      setIsCorrect(true);
      setShowResult(true);
      playCorrectSound();
      if (streakRef.current >= 1) playComboSound(streakRef.current + 1);
      addCorrect();
      setShowConfetti(true);
      setShowFlash("correct");
      const streakBonus = Math.min(streakRef.current, 5);
      setScorePopup({ points: 100 + streakBonus * 50, streak: streakRef.current + 1 });
      setTimeout(() => speak(currentWord), 400);
      setTimeout(() => { setShowConfetti(false); setShowFlash(null); setScorePopup(null); }, 1200);
      setTimeout(advanceWord, 2000);
    }
  }, [started, words, advanceWord, addCorrect]);

  const handleSkip = useCallback(() => {
    if (showResultRef.current || !started) return;
    setIsCorrect(false);
    setShowResult(true);
    playIncorrectSound();
    addIncorrect();
    setShowFlash("incorrect");
    setTimeout(() => setShowFlash(null), 500);
    setTimeout(advanceWord, 2500);
  }, [started, advanceWord, addIncorrect]);

  const resetGame = () => {
    setCurrentIndex(0);
    setTyped("");
    setShowResult(false);
    setIsCorrect(false);
    setGameOver(false);
    setStarted(false);
  };

  if (gameOver) {
    return <GameComplete score={score} correctCount={correctCount} totalQuestions={words.length}
      timeElapsed={timeElapsed} gameId={gameId} onPlayAgain={resetGame} onExit={onExit} instructionLang={instructionLang} />;
  }

  const wordUpper = current.word.toUpperCase();

  return (
    <ThemedBackground theme={theme}>
      <AnimatePresence>{!started && <CountdownOverlay onComplete={() => setStarted(true)} />}</AnimatePresence>
      {showConfetti && <ConfettiBurst count={25} />}
      {showFlash && <ScreenFlash type={showFlash} />}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative" onClick={focusInput}>
        <AnimatePresence>{scorePopup && <ScorePopup points={scorePopup.points} streak={scorePopup.streak} />}</AnimatePresence>
        <GameHeader score={score} currentQuestion={currentIndex + 1} totalQuestions={words.length}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Typing Race" emoji="⌨️" onQuit={onExit} />

        <AnimatePresence mode="wait">
          <motion.div key={currentIndex}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg text-center">

            {/* Hint */}
            <SpeakableText text={current.hint} showIcon>
              <p className="text-muted-foreground font-body text-lg mb-6 italic">💡 {current.hint}</p>
            </SpeakableText>

            {/* Letter display */}
            <div className="flex gap-2 justify-center mb-8 flex-wrap">
              {wordUpper.split("").map((letter, i) => {
                const typedChar = typed[i]?.toUpperCase();
                const isTyped = i < typed.length;
                const isMatch = typedChar === letter;

                return (
                  <motion.div key={i}
                    animate={isTyped ? (isMatch ? { scale: [1, 1.2, 1] } : { x: [0, -4, 4, 0] }) : {}}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-14 flex items-center justify-center rounded-xl font-display font-black text-2xl border-b-4 transition-colors"
                    style={{
                      backgroundColor: isTyped
                        ? (isMatch ? "hsl(145, 72%, 45%)" : "hsl(0, 72%, 52%)")
                        : showResult ? "hsl(145, 72%, 45%)" : "hsl(220, 15%, 85%)",
                      borderBottomColor: isTyped ? "transparent" : "hsl(220, 15%, 65%)",
                      color: isTyped ? "#fff" : showResult ? "#fff" : "hsl(220, 15%, 25%)",
                    }}
                  >
                    {showResult ? letter : (isTyped ? typedChar : "")}
                  </motion.div>
                );
              })}
            </div>

            {/* Actual visible input for mobile compatibility */}
            <input
              ref={inputRef}
              value={typed}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && handleSkip()}
              disabled={showResult || !started}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={current.word.length + 5}
              className="w-full px-4 py-3 rounded-xl bg-card/80 border-2 border-border font-display font-bold text-xl text-foreground text-center focus:border-primary focus:outline-none placeholder:text-muted-foreground/50 mt-2"
              placeholder="Type here..."
            />

            {/* Tap to type prompt */}
            {!showResult && started && (
              <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                className="text-muted-foreground text-xs font-display mt-2">
                ⌨️ Type the word above
              </motion.p>
            )}

            {/* Skip button */}
            {!showResult && started && (
              <motion.button onClick={handleSkip}
                className="mt-3 px-4 py-2 rounded-xl bg-muted text-muted-foreground font-display font-bold text-sm hover:bg-muted/80 transition-colors">
                Skip →
              </motion.button>
            )}

            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                {isCorrect ? (
                  <p className="font-display text-2xl font-black text-game-green">⚡ Speed bonus! ⚡</p>
                ) : (
                  <p className="font-display text-lg font-bold text-muted-foreground">
                    The word was: <span className="text-foreground">{current.word}</span>
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </ThemedBackground>
  );
}
