/**
 * Placement Quiz Results Page
 * Shows tier recommendation and drives to subscription
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Trophy, Star, TrendingUp, Check, ArrowRight, CreditCard, Download, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { completeQuiz, getQuizAttempt, type QuizAttempt } from '../lib/quiz/placement-quiz';

export default function PlacementResultsPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!attemptId) return;
    loadResults();
  }, [attemptId]);

  const loadResults = async () => {
    if (!attemptId) return;

    // Check if already completed
    let existingAttempt = await getQuizAttempt(attemptId);
    
    if (!existingAttempt?.completed_at) {
      // Complete the quiz
      const completionResult = await completeQuiz(attemptId);
      setResults(completionResult);
      
      // Reload attempt
      existingAttempt = await getQuizAttempt(attemptId);
    }

    setAttempt(existingAttempt);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Trophy className="w-16 h-16 text-purple-600" />
        </motion.div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Results Not Found</h1>
          <Button onClick={() => navigate('/placement-quiz')}>
            Take Quiz Again
          </Button>
        </Card>
      </div>
    );
  }

  const tierInfo = {
    early_explorers: {
      name: 'Early Explorers',
      emoji: '🌟',
      color: 'purple',
      description: 'PreK-2nd grade competencies',
      features: [
        'Letter sounds and beginning reading',
        'Counting and basic addition/subtraction',
        'Simple patterns and shapes',
        'Story comprehension',
        'Hands-on learning activities'
      ],
      nextSteps: 'Focus on building foundational skills through play and exploration!'
    },
    explorers: {
      name: 'Explorers',
      emoji: '🚀',
      color: 'teal',
      description: '3rd-5th grade competencies',
      features: [
        'Advanced reading comprehension',
        'Multiplication, division, and fractions',
        'Problem-solving strategies',
        'Writing paragraphs and essays',
        'Scientific inquiry and experiments'
      ],
      nextSteps: 'Ready for deeper learning with engaging projects and real-world challenges!'
    },
    warriors: {
      name: 'Warriors',
      emoji: '⚔️',
      color: 'slate',
      description: '6th-8th grade competencies',
      features: [
        'Literary analysis and critical reading',
        'Pre-algebra and algebra concepts',
        'Advanced problem-solving',
        'Persuasive and analytical writing',
        'Complex scientific concepts'
      ],
      nextSteps: 'Tackle advanced topics with mature, non-babyish presentation!'
    }
  };

  const tier = tierInfo[attempt.recommended_tier || 'early_explorers'];
  const colorClasses = {
    purple: 'from-purple-600 to-pink-600',
    teal: 'from-teal-600 to-cyan-600',
    slate: 'from-slate-700 to-gray-800'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            className="inline-block text-8xl mb-4"
          >
            {tier.emoji}
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {attempt.student_name} is ready for
          </h1>
          <div className={`text-5xl font-bold bg-gradient-to-r ${colorClasses[tier.color as keyof typeof colorClasses]} bg-clip-text text-transparent`}>
            {tier.name}!
          </div>
          <p className="text-xl text-gray-700 mt-2">{tier.description}</p>
        </motion.div>

        {/* Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Performance</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* Reading Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">📚 Reading</span>
                  <span className="text-purple-600 font-bold">{Math.round(attempt.reading_score || 0)}%</span>
                </div>
                <Progress value={attempt.reading_score || 0} className="h-2" />
              </div>

              {/* Math Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">🔢 Math</span>
                  <span className="text-green-600 font-bold">{Math.round(attempt.math_score || 0)}%</span>
                </div>
                <Progress value={attempt.math_score || 0} className="h-2" />
              </div>

              {/* Critical Thinking */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">🧠 Thinking</span>
                  <span className="text-blue-600 font-bold">{Math.round(attempt.critical_thinking_score || 0)}%</span>
                </div>
                <Progress value={attempt.critical_thinking_score || 0} className="h-2" />
              </div>
            </div>

            {/* Overall */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">Overall Accuracy</span>
                <span className="text-3xl font-bold text-teal-600">
                  {Math.round(attempt.accuracy_percentage || 0)}%
                </span>
              </div>
              <p className="text-gray-600 mt-2">
                {attempt.correct_answers} out of {attempt.total_questions_answered} questions correct
              </p>
            </div>
          </Card>
        </motion.div>

        {/* What This Means */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What {tier.name} Means
            </h2>
            <p className="text-gray-700 mb-4">{tier.nextSteps}</p>
            
            <h3 className="font-bold text-gray-900 mb-3">Learning Focus Areas:</h3>
            <ul className="space-y-2">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Why Mz. Marianna's Academy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 mb-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Mz. Marianna's Academy is Perfect for {attempt.student_name}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Neurodivergent-First Design</h3>
                  <p className="text-sm text-gray-700">Built specifically for ADHD, autistic, and dyslexic learners</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Skill-Based Progression</h3>
                  <p className="text-sm text-gray-700">Learn at your own pace based on ability, not age</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Trophy className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Gamified Quests</h3>
                  <p className="text-sm text-gray-700">Transform learning into exciting adventures with XP and badges</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Check className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Roblox Integration</h3>
                  <p className="text-sm text-gray-700">Learn through approved educational Roblox games</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA: Subscribe Now */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <h2 className="text-3xl font-bold mb-2">
              Ready to Start Learning?
            </h2>
            <p className="text-xl mb-6 text-purple-100">
              Subscribe now and unlock {attempt.student_name}'s personalized learning journey!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = `https://yourstore.myshopify.com/products/explorer-plan?student=${attempt.student_name}&tier=${attempt.recommended_tier}`}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Subscribe Now - $29/month
              </Button>

              {attempt.parent_email && (
                <Button
                  onClick={() => alert('Results sent to ' + attempt.parent_email)}
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Me Results
                </Button>
              )}
            </div>

            <p className="text-sm text-purple-100 mt-4">
              No credit card required to view results • 30-day money-back guarantee
            </p>
          </Card>
        </motion.div>

        {/* Footer Actions */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate('/placement-quiz')}
            variant="outline"
            className="mr-4"
          >
            Take Quiz Again
          </Button>
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
          >
            Already Have Account? Log In
          </Button>
        </div>
      </div>
    </div>
  );
}