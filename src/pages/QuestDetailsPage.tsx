import { useNavigate, useParams } from 'react-router';
import { getQuestById } from '../lib/curriculum/explorers-hub-curriculum';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';

export default function QuestDetailsPage() {
  const navigate = useNavigate();
  const { questId } = useParams<{ questId: string }>();
  
  const quest = questId ? getQuestById(questId) : null;

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quest not found</h1>
          <button
            onClick={() => navigate('/quests')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg"
          >
            Back to Quests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button
              onClick={() => navigate('/dashboard/student')}
              className="hover:text-gray-900 flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => navigate('/quests')}
              className="hover:text-gray-900"
            >
              Quests
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{quest.theme}</span>
          </div>

          <button
            onClick={() => navigate('/quests')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quests
          </button>
          <div className="flex items-start gap-4">
            <span className="text-5xl">{quest.icon}</span>
            <div>
              <div className="text-sm text-purple-600 font-semibold mb-1">
                Week {quest.week} • {quest.focus}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {quest.theme}
              </h1>
              <p className="text-gray-600">{quest.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Quest Challenges ({quest.challenges.length})
        </h2>

        <div className="space-y-4">
          {quest.challenges.map((challenge, index) => (
            <motion.div
              key={challenge.challengeId}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg cursor-pointer transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/challenge/${challenge.challengeId}`)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{challenge.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {challenge.subject}
                    </span>
                    <span className="text-gray-600">
                      💎 {challenge.xpReward} XP
                    </span>
                    <span className="text-gray-600">
                      ⏱️ {challenge.estimatedTime}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700">
                    Start
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quest Completion Reward */}
        <motion.div
          className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-2">Quest Completion Reward</h3>
          <p className="mb-4">
            Complete all challenges to earn the <strong>{quest.badge?.name}</strong> badge!
          </p>
          <div className="flex items-center gap-3">
            <div className="text-4xl">{quest.badge?.icon}</div>
            <div>
              <div className="font-bold text-lg">{quest.badge?.name}</div>
              <div className="text-purple-100 text-sm">
                {quest.badge?.description}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}