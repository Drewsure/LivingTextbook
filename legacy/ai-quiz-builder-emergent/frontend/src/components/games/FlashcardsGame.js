import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export default function FlashcardsGame({ content, onComplete }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const cards = content?.cards || [];

  function handleFlip() {
    if (!flipped) {
      setFlipped(true);
      if (reviewedCount === currentCard) {
        setReviewedCount(prev => prev + 1);
      }
    } else {
      setFlipped(false);
    }
  }

  function handleNext() {
    if (currentCard < cards.length - 1) {
      setCurrentCard(prev => prev + 1);
      setFlipped(false);
    } else {
      const score = Math.round((reviewedCount / cards.length) * 100);
      onComplete(score);
    }
  }

  function handlePrevious() {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
      setFlipped(false);
    }
  }

  if (!cards || cards.length === 0) {
    return <div className="text-center py-12">No flashcards available</div>;
  }

  const card = cards[currentCard];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <p className="text-lg font-bold text-violet-900">
          Card {currentCard + 1} of {cards.length}
        </p>
        <p className="text-sm text-violet-600">Tap the card to flip it!</p>
      </div>

      <motion.div
        className="relative h-96 cursor-pointer"
        onClick={handleFlip}
        data-testid="flashcard"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={flipped ? 'back' : 'front'}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -90 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Card className={`h-full border-4 rounded-3xl shadow-2xl ${
              flipped 
                ? 'border-fuchsia-400 bg-gradient-to-br from-fuchsia-100 to-pink-100'
                : 'border-violet-400 bg-gradient-to-br from-violet-100 to-purple-100'
            }`}>
              <CardContent className="h-full flex flex-col items-center justify-center p-12">
                <div className="text-sm font-bold text-violet-600 mb-4">
                  {flipped ? 'BACK' : 'FRONT'}
                </div>
                <p className="text-4xl font-black text-center text-violet-900">
                  {flipped ? card.back : card.front}
                </p>
                <div className="mt-8">
                  <RotateCcw className="w-8 h-8 text-violet-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="flex gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentCard === 0}
          variant="outline"
          className="flex-1 h-14 text-lg font-black rounded-full border-4 border-violet-300"
          data-testid="previous-card-button"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1 h-14 text-lg font-black rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
          data-testid="next-card-button"
        >
          {currentCard < cards.length - 1 ? (
            <>
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          ) : (
            'Finish'
          )}
        </Button>
      </div>

      <div className="flex gap-2 justify-center">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentCard
                ? 'bg-violet-600 w-8'
                : index < reviewedCount
                ? 'bg-green-400'
                : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}