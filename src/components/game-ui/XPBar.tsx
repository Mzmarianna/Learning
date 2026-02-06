import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  animated?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function XPBar({
  currentXP,
  maxXP,
  level,
  animated = true,
  showLabel = true,
  size = 'md',
}: XPBarProps) {
  const percentage = Math.min((currentXP / maxXP) * 100, 100);

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
              <Zap className="size-4 text-yellow-300" fill="currentColor" />
              <span className={`${textSizes[size]} font-bold text-white`} style={{ fontFamily: 'var(--font-xp)' }}>
                LEVEL {level}
              </span>
            </div>
          </div>
          <span className={`${textSizes[size]} font-semibold text-purple-600`} style={{ fontFamily: 'var(--font-xp)' }}>
            {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
          </span>
        </div>
      )}

      {/* XP Bar */}
      <div className={`relative ${heights[size]} bg-purple-100 rounded-full overflow-hidden border-2 border-purple-300 shadow-inner`}>
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/50 via-purple-200/50 to-pink-200/50 animate-pulse" />

        {/* Progress Fill */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 1, ease: 'easeOut' } : { duration: 0 }}
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </motion.div>

        {/* Sparkles */}
        {percentage > 10 && (
          <motion.div
            className="absolute inset-y-0 left-0 flex items-center"
            style={{ left: `${Math.max(percentage - 5, 5)}%` }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="size-1 bg-yellow-300 rounded-full shadow-lg" />
          </motion.div>
        )}
      </div>

      {/* Level Up Indicator */}
      {percentage >= 100 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="text-center"
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full text-sm shadow-lg animate-bounce">
            🎉 READY TO LEVEL UP! 🎉
          </span>
        </motion.div>
      )}
    </div>
  );
}

// Keyframe for shimmer effect
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;

// Inject keyframes (do this once in your app)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}
