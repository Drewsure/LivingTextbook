import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/utils/translations";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, ScorePopup, CountdownOverlay, EmojiBurst } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound, playSelectSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";

interface GroupSortData {
  groups: { name: string; items: string[] }[];
}

interface GroupSortGameProps {
  gameData: GroupSortData;
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

const GROUP_COLORS = [
  { bg: "hsl(262, 83%, 58%)", light: "hsl(262, 83%, 58%, 0.12)", text: "text-primary" },
  { bg: "hsl(145, 72%, 50%)", light: "hsl(145, 72%, 50%, 0.12)", text: "text-game-green" },
  { bg: "hsl(28, 100%, 58%)", light: "hsl(28, 100%, 58%, 0.12)", text: "text-game-orange" },
  { bg: "hsl(340, 82%, 62%)", light: "hsl(340, 82%, 62%, 0.12)", text: "text-game-pink" },
];

const ITEM_COLORS = [
  "hsl(262, 83%, 58%)", "hsl(145, 72%, 45%)", "hsl(28, 100%, 53%)",
  "hsl(340, 82%, 57%)", "hsl(210, 100%, 50%)", "hsl(262, 83%, 50%)",
];

export function GroupSortGame({ gameData, gameId, onExit, instructionLang = "en" }: GroupSortGameProps) {
  const groups = gameData.groups;
  const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);
  const [started, setStarted] = useState(false);

  const [allItems] = useState(() => {
    const items: { text: string; group: string }[] = [];
    groups.forEach((g) => g.items.forEach((item) => items.push({ text: item, group: g.name })));
    return shuffle(items);
  });

  const [remaining, setRemaining] = useState<typeof allItems>(allItems);
  const [sorted, setSorted] = useState<Record<string, string[]>>(() => {
    const s: Record<string, string[]> = {};
    groups.forEach((g) => (s[g.name] = []));
    return s;
  });
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; group: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [scorePopup, setScorePopup] = useState<{ points: number; streak: number } | null>(null);
  const [theme] = useState(getRandomTheme);

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  const handleGroupClick = useCallback(
    (groupName: string) => {
      if (selectedItem === null || feedback || !started) return;

      const item = remaining[selectedItem];
      const correct = item.group === groupName;

      setFeedback({ correct, group: groupName });

      if (correct) {
        playCorrectSound();
        if (streak >= 1) playComboSound(streak + 1);
        addCorrect();
        const newSorted = { ...sorted, [groupName]: [...sorted[groupName], item.text] };
        setSorted(newSorted);
        const newRemaining = remaining.filter((_, i) => i !== selectedItem);
        setRemaining(newRemaining);
        setShowConfetti(true);
        setShowFlash("correct");
        const streakBonus = Math.min(streak, 5);
        setScorePopup({ points: 100 + streakBonus * 50, streak: streak + 1 });
        // Speak the item and its group
        setTimeout(() => speak(`${item.text} belongs to ${groupName}`), 300);
        setTimeout(() => { setShowConfetti(false); setShowFlash(null); setScorePopup(null); }, 1200);

        if (newRemaining.length === 0) {
          stop();
          setTimeout(() => setGameOver(true), 800);
        }
      } else {
        playIncorrectSound();
        addIncorrect();
        setShowFlash("incorrect");
        setScorePopup(null);
        setTimeout(() => setShowFlash(null), 500);
      }

      setTimeout(() => {
        setFeedback(null);
        setSelectedItem(null);
      }, 800);
    },
    [selectedItem, remaining, sorted, feedback, addCorrect, addIncorrect, stop, streak, started]
  );

  const resetGame = () => {
    setRemaining(shuffle(allItems));
    const s: Record<string, string[]> = {};
    groups.forEach((g) => (s[g.name] = []));
    setSorted(s);
    setSelectedItem(null);
    setFeedback(null);
    setGameOver(false);
    setStarted(false);
  };

