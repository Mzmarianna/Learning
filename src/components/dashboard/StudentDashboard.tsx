import { motion } from 'motion/react';
import { Zap, Trophy, Target, Book, TrendingUp, Star, ChevronRight, MessageCircle, Map, Rocket, Brain } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useState, useEffect } from 'react';
import { 
  EXPLORERS_HUB_CURRICULUM, 
  getQuestByWeek,
  EXPLORER_BADGES 
} from '../../lib/curriculum/explorers-hub-curriculum';
import WowlAIChat from '../student/WowlAIChat';
import InstructionCard from '../student/InstructionCard';
import ExplorerWeeklySchedule from '../student/ExplorerWeeklySchedule';

interface StudentDashboardProps {
  studentName: string;
  studentAge: number;
  studentTier: 'early-explorers' | 'explorers' | 'warriors';
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  completedChallenges: string[];
  earnedBadges: string[];
  currentQuestId: string;
  recentSubmissions: {
    id: string;
    challengeTitle: string;
    submittedAt: Date;
    masteryLevel: string;
    xpEarned: number;
  }[];
  onNavigateToQuests: () => void;
  onNavigateToChallenge: (challengeId: string) => void;
  onNavigateToPortfolio: () => void;
}

export default function StudentDashboard({
  studentName,
  studentAge,
  studentTier,
  totalXP,
  currentLevel,
  xpToNextLevel,
  completedChallenges,
  earnedBadges,
  currentQuestId,
  recentSubmissions,
  onNavigateToQuests,
  onNavigateToChallenge,
  onNavigateToPortfolio,
}: StudentDashboardProps) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Current quest progress
  const currentQuest = EXPLORERS_HUB_CURRICULUM.find(q => q.questId === currentQuestId);
  const questCompletedCount = currentQuest
    ? currentQuest.challenges.filter(c => completedChallenges.includes(c.challengeId)).length
    : 0;
  const questProgress = currentQuest
    ? (questCompletedCount / currentQuest.challenges.length) * 100
    : 0;

  // Next challenge
  const nextChallenge = currentQuest?.challenges.find(
    c => !completedChallenges.includes(c.challengeId)
  );

  // Level progress
  const levelProgress = ((currentLevel * xpToNextLevel - (xpToNextLevel - totalXP)) / (currentLevel * xpToNextLevel)) * 100;

  // Stats
  const totalChallengesCompleted = completedChallenges.length;
  const totalBadges = earnedBadges.length;
  const weekStreak = 3; // TODO: Calculate from submission dates

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {greeting}, {studentName}! 👋
          </h1>
          <p className="text-lg text-gray-600">Ready to continue your learning adventure?</p>
        </motion.div>

        {/* Visual Instruction Cards - Only show if new user or no recent submissions */}
        {recentSubmissions.length === 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <InstructionCard
              icon={Map}
              iconColor="text-cyan-600"
              title="Start Your Quest"
              description="Choose from exciting quests and challenges designed just for you. Each quest helps you learn while having fun!"
              imageUrl="https://images.unsplash.com/photo-1542909359-544eb870c007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjB0cmVhc3VyZSUyMG1hcCUyMHF1ZXN0fGVufDF8fHx8MTc2ODI0OTg4N3ww&ixlib=rb-4.1.0&q=80&w=1080"
              imageAlt="Adventure quest map"
              actionText="View Quests"
              onAction={onNavigateToQuests}
              gradient="from-cyan-50 to-blue-50"
            />
            
            <InstructionCard
              icon={Brain}
              iconColor="text-purple-600"
              title="Complete Challenges"
              description="Take on fun challenges that build your skills. Earn XP, badges, and rewards as you master each concept!"
              imageUrl="https://images.unsplash.com/photo-1663625318127-bd35dd2e6f75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXp6bGUlMjBwaWVjZXMlMjBjaGFsbGVuZ2V8ZW58MXx8fHwxNzY4MjQ5ODg4fDA&ixlib=rb-4.1.0&q=80&w=1080"
              imageAlt="Puzzle challenge"
              gradient="from-purple-50 to-pink-50"
            />
            
            <InstructionCard
              icon={Rocket}
              iconColor="text-pink-600"
              title="Level Up & Earn Rewards"
              description="Track your progress, earn badges, and unlock special rewards. Watch yourself grow stronger every day!"
              imageUrl="https://images.unsplash.com/photo-1671163377628-a1542b9de075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrZXQlMjBsYXVuY2glMjBzdWNjZXNzJTIwc3RhcnR1cHxlbnwxfHx8fDE3NjgyNDk4ODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
              imageAlt="Rocket launch success"
              gradient="from-pink-50 to-purple-50"
            />
          </div>
        )}

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* XP & Level */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-4 border-yellow-300">
              <div className="flex items-center justify-between mb-3">
                <Zap className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Total XP</p>
                  <p className="text-3xl font-bold">{totalXP}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level {currentLevel}</span>
                  <span>{xpToNextLevel} to Level {currentLevel + 1}</span>
                </div>
                <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-4 border-purple-300">
              <div className="flex items-center justify-between mb-3">
                <Trophy className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Badges Earned</p>
                  <p className="text-3xl font-bold">{totalBadges}</p>
                </div>
              </div>
              <p className="text-sm opacity-90">Out of 16 total badges</p>
              <Progress value={(totalBadges / 16) * 100} className="mt-2 h-3 bg-white/30" />
            </Card>
          </motion.div>

          {/* Challenges Completed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white border-4 border-green-300">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Challenges</p>
                  <p className="text-3xl font-bold">{totalChallengesCompleted}</p>
                </div>
              </div>
              <p className="text-sm opacity-90">Amazing work!</p>
            </Card>
          </motion.div>

          {/* Week Streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-4 border-blue-300">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Week Streak</p>
                  <p className="text-3xl font-bold">{weekStreak}</p>
                </div>
              </div>
              <p className="text-sm opacity-90">🔥 Keep it up!</p>
            </Card>
          </motion.div>
        </div>

        {/* Weekly Schedule - Only for Explorers Tier */}
        {studentTier === 'explorers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ExplorerWeeklySchedule 
              studentId={studentName} 
              currentWeek={currentQuest?.week || 1}
            />
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Current Quest */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Current Quest */}
            {currentQuest && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-8 border-4 border-purple-300 bg-white">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="text-6xl">{currentQuest.badge.icon}</div>
                      <div>
                        <p className="text-sm font-semibold text-purple-600 uppercase mb-1">
                          Current Quest - Week {currentQuest.week}
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {currentQuest.theme}
                        </h2>
                        <div
                          className={`inline-block px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${currentQuest.badge.color} text-white`}
                        >
                          {currentQuest.badge.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                      <span>Quest Progress</span>
                      <span>
                        {questCompletedCount} / {currentQuest.challenges.length} Challenges
                      </span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${questProgress}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>

                  {/* Next Challenge */}
                  {nextChallenge ? (
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-200">
                      <p className="text-sm font-semibold text-cyan-900 uppercase mb-3">
                        🎯 Next Challenge
                      </p>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {nextChallenge.title}
                      </h3>
                      <p className="text-gray-700 mb-4">{nextChallenge.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
                          <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            {nextChallenge.xpReward} XP
                          </span>
                          <span>~{nextChallenge.estimatedMinutes} min</span>
                        </div>
                        <Button
                          onClick={() => onNavigateToChallenge(nextChallenge.challengeId)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Start Challenge
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 text-center">
                      <div className="text-5xl mb-3">🎉</div>
                      <h3 className="text-xl font-bold text-green-900 mb-2">
                        Quest Complete!
                      </h3>
                      <p className="text-green-700 mb-4">
                        You've earned the {currentQuest.badge.name} badge!
                      </p>
                      <Button
                        onClick={onNavigateToQuests}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        Start Next Quest
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* Recent Submissions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 border-4 border-blue-300 bg-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Book className="w-6 h-6 text-blue-600" />
                  Recent Work
                </h2>

                {recentSubmissions.length > 0 ? (
                  <div className="space-y-3">
                    {recentSubmissions.slice(0, 3).map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {submission.challengeTitle}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="capitalize">{submission.masteryLevel}</span>
                            <span>•</span>
                            <span>
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-700">+{submission.xpEarned} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No submissions yet. Start your first challenge!
                  </p>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Badges & Quick Actions */}
          <div className="space-y-6">
            
            {/* Badge Collection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 border-4 border-purple-300 bg-white">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-purple-600" />
                  Badge Collection
                </h2>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  {EXPLORER_BADGES.slice(0, 8).map((badge) => {
                    const earned = earnedBadges.includes(badge.badgeId);
                    return (
                      <motion.div
                        key={badge.badgeId}
                        whileHover={{ scale: earned ? 1.1 : 1 }}
                        className={`relative aspect-square rounded-xl flex items-center justify-center text-4xl ${
                          earned
                            ? `bg-gradient-to-br ${badge.color} shadow-md`
                            : 'bg-gray-200 grayscale opacity-40'
                        }`}
                      >
                        {badge.icon}
                        {!earned && (
                          <div className="absolute inset-0 bg-black/20 rounded-xl" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  className="w-full border-2 border-purple-300 hover:bg-purple-50"
                  onClick={onNavigateToPortfolio}
                >
                  View All Badges
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 border-4 border-cyan-300 bg-white">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>

                <div className="space-y-3">
                  <Button
                    onClick={onNavigateToQuests}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    View All Quests
                  </Button>

                  <Button
                    onClick={onNavigateToPortfolio}
                    variant="outline"
                    className="w-full border-2 border-cyan-300 hover:bg-cyan-50 h-12"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    My Portfolio
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Wowl AI Chat */}
            <WowlAIChat 
              studentName={studentName}
              interests={[currentQuest?.focus || 'learning']}
              currentLevel={currentLevel}
              recentTopics={[currentQuest?.theme || 'exploration']}
            />
          </div>
        </div>
      </div>
    </div>
  );
}