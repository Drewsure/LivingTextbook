import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameComplete } from "./GameComplete";
import { ConfettiBurst, ScreenFlash } from "./effects/Particles";
import { ThemedBackground, getRandomTheme } from "./effects/ThemedBackground";
import { playCorrectSound, playIncorrectSound, playComboSound } from "@/utils/audio";
import { GameHeader, useGameTimer, useGameScore } from "./GameHeader";

interface CrosswordClue {
  answer: string;
  clue: string;
  direction: "across" | "down";
}

interface CrosswordGameProps {
  gameData: { clues: CrosswordClue[] };
  gameId: string;
  onExit: () => void;
  instructionLang?: string;
}

interface PlacedWord {
  answer: string;
  clue: string;
  direction: "across" | "down";
  row: number;
  col: number;
  number: number;
}

interface Cell {
  letter: string;
  wordIndices: number[];
  number?: number;
}

// Simple crossword layout algorithm
function buildGrid(clues: CrosswordClue[]): { grid: (Cell | null)[][]; placed: PlacedWord[]; rows: number; cols: number } {
  const words = clues.map(c => ({ ...c, answer: c.answer.toUpperCase().replace(/[^A-Z]/g, "") })).filter(w => w.answer.length >= 2);
  if (words.length === 0) return { grid: [], placed: [], rows: 0, cols: 0 };

  const SIZE = 20;
  const board: (string | null)[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  const placed: PlacedWord[] = [];

  // Place first word in the center
  const first = words[0];
  const startRow = Math.floor(SIZE / 2);
  const startCol = Math.floor((SIZE - first.answer.length) / 2);
  for (let i = 0; i < first.answer.length; i++) {
    board[startRow][startCol + i] = first.answer[i];
  }
  placed.push({ ...first, row: startRow, col: startCol, number: 1 });

  // Try to place remaining words by finding intersections
  let num = 2;
  for (let wi = 1; wi < words.length; wi++) {
    const word = words[wi];
    let bestScore = -1;
    let bestPos: { row: number; col: number; dir: "across" | "down" } | null = null;

    for (const p of placed) {
      for (let pi = 0; pi < p.answer.length; pi++) {
        for (let wi2 = 0; wi2 < word.answer.length; wi2++) {
          if (p.answer[pi] !== word.answer[wi2]) continue;

          // Try perpendicular placement
          const dir: "across" | "down" = p.direction === "across" ? "down" : "across";
          let row: number, col: number;

          if (dir === "across") {
            row = p.direction === "across" ? p.row + pi : p.row + pi;
            col = (p.direction === "across" ? p.col + pi : p.col) - wi2;
            // Recalculate for down parent
            if (p.direction === "down") {
              row = p.row + pi;
              col = p.col - wi2;
            }
          } else {
            if (p.direction === "across") {
              row = p.row - wi2;
              col = p.col + pi;
            } else {
              row = p.row + pi - wi2;
              col = p.col + pi;
            }
          }

          // Validate placement
          let valid = true;
          for (let i = 0; i < word.answer.length; i++) {
            const r = dir === "across" ? row : row + i;
            const c = dir === "across" ? col + i : col;
            if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) { valid = false; break; }
            const existing = board[r][c];
            if (existing && existing !== word.answer[i]) { valid = false; break; }

            // Check adjacents (no parallel touching)
            if (!existing) {
              if (dir === "across") {
                if (r - 1 >= 0 && board[r - 1][c] && !placed.some(pw => pw.direction === "down" && pw.col === c && pw.row <= r - 1 && pw.row + pw.answer.length > r - 1)) {
                  // Simplified: just check no stray letters
                }
              }
            }
          }

          // Check before and after
          if (valid) {
            if (dir === "across") {
              if (col - 1 >= 0 && board[row][col - 1]) valid = false;
              if (col + word.answer.length < SIZE && board[row][col + word.answer.length]) valid = false;
            } else {
              if (row - 1 >= 0 && board[row - 1][col]) valid = false;
              if (row + word.answer.length < SIZE && board[row + word.answer.length][col]) valid = false;
            }
          }

          if (valid) {
            const score = 10; // intersection bonus
            if (score > bestScore) {
              bestScore = score;
              bestPos = { row, col, dir };
            }
          }
        }
      }
    }

    if (bestPos) {
      for (let i = 0; i < word.answer.length; i++) {
        const r = bestPos.dir === "across" ? bestPos.row : bestPos.row + i;
        const c = bestPos.dir === "across" ? bestPos.col + i : bestPos.col;
        board[r][c] = word.answer[i];
      }
      placed.push({ ...word, row: bestPos.row, col: bestPos.col, direction: bestPos.dir, number: num++ });
    }
  }

  if (placed.length === 0) return { grid: [], placed: [], rows: 0, cols: 0 };

  // Find bounding box
  let minR = SIZE, maxR = 0, minC = SIZE, maxC = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c]) {
        minR = Math.min(minR, r);
        maxR = Math.max(maxR, r);
        minC = Math.min(minC, c);
        maxC = Math.max(maxC, c);
      }
    }
  }

  const rows = maxR - minR + 1;
  const cols = maxC - minC + 1;

  // Build cell grid
  const grid: (Cell | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const letter = board[minR + r][minC + c];
      if (letter) {
        grid[r][c] = { letter, wordIndices: [] };
      }
    }
  }

  // Adjust placed positions and assign numbers + wordIndices
  const adjustedPlaced = placed.map((p, idx) => {
    const adj = { ...p, row: p.row - minR, col: p.col - minC };
    for (let i = 0; i < adj.answer.length; i++) {
      const r = adj.direction === "across" ? adj.row : adj.row + i;
      const c = adj.direction === "across" ? adj.col + i : adj.col;
      if (grid[r]?.[c]) {
        grid[r][c]!.wordIndices.push(idx);
      }
    }
    // Set number on first cell
    if (grid[adj.row]?.[adj.col]) {
      grid[adj.row][adj.col]!.number = adj.number;
    }
    return adj;
  });

  return { grid, placed: adjustedPlaced, rows, cols };
}

