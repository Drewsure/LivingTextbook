import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound } from "@/utils/audio";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { speak } from "./SpeakableText";

interface JeopardyQuestion {
  question: string;
  answer: string;
}

interface JeopardyCategory {
  name: string;
  questions: JeopardyQuestion[];
}

interface JeopardyGameProps {
  gameData: { categories: JeopardyCategory[]; daily_double_count?: number };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

const POINT_VALUES = [100, 200, 300, 400, 500];
const REVEAL_DURATION = 1200;

type CellState = "available" | "selected" | "answered" | "daily_double";
type Phase = "board" | "question" | "daily_double_wager" | "reveal" | "final";

export function JeopardyGame({ gameData, gameId, onExit, instructionLang = "en" }: JeopardyGameProps) {
  const [theme] = useState(() => getRandomTheme());
  const { timeElapsed, stop: stopTimer } = useGameTimer();
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);

  const categories = gameData.categories.slice(0, 5);
  const maxRows = Math.max(...categories.map(c => c.questions.length), 5);

  // Track answered cells
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<Phase>("board");
  const [activeCell, setActiveCell] = useState<{ cat: number; row: number } | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [wager, setWager] = useState(0);
  const [wagerInput, setWagerInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Daily doubles - randomly assign 1-2
  const [dailyDoubles] = useState<Set<string>>(() => {
    const ddCount = Math.min(gameData.daily_double_count || 2, 3);
    const cells: string[] = [];
    categories.forEach((cat, ci) => {
      cat.questions.forEach((_, qi) => {
        if (qi >= 2) cells.push(`${ci},${qi}`); // Only on higher-value questions
      });
    });
    const selected = new Set<string>();
    for (let i = 0; i < Math.min(ddCount, cells.length); i++) {
      const idx = Math.floor(Math.random() * cells.length);
      selected.add(cells.splice(idx, 1)[0]);
    }
    return selected;
  });

  const totalQuestions = categories.reduce((sum, c) => sum + Math.min(c.questions.length, 5), 0);

  // Question timer
  useEffect(() => {
    if (!timerActive || questionTimer <= 0) return;
    const t = setTimeout(() => setQuestionTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, questionTimer]);

  // Time's up
  useEffect(() => {
    if (timerActive && questionTimer === 0 && phase === "question") {
      handleSubmitAnswer(true);
    }
  }, [questionTimer, timerActive, phase]);

  const selectCell = (cat: number, row: number) => {
    const key = `${cat},${row}`;
    if (answered.has(key)) return;

    setActiveCell({ cat, row });
    setUserAnswer("");
    setShowAnswer(false);
    setIsCorrect(null);

    if (dailyDoubles.has(key)) {
      setPhase("daily_double_wager");
      setWagerInput(String(Math.min(totalScore, POINT_VALUES[row] || 200)));
      // Announce daily double
      setTimeout(() => speak("Daily Double!"), 300);
    } else {
      setPhase("question");
      setQuestionTimer(30);
      setTimerActive(true);
      // Speak the question
      const question = categories[cat]?.questions[row]?.question;
      if (question) setTimeout(() => speak(question), 300);
    }

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const startQuestionAfterWager = () => {
    const w = Math.max(0, Math.min(parseInt(wagerInput) || 0, Math.max(totalScore, 1000)));
    setWager(w);
    setPhase("question");
    setQuestionTimer(30);
    setTimerActive(true);
    // Speak the question after wager
    if (activeCell) {
      const question = categories[activeCell.cat]?.questions[activeCell.row]?.question;
      if (question) setTimeout(() => speak(question), 300);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmitAnswer = useCallback((timedOut = false) => {
    if (!activeCell || phase !== "question") return;
    setTimerActive(false);

    const { cat, row } = activeCell;
    const question = categories[cat]?.questions[row];
    if (!question) return;

    const key = `${cat},${row}`;
    const isDailyDouble = dailyDoubles.has(key);
    const points = isDailyDouble ? wager : POINT_VALUES[row] || 100;

    // Check answer - fuzzy match
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
    const correct = !timedOut && (
      normalize(userAnswer) === normalize(question.answer) ||
      normalize(question.answer).includes(normalize(userAnswer)) ||
      normalize(userAnswer).includes(normalize(question.answer))
    );

    setIsCorrect(correct);
    setShowAnswer(true);
    setPhase("reveal");

    if (correct) {
      setTotalScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
      playCorrectSound();
      setShowConfetti(true);
      setShowFlash("correct");
      setTimeout(() => { setShowConfetti(false); setShowFlash(null); }, 800);
    } else {
      setTotalScore(prev => Math.max(0, prev - (isDailyDouble ? wager : 0)));
      setStreak(0);
      playIncorrectSound();
      setShowFlash("incorrect");
      setTimeout(() => setShowFlash(null), 500);
    }

    // Speak the correct answer after a brief pause
    setTimeout(() => speak(question.answer), 600);

    setAnswered(prev => new Set([...prev, key]));

    // Check game complete
    setTimeout(() => {
      if (answered.size + 1 >= totalQuestions) {
        stopTimer();
        setTimeout(() => setGameOver(true), 1500);
      }
    }, 2000);
  }, [activeCell, phase, userAnswer, categories, dailyDoubles, wager, answered, totalQuestions, stopTimer]);

  const closeCurrent = () => {
    setPhase("board");
    setActiveCell(null);
    setWager(0);
  };

  if (!started) {
    return (
      <ThemedBackground theme={theme}>
        <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center z-10 max-w-md mx-auto p-8"
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🏆
          </motion.div>
          <h1 className="font-display text-4xl font-black text-white mb-3 drop-shadow-lg">Jeopardy!</h1>
          <p className="text-white/80 font-body mb-2">{categories.length} categories · {totalQuestions} questions</p>
          <p className="text-white/60 text-sm font-body mb-8">Pick questions from the board. Higher values = harder!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStarted(true)}
            className="px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-xl shadow-2xl"
          >
            Let's Play! 🏆
          </motion.button>
        </motion.div>
        </div>
      </ThemedBackground>
    );
  }

  if (gameOver) {
    return (
      <GameComplete
        score={totalScore}
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        timeElapsed={timeElapsed}
        gameId={gameId}
        onPlayAgain={() => {
          setGameOver(false);
          setStarted(false);
          setAnswered(new Set());
          setTotalScore(0);
          setStreak(0);
          setCorrectCount(0);
          setPhase("board");
          setActiveCell(null);
        }}
        onExit={onExit}
        instructionLang={instructionLang}
      />
    );
  }

  return (
    <ThemedBackground theme={theme}>
      <div className="min-h-screen flex flex-col">
      {showConfetti && <ConfettiBurst />}
      {showFlash && <ScreenFlash type={showFlash} />}

      <div className="relative z-10 flex-1 flex flex-col p-2 md:p-4 max-w-5xl mx-auto w-full">
        <GameHeader
          score={totalScore}
          currentQuestion={answered.size}
          totalQuestions={totalQuestions}
          streak={streak}
          timeElapsed={timeElapsed}
          gameTitle="Jeopardy!"
          emoji="🏆"
          onQuit={onExit}
        />

        {/* Board */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Category headers */}
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
            {categories.map((cat, ci) => (
              <motion.div
                key={ci}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: ci * 0.1 }}
                className="bg-game-blue/90 rounded-xl p-2 md:p-3 text-center border-2 border-game-blue/50 shadow-lg"
              >
                <span className="font-display font-black text-xs md:text-sm text-white leading-tight line-clamp-2">
                  {cat.name}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Question grid */}
          {Array.from({ length: Math.min(maxRows, 5) }, (_, row) => (
            <div key={row} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
              {categories.map((cat, ci) => {
                const key = `${ci},${row}`;
                const isAnswered = answered.has(key);
                const hasQuestion = row < cat.questions.length;
                const points = POINT_VALUES[row] || 100;

                if (!hasQuestion) {
                  return <div key={ci} className="aspect-[3/2]" />;
                }

                return (
                  <motion.button
                    key={ci}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (ci + row * categories.length) * 0.03, type: "spring", damping: 15 }}
                    whileHover={isAnswered ? {} : { scale: 1.05, y: -3 }}
                    whileTap={isAnswered ? {} : { scale: 0.95 }}
                    onClick={() => !isAnswered && selectCell(ci, row)}
                    disabled={isAnswered}
                    className={`aspect-[3/2] rounded-xl border-2 font-display font-black text-lg md:text-2xl transition-all relative overflow-hidden
                      ${isAnswered
                        ? "bg-muted/20 border-border/20 text-muted-foreground/20 cursor-default"
                        : "bg-gradient-to-b from-game-blue/80 to-game-blue border-game-blue/60 text-secondary shadow-lg shadow-game-blue/20 cursor-pointer hover:shadow-xl hover:shadow-game-blue/30"
                      }
                    `}
                  >
                    {!isAnswered && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 + ci }}
                      />
                    )}
                    <span className="relative z-10">${points}</span>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Question overlay */}
      <AnimatePresence>
        {(phase === "question" || phase === "daily_double_wager" || phase === "reveal") && activeCell && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.7, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 50 }}
              className="w-full max-w-lg"
            >
              {/* Daily Double Wager */}
              {phase === "daily_double_wager" && (
                <motion.div
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  className="bg-card rounded-3xl border-4 border-secondary shadow-2xl p-8 text-center"
                >
                  <motion.div
                    className="text-7xl mb-4"
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.8 }}
                  >
                    ⭐
                  </motion.div>
                  <h2 className="font-display text-3xl font-black text-secondary mb-2">DAILY DOUBLE!</h2>
                  <p className="text-muted-foreground font-body mb-6">
                    Your score: <span className="font-bold text-primary">${totalScore}</span>
                  </p>
                  <div className="mb-6">
                    <label className="text-sm font-display font-bold text-foreground mb-2 block">How much will you wager?</label>
                    <input
                      type="number"
                      value={wagerInput}
                      onChange={e => setWagerInput(e.target.value)}
                      min={0}
                      max={Math.max(totalScore, 1000)}
                      className="w-full text-center text-2xl font-display font-black bg-muted border-2 border-border rounded-xl p-3 text-foreground focus:border-primary focus:outline-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Max: ${Math.max(totalScore, 1000)}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startQuestionAfterWager}
                    className="px-8 py-3 rounded-2xl bg-secondary text-secondary-foreground font-display font-bold text-lg shadow-xl"
                  >
                    Let's Go! 🎯
                  </motion.button>
                </motion.div>
              )}

              {/* Question */}
              {(phase === "question" || phase === "reveal") && (
                <div className="bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden">
                  {/* Timer bar */}
                  {phase === "question" && (
                    <div className="h-2 bg-muted">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: questionTimer > 10
                            ? "hsl(var(--game-green))"
                            : questionTimer > 5
                              ? "hsl(var(--game-orange))"
                              : "hsl(var(--destructive))",
                        }}
                        initial={{ width: "100%" }}
                        animate={{ width: `${(questionTimer / 30) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}

                  <div className="p-6 md:p-8">
                    {/* Category + Points */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-display font-bold text-game-blue bg-game-blue/10 px-3 py-1 rounded-full">
                        {categories[activeCell.cat]?.name}
                      </span>
                      <span className="text-xs font-display font-bold text-secondary">
                        {dailyDoubles.has(`${activeCell.cat},${activeCell.row}`) ? `Wager: $${wager}` : `$${POINT_VALUES[activeCell.row]}`}
                      </span>
                    </div>

                    {/* Question */}
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="font-display text-xl md:text-2xl font-black text-foreground text-center mb-6 leading-relaxed"
                    >
                      {categories[activeCell.cat]?.questions[activeCell.row]?.question}
                    </motion.h2>

                    {/* Timer display */}
                    {phase === "question" && (
                      <div className="text-center mb-4">
                        <motion.span
                          key={questionTimer}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                          className={`font-mono text-3xl font-black ${questionTimer <= 5 ? "text-destructive" : questionTimer <= 10 ? "text-game-orange" : "text-muted-foreground"}`}
                        >
                          {questionTimer}
                        </motion.span>
                      </div>
                    )}

                    {/* Answer input */}
                    {phase === "question" && (
                      <form onSubmit={(e) => { e.preventDefault(); handleSubmitAnswer(); }}>
                        <div className="flex gap-2">
                          <input
                            ref={inputRef}
                            type="text"
                            value={userAnswer}
                            onChange={e => setUserAnswer(e.target.value)}
                            placeholder="Type your answer..."
                            autoFocus
                            className="flex-1 text-lg font-display bg-muted border-2 border-border rounded-xl px-4 py-3 text-foreground focus:border-primary focus:outline-none placeholder:text-muted-foreground/50"
                          />
                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold shadow-lg"
                          >
                            Submit
                          </motion.button>
                        </div>
                      </form>
                    )}

                    {/* Reveal */}
                    {phase === "reveal" && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", damping: 10 }}
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-display font-black text-lg mb-4
                            ${isCorrect ? "bg-game-green/20 text-game-green" : "bg-destructive/20 text-destructive"}
                          `}
                        >
                          {isCorrect ? "✅ CORRECT!" : "❌ Not quite!"}
                          {isCorrect && (
                            <span className="text-sm font-bold">
                              +${dailyDoubles.has(`${activeCell.cat},${activeCell.row}`) ? wager : POINT_VALUES[activeCell.row]}
                            </span>
                          )}
                        </motion.div>

                        {/* Show correct answer */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mb-6"
                        >
                          <p className="text-xs text-muted-foreground font-body mb-1">The answer is:</p>
                          <p className="font-display text-2xl font-black text-primary">
                            {categories[activeCell.cat]?.questions[activeCell.row]?.answer}
                          </p>
                        </motion.div>

                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={closeCurrent}
                          className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-display font-bold shadow-xl"
                        >
                          Back to Board →
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      </ThemedBackground>
  );
}
