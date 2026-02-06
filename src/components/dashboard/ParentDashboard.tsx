import { motion } from 'motion/react';
import {
  Users,
  TrendingUp,
  Clock,
  Target,
  Award,
  MessageSquare,
  Calendar,
  ChevronRight,
  Download,
  Eye,
  Brain,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useState } from 'react';
import StudentAssessmentView from '../parent/StudentAssessmentView';

interface ChildProgress {
  childId: string;
  childName: string;
  childAge: number;
  tier: string;
  totalXP: number;
  currentLevel: number;
  badgesEarned: number;
  challengesCompleted: number;
  currentQuestName: string;
  currentQuestProgress: number;
  weeklyHoursLearning: number;
  lastActive: Date;
  recentMasteryLevels: {
    subject: string;
    level: 'emerging' | 'developing' | 'proficient' | 'advanced' | 'mastered';
  }[];
}

interface RecentActivity {
  id: string;
  childName: string;
  type: 'submission' | 'badge' | 'level-up' | 'quest-complete';
  title: string;
  timestamp: Date;
  details?: string;
}

interface ParentDashboardProps {
  parentName: string;
  children: ChildProgress[];
  recentActivity: RecentActivity[];
  onViewChild: (childId: string) => void;
  onViewSubmission: (childId: string, submissionId: string) => void;
  onMessageTutor: (childId: string) => void;
  onDownloadReport: (childId: string) => void;
}

const MASTERY_COLORS = {
  emerging: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  developing: 'bg-blue-100 text-blue-800 border-blue-300',
  proficient: 'bg-green-100 text-green-800 border-green-300',
  advanced: 'bg-purple-100 text-purple-800 border-purple-300',
  mastered: 'bg-pink-100 text-pink-800 border-pink-300',
};

const MASTERY_ICONS = {
  emerging: '🌱',
  developing: '🌿',
  proficient: '✅',
  advanced: '⭐',
  mastered: '🏆',
};

