import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Game = Database["public"]["Tables"]["games"]["Row"];

interface PrintableWorksheetProps {
  game: Game;
  worksheetTitle: string;
  onClose: () => void;
}

// ─── Crossword Builder (reused from CrosswordGame) ─────────
interface PlacedWord {
  answer: string;
  clue: string;
  direction: "across" | "down";
  row: number;
  col: number;
  number: number;
}

function buildCrosswordGrid(clues: { answer: string; clue: string; direction: "across" | "down" }[]) {
  const words = clues.map(c => ({ ...c, answer: c.answer.toUpperCase().replace(/[^A-Z]/g, "") })).filter(w => w.answer.length >= 2);
  if (words.length === 0) return { grid: [] as (string | null)[][], placed: [] as PlacedWord[], rows: 0, cols: 0 };

  const SIZE = 20;
  const board: (string | null)[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  const placed: PlacedWord[] = [];

  const first = words[0];
  const startRow = Math.floor(SIZE / 2);
  const startCol = Math.floor((SIZE - first.answer.length) / 2);
  for (let i = 0; i < first.answer.length; i++) board[startRow][startCol + i] = first.answer[i];
  placed.push({ ...first, row: startRow, col: startCol, number: 1 });

  let num = 2;
  for (let wi = 1; wi < words.length; wi++) {
    const word = words[wi];
    let bestPos: { row: number; col: number; dir: "across" | "down" } | null = null;

    for (const p of placed) {
      for (let pi = 0; pi < p.answer.length; pi++) {
        for (let wi2 = 0; wi2 < word.answer.length; wi2++) {
          if (p.answer[pi] !== word.answer[wi2]) continue;
          const dir: "across" | "down" = p.direction === "across" ? "down" : "across";
          let row: number, col: number;
          if (dir === "across") {
            row = p.direction === "down" ? p.row + pi : p.row;
            col = p.direction === "down" ? p.col - wi2 : p.col + pi - wi2;
          } else {
            row = p.direction === "across" ? p.row - wi2 : p.row + pi - wi2;
            col = p.direction === "across" ? p.col + pi : p.col;
          }

          let valid = true;
          for (let i = 0; i < word.answer.length; i++) {
            const r = dir === "across" ? row : row + i;
            const c = dir === "across" ? col + i : col;
            if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) { valid = false; break; }
            const existing = board[r][c];
            if (existing && existing !== word.answer[i]) { valid = false; break; }
          }
          if (valid && dir === "across") {
            if (col - 1 >= 0 && board[row][col - 1]) valid = false;
            if (col + word.answer.length < SIZE && board[row][col + word.answer.length]) valid = false;
          }
          if (valid && dir === "down") {
            if (row - 1 >= 0 && board[row - 1][col]) valid = false;
            if (row + word.answer.length < SIZE && board[row + word.answer.length][col]) valid = false;
          }
          if (valid && !bestPos) bestPos = { row, col, dir };
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

  // Trim grid
  let minR = SIZE, maxR = 0, minC = SIZE, maxC = 0;
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (board[r][c]) { minR = Math.min(minR, r); maxR = Math.max(maxR, r); minC = Math.min(minC, c); maxC = Math.max(maxC, c); }
  }
  const rows = maxR - minR + 1;
  const cols = maxC - minC + 1;
  const trimmed = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => board[r + minR][c + minC]));
  const adjustedPlaced = placed.map(p => ({ ...p, row: p.row - minR, col: p.col - minC }));

  // Assign cell numbers
  const numberMap: Record<string, number> = {};
  adjustedPlaced.forEach(p => { numberMap[`${p.row}-${p.col}`] = p.number; });

  return { grid: trimmed, placed: adjustedPlaced, rows, cols, numberMap };
}

// ─── Word Search Grid Generator ─────────
function generateWordSearchGrid(words: string[], size: number) {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const DIRECTIONS: [number, number][] = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];

  const cleanWords = words
    .map((w) => String(w).normalize("NFKD").replace(/[^A-Za-z]/g, "").toUpperCase())
    .filter((w) => w.length >= 2);

  for (const w of cleanWords) {
    const shuffledDirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);
    for (let attempt = 0; attempt < 100; attempt++) {
      const dir = shuffledDirs[attempt % shuffledDirs.length];
      const maxR = dir[0] >= 0 ? size - w.length * Math.max(0, dir[0]) : size;
      const maxC = dir[1] >= 0 ? size - w.length * Math.max(0, dir[1]) : size;
      const minR = dir[0] < 0 ? (w.length - 1) * Math.abs(dir[0]) : 0;
      const minC = dir[1] < 0 ? (w.length - 1) * Math.abs(dir[1]) : 0;
      if (maxR <= minR || maxC <= minC) continue;
      const r = minR + Math.floor(Math.random() * (maxR - minR));
      const c = minC + Math.floor(Math.random() * (maxC - minC));
      let canPlace = true;
      for (let i = 0; i < w.length; i++) {
        const nr = r + dir[0] * i, nc = c + dir[1] * i;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) { canPlace = false; break; }
        if (grid[nr][nc] !== "" && grid[nr][nc] !== w[i]) { canPlace = false; break; }
      }
      if (canPlace) {
        for (let i = 0; i < w.length; i++) grid[r + dir[0] * i][c + dir[1] * i] = w[i];
        break;
      }
    }
  }

  const wordChars = new Set(cleanWords.flatMap(w => [...w]));
  const latinLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const fillerPool = wordChars.size > 0 ? [...wordChars, ...latinLetters.split("")] : latinLetters.split("");
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
    if (grid[r][c] === "") grid[r][c] = fillerPool[Math.floor(Math.random() * fillerPool.length)];
  }
  return grid;
}

