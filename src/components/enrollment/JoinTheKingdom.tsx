/**
 * Join the Kingdom - Genius Assessment
 * Not a "quiz" or "test" - it's claiming your throne in the Learning Kingdom
 * Circuit-board aesthetic, dark theme, empowering language
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, ArrowRight, ArrowLeft, Zap, Star, Award, Check } from 'lucide-react';
import { Button } from '../ui/button';
import {
  PLACEMENT_QUIZ_QUESTIONS,
  calculatePlacement,
  type QuizAnswer,
  type QuizQuestion,
  type PlacementResult,
} from '../../lib/placement-quiz';

interface JoinTheKingdomProps {
  studentName: string;
  onComplete: (result: PlacementResult) => void;
  onCancel?: () => void;
}

export default function JoinTheKingdom({ studentName, onComplete, onCancel }: JoinTheKingdomProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);

  const [filteredQuestions, setFilteredQuestions] = useState<QuizQuestion[]>([]);
  const [studentAge, setStudentAge] = useState<number | null>(null);

  useEffect(() => {
    setFilteredQuestions(PLACEMENT_QUIZ_QUESTIONS.slice(0, 10));
  }, []);

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

    if (currentQuestion.id === 'bg-1') {
      setStudentAge(parseInt(selectedAnswer as string));
    }

    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      const placementResult = calculatePlacement([...answers, newAnswer]);
      setResult(placementResult);
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        {/* Circuit Board Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-4xl w-full bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl overflow-hidden border-2 border-cyan-500/30"
        >
          {/* Header - Crown Reveal */}
          <div className="relative bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 p-12 text-center">
            <div className="absolute inset-0 bg-black/20" />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative"
            >
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/15 border-4 border-white/60 flex items-center justify-center">
                <Crown className="w-16 h-16 text-white" />
              </div>
            </motion.div>
            <h1 className="relative text-4xl font-bold mb-2">🎉 Welcome to the Kingdom!</h1>
            <p className="relative text-xl text-white/90">Your throne awaits, {studentName}</p>
          </div>

          {/* Results Content */}
          <div className="p-8 space-y-6">
            {/* Royal Tier Assignment */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <Crown className="w-12 h-12 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide">Your Royal Tier</h3>
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent capitalize">
                    {result.tier.replace('-', ' ')}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-lg">
                You're not "at grade level." You're at <strong className="text-cyan-400">GENIUS level</strong>.
                <br />
                Starting Quest: <strong className="text-purple-400">{result.recommendedStartQuest}</strong>
              </p>
            </div>

            {/* Genius Profile - Skill Levels */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Your Genius Profile
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <SkillMeter label="Math" level={result.mathLevel} color="cyan" />
                <SkillMeter label="Reading" level={result.readingLevel} color="purple" />
                <SkillMeter label="Writing" level={result.writingLevel} color="pink" />
              </div>
            </div>

            {/* Learning Style */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">🎨 Your Learning Superpower</h3>
              <div className="text-2xl font-bold capitalize text-white">{result.learningStyle} Learner</div>
              <p className="text-gray-400 mt-2">
                {result.learningStyle === 'visual' && 'You learn best by seeing. We\'ll use charts, videos, and visual maps.'}
                {result.learningStyle === 'kinesthetic' && 'You learn best by doing. We\'ll use hands-on building and movement.'}
                {result.learningStyle === 'auditory' && 'You learn best by listening. We\'ll use stories and discussions.'}
                {result.learningStyle === 'mixed' && 'You\'re a multi-modal genius! We\'ll use ALL the senses.'}
              </p>
            </div>

            {/* Genius Strengths */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Your Genius Strengths
              </h3>
              <div className="space-y-3">
                {result.strengths.map((strength, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 bg-green-500/5 rounded-lg p-3"
                  >
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white">{strength}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Kingdom Support - Reframed "Growth Areas" */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                How the Kingdom Will Support You
              </h3>
              <div className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-start gap-3 bg-cyan-500/5 rounded-lg p-3"
                  >
                    <Award className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{rec}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Neurodivergent Supports (if applicable) */}
            {result.neurodivergentSupports.length > 0 && (
              <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-pink-400 mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Your Genius Brain Gets These Special Powers
                </h3>
                <div className="space-y-2">
                  {result.neurodivergentSupports.map((support, i) => (
                    <div key={i} className="flex items-start gap-2 text-gray-300">
                      <Zap className="w-4 h-4 text-pink-400 flex-shrink-0 mt-1" />
                      <span>{support}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA - Enter Kingdom */}
            <Button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white text-xl py-8 rounded-2xl font-bold shadow-2xl"
            >
              <Crown className="w-6 h-6 mr-3" />
              Enter Your Kingdom & Start Learning
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <p className="text-center text-gray-400 text-sm">
              Your first quest is ready. Wowl is waiting to meet you. 🦉
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Circuit Board Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-3xl w-full bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl overflow-hidden border-2 border-cyan-500/30"
      >
        {/* Progress Bar - Circuit Style */}
        <div className="h-3 bg-gray-800 relative overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-pulse" />
          </motion.div>
        </div>

        {/* Header */}
        <div className="p-8 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center font-bold text-xl">
                {currentQuestionIndex + 1}
              </div>
              <div>
                <p className="text-sm text-cyan-400 font-semibold">
                  Unlocking Your Genius Profile
                </p>
                <p className="text-xs text-gray-500">
                  {currentQuestionIndex + 1} of {filteredQuestions.length}
                </p>
              </div>
            </div>
            <div className="text-sm font-medium text-purple-400 capitalize">
              {currentQuestion.category}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">{currentQuestion.question}</h2>
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
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                    selectedAnswer === option
                      ? 'border-cyan-500 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 shadow-lg shadow-cyan-500/20'
                      : 'border-gray-700 bg-gray-800/50 hover:border-cyan-500/50 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedAnswer === option ? 'border-cyan-500 bg-cyan-500' : 'border-gray-600'
                      }`}
                    >
                      {selectedAnswer === option && <Check className="w-4 h-4 text-black" />}
                    </div>
                    <span
                      className={`text-lg ${
                        selectedAnswer === option ? 'font-semibold text-cyan-300' : 'text-gray-300'
                      }`}
                    >
                      {option}
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="p-8 border-t border-gray-800 flex items-center justify-between gap-4">
          <Button
            onClick={currentQuestionIndex === 0 ? onCancel : handlePrevious}
            variant="outline"
            className="flex items-center gap-2 border-gray-700 text-gray-300 hover:bg-gray-800"
            disabled={currentQuestionIndex === 0 && !onCancel}
          >
            <ArrowLeft className="w-4 h-4" />
            {currentQuestionIndex === 0 ? 'Cancel' : 'Previous'}
          </Button>

          <Button
            onClick={handleAnswer}
            disabled={selectedAnswer === null}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === filteredQuestions.length - 1 ? 'Claim Your Throne' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// Helper component - Circuit-themed skill meter
function SkillMeter({ label, level, color }: { label: string; level: number; color: string }) {
  const colors = {
    cyan: {
      bg: 'from-cyan-500/10 to-cyan-500/5',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      bar: 'bg-gradient-to-r from-cyan-500 to-cyan-400',
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-500/5',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      bar: 'bg-gradient-to-r from-purple-500 to-purple-400',
    },
    pink: {
      bg: 'from-pink-500/10 to-pink-500/5',
      border: 'border-pink-500/30',
      text: 'text-pink-400',
      bar: 'bg-gradient-to-r from-pink-500 to-pink-400',
    },
  };

  const theme = colors[color];

  return (
    <div className={`bg-gradient-to-br ${theme.bg} border ${theme.border} rounded-xl p-4`}>
      <div className={`text-sm font-semibold mb-2 ${theme.text}`}>{label}</div>
      <div className={`text-3xl font-bold mb-3 ${theme.text}`}>{level}/10</div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${theme.bar} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${level * 10}%` }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
