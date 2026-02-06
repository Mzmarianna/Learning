import { motion } from 'motion/react';
import { Crown, Star, Zap, Trophy, Sparkles } from 'lucide-react';

interface LevelBadgeProps {
  level: number;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showGlow?: boolean;
}

export function LevelBadge({
  level,
  title,
  size = 'md',
  animated = true,
  showGlow = true,
}: LevelBadgeProps) {
  const sizes = {
    sm: { container: 'size-12', text: 'text-sm', icon: 'size-3' },
    md: { container: 'size-16', text: 'text-lg', icon: 'size-4' },
    lg: { container: 'size-20', text: 'text-2xl', icon: 'size-5' },
    xl: { container: 'size-24', text: 'text-3xl', icon: 'size-6' },
  };

  const levelIcon = getLevelIcon(level);

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className="relative"
        initial={animated ? { scale: 0, rotate: -180 } : {}}
        animate={{ scale: 1, rotate: 0 }}
        transition={animated ? { type: 'spring', stiffness: 200, damping: 15 } : {}}
      >
        {/* Glow Effect */}
        {showGlow && (
          <div className={`absolute inset-0 ${sizes[size].container} bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse`} />
        )}

        {/* Badge Container */}
        <div
          className={`
            ${sizes[size].container}
            relative
            bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500
            rounded-full
            shadow-2xl
            border-4 border-white
            flex items-center justify-center
            transform transition-transform duration-300 hover:scale-110
          `}
        >
          {/* Inner Circle */}
          <div className="absolute inset-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            {/* Level Number */}
            <span
              className={`${sizes[size].text} font-bold text-white drop-shadow-lg`}
              style={{ fontFamily: 'var(--font-xp)' }}
            >
              {level}
            </span>
          </div>

          {/* Icon */}
          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-lg border-2 border-white">
            {levelIcon}
          </div>
        </div>

        {/* Sparkle Effects */}
        {animated && (
          <>
            <motion.div
              className="absolute -top-2 -left-2 text-yellow-300"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className={sizes[size].icon} fill="currentColor" />
            </motion.div>

            <motion.div
              className="absolute -bottom-2 -right-2 text-cyan-300"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
                rotate: [360, 180, 0],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <Star className={sizes[size].icon} fill="currentColor" />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Title */}
      {title && (
        <div className="text-center">
          <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-bold shadow-lg">
            {title}
          </div>
        </div>
      )}
    </div>
  );
}

function getLevelIcon(level: number) {
  if (level >= 50) {
    return <Crown className="size-3 text-yellow-900" fill="currentColor" />;
  } else if (level >= 30) {
    return <Trophy className="size-3 text-yellow-900" fill="currentColor" />;
  } else if (level >= 15) {
    return <Star className="size-3 text-yellow-900" fill="currentColor" />;
  } else {
    return <Zap className="size-3 text-yellow-900" fill="currentColor" />;
  }
}
