/**
 * Warriors Dashboard
 * Main dashboard view for Warriors tier students
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sword, Trophy, Flame, TrendingUp, Calendar, Target } from 'lucide-react';
import type { User } from '@/lib/types';
import {
  getCurrentWarriorQuest,
  getWarriorsProgressSummary,
  submitChallenge,
  type WarriorQuestAssignment,
} from '@/lib/warriors-quest-service';
import { getWarriorQuestById } from '@/lib/curriculum-index';
import WarriorQuestCard from './WarriorQuestCard';
import ChallengeDetailModal from './ChallengeDetailModal';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';

interface WarriorsDashboardProps {
  user: User;
}

export default function WarriorsDashboard({ user }: WarriorsDashboardProps) {
  const [currentQuest, setCurrentQuest] = useState<WarriorQuestAssignment | null>(null);
  const [progressSummary, setProgressSummary] = useState<any>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWarriorData();
  }, [user.uid]);

  const loadWarriorData = async () => {
    try {
      setIsLoading(true);
      const [quest, summary] = await Promise.all([
        getCurrentWarriorQuest(user.uid),
        getWarriorsProgressSummary(user.uid),
      ]);
      setCurrentQuest(quest);
      setProgressSummary(summary);
    } catch (error) {
      console.error('Error loading Warriors data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChallengeClick = (challengeId: string) => {
    setSelectedChallengeId(challengeId);
  };

  const handleChallengeSubmit = async (submissionData: any) => {
    if (!selectedChallengeId) return;
    
    try {
      await submitChallenge(user.uid, selectedChallengeId, submissionData);
      // Reload data after submission
      await loadWarriorData();
    } catch (error) {
      console.error('Error submitting challenge:', error);
    }
  };

  const selectedChallenge = selectedChallengeId && currentQuest
    ? currentQuest.questData.challenges.find(c => c.challengeId === selectedChallengeId)
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Sword className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your warrior training...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, Warrior {user.displayName}
            </h1>
            <p className="text-slate-400">
              Continue your journey through the Learning Kingdom
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl">
            <Trophy className="w-6 h-6 text-white" />
            <div className="text-white">
              <div className="text-2xl font-bold">{progressSummary?.totalXP || 0}</div>
              <div className="text-xs opacity-90">Total XP</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            icon={Calendar}
            label="Weeks Completed"
            value={progressSummary?.weeksCompleted || 0}
            max={progressSummary?.totalWeeks || 16}
            color="blue"
          />
          <StatsCard
            icon={Target}
            label="Challenges Done"
            value={progressSummary?.challengesCompleted || 0}
            max={progressSummary?.totalChallenges || 80}
            color="emerald"
          />
          <StatsCard
            icon={TrendingUp}
            label="Overall Progress"
            value={Math.round(progressSummary?.progressPercent || 0)}
            suffix="%"
            color="purple"
          />
          <StatsCard
            icon={Flame}
            label="Current Streak"
            value={5}
            suffix=" days"
            color="orange"
          />
        </div>
      </motion.div>

      {/* Current Quest */}
      {currentQuest ? (
        <WarriorQuestCard
          quest={currentQuest}
          onChallengeClick={handleChallengeClick}
        />
      ) : (
        <Card className="p-12 text-center bg-slate-800/50 border-slate-700">
          <Sword className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            No Active Quest
          </h2>
          <p className="text-slate-400 mb-6">
            Ready to begin your warrior training? Get your first quest assigned.
          </p>
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors">
            Start Training
          </button>
        </Card>
      )}

      {/* Quest Narrative */}
      {currentQuest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/20 rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">📜 Quest Narrative</h3>
          <p className="text-slate-300 leading-relaxed mb-6">
            {/* Get narrative from quest-narratives.ts */}
            Your journey continues in {currentQuest.questTitle}. Master these challenges to unlock the secrets of the Learning Kingdom.
          </p>
          
          <div className="bg-slate-900/50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              📚 This Week's Project
            </h4>
            <p className="text-slate-300 mb-2">
              {currentQuest.questData.handsOnProject.title}
            </p>
            <p className="text-sm text-slate-400">
              {currentQuest.questData.handsOnProject.description}
            </p>
          </div>
        </motion.div>
      )}

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <ChallengeDetailModal
          challenge={selectedChallenge}
          isOpen={!!selectedChallenge}
          onClose={() => setSelectedChallengeId(null)}
          onSubmit={handleChallengeSubmit}
        />
      )}
    </div>
  );
}

// Stats Card Component
interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  max?: number;
  suffix?: string;
  color: 'blue' | 'emerald' | 'purple' | 'orange';
}

function StatsCard({ icon: Icon, label, value, max, suffix, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-500',
    emerald: 'from-emerald-600 to-emerald-500',
    purple: 'from-purple-600 to-purple-500',
    orange: 'from-orange-600 to-orange-500',
  };

  const hasProgress = max !== undefined;
  const progressPercent = hasProgress ? (value / max) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-xl shadow-lg`}
    >
      <div className="flex items-start justify-between mb-4">
        <Icon className="w-8 h-8 text-white/90" />
        <div className="text-right">
          <div className="text-3xl font-bold text-white">
            {value}{suffix}
          </div>
          {hasProgress && (
            <div className="text-xs text-white/70">
              of {max}
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-white/90 font-medium mb-2">{label}</div>
      {hasProgress && (
        <Progress value={progressPercent} className="h-2 bg-white/20" />
      )}
    </motion.div>
  );
}
