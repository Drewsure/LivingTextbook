import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, ArrowRight } from "lucide-react";

export default function QuizGame({ content, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = content?.questions || [];

  function handleAnswer(index) {
    if (answered) return;
    
    setSelectedAnswer(index);
    setAnswered(true);
    setShowFeedback(true);
    
    if (index === questions[currentQuestion].correct) {
      setCorrectAnswers(prev => prev + 1);
    }
  }

  function handleNext() {
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

  if (!questions || questions.length === 0) {
    return <div className="text-center py-12">No questions available</div>;
  }

  const question = questions[currentQuestion];

  return (
    <div className="space-y-6">
      <Card className="border-4 border-violet-300 rounded-3xl shadow-xl">
        <CardHeader className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-black">
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
            <div className="text-sm font-bold bg-white/20 px-4 py-2 rounded-full">
              Score: {correctAnswers}/{currentQuestion + (answered ? 1 : 0)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-black text-violet-900 mb-6">
              {question.question}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: answered ? 1 : 1.02 }}
                  whileTap={{ scale: answered ? 1 : 0.98 }}
                >
                  <Card
                    className={`p-6 cursor-pointer transition-all border-4 ${
                      selectedAnswer === index
                        ? showFeedback
                          ? index === question.correct
                            ? 'border-green-500 bg-green-100'
                            : 'border-red-500 bg-red-100'
                          : 'border-violet-500 bg-violet-100'
                        : index === question.correct && showFeedback
                        ? 'border-green-500 bg-green-100'
                        : 'border-violet-200 hover:border-violet-300'
                    } ${answered && 'pointer-events-none'}`}
                    onClick={() => handleAnswer(index)}
                    data-testid={`answer-${index}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-violet-900">{option}</p>
                      {showFeedback && (
                        <div>
                          {index === question.correct ? (
                            <Check className="w-6 h-6 text-green-600" />
                          ) : selectedAnswer === index ? (
                            <X className="w-6 h-6 text-red-600" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4"
              >
                <Button
                  onClick={handleNext}
                  className="w-full h-14 text-xl font-black rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  data-testid="next-question-button"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    'See Results'
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