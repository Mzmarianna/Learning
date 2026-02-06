import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Zap, Clock, CheckCircle2, Target } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import ChallengeCard from './ChallengeCard';
import { ExplorerQuest } from '../../lib/curriculum/explorers-hub-curriculum';

interface QuestDetailsProps {
  quest: ExplorerQuest;
  completedChallenges: string[]; // Array of completed challenge IDs
  currentChallenge?: string; // Current challenge ID
  onBack: () => void;
  onStartChallenge: (challengeId: string) => void;
}

export default function QuestDetails({
  quest,
  completedChallenges,
  currentChallenge,
  onBack,
  onStartChallenge,
}: QuestDetailsProps) {
  const [activeTab, setActiveTab] = useState<'challenges' | 'project' | 'standards'>('challenges');

  const completedCount = quest.challenges.filter(c =>
    completedChallenges.includes(c.challengeId)
  ).length;
  const progress = (completedCount / quest.challenges.length) * 100;
  const isQuestComplete = completedCount === quest.challenges.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-4 border-2 border-purple-300 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quests
          </Button>

          <Card className="p-8 border-4 border-purple-300 bg-white">
            {/* Week & Badge */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                {/* Badge Icon */}
                <motion.div
                  className="text-8xl"
                  animate={isQuestComplete ? { rotate: [0, -10, 10, -10, 0] } : {}}
                  transition={{ duration: 0.6, repeat: isQuestComplete ? Infinity : 0, repeatDelay: 2 }}
                >
                  {quest.badge.icon}
                </motion.div>

                {/* Quest Info */}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-purple-600 uppercase mb-1">
                    Week {quest.week} Quest
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{quest.theme}</h1>
                  <div
                    className={`inline-block px-6 py-2 rounded-full text-lg font-semibold bg-gradient-to-r ${quest.badge.color} text-white`}
                  >
                    {quest.badge.name}
                  </div>
                </div>
              </div>

              {/* Quest Complete Badge */}
              {isQuestComplete && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-xl mb-2">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-sm font-bold text-green-700">COMPLETE!</p>
                </motion.div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <span>Quest Progress</span>
                <span>
                  {completedCount} / {quest.challenges.length} Challenges ({Math.round(progress)}%)
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    isQuestComplete
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border-2 border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">Total XP</span>
                </div>
                <p className="text-2xl font-bold text-yellow-700">{quest.totalXP}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">Est. Time</span>
                </div>
                <p className="text-2xl font-bold text-blue-700">{quest.handsOnProject.estimatedHours}h</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">Challenges</span>
                </div>
                <p className="text-2xl font-bold text-purple-700">{quest.challenges.length}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">Completed</span>
                </div>
                <p className="text-2xl font-bold text-green-700">{completedCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-6 py-3 rounded-t-xl font-semibold transition-colors ${
                activeTab === 'challenges'
                  ? 'bg-white text-purple-700 border-t-4 border-x-4 border-purple-500'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              📝 Challenges
            </button>
            <button
              onClick={() => setActiveTab('project')}
              className={`px-6 py-3 rounded-t-xl font-semibold transition-colors ${
                activeTab === 'project'
                  ? 'bg-white text-purple-700 border-t-4 border-x-4 border-purple-500'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              🎨 Hands-On Project
            </button>
            <button
              onClick={() => setActiveTab('standards')}
              className={`px-6 py-3 rounded-t-xl font-semibold transition-colors ${
                activeTab === 'standards'
                  ? 'bg-white text-purple-700 border-t-4 border-x-4 border-purple-500'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              📚 Learning Goals
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {quest.challenges.map((challenge, idx) => {
                const isCompleted = completedChallenges.includes(challenge.challengeId);
                const isUnlocked = idx === 0 || completedChallenges.includes(quest.challenges[idx - 1]?.challengeId);
                
                return (
                  <ChallengeCard
                    key={challenge.challengeId}
                    challenge={challenge}
                    unlocked={isUnlocked}
                    completed={isCompleted}
                    onStart={() => onStartChallenge(challenge.challengeId)}
                  />
                );
              })}
            </motion.div>
          )}

          {activeTab === 'project' && (
            <motion.div
              key="project"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 border-4 border-pink-300 bg-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {quest.handsOnProject.title}
                </h2>
                <p className="text-lg text-gray-700 mb-6">{quest.handsOnProject.description}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                    <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <span className="text-2xl">⏱️</span>
                      Estimated Time
                    </h3>
                    <p className="text-3xl font-bold text-purple-700">
                      {quest.handsOnProject.estimatedHours} hours
                    </p>
                    <p className="text-sm text-purple-600 mt-2">
                      Work at your own pace throughout the week
                    </p>
                  </div>

                  <div className="bg-cyan-50 rounded-xl p-6 border-2 border-cyan-200">
                    <h3 className="font-bold text-cyan-900 mb-3 flex items-center gap-2">
                      <span className="text-2xl">📤</span>
                      Submission Type
                    </h3>
                    <p className="text-2xl font-bold text-cyan-700 capitalize">
                      {quest.handsOnProject.submissionType}
                    </p>
                    <p className="text-sm text-cyan-600 mt-2">
                      You'll submit your project to Wowl for review
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                  <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    What You'll Learn
                  </h3>
                  <p className="text-amber-800">
                    This hands-on project brings together everything you learn in this week's challenges.
                    You'll apply your knowledge of {quest.steamFocus.topic}, {quest.mathFocus.topic},
                    and {quest.readingWritingFocus.topic} to create something real!
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'standards' && (
            <motion.div
              key="standards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* STEAM */}
              <Card className="p-6 border-4 border-purple-300 bg-white">
                <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <span className="text-3xl">🔬</span>
                  STEAM Focus
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase">Topic</p>
                    <p className="text-lg font-medium text-gray-900">{quest.steamFocus.topic}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Key Concepts</p>
                    <div className="flex flex-wrap gap-2">
                      {quest.steamFocus.concepts.map((concept, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Math */}
              <Card className="p-6 border-4 border-blue-300 bg-white">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <span className="text-3xl">🔢</span>
                  Math Focus
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase">Topic</p>
                    <p className="text-lg font-medium text-gray-900">{quest.mathFocus.topic}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
                      Common Core Standards
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quest.mathFocus.ccssStandards.map((standard, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-mono"
                        >
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase">Grade Level</p>
                    <p className="text-lg font-medium text-gray-900">Grade {quest.mathFocus.gradeLevel}</p>
                  </div>
                </div>
              </Card>

              {/* Reading & Writing */}
              <Card className="p-6 border-4 border-green-300 bg-white">
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <span className="text-3xl">📝</span>
                  Reading & Writing Focus
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase">Topic</p>
                    <p className="text-lg font-medium text-gray-900">{quest.readingWritingFocus.topic}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase">Genre</p>
                    <p className="text-lg font-medium text-gray-900">{quest.readingWritingFocus.genre}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
                      Common Core Standards
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quest.readingWritingFocus.ccssStandards.map((standard, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-mono"
                        >
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase">Grade Level</p>
                    <p className="text-lg font-medium text-gray-900">
                      Grade {quest.readingWritingFocus.gradeLevel}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
