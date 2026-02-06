/**
 * Warrior Profile Display
 * Shows warrior identity, stats, and progression
 */

import { motion } from 'motion/react';
import { Swords, Trophy, Flame, Sparkles, Crown, Shield } from 'lucide-react';
import { WarriorProfile as WarriorProfileType } from '../../lib/types/kingdom';
import { getRankColor, getRankEmoji, calculateLevelProgress } from '../../lib/warrior-system';

interface WarriorProfileProps {
  warrior: WarriorProfileType;
  showFullStats?: boolean;
}

export default function WarriorProfile({ warrior, showFullStats = true }: WarriorProfileProps) {
  const levelProgress = calculateLevelProgress(warrior.totalXP);
  const rankColor = getRankColor(warrior.rank);
  const rankEmoji = getRankEmoji(warrior.rank);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900 via-slate-900 to-cyan-900 rounded-3xl p-8 border-4 border-amber-400 shadow-2xl relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-10 -right-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -bottom-10 -left-10 w-64 h-64 bg-cyan-500 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-start gap-6 mb-6">
          {/* Warrior Avatar */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-32 h-32 rounded-2xl flex items-center justify-center text-7xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${warrior.avatar.color} 0%, ${rankColor} 100%)`,
                boxShadow: `0 0 30px ${warrior.avatar.color}50`,
              }}
            >
              ⚔️
              
              {/* Rank Badge Overlay */}
              <div className="absolute -bottom-2 -right-2 bg-amber-400 rounded-full w-14 h-14 flex items-center justify-center border-4 border-slate-900 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{warrior.level}</div>
                </div>
              </div>
            </motion.div>

            {/* Streak Flame */}
            {warrior.currentStreak > 0 && (
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [-5, 5, -5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -left-2 bg-orange-500 rounded-full w-10 h-10 flex items-center justify-center border-2 border-orange-300 shadow-lg"
              >
                <Flame className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </div>

          {/* Warrior Info */}
          <div className="flex-1">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold text-white mb-1 flex items-center gap-2"
            >
              {warrior.warriorName}
              <span className="text-2xl">{rankEmoji}</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-cyan-400 text-xl mb-3"
            >
              {warrior.title}
            </motion.p>

            {/* Rank & XP Pills */}
            <div className="flex flex-wrap gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-full text-white text-sm font-semibold flex items-center gap-2 shadow-lg"
                style={{ backgroundColor: rankColor }}
              >
                <Shield className="w-4 h-4" />
                {warrior.rank} Warrior
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full text-white text-sm font-semibold flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                {warrior.totalXP.toLocaleString()} XP
              </motion.div>

              {warrior.currentStreak >= 7 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-sm font-semibold flex items-center gap-2 shadow-lg"
                >
                  <Flame className="w-4 h-4" />
                  {warrior.currentStreak} Day Streak!
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {showFullStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-4 gap-4 mb-6"
          >
            <StatBox
              label="Quests"
              value={warrior.questsCompleted}
              icon={<Trophy className="w-5 h-5" />}
              color="from-purple-500 to-pink-500"
            />
            <StatBox
              label="Bosses"
              value={warrior.bossesDefeated}
              icon="🐉"
              color="from-red-500 to-orange-500"
            />
            <StatBox
              label="Streak"
              value={warrior.currentStreak}
              icon={<Flame className="w-5 h-5" />}
              color="from-orange-500 to-yellow-500"
              subtitle={`Best: ${warrior.longestStreak}`}
            />
            <StatBox
              label="Perfect"
              value={warrior.perfectChallenges}
              icon="💎"
              color="from-cyan-500 to-blue-500"
            />
          </motion.div>
        )}

        {/* Level Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center text-sm text-slate-300 mb-2">
            <span className="font-semibold">Level {warrior.level}</span>
            <span>{warrior.xpToNextLevel.toLocaleString()} XP to next level</span>
          </div>
          
          <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 relative"
            >
              {/* Shimmer Effect */}
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
            
            {/* Percentage Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg">
                {levelProgress}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            Badges & Achievements
          </h3>
          
          <div className="flex gap-3 flex-wrap">
            {warrior.badgeIds.length > 0 ? (
              warrior.badgeIds.map((badgeId, idx) => (
                <motion.div
                  key={badgeId}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg border-2 border-amber-300 cursor-pointer"
                  title={badgeId}
                >
                  🏅
                </motion.div>
              ))
            ) : (
              <div className="text-slate-400 text-sm italic">
                Complete quests to earn badges!
              </div>
            )}
            
            {/* Locked Badge Slots */}
            {Array.from({ length: Math.max(0, 5 - warrior.badgeIds.length) }).map((_, idx) => (
              <motion.div
                key={`locked-${idx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + idx * 0.05 }}
                className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-600 hover:border-purple-500 flex items-center justify-center text-slate-600 text-2xl transition-colors cursor-pointer"
                title="Locked - Complete challenges to unlock"
              >
                🔒
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Motivational Message */}
        {showFullStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 p-4 bg-gradient-to-r from-purple-900/50 to-cyan-900/50 rounded-xl border border-purple-500/30"
          >
            <p className="text-purple-200 text-center italic">
              {getMotivationalMessage(warrior)}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// STAT BOX COMPONENT
// ============================================================================

function StatBox({
  label,
  value,
  icon,
  color,
  subtitle,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`bg-slate-800/80 rounded-xl p-4 text-center backdrop-blur-sm border-2 border-slate-700 hover:border-purple-500 transition-colors shadow-lg`}
    >
      <div className="flex items-center justify-center mb-2">
        {typeof icon === 'string' ? (
          <span className="text-3xl">{icon}</span>
        ) : (
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white`}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="text-3xl font-bold text-white mb-1">
        {value.toLocaleString()}
      </div>
      
      <div className="text-xs text-slate-400 uppercase tracking-wide">
        {label}
      </div>
      
      {subtitle && (
        <div className="text-xs text-slate-500 mt-1">
          {subtitle}
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// MOTIVATIONAL MESSAGES
// ============================================================================

function getMotivationalMessage(warrior: WarriorProfileType): string {
  // Streak-based messages
  if (warrior.currentStreak >= 30) {
    return "🔥 Legendary dedication! You're unstoppable, warrior!";
  }
  if (warrior.currentStreak >= 14) {
    return "🔥 Two weeks strong! Your discipline is legendary!";
  }
  if (warrior.currentStreak >= 7) {
    return "🔥 A full week! You're building unstoppable momentum!";
  }
  
  // Quest-based messages
  if (warrior.questsCompleted >= 20) {
    return "⚔️ You've conquered many quests! Your legend grows!";
  }
  if (warrior.questsCompleted >= 10) {
    return "🎯 Double digits! You're becoming a master warrior!";
  }
  if (warrior.questsCompleted >= 5) {
    return "🎯 Five quests down! You're proving your worth!";
  }
  
  // Boss-based messages
  if (warrior.bossesDefeated >= 10) {
    return "🐉 Ten bosses defeated! You're a dragon slayer!";
  }
  if (warrior.bossesDefeated >= 5) {
    return "🐉 Boss hunter extraordinaire! Keep up the fight!";
  }
  if (warrior.bossesDefeated >= 1) {
    return "🐉 You've defeated your first boss! Many more await!";
  }
  
  // Perfect challenges
  if (warrior.perfectChallenges >= 10) {
    return "💎 Perfection is your standard! Incredible work!";
  }
  
  // Rank-based messages
  if (warrior.rank === 'Legendary') {
    return "👑 You've reached the pinnacle! A true Keeper of the Realm!";
  }
  if (warrior.rank === 'Master') {
    return "👑 Master rank achieved! You're among the elite!";
  }
  if (warrior.rank === 'Skilled') {
    return "⚔️ Your skills are proven! Guardian of Knowledge!";
  }
  
  // Default messages for new warriors
  const welcomeMessages = [
    "⚔️ Your adventure begins, brave warrior! Every quest makes you stronger!",
    "🎯 Welcome to the Kingdom! Great warriors start exactly where you are!",
    "🛡️ The path of mastery awaits! Take it one quest at a time!",
    "✨ Every challenge conquered brings you closer to legend!",
    "🌟 The Kingdom needs warriors like you! Keep training!",
  ];
  
  return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
}
