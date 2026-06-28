import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Volume2, Sparkles, Star, Zap } from "lucide-react";
import { translate, speak } from "@/utils/translations";
import { getIllustration } from "@/utils/images";

export default function EnhancedSpellingGame({ content, onComplete, instructionLanguage = 'ja' }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wordImages, setWordImages] = useState({});

  const words = content?.words || [];
  const imageKeywords = content?.imageKeywords || words;

  useEffect(() => {
    const images = {};
    words.forEach((word, index) => {
      const keyword = imageKeywords[index] || word;
      images[index] = getIllustration(keyword);
    });
    setWordImages(images);
  }, [words]);

  useEffect(() => {
    if (currentWord < words.length) {
      setTimeout(() => {
        speak(words[currentWord], 'en-US');
      }, 500);
    }
  }, [currentWord]);

  function checkAnswer() {
    if (!answer.trim()) return;
    
    setAttempts(prev => prev + 1);
    const correct = answer.toLowerCase().trim() === words[currentWord].toLowerCase();
    
    if (correct) {
      setFeedback('correct');
      setCorrectCount(prev => prev + 1);
      setShowConfetti(true);
      speak("Excellent! Perfect spelling!", 'en-US');
      
      setTimeout(() => {
        setShowConfetti(false);
        if (currentWord < words.length - 1) {
          setCurrentWord(prev => prev + 1);
          setAnswer("");
          setFeedback(null);
        } else {
          const score = Math.round((correctCount + 1) / words.length * 100);
          onComplete(score);
        }
      }, 2500);
    } else {
      setFeedback('wrong');
      speak("Try again! Listen carefully.", 'en-US');
      setTimeout(() => {
        setFeedback(null);
        setAnswer("");
      }, 1500);
    }
  }

  function repeatWord() {
    speak(words[currentWord], 'en-US');
  }

  if (!words || words.length === 0) {
    return <div className="text-center py-12">No words available</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}
      
      <Card className="border-8 border-fuchsia-400 rounded-[2rem] shadow-2xl overflow-hidden bg-gradient-to-br from-fuchsia-50 to-pink-50">
        <CardContent className="p-12 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-6 bg-gradient-to-r from-fuchsia-300 to-pink-300 rounded-3xl border-4 border-fuchsia-400 shadow-lg"
          >
            <p className="text-3xl font-black text-fuchsia-900 drop-shadow-md">
              {translate("Spell the word", instructionLanguage)}
            </p>
          </motion.div>

          <div className="text-center">
            <motion.p 
              className="text-3xl font-black text-fuchsia-900 mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="inline w-8 h-8 text-yellow-500 mr-2" />
              {translate("Question", instructionLanguage)} {currentWord + 1} {translate("of", instructionLanguage)} {words.length}
            </motion.p>
            <div className="inline-block bg-gradient-to-r from-fuchsia-200 to-pink-200 px-8 py-4 rounded-full border-4 border-fuchsia-300 shadow-xl">
              <p className="text-2xl font-black text-fuchsia-800">
                {translate("Score", instructionLanguage)}: {correctCount}/{attempts}
              </p>
            </div>
          </div>

          <motion.div
            key={currentWord}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="space-y-10"
          >
            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <motion.img 
                  src={wordImages[currentWord]}
                  alt="Spell this!"
                  className="w-[500px] h-96 object-cover rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-8 border-fuchsia-400"
                  animate={{ 
                    boxShadow: [
                      '0 20px 50px rgba(236,72,153,0.3)',
                      '0 25px 60px rgba(219,39,119,0.4)',
                      '0 20px 50px rgba(236,72,153,0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -top-8 -right-8 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-full p-6 shadow-2xl border-8 border-white"
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-8 -left-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full p-6 shadow-2xl border-8 border-white"
                  animate={{ 
                    rotate: [0, -15, 15, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Zap className="w-12 h-12 text-white" />
                </motion.div>
              </div>
            </motion.div>

            <div className="flex justify-center">
              <Button
                onClick={repeatWord}
                size="lg"
                className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-black text-2xl px-12 py-8 rounded-full shadow-[0_8px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:translate-y-1 active:translate-y-2 transition-all border-4 border-purple-800"
                data-testid="speak-word-button"
              >
                <Volume2 className="w-8 h-8 mr-4 animate-pulse" />
                {translate("Listen and repeat", instructionLanguage)}
              </Button>
            </div>

            <div className="bg-gradient-to-br from-violet-200 via-purple-200 to-fuchsia-200 p-10 rounded-[2rem] border-8 border-fuchsia-300 shadow-2xl">
              <div className="flex justify-center gap-4 mb-8">
                {words[currentWord].split('').map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-16 h-24 border-b-8 border-fuchsia-600 bg-white rounded-2xl shadow-xl flex items-center justify-center"
                    initial={{ y: -30, opacity: 0, rotate: -180 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  >
                    {answer[i] && (
                      <motion.span 
                        className="text-5xl font-black text-fuchsia-900"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        {answer[i].toUpperCase()}
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                placeholder="Type here..."
                className="h-24 text-center text-5xl font-black border-8 border-fuchsia-400 rounded-3xl bg-white focus:ring-8 focus:ring-fuchsia-300 shadow-2xl"
                disabled={feedback !== null}
                data-testid="spelling-input"
                autoFocus
                maxLength={words[currentWord].length}
              />

              <Button
                onClick={checkAnswer}
                disabled={!answer.trim() || feedback !== null}
                className="w-full h-24 text-4xl font-black rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700 shadow-[0_10px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_5px_0_0_rgba(0,0,0,0.2)] hover:translate-y-1 active:translate-y-2 transition-all border-8 border-green-700"
                data-testid="check-spelling-button"
              >
                <Check className="w-10 h-10 mr-4" />
                Check Spelling!
              </Button>
            </div>
          </motion.div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className={`p-12 rounded-[2rem] text-center border-8 shadow-2xl ${
                  feedback === 'correct'
                    ? 'bg-gradient-to-br from-green-200 to-emerald-200 border-green-500'
                    : 'bg-gradient-to-br from-red-200 to-pink-200 border-red-500'
                }`}
              >
                {feedback === 'correct' ? (
                  <div>
                    <motion.div
                      animate={{ 
                        rotate: [0, 360, 720],
                        scale: [1, 1.3, 1]
                      }}
                      transition={{ duration: 0.8 }}
                    >
                      <Check className="w-32 h-32 text-green-600 mx-auto mb-6" />
                    </motion.div>
                    <p className="text-6xl font-black text-green-800 mb-4">Perfect!</p>
                    <p className="text-5xl font-bold text-green-700">{words[currentWord]}</p>
                  </div>
                ) : (
                  <div>
                    <motion.div
                      animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <X className="w-32 h-32 text-red-600 mx-auto mb-6" />
                    </motion.div>
                    <p className="text-6xl font-black text-red-800">Try Again!</p>
                    <p className="text-3xl font-bold text-red-700 mt-4">Listen carefully</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
