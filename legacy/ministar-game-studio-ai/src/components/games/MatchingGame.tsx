import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, ScorePopup, CountdownOverlay, EmojiBurst } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";
import { t } from "@/utils/translations";

interface MatchPair {
  left: string;
  right: string;
}

interface MatchingGameProps {
  gameData: { pairs: MatchPair[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LEFT_COLORS = [
  "hsl(262, 83%, 58%)",
  "hsl(210, 100%, 56%)",
  "hsl(340, 82%, 62%)",
  "hsl(262, 83%, 50%)",
  "hsl(145, 72%, 50%)",
  "hsl(28, 100%, 58%)",
];

const RIGHT_COLORS = [
  "hsl(28, 100%, 58%)",
  "hsl(145, 72%, 50%)",
  "hsl(262, 83%, 58%)",
  "hsl(340, 82%, 62%)",
  "hsl(210, 100%, 56%)",
  "hsl(28, 100%, 50%)",
];

export function MatchingGame({ gameData, gameId, onExit, instructionLang = "en" }: MatchingGameProps) {
  const pairs = gameData.pairs;
  const [started, setStarted] = useState(false);
  const [shuffledRight] = useState(() => shuffle(pairs.map((p) => p.right)));
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ left: number; right: number } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [scorePopup, setScorePopup] = useState<{ points: number; streak: number } | null>(null);
  const [theme] = useState(getRandomTheme);

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  const checkMatch = useCallback(
    (leftIdx: number, rightIdx: number) => {
      const leftWord = pairs[leftIdx].right;
      const rightWord = shuffledRight[rightIdx];

      if (leftWord === rightWord) {
        playCorrectSound();
        if (streak >= 1) playComboSound(streak + 1);
        addCorrect();
        const newMatched = new Set(matched);
        newMatched.add(leftIdx);
        setMatched(newMatched);
        setSelectedLeft(null);
        setSelectedRight(null);
        setShowConfetti(true);
        setShowFlash("correct");
        const streakBonus = Math.min(streak, 5);
        setScorePopup({ points: 100 + streakBonus * 50, streak: streak + 1 });
        // Speak the matched pair
        setTimeout(() => speak(`${pairs[leftIdx].left} matches ${leftWord}`), 300);
        setTimeout(() => { setShowConfetti(false); setShowFlash(null); setScorePopup(null); }, 1200);

        if (newMatched.size === pairs.length) {
          stop();
          setTimeout(() => setGameOver(true), 800);
        }
      } else {
        playIncorrectSound();
        addIncorrect();
        setShowFlash("incorrect");
        setScorePopup(null);
        setWrongPair({ left: leftIdx, right: rightIdx });
        setTimeout(() => {
          setWrongPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
          setShowFlash(null);
        }, 800);
      }
    },
    [pairs, shuffledRight, matched, addCorrect, addIncorrect, stop, streak]
  );

  const handleLeftClick = (idx: number) => {
    if (matched.has(idx) || !started) return;
    setSelectedLeft(idx);
    if (selectedRight !== null) checkMatch(idx, selectedRight);
  };

  const handleRightClick = (idx: number) => {
    if (!started) return;
    const matchedRightValues = new Set(Array.from(matched).map((i) => pairs[i].right));
    if (matchedRightValues.has(shuffledRight[idx])) return;
    setSelectedRight(idx);
    if (selectedLeft !== null) checkMatch(selectedLeft, idx);
  };

  const resetGame = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatched(new Set());
    setWrongPair(null);
    setGameOver(false);
    setStarted(false);
  };

  if (gameOver) {
    return (
      <GameComplete score={score} correctCount={correctCount} totalQuestions={pairs.length}
        timeElapsed={timeElapsed} gameId={gameId} onPlayAgain={resetGame} onExit={onExit}
        instructionLang={instructionLang} />
    );
  }

  const matchedRightValues = new Set(Array.from(matched).map((i) => pairs[i].right));

  return (
    <ThemedBackground theme={theme}>
      <AnimatePresence>
        {!started && <CountdownOverlay onComplete={() => setStarted(true)} />}
      </AnimatePresence>

      {showConfetti && <ConfettiBurst count={25} />}
      {showFlash && <ScreenFlash type={showFlash} />}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <AnimatePresence>
          {scorePopup && <ScorePopup points={scorePopup.points} streak={scorePopup.streak} />}
        </AnimatePresence>

        <GameHeader score={score} currentQuestion={matched.size} totalQuestions={pairs.length}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Match Up" emoji="🧩" onQuit={onExit} />

        <div className="w-full max-w-3xl">
          <SpeakableText text={t("matching_instruction", instructionLang)}>
            <p className="text-center text-sm text-muted-foreground mb-4 font-body">
              {t("matching_instruction", instructionLang)}
            </p>
          </SpeakableText>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {/* Left column */}
            <div className="space-y-3">
              {pairs.map((pair, i) => {
                const isMatched = matched.has(i);
                const isSelected = selectedLeft === i;
                const isWrong = wrongPair?.left === i;

                return (
                  <motion.button
                    key={`left-${i}`}
                    onClick={() => handleLeftClick(i)}
                    layout
                    animate={
                      isWrong
                        ? { x: [0, -8, 8, -8, 0] }
                        : isMatched
                        ? { scale: [1, 1.1, 0.95], opacity: 0.4 }
                        : {}
                    }
                    whileHover={!isMatched && started ? { scale: 1.04, y: -2 } : {}}
                    whileTap={!isMatched && started ? { scale: 0.96 } : {}}
                    disabled={isMatched || !started}
                    className="w-full p-4 md:p-5 rounded-2xl font-display font-bold text-white text-left transition-all shadow-lg relative"
                    style={{
                      backgroundColor: isMatched 
                        ? "hsl(145, 72%, 50%)" 
                        : isSelected 
                        ? "hsl(262, 83%, 50%)" 
                        : isWrong 
                        ? "hsl(0, 84%, 60%)" 
                        : LEFT_COLORS[i % LEFT_COLORS.length],
                      opacity: isMatched ? 0.4 : 1,
                      boxShadow: isSelected 
                        ? "0 0 0 3px hsl(262, 83%, 58%, 0.4), 0 8px 25px rgba(0,0,0,0.2)" 
                        : "0 4px 15px rgba(0,0,0,0.15)",
                    }}
                  >
                    {/* Number label for verbal reference */}
                    <span className="absolute top-1.5 left-2 bg-white/25 text-white font-display font-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="pl-5">
                      <SpeakableText text={pair.left} inline speakOnHover={!isMatched}>
                        {pair.left}
                      </SpeakableText>
                    </span>
                    {isMatched && <span className="ml-2">✅</span>}
                  </motion.button>
                );
              })}
            </div>

            {/* Right column */}
            <div className="space-y-3">
              {shuffledRight.map((right, i) => {
                const isMatched = matchedRightValues.has(right);
                const isSelected = selectedRight === i;
                const isWrong = wrongPair?.right === i;

                const letterLabel = String.fromCharCode(65 + i); // A, B, C, D...
                return (
                  <motion.button
                    key={`right-${i}`}
                    onClick={() => handleRightClick(i)}
                    layout
                    animate={
                      isWrong
                        ? { x: [0, -8, 8, -8, 0] }
                        : isMatched
                        ? { scale: [1, 1.1, 0.95], opacity: 0.4 }
                        : {}
                    }
                    whileHover={!isMatched && started ? { scale: 1.04, y: -2 } : {}}
                    whileTap={!isMatched && started ? { scale: 0.96 } : {}}
                    disabled={isMatched || !started}
                    className="w-full p-4 md:p-5 rounded-2xl font-display font-bold text-white text-left transition-all shadow-lg relative"
                    style={{
                      backgroundColor: isMatched 
                        ? "hsl(145, 72%, 50%)" 
                        : isSelected 
                        ? "hsl(28, 100%, 50%)" 
                        : isWrong 
                        ? "hsl(0, 84%, 60%)" 
                        : RIGHT_COLORS[i % RIGHT_COLORS.length],
                      opacity: isMatched ? 0.4 : 1,
                      boxShadow: isSelected 
                        ? "0 0 0 3px hsl(28, 100%, 58%, 0.4), 0 8px 25px rgba(0,0,0,0.2)" 
                        : "0 4px 15px rgba(0,0,0,0.15)",
                    }}
                  >
                    {/* Letter label for verbal reference */}
                    <span className="absolute top-1.5 left-2 bg-white/25 text-white font-display font-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {letterLabel}
                    </span>
                    <span className="pl-5">
                      <SpeakableText text={right} inline speakOnHover={!isMatched}>
                        {right}
                      </SpeakableText>
                    </span>
                    {isMatched && <span className="ml-2">✅</span>}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ThemedBackground>
  );
}