export default function ParentDashboard({
  parentName,
  children,
  recentActivity,
  onViewChild,
  onViewSubmission,
  onMessageTutor,
  onDownloadReport,
}: ParentDashboardProps) {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(
    children.length > 0 ? children[0].childId : null
  );

  const selectedChild = children.find(c => c.childId === selectedChildId);

  // Calculate totals
  const totalXPAllChildren = children.reduce((sum, child) => sum + child.totalXP, 0);
  const totalBadges = children.reduce((sum, child) => sum + child.badgesEarned, 0);
  const totalChallenges = children.reduce((sum, child) => sum + child.challengesCompleted, 0);
  const totalHoursThisWeek = children.reduce((sum, child) => sum + child.weeklyHoursLearning, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Parent Dashboard 👨‍👩‍👧‍👦
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, {parentName}! Here's how your {children.length > 1 ? 'children are' : 'child is'} doing.
          </p>
        </motion.div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-4 border-yellow-300">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Total XP</p>
                  <p className="text-3xl font-bold">{totalXPAllChildren}</p>
                </div>
              </div>
              <p className="text-sm opacity-90">Across all children</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-4 border-purple-300">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Badges</p>
                  <p className="text-3xl font-bold">{totalBadges}</p>
                </div>
              </div>
              <p className="text-sm opacity-90">Earned together</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white border-4 border-green-300">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Challenges</p>
                  <p className="text-3xl font-bold">{totalChallenges}</p>
                </div>
              </div>
              <p className="text-sm opacity-90">Completed</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-4 border-blue-300">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">This Week</p>
                  <p className="text-3xl font-bold">{totalHoursThisWeek}h</p>
                </div>
              </div>
              <p className="text-sm opacity-90">Learning time</p>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="children" className="space-y-6">
          <TabsList className="bg-white border-2 border-indigo-200 p-1">
            <TabsTrigger value="children" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Children
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Recent Activity
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          {/* CHILDREN TAB */}
          <TabsContent value="children" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Child Selector */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Select a Child</h2>
                {children.map((child) => (
                  <motion.div
                    key={child.childId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all border-2 ${
                        selectedChildId === child.childId
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      onClick={() => setSelectedChildId(child.childId)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{child.childName}</h3>
                        <span className="text-2xl">
                          {child.tier === 'explorers' ? '🎒' : child.tier === 'warriors' ? '⚔️' : '🌟'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Age {child.childAge} • Level {child.currentLevel}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                          {child.badgesEarned} badges
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                          {child.challengesCompleted} challenges
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Selected Child Details */}
              {selectedChild && (
                <div className="lg:col-span-2 space-y-4">
                  
                  {/* Current Quest */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="p-6 border-4 border-purple-300 bg-white">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {selectedChild.childName}'s Progress
                      </h2>

                      <div className="space-y-4">
                        {/* Current Quest */}
                        <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                          <p className="text-sm font-semibold text-purple-700 uppercase mb-2">
                            Current Quest
                          </p>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {selectedChild.currentQuestName}
                          </h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium text-gray-700">
                              <span>Progress</span>
                              <span>{Math.round(selectedChild.currentQuestProgress)}%</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${selectedChild.currentQuestProgress}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Mastery Levels by Subject */}
                        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                          <p className="text-sm font-semibold text-blue-700 uppercase mb-3">
                            Recent Mastery Levels
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedChild.recentMasteryLevels.map((mastery, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg border-2 text-center ${MASTERY_COLORS[mastery.level]}`}
                              >
                                <div className="text-2xl mb-1">
                                  {MASTERY_ICONS[mastery.level]}
                                </div>
                                <p className="text-xs font-semibold mb-1">{mastery.subject}</p>
                                <p className="text-xs capitalize">{mastery.level}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                            <p className="text-sm font-semibold text-gray-600 mb-1">Total XP</p>
                            <p className="text-2xl font-bold text-yellow-700">{selectedChild.totalXP}</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                            <p className="text-sm font-semibold text-gray-600 mb-1">This Week</p>
                            <p className="text-2xl font-bold text-green-700">
                              {selectedChild.weeklyHoursLearning}h
                            </p>
                          </div>
                        </div>

                        {/* Last Active */}
                        <div className="text-sm text-gray-600">
                          Last active: {new Date(selectedChild.lastActive).toLocaleString()}
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="p-6 border-4 border-cyan-300 bg-white">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => onViewChild(selectedChild.childId)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          onClick={() => onDownloadReport(selectedChild.childId)}
                          variant="outline"
                          className="border-2 border-blue-300 hover:bg-blue-50"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Report
                        </Button>
                        <Button
                          onClick={() => onMessageTutor(selectedChild.childId)}
                          variant="outline"
                          className="border-2 border-green-300 hover:bg-green-50"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message Tutor
                        </Button>
                        <Button
                          variant="outline"
                          className="border-2 border-purple-300 hover:bg-purple-50"
                        >
                          <Award className="w-4 h-4 mr-2" />
                          View Portfolio
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ACTIVITY TAB */}
          <TabsContent value="activity">
            <Card className="p-6 border-4 border-indigo-300 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>

              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity) => {
                    const iconMap = {
                      submission: '📝',
                      badge: '🏆',
                      'level-up': '⬆️',
                      'quest-complete': '✅',
                    };

                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200 hover:bg-indigo-100 transition-colors"
                      >
                        <div className="text-3xl">{iconMap[activity.type]}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{activity.childName}</p>
                              <p className="text-gray-700">{activity.title}</p>
                              {activity.details && (
                                <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No recent activity</p>
              )}
            </Card>
          </TabsContent>

          {/* INSIGHTS TAB */}
          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Learning Patterns */}
              <Card className="p-6 border-4 border-purple-300 bg-white">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  Learning Patterns
                </h2>
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm font-semibold text-gray-600 mb-1">Peak Learning Time</p>
                    <p className="text-lg font-bold text-purple-700">2:00 PM - 4:00 PM</p>
                    <p className="text-sm text-gray-600 mt-1">Most submissions happen during this window</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-gray-600 mb-1">Favorite Subjects</p>
                    <p className="text-lg font-bold text-blue-700">STEAM & Math</p>
                    <p className="text-sm text-gray-600 mt-1">Highest engagement and mastery</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm font-semibold text-gray-600 mb-1">Average Session</p>
                    <p className="text-lg font-bold text-green-700">45 minutes</p>
                    <p className="text-sm text-gray-600 mt-1">Great focus and attention span</p>
                  </div>
                </div>
              </Card>

              {/* Strengths & Growth Areas */}
              <Card className="p-6 border-4 border-green-300 bg-white">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-green-600" />
                  Strengths & Growth
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-green-700 uppercase mb-2">💪 Strengths</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>Consistently achieves "Proficient" or higher in STEAM</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>Strong problem-solving in hands-on projects</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        <span>Excellent weekly streak consistency</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-700 uppercase mb-2">🌱 Growth Areas</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-blue-600">→</span>
                        <span>Writing challenges take longer to complete</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-blue-600">→</span>
                        <span>Consider resubmitting for higher mastery levels</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}