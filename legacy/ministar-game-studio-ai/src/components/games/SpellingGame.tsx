import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, CountdownOverlay } from "./effects/Particles";
import { playCorrectSound, playIncorrectSound, playComboSound, playTickSound, playFlipSound, playSelectSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";
import { X, Volume2, VolumeX } from "lucide-react";
import { isMuted, toggleMute } from "@/utils/audio";

// ─── Types ──────────────────────────────────────────

interface SpellingWord {
  word: string;
  hint: string;
  sentence: string;
}

interface SpellingGameProps {
  gameData: { words: SpellingWord[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

// ─── Constants ──────────────────────────────────────

const QUESTION_TIME = 30;

const LETTER_COLORS = [
  { bg: "hsl(220, 80%, 55%)", shadow: "hsl(220, 80%, 40%)" },
  { bg: "hsl(350, 75%, 55%)", shadow: "hsl(350, 75%, 40%)" },
  { bg: "hsl(35, 85%, 55%)", shadow: "hsl(35, 85%, 40%)" },
  { bg: "hsl(150, 65%, 45%)", shadow: "hsl(150, 65%, 32%)" },
  { bg: "hsl(280, 65%, 55%)", shadow: "hsl(280, 65%, 40%)" },
  { bg: "hsl(195, 75%, 50%)", shadow: "hsl(195, 75%, 35%)" },
];

function scrambleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ─── Component ──────────────────────────────────────

export function SpellingGame({ gameData, gameId, onExit, instructionLang = "en" }: SpellingGameProps) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [muted, setMutedState] = useState(isMuted());

  // Drag-to-place state
  const [scrambledLetters, setScrambledLetters] = useState<{ id: string; letter: string }[]>([]);
  const [placedLetters, setPlacedLetters] = useState<(string | null)[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [revealPhase, setRevealPhase] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const tickPlayedRef = useRef<Set<number>>(new Set());

  // Score
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const words = gameData.words;
  const current = words[currentIndex];
  const wordLength = current.word.length;

  // ─── Timer logic ────────────────────────────────────

  useEffect(() => {
    if (!started || showResult || gameOver) return;
    setTimeLeft(QUESTION_TIME);
    tickPlayedRef.current = new Set();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        const next = Math.max(0, t - 0.05);
        if (next <= 5 && next > 0) {
          const sec = Math.ceil(next);
          if (!tickPlayedRef.current.has(sec) && Math.abs(next - sec) < 0.08) {
            tickPlayedRef.current.add(sec);
            playTickSound();
          }
        }
        return next;
      });
    }, 50);
    return () => clearInterval(timerRef.current);
  }, [started, showResult, gameOver, currentIndex]);

  // Time up
  useEffect(() => {
    if (timeLeft <= 0 && started && !showResult && !gameOver) {
      handleTimeUp();
    }
  }, [timeLeft, started, showResult, gameOver]);

  // ─── Initialize letters for current word ──────────

  useEffect(() => {
    const letters = current.word.toUpperCase().split("").map((letter, i) => ({
      id: `${i}-${letter}-${Math.random()}`,
      letter,
    }));
    setScrambledLetters(scrambleArray(letters));
    setPlacedLetters(new Array(current.word.length).fill(null));
    setShowResult(false);
    setIsCorrect(false);
    setRevealPhase(false);
    setDraggedId(null);
  }, [currentIndex, current.word]);

  // ─── Auto-speak sentence on question start ────────
  useEffect(() => {
    if (!started || showResult || gameOver) return;
    // Cancel any lingering speech from previous question's reveal
    window.speechSynthesis?.cancel();
    const spokenSentence = current.sentence.replace(/_+/g, "what");
    const timeout = setTimeout(() => speak(spokenSentence), 600);
    return () => {
      clearTimeout(timeout);
      window.speechSynthesis?.cancel();
    };
  }, [currentIndex, started, gameOver]);

  // ─── Auto-check when all slots filled ─────────────

  useEffect(() => {
    if (showResult || !started) return;
    if (placedLetters.every((l) => l !== null)) {
      // Small delay for the last letter to settle visually
      setTimeout(() => checkAnswer(), 300);
    }
  }, [placedLetters, showResult, started]);

  // ─── Handlers ─────────────────────────────────────

  const handleTimeUp = useCallback(() => {
    if (showResult) return;
    clearInterval(timerRef.current);
    playIncorrectSound();
    setShowResult(true);
    setIsCorrect(false);
    setRevealPhase(true);
    setShowFlash("incorrect");
    setStreak(0);
    setTimeout(() => setShowFlash(null), 500);
    setTotalTime((t) => t + QUESTION_TIME);
    // Speak full sentence with the word inserted
    const fullSentence = current.sentence.replace(/_+/g, current.word);
    setTimeout(() => speak(fullSentence), 1200);
    setTimeout(advanceQuestion, 3500);
  }, [showResult, current.word]);

  const checkAnswer = useCallback(() => {
    if (showResult) return;
    clearInterval(timerRef.current);
    const answer = placedLetters.join("");
    const correct = answer === current.word.toUpperCase();

    setIsCorrect(correct);
    setShowResult(true);
    setRevealPhase(true);

    const elapsed = QUESTION_TIME - timeLeft;
    setTotalTime((t) => t + elapsed);

    // Speak full sentence with the word inserted
    const fullSentence = current.sentence.replace(/_+/g, current.word);
    setTimeout(() => speak(fullSentence), 1200);

    if (correct) {
      playCorrectSound();
      const newStreak = streak + 1;
      if (newStreak >= 2) playComboSound(newStreak);
      setStreak(newStreak);
      setCorrectCount((c) => c + 1);
      const timeBonus = Math.round((timeLeft / QUESTION_TIME) * 50);
      const streakBonus = Math.min(streak, 5) * 50;
      setScore((s) => s + 100 + timeBonus + streakBonus);
      setShowConfetti(true);
      setShowFlash("correct");
      setTimeout(() => { setShowConfetti(false); setShowFlash(null); }, 1500);
    } else {
      playIncorrectSound();
      setStreak(0);
      setShowFlash("incorrect");
      setTimeout(() => setShowFlash(null), 500);
    }

    setTimeout(advanceQuestion, 3500);
  }, [showResult, placedLetters, current.word, timeLeft, streak]);

  const advanceQuestion = useCallback(() => {
    if (currentIndex + 1 >= words.length) {
      setGameOver(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, words.length]);

  // ─── Drag & tap handlers ──────────────────────────

  const handleLetterTap = useCallback((letterId: string) => {
    if (showResult || !started) return;

    // Find the letter
    const letter = scrambledLetters.find((l) => l.id === letterId);
    if (!letter) return;

    // Check if it's already placed
    const placedIndex = placedLetters.indexOf(letterId);
    if (placedIndex !== -1) {
      // Remove from slot — put back in pool
      playSelectSound();
      setPlacedLetters((prev) => {
        const next = [...prev];
        next[placedIndex] = null;
        return next;
      });
      return;
    }

    // Place in next empty slot
    const emptySlot = placedLetters.indexOf(null);
    if (emptySlot === -1) return;

    playFlipSound();
    setPlacedLetters((prev) => {
      const next = [...prev];
      next[emptySlot] = letterId;
      return next;
    });
  }, [showResult, started, scrambledLetters, placedLetters]);

  const handleSlotTap = useCallback((slotIndex: number) => {
    if (showResult || !started) return;
    const letterId = placedLetters[slotIndex];
    if (!letterId) return;

    // Remove from slot
    playSelectSound();
    setPlacedLetters((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  }, [showResult, started, placedLetters]);

  // ─── Drag & drop handlers ─────────────────────────

  const handleDragStart = useCallback((letterId: string) => {
    if (showResult || !started) return;
    setDraggedId(letterId);
  }, [showResult, started]);

  const handleDropOnSlot = useCallback((slotIndex: number) => {
    if (!draggedId || showResult || !started) return;

    // If slot is occupied, swap back
    const existingId = placedLetters[slotIndex];
    
    // Remove dragged letter from any existing slot
    const existingSlot = placedLetters.indexOf(draggedId);

    playFlipSound();
    setPlacedLetters((prev) => {
      const next = [...prev];
      if (existingSlot !== -1) {
        next[existingSlot] = existingId; // swap
      }
      next[slotIndex] = draggedId;
      return next;
    });
    setDraggedId(null);
  }, [draggedId, showResult, started, placedLetters]);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  // ─── Reset ────────────────────────────────────────

  const resetGame = () => {
    setCurrentIndex(0);
    setGameOver(false);
    setShowConfetti(false);
    setStarted(false);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setTotalTime(0);
  };

  // ─── Helpers ──────────────────────────────────────

  const getLetterById = (id: string) => scrambledLetters.find((l) => l.id === id);
  const isLetterPlaced = (id: string) => placedLetters.includes(id);

  const timerPercent = (timeLeft / QUESTION_TIME) * 100;
  const timerColor = timeLeft > 10 ? "hsl(195, 75%, 50%)" : timeLeft > 5 ? "hsl(35, 85%, 55%)" : "hsl(350, 75%, 55%)";

  // ─── Render ───────────────────────────────────────

  if (gameOver) {
    return (
      <GameComplete
        score={score} correctCount={correctCount} totalQuestions={words.length}
        timeElapsed={totalTime} gameId={gameId} onPlayAgain={resetGame} onExit={onExit}
        instructionLang={instructionLang}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
      <AnimatePresence>
        {!started && <CountdownOverlay onComplete={() => setStarted(true)} />}
      </AnimatePresence>

      {showConfetti && <ConfettiBurst count={30} />}
      {showFlash && <ScreenFlash type={showFlash} />}

      {/* Quit confirmation */}
      <AnimatePresence>
        {showQuitConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowQuitConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="bg-card rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xl font-bold text-foreground mb-2">Quit game?</p>
              <p className="text-muted-foreground mb-6 text-sm">Your progress will be lost.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowQuitConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-muted text-foreground font-bold text-sm hover:bg-muted/80 transition-colors">
                  Keep Playing
                </button>
                <button onClick={onExit}
                  className="flex-1 py-3 rounded-xl bg-destructive text-white font-bold text-sm hover:opacity-90 transition-opacity">
                  Quit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HUD ──────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 relative z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowQuitConfirm(true)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
          <button onClick={() => { toggleMute(); setMutedState(isMuted()); }}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all">
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {words.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i < currentIndex ? "bg-green-400" : i === currentIndex ? "bg-white scale-125" : "bg-white/20"
            }`} />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: "hsl(35, 85%, 55%)", color: "#1a1a2e" }}>
              🔥 {streak}
            </motion.div>
          )}
          <div className="text-white font-bold text-lg tabular-nums min-w-[60px] text-right">
            {score}
          </div>
        </div>
      </div>

      {/* ─── Timer Bar ────────────────────────────────── */}
      <div className="px-4">
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: timerColor }}
            animate={{ width: `${timerPercent}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>

      {/* ─── Main Content ─────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6 relative">

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-2xl flex flex-col items-center gap-6"
          >
            {/* Emoji + title */}
            <div className="text-center">
              <span className="text-4xl mb-2 block">🐝</span>
              <p className="text-white/50 text-sm font-medium tracking-wide uppercase">Spell the word</p>
            </div>

            {/* Sentence clue */}
            <SpeakableText text={current.sentence} showIcon className="justify-center">
              <p className="text-white/80 text-lg md:text-xl text-center font-medium leading-relaxed max-w-lg italic">
                "{current.sentence}"
              </p>
            </SpeakableText>

            {/* ─── Drop slots ─────────────────────────── */}
            <div className="flex gap-2 md:gap-3 justify-center flex-wrap mb-2">
              {placedLetters.map((letterId, slotIndex) => {
                const letter = letterId ? getLetterById(letterId) : null;
                const colorIdx = slotIndex % LETTER_COLORS.length;
                const isCorrectSlot = showResult && letter &&
                  letter.letter === current.word[slotIndex]?.toUpperCase();
                const isWrongSlot = showResult && letter &&
                  letter.letter !== current.word[slotIndex]?.toUpperCase();

                return (
                  <motion.div
                    key={slotIndex}
                    layout
                    className="relative cursor-pointer select-none"
                    onClick={() => handleSlotTap(slotIndex)}
                    onDragOver={(e) => { e.preventDefault(); }}
                    onDrop={(e) => { e.preventDefault(); handleDropOnSlot(slotIndex); }}
                    animate={
                      isWrongSlot ? { x: [0, -6, 6, -6, 0] } :
                      isCorrectSlot ? { scale: [1, 1.1, 1] } : {}
                    }
                    transition={{ duration: 0.4 }}
                  >
                    <div
                      className="w-14 h-16 md:w-16 md:h-[72px] rounded-xl flex items-center justify-center text-2xl md:text-3xl font-black transition-all duration-200"
                      style={{
                        background: letter
                          ? isCorrectSlot ? "hsl(150, 65%, 45%)"
                          : isWrongSlot ? "hsl(350, 75%, 55%)"
                          : LETTER_COLORS[colorIdx].bg
                          : "transparent",
                        border: letter ? "none" : "3px dashed rgba(255,255,255,0.25)",
                        boxShadow: letter
                          ? `0 4px 0 ${isCorrectSlot ? "hsl(150,65%,32%)" : isWrongSlot ? "hsl(350,75%,40%)" : LETTER_COLORS[colorIdx].shadow}, 0 6px 20px rgba(0,0,0,0.3)`
                          : "none",
                        color: letter ? "#fff" : "transparent",
                        minWidth: "3.5rem",
                      }}
                    >
                      {letter?.letter || ""}
                    </div>
                    {/* Slot number indicator */}
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/20 font-bold">
                      {slotIndex + 1}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Show correct answer with bouncing sentence */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-center flex flex-col items-center gap-3"
                >
                  {/* Bouncing word letters */}
                  <div className="flex gap-1 justify-center">
                    {current.word.toUpperCase().split("").map((ch, i) => (
                      <motion.span
                        key={i}
                        className="text-3xl md:text-4xl font-black inline-block"
                        style={{ color: isCorrect ? "hsl(150, 65%, 55%)" : "hsl(35, 85%, 55%)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: [0, -14, 0] }}
                        transition={{ delay: 0.2 + i * 0.08, duration: 0.45, ease: "easeOut" }}
                      >
                        {ch}
                      </motion.span>
                    ))}
                  </div>

                  {/* Full sentence with per-word bounce */}
                  <div className="flex flex-wrap gap-1.5 justify-center max-w-lg mt-2">
                    {current.sentence.replace(/_+/g, current.word).split(/\s+/).map((word, i) => {
                      const isTarget = word.toLowerCase().replace(/[^a-z]/g, "") === current.word.toLowerCase();
                      return (
                        <motion.span
                          key={i}
                          className={`text-lg md:text-xl font-bold inline-block ${
                            isTarget ? "text-primary" : "text-white/80"
                          }`}
                          style={isTarget ? { color: isCorrect ? "hsl(150, 65%, 55%)" : "hsl(35, 85%, 55%)", textDecoration: "underline", textUnderlineOffset: "4px" } : {}}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: [0, -6, 0] }}
                          transition={{ delay: 0.6 + i * 0.07, duration: 0.4, ease: "easeOut" }}
                        >
                          {word}
                        </motion.span>
                      );
                    })}
                  </div>

                  {isCorrect && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-xl font-black" style={{ color: "hsl(150, 65%, 55%)" }}
                    >
                      ✨ Perfect! ✨
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── Letter pool (scrambled) ──────────── */}
            {!showResult && (
              <motion.div
                className="flex gap-2 md:gap-3 justify-center flex-wrap mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {scrambledLetters.map((item, i) => {
                  const placed = isLetterPlaced(item.id);
                  const colorIdx = i % LETTER_COLORS.length;
                  const isDragging = draggedId === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      draggable={!placed && started && !showResult}
                      onDragStart={() => handleDragStart(item.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => !placed && handleLetterTap(item.id)}
                      initial={{ scale: 0, rotateY: 180 }}
                      animate={{
                        scale: placed ? 0.6 : isDragging ? 1.15 : 1,
                        rotateY: 0,
                        opacity: placed ? 0.2 : 1,
                        y: placed ? 10 : 0,
                      }}
                      whileHover={!placed ? { scale: 1.1, y: -4 } : {}}
                      whileTap={!placed ? { scale: 0.95 } : {}}
                      transition={{ delay: placed ? 0 : i * 0.04, type: "spring", damping: 14 }}
                      className="select-none"
                      style={{
                        cursor: placed ? "default" : "grab",
                        pointerEvents: placed ? "none" : "auto",
                      }}
                    >
                      <div
                        className="w-14 h-16 md:w-16 md:h-[72px] rounded-xl flex items-center justify-center text-2xl md:text-3xl font-black text-white"
                        style={{
                          background: LETTER_COLORS[colorIdx].bg,
                          boxShadow: `0 4px 0 ${LETTER_COLORS[colorIdx].shadow}, 0 6px 20px rgba(0,0,0,0.3)`,
                        }}
                      >
                        {item.letter}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Hint - speakable on hover/tap only */}
            {current.hint && !showResult && (
              <SpeakableText text={current.hint} speakOnHover speakOnClick>
                <p className="text-white/40 text-sm text-center mt-2 cursor-pointer hover:text-white/60 transition-colors">
                  💡 {current.hint}
                </p>
              </SpeakableText>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
