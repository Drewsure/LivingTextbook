import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/utils/translations";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash, ScorePopup, CountdownOverlay } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound, playSelectSound } from "@/utils/audio";
import { SpeakableText, speak } from "./SpeakableText";

interface WordSearchGameProps {
  gameData: { words: string[]; grid_size?: number };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

type Direction = [number, number];
const DIRECTIONS: Direction[] = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];

function generateGrid(words: string[], size: number): { grid: string[][]; placements: Map<string, Set<string>> } {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const placements = new Map<string, Set<string>>();

  const placeWord = (word: string): boolean => {
    const w = word.toUpperCase();
    const shuffledDirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);
    for (let attempt = 0; attempt < 50; attempt++) {
      const dir = shuffledDirs[attempt % shuffledDirs.length];
      const maxR = dir[0] >= 0 ? size - w.length * dir[0] : size;
      const maxC = dir[1] >= 0 ? size - w.length * dir[1] : size;
      const minR = dir[0] < 0 ? (w.length - 1) * Math.abs(dir[0]) : 0;
      const minC = dir[1] < 0 ? (w.length - 1) * Math.abs(dir[1]) : 0;
      if (maxR <= minR || maxC <= minC) continue;
      const r = minR + Math.floor(Math.random() * (maxR - minR));
      const c = minC + Math.floor(Math.random() * (maxC - minC));
      let canPlace = true;
      for (let i = 0; i < w.length; i++) {
        const nr = r + dir[0] * i;
        const nc = c + dir[1] * i;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) { canPlace = false; break; }
        if (grid[nr][nc] !== "" && grid[nr][nc] !== w[i]) { canPlace = false; break; }
      }
      if (canPlace) {
        const cells = new Set<string>();
        for (let i = 0; i < w.length; i++) {
          const nr = r + dir[0] * i;
          const nc = c + dir[1] * i;
          grid[nr][nc] = w[i];
          cells.add(`${nr}-${nc}`);
        }
        placements.set(word, cells);
        return true;
      }
    }
    return false;
  };

  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  sortedWords.forEach(w => placeWord(w));

  // Fill empty cells with random Latin letters only
  const latinLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "") grid[r][c] = latinLetters[Math.floor(Math.random() * 26)];
    }
  }
  return { grid, placements };
}

