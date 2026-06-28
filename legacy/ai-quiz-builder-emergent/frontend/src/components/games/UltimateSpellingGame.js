import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Volume2, Sparkles, Star, Zap, Award } from "lucide-react";
import { translate, speak } from "@/utils/translations";
import { getIllustration } from "@/utils/images";

export default function UltimateSpellingGame({ content, onComplete, instructionLanguage = 'ja' }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wordImages, setWordImages] = useState({});
  const [streak, setStreak] = useState(0);

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
      setStreak(prev => prev + 1);
      setShowConfetti(true);
      speak("Perfect spelling! Amazing job!", 'en-US');
      
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
      }, 3000);
    } else {
      setFeedback('wrong');
      setStreak(0);
      speak("Try again! Listen carefully and spell it.", 'en-US');
      setTimeout(() => {
        setFeedback(null);
        setAnswer("");
      }, 2000);
    }
  }

  function repeatWord() {
    speak(words[currentWord], 'en-US');
  }

  if (!words || words.length === 0) {
    return <div className="text-center py-12">No words available</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} gravity={0.3} />}
      
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 30% 40%, rgba(251, 146, 60, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 40%, rgba(251, 146, 60, 0.2) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Streak Badge */}
      {streak > 1 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="fixed top-24 right-8 z-50"
        >
          <div className="bg-gradient-to-br from-orange-400 to-pink-500 text-white px-8 py-4 rounded-full shadow-2xl border-4 border-white font-black text-3xl flex items-center gap-3">
            <Award className="w-8 h-8 animate-bounce" />
            {streak} Perfect!
          </div>
        </motion.div>
      )}
      
      <Card className="border-8 border-fuchsia-500 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.4)] overflow-hidden bg-white">
        <CardContent className="p-16 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8 bg-gradient-to-r from-fuchsia-400 via-pink-400 to-orange-400 rounded-[2rem] border-4 border-fuchsia-500 shadow-2xl"
          >
            <p className="text-4xl font-black text-white drop-shadow-lg">
              {translate("Spell the word", instructionLanguage)}
            </p>
          </motion.div>

          <div className="text-center">
            <motion.p 
              className="text-4xl font-black text-fuchsia-900 mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="inline w-10 h-10 text-yellow-500 mr-3 animate-spin" style={{animationDuration: '3s'}} />
              {translate("Question", instructionLanguage)} {currentWord + 1} {translate("of", instructionLanguage)} {words.length}
            </motion.p>
            <div className="inline-block bg-gradient-to-r from-fuchsia-300 to-pink-300 px-10 py-5 rounded-full border-4 border-fuchsia-400 shadow-2xl">
              <p className="text-3xl font-black text-fuchsia-900">
                ⭐ {correctCount}/{attempts}
              </p>
            </div>
          </div>

          <motion.div
            key={currentWord}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="space-y-12"
          >
            {/* HUGE Image */}
            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.03 }}
            >
              <div className="relative">
                <motion.img 
                  src={wordImages[currentWord]}
                  alt="Spell this!"
                  className="w-[700px] h-[500px] object-cover rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] border-8 border-fuchsia-500"
                  animate={{ 
                    boxShadow: [
                      '0 40px 100px rgba(236,72,153,0.4)',
                      '0 45px 110px rgba(251,146,60,0.5)',
                      '0 40px 100px rgba(236,72,153,0.4)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-12 -right-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-600 rounded-full p-10 shadow-2xl border-8 border-white"
                  animate={{ 
                    rotate: [0, 20, -20, 0],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Sparkles className="w-16 h-16 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-12 -left-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full p-10 shadow-2xl border-8 border-white"
                  animate={{ 
                    rotate: [0, -20, 20, 0],
                    y: [0, -15, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <Zap className="w-16 h-16 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* HUGE Audio Button */}
            <div className="flex justify-center">
              <Button
                onClick={repeatWord}
                size="lg"
                className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-black text-4xl px-16 py-10 rounded-full shadow-[0_12px_0_0_rgba(0,0,0,0.3)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.3)] hover:translate-y-2 active:translate-y-3 transition-all border-8 border-purple-900"
              >
                <Volume2 className="w-12 h-12 mr-6 animate-pulse" />
                {translate("Listen and repeat", instructionLanguage)}
              </Button>
            </div>

            {/* Letter Boxes - LOWERCASE */}
            <div className="bg-gradient-to-br from-violet-300 via-purple-300 to-fuchsia-300 p-12 rounded-[2.5rem] border-8 border-fuchsia-400 shadow-2xl">
              <div className="flex justify-center gap-5 mb-10">
                {words[currentWord].split('').map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-20 h-28 border-b-8 border-fuchsia-700 bg-white rounded-2xl shadow-2xl flex items-center justify-center"
                    initial={{ y: -40, opacity: 0, rotate: -180 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
                    whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                  >
                    {answer[i] && (
                      <motion.span 
                        className="text-6xl font-black text-fuchsia-900"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 700 }}
                      >
                        {answer[i].toLowerCase()}
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* HUGE Input */}
            <div className="space-y-8">
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                placeholder={translate("Type here", instructionLanguage)}
                className="h-32 text-center text-7xl font-black border-8 border-fuchsia-500 rounded-[2rem] bg-white focus:ring-8 focus:ring-fuchsia-400 shadow-2xl placeholder:text-fuchsia-300"
                disabled={feedback !== null}
                data-testid="spelling-input"
                autoFocus
                maxLength={words[currentWord].length}
              />

              <Button
                onClick={checkAnswer}
                disabled={!answer.trim() || feedback !== null}
                className="w-full h-28 text-5xl font-black rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700 shadow-[0_14px_0_0_rgba(0,0,0,0.3)] hover:shadow-[0_7px_0_0_rgba(0,0,0,0.3)] hover:translate-y-2 active:translate-y-3 transition-all border-8 border-green-800 text-white"
              >
                <Check className="w-12 h-12 mr-6" />
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
                className={`p-16 rounded-[2.5rem] text-center border-8 shadow-2xl ${
                  feedback === 'correct'
                    ? 'bg-gradient-to-br from-green-300 to-emerald-300 border-green-600'
                    : 'bg-gradient-to-br from-red-300 to-pink-300 border-red-600'
                }`}
              >
                {feedback === 'correct' ? (
                  <div>
                    <motion.div
                      animate={{ 
                        rotate: [0, 360, 720],
                        scale: [1, 1.4, 1]
                      }}
                      transition={{ duration: 1 }}
                    >
                      <Check className="w-40 h-40 text-green-700 mx-auto mb-8" />
                    </motion.div>
                    <p className="text-7xl font-black text-green-900 mb-6">Perfect!</p>
                    <p className="text-6xl font-bold text-green-800">{words[currentWord]}</p>
                  </div>
                ) : (
                  <div>
                    <motion.div
                      animate={{ rotate: [0, -20, 20, -20, 20, 0] }}
                      transition={{ duration: 0.6 }}
                    >
                      <X className="w-40 h-40 text-red-700 mx-auto mb-8" />
                    </motion.div>
                    <p className="text-7xl font-black text-red-900">Try Again!</p>
                    <p className="text-4xl font-bold text-red-800 mt-6">Listen and try once more</p>
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