// ─── Renderers ─────────────────────────────────────

function CrosswordPrint({ gameData, title }: { gameData: any; title: string }) {
  const { grid, placed, numberMap } = buildCrosswordGrid(gameData.clues || []);
  const across = placed.filter(p => p.direction === "across").sort((a, b) => a.number - b.number);
  const down = placed.filter(p => p.direction === "down").sort((a, b) => a.number - b.number);
  const cellSize = Math.min(28, Math.floor(500 / Math.max(grid[0]?.length || 1, 1)));

  return (
    <div>
      <h1 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 24, textAlign: "center", marginBottom: 4 }}>✏️ Crossword: {title}</h1>
      <p style={{ textAlign: "center", color: "#666", fontSize: 12, marginBottom: 20 }}>Fill in the crossword using the clues below</p>
      
      {/* Grid */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <table style={{ borderCollapse: "collapse" }}>
          <tbody>
            {grid.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} style={{
                    width: cellSize, height: cellSize,
                    border: cell ? "1.5px solid #333" : "none",
                    background: cell ? "#fff" : "transparent",
                    position: "relative",
                    padding: 0,
                  }}>
                    {cell && numberMap?.[`${r}-${c}`] && (
                      <span style={{ position: "absolute", top: 1, left: 2, fontSize: 7, fontWeight: 700, color: "#7c3aed" }}>
                        {numberMap[`${r}-${c}`]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clues */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <h3 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8, borderBottom: "2px solid #7c3aed", paddingBottom: 4 }}>Across →</h3>
          {across.map(p => (
            <p key={p.number} style={{ fontSize: 12, marginBottom: 4 }}>
              <strong>{p.number}.</strong> {p.clue}
            </p>
          ))}
        </div>
        <div>
          <h3 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8, borderBottom: "2px solid #7c3aed", paddingBottom: 4 }}>Down ↓</h3>
          {down.map(p => (
            <p key={p.number} style={{ fontSize: 12, marginBottom: 4 }}>
              <strong>{p.number}.</strong> {p.clue}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function WordSearchPrint({ gameData, title }: { gameData: any; title: string }) {
  const sanitizedWords = (gameData.words || [])
    .map((w: string) => String(w).normalize("NFKD").replace(/[^A-Za-z]/g, "").toUpperCase())
    .filter((w: string) => w.length >= 2)
    .slice(0, 8);
  const words: string[] = sanitizedWords.length > 0 ? sanitizedWords : ["STORM"];
  const size = gameData.grid_size || Math.max(10, Math.ceil(Math.sqrt(words.join("").length * 2)));
  const grid = generateWordSearchGrid(words, size);
  const cellSize = Math.min(28, Math.floor(450 / size));

  return (
    <div>
      <h1 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 24, textAlign: "center", marginBottom: 4 }}>🔍 Word Search: {title}</h1>
      <p style={{ textAlign: "center", color: "#666", fontSize: 12, marginBottom: 20 }}>Find all the hidden words in the grid below</p>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <table style={{ borderCollapse: "collapse" }}>
          <tbody>
            {grid.map((row, r) => (
              <tr key={r}>
                {row.map((letter, c) => (
                  <td key={c} style={{
                    width: cellSize, height: cellSize,
                    border: "1px solid #ddd",
                    textAlign: "center",
                    fontFamily: "monospace",
                    fontSize: cellSize * 0.55,
                    fontWeight: 600,
                  }}>{letter}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center" }}>
        <h3 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Words to find:</h3>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 16px" }}>
          {words.map((w, i) => (
            <span key={i} style={{ fontSize: 13, fontWeight: 600, padding: "2px 8px", border: "1px solid #e5e7eb", borderRadius: 6 }}>
              {w.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FillBlankPrint({ gameData, title }: { gameData: any; title: string }) {
  const questions: { sentence: string; answer: string; options: string[] }[] = gameData.questions || [];

  return (
    <div>
      <h1 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 24, textAlign: "center", marginBottom: 4 }}>📝 Fill in the Blank: {title}</h1>
      <p style={{ textAlign: "center", color: "#666", fontSize: 12, marginBottom: 20 }}>Complete each sentence with the correct word</p>

      <div style={{ marginBottom: 24 }}>
        {questions.map((q, i) => (
          <div key={i} style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #eee" }}>
            <p style={{ fontSize: 14, marginBottom: 6 }}>
              <strong>{i + 1}.</strong> {q.sentence.replace("___", "_______________")}
            </p>
            {q.options && q.options.length > 0 && (
              <div style={{ display: "flex", gap: 12, marginLeft: 20 }}>
                {q.options.map((opt, j) => (
                  <span key={j} style={{ fontSize: 12, padding: "2px 10px", border: "1.5px solid #d1d5db", borderRadius: 8 }}>
                    {String.fromCharCode(65 + j)}) {opt}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchingPrint({ gameData, title }: { gameData: any; title: string }) {
  const pairs: { left: string; right: string }[] = gameData.pairs || [];
  const shuffledRight = [...pairs].sort(() => Math.random() - 0.5);

  return (
    <div>
      <h1 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 24, textAlign: "center", marginBottom: 4 }}>🔗 Matching: {title}</h1>
      <p style={{ textAlign: "center", color: "#666", fontSize: 12, marginBottom: 20 }}>Draw a line to connect each item on the left with its match on the right</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 1fr", gap: 0, maxWidth: 550, margin: "0 auto" }}>
        {/* Headers */}
        <div style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 700, fontSize: 14, paddingBottom: 8, borderBottom: "2px solid #7c3aed" }}>Column A</div>
        <div />
        <div style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 700, fontSize: 14, paddingBottom: 8, borderBottom: "2px solid #7c3aed", textAlign: "right" }}>Column B</div>

        {pairs.map((p, i) => (
          <>
            <div key={`l-${i}`} style={{ fontSize: 13, padding: "10px 12px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontWeight: 700, color: "#7c3aed", minWidth: 20 }}>{i + 1}.</span> {p.left}
            </div>
            <div key={`m-${i}`} style={{ borderBottom: "1px dotted #ccc" }} />
            <div key={`r-${i}`} style={{ fontSize: 13, padding: "10px 12px", borderBottom: "1px solid #eee", textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
              {shuffledRight[i].right} <span style={{ fontWeight: 700, color: "#7c3aed", minWidth: 20 }}>{String.fromCharCode(65 + i)}.</span>
            </div>
          </>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: 12, border: "1.5px dashed #d1d5db", borderRadius: 8 }}>
        <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Answers:</p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {pairs.map((_, i) => (
            <span key={i} style={{ fontSize: 12 }}>{i + 1} → ____</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrueFalsePrint({ gameData, title }: { gameData: any; title: string }) {
  const statements: { statement: string; is_true: boolean; explanation: string }[] = gameData.statements || [];

  return (
    <div>
      <h1 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 24, textAlign: "center", marginBottom: 4 }}>✅ True or False: {title}</h1>
      <p style={{ textAlign: "center", color: "#666", fontSize: 12, marginBottom: 20 }}>Circle True or False for each statement</p>

      {statements.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #eee" }}>
          <span style={{ fontWeight: 700, fontSize: 14, minWidth: 24 }}>{i + 1}.</span>
          <p style={{ fontSize: 13, flex: 1 }}>{s.statement}</p>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <span style={{ border: "2px solid #22c55e", borderRadius: 20, padding: "2px 14px", fontSize: 12, fontWeight: 700 }}>TRUE</span>
            <span style={{ border: "2px solid #ef4444", borderRadius: 20, padding: "2px 14px", fontSize: 12, fontWeight: 700 }}>FALSE</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuizPrint({ gameData, title }: { gameData: any; title: string }) {
  const questions: { question: string; options: string[]; correct: number }[] = gameData.questions || [];

  return (
    <div>
      <h1 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 24, textAlign: "center", marginBottom: 4 }}>🎯 Quiz: {title}</h1>
      <p style={{ textAlign: "center", color: "#666", fontSize: 12, marginBottom: 20 }}>Circle the correct answer for each question</p>

      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #eee" }}>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{i + 1}. {q.question}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", marginLeft: 20 }}>
            {q.options.map((opt, j) => (
              <div key={j} style={{ fontSize: 13, padding: "3px 0", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 20, height: 20, border: "2px solid #d1d5db", borderRadius: "50%", display: "inline-block", flexShrink: 0 }} />
                <span>{String.fromCharCode(65 + j)}) {opt}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SpellingPrint({ gameData, title }: { gameData: any; title: string }) {
  const words: { word: string; hint: string }[] = gameData.words || [];

  return (
    <div>
      <h1 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 24, textAlign: "center", marginBottom: 4 }}>✏️ Spelling: {title}</h1>
      <p style={{ textAlign: "center", color: "#666", fontSize: 12, marginBottom: 20 }}>Read the hint and write the correct spelling</p>

      {words.map((w, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #eee" }}>
          <span style={{ fontWeight: 700, fontSize: 14, minWidth: 24 }}>{i + 1}.</span>
          <span style={{ fontSize: 13, flex: 1 }}>{w.hint}</span>
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: w.word.length }).map((_, j) => (
              <span key={j} style={{ width: 24, height: 28, border: "1.5px solid #d1d5db", borderRadius: 4, display: "inline-block" }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function GroupSortPrint({ gameData, title }: { gameData: any; title: string }) {
  const groups: { group: string; items: string[] }[] = gameData.groups || [];
  const allItems = groups.flatMap(g => g.items).sort(() => Math.random() - 0.5);

  return (
    <div>
      <h1 style={{ fontFamily: "Fredoka, sans-serif", fontSize: 24, textAlign: "center", marginBottom: 4 }}>📦 Group Sort: {title}</h1>
      <p style={{ textAlign: "center", color: "#666", fontSize: 12, marginBottom: 20 }}>Sort the items below into the correct groups</p>

      {/* Items to sort */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 24, padding: 16, border: "2px dashed #d1d5db", borderRadius: 12 }}>
        {allItems.map((item, i) => (
          <span key={i} style={{ fontSize: 12, padding: "4px 12px", border: "1.5px solid #7c3aed", borderRadius: 16, fontWeight: 600 }}>{item}</span>
        ))}
      </div>

      {/* Group boxes */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(groups.length, 3)}, 1fr)`, gap: 16 }}>
        {groups.map((g, i) => (
          <div key={i} style={{ border: "2px solid #e5e7eb", borderRadius: 12, padding: 12, minHeight: 120 }}>
            <h4 style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 700, fontSize: 14, textAlign: "center", marginBottom: 8, color: "#7c3aed" }}>{g.group}</h4>
            {Array.from({ length: g.items.length }).map((_, j) => (
              <div key={j} style={{ borderBottom: "1px dashed #d1d5db", height: 24, marginBottom: 4 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Supported game types ─────────
const PRINTABLE_TYPES: Record<string, boolean> = {
  crossword: true, word_search: true, fill_blank: true, matching: true,
  true_false: true, quiz: true, spelling: true, group_sort: true,
};

export function isPrintable(gameType: string) {
  return !!PRINTABLE_TYPES[gameType];
}

// ─── Main Component ─────────────────────────────────

export function PrintableWorksheet({ game, worksheetTitle, onClose }: PrintableWorksheetProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const gameData = game.game_data as any;

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Worksheet - ${worksheetTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Nunito', sans-serif; padding: 32px; color: #1a1a1a; }
            h1, h2, h3, h4 { font-family: 'Fredoka', sans-serif; }
            @media print {
              body { padding: 16px; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <div style="text-align:center;margin-top:32px;color:#999;font-size:10px;border-top:1px solid #eee;padding-top:8px;">
            Generated by Ministar Game Studio • Name: __________________ Date: __________
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const renderContent = () => {
    switch (game.game_type) {
      case "crossword": return <CrosswordPrint gameData={gameData} title={worksheetTitle} />;
      case "word_search": return <WordSearchPrint gameData={gameData} title={worksheetTitle} />;
      case "fill_blank": return <FillBlankPrint gameData={gameData} title={worksheetTitle} />;
      case "matching": return <MatchingPrint gameData={gameData} title={worksheetTitle} />;
      case "true_false": return <TrueFalsePrint gameData={gameData} title={worksheetTitle} />;
      case "quiz": return <QuizPrint gameData={gameData} title={worksheetTitle} />;
      case "spelling": return <SpellingPrint gameData={gameData} title={worksheetTitle} />;
      case "group_sort": return <GroupSortPrint gameData={gameData} title={worksheetTitle} />;
      default: return <p>This game type cannot be printed as a worksheet.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-3xl shadow-2xl border border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Toolbar */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="font-display font-bold text-lg text-foreground">📄 Printable Worksheet</h2>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="rounded-xl gap-2">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div ref={printRef} className="p-8 bg-white" style={{ color: "#1a1a1a" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}