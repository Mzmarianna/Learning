import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Download, Calendar, Mail, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { QuizResults } from './PlacementQuiz';

interface QuizResultsPageProps {
  results: QuizResults;
  onScheduleAssessment: () => void;
  onEnrollNow: () => void;
  onCreateAccount?: () => void; // NEW: Create account to get quest
}

export default function QuizResultsPage({ 
  results, 
  onScheduleAssessment,
  onEnrollNow,
  onCreateAccount
}: QuizResultsPageProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-cyan-500 to-blue-500';
    if (score >= 40) return 'from-amber-500 to-orange-500';
    return 'from-pink-500 to-purple-500';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent work! Your child is ahead of their grade level.';
    if (score >= 60) return 'Great job! Your child is at grade level with room to grow.';
    if (score >= 40) return 'Good start! We\'ll help strengthen their foundation.';
    return 'We\'re here to help! Every learner starts somewhere, and we\'ll meet them right where they are.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-white rounded-full p-6 mb-6 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            🎉 Assessment Complete!
          </h1>
          <p className="text-xl text-gray-600">
            Great job, {results.childName}! Check your email at{' '}
            <strong className="text-purple-600">{results.email}</strong>
          </p>
        </motion.div>

        {/* Results Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-purple-200 mb-8"
        >
          {/* Score Display */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#E9D5FF"
                  strokeWidth="16"
                  fill="none"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - results.score / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent"
                >
                  {results.score}%
                </motion.span>
                <span className="text-gray-600 font-semibold">Score</span>
              </div>
            </div>
            <p className="text-xl text-gray-700 mt-6 max-w-2xl mx-auto">
              {getScoreMessage(results.score)}
            </p>
          </div>

          {/* Grade Level & Subject */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl p-6 text-center">
              <p className="text-sm font-semibold text-purple-700 mb-2">RECOMMENDED LEVEL</p>
              <p className="text-4xl font-bold text-purple-900">
                {results.estimatedGrade === 'K' ? 'Kindergarten' : `Grade ${results.estimatedGrade}`}
              </p>
            </div>
            <div className="bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-cyan-300 rounded-2xl p-6 text-center">
              <p className="text-sm font-semibold text-cyan-700 mb-2">FOCUS SUBJECT</p>
              <p className="text-4xl font-bold text-cyan-900 capitalize">
                {results.subject === 'reading' && '📖 '}
                {results.subject === 'math' && '🔢 '}
                {results.subject === 'spelling' && '✏️ '}
                {results.subject}
              </p>
            </div>
          </div>

          {/* Strengths & Growth Areas */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-6 h-6" />
                Strengths
              </h3>
              <ul className="space-y-3">
                {results.strengths.map((strength, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + idx * 0.1 }}
                    className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                      ✓
                    </div>
                    <span className="text-gray-800 font-medium">{strength}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-700">
                <ArrowRight className="w-6 h-6" />
                Areas for Growth
              </h3>
              <ul className="space-y-3">
                {results.areasForGrowth.map((area, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + idx * 0.1 }}
                    className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-xl p-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                      →
                    </div>
                    <span className="text-gray-800 font-medium">{area}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Wowl's Personalized Message */}
          <div className="bg-gradient-to-br from-cyan-100 via-purple-100 to-pink-100 border-4 border-purple-300 rounded-3xl p-8">
            <div className="flex items-start gap-4">
              <div className="text-6xl">🦉</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-purple-900">
                  Wowl's Message for {results.childName}
                </h3>
                <p className="text-lg text-gray-800 leading-relaxed mb-4">
                  Hey {results.childName}! You did an amazing job on the quiz! I can't wait to be your learning buddy. 
                  I've created a special learning path just for you that will make {results.subject} fun and easy. 
                  We'll start with things you're great at and gently work on the tricky parts together. 
                  Remember: Every expert was once a beginner, and you're already on your way! 🚀
                </p>
                <p className="text-purple-700 font-semibold">
                  - Wowl the Owl 🦉
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-cyan-200"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            🎯 Your Next Steps
          </h2>

          <div className="space-y-6 mb-8">
            {/* NEW: Create Account Option */}
            {onCreateAccount && (
              <div className="flex items-start gap-4 bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-300 rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                  ⚡
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-green-900">Try It FREE Right Now!</h3>
                  <p className="text-gray-700 mb-4">
                    Create a free account and we'll automatically assign {results.childName}'s first personalized quest. Start learning today!
                  </p>
                  <Button
                    onClick={onCreateAccount}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Free Account & Get First Quest!
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    No credit card required • Start learning in 60 seconds
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4 bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Check Your Email</h3>
                <p className="text-gray-700">
                  We've sent your full results and personalized recommendations to{' '}
                  <strong>{results.email}</strong>
                </p>
              </div>
              <Mail className="w-8 h-8 text-cyan-600" />
            </div>

            <div className="flex items-start gap-4 bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Schedule Your FREE 30-Minute Assessment</h3>
                <p className="text-gray-700 mb-4">
                  Meet with one of our expert tutors to create {results.childName}'s personalized learning plan
                </p>
                <Button
                  onClick={onScheduleAssessment}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Now (FREE)
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-pink-50 border-2 border-pink-200 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Or Jump Right In!</h3>
                <p className="text-gray-700 mb-4">
                  Ready to start today? Choose your package and get instant access to Wowl and the platform
                </p>
                <Button
                  onClick={onEnrollNow}
                  size="lg"
                  className="bg-gradient-to-r from-pink-600 to-cyan-600 text-white"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Enroll Now
                </Button>
              </div>
            </div>
          </div>

          {/* Download Results */}
          <div className="text-center pt-6 border-t-2 border-gray-200">
            <Button variant="outline" size="lg" className="border-2 border-purple-300">
              <Download className="w-5 h-5 mr-2" />
              Download Full Report (PDF)
            </Button>
          </div>
        </motion.div>

        {/* Trust Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 space-y-4"
        >
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>98% Parent Satisfaction</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>ESA Accepted</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Money-Back Guarantee</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}