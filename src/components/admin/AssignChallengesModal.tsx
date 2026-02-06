import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckSquare, Target, BookOpen, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { EXPLORERS_HUB_CURRICULUM } from '../../lib/curriculum/explorers-hub-curriculum';
import { toast } from 'sonner';

interface AssignChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string | null;
  onSuccess: () => void;
}

export default function AssignChallengesModal({
  isOpen,
  onClose,
  studentId,
  onSuccess,
}: AssignChallengesModalProps) {
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset selections when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedQuest(null);
      setSelectedChallenges([]);
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleAssignChallenges = async () => {
    if (!studentId || selectedChallenges.length === 0) {
      toast.error('Please select at least one challenge to assign');
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual Supabase call
      // For now, simulate assignment
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(`Successfully assigned ${selectedChallenges.length} challenge(s)!`);
      onSuccess();
    } catch (error: any) {
      console.error('Error assigning challenges:', error);
      toast.error(error.message || 'Failed to assign challenges');
    } finally {
      setLoading(false);
    }
  };

  const toggleChallengeSelection = (challengeId: string) => {
    setSelectedChallenges(prev =>
      prev.includes(challengeId)
        ? prev.filter(id => id !== challengeId)
        : [...prev, challengeId]
    );
  };

  const selectAllInQuest = (questId: string) => {
    const quest = EXPLORERS_HUB_CURRICULUM.find(q => q.questId === questId);
    if (!quest) return;

    const questChallengeIds = quest.challenges.map(c => c.challengeId);
    const allSelected = questChallengeIds.every(id =>
      selectedChallenges.includes(id)
    );

    if (allSelected) {
      // Deselect all from this quest
      setSelectedChallenges(prev =>
        prev.filter(id => !questChallengeIds.includes(id))
      );
    } else {
      // Select all from this quest
      setSelectedChallenges(prev => [
        ...prev.filter(id => !questChallengeIds.includes(id)),
        ...questChallengeIds,
      ]);
    }
  };

  const filteredQuests = EXPLORERS_HUB_CURRICULUM.filter(
    quest =>
      quest.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen || !studentId) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <Card className="p-8 border-4 border-purple-300 bg-white flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <Target className="w-8 h-8 text-purple-600" />
                    Assign Challenges
                  </h2>
                  <p className="text-gray-600">
                    Select quests and challenges to assign to this student
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search quests..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Selected Count */}
              <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
                <p className="text-sm font-semibold text-purple-900">
                  {selectedChallenges.length} challenge(s) selected
                </p>
              </div>

              {/* Quests & Challenges List */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                {filteredQuests.map((quest, index) => {
                  const questChallengeIds = quest.challenges.map(c => c.challengeId);
                  const allSelected = questChallengeIds.every(id =>
                    selectedChallenges.includes(id)
                  );
                  const someSelected = questChallengeIds.some(id =>
                    selectedChallenges.includes(id)
                  );

                  return (
                    <motion.div
                      key={quest.questId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-2 border-gray-200 rounded-xl overflow-hidden"
                    >
                      {/* Quest Header */}
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-white">
                            <span className="text-3xl">{quest.icon}</span>
                            <div>
                              <h3 className="font-bold text-lg">{quest.theme}</h3>
                              <p className="text-sm text-white/80">
                                Week {quest.week} • {quest.challenges.length} challenges
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            onClick={() => selectAllInQuest(quest.questId)}
                            size="sm"
                            variant="outline"
                            className={`border-2 ${
                              allSelected
                                ? 'bg-white text-purple-600 border-white'
                                : 'bg-transparent text-white border-white/50 hover:bg-white/10'
                            }`}
                          >
                            {allSelected ? 'Deselect All' : 'Select All'}
                          </Button>
                        </div>
                      </div>

                      {/* Challenges */}
                      <div className="p-4 space-y-2">
                        {quest.challenges.map((challenge) => {
                          const isSelected = selectedChallenges.includes(
                            challenge.challengeId
                          );

                          return (
                            <button
                              key={challenge.challengeId}
                              type="button"
                              onClick={() =>
                                toggleChallengeSelection(challenge.challengeId)
                              }
                              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                isSelected
                                  ? 'bg-gradient-to-r from-cyan-50 to-purple-50 border-purple-400'
                                  : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                    isSelected
                                      ? 'bg-purple-600 border-purple-600'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  {isSelected && (
                                    <CheckSquare className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 mb-1">
                                    {challenge.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {challenge.description}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <BookOpen className="w-3 h-3" />
                                      {challenge.subject}
                                    </span>
                                    <span>{challenge.estimatedTime}</span>
                                    <span className="text-purple-600 font-semibold">
                                      {challenge.xpReward} XP
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}

                {filteredQuests.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No quests found matching your search</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAssignChallenges}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={loading || selectedChallenges.length === 0}
                >
                  {loading
                    ? 'Assigning...'
                    : `Assign ${selectedChallenges.length} Challenge(s)`}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
