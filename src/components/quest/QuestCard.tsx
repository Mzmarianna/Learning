import { motion } from 'motion/react';
import { Lock, CheckCircle2, Clock, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ExplorerQuest } from '../../lib/curriculum/explorers-hub-curriculum';

interface QuestCardProps {
  quest: ExplorerQuest;
  progress: number; // 0-100
  unlocked: boolean;
  completed: boolean;
  onSelect: () => void;
}

export default function QuestCard({
  quest,
  progress,
  unlocked,
  completed,
  onSelect,
}: QuestCardProps) {
  return (
    <motion.div
      whileHover={{ scale: unlocked ? 1.02 : 1 }}
      whileTap={{ scale: unlocked ? 0.98 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card
        className={`relative overflow-hidden border-4 transition-all ${
          unlocked
            ? 'border-purple-300 shadow-lg cursor-pointer hover:shadow-xl'
            : 'border-gray-300 opacity-60 cursor-not-allowed'
        } ${completed ? 'border-green-400' : ''}`}
        onClick={unlocked ? onSelect : undefined}
      >
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${quest.badge.color} opacity-10`}
        />

        {/* Content */}
        <div className="relative p-6">
          {/* Week Badge */}
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 rounded-full bg-white border-2 border-purple-300 flex items-center justify-center font-bold text-purple-700">
              W{quest.week}
            </div>
          </div>

          {/* Badge Icon */}
          <div className="mb-4">
            <motion.div
              className="text-7xl"
              animate={completed ? { rotate: [0, -10, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, repeat: completed ? Infinity : 0, repeatDelay: 3 }}
            >
              {quest.badge.icon}
            </motion.div>
          </div>

          {/* Quest Info */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">{quest.theme}</h3>
            
            <div
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${quest.badge.color} text-white`}
            >
              {quest.badge.name}
            </div>

            {/* Hands-On Project */}
            <div className="bg-white/80 rounded-xl p-4 border-2 border-cyan-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Hands-On Project
              </p>
              <p className="font-medium text-gray-900">{quest.handsOnProject.title}</p>
              <p className="text-sm text-gray-600 mt-1">{quest.handsOnProject.description}</p>
            </div>

            {/* Focus Areas */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-purple-50 rounded-lg p-2 text-center">
                <div className="font-semibold text-purple-700">🔬 STEAM</div>
                <div className="text-gray-600 mt-1">{quest.steamFocus.topic}</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="font-semibold text-blue-700">🔢 Math</div>
                <div className="text-gray-600 mt-1">{quest.mathFocus.topic}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <div className="font-semibold text-green-700">📝 Writing</div>
                <div className="text-gray-600 mt-1">{quest.readingWritingFocus.topic}</div>
              </div>
            </div>

            {/* Progress Bar */}
            {unlocked && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      completed
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>{quest.totalXP} XP</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>~{quest.handsOnProject.estimatedHours}h</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <span>📝 {quest.challenges.length} challenges</span>
              </div>
            </div>

            {/* Action Button */}
            {unlocked && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className={`w-full ${
                  completed
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                    : progress > 0
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
                }`}
                size="lg"
              >
                {completed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Quest Complete!
                  </>
                ) : progress > 0 ? (
                  <>Continue Quest</>
                ) : (
                  <>Start Quest</>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Completed Badge */}
        {completed && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="absolute top-4 left-4"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </motion.div>
        )}

        {/* Locked Overlay */}
        {!unlocked && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center text-white p-6">
              <Lock className="w-12 h-12 mx-auto mb-3" />
              <p className="font-semibold text-lg mb-1">Quest Locked</p>
              <p className="text-sm opacity-90">Complete previous quest to unlock</p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
