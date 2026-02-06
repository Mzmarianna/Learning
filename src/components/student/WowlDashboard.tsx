import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Sparkles,
  Send,
  FileText,
  Target,
  Coffee,
  Trophy,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  WowlTask, 
  WowlReport, 
  WowlAIAgent,
  generateMockWowlTasks,
  generateMockWowlReport
} from '../../lib/wowl-ai-agent';
import { User } from '../../lib/types';

interface WowlDashboardProps {
  user: User;
  onTaskComplete?: (taskId: string) => void;
}

export default function WowlDashboard({ user, onTaskComplete }: WowlDashboardProps) {
  const [tasks, setTasks] = useState<WowlTask[]>([]);
  const [reports, setReports] = useState<WowlReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<WowlReport | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'reports'>('tasks');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWowlData();
  }, [user.uid]);

  const loadWowlData = async () => {
    try {
      // Demo mode: Use mock data
      const mockTasks = generateMockWowlTasks(user.uid);
      const mockReport = generateMockWowlReport(user.uid);
      
      setTasks(mockTasks);
      setReports([mockReport]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading Wowl data:', error);
      setLoading(false);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: true, completedAt: new Date() }
          : task
      )
    );

    const task = tasks.find(t => t.id === taskId);
    if (task && onTaskComplete) {
      onTaskComplete(taskId);
    }
  };

  const getTaskIcon = (type: WowlTask['type']) => {
    switch (type) {
      case 'challenge': return <Target className="w-5 h-5" />;
      case 'practice': return <Brain className="w-5 h-5" />;
      case 'break': return <Coffee className="w-5 h-5" />;
      case 'celebration': return <Trophy className="w-5 h-5" />;
      default: return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  const getTaskColor = (type: WowlTask['type']) => {
    switch (type) {
      case 'challenge': return 'from-purple-500 to-pink-500';
      case 'practice': return 'from-cyan-500 to-blue-500';
      case 'break': return 'from-green-500 to-emerald-500';
      case 'celebration': return 'from-amber-500 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getPriorityBadge = (priority: WowlTask['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-300',
      medium: 'bg-amber-100 text-amber-700 border-amber-300',
      low: 'bg-green-100 text-green-700 border-green-300',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${colors[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'celebration': return '🎉';
      case 'strength': return '💪';
      case 'improvement': return '📈';
      case 'alert': return '⚠️';
      case 'pattern': return '🔍';
      default: return '✨';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-calm-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const totalXPAvailable = activeTasks.reduce((sum, t) => sum + t.xpReward, 0);
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Wowl Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-100 via-pink-50 to-cyan-100 border-2 border-purple-300 rounded-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="text-6xl">🦉</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-purple-900 mb-2">
              Hello, {user.displayName}! I'm Wowl 🦉
            </h2>
            <p className="text-purple-700 mb-4">
              Your AI learning companion! I create personalized tasks, track your progress, 
              and send reports to your parents and tutors so they can celebrate with you! ✨
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white bg-opacity-60 px-3 py-2 rounded-lg">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="font-semibold">{activeTasks.length} Tasks Today</span>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-60 px-3 py-2 rounded-lg">
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span className="font-semibold">{totalXPAvailable} XP Available</span>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-60 px-3 py-2 rounded-lg">
                <TrendingUp className="w-4 h-4 text-cyan-600" />
                <span className="font-semibold">{completionRate}% Complete</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === 'tasks'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-calm-surface border-2 border-calm-border hover:border-purple-400'
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="font-semibold">My Tasks</span>
          {activeTasks.length > 0 && (
            <span className="bg-white bg-opacity-30 px-2 py-1 rounded-full text-xs">
              {activeTasks.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === 'reports'
              ? 'bg-cyan-600 text-white shadow-lg'
              : 'bg-calm-surface border-2 border-calm-border hover:border-cyan-400'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="font-semibold">Progress Reports</span>
        </button>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Active Tasks */}
          {activeTasks.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Today's Tasks
              </h3>
              <div className="grid gap-4">
                <AnimatePresence>
                  {activeTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-calm-surface border-2 border-calm-border rounded-xl p-6 hover:border-purple-400 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Task Icon */}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTaskColor(task.type)} flex items-center justify-center text-white`}>
                          {getTaskIcon(task.type)}
                        </div>

                        {/* Task Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-lg font-semibold">{task.title}</h4>
                            {getPriorityBadge(task.priority)}
                          </div>
                          <p className="text-muted-foreground mb-3">{task.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{task.estimatedMinutes} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              <span className="font-semibold text-amber-600">+{task.xpReward} XP</span>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleCompleteTask(task.id)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark Complete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-calm-surface rounded-2xl border-2 border-calm-border overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1727812100173-b33044cd3071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMG5vdGVib29rJTIwc3RhcnQlMjBmcmVzaHxlbnwxfHx8fDE3NjgyNDk4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Start fresh with new tasks"
                className="w-full max-w-md h-48 object-cover rounded-xl mx-auto mb-6 opacity-60"
              />
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">
                You've completed all your tasks for today. Amazing work! 🎉
              </p>
              <p className="text-sm text-purple-600 mt-4 font-semibold">
                New tasks will appear tomorrow, or ask Wowl for bonus challenges! 💪
              </p>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Completed Today ({completedTasks.length})
              </h3>
              <div className="grid gap-3">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3 opacity-75"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">{task.title}</p>
                      <p className="text-sm text-green-700">+{task.xpReward} XP earned!</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {reports.length > 0 ? (
            <div className="grid gap-4">
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedReport(report)}
                  className="bg-calm-surface border-2 border-calm-border rounded-xl p-6 cursor-pointer hover:border-cyan-400 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">{report.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.generatedAt.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <p className="text-muted-foreground mb-4">{report.summary}</p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {report.data.xpEarned && (
                      <div className="bg-purple-100 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-purple-600">{report.data.xpEarned}</p>
                        <p className="text-xs text-purple-700">XP Earned</p>
                      </div>
                    )}
                    {report.data.challengesCompleted !== undefined && (
                      <div className="bg-pink-100 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-pink-600">{report.data.challengesCompleted}</p>
                        <p className="text-xs text-pink-700">Challenges</p>
                      </div>
                    )}
                    {report.data.streakDays && (
                      <div className="bg-cyan-100 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-cyan-600">{report.data.streakDays}</p>
                        <p className="text-xs text-cyan-700">Day Streak</p>
                      </div>
                    )}
                  </div>

                  {/* Top Insights Preview */}
                  {report.insights.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {report.insights.slice(0, 2).map((insight, idx) => (
                        <div
                          key={idx}
                          className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm flex items-center gap-2"
                        >
                          <span>{getInsightIcon(insight.type)}</span>
                          <span className="text-amber-900">{insight.message}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {report.sentAt && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                      <Send className="w-4 h-4" />
                      <span>Sent to parents & tutors</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-calm-surface rounded-2xl border-2 border-calm-border overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1628710127020-5877ea96b7de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYXNzJTIwbmF2aWdhdGlvbiUyMGpvdXJuZXl8ZW58MXx8fHwxNzY4MjQ5ODYwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Start your learning journey"
                className="w-full max-w-md h-48 object-cover rounded-xl mx-auto mb-6 opacity-60"
              />
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
              <p className="text-muted-foreground">
                I'll create your first progress report after your first learning session!
              </p>
              <p className="text-sm text-cyan-600 mt-4 font-semibold">
                Complete tasks and challenges to unlock insights and analytics 📈
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedReport(null)}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl">
                  🦉
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{selectedReport.title}</h2>
                  <p className="text-muted-foreground">{selectedReport.summary}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedReport.data.xpEarned && (
                  <div className="bg-purple-100 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-purple-600">{selectedReport.data.xpEarned}</p>
                    <p className="text-sm text-purple-700 font-semibold">XP Earned</p>
                  </div>
                )}
                {selectedReport.data.challengesCompleted !== undefined && (
                  <div className="bg-pink-100 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-pink-600">{selectedReport.data.challengesCompleted}</p>
                    <p className="text-sm text-pink-700 font-semibold">Challenges</p>
                  </div>
                )}
                {selectedReport.data.timeSpentMinutes && (
                  <div className="bg-cyan-100 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-cyan-600">{selectedReport.data.timeSpentMinutes}</p>
                    <p className="text-sm text-cyan-700 font-semibold">Minutes</p>
                  </div>
                )}
                {selectedReport.data.streakDays && (
                  <div className="bg-amber-100 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-amber-600">{selectedReport.data.streakDays}</p>
                    <p className="text-sm text-amber-700 font-semibold">Day Streak</p>
                  </div>
                )}
              </div>

              {/* Insights */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Key Insights
                </h3>
                <div className="space-y-3">
                  {selectedReport.insights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{getInsightIcon(insight.type)}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-purple-900 mb-1">{insight.message}</p>
                          {insight.suggestedAction && (
                            <p className="text-sm text-purple-700 flex items-center gap-2">
                              <ChevronRight className="w-4 h-4" />
                              {insight.suggestedAction}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-purple-600 font-semibold">
                          {insight.confidence}% sure
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {selectedReport.recommendations.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-600" />
                    What's Next?
                  </h3>
                  <div className="space-y-2">
                    {selectedReport.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 flex items-start gap-2"
                      >
                        <ChevronRight className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                        <p className="text-cyan-900">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Improved */}
              {selectedReport.data.skillsImproved && selectedReport.data.skillsImproved.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    Skills Improved
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedReport.data.skillsImproved.map((skill, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-semibold"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setSelectedReport(null)}
                  size="lg"
                  className="reward-bg text-white"
                >
                  Close Report
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}