  if (gameOver) {
    return (
      <GameComplete score={score} correctCount={correctCount} totalQuestions={totalItems}
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

        <GameHeader score={score} currentQuestion={totalItems - remaining.length} totalQuestions={totalItems}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Group Sort" emoji="📦" onQuit={onExit} />

        <div className="w-full max-w-3xl">
          <SpeakableText text={t("group_sort_instruction", instructionLang)}>
            <p className="text-center text-sm text-muted-foreground mb-4 font-body">
              {t("group_sort_instruction", instructionLang)}
            </p>
          </SpeakableText>

          {/* Unsorted items */}
          <div className="flex flex-wrap gap-3 justify-center mb-6 min-h-[60px]">
            <AnimatePresence>
              {remaining.map((item, i) => (
                <motion.button
                  key={item.text}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0, y: 30 }}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    if (!started) return;
                    const newSel = i === selectedItem ? null : i;
                    setSelectedItem(newSel);
                    if (newSel !== null) playSelectSound();
                  }}
                  className="px-5 py-3 rounded-2xl font-display font-bold text-base text-white shadow-lg transition-all cursor-pointer relative"
                  style={{
                    backgroundColor: ITEM_COLORS[i % ITEM_COLORS.length],
                    boxShadow: selectedItem === i
                      ? "0 0 0 4px hsl(45, 100%, 65%), 0 8px 25px rgba(0,0,0,0.2)"
                      : "0 4px 15px rgba(0,0,0,0.15)",
                    transform: selectedItem === i ? "scale(1.1)" : undefined,
                  }}
                >
                  {/* Item number for verbal reference */}
                  <span className="absolute -top-1.5 -left-1.5 bg-white text-gray-800 font-display font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {i + 1}
                  </span>
                  <SpeakableText text={item.text} inline speakOnHover={false}>{item.text}</SpeakableText>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Group buckets */}
          <div className="grid grid-cols-2 gap-4">
            {groups.map((group, gi) => {
              const color = GROUP_COLORS[gi % GROUP_COLORS.length];
              const isFeedbackTarget = feedback?.group === group.name;
              const isFeedbackCorrect = feedback?.correct;

              const groupLetter = String.fromCharCode(65 + gi); // A, B, C, D
              return (
                <motion.button
                  key={group.name}
                  onClick={() => handleGroupClick(group.name)}
                  disabled={selectedItem === null || !!feedback || !started}
                  animate={
                    isFeedbackTarget
                      ? isFeedbackCorrect
                        ? { scale: [1, 1.06, 1] }
                        : { x: [0, -8, 8, -8, 0] }
                      : {}
                  }
                  whileHover={selectedItem !== null && !feedback && started ? { scale: 1.04, y: -2 } : {}}
                  className="rounded-2xl p-4 border-2 min-h-[120px] flex flex-col transition-all relative"
                  style={{
                    borderColor: isFeedbackTarget
                      ? isFeedbackCorrect ? "hsl(145, 72%, 50%)" : "hsl(0, 84%, 60%)"
                      : color.bg,
                    backgroundColor: isFeedbackTarget
                      ? isFeedbackCorrect ? "hsl(145, 72%, 50%, 0.1)" : "hsl(0, 84%, 60%, 0.1)"
                      : color.light,
                    cursor: selectedItem !== null && !feedback && started ? "pointer" : "default",
                    boxShadow: selectedItem !== null && !feedback && started ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {/* Group letter for verbal reference */}
                  <span 
                    className="absolute -top-2 -right-2 font-display font-black text-sm w-7 h-7 rounded-full flex items-center justify-center shadow-md text-white"
                    style={{ backgroundColor: color.bg }}
                  >
                    {groupLetter}
                  </span>
                  <SpeakableText text={group.name} inline>
                    <h4 className={`font-display font-black text-lg mb-2 ${color.text}`}>
                      {group.name}
                    </h4>
                  </SpeakableText>
                  <div className="flex flex-wrap gap-1.5">
                    {sorted[group.name].map((item) => (
                      <motion.span
                        key={item}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1.5 rounded-xl bg-card text-foreground font-body text-sm font-semibold border border-border shadow-sm"
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </ThemedBackground>
  );
}