export function CrosswordGame({ gameData, gameId, onExit, instructionLang = "en" }: CrosswordGameProps) {
  const [theme] = useState(() => getRandomTheme());
  const { timeElapsed, stop: stopTimer } = useGameTimer();
  const { score, streak, correctCount, addCorrect, addIncorrect } = useGameScore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState<"correct" | "incorrect" | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const { grid, placed, rows, cols } = useMemo(() => buildGrid(gameData.clues), [gameData.clues]);

  const [userGrid, setUserGrid] = useState<string[][]>(() =>
    Array.from({ length: rows }, () => Array(cols).fill(""))
  );
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<"across" | "down">("across");
  const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
  const [solvedWords, setSolvedWords] = useState<Set<number>>(new Set());
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const [hintUsed, setHintUsed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalWords = placed.length;

  // Auto-select first word
  useEffect(() => {
    if (started && placed.length > 0 && !selectedCell) {
      setSelectedCell({ row: placed[0].row, col: placed[0].col });
      setSelectedDirection(placed[0].direction);
      setSelectedWordIdx(0);
    }
  }, [started, placed, selectedCell]);

  // Focus input when cell selected
  useEffect(() => {
    if (selectedCell) inputRef.current?.focus();
  }, [selectedCell]);

  const getWordCells = useCallback((wordIdx: number): { row: number; col: number }[] => {
    const w = placed[wordIdx];
    if (!w) return [];
    return Array.from({ length: w.answer.length }, (_, i) => ({
      row: w.direction === "across" ? w.row : w.row + i,
      col: w.direction === "across" ? w.col + i : w.col,
    }));
  }, [placed]);

  const checkWord = useCallback((wordIdx: number) => {
    const w = placed[wordIdx];
    const cells = getWordCells(wordIdx);
    const typed = cells.map(c => userGrid[c.row]?.[c.col] || "").join("");
    if (typed.length === w.answer.length && typed.toUpperCase() === w.answer.toUpperCase()) {
      if (!solvedWords.has(wordIdx)) {
        setSolvedWords(prev => new Set([...prev, wordIdx]));
        addCorrect();
        playCorrectSound();
        setShowConfetti(true);
        setShowFlash("correct");
        setTimeout(() => { setShowConfetti(false); setShowFlash(null); }, 800);

        // Check if all solved
        if (solvedWords.size + 1 === totalWords) {
          stopTimer();
          setTimeout(() => setGameOver(true), 1000);
        }
      }
    }
  }, [placed, getWordCells, userGrid, solvedWords, totalWords, addCorrect, stopTimer]);

  const handleCellClick = (row: number, col: number) => {
    const cell = grid[row]?.[col];
    if (!cell) return;

    if (selectedCell?.row === row && selectedCell?.col === col) {
      // Toggle direction
      setSelectedDirection(d => d === "across" ? "down" : "across");
    } else {
      setSelectedCell({ row, col });
    }

    // Find word for this cell
    const wordIdx = cell.wordIndices.find(wi => placed[wi].direction === (selectedCell?.row === row && selectedCell?.col === col ? (selectedDirection === "across" ? "down" : "across") : selectedDirection));
    if (wordIdx !== undefined) {
      setSelectedWordIdx(wordIdx);
    } else if (cell.wordIndices.length > 0) {
      setSelectedWordIdx(cell.wordIndices[0]);
      setSelectedDirection(placed[cell.wordIndices[0]].direction);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedCell || !selectedWordIdx === undefined) return;
    const { row, col } = selectedCell;

    if (e.key === "Backspace") {
      e.preventDefault();
      if (userGrid[row][col]) {
        setUserGrid(prev => {
          const next = prev.map(r => [...r]);
          next[row][col] = "";
          return next;
        });
      } else {
        // Move back
        const nr = selectedDirection === "across" ? row : row - 1;
        const nc = selectedDirection === "across" ? col - 1 : col;
        if (nr >= 0 && nc >= 0 && grid[nr]?.[nc]) {
          setSelectedCell({ row: nr, col: nc });
          setUserGrid(prev => {
            const next = prev.map(r => [...r]);
            next[nr][nc] = "";
            return next;
          });
        }
      }
      return;
    }

    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      // Move to next word
      if (selectedWordIdx !== null) {
        const nextIdx = (selectedWordIdx + 1) % placed.length;
        const w = placed[nextIdx];
        setSelectedWordIdx(nextIdx);
        setSelectedDirection(w.direction);
        setSelectedCell({ row: w.row, col: w.col });
      }
      return;
    }

    if (e.key === "ArrowUp") { e.preventDefault(); if (row > 0 && grid[row - 1]?.[col]) setSelectedCell({ row: row - 1, col }); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); if (row < rows - 1 && grid[row + 1]?.[col]) setSelectedCell({ row: row + 1, col }); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); if (col > 0 && grid[row]?.[col - 1]) setSelectedCell({ row, col: col - 1 }); return; }
    if (e.key === "ArrowRight") { e.preventDefault(); if (col < cols - 1 && grid[row]?.[col + 1]) setSelectedCell({ row, col: col + 1 }); return; }

    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      const letter = e.key.toUpperCase();
      setUserGrid(prev => {
        const next = prev.map(r => [...r]);
        next[row][col] = letter;
        return next;
      });

      // Advance to next cell in word
      const nr = selectedDirection === "across" ? row : row + 1;
      const nc = selectedDirection === "across" ? col + 1 : col;
      if (nr < rows && nc < cols && grid[nr]?.[nc]) {
        setSelectedCell({ row: nr, col: nc });
      }

      // Check word completion after state update
      setTimeout(() => {
        if (selectedWordIdx !== null) checkWord(selectedWordIdx);
        // Also check all words through this cell
        const cell = grid[row]?.[col];
        cell?.wordIndices.forEach(wi => {
          if (wi !== selectedWordIdx) checkWord(wi);
        });
      }, 50);
    }
  };

  const handleHint = () => {
    if (!selectedCell || selectedWordIdx === null) return;
    const w = placed[selectedWordIdx];
    const cells = getWordCells(selectedWordIdx);
    // Reveal one unsolved letter
    for (const c of cells) {
      if (userGrid[c.row][c.col].toUpperCase() !== grid[c.row]![c.col]!.letter) {
        setUserGrid(prev => {
          const next = prev.map(r => [...r]);
          next[c.row][c.col] = grid[c.row]![c.col]!.letter;
          return next;
        });
        setRevealedCells(prev => new Set([...prev, `${c.row},${c.col}`]));
        setHintUsed(true);
        setTimeout(() => {
          if (selectedWordIdx !== null) checkWord(selectedWordIdx);
        }, 50);
        break;
      }
    }
  };

  // Cell size responsive - larger for better visibility
  const cellSize = Math.min(Math.max(36, Math.floor(400 / Math.max(rows, cols))), 52);

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
            animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            🧩
          </motion.div>
          <h1 className="font-display text-4xl font-black text-white mb-3 drop-shadow-lg">Crossword</h1>
          <p className="text-white/80 font-body mb-2">{placed.length} words to find</p>
          <p className="text-white/60 text-sm font-body mb-8">Click cells, type letters, solve all the clues!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStarted(true)}
            className="px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-xl shadow-2xl"
          >
            Start! 🧩
          </motion.button>
        </motion.div>
        </div>
      </ThemedBackground>
    );
  }

  if (gameOver) {
    return (
      <GameComplete
        score={score}
        correctCount={solvedWords.size}
        totalQuestions={totalWords}
        timeElapsed={timeElapsed}
        gameId={gameId}
        onPlayAgain={() => {
          setGameOver(false);
          setStarted(false);
          setUserGrid(Array.from({ length: rows }, () => Array(cols).fill("")));
          setSolvedWords(new Set());
          setRevealedCells(new Set());
          setSelectedCell(null);
        }}
        onExit={onExit}
        instructionLang={instructionLang}
      />
    );
  }

  const acrossClues = placed.filter(p => p.direction === "across").sort((a, b) => a.number - b.number);
  const downClues = placed.filter(p => p.direction === "down").sort((a, b) => a.number - b.number);

  // Highlighted cells for selected word
  const highlightedCells = selectedWordIdx !== null ? new Set(getWordCells(selectedWordIdx).map(c => `${c.row},${c.col}`)) : new Set<string>();

  return (
    <ThemedBackground theme={theme}>
      <div className="min-h-screen flex flex-col">
      {showConfetti && <ConfettiBurst />}
      {showFlash && <ScreenFlash type={showFlash} />}

      <div className="relative z-10 flex-1 flex flex-col p-2 md:p-4 max-w-5xl mx-auto w-full">
        <GameHeader
          score={score}
          currentQuestion={solvedWords.size}
          totalQuestions={totalWords}
          streak={streak}
          timeElapsed={timeElapsed}
          gameTitle="Crossword"
          emoji="🧩"
          onQuit={onExit}
        />

        {/* Hidden input for keyboard capture */}
        <input
          ref={inputRef}
          className="absolute opacity-0 pointer-events-none"
          onKeyDown={handleKeyDown}
          autoFocus
        />

        <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
          {/* Grid */}
          <div className="flex-shrink-0 flex items-start justify-center overflow-auto">
            <div
              className="inline-grid gap-0.5 bg-gray-800 rounded-xl overflow-hidden p-2 shadow-xl"
              style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }}
              onClick={() => inputRef.current?.focus()}
            >
              {grid.map((row, ri) =>
                row.map((cell, ci) => {
                  if (!cell) {
                    return <div key={`${ri}-${ci}`} style={{ width: cellSize, height: cellSize }} />;
                  }

                  const isSelected = selectedCell?.row === ri && selectedCell?.col === ci;
                  const isHighlighted = highlightedCells.has(`${ri},${ci}`);
                  const isSolved = cell.wordIndices.some(wi => solvedWords.has(wi));
                  const isRevealed = revealedCells.has(`${ri},${ci}`);
                  const userLetter = userGrid[ri]?.[ci] || "";
                  const isCorrectLetter = userLetter.toUpperCase() === cell.letter;

                  return (
                    <motion.div
                      key={`${ri}-${ci}`}
                      onClick={() => handleCellClick(ri, ci)}
                      whileTap={{ scale: 0.9 }}
                      className={`relative cursor-pointer border-2 transition-all duration-150 flex items-center justify-center
                        ${isSelected
                          ? "border-primary bg-white shadow-lg shadow-primary/30 z-10"
                          : isHighlighted
                            ? "border-primary/50 bg-white/95"
                            : isSolved
                              ? "border-game-green bg-game-green/10"
                              : "border-border bg-white"
                        }
                      `}
                      style={{ width: cellSize, height: cellSize, borderRadius: 6 }}
                    >
                      {/* Number */}
                      {cell.number && (
                        <span className="absolute top-0.5 left-1 text-[9px] font-bold text-gray-500 leading-none">
                          {cell.number}
                        </span>
                      )}
                      {/* Letter */}
                      <AnimatePresence mode="wait">
                        {userLetter && (
                          <motion.span
                            key={userLetter}
                            initial={{ scale: 1.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`font-display font-black text-lg md:text-xl
                              ${isRevealed ? "text-blue-500" : isSolved && isCorrectLetter ? "text-green-600" : "text-gray-900"}
                            `}
                          >
                            {userLetter}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Clues panel */}
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[40vh] lg:max-h-[70vh] bg-card/60 backdrop-blur rounded-2xl p-4 border border-border/50">
            {/* Hint button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleHint}
              className="w-full py-2 rounded-xl bg-game-blue/20 text-game-blue font-display font-bold text-sm border border-game-blue/30 hover:bg-game-blue/30 transition-colors"
            >
              💡 Reveal a letter
            </motion.button>

            {/* Across */}
            <div>
              <h3 className="font-display font-black text-sm text-primary mb-2">→ Across</h3>
              <div className="space-y-1">
                {acrossClues.map((w) => {
                  const idx = placed.indexOf(w);
                  const solved = solvedWords.has(idx);
                  const isActive = selectedWordIdx === idx;
                  return (
                    <motion.div
                      key={w.number}
                      onClick={() => { setSelectedWordIdx(idx); setSelectedDirection("across"); setSelectedCell({ row: w.row, col: w.col }); inputRef.current?.focus(); }}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer text-sm transition-all
                        ${solved ? "bg-game-green/10 text-game-green line-through opacity-70" : isActive ? "bg-primary/15 text-foreground border border-primary/30" : "hover:bg-muted/50 text-foreground/80"}
                      `}
                    >
                      <span className="font-bold mr-2">{w.number}.</span>
                      {w.clue}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Down */}
            <div>
              <h3 className="font-display font-black text-sm text-primary mb-2">↓ Down</h3>
              <div className="space-y-1">
                {downClues.map((w) => {
                  const idx = placed.indexOf(w);
                  const solved = solvedWords.has(idx);
                  const isActive = selectedWordIdx === idx;
                  return (
                    <motion.div
                      key={w.number}
                      onClick={() => { setSelectedWordIdx(idx); setSelectedDirection("down"); setSelectedCell({ row: w.row, col: w.col }); inputRef.current?.focus(); }}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer text-sm transition-all
                        ${solved ? "bg-game-green/10 text-game-green line-through opacity-70" : isActive ? "bg-primary/15 text-foreground border border-primary/30" : "hover:bg-muted/50 text-foreground/80"}
                      `}
                    >
                      <span className="font-bold mr-2">{w.number}.</span>
                      {w.clue}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </ThemedBackground>
  );
}
