/**
 * Kingdom of Learning - Epic Landing Page
 * AAA Gaming-inspired landing experience
 */

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, Zap, MapPin, Users, Trophy, Swords, LogIn } from 'lucide-react';

interface KingdomLandingProps {
  onStartAdventure: () => void;
  onNewHere: () => void;
  onLogin: () => void;
}

export default function KingdomLanding({ onStartAdventure, onNewHere, onLogin }: KingdomLandingProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden relative">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e933_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e933_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full blur-[120px]"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-40 right-20 w-96 h-96 bg-purple-600 rounded-full blur-[120px]"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full blur-[120px]"
        />
      </div>

      {/* Top Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-slate-950/50 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <span className="text-3xl">🏰</span>
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Mz. Marianna's Academy
              </h1>
              <p className="text-xs text-cyan-400 font-semibold">Learning Kingdom</p>
            </div>
          </motion.div>

          {/* Warrior Login Button */}
          <motion.button
            onClick={onLogin}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/30"
          >
            <LogIn className="w-5 h-5" />
            Warrior Login
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20">
        {/* Epic Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
            style={{ y: y1 }}
          >
            <span className="block text-white mb-2">WELCOME TO THE</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              KINGDOM OF
            </span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              LEARNING
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-cyan-300 max-w-3xl mx-auto font-medium"
          >
            Embark on epic quests, defeat boss battles, and unlock legendary knowledge!
          </motion.p>
        </motion.div>

        {/* Kingdom Map Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          style={{ y: y2 }}
          className="relative mb-12 max-w-5xl mx-auto"
        >
          {/* Holographic Frame */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
          
          <div className="relative rounded-3xl overflow-hidden border-4 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] bg-gradient-to-br from-slate-900 via-purple-900 to-cyan-900">
            <div className="aspect-video flex flex-col items-center justify-center gap-4 text-white p-10">
              <span className="text-6xl">🗺️</span>
              <h3 className="text-3xl font-bold">Dynamic Kingdom Map</h3>
              <p className="max-w-2xl text-center text-white/75">
                Track quests, clan territories, and active events in real time. The world evolves as learners progress.
              </p>
            </div>
            
            {/* Overlay Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
          </div>

          {/* Floating Stats */}
          <FloatingStat
            icon="⚔️"
            label="Active Warriors"
            value="1,247"
            color="cyan"
            position="top-4 left-4"
          />
          <FloatingStat
            icon="🏆"
            label="Quests Completed"
            value="8,592"
            color="purple"
            position="top-4 right-4"
          />
          <FloatingStat
            icon="🐉"
            label="Bosses Defeated"
            value="3,128"
            color="pink"
            position="bottom-4 left-4"
          />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          {/* Primary CTA */}
          <motion.button
            onClick={onStartAdventure}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-12 py-6 text-2xl font-black rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
            
            {/* Border Glow */}
            <div className="absolute inset-0 rounded-2xl border-4 border-amber-300/50 group-hover:border-amber-200 transition-colors" />
            <div className="absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(251,191,36,0.5)] group-hover:shadow-[0_0_60px_rgba(251,191,36,0.8)] transition-shadow" />

            {/* Content */}
            <span className="relative flex items-center gap-3 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <Sparkles className="w-8 h-8" />
              START MY ADVENTURE
              <Sparkles className="w-8 h-8" />
            </span>
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            onClick={onNewHere}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-6 text-xl font-bold rounded-2xl bg-slate-900/80 backdrop-blur-sm text-cyan-400 border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-slate-800/80 transition-all shadow-lg shadow-cyan-500/20"
          >
            I'M NEW HERE
          </motion.button>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap gap-4 justify-center mt-12"
        >
          <FeaturePill icon={<Swords className="w-5 h-5" />} text="Epic Quests" />
          <FeaturePill icon={<Users className="w-5 h-5" />} text="Join Clans" />
          <FeaturePill icon={<Trophy className="w-5 h-5" />} text="Earn Rewards" />
          <FeaturePill icon={<Zap className="w-5 h-5" />} text="Level Up" />
        </motion.div>
      </div>

      {/* Zones Section */}
      <KingdomZones />

      {/* Scrolling Particle Effects */}
      <Particles />

      {/* Add shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// FLOATING STAT COMPONENT
// ============================================================================

function FloatingStat({
  icon,
  label,
  value,
  color,
  position,
}: {
  icon: string;
  label: string;
  value: string;
  color: 'cyan' | 'purple' | 'pink';
  position: string;
}) {
  const colorMap = {
    cyan: 'from-cyan-500/90 to-cyan-600/90 border-cyan-400/50 shadow-cyan-500/50',
    purple: 'from-purple-500/90 to-purple-600/90 border-purple-400/50 shadow-purple-500/50',
    pink: 'from-pink-500/90 to-pink-600/90 border-pink-400/50 shadow-pink-500/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      whileHover={{ scale: 1.1, y: -5 }}
      className={`absolute ${position} backdrop-blur-xl bg-gradient-to-br ${colorMap[color]} border-2 rounded-xl px-4 py-3 shadow-lg`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <div className="text-2xl font-black text-white">{value}</div>
          <div className="text-xs text-white/80 font-semibold">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// FEATURE PILL COMPONENT
// ============================================================================

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900/60 backdrop-blur-sm border border-cyan-500/30 text-cyan-300 font-semibold shadow-lg shadow-cyan-500/10"
    >
      {icon}
      <span>{text}</span>
    </motion.div>
  );
}

// ============================================================================
// KINGDOM ZONES SECTION
// ============================================================================

function KingdomZones() {
  const zones = [
    {
      name: 'Code Castle',
      description: 'Master the ancient arts of programming',
      icon: '🏰',
      color: 'from-blue-500 to-cyan-500',
      glow: 'cyan',
    },
    {
      name: 'Math Mountains',
      description: 'Conquer peaks of numerical mastery',
      icon: '⛰️',
      color: 'from-purple-500 to-pink-500',
      glow: 'purple',
    },
    {
      name: 'Reading Realm',
      description: 'Unlock stories and comprehension power',
      icon: '📚',
      color: 'from-pink-500 to-rose-500',
      glow: 'pink',
    },
    {
      name: 'Writing Workshop',
      description: 'Forge legendary tales and essays',
      icon: '✍️',
      color: 'from-amber-500 to-orange-500',
      glow: 'amber',
    },
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
      >
        Explore the Kingdom
      </motion.h2>
      <p className="text-center text-cyan-300 text-xl mb-12">
        Choose your path and begin your legendary journey
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {zones.map((zone, idx) => (
          <motion.div
            key={zone.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className={`group relative backdrop-blur-xl bg-slate-900/60 border-2 border-${zone.glow}-500/30 hover:border-${zone.glow}-400/60 rounded-2xl p-6 transition-all cursor-pointer`}
          >
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${zone.color} opacity-0 group-hover:opacity-10 transition-opacity blur-xl`} />

            {/* Content */}
            <div className="relative">
              <div className="text-6xl mb-4">{zone.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{zone.name}</h3>
              <p className="text-cyan-300/80">{zone.description}</p>
            </div>

            {/* Corner Accent */}
            <div className={`absolute top-2 right-2 w-16 h-16 bg-gradient-to-br ${zone.color} rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// PARTICLES EFFECT
// ============================================================================

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            y: [null, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}
