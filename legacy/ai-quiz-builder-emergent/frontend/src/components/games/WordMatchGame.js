import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export default function WordMatchGame({ content, onComplete }) {
  const [pairs, setPairs] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (content?.pairs) {
      const shuffledWords = [...content.pairs].sort(() => Math.random() - 0.5);
      const shuffledMatches = [...content.pairs].sort(() => Math.random() - 0.5);
      setPairs({ words: shuffledWords, matches: shuffledMatches });
    }
  }, [content]);

  useEffect(() => {
    if (selectedWord !== null && selectedMatch !== null) {
      setAttempts(prev => prev + 1);
      
      if (selectedWord === selectedMatch) {
        setFeedback('correct');
        setTimeout(() => {
          setMatched(prev => [...prev, selectedWord]);
          setSelectedWord(null);
          setSelectedMatch(null);
          setFeedback(null);
        }, 800);
      } else {
        setFeedback('wrong');
        setTimeout(() => {
          setSelectedWord(null);
          setSelectedMatch(null);
          setFeedback(null);
        }, 800);
      }
    }
  }, [selectedWord, selectedMatch]);

  useEffect(() => {
    if (matched.length === content?.pairs?.length && matched.length > 0) {
      const score = Math.max(0, Math.round(100 - (attempts - matched.length) * 5));
      setTimeout(() => onComplete(score), 1000);
    }
  }, [matched]);

  if (!pairs.words) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg font-bold text-violet-900">Match the words with their pairs!</p>
        <p className="text-sm text-violet-600">Matched: {matched.length} / {content.pairs.length}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Words Column */}
        <div className="space-y-3">
          {pairs.words.map((pair, index) => (
            <AnimatePresence key={pair.id}>
              {!matched.includes(pair.id) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-all border-4 ${
                      selectedWord === pair.id
                        ? 'border-violet-500 bg-violet-100'
                        : 'border-violet-200 hover:border-violet-300'
                    }`}
                    onClick={() => setSelectedWord(pair.id)}
                    data-testid={`word-${pair.id}`}
                  >
                    <p className="text-lg font-bold text-violet-900 text-center">{pair.word}</p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Matches Column */}
        <div className="space-y-3">
          {pairs.matches.map((pair, index) => (
            <AnimatePresence key={pair.id}>
              {!matched.includes(pair.id) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-all border-4 ${
                      selectedMatch === pair.id
                        ? 'border-fuchsia-500 bg-fuchsia-100'
                        : 'border-fuchsia-200 hover:border-fuchsia-300'
                    }`}
                    onClick={() => setSelectedMatch(pair.id)}
                    data-testid={`match-${pair.id}`}
                  >
                    <p className="text-lg font-bold text-fuchsia-900 text-center">{pair.match}</p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-full text-white font-black text-xl shadow-2xl ${
              feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {feedback === 'correct' ? (
              <span className="flex items-center gap-2">
                <Check className="w-6 h-6" /> Correct!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <X className="w-6 h-6" /> Try Again!
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}