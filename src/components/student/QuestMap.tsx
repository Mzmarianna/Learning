import { useState } from 'react';
import { QuestInstance, ChallengeInstance, ChallengeStatus } from '../../lib/types';
import { Lock, Star, PlayCircle, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import ChallengeCard from './ChallengeCard';

interface QuestMapProps {
  questInstance: QuestInstance;
  onUpdate: () => void;
}

export default function QuestMap({ questInstance, onUpdate }: QuestMapProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeInstance | null>(null);

  // Get visual state for challenge
  const getChallengeState = (status: ChallengeStatus) => {
    switch (status) {
      case 'locked':
        return {
          icon: Lock,
          color: 'bg-gray-300 dark:bg-gray-700',
          borderColor: 'border-gray-400 dark:border-gray-600',
          pulse: false,
          label: 'Locked',
        };
      case 'available':
        return {
          icon: PlayCircle,
          color: 'bg-success',
          borderColor: 'border-success',
          pulse: true,
          label: 'Start Quest',
        };
      case 'in_progress':
        return {
          icon: Clock,
          color: 'bg-calm-primary',
          borderColor: 'border-calm-primary',
          pulse: true,
          label: 'Continue',
        };
      case 'submitted':
        return {
          icon: CheckCircle,
          color: 'bg-warning',
          borderColor: 'border-warning',
          pulse: false,
          label: 'Under Review',
        };
      case 'approved':
        return {
          icon: Star,
          color: 'reward-bg',
          borderColor: 'border-reward-purple',
          pulse: false,
          label: 'Mastered!',
        };
      case 'needs_revision':
        return {
          icon: PlayCircle,
          color: 'bg-needs-attention',
          borderColor: 'border-needs-attention',
          pulse: true,
          label: 'Try Again',
        };
    }
  };

  // Calculate path positions for the map
  const getNodePosition = (index: number) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const isEvenRow = row % 2 === 0;
    
    return {
      x: isEvenRow ? col * 200 + 100 : (3 - col) * 200 + 100,
      y: row * 200 + 100,
    };
  };

  // Check if challenge is clickable
  const isClickable = (status: ChallengeStatus) => {
    return status !== 'locked';
  };

  return (
    <div className="bg-calm-surface border-2 border-calm-border rounded-2xl p-6 overflow-hidden">
      {/* Quest Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl">Quest Map</h2>
          <div className="text-sm text-muted-foreground">
            {questInstance.progress} / 16 Challenges Completed
          </div>
        </div>
        <div className="h-2 bg-calm-border rounded-full overflow-hidden">
          <motion.div
            className="h-full reward-bg"
            initial={{ width: 0 }}
            animate={{ width: `${(questInstance.progress / 16) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-calm-bg rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <span>Locked</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-success rounded-full animate-pulse" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-calm-primary rounded-full animate-pulse" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-warning rounded-full" />
          <span>Under Review</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 reward-bg rounded-full" />
          <span>Mastered</span>
        </div>
      </div>

      {/* Scrollable Map Container */}
      <div className="relative overflow-x-auto overflow-y-auto max-h-[600px] rounded-lg bg-gradient-to-b from-calm-bg to-calm-surface p-8">
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: '900px',
            height: `${Math.ceil(questInstance.challenges.length / 4) * 200 + 100}px`,
          }}
        >
          {/* Draw connecting paths */}
          {questInstance.challenges.map((challenge, index) => {
            if (index === questInstance.challenges.length - 1) return null;
            
            const start = getNodePosition(index);
            const end = getNodePosition(index + 1);
            
            return (
              <line
                key={`path-${index}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={challenge.status === 'locked' ? '5,5' : '0'}
                className={
                  challenge.status === 'approved'
                    ? 'text-reward-purple'
                    : 'text-calm-border'
                }
                opacity="0.5"
              />
            );
          })}
        </svg>

        {/* Challenge Nodes */}
        <div className="relative" style={{ height: `${Math.ceil(questInstance.challenges.length / 4) * 200 + 100}px` }}>
          {questInstance.challenges.map((challenge, index) => {
            const pos = getNodePosition(index);
            const state = getChallengeState(challenge.status);
            const Icon = state.icon;
            const clickable = isClickable(challenge.status);

            return (
              <motion.button
                key={challenge.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                  clickable ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                style={{ left: pos.x, top: pos.y }}
                onClick={() => clickable && setSelectedChallenge(challenge)}
                whileHover={clickable ? { scale: 1.1 } : {}}
                whileTap={clickable ? { scale: 0.95 } : {}}
                disabled={!clickable}
                aria-label={`Challenge ${challenge.challengeNumber}: ${state.label}`}
              >
                {/* Challenge Node */}
                <div className="relative">
                  {/* Pulse animation for current challenge */}
                  {state.pulse && (
                    <motion.div
                      className={`absolute inset-0 rounded-full ${state.color} opacity-50`}
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                  
                  {/* Node Circle */}
                  <div
                    className={`w-16 h-16 rounded-full ${state.color} border-4 ${state.borderColor} flex items-center justify-center text-white shadow-lg relative z-10`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Challenge Number Badge */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold z-20">
                    {challenge.challengeNumber}
                  </div>

                  {/* Special Checkpoint Indicators */}
                  {challenge.challengeNumber === 1 && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-calm-primary whitespace-nowrap">
                      📋 Assessment
                    </div>
                  )}
                  {challenge.challengeNumber === 8 && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-calm-primary whitespace-nowrap">
                      🎯 Midpoint
                    </div>
                  )}
                  {challenge.challengeNumber === 16 && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-reward-purple whitespace-nowrap">
                      🎉 Celebration!
                    </div>
                  )}
                </div>

                {/* Status Label */}
                <div className="mt-10 text-xs font-semibold text-center whitespace-nowrap">
                  {state.label}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Challenge Card Modal */}
      {selectedChallenge && (
        <ChallengeCard
          challenge={selectedChallenge}
          questInstance={questInstance}
          onClose={() => setSelectedChallenge(null)}
          onUpdate={() => {
            onUpdate();
            setSelectedChallenge(null);
          }}
        />
      )}
    </div>
  );
}
