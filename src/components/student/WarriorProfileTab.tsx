/**
 * Warrior Profile Tab
 * Displays warrior profile in the student dashboard
 */

import { User } from '../../lib/types';
import { WarriorProfile as WarriorProfileType } from '../../lib/types/kingdom';
import WarriorProfile from './WarriorProfile';
import { motion } from 'motion/react';

interface WarriorProfileTabProps {
  user: User;
  warriorProfile: WarriorProfileType | null;
}

export default function WarriorProfileTab({ user, warriorProfile }: WarriorProfileTabProps) {
  if (!warriorProfile) {
    return (
      <div className="bg-calm-surface border-2 border-calm-border rounded-2xl p-12 text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          ⚔️
        </motion.div>
        <h2 className="text-3xl font-bold mb-4">Initializing Your Warrior Profile...</h2>
        <p className="text-muted-foreground">
          Your warrior identity is being forged! Refresh the page in a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Warrior Profile */}
      <WarriorProfile warrior={warriorProfile} showFullStats={true} />

      {/* Coming Soon Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quest History */}
        <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl p-6 border-2 border-purple-500">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            📜 Quest History
          </h3>
          <p className="text-purple-200 italic mb-4">View all your completed quests and victories!</p>
          <div className="bg-purple-800/30 rounded-xl p-4 text-center">
            <p className="text-purple-300 text-sm">Coming Soon!</p>
          </div>
        </div>

        {/* Equipment Loadout */}
        <div className="bg-gradient-to-br from-cyan-900 to-slate-900 rounded-2xl p-6 border-2 border-cyan-500">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            ⚔️ Equipment Loadout
          </h3>
          <p className="text-cyan-200 italic mb-4">Customize your warrior's armor, weapons, and gear!</p>
          <div className="bg-cyan-800/30 rounded-xl p-4 text-center">
            <p className="text-cyan-300 text-sm">Coming Soon!</p>
          </div>
        </div>
      </div>

      {/* Warrior Leaderboard Preview */}
      <div className="bg-gradient-to-br from-amber-900 to-slate-900 rounded-2xl p-6 border-2 border-amber-500">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          🏆 Warrior Leaderboard
        </h3>
        <p className="text-amber-200 italic mb-4">See how you rank among your fellow warriors!</p>
        
        <div className="space-y-3">
          {[
            { rank: 1, name: 'Alex the Brave', xp: 15420, emoji: '👑' },
            { rank: 2, name: 'Jordan the Quick', xp: 14890, emoji: '🥈' },
            { rank: 3, name: 'Sam the Wise', xp: 13200, emoji: '🥉' },
          ].map((entry) => (
            <div
              key={entry.rank}
              className="bg-slate-800/60 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{entry.emoji}</div>
                <div>
                  <div className="font-bold text-white">#{entry.rank} {entry.name}</div>
                  <div className="text-sm text-slate-400">{entry.xp.toLocaleString()} XP</div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-purple-800/30 rounded-xl p-4 text-center">
            <p className="text-purple-300">You'll appear here once you complete your first quest!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
