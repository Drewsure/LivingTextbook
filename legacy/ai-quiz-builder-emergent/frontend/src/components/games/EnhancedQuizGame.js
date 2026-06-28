import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, ArrowRight, Volume2, VolumeX, Sparkles, Star } from "lucide-react";
import { translate, speak, stopSpeaking } from "@/utils/translations";
import { getIllustration } from "@/utils/images";

export default function EnhancedQuizGame({ content, onComplete, instructionLanguage = 'ja' }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [questionImages, setQuestionImages] = useState({});

  const questions = content?.questions || [];

  useEffect(() => {
    const loadImages = async () => {
      const images = {};
      questions.forEach((q, index) => {
        const keyword = q.imageKeyword || q.word || 'education';
        images[index] = getIllustration(keyword);
      });
      setQuestionImages(images);
    };
    loadImages();
  }, [questions]);

  useEffect(() => {
    if (audioEnabled && currentQuestion < questions.length) {
      setTimeout(() => {
        speak(questions[currentQuestion].question, 'en-US');
      }, 500);
    }
    
    return () => stopSpeaking();
  }, [currentQuestion, audioEnabled]);

  function handleAnswer(index) {
    if (answered) return;
    
    setSelectedAnswer(index);
    setAnswered(true);
    setShowFeedback(true);
    
    const isCorrect = index === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setShowConfetti(true);
      speak("Correct! Great job!", 'en-US');
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      speak("Try again!", 'en-US');
    }
  }

  function handleNext() {
    stopSpeaking();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setAnswered(false);
    } else {
      const score = Math.round((correctAnswers / questions.length) * 100);
      onComplete(score);
    }
  }

  function toggleAudio() {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      speak(questions[currentQuestion].question, 'en-US');
    } else {
      stopSpeaking();
    }
  }

  if (!questions || questions.length === 0) {
    return <div className="text-center py-12">No questions available</div>;
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6 relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      
      <Card className="border-8 border-violet-400 rounded-[2rem] shadow-2xl overflow-hidden bg-gradient-to-br from-violet-50 to-fuchsia-50">
        <div className="h-4 bg-gradient-to-r from-violet-200 to-fuchsia-200">
          <motion.div 
            className="h-full bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <CardHeader className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white pb-8 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />
          <div className="flex justify-between items-center relative z-10">
            <CardTitle className="text-4xl font-black drop-shadow-lg">
              <span className="inline-flex items-center gap-3">
                <Star className="w-10 h-10 animate-spin" style={{ animationDuration: '3s' }} />
                {translate("Question", instructionLanguage)} {currentQuestion + 1} 
                <span className="text-yellow-300">of</span> {questions.length}
              </span>
            </CardTitle>
            <div className="flex items-center gap-4">
              <motion.div 
                className="text-lg font-black bg-white/30 px-6 py-3 rounded-full backdrop-blur-md border-4 border-white/50"
                whileHover={{ scale: 1.05 }}
              >
                {translate("Score", instructionLanguage)}: {correctAnswers}/{currentQuestion + (answered ? 1 : 0)}
              </motion.div>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/20 rounded-full border-4 border-white/50 h-14 w-14"
                onClick={toggleAudio}
                data-testid="audio-toggle"
              >
                {audioEnabled ? <Volume2 className="w-7 h-7" /> : <VolumeX className="w-7 h-7" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 p-6 bg-gradient-to-r from-violet-200 to-fuchsia-200 rounded-3xl border-4 border-violet-300 shadow-lg"
          >
            <p className="text-2xl font-black text-violet-900">
              {translate("Click the correct answer", instructionLanguage)}
            </p>
          </motion.div>

          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="relative">
                <motion.img 
                  src={questionImages[currentQuestion]}
                  alt={question.word}
                  className="w-96 h-80 object-cover rounded-[2rem] shadow-2xl border-8 border-yellow-400"
                  whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                  transition={{ type: "spring" }}
                />
                <motion.div
                  className="absolute -top-6 -right-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-5 shadow-2xl border-6 border-white"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
              </div>
            </motion.div>

            <div className="flex items-center justify-center gap-4 mb-10">
              <motion.h3 
                className="text-5xl font-black text-violet-900 text-center drop-shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {question.question}
              </motion.h3>
              <Button
                size="lg"
                className="rounded-full border-4 border-violet-400 bg-white hover:bg-violet-100 shadow-xl h-16 w-16"
                onClick={() => speak(question.question, 'en-US')}
                data-testid="speak-question"
              >
                <Volume2 className="w-8 h-8 text-violet-600" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {question.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ 
                    scale: answered ? 1 : 1.08,
                    rotate: answered ? 0 : [0, -2, 2, 0]
                  }}
                  whileTap={{ scale: answered ? 1 : 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Card
                    className={`p-10 cursor-pointer transition-all border-8 shadow-2xl ${
                      selectedAnswer === index
                        ? showFeedback
                          ? index === question.correct
                            ? 'border-green-500 bg-gradient-to-br from-green-100 to-green-200 scale-105 shadow-green-300'
                            : 'border-red-500 bg-gradient-to-br from-red-100 to-red-200 animate-shake shadow-red-300'
                          : 'border-violet-600 bg-gradient-to-br from-violet-100 to-purple-100'
                        : index === question.correct && showFeedback
                        ? 'border-green-500 bg-gradient-to-br from-green-100 to-green-200 shadow-green-300'
                        : 'border-violet-300 hover:border-violet-500 hover:shadow-2xl bg-gradient-to-br from-white to-violet-50 transform hover:-translate-y-2'
                    } ${answered && 'pointer-events-none'} rounded-3xl`}
                    onClick={() => handleAnswer(index)}
                    data-testid={`answer-${index}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-black text-violet-900">{option}</p>
                      {showFeedback && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          {index === question.correct ? (
                            <div className="bg-green-600 rounded-full p-3 shadow-xl">
                              <Check className="w-10 h-10 text-white" />
                            </div>
                          ) : selectedAnswer === index ? (
                            <div className="bg-red-600 rounded-full p-3 shadow-xl">
                              <X className="w-10 h-10 text-white" />
                            </div>
                          ) : null}
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-8"
              >
                <Button
                  onClick={handleNext}
                  className="w-full h-20 text-3xl font-black rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700 shadow-[0_8px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:translate-y-1 active:translate-y-2 transition-all border-4 border-green-700"
                  data-testid="next-question-button"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      {translate("Next Question", instructionLanguage)}
                      <ArrowRight className="w-8 h-8 ml-4" />
                    </>
                  ) : (
                    <>
                      <Trophy className="w-8 h-8 mr-4" />
                      See Results!
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
