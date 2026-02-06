import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Star } from 'lucide-react';

interface RewardOverlayProps {
  xpAwarded: number;
  title: string;
  message: string;
  achievementUnlocked?: {
    title: string;
    icon: string;
  };
}

export default function RewardOverlay({
  xpAwarded,
  title,
  message,
  achievementUnlocked,
}: RewardOverlayProps) {
  const [playSound, setPlaySound] = useState(false);

  useEffect(() => {
    // Play celebration sound (Class Dojo style "ding!")
    setPlaySound(true);
    
    // In production, play actual sound effect
    // const audio = new Audio('/sounds/quest-complete.mp3');
    // audio.play().catch(() => {});
  }, []);

  // Generate random confetti particles
  const confettiCount = 30;
  const confetti = Array.from({ length: confettiCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.3,
    color: ['#A855F7', '#EC4899', '#14B8A6', '#F59E0B'][Math.floor(Math.random() * 4)],
  }));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Confetti */}
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              backgroundColor: piece.color,
              left: `${piece.x}%`,
              top: '-10%',
            }}
            initial={{
              y: 0,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [1, 1, 0],
              rotate: piece.rotation * 3,
            }}
            transition={{
              duration: 2.5,
              delay: piece.delay,
              ease: 'easeIn',
            }}
          />
        ))}

        {/* Main Celebration Card */}
        <motion.div
          className="relative bg-calm-surface border-4 border-reward-purple rounded-2xl p-8 max-w-md mx-4 shadow-2xl pointer-events-auto"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 10 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
        >
          {/* Sparkle Effects */}
          <div className="absolute -top-4 -right-4">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Sparkles className="w-8 h-8 text-reward-pink" />
            </motion.div>
          </div>
          
          <div className="absolute -top-4 -left-4">
            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Star className="w-8 h-8 text-reward-purple" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            {/* Icon */}
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 200,
              }}
            >
              <div className="w-20 h-20 rounded-full reward-bg flex items-center justify-center">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-3xl text-reward-purple"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {title}
            </motion.h2>

            {/* XP Award */}
            <motion.div
              className="inline-block"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.4,
                type: 'spring',
                stiffness: 150,
              }}
            >
              <div className="reward-bg text-white px-6 py-3 rounded-full">
                <motion.p
                  className="text-2xl xp-display"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    delay: 0.5,
                    duration: 0.5,
                  }}
                >
                  +{xpAwarded} XP
                </motion.p>
              </div>
            </motion.div>

            {/* Message */}
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {message}
            </motion.p>

            {/* Achievement Badge (if unlocked) */}
            {achievementUnlocked && (
              <motion.div
                className="bg-reward-purple-light border-2 border-reward-purple rounded-lg p-4 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-sm font-semibold text-reward-purple mb-1">
                  🏆 Achievement Unlocked!
                </p>
                <p className="text-lg">
                  {achievementUnlocked.icon} {achievementUnlocked.title}
                </p>
              </motion.div>
            )}

            {/* Auto-dismiss hint */}
            <motion.p
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              This will close automatically...
            </motion.p>
          </div>

          {/* Pulse Border Effect */}
          <motion.div
            className="absolute inset-0 border-4 border-reward-pink rounded-2xl pointer-events-none"
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Sound Effect Indicator (visual feedback) */}
        {playSound && (
          <motion.div
            className="absolute top-8 right-8 bg-success text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            🔊 Ding!
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
