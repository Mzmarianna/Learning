import { motion } from 'motion/react';
import { Level } from '@/lib/curriculum-data';
import { BookOpen, Target, ClipboardCheck, Award } from 'lucide-react';

interface LevelOverviewProps {
  level: Level;
  completedLessons?: number;
  totalRobuxEarned?: number;
}

export default function LevelOverview({ 
  level, 
  completedLessons = 0,
  totalRobuxEarned = 0 
}: LevelOverviewProps) {
  const progress = (completedLessons / level.lessons.length) * 100;
  const canRedeem = totalRobuxEarned >= level.redemptionThreshold;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-cyan-100 via-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl p-8"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm uppercase tracking-wide text-purple-600 font-semibold mb-2">
              {level.subject.toUpperCase()} • LEVEL {level.number}
            </div>
            <h1 className="text-4xl mb-3">{level.title}</h1>
            <p className="text-gray-700 text-lg max-w-3xl">
              {level.description}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-purple-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">{completedLessons}</div>
              <div className="text-sm text-muted-foreground">of {level.lessons.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Lessons</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
            <span className="text-sm font-semibold text-purple-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Three Column Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Learning Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-blue-900">Learning Objectives</h3>
          </div>
          <ul className="space-y-2">
            {level.learningObjectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2 text-blue-800">
                <span className="text-blue-400 mt-1">•</span>
                <span className="text-sm">{objective}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Assessment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-xl">
              <ClipboardCheck className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900">Assessment Methods</h3>
          </div>
          <ul className="space-y-2">
            {level.assessmentMethods.map((method, index) => (
              <li key={index} className="flex items-start gap-2 text-purple-800">
                <span className="text-purple-400 mt-1">•</span>
                <span className="text-sm">{method}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Rewards & Motivation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 border-2 border-green-200 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-xl">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-900">Rewards & Motivation</h3>
          </div>
          <ul className="space-y-2">
            {level.rewardFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-green-800">
                <span className="text-green-400 mt-1">•</span>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Robux Redemption Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`border-2 rounded-2xl p-6 ${
          canRedeem 
            ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300' 
            : 'bg-yellow-50 border-yellow-200'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${canRedeem ? 'bg-yellow-200 animate-pulse' : 'bg-yellow-100'}`}>
            <Award className={`w-8 h-8 ${canRedeem ? 'text-yellow-700' : 'text-yellow-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {canRedeem ? '🎉 Robux Ready to Redeem!' : '💰 Robux Reward System'}
            </h3>
            <p className="text-gray-700 mb-3">
              Each badge earned awards the student with <strong>100 Robux</strong>. Students can redeem 
              their rewards once they've accumulated <strong>{level.redemptionThreshold} Robux</strong> (equivalent 
              to earning {level.redemptionThreshold / 100} badges).
            </p>
            
            {/* Progress to redemption */}
            <div className="bg-white rounded-xl p-4 border-2 border-yellow-200 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Robux Progress</span>
                <span className="text-sm font-semibold text-yellow-600">
                  {totalRobuxEarned} / {level.redemptionThreshold}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
                  style={{ width: `${Math.min((totalRobuxEarned / level.redemptionThreshold) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {level.redemptionThreshold - totalRobuxEarned > 0 
                  ? `${level.redemptionThreshold - totalRobuxEarned} Robux until redemption` 
                  : 'Ready to redeem!'}
              </p>
            </div>

            <p className="text-sm text-gray-600">
              Redemption options include avatar accessories, game passes, and exclusive in-game items.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