export function WordSearchGame({ gameData, gameId, onExit, instructionLang = "en" }: WordSearchGameProps) {
  const sanitizedWords = gameData.words
    .map((w) => String(w).normalize("NFKD").replace(/[^A-Za-z]/g, "").toUpperCase())
    .filter((w) => w.length >= 2)
    .slice(0, 8);
  const words = sanitizedWords.length > 0 ? sanitizedWords : ["STORM"];
  const gridSize = gameData.grid_size || Math.max(10, Math.ceil(Math.max(...words.map(w => w.length)) * 1.5));
  const [started, setStarted] = useState(false);
  const [{ grid, placements }] = useState(() => generateGrid(words, gridSize));
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [highlightedCells, setHighlightedCells] = useState<Map<string, string>>(new Map());
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [scorePopup, setScorePopup] = useState<{ points: number; streak: number } | null>(null);
  const [showWrong, setShowWrong] = useState(false);
  const [theme] = useState(getRandomTheme);

  const { timeElapsed, stop } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();

  const WORD_COLORS = ["hsl(262, 83%, 58%)", "hsl(145, 72%, 50%)", "hsl(28, 100%, 58%)", "hsl(340, 82%, 62%)", "hsl(210, 100%, 56%)", "hsl(45, 100%, 50%)", "hsl(180, 60%, 45%)", "hsl(300, 70%, 55%)"];

  const checkSelection = useCallback(() => {
    if (selectedCells.size < 2) return false;

    for (const [word, cells] of placements.entries()) {
      if (foundWords.has(word)) continue;
      const cellsMatch = cells.size === selectedCells.size && [...cells].every(c => selectedCells.has(c));
      if (cellsMatch) {
        playCorrectSound();
        if (streak >= 1) playComboSound(streak + 1);
        addCorrect();
        const newFound = new Set(foundWords);
        newFound.add(word);
        setFoundWords(newFound);
        const colorIdx = [...placements.keys()].indexOf(word) % WORD_COLORS.length;
        const newHighlighted = new Map(highlightedCells);
        cells.forEach(c => newHighlighted.set(c, WORD_COLORS[colorIdx]));
        setHighlightedCells(newHighlighted);
        setShowConfetti(true);
        setShowFlash("correct");
        const streakBonus = Math.min(streak, 5);
        setScorePopup({ points: 100 + streakBonus * 50, streak: streak + 1 });
        setTimeout(() => speak(word), 300);
        setTimeout(() => { setShowConfetti(false); setShowFlash(null); setScorePopup(null); }, 1200);
        if (newFound.size === words.length) {
          stop();
          setTimeout(() => setGameOver(true), 800);
        }
        setSelectedCells(new Set());
        return true;
      }
    }
    return false;
  }, [selectedCells, placements, foundWords, addCorrect, streak, stop, words.length, highlightedCells]);

  // Tap to toggle a cell
  const handleCellTap = (r: number, c: number) => {
    if (!started) return;
    const key = `${r}-${c}`;
    if (highlightedCells.has(key)) return; // already found
    playSelectSound();
    setSelectedCells(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    const found = checkSelection();
    if (!found) {
      playIncorrectSound();
      addIncorrect();
      setShowWrong(true);
      setShowFlash("incorrect");
      setTimeout(() => { setShowWrong(false); setShowFlash(null); }, 600);
      setSelectedCells(new Set());
    }
  };

  const handleClear = () => {
    setSelectedCells(new Set());
  };

  const resetGame = () => {
    setFoundWords(new Set());
    setSelectedCells(new Set());
    setHighlightedCells(new Map());
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
      {showConfetti && <ConfettiBurst count={20} />}
      {showFlash && <ScreenFlash type={showFlash} />}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <AnimatePresence>{scorePopup && <ScorePopup points={scorePopup.points} streak={scorePopup.streak} />}</AnimatePresence>
        <GameHeader score={score} currentQuestion={foundWords.size} totalQuestions={words.length}
          streak={streak} timeElapsed={timeElapsed} gameTitle="Word Search" emoji="🔍" onQuit={onExit} />

        <div className="w-full max-w-xl">
          {/* Word list */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {words.map((word, i) => (
              <motion.span key={word}
                className={`px-3 py-1.5 rounded-full font-display font-bold text-sm transition-all ${
                  foundWords.has(word) ? "line-through opacity-40" : ""
                }`}
                style={{ backgroundColor: foundWords.has(word) ? "hsl(145, 72%, 50%)" : WORD_COLORS[i % WORD_COLORS.length], color: "#fff" }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Grid */}
          <div className="bg-card/90 backdrop-blur rounded-2xl p-3 border border-border shadow-xl select-none">
            {/* Column letters header */}
            <div style={{ display: "grid", gridTemplateColumns: `24px repeat(${gridSize}, 1fr)`, gap: "2px" }} className="mb-1">
              <div />
              {Array.from({ length: gridSize }, (_, c) => (
                <div key={`col-${c}`} className="flex items-center justify-center text-[10px] font-display font-bold text-muted-foreground">
                  {String.fromCharCode(65 + c)}
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `24px repeat(${gridSize}, 1fr)`, gap: "2px" }}>
              {grid.map((row, r) => (
                <React.Fragment key={`row-${r}`}>
                  <div className="flex items-center justify-center text-[10px] font-display font-bold text-muted-foreground">
                    {r + 1}
                  </div>
                  {row.map((cell, c) => {
                    const key = `${r}-${c}`;
                    const isSelected = selectedCells.has(key);
                    const highlightColor = highlightedCells.get(key);
                    return (
                      <motion.button key={key}
                        onClick={() => handleCellTap(r, c)}
                        data-cell={key}
                        className="aspect-square flex items-center justify-center rounded-md font-display font-black text-xs sm:text-sm transition-all"
                        style={{
                          backgroundColor: highlightColor || (isSelected ? "hsl(262, 83%, 58%)" : "transparent"),
                          color: highlightColor || isSelected ? "#fff" : "hsl(var(--foreground))",
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {cell}
                      </motion.button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center mt-4">
            <motion.button
              onClick={handleClear}
              disabled={selectedCells.size === 0}
              className="px-5 py-2.5 rounded-xl font-display font-bold text-sm bg-muted text-muted-foreground disabled:opacity-30 transition-all"
              whileTap={{ scale: 0.95 }}
            >
              Clear
            </motion.button>
            <motion.button
              onClick={handleSubmit}
              disabled={selectedCells.size < 2}
              className="px-6 py-2.5 rounded-xl font-display font-bold text-sm text-primary-foreground disabled:opacity-30 transition-all"
              style={{ backgroundColor: selectedCells.size >= 2 ? "hsl(262, 83%, 58%)" : "hsl(var(--muted))" }}
              whileTap={{ scale: 0.95 }}
            >
              Check ✓
            </motion.button>
          </div>
        </div>
      </div>
    </ThemedBackground>
  );
}
