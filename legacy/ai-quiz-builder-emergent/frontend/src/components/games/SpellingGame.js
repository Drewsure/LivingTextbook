import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Volume2 } from "lucide-react";

export default function SpellingGame({ content, onComplete }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const words = content?.words || [];
  const hints = content?.hints || [];

  function checkAnswer() {
    if (!answer.trim()) return;
    
    setAttempts(prev => prev + 1);
    const correct = answer.toLowerCase().trim() === words[currentWord].toLowerCase();
    
    if (correct) {
      setFeedback('correct');
      setCorrectCount(prev => prev + 1);
      setTimeout(() => {
        if (currentWord < words.length - 1) {
          setCurrentWord(prev => prev + 1);
          setAnswer("");
          setFeedback(null);
        } else {
          const score = Math.round((correctCount + 1) / words.length * 100);
          onComplete(score);
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setAnswer("");
      }, 1500);
    }
  }

  if (!words || words.length === 0) {
    return <div className="text-center py-12">No words available</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="border-4 border-violet-300 rounded-3xl shadow-xl">
        <CardContent className="p-8 space-y-6">
          <div className="text-center">
            <p className="text-lg font-bold text-violet-900 mb-2">
              Word {currentWord + 1} of {words.length}
            </p>
            <div className="inline-block bg-violet-100 px-6 py-3 rounded-full">
              <p className="text-sm font-bold text-violet-700">
                Score: {correctCount}/{attempts}
              </p>
            </div>
          </div>

          <motion.div
            key={currentWord}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-violet-100 to-fuchsia-100 p-8 rounded-3xl border-4 border-violet-200">
              <p className="text-xl font-bold text-center text-violet-900 mb-4">
                {hints[currentWord] || `Spell the word`}
              </p>
              <div className="flex justify-center gap-2">
                {words[currentWord].split('').map((_, i) => (
                  <div key={i} className="w-8 h-12 border-b-4 border-violet-400" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                placeholder="Type your answer..."
                className="h-16 text-center text-2xl font-bold border-4 border-violet-200 rounded-2xl bg-white"
                disabled={feedback !== null}
                data-testid="spelling-input"
                autoFocus
              />

              <Button
                onClick={checkAnswer}
                disabled={!answer.trim() || feedback !== null}
                className="w-full h-14 text-xl font-black rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                data-testid="check-spelling-button"
              >
                Check Spelling
              </Button>
            </div>
          </motion.div>

          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-3xl text-center border-4 ${
                feedback === 'correct'
                  ? 'bg-green-100 border-green-400'
                  : 'bg-red-100 border-red-400'
              }`}
            >
              {feedback === 'correct' ? (
                <div>
                  <Check className="w-16 h-16 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-black text-green-700">Perfect!</p>
                  <p className="text-lg font-bold text-green-600 mt-2">{words[currentWord]}</p>
                </div>
              ) : (
                <div>
                  <X className="w-16 h-16 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-black text-red-700">Try Again!</p>
                  <p className="text-sm font-bold text-red-600 mt-2">The correct spelling is: {words[currentWord]}</p>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}