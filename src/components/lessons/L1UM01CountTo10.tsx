import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X, Star, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface L1UM01CountTo10Props {
  onComplete: () => void;
  onProgress?: (progress: number) => void;
}

/**
 * Lesson Activity: I Can Count to 10
 * Interactive counting game for foundational number recognition
 */
export default function L1UM01CountTo10({ onComplete, onProgress }: L1UM01CountTo10Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);

  const totalQuestions = 10;

  // Generate random counting questions
  const questions = [
    { count: 3, emoji: '🍎' },
    { count: 7, emoji: '⭐' },
    { count: 5, emoji: '🎈' },
    { count: 9, emoji: '🐶' },
    { count: 2, emoji: '🚗' },
    { count: 10, emoji: '🎨' },
    { count: 4, emoji: '🌸' },
    { count: 6, emoji: '🎮' },
    { count: 8, emoji: '🦋' },
    { count: 1, emoji: '🌟' },
  ];

  const currentQ = questions[currentQuestion];

  // Update progress
  useEffect(() => {
    onProgress?.((currentQuestion / totalQuestions) * 100);
  }, [currentQuestion, onProgress]);

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);

    const correct = answer === currentQ.count;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      
      // Celebrate correct answer
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });

      // Auto-advance after 1 second
      setTimeout(() => {
        if (currentQuestion < totalQuestions - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
        } else {
          // Lesson complete!
          handleLessonComplete();
        }
      }, 1000);
    } else {
      setStreak(0);
      
      // Show retry after 1.5 seconds
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

  const handleLessonComplete = () => {
    // Big celebration!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  // Generate answer options (correct + 2 wrong)
  const generateOptions = () => {
    const options = [currentQ.count];
    const wrongOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      .filter(n => n !== currentQ.count)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    return [...options, ...wrongOptions].sort(() => Math.random() - 0.5);
  };

  const options = generateOptions();

  if (currentQuestion >= totalQuestions && score >= totalQuestions * 0.8) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center p-6"
      >
        <div className="bg-white rounded-3xl border-4 border-green-400 p-12 text-center max-w-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎉 Lesson Complete!
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            You earned the <span className="text-blue-600 font-semibold">Counting to 10</span> badge!
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-600">100</div>
              <div className="text-sm text-muted-foreground">Robux</div>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-600">{Math.round((score / totalQuestions) * 100)}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>

          <p className="text-gray-600">
            Great job! You're on your way to becoming a counting expert! 🌟
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-calm-bg p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-calm-surface border-2 border-calm-border rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">I Can Count to 10</h1>
              <p className="text-muted-foreground">Count the objects and pick the right number!</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Question</div>
              <div className="text-2xl font-bold text-calm-primary">
                {currentQuestion + 1} / {totalQuestions}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-calm-surface border-2 border-calm-border rounded-2xl p-8"
        >
          <h2 className="text-xl font-semibold text-center mb-8">
            How many {currentQ.emoji} do you see?
          </h2>

          {/* Objects to Count */}
          <div className="flex flex-wrap gap-4 justify-center mb-12 min-h-[200px] items-center">
            {Array.from({ length: currentQ.count }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-6xl"
              >
                {currentQ.emoji}
              </motion.div>
            ))}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {options.map((option) => {
              const isSelected = selectedAnswer === option;
              const showFeedback = isSelected && isCorrect !== null;
              
              return (
                <motion.button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                  whileHover={selectedAnswer === null ? { scale: 1.05 } : undefined}
                  whileTap={selectedAnswer === null ? { scale: 0.95 } : undefined}
                  className={`
                    relative h-20 rounded-xl font-bold text-2xl transition-all
                    ${!showFeedback ? 'bg-white border-2 border-calm-border hover:border-calm-primary' : ''}
                    ${showFeedback && isCorrect ? 'bg-green-500 text-white border-2 border-green-600' : ''}
                    ${showFeedback && !isCorrect ? 'bg-red-500 text-white border-2 border-red-600' : ''}
                    ${selectedAnswer !== null && !isSelected ? 'opacity-50' : ''}
                  `}
                >
                  {option}
                  
                  {/* Feedback Icons */}
                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2"
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-8 h-8 text-green-600 bg-white rounded-full" />
                        ) : (
                          <X className="w-8 h-8 text-red-600 bg-white rounded-full" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback Message */}
          <AnimatePresence>
            {isCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-6 text-center p-4 rounded-xl ${
                  isCorrect 
                    ? 'bg-green-100 border-2 border-green-300 text-green-800' 
                    : 'bg-red-100 border-2 border-red-300 text-red-800'
                }`}
              >
                {isCorrect ? (
                  <>
                    <p className="font-semibold text-lg">Great job counting all the objects! 🎉</p>
                    {streak >= 3 && (
                      <p className="text-sm mt-1">
                        🔥 {streak} in a row! You're on fire!
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-semibold text-lg">Try again! Count each object one by one. 💪</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Score Display */}
        <div className="mt-6 bg-calm-surface border-2 border-calm-border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">Score: {score} / {totalQuestions}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Streak:</span>
                <span className="font-bold text-orange-500">{streak} 🔥</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
