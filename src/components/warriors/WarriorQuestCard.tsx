/**
 * Warrior Quest Card Component
 * Displays current Warriors quest with weekly challenge structure
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Sword, 
  Calendar, 
  Trophy, 
  Zap, 
  BookOpen, 
  Brain, 
  FlaskConical,
  PenTool,
  Target 
} from 'lucide-react';
import type { WarriorQuestAssignment } from '@/lib/warriors-quest-service';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface WarriorQuestCardProps {
  quest: WarriorQuestAssignment;
  onChallengeClick?: (challengeId: string) => void;
}

const DAY_COLORS = {
  Monday: 'bg-blue-500/20 border-blue-500',
  Tuesday: 'bg-emerald-500/20 border-emerald-500',
  Wednesday: 'bg-purple-500/20 border-purple-500',
  Thursday: 'bg-orange-500/20 border-orange-500',
  Friday: 'bg-pink-500/20 border-pink-500',
};

const SUBJECT_ICONS = {
  Math: Brain,
  Reading: BookOpen,
  Writing: PenTool,
  STEAM: FlaskConical,
  'Executive Function': Target,
};

export default function WarriorQuestCard({ quest, onChallengeClick }: WarriorQuestCardProps) {
  const challengesCompleted = quest.challengesCompleted?.length || 0;
  const totalChallenges = quest.questData.challenges.length;
  const progressPercent = (challengesCompleted / totalChallenges) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/30 rounded-2xl p-8 shadow-xl"
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Sword className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">
              Week {quest.weekNumber}: {quest.questTitle}
            </h2>
          </div>
          <p className="text-slate-300">
            {quest.questData.handsOnProject.title}
          </p>
        </div>
        
        <Badge className="bg-purple-600 text-white">
          <Trophy className="w-4 h-4 mr-1" />
          {quest.xpEarned} / {quest.questData.totalXP} XP
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>{challengesCompleted} of {totalChallenges} challenges completed</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-3 bg-slate-700" />
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-3">
        {quest.questData.challenges.map((challenge, index) => {
          const isCompleted = quest.challengesCompleted?.includes(challenge.challengeId);
          const isCurrent = challengesCompleted === index && !isCompleted;
          const isLocked = challengesCompleted < index;
          
          const SubjectIcon = SUBJECT_ICONS[challenge.subject];

          return (
            <motion.div
              key={challenge.challengeId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !isLocked && onChallengeClick?.(challenge.challengeId)}
              className={`
                relative p-4 rounded-xl border-2 transition-all cursor-pointer
                ${isCompleted ? 'bg-green-900/20 border-green-500/50' : ''}
                ${isCurrent ? `${DAY_COLORS[challenge.dayOfWeek]} animate-pulse` : ''}
                ${isLocked ? 'bg-slate-800/50 border-slate-700 opacity-50 cursor-not-allowed' : ''}
                ${!isCompleted && !isCurrent && !isLocked ? 'bg-slate-800/80 border-slate-600 hover:border-purple-500/50' : ''}
              `}
            >
              <div className="flex items-center gap-4">
                {/* Day Badge */}
                <div className="flex-shrink-0 w-24 text-center">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">
                    {challenge.dayOfWeek}
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    Day {challenge.challengeNumber}
                  </div>
                </div>

                {/* Subject Icon */}
                <div className={`
                  flex-shrink-0 p-3 rounded-lg
                  ${isCompleted ? 'bg-green-600/30' : 'bg-slate-700/50'}
                `}>
                  <SubjectIcon className={`
                    w-6 h-6
                    ${isCompleted ? 'text-green-400' : 'text-slate-300'}
                  `} />
                </div>

                {/* Challenge Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-1">
                    {challenge.description}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    {challenge.estimatedMinutes} min
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-400 font-bold">
                      {challenge.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                {isCompleted && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-600 text-white">
                      ✓ Complete
                    </Badge>
                  </div>
                )}
                
                {isCurrent && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-purple-600 text-white animate-pulse">
                      ▶ Current
                    </Badge>
                  </div>
                )}

                {isLocked && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-slate-700 text-slate-400">
                      🔒 Locked
                    </Badge>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge Preview */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{quest.questData.badge.icon}</span>
          <div>
            <div className="text-sm text-slate-400">Complete to earn:</div>
            <div className="font-bold text-white">{quest.questData.badge.name}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
