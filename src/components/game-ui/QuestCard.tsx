import { motion } from 'motion/react';
import { MapPin, Clock, Trophy, Star, Lock, CheckCircle2, Zap } from 'lucide-react';
import { GameButton } from './GameButton';

interface QuestCardProps {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  xpReward: number;
  estimatedTime?: string;
  challengesTotal?: number;
  challengesCompleted?: number;
  isLocked?: boolean;
  isCompleted?: boolean;
  progress?: number;
  imageUrl?: string;
  onClick?: () => void;
}

export function QuestCard({
  title,
  description,
  difficulty,
  xpReward,
  estimatedTime,
  challengesTotal,
  challengesCompleted = 0,
  isLocked = false,
  isCompleted = false,
  progress = 0,
  imageUrl,
  onClick,
}: QuestCardProps) {
  const difficultyColors = {
    beginner: { bg: 'from-green-500 to-emerald-600', text: 'text-green-600', badge: 'bg-green-100 text-green-700' },
    intermediate: { bg: 'from-cyan-500 to-blue-600', text: 'text-cyan-600', badge: 'bg-cyan-100 text-cyan-700' },
    advanced: { bg: 'from-purple-500 to-pink-600', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
    expert: { bg: 'from-orange-500 to-red-600', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
  };

  const colors = difficultyColors[difficulty];

  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1 : 1.02, y: isLocked ? 0 : -5 }}
      whileTap={isLocked ? {} : { scale: 0.98 }}
      className={`
        relative bg-white rounded-3xl overflow-hidden shadow-xl border-4
        ${isLocked ? 'border-gray-300 opacity-60' : isCompleted ? 'border-green-400' : 'border-purple-200 hover:border-purple-400'}
        transform transition-all duration-300
        ${onClick && !isLocked ? 'cursor-pointer' : ''}
      `}
      onClick={isLocked ? undefined : onClick}
    >
      {/* Image Header */}
      {imageUrl && (
        <div className="relative h-40 overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-t ${colors.bg} opacity-40`} />
          
          {/* Difficulty Badge */}
          <div className={`absolute top-3 left-3 px-3 py-1 ${colors.badge} rounded-full text-xs font-bold uppercase`}>
            {difficulty}
          </div>

          {/* Lock or Complete Indicator */}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <Lock className="size-12 text-white" />
            </div>
          )}

          {isCompleted && (
            <div className="absolute top-3 right-3 bg-green-500 text-white p-2 rounded-full shadow-lg">
              <CheckCircle2 className="size-6" fill="currentColor" />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-2xl font-bold text-purple-900" style={{ fontFamily: 'var(--font-title)' }}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm">
          {/* XP Reward */}
          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-bold shadow-md">
            <Zap className="size-4" fill="currentColor" />
            <span style={{ fontFamily: 'var(--font-xp)' }}>{xpReward} XP</span>
          </div>

          {/* Estimated Time */}
          {estimatedTime && (
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="size-4" />
              <span>{estimatedTime}</span>
            </div>
          )}

          {/* Challenges */}
          {challengesTotal !== undefined && (
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="size-4" />
              <span>{challengesCompleted}/{challengesTotal} Challenges</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!isLocked && !isCompleted && progress > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium">Progress</span>
              <span className="text-purple-600 font-bold" style={{ fontFamily: 'var(--font-xp)' }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${colors.bg} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isLocked && (
          <GameButton
            variant={isCompleted ? 'success' : 'primary'}
            size="md"
            icon={isCompleted ? Trophy : Star}
            className="w-full"
            onClick={onClick}
          >
            {isCompleted ? 'Review Quest' : progress > 0 ? 'Continue Quest' : 'Start Quest'}
          </GameButton>
        )}

        {isLocked && (
          <div className="text-center py-3 text-gray-500 font-medium">
            🔒 Complete previous quests to unlock
          </div>
        )}
      </div>
    </motion.div>
  );
}
