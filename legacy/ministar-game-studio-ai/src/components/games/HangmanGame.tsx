import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, CountdownOverlay } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound, playSelectSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";

interface HangmanWord { word: string; hint: string; }
interface HangmanGameProps {
  gameData: { words: HangmanWord[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

const MAX_WRONG = 6;
const KEYBOARD = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const HANGMAN_PARTS = [
  // head
  <circle key="head" cx="200" cy="80" r="25" stroke="currentColor" strokeWidth="3" fill="none" />,
  // body
  <line key="body" x1="200" y1="105" x2="200" y2="175" stroke="currentColor" strokeWidth="3" />,
  // left arm
  <line key="larm" x1="200" y1="130" x2="165" y2="155" stroke="currentColor" strokeWidth="3" />,
  // right arm
  <line key="rarm" x1="200" y1="130" x2="235" y2="155" stroke="currentColor" strokeWidth="3" />,
  // left leg
  <line key="lleg" x1="200" y1="175" x2="170" y2="215" stroke="currentColor" strokeWidth="3" />,
  // right leg
  <line key="rleg" x1="200" y1="175" x2="230" y2="215" stroke="currentColor" strokeWidth="3" />,
];

export function HangmanGame({ gameData, gameId, onExit, instructionLang = "en" }: HangmanGameProps) {
  const words = gameData.words;
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [theme] = useState(getRandomTheme);

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  const current = words[currentIndex];
  const wordUpper = current.word.toUpperCase();
  const wordLetters = new Set(wordUpper.replace(/[^A-Z]/g, "").split(""));
  const isWordComplete = [...wordLetters].every(l => guessedLetters.has(l));
  const isWordFailed = wrongCount >= MAX_WRONG;

  const handleGuess = useCallback((letter: string) => {
    if (guessedLetters.has(letter) || showResult || !started) return;
    playSelectSound();
    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!wordUpper.includes(letter)) {
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      if (newWrong >= MAX_WRONG) {
        playIncorrectSound();
        addIncorrect();
        setShowFlash("incorrect");
        setShowResult(true);
        setTimeout(() => setShowFlash(null), 500);
        setTimeout(() => speak(current.word), 800);
        setTimeout(() => advanceWord(), 3000);
      }
    } else {
      // Check if word complete after this guess
      const remaining = [...wordLetters].filter(l => !newGuessed.has(l));
      if (remaining.length === 0) {
        playCorrectSound();
        if (streak >= 1) playComboSound(streak + 1);
        addCorrect();
        setShowConfetti(true);
        setShowFlash("correct");
        setShowResult(true);
        setTimeout(() => speak(current.word), 400);
        setTimeout(() => { setShowConfetti(false); setShowFlash(null); }, 1200);
        setTimeout(() => advanceWord(), 2500);
      }
    }
  }, [guessedLetters, showResult, started, wordUpper, wrongCount, wordLetters, streak, current.word]);

  const advanceWord = useCallback(() => {
    if (currentIndex + 1 >= words.length) {
      stop();
      setGameOver(true);
    } else {
      setCurrentIndex(i => i + 1);
      setGuessedLetters(new Set());
      setWrongCount(0);
      setShowResult(false);
    }
  }, [currentIndex, words.length, stop]);

  const resetGame = () => {
    setCurrentIndex(0);
    setGuessedLetters(new Set());
    setWrongCount(0);
    setShowResult(false);
    setGameOver(false);
    setStarted(false);
  };

  if (gameOver) {
    return <GameComplete score={score} correctCount={correctCount} totalQuestions={words.length}
      timeElapsed={timeElapsed} gameId={gameId} onPlayAgain={resetGame} onExit={onExit} instructionLang={instructionLang} />;
  }

  return (
    <ThemedBackground theme={theme}>
      <AnimatePresence>{!started && <CountdownOverlay onComplete={() => setStarted(true)} />}</AnimatePresence>
      {showConfetti && <ConfettiBurst count={25} />}
      {showFlash && <ScreenFlash type={showFlash} />}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <GameHeader score={score} currentQuestion={currentIndex + 1} totalQuestions={words.length}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Hangman" emoji="🪢" onQuit={onExit} />

        <div className="w-full max-w-lg">
          {/* Hangman SVG */}
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 400 250" className="w-48 h-36 text-foreground">
              {/* Gallows */}
              <line x1="50" y1="240" x2="350" y2="240" stroke="currentColor" strokeWidth="4" />
              <line x1="120" y1="240" x2="120" y2="20" stroke="currentColor" strokeWidth="4" />
              <line x1="120" y1="20" x2="200" y2="20" stroke="currentColor" strokeWidth="4" />
              <line x1="200" y1="20" x2="200" y2="55" stroke="currentColor" strokeWidth="3" />
              {/* Body parts */}
              {HANGMAN_PARTS.slice(0, wrongCount).map((part, i) => (
                <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}>
                  {part}
                </motion.g>
              ))}
            </svg>
          </div>

          {/* Hint */}
          <SpeakableText text={current.hint}>
            <p className="text-center text-muted-foreground font-body text-sm mb-4 italic">💡 {current.hint}</p>
          </SpeakableText>

          {/* Word display */}
          <div className="flex gap-2 justify-center mb-6 flex-wrap">
            {wordUpper.split("").map((letter, i) => {
              const isLetter = /[A-Z]/.test(letter);
              const revealed = !isLetter || guessedLetters.has(letter) || showResult;
              return (
                <motion.div key={i}
                  animate={revealed && isLetter ? { scale: [1, 1.2, 1] } : {}}
                  className={`w-10 h-12 flex items-center justify-center font-display font-black text-xl rounded-lg border-b-4 ${
                    revealed ? (showResult && !isWordComplete && isLetter && !guessedLetters.has(letter)
                      ? "bg-destructive/20 border-destructive text-destructive"
                      : "bg-card border-primary text-foreground")
                      : "bg-muted border-border"
                  }`}
                >
                  {isLetter ? (revealed ? letter : "") : letter}
                </motion.div>
              );
            })}
          </div>

          {/* Wrong count */}
          <div className="text-center mb-4">
            <span className="text-sm font-display font-bold text-muted-foreground">
              {wrongCount} / {MAX_WRONG} wrong
            </span>
          </div>

          {/* Keyboard */}
          <div className="flex flex-wrap gap-1.5 justify-center max-w-md mx-auto">
            {KEYBOARD.map(letter => {
              const guessed = guessedLetters.has(letter);
              const isInWord = wordUpper.includes(letter);
              let bg = "hsl(var(--muted))";
              let textColor = "hsl(var(--foreground))";
              if (guessed && isInWord) { bg = "hsl(145, 72%, 45%)"; textColor = "#fff"; }
              else if (guessed && !isInWord) { bg = "hsl(0, 72%, 52%)"; textColor = "#fff"; }

              return (
                <motion.button key={letter} onClick={() => handleGuess(letter)}
                  disabled={guessed || showResult || !started}
                  whileHover={!guessed && !showResult && started ? { scale: 1.15, y: -2 } : {}}
                  whileTap={!guessed && !showResult && started ? { scale: 0.9 } : {}}
                  className="w-9 h-10 rounded-lg font-display font-bold text-sm shadow-md transition-all disabled:opacity-40"
                  style={{ backgroundColor: bg, color: textColor }}
                >
                  {letter}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </ThemedBackground>
  );
}
