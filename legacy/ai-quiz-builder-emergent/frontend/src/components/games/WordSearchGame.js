import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function WordSearchGame({ content, onComplete }) {
  const [grid, setGrid] = useState([]);
  const [found, setFound] = useState([]);
  const [selecting, setSelecting] = useState([]);
  const [startTime] = useState(Date.now());

  const words = content?.words || ['CAT', 'DOG', 'BIRD'];
  const gridSize = content?.gridSize || 10;

  useEffect(() => {
    generateGrid();
  }, []);

  useEffect(() => {
    if (found.length === words.length && found.length > 0) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const score = Math.max(50, 100 - timeSpent);
      setTimeout(() => onComplete(score), 1000);
    }
  }, [found]);

  function generateGrid() {
    const newGrid = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill('').map(() => 
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      )
    );

    // Place words horizontally
    words.forEach((word, wordIndex) => {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * (gridSize - word.length));
      
      for (let i = 0; i < word.length; i++) {
        newGrid[row][col + i] = word[i];
      }
    });

    setGrid(newGrid);
  }

  function handleCellClick(row, col) {
    const cellKey = `${row}-${col}`;
    
    if (selecting.includes(cellKey)) {
      setSelecting([]);
    } else {
      setSelecting([...selecting, cellKey]);
      
      // Check if selection forms a word
      const selectedLetters = [...selecting, cellKey]
        .map(key => {
          const [r, c] = key.split('-').map(Number);
          return grid[r][c];
        })
        .join('');
      
      if (words.includes(selectedLetters) && !found.includes(selectedLetters)) {
        setFound([...found, selectedLetters]);
        setSelecting([]);
      }
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-4 border-violet-300 rounded-3xl shadow-xl p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-black text-violet-900 mb-2">Find the Words!</h3>
            <p className="text-lg font-bold text-violet-600">
              Found: {found.length} / {words.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {words.map((word, i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`px-4 py-2 rounded-full font-bold border-2 ${
                  found.includes(word)
                    ? 'bg-green-100 border-green-400 text-green-700 line-through'
                    : 'bg-violet-100 border-violet-300 text-violet-700'
                }`}>
                  {word}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="overflow-auto">
            <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
              {grid.map((row, rowIndex) => 
                row.map((letter, colIndex) => {
                  const cellKey = `${rowIndex}-${colIndex}`;
                  const isSelected = selecting.includes(cellKey);
                  const isFound = found.some(word => {
                    // Simple check if this cell is part of a found word
                    return false; // Simplified for now
                  });

                  return (
                    <motion.button
                      key={cellKey}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-10 h-10 font-bold text-lg rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-violet-500 text-white border-violet-600'
                          : 'bg-white text-violet-900 border-violet-200 hover:border-violet-400'
                      }`}
                      data-testid={`cell-${rowIndex}-${colIndex}`}
                    >
                      {letter}
                    </motion.button>
                  );
                })
              )}
            </div>
          </div>

          <Button
            onClick={() => {
              generateGrid();
              setFound([]);
              setSelecting([]);
            }}
            variant="outline"
            className="w-full h-12 font-bold rounded-full border-2 border-violet-300"
          >
            New Grid
          </Button>
        </div>
      </Card>
    </div>
  );
}