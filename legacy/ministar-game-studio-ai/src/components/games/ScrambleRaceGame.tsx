import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, ScorePopup, CountdownOverlay } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound, playSelectSound, playTickSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";

interface ScrambleWord {
  word: string;
  hint: string;
}

interface ScrambleRaceGameProps {
  gameData: { words: ScrambleWord[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

function scramble(word: string): string {
  const arr = word.toUpperCase().split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Ensure it's actually scrambled
  if (arr.join("") === word.toUpperCase() && word.length > 1) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr.join("");
}

const QUESTION_TIME = 15;

export function ScrambleRaceGame({ gameData, gameId, onExit, instructionLang = "en" }: ScrambleRaceGameProps) {
  const words = gameData.words;
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambled, setScrambled] = useState(() => scramble(words[0]?.word || "WORD"));
  const [typed, setTyped] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [scorePopup, setScorePopup] = useState<{ points: number; streak: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [theme] = useState(getRandomTheme);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  // Use refs to avoid stale closures
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;
  const showResultRef = useRef(showResult);
  showResultRef.current = showResult;
  const streakRef = useRef(streak);
  streakRef.current = streak;
  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;

  const current = words[currentIndex] || { word: "WORD", hint: "Unscramble this word" };

  useEffect(() => {
    if (started && !showResult && inputRef.current) inputRef.current.focus();
  }, [started, showResult, currentIndex]);

  const advance = useCallback(() => {
    const idx = currentIndexRef.current;
    if (idx + 1 >= words.length) {
      stop();
      setGameOver(true);
    } else {
      const nextIdx = idx + 1;
      setCurrentIndex(nextIdx);
      setScrambled(scramble(words[nextIdx].word));
      setTyped("");
      setShowResult(false);
      setScorePopup(null);
    }
  }, [words, stop]);

  const handleTimeUp = useCallback(() => {
    if (showResultRef.current) return;
    playIncorrectSound();
    addIncorrect();
    setShowFlash("incorrect");
    setShowResult(true);
    setIsCorrect(false);
    setTimeout(() => setShowFlash(null), 500);
    setTimeout(() => advance(), 2500);
  }, [advance, addIncorrect]);

  // Timer
  useEffect(() => {
    if (!started || showResult || gameOver) return;
    setTimeLeft(QUESTION_TIME);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        if (t <= 5) playTickSound();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, showResult, gameOver, currentIndex, handleTimeUp]);

  const handleInput = useCallback((value: string) => {
    if (showResultRef.current || !started) return;
    setTyped(value);
    const currentWord = words[currentIndexRef.current]?.word;
    if (currentWord && value.toLowerCase() === currentWord.toLowerCase()) {
      clearInterval(timerRef.current);
      setIsCorrect(true);
      setShowResult(true);
      playCorrectSound();
      if (streakRef.current >= 1) playComboSound(streakRef.current + 1);
      addCorrect();
      setShowConfetti(true);
      setShowFlash("correct");
      const timeBonus = Math.round((timeLeftRef.current / QUESTION_TIME) * 50);
      const streakBonus = Math.min(streakRef.current, 5);
      setScorePopup({ points: 100 + timeBonus + streakBonus * 50, streak: streakRef.current + 1 });
      setTimeout(() => speak(currentWord), 400);
      setTimeout(() => { setShowConfetti(false); setShowFlash(null); setScorePopup(null); }, 1200);
      setTimeout(() => advance(), 2000);
    }
  }, [started, words, advance, addCorrect]);

  const resetGame = () => {
    setCurrentIndex(0);
    setScrambled(scramble(words[0].word));
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

  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerColor = timeLeft > 8 ? "hsl(145, 72%, 50%)" : timeLeft > 4 ? "hsl(28, 100%, 55%)" : "hsl(0, 84%, 60%)";

  return (
    <ThemedBackground theme={theme}>
      <AnimatePresence>{!started && <CountdownOverlay onComplete={() => setStarted(true)} />}</AnimatePresence>
      {showConfetti && <ConfettiBurst count={25} />}
      {showFlash && <ScreenFlash type={showFlash} />}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <AnimatePresence>{scorePopup && <ScorePopup points={scorePopup.points} streak={scorePopup.streak} />}</AnimatePresence>
        <GameHeader score={score} currentQuestion={currentIndex + 1} totalQuestions={words.length}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Scramble Race" emoji="🏃" onQuit={onExit} />

        {/* Timer bar */}
        <div className="w-full max-w-md mb-4">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: timerColor }}
              animate={{ width: `${timerPct}%` }} transition={{ duration: 0.3 }} />
          </div>
          <div className="text-center mt-1">
            <span className="font-mono font-bold text-sm" style={{ color: timerColor }}>{timeLeft}s</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentIndex}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md text-center">

            {/* Hint */}
            <SpeakableText text={current.hint}>
              <p className="text-muted-foreground font-body text-sm mb-4 italic">💡 {current.hint}</p>
            </SpeakableText>

            {/* Scrambled word */}
            <div className="flex gap-2 justify-center mb-8 flex-wrap">
              {scrambled.split("").map((letter, i) => (
                <motion.div key={`${i}-${letter}`}
                  initial={{ opacity: 0, y: -20, rotate: Math.random() * 30 - 15 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", damping: 12 }}
                  className="w-12 h-14 flex items-center justify-center rounded-xl font-display font-black text-2xl text-white shadow-lg"
                  style={{ backgroundColor: `hsl(${262 + i * 20}, 75%, 55%)`, boxShadow: "0 4px 0 rgba(0,0,0,0.2)" }}>
                  {letter}
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <input ref={inputRef} value={typed}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Unscramble the word..."
              className="w-full px-4 py-3 rounded-xl bg-card border-2 border-border font-display font-bold text-xl text-foreground text-center focus:border-primary focus:outline-none"
              disabled={showResult || !started}
              autoComplete="off" spellCheck={false} />

            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                {isCorrect ? (
                  <p className="font-display text-2xl font-black text-game-green">⚡ Unscrambled! ⚡</p>
                ) : (
                  <p className="font-display text-lg font-bold text-muted-foreground">
                    The word was: <span className="text-foreground font-black">{current.word}</span>
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
