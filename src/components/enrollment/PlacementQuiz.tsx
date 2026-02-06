/**
 * Placement Quiz Component
 * Adaptive quiz to determine student's tier and skill levels
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import {
  PLACEMENT_QUIZ_QUESTIONS,
  calculatePlacement,
  type QuizAnswer,
  type QuizQuestion,
  type PlacementResult,
} from '../../lib/placement-quiz';

interface PlacementQuizProps {
  studentName: string;
  onComplete: (result: PlacementResult) => void;
  onCancel?: () => void;
}

export default function PlacementQuiz({ studentName, onComplete, onCancel }: PlacementQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);

  // Filter questions based on age (adaptive)
  const [filteredQuestions, setFilteredQuestions] = useState<QuizQuestion[]>([]);
  const [studentAge, setStudentAge] = useState<number | null>(null);

  useEffect(() => {
    // Initial questions (everyone sees background questions)
    setFilteredQuestions(PLACEMENT_QUIZ_QUESTIONS.slice(0, 10));
  }, []);

  // Update filtered questions when age is answered
  useEffect(() => {
    if (studentAge !== null) {
      const ageAppropriate = PLACEMENT_QUIZ_QUESTIONS.filter(q => {
        if (!q.ageRange) return true;
        const [min, max] = q.ageRange.split('-').map(n => parseInt(n));
        return studentAge >= min && studentAge <= max;
      });
      setFilteredQuestions(ageAppropriate);
    }
  }, [studentAge]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      isCorrect: currentQuestion.correctAnswer
        ? selectedAnswer === currentQuestion.correctAnswer
        : undefined,
    };

    setAnswers([...answers, newAnswer]);

    // Check if this is the age question
    if (currentQuestion.id === 'bg-1') {
      setStudentAge(parseInt(selectedAnswer as string));
    }

    // Move to next question or finish
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz complete - calculate results
      const placementResult = calculatePlacement([...answers, newAnswer]);
      setResult(placementResult);
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // Remove last answer
      setAnswers(answers.slice(0, -1));
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[answers.length - 1]?.answer || null);
    }
  };

  const handleComplete = () => {
    if (result) {
      onComplete(result);
    }
  };

  if (isComplete && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <Sparkles className="w-16 h-16 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">🎉 Placement Complete!</h1>
            <p className="text-purple-100">We found the perfect tier for {studentName}!</p>
          </div>

          {/* Results */}
          <div className="p-8 space-y-6">
            {/* Tier Assignment */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border-2 border-purple-300">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">🎯 Tier Assignment</h3>
              <div className="text-3xl font-bold text-purple-600 capitalize">
                {result.tier.replace('-', ' ')}
              </div>
              <p className="text-purple-700 mt-2">
                Starting Quest: <strong>{result.recommendedStartQuest}</strong>
              </p>
            </div>

            {/* Skill Levels */}
            <div className="grid grid-cols-3 gap-4">
              <SkillCard label="Math" level={result.mathLevel} color="blue" />
              <SkillCard label="Reading" level={result.readingLevel} color="green" />
              <SkillCard label="Writing" level={result.writingLevel} color="purple" />
            </div>

            {/* Learning Style */}
            <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
              <h3 className="text-lg font-semibold text-cyan-900 mb-2">🎨 Learning Style</h3>
              <div className="text-xl font-bold text-cyan-600 capitalize">{result.learningStyle}</div>
            </div>

            {/* Strengths */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-3">💪 Strengths</h3>
              <ul className="space-y-2">
                {result.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">🎯 Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-purple-700">
                    <Sparkles className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Supports */}
            {result.neurodivergentSupports.length > 0 && (
              <div className="bg-pink-50 rounded-2xl p-6 border border-pink-200">
                <h3 className="text-lg font-semibold text-pink-900 mb-3">🤝 Learning Supports</h3>
                <ul className="space-y-2">
                  {result.neurodivergentSupports.map((support, i) => (
                    <li key={i} className="flex items-start gap-2 text-pink-700">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{support}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6 rounded-2xl"
            >
              Continue to Enrollment <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-600">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </span>
            <span className="text-sm font-medium text-gray-500 capitalize">
              {currentQuestion.category}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{currentQuestion.question}</h2>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {currentQuestion.options?.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedAnswer === option
                      ? 'border-purple-600 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedAnswer === option ? (
                      <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    )}
                    <span className={`text-lg ${selectedAnswer === option ? 'font-semibold text-purple-900' : 'text-gray-700'}`}>
                      {option}
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="p-8 border-t border-gray-200 flex items-center justify-between gap-4">
          <Button
            onClick={currentQuestionIndex === 0 ? onCancel : handlePrevious}
            variant="outline"
            className="flex items-center gap-2"
            disabled={currentQuestionIndex === 0 && !onCancel}
          >
            <ArrowLeft className="w-4 h-4" />
            {currentQuestionIndex === 0 ? 'Cancel' : 'Previous'}
          </Button>

          <Button
            onClick={handleAnswer}
            disabled={selectedAnswer === null}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {currentQuestionIndex === filteredQuestions.length - 1 ? 'See Results' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// Helper component for skill level cards
function SkillCard({ label, level, color }: { label: string; level: number; color: string }) {
  const colors = {
    blue: 'from-blue-100 to-cyan-100 border-blue-300 text-blue-900',
    green: 'from-green-100 to-emerald-100 border-green-300 text-green-900',
    purple: 'from-purple-100 to-pink-100 border-purple-300 text-purple-900',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-4 border-2 text-center`}>
      <div className="text-sm font-semibold mb-1">{label}</div>
      <div className="text-3xl font-bold">{level}/10</div>
      <div className="mt-2 h-2 bg-white/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-current opacity-50"
          initial={{ width: 0 }}
          animate={{ width: `${level * 10}%` }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />
      </div>
    </div>
  );
}
