import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, ArrowRight, Volume2, VolumeX, Sparkles, Star, Trophy, Zap } from "lucide-react";
import { translate, speak, stopSpeaking } from "@/utils/translations";
import { getIllustration } from "@/utils/images";
import { gameThemes, getThemeByKeyword } from "@/utils/gameThemes";

export default function UltimateQuizGame({ content, onComplete, instructionLanguage = 'ja' }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [streak, setStreak] = useState(0);
  const [questionImages, setQuestionImages] = useState({});

  const questions = content?.questions || [];
  const worksheetImages = content?.worksheetImages || [];
  
  // Get theme based on content theme or keywords, or use selected theme
  const selectedThemeKey = content?.selectedTheme;
  const themeKey = selectedThemeKey || getThemeByKeyword(content?.theme || content?.keywords?.[0] || '');
  const theme = gameThemes[themeKey];

  useEffect(() => {
    const loadImages = async () => {
      const images = {};
      questions.forEach((q, index) => {
        // Prioritize worksheet images if available
        if (worksheetImages.length > 0) {
          images[index] = worksheetImages[index % worksheetImages.length];
        } else {
          const keyword = q.imageKeyword || q.word || 'education';
          images[index] = getIllustration(keyword);
        }
      });
      setQuestionImages(images);
    };
    loadImages();
  }, [questions, worksheetImages]);

  useEffect(() => {
    if (audioEnabled && currentQuestion < questions.length) {
      setTimeout(() => {
        speak(questions[currentQuestion].question, 'en-US');
      }, 500);
    }
    
    return () => stopSpeaking();
  }, [currentQuestion, audioEnabled]);

  function speakAnswer(text) {
    if (audioEnabled) {
      speak(text, 'en-US');
    }
  }

  function handleAnswer(index) {
    if (answered) return;
    
    setSelectedAnswer(index);
    setAnswered(true);
    setShowFeedback(true);
    
    const isCorrect = index === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
      setShowConfetti(true);
      speak("Excellent! Perfect answer!", 'en-US');
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Auto-proceed to next question after 1.5 seconds on correct answer
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      setStreak(0);
      speak("Not quite! Try the next one!", 'en-US');
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
      const score = Math.round(((correctAnswers + (selectedAnswer === questions[currentQuestion]?.correct ? 1 : 0)) / questions.length) * 100);
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
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} gravity={0.3} />}
      
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(251, 146, 60, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Streak Counter */}
      {streak > 1 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="fixed top-24 right-8 z-50"
        >
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full shadow-2xl border-4 border-white font-black text-3xl flex items-center gap-3">
            <Zap className="w-8 h-8 animate-pulse" />
            {streak} Streak!
          </div>
        </motion.div>
      )}
      
      <Card className={`border-8 ${theme.borderColor} rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden bg-white relative`}>
        {/* Theme indicator */}
        <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <span className="text-xl mr-2">{theme.emoji}</span>
          <span className="text-sm font-bold text-slate-600">{theme.name}</span>
        </div>
        
        {/* Progress Bar */}
        <div className={`h-6 bg-gradient-to-r ${theme.cardBg} relative overflow-hidden`}>
          <motion.div 
            className={`h-full bg-gradient-to-r ${theme.primaryGradient} relative`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-30"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-black ${theme.textColor} drop-shadow-lg`}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <CardHeader className={`bg-gradient-to-r ${theme.primaryGradient} text-white pb-10 relative overflow-hidden`}>
          {/* Animated theme particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              animate={{
                y: [0, -100],
                x: [0, (i % 2 ? 1 : -1) * 50],
                opacity: [0.8, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
              style={{
                left: `${(i * 5)}%`,
                bottom: 0
              }}
            >
              {theme.particles[i % theme.particles.length]}
            </motion.div>
          ))}

          <div className="flex justify-between items-center relative z-10">
            <CardTitle className="text-5xl font-black drop-shadow-lg flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-12 h-12" />
              </motion.div>
              <span>
                {translate("Question", instructionLanguage)} {currentQuestion + 1} 
                <span className="text-yellow-300 mx-3">of</span> {questions.length}
              </span>
            </CardTitle>
            <div className="flex items-center gap-6">
              <motion.div 
                className="text-2xl font-black bg-white/30 px-8 py-4 rounded-full backdrop-blur-md border-4 border-white/50 shadow-xl"
                whileHover={{ scale: 1.1 }}
              >
                ⭐ {correctAnswers}/{currentQuestion + (answered ? 1 : 0)}
              </motion.div>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/20 rounded-full border-4 border-white/50 h-16 w-16"
                onClick={toggleAudio}
                data-testid="audio-toggle"
              >
                {audioEnabled ? <Volume2 className="w-8 h-8" /> : <VolumeX className="w-8 h-8" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 p-8 bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 rounded-[2rem] border-4 border-violet-400 shadow-2xl"
          >
            <p className="text-3xl font-black text-violet-900 drop-shadow-md">
              {translate("Click the correct answer", instructionLanguage)}
            </p>
          </motion.div>

          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="space-y-10"
          >
            {/* Media Display - Image or Video */}
            <motion.div 
              className="flex justify-center mb-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="relative">
                {/* Check if it's a video URL */}
                {question.videoUrl || content?.videoUrl ? (
                  <div className="w-[600px] h-[400px] rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.4)] border-8 border-yellow-400 overflow-hidden bg-black">
                    <video 
                      src={question.videoUrl || content?.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay={false}
                      muted
                      poster={questionImages[currentQuestion]}
                    />
                  </div>
                ) : (
                  <motion.img 
                    src={questionImages[currentQuestion]}
                    alt={question.word}
                    className="w-[600px] h-[400px] object-cover rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.4)] border-8 border-yellow-400"
                    whileHover={{ scale: 1.03 }}
                  />
                )}
                <motion.div
                  className="absolute -top-10 -right-10 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-full p-8 shadow-2xl border-8 border-white"
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Sparkles className="w-16 h-16 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Question with Audio */}
            <div className="flex items-center justify-center gap-6 mb-12">
              <motion.h3 
                className="text-6xl font-black text-violet-900 drop-shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {question.question}
              </motion.h3>
              <Button
                size="lg"
                className="rounded-full border-6 border-violet-500 bg-white hover:bg-violet-100 shadow-2xl h-20 w-20"
                onClick={() => speak(question.question, 'en-US')}
              >
                <Volume2 className="w-10 h-10 text-violet-600" />
              </Button>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {question.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ 
                    scale: answered ? 1 : 1.08,
                    rotate: answered ? 0 : [0, -2, 2, -2, 0]
                  }}
                  whileTap={{ scale: answered ? 1 : 0.92 }}
                  onHoverStart={() => speakAnswer(option)}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Card
                    className={`p-12 cursor-pointer transition-all border-8 shadow-2xl relative overflow-hidden ${
                      selectedAnswer === index
                        ? showFeedback
                          ? index === question.correct
                            ? 'border-green-600 bg-gradient-to-br from-green-200 to-green-300 scale-105'
                            : 'border-red-600 bg-gradient-to-br from-red-200 to-red-300 animate-shake'
                          : 'border-violet-700 bg-gradient-to-br from-violet-200 to-purple-200'
                        : index === question.correct && showFeedback
                        ? 'border-green-600 bg-gradient-to-br from-green-200 to-green-300'
                        : 'border-violet-400 hover:border-violet-600 bg-gradient-to-br from-white to-violet-100 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transform hover:-translate-y-3'
                    } ${answered && 'pointer-events-none'} rounded-[2rem]`}
                    onClick={() => handleAnswer(index)}
                    data-testid={`answer-${index}`}
                  >
                    {/* Shimmer effect */}
                    {!answered && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full bg-violet-200 hover:bg-violet-300 h-12 w-12 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakAnswer(option);
                          }}
                          data-testid={`speak-answer-${index}`}
                        >
                          <Volume2 className="w-6 h-6 text-violet-700" />
                        </Button>
                        <p className="text-4xl font-black text-violet-900">{option}</p>
                      </div>
                      {showFeedback && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 600 }}
                        >
                          {index === question.correct ? (
                            <div className="bg-green-600 rounded-full p-4 shadow-2xl">
                              <Check className="w-12 h-12 text-white" />
                            </div>
                          ) : selectedAnswer === index ? (
                            <div className="bg-red-600 rounded-full p-4 shadow-2xl">
                              <X className="w-12 h-12 text-white" />
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-10"
              >
                <Button
                  onClick={handleNext}
                  className="w-full h-24 text-4xl font-black rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700 shadow-[0_12px_0_0_rgba(0,0,0,0.3)] hover:shadow-[0_6px_0_0_rgba(0,0,0,0.3)] hover:translate-y-2 active:translate-y-3 transition-all border-8 border-green-800 text-white"
                  data-testid="next-question-button"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      {translate("Next Question", instructionLanguage)}
                      <ArrowRight className="w-10 h-10 ml-6" />
                    </>
                  ) : (
                    <>
                      <Trophy className="w-10 h-10 mr-6" />
                      See Your Score!
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
