import { useNavigate } from 'react-router';
import { EXPLORERS_HUB_CURRICULUM } from '../lib/curriculum/explorers-hub-curriculum';
import { motion } from 'motion/react';
import { Lock, CheckCircle, ArrowLeft, Trophy } from 'lucide-react';

export default function QuestsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🦉</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Explorers Hub Quests
              </h1>
              <p className="text-gray-600">Choose your next adventure!</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/student')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
        </div>
      </div>

      {/* Quests Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXPLORERS_HUB_CURRICULUM.map((quest, index) => {
            const isUnlocked = index === 0; // For now, only first quest unlocked
            const isCompleted = false; // TODO: Check from database

            return (
              <motion.div
                key={quest.questId}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                  isUnlocked ? 'cursor-pointer hover:shadow-xl' : 'opacity-60'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => isUnlocked && navigate(`/quest/${quest.questId}`)}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-semibold mb-1">
                        Week {quest.week}
                      </div>
                      <h3 className="text-xl font-bold">{quest.theme}</h3>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-6 h-6 text-green-300" />
                    )}
                    {!isUnlocked && <Lock className="w-6 h-6 text-white/60" />}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{quest.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="font-semibold">
                        {quest.challenges.length} Challenges
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span>🎯 Focus: {quest.focus}</span>
                    </div>
                  </div>

                  {/* Progress Bar (if started) */}
                  {isUnlocked && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-purple-600">0%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: '0%' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {isUnlocked ? (
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                      {isCompleted ? 'Review Quest' : 'Start Quest'}
                    </button>
                  ) : (
                    <div className="w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-lg text-center">
                      Complete Previous Quest
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}