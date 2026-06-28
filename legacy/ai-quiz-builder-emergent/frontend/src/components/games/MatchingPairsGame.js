import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function MatchingPairsGame({ content, onComplete }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (content?.pairs) {
      const gameCards = [];
      content.pairs.forEach((pair, index) => {
        gameCards.push({ id: `${index}-a`, content: pair.content, pairId: index });
        gameCards.push({ id: `${index}-b`, content: pair.content, pairId: index });
      });
      setCards(gameCards.sort(() => Math.random() - 0.5));
    }
  }, [content]);

  useEffect(() => {
    if (flipped.length === 2) {
      setAttempts(prev => prev + 1);
      
      const [first, second] = flipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);
      
      if (firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          setMatched([...matched, firstCard.pairId]);
          setFlipped([]);
        }, 800);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  }, [flipped]);

  useEffect(() => {
    if (matched.length === content?.pairs?.length && matched.length > 0) {
      const score = Math.max(50, 100 - attempts * 2);
      setTimeout(() => onComplete(score), 1000);
    }
  }, [matched]);

  function handleCardClick(cardId) {
    if (flipped.length >= 2 || flipped.includes(cardId) || matched.some(m => {
      const card = cards.find(c => c.id === cardId);
      return card && card.pairId === m;
    })) {
      return;
    }
    
    setFlipped([...flipped, cardId]);
  }

  if (!cards || cards.length === 0) {
    return <div className="text-center py-12">No cards available</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <p className="text-lg font-bold text-violet-900">
          Find all matching pairs!
        </p>
        <p className="text-sm text-violet-600">
          Matched: {matched.length} / {content?.pairs?.length || 0} | Attempts: {attempts}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.includes(card.pairId);
          const isVisible = isFlipped || isMatched;

          return (
            <motion.div
              key={card.id}
              whileHover={{ scale: isMatched ? 1 : 1.05 }}
              whileTap={{ scale: isMatched ? 1 : 0.95 }}
            >
              <Card
                onClick={() => handleCardClick(card.id)}
                className={`h-32 cursor-pointer transition-all border-4 ${
                  isMatched
                    ? 'border-green-400 bg-green-100 opacity-50'
                    : isFlipped
                    ? 'border-violet-400 bg-violet-100'
                    : 'border-fuchsia-300 bg-gradient-to-br from-fuchsia-400 to-pink-400 hover:from-fuchsia-500 hover:to-pink-500'
                }`}
                data-testid={`card-${card.id}`}
              >
                <div className="h-full flex items-center justify-center p-4">
                  <AnimatePresence mode="wait">
                    {isVisible ? (
                      <motion.p
                        key="content"
                        initial={{ opacity: 0, rotateY: -90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: 90 }}
                        className="text-lg font-black text-violet-900 text-center"
                      >
                        {card.content}
                      </motion.p>
                    ) : (
                      <motion.div
                        key="back"
                        initial={{ opacity: 0, rotateY: -90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: 90 }}
                        className="text-4xl"
                      >
                        ?
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}