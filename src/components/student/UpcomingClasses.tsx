import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Video, Clock, User, ExternalLink, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import {
  SkoolClass,
  SkoolAssignment,
  getMockUpcomingClasses,
  getMockAssignments,
  getTodayClasses,
  formatClassTime,
  getTimeUntilClass,
  joinGoogleMeet,
  generateGoogleCalendarLink,
} from '../../lib/skool-integration';

interface UpcomingClassesProps {
  studentId: string;
}

export default function UpcomingClasses({ studentId }: UpcomingClassesProps) {
  const [classes, setClasses] = useState<SkoolClass[]>([]);
  const [assignments, setAssignments] = useState<SkoolAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClassesAndAssignments();
  }, [studentId]);

  const loadClassesAndAssignments = async () => {
    try {
      // Demo mode: Load mock data
      const upcomingClasses = getMockUpcomingClasses(studentId);
      const studentAssignments = getMockAssignments(studentId);
      
      setClasses(upcomingClasses);
      setAssignments(studentAssignments);
      setLoading(false);
    } catch (error) {
      console.error('Error loading classes:', error);
      setLoading(false);
    }
  };

  const todayClasses = getTodayClasses(classes);
  const pendingAssignments = assignments.filter(a => !a.submitted);

  const getCategoryColor = (category: SkoolClass['category']) => {
    switch (category) {
      case 'reading': return 'from-purple-500 to-pink-500';
      case 'math': return 'from-cyan-500 to-blue-500';
      case 'spelling': return 'from-amber-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category: SkoolClass['category']) => {
    switch (category) {
      case 'reading': return '📖';
      case 'math': return '🔢';
      case 'spelling': return '✏️';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-calm-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's Classes */}
      {todayClasses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            Today's Live Classes
          </h2>
          <div className="grid gap-4">
            {todayClasses.map((classItem) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-4 border-purple-300 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getCategoryColor(classItem.category)} flex items-center justify-center text-4xl flex-shrink-0`}>
                    {getCategoryIcon(classItem.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{classItem.title}</h3>
                    <p className="text-gray-600 mb-4">{classItem.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold">
                          {formatClassTime(classItem.startTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-600" />
                        <span>{classItem.tutorName}</span>
                      </div>
                      <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                        {getTimeUntilClass(classItem.startTime)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => joinGoogleMeet(classItem.googleMeetLink || '')}
                        disabled={!classItem.googleMeetLink}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                      >
                        <Video className="w-5 h-5 mr-2" />
                        Join Class
                      </Button>
                      <Button
                        onClick={() => window.open(generateGoogleCalendarLink(classItem), '_blank')}
                        variant="outline"
                        className="border-2 border-purple-300"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Classes (Not Today) */}
      {classes.filter(c => !todayClasses.includes(c)).length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-600" />
            This Week's Classes
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {classes
              .filter(c => !todayClasses.includes(c))
              .map((classItem) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-calm-surface border-2 border-calm-border rounded-xl p-4 hover:border-cyan-400 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{getCategoryIcon(classItem.category)}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{classItem.title}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(classItem.startTime).toLocaleDateString()} at {formatClassTime(classItem.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>{classItem.tutorName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Pending Assignments */}
      {pendingAssignments.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <ExternalLink className="w-6 h-6 text-amber-600" />
            Assignments from SKOOL
          </h2>
          <div className="space-y-3">
            {pendingAssignments.map((assignment) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{assignment.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{assignment.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-amber-700 font-semibold">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full font-semibold">
                        {assignment.points} XP
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => window.open('PLACEHOLDER_SKOOL_ASSIGNMENT_URL', '_blank')}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in SKOOL
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Migration Notice */}
          <div className="mt-4 bg-cyan-50 border-2 border-cyan-200 rounded-xl p-4 flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <p className="text-sm text-cyan-900">
                <strong>Coming Soon:</strong> Submit assignments right here in the app! For now, complete them in SKOOL.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {classes.length === 0 && assignments.length === 0 && (
        <div className="text-center py-12 bg-calm-surface rounded-2xl border-2 border-calm-border">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2">No Upcoming Classes</h3>
          <p className="text-gray-600">
            Your tutor will schedule your first class soon!
          </p>
        </div>
      )}
    </div>
  );
}
