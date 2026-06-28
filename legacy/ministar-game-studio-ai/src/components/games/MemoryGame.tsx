import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { t } from "@/utils/translations";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, ScorePopup, CountdownOverlay } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playFlipSound, playComboSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";
import { AnimatePresence } from "framer-motion";

interface MemoryPair { left: string; right: string; }
interface MemoryGameProps {
  gameData: { pairs: MemoryPair[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}
interface Card { id: number; text: string; pairIndex: number; side: "left" | "right"; }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CARD_COLORS = [
  "hsl(262, 83%, 58%)",
  "hsl(145, 72%, 50%)",
  "hsl(28, 100%, 58%)",
  "hsl(340, 82%, 62%)",
  "hsl(210, 100%, 56%)",
  "hsl(262, 83%, 50%)",
];

export function MemoryGame({ gameData, gameId, onExit, instructionLang = "en" }: MemoryGameProps) {
  const pairs = gameData.pairs.slice(0, 6);
  const [started, setStarted] = useState(false);
  const [cards] = useState<Card[]>(() => {
    const all: Card[] = [];
    pairs.forEach((p, i) => {
      all.push({ id: i * 2, text: p.left, pairIndex: i, side: "left" });
      all.push({ id: i * 2 + 1, text: p.right, pairIndex: i, side: "right" });
    });
    return shuffle(all);
  });

  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number[]>([]);
  const [checking, setChecking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [scorePopup, setScorePopup] = useState<{ points: number; streak: number } | null>(null);
  const [theme] = useState(getRandomTheme);

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  const handleFlip = useCallback(
    (cardIdx: number) => {
      if (checking || flipped.has(cardIdx) || matched.has(cardIdx) || !started) return;
      if (selected.length >= 2) return;

      playFlipSound();
      

      const newFlipped = new Set(flipped);
      newFlipped.add(cardIdx);
      setFlipped(newFlipped);

      const newSelected = [...selected, cardIdx];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setChecking(true);
        const [a, b] = newSelected;
        const cardA = cards[a];
        const cardB = cards[b];
        const isMatch = cardA.pairIndex === cardB.pairIndex && cardA.side !== cardB.side;

        setTimeout(() => {
          if (isMatch) {
            playCorrectSound();
            if (streak >= 1) playComboSound(streak + 1);
            addCorrect();
            const newMatched = new Set(matched);
            newMatched.add(a);
            newMatched.add(b);
            setMatched(newMatched);
            setShowConfetti(true);
            setShowFlash("correct");
            const streakBonus = Math.min(streak, 5);
            setScorePopup({ points: 100 + streakBonus * 50, streak: streak + 1 });
            // Speak the matched pair
            setTimeout(() => speak(`${cardA.text} and ${cardB.text}`), 300);
            setTimeout(() => { setShowConfetti(false); setShowFlash(null); setScorePopup(null); }, 1200);
            if (newMatched.size === cards.length) {
              stop();
              setTimeout(() => setGameOver(true), 800);
            }
          } else {
            playIncorrectSound();
            addIncorrect();
            setShowFlash("incorrect");
            const resetFlipped = new Set(flipped);
            resetFlipped.delete(a);
            resetFlipped.delete(b);
            matched.forEach((m) => resetFlipped.add(m));
            setFlipped(resetFlipped);
            setTimeout(() => setShowFlash(null), 500);
          }
          setSelected([]);
          setChecking(false);
        }, 1000);
      }
    },
    [checking, flipped, matched, selected, cards, addCorrect, addIncorrect, stop, streak, started]
  );

  const resetGame = () => {
    setFlipped(new Set());
    setMatched(new Set());
    setSelected([]);
    setChecking(false);
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

  return (
    <ThemedBackground theme={theme}>
      <AnimatePresence>
        {!started && <CountdownOverlay onComplete={() => setStarted(true)} />}
      </AnimatePresence>

      {showConfetti && <ConfettiBurst count={20} />}
      {showFlash && <ScreenFlash type={showFlash} />}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <AnimatePresence>
          {scorePopup && <ScorePopup points={scorePopup.points} streak={scorePopup.streak} />}
        </AnimatePresence>

        <GameHeader score={score} currentQuestion={matched.size / 2} totalQuestions={pairs.length}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Memory Cards" emoji="🃏" onQuit={onExit} />

        <SpeakableText text={t("memory_instruction", instructionLang)}>
          <p className="text-center text-sm text-muted-foreground mb-4 font-body">
            {t("memory_instruction", instructionLang)}
          </p>
        </SpeakableText>

        <div
          className="grid gap-3 md:gap-4 w-full max-w-2xl"
          style={{ gridTemplateColumns: `repeat(4, 1fr)` }}
        >
          {cards.map((card, idx) => {
            const isFlipped = flipped.has(idx) || matched.has(idx);
            const isMatched = matched.has(idx);
            const colorIdx = card.pairIndex % CARD_COLORS.length;

            return (
              <motion.button
                key={card.id}
                onClick={() => handleFlip(idx)}
                className="relative aspect-[3/4] rounded-2xl cursor-pointer"
                whileHover={!isFlipped && started ? { scale: 1.08, y: -4 } : {}}
                whileTap={!isFlipped && started ? { scale: 0.95 } : {}}
                disabled={isMatched || !started}
                style={{ perspective: 600 }}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5, type: "spring", damping: 18 }}
                  className="w-full h-full relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Back face */}
                  <div
                    className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center shadow-xl border-2 border-border"
                    style={{
                      backfaceVisibility: "hidden",
                      background: "linear-gradient(135deg, hsl(262, 83%, 58%), hsl(262, 83%, 40%))",
                    }}
                  >
                    {/* Card number for verbal reference */}
                    <span className="absolute top-2 left-2 bg-white/20 text-white font-display font-black text-lg w-8 h-8 rounded-full flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <motion.span 
                      className="text-4xl"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      ❓
                    </motion.span>
                  </div>

                  {/* Front face */}
                  <div
                    className={`absolute inset-0 rounded-2xl flex items-center justify-center p-2 shadow-xl border-2 ${
                      isMatched ? "border-game-green" : "border-white/20"
                    }`}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      backgroundColor: isMatched ? "hsl(145, 72%, 45%)" : CARD_COLORS[colorIdx],
                    }}
                  >
                    <SpeakableText text={card.text} inline>
                      <span className="font-display font-black text-center leading-tight text-white text-sm md:text-base">
                        {card.text}
                        {isMatched && <span className="block text-xl mt-1">✅</span>}
                      </span>
                    </SpeakableText>
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </ThemedBackground>
  );
}
