import { motion } from 'motion/react';
import {
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingDown,
  MessageSquare,
  FileText,
  Target,
  Award,
  Calendar,
  Filter,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { useState } from 'react';

interface StudentOverview {
  studentId: string;
  studentName: string;
  studentAge: number;
  tier: string;
  currentLevel: number;
  totalXP: number;
  challengesCompleted: number;
  currentQuestName: string;
  currentQuestProgress: number;
  lastActive: Date;
  weeklyHours: number;
  needsAttention: boolean;
  attentionReason?: string;
  recentMasteryAverage: 'emerging' | 'developing' | 'proficient' | 'advanced' | 'mastered';
  parentEmail: string;
}

interface PendingReview {
  submissionId: string;
  studentName: string;
  challengeTitle: string;
  submittedAt: Date;
  type: 'manual-review' | 'resubmission' | 'portfolio';
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  studentName: string;
  message: string;
  timestamp: Date;
  actionable: boolean;
}

interface TutorDashboardProps {
  tutorName: string;
  students: StudentOverview[];
  pendingReviews: PendingReview[];
  alerts: Alert[];
  onViewStudent: (studentId: string) => void;
  onReviewSubmission: (submissionId: string) => void;
  onMessageParent: (studentId: string) => void;
  onCreateLesson: () => void;
}

const MASTERY_COLORS = {
  emerging: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  developing: 'bg-blue-100 text-blue-800 border-blue-300',
  proficient: 'bg-green-100 text-green-800 border-green-300',
  advanced: 'bg-purple-100 text-purple-800 border-purple-300',
  mastered: 'bg-pink-100 text-pink-800 border-pink-300',
};

export default function TutorDashboard({
  tutorName,
  students,
  pendingReviews,
  alerts,
  onViewStudent,
  onReviewSubmission,
  onMessageParent,
  onCreateLesson,
}: TutorDashboardProps) {
  const [filterNeedsAttention, setFilterNeedsAttention] = useState(false);

  // Calculate stats
  const totalStudents = students.length;
  const activeThisWeek = students.filter(
    s => new Date().getTime() - new Date(s.lastActive).getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;
  const needsAttention = students.filter(s => s.needsAttention).length;
  const totalPendingReviews = pendingReviews.length;

  // Filter students
  const filteredStudents = filterNeedsAttention
    ? students.filter(s => s.needsAttention)
    : students;

  // Sort alerts by priority
  const sortedAlerts = [...alerts].sort((a, b) => {
    const priority = { warning: 0, info: 1, success: 2 };
    return priority[a.type] - priority[b.type];
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tutor Dashboard 👨‍🏫
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, {tutorName}! Here's your teaching overview.
          </p>
        </motion.div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-4 border-blue-300">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Total Students</p>
                  <p className="text-3xl font-bold">{totalStudents}</p>
                </div>
              </div>
              <p className="text-sm opacity-90">{activeThisWeek} active this week</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-amber-500 to-orange-500 text-white border-4 border-amber-300">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Needs Attention</p>
                  <p className="text-3xl font-bold">{needsAttention}</p>
                </div>
              </div>
              <p className="text-sm opacity-90">Students requiring support</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-4 border-purple-300">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Pending Reviews</p>
                  <p className="text-3xl font-bold">{totalPendingReviews}</p>
                </div>
              </div>
              <p className="text-sm opacity-90">Submissions awaiting review</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white border-4 border-green-300">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">All Clear</p>
                  <p className="text-3xl font-bold">{totalStudents - needsAttention}</p>
                </div>
              </div>
              <p className="text-sm opacity-90">Students on track</p>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="bg-white border-2 border-indigo-200 p-1">
            <TabsTrigger value="students" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Pending Reviews ({totalPendingReviews})
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
              <AlertCircle className="w-4 h-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="lessons" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Lessons
            </TabsTrigger>
          </TabsList>

          {/* STUDENTS TAB */}
          <TabsContent value="students">
            <Card className="p-6 border-4 border-indigo-300 bg-white">
              
              {/* Filter */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Student Overview</h2>
                <Button
                  variant={filterNeedsAttention ? 'default' : 'outline'}
                  onClick={() => setFilterNeedsAttention(!filterNeedsAttention)}
                  className={filterNeedsAttention ? 'bg-orange-500 hover:bg-orange-600' : ''}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {filterNeedsAttention ? 'Show All' : 'Needs Attention Only'}
                </Button>
              </div>

              {/* Students Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStudents.map((student) => (
                  <motion.div
                    key={student.studentId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      className={`p-5 border-2 transition-all ${
                        student.needsAttention
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-indigo-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              {student.studentName}
                            </h3>
                            {student.needsAttention && (
                              <Badge className="bg-orange-500">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Attention
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <span>Age {student.studentAge}</span>
                            <span>•</span>
                            <span>Level {student.currentLevel}</span>
                            <span>•</span>
                            <span className="capitalize">{student.tier}</span>
                          </div>
                          {student.needsAttention && student.attentionReason && (
                            <p className="text-sm text-orange-700 font-medium mb-2">
                              ⚠️ {student.attentionReason}
                            </p>
                          )}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-lg border-2 text-xs font-semibold capitalize ${
                            MASTERY_COLORS[student.recentMasteryAverage]
                          }`}
                        >
                          {student.recentMasteryAverage}
                        </div>
                      </div>

                      {/* Current Quest */}
                      <div className="bg-white rounded-lg p-3 border border-indigo-200 mb-3">
                        <p className="text-xs font-semibold text-indigo-700 uppercase mb-1">
                          Current Quest
                        </p>
                        <p className="font-medium text-gray-900 text-sm mb-2">
                          {student.currentQuestName}
                        </p>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            style={{ width: `${student.currentQuestProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-purple-50 rounded p-2 text-center border border-purple-200">
                          <p className="text-xs text-gray-600">XP</p>
                          <p className="font-bold text-purple-700">{student.totalXP}</p>
                        </div>
                        <div className="bg-green-50 rounded p-2 text-center border border-green-200">
                          <p className="text-xs text-gray-600">Completed</p>
                          <p className="font-bold text-green-700">{student.challengesCompleted}</p>
                        </div>
                        <div className="bg-blue-50 rounded p-2 text-center border border-blue-200">
                          <p className="text-xs text-gray-600">This Week</p>
                          <p className="font-bold text-blue-700">{student.weeklyHours}h</p>
                        </div>
                      </div>

                      {/* Last Active */}
                      <p className="text-xs text-gray-500 mb-3">
                        Last active: {new Date(student.lastActive).toLocaleDateString()}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onViewStudent(student.studentId)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onMessageParent(student.studentId)}
                          className="border-indigo-300"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredStudents.length === 0 && (
                <p className="text-gray-600 text-center py-8">
                  {filterNeedsAttention
                    ? '🎉 Great! No students need attention right now.'
                    : 'No students to display.'}
                </p>
              )}
            </Card>
          </TabsContent>

          {/* PENDING REVIEWS TAB */}
          <TabsContent value="reviews">
            <Card className="p-6 border-4 border-purple-300 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Reviews</h2>

              {pendingReviews.length > 0 ? (
                <div className="space-y-3">
                  {pendingReviews.map((review) => (
                    <motion.div
                      key={review.submissionId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200 hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-900">{review.studentName}</h3>
                          <Badge
                            className={
                              review.type === 'manual-review'
                                ? 'bg-orange-500'
                                : review.type === 'resubmission'
                                ? 'bg-blue-500'
                                : 'bg-purple-500'
                            }
                          >
                            {review.type === 'manual-review'
                              ? 'Manual Review'
                              : review.type === 'resubmission'
                              ? 'Resubmission'
                              : 'Portfolio'}
                          </Badge>
                        </div>
                        <p className="text-gray-700">{review.challengeTitle}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted: {new Date(review.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => onReviewSubmission(review.submissionId)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        Review Now
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-xl font-bold text-gray-900 mb-2">All caught up!</p>
                  <p className="text-gray-600">No submissions pending review.</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* ALERTS TAB */}
          <TabsContent value="alerts">
            <Card className="p-6 border-4 border-amber-300 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">System Alerts</h2>

              {sortedAlerts.length > 0 ? (
                <div className="space-y-3">
                  {sortedAlerts.map((alert) => {
                    const styles = {
                      warning: 'bg-orange-50 border-orange-300',
                      info: 'bg-blue-50 border-blue-300',
                      success: 'bg-green-50 border-green-300',
                    };

                    const icons = {
                      warning: <AlertCircle className="w-6 h-6 text-orange-600" />,
                      info: <Clock className="w-6 h-6 text-blue-600" />,
                      success: <CheckCircle2 className="w-6 h-6 text-green-600" />,
                    };

                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-start gap-4 p-4 rounded-lg border-2 ${styles[alert.type]}`}
                      >
                        {icons[alert.type]}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-bold text-gray-900">{alert.studentName}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(alert.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-gray-700">{alert.message}</p>
                        </div>
                        {alert.actionable && (
                          <Button size="sm" variant="outline">
                            Take Action
                          </Button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No alerts at this time</p>
              )}
            </Card>
          </TabsContent>

          {/* LESSONS TAB */}
          <TabsContent value="lessons">
            <Card className="p-6 border-4 border-green-300 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Lesson Planning</h2>
                <Button
                  onClick={onCreateLesson}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Create New Lesson
                </Button>
              </div>

              {/* Quick Lesson Templates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Writing Workshop</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Guide students through expository writing
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Use Template
                  </Button>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-4xl mb-3">🔬</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">STEAM Lab</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Hands-on science experiment session
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Use Template
                  </Button>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-4xl mb-3">🔢</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Math Mastery</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Problem-solving practice session
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Use Template
                  </Button>
                </Card>
              </div>

              {/* Upcoming Sessions */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Upcoming Sessions
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                    <div>
                      <p className="font-semibold text-gray-900">Small Group Math - Fractions</p>
                      <p className="text-sm text-gray-600">Tuesday, 3:00 PM • 4 students</p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                    <div>
                      <p className="font-semibold text-gray-900">1-on-1: Writing Support</p>
                      <p className="text-sm text-gray-600">Thursday, 2:00 PM • 1 student</p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
