import { useEffect, useState } from 'react';
import { getQuestByWeek } from '../lib/curriculum/explorers-hub-curriculum';
import { useNavigate } from 'react-router';
import TutorDashboard from '../components/dashboard/TutorDashboard';
import { useTutorDashboard } from '../hooks/useTutor';
import { useRealtimeTutorDashboard } from '../hooks/useRealtime';

export default function TutorDashboardPage() {
  const navigate = useNavigate();
  const { dashboardData, loading, refresh } = useTutorDashboard();
  const [tutorName, setTutorName] = useState('');

  useEffect(() => {
    async function loadTutorInfo() {
      const user = await getCurrentUser();
      if (user) {
        setTutorName(user.user_metadata?.display_name || 'Tutor');
        
        // Setup real-time subscriptions
        useRealtimeTutorDashboard(user.id, {
          onNewAlert: (alert) => {
            console.log('New alert:', alert);
            if (alert.alert_type === 'warning') {
              showBrowserNotification(
                '⚠️ Student Needs Attention',
                alert.message
              );
            }
            refresh();
          },
          onNewReview: () => {
            console.log('New review needed');
            showBrowserNotification(
              '📝 New Review',
              'A student has submitted work for review'
            );
            refresh();
          },
        });
      }
    }
    loadTutorInfo();
  }, [refresh]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading dashboard</h1>
          <button
            onClick={refresh}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Transform students data
  const students = dashboardData.students.map((student) => {
    const quest = student.current_quest_id
      ? getQuestByWeek(parseInt(student.current_quest_id.split('-W')[1]))
      : null;

    return {
      studentId: student.student_id,
      studentName: student.display_name,
      studentAge: student.age,
      tier: student.tier,
      currentLevel: student.current_level,
      totalXP: student.total_xp,
      challengesCompleted: student.challenges_completed,
      currentQuestName: quest?.theme || 'No active quest',
      currentQuestProgress: 0, // Calculate from quest_progress
      lastActive: new Date(student.last_active || new Date()),
      weeklyHours: 0, // From learning_sessions
      needsAttention: student.needs_attention,
      attentionReason: student.needs_attention ? 'No activity in 5+ days' : undefined,
      recentMasteryAverage: 'proficient' as const,
      parentEmail: '',
    };
  });

  return (
    <TutorDashboard
      tutorName={tutorName}
      students={students}
      pendingReviews={dashboardData.reviews || []}
      alerts={dashboardData.alerts || []}
      onViewStudent={(id) => navigate(`/tutor/student/${id}`)}
      onReviewSubmission={(id) => navigate(`/tutor/review/${id}`)}
      onMessageParent={(id) => navigate(`/messages/new?student=${id}`)}
      onCreateLesson={() => navigate('/tutor/lessons/new')}
    />
  );
}