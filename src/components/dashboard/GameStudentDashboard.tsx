import { useNavigate } from 'react-router';
import { Crown, Sparkles, Zap, Trophy, Star, Gamepad2, Rocket, Target, BookOpen, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { XPBar } from '../game-ui/XPBar';
import { LevelBadge } from '../game-ui/LevelBadge';
import { GameButton } from '../game-ui/GameButton';
import { GameCard } from '../game-ui/GameCard';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface GameStudentDashboardProps {
  studentName: string;
  studentAge?: number;
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  completedChallenges: any[];
  earnedBadges: any[];
  currentQuestId?: string;
  recentSubmissions: any[];
  studentTier?: string;
}

export default function GameStudentDashboard({
  studentName,
  studentAge,
  totalXP,
  currentLevel,
  xpToNextLevel,
  completedChallenges,
  earnedBadges,
  currentQuestId,
  recentSubmissions,
  studentTier = 'free',
}: GameStudentDashboardProps) {
  const navigate = useNavigate();

  const currentLevelXP = totalXP % xpToNextLevel;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-cyan-50">
      {/* Hero Header - Game Style */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10"><Star className="size-16" fill="white" /></div>
          <div className="absolute top-20 right-20"><Trophy className="size-20" fill="white" /></div>
          <div className="absolute bottom-10 left-1/3"><Crown className="size-24" /></div>
          <div className="absolute bottom-20 right-10"><Sparkles className="size-16" fill="white" /></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Welcome & Stats */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Welcome Message */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="size-8 text-yellow-300 animate-pulse" fill="currentColor" />
                  <span className="text-xl font-medium opacity-90">Welcome back, Hero!</span>
                </div>
                <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'var(--font-title)' }}>
                  {studentName}
                </h1>
                {studentAge && (
                  <p className="text-white/80 text-lg">Age {studentAge} • Learning Warrior</p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border-2 border-white/30">
                  <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-xp)' }}>
                    {totalXP.toLocaleString()}
                  </div>
                  <div className="text-sm opacity-90">Total XP</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border-2 border-white/30">
                  <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-xp)' }}>
                    {completedChallenges.length}
                  </div>
                  <div className="text-sm opacity-90">Quests Done</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border-2 border-white/30">
                  <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-xp)' }}>
                    {earnedBadges.length}
                  </div>
                  <div className="text-sm opacity-90">Badges</div>
                </div>
              </div>

              {/* XP Bar */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/30">
                <XPBar
                  currentXP={currentLevelXP}
                  maxXP={xpToNextLevel}
                  level={currentLevel}
                  size="lg"
                  animated={true}
                />
              </div>
            </motion.div>

            {/* Right: Level Badge & Quick Actions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center gap-6"
            >
              <LevelBadge
                level={currentLevel}
                title={getLevelTitle(currentLevel)}
                size="xl"
                animated={true}
                showGlow={true}
              />

              {/* Tier Badge */}
              {studentTier !== 'free' && (
                <div className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-bold text-lg shadow-xl border-4 border-white">
                  <span className="flex items-center gap-2">
                    <Crown className="size-6" fill="currentColor" />
                    {studentTier.charAt(0).toUpperCase() + studentTier.slice(1)} Member
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-purple-900" style={{ fontFamily: 'var(--font-title)' }}>
            <span className="flex items-center gap-3">
              <Rocket className="size-8 text-purple-600" />
              Quick Actions
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <GameCard
              title="Continue Quest"
              description="Pick up where you left off"
              icon={Gamepad2}
              gradient="from-purple-500 to-pink-500"
              onClick={() => navigate(currentQuestId ? `/quest/${currentQuestId}` : '/quests')}
            >
              <GameButton variant="primary" size="md" icon={Rocket} className="w-full">
                {currentQuestId ? 'Resume' : 'Browse Quests'}
              </GameButton>
            </GameCard>

            <GameCard
              title="View All Quests"
              description="Explore available adventures"
              icon={BookOpen}
              gradient="from-cyan-500 to-purple-500"
              stats={[
                { label: 'Available', value: '50+' },
                { label: 'Completed', value: completedChallenges.length },
              ]}
              onClick={() => navigate('/quests')}
            >
              <GameButton variant="cyan" size="md" icon={Target} className="w-full">
                Explore
              </GameButton>
            </GameCard>

            <GameCard
              title="My Achievements"
              description="View your earned badges"
              icon={Trophy}
              gradient="from-yellow-400 to-orange-500"
              badge={`${earnedBadges.length} Earned`}
              onClick={() => {
                // Navigate to achievements section
                document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <GameButton variant="gold" size="md" icon={Award} className="w-full">
                View All
              </GameButton>
            </GameCard>
          </div>
        </motion.div>

        {/* Current Progress */}
        {currentQuestId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-purple-900" style={{ fontFamily: 'var(--font-title)' }}>
              <span className="flex items-center gap-3">
                <Target className="size-8 text-cyan-600" />
                Current Quest
              </span>
            </h2>

            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-2" style={{ fontFamily: 'var(--font-title)' }}>
                    Quest in Progress
                  </h3>
                  <p className="text-gray-600">Keep going! You're doing amazing! 🌟</p>
                </div>
                <GameButton
                  variant="primary"
                  size="lg"
                  icon={Rocket}
                  onClick={() => navigate(`/quest/${currentQuestId}`)}
                >
                  Continue
                </GameButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Activity */}
        {recentSubmissions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-purple-900" style={{ fontFamily: 'var(--font-title)' }}>
              <span className="flex items-center gap-3">
                <Zap className="size-8 text-pink-600" />
                Recent Activity
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {recentSubmissions.slice(0, 4).map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-purple-900 mb-1">{submission.challengeTitle}</h4>
                      <p className="text-sm text-gray-600">{submission.questTitle}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      submission.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : submission.status === 'needs_revision'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {submission.status === 'approved' ? '✅ Approved' : submission.status === 'needs_revision' ? '📝 Revise' : '⏳ Pending'}
                    </div>
                  </div>
                  {submission.xpEarned > 0 && (
                    <div className="flex items-center gap-2 text-yellow-600 font-bold">
                      <Zap className="size-4" fill="currentColor" />
                      <span>+{submission.xpEarned} XP</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Achievements Section */}
        <motion.div
          id="achievements"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-purple-900" style={{ fontFamily: 'var(--font-title)' }}>
            <span className="flex items-center gap-3">
              <Trophy className="size-8 text-yellow-600" />
              Your Achievements
            </span>
          </h2>

          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {earnedBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.05, type: 'spring', stiffness: 200 }}
                  className="bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 p-1 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer"
                >
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="text-4xl mb-2">{badge.icon || '🏆'}</div>
                    <div className="text-xs font-bold text-purple-900 line-clamp-2">{badge.name}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 shadow-xl border-4 border-purple-200 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-purple-900 mb-2" style={{ fontFamily: 'var(--font-title)' }}>
                Start Your Journey!
              </h3>
              <p className="text-gray-600 mb-6">
                Complete quests to earn your first badges and achievements
              </p>
              <GameButton
                variant="primary"
                size="lg"
                icon={Rocket}
                onClick={() => navigate('/quests')}
              >
                Begin Quest
              </GameButton>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function getLevelTitle(level: number): string {
  if (level >= 50) return 'Legend';
  if (level >= 40) return 'Master';
  if (level >= 30) return 'Champion';
  if (level >= 20) return 'Hero';
  if (level >= 10) return 'Warrior';
  if (level >= 5) return 'Adventurer';
  return 'Novice';
}
