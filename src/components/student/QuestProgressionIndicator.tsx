import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowRight, Sparkles, Target, Lock, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { 
  checkQuestProgression, 
  getStudentProgressionStatus,
  type QuestProgressionResult 
} from '../../lib/progression/auto-quest-progression';

interface QuestProgressionIndicatorProps {
  studentId: string;
  currentQuestId: string;
  onQuestUnlocked?: (questId: string) => void;
}

export default function QuestProgressionIndicator({
  studentId,
  currentQuestId,
  onQuestUnlocked,
}: QuestProgressionIndicatorProps) {
  const [progressionStatus, setProgressionStatus] = useState<QuestProgressionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    loadProgressionStatus();
  }, [studentId, currentQuestId]);

  const loadProgressionStatus = async () => {
    setLoading(true);
    try {
      const status = await checkQuestProgression(studentId, currentQuestId);
      setProgressionStatus(status);
      
      if (status.eligible && status.nextQuestId) {
        setShowCelebration(true);
      }
    } catch (error) {
      console.error('Error loading progression status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (!progressionStatus) {
    return null;
  }

  // Quest completed - all quests done
  if (progressionStatus.eligible && !progressionStatus.nextQuestId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <Card className="p-8 border-4 border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              🏆
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Tier Master!
            </h2>
            <p className="text-lg text-gray-700">
              {progressionStatus.congratsMessage}
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Next quest unlocked!
  if (progressionStatus.eligible && progressionStatus.nextQuestId) {
    return (
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-6"
          >
            <Card className="p-8 border-4 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
              {/* Animated background sparkles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl"
                    initial={{ 
                      opacity: 0,
                      x: Math.random() * 100 + '%',
                      y: Math.random() * 100 + '%',
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: [Math.random() * 100 + '%', '0%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Trophy className="w-20 h-20 text-green-600" />
                  </motion.div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    🎉 Quest Mastered!
                  </h2>
                  <p className="text-xl text-gray-700 mb-2">
                    {progressionStatus.congratsMessage}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-300 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-900">
                      New Quest Unlocked
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-green-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-sm font-semibold text-gray-600 uppercase">
                          Next Adventure
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {progressionStatus.nextQuestTheme}
                        </h3>
                      </div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                  </div>

                  <Button
                    onClick={() => {
                      setShowCelebration(false);
                      if (onQuestUnlocked && progressionStatus.nextQuestId) {
                        onQuestUnlocked(progressionStatus.nextQuestId);
                      }
                    }}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Start New Quest
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Still working on current quest
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      <Card className="p-6 border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Quest Progress
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              {progressionStatus.reason}
            </p>
            <div className="text-xs text-gray-600">
              Keep going! The next quest will unlock automatically when you're ready.
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
