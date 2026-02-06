import { motion } from 'motion/react';
import { CheckCircle2, Lock, Clock, Zap, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ExplorerChallenge } from '../../lib/curriculum/explorers-hub-curriculum';

interface ChallengeCardProps {
  challenge: ExplorerChallenge;
  unlocked: boolean;
  completed: boolean;
  masteryLevel?: 'emerging' | 'developing' | 'proficient' | 'advanced' | 'mastered';
  xpEarned?: number;
  onStart: () => void;
}

const SUBJECT_COLORS = {
  STEAM: 'from-purple-500 to-indigo-500',
  Math: 'from-blue-500 to-cyan-500',
  Reading: 'from-green-500 to-emerald-500',
  Writing: 'from-orange-500 to-amber-500',
  Project: 'from-pink-500 to-rose-500',
};

const SUBJECT_ICONS = {
  STEAM: '🔬',
  Math: '🔢',
  Reading: '📖',
  Writing: '✍️',
  Project: '🎨',
};

const MASTERY_ICONS = {
  emerging: '🌱',
  developing: '🌿',
  proficient: '✅',
  advanced: '⭐',
  mastered: '🏆',
};

export default function ChallengeCard({
  challenge,
  unlocked,
  completed,
  masteryLevel,
  xpEarned,
  onStart,
}: ChallengeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: unlocked ? 1.02 : 1 }}
    >
      <Card
        className={`relative overflow-hidden border-2 transition-all ${
          unlocked
            ? completed
              ? 'border-green-300 bg-green-50/50'
              : 'border-purple-300 hover:border-purple-400 hover:shadow-md cursor-pointer'
            : 'border-gray-300 opacity-60'
        }`}
        onClick={unlocked && !completed ? onStart : undefined}
      >
        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              {/* Challenge Number */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                {challenge.challengeNumber}
              </div>

              {/* Title & Subject */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{SUBJECT_ICONS[challenge.subject]}</span>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold text-white bg-gradient-to-r ${SUBJECT_COLORS[challenge.subject]}`}
                  >
                    {challenge.subject}
                  </span>
                </div>
                <h4 className="font-bold text-lg text-gray-900">{challenge.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
              </div>
            </div>

            {/* Completed Check */}
            {completed && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.5 }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Mastery Level (if completed) */}
          {completed && masteryLevel && (
            <div className="mb-3 p-3 bg-white rounded-lg border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{MASTERY_ICONS[masteryLevel]}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase">Mastery Level</p>
                    <p className="font-bold text-green-700 capitalize">{masteryLevel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-600 uppercase">XP Earned</p>
                  <p className="font-bold text-purple-700">{xpEarned} XP</p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions Preview */}
          {unlocked && !completed && (
            <div className="mb-3 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
              <p className="text-xs font-semibold text-cyan-900 uppercase mb-2">
                What You'll Do:
              </p>
              <ul className="text-sm text-cyan-800 space-y-1">
                {challenge.instructions.slice(0, 3).map((instruction, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-600 mt-0.5">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
                {challenge.instructions.length > 3 && (
                  <li className="text-cyan-600 font-medium">
                    + {challenge.instructions.length - 3} more steps
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Materials (if any) */}
          {unlocked && !completed && challenge.materials && challenge.materials.length > 0 && (
            <div className="mb-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs font-semibold text-amber-900 uppercase mb-2">
                Materials Needed:
              </p>
              <div className="flex flex-wrap gap-2">
                {challenge.materials.map((material, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white rounded-md text-xs font-medium text-amber-800 border border-amber-200"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>{challenge.xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>~{challenge.estimatedMinutes}min</span>
              </div>
            </div>

            {/* Action Button */}
            {unlocked && !completed && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onStart();
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Start Challenge
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            {completed && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onStart();
                }}
                variant="outline"
                className="border-green-500 text-green-700 hover:bg-green-50"
              >
                View Details
              </Button>
            )}
          </div>
        </div>

        {/* Locked Overlay */}
        {!unlocked && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <Lock className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold text-sm">Complete previous challenge</p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
