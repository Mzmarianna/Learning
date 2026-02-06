import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

export default function ParentDashboardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dashboardData, loading, refresh } = useParentDashboard();
  const [parentName, setParentName] = useState('');

  useEffect(() => {
    async function loadParentInfo() {
      const user = await getCurrentUser();
      if (user) {
        setParentName(user.user_metadata?.display_name || 'Parent');
      }
    }
    loadParentInfo();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!dashboardData.children || dashboardData.children.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No children linked to your account
          </h1>
          <p className="text-gray-600 mb-6">
            Link a student account to start monitoring their progress.
          </p>
          <button
            onClick={() => navigate('/link-child')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Link Child Account
          </button>
        </div>
      </div>
    );
  }

  // Transform children data
  const children = dashboardData.children.map((child) => {
    const quest = child.current_quest_id
      ? getQuestByWeek(parseInt(child.current_quest_id.split('-W')[1]))
      : null;

    return {
      childId: child.student_id,
      childName: child.display_name,
      childAge: child.age,
      tier: child.tier,
      totalXP: child.total_xp,
      currentLevel: child.current_level,
      badgesEarned: child.badges_earned || 0,
      challengesCompleted: child.challenges_completed || 0,
      currentQuestName: quest?.theme || 'No active quest',
      currentQuestProgress: 0, // Calculate from data
      weeklyHoursLearning: 0, // From learning_sessions
      lastActive: new Date(child.last_active || new Date()),
      recentMasteryLevels: [
        { subject: 'STEAM', level: 'proficient' as const },
        { subject: 'Math', level: 'developing' as const },
        { subject: 'Writing', level: 'emerging' as const },
      ],
      parentEmail: '',
    };
  });

  const childId = searchParams.get('childId');
  const viewMode = searchParams.get('view'); // 'assessment' or default dashboard

  // If viewing assessment for a specific child
  if (viewMode === 'assessment' && childId) {
    return (
      <div>
        <div className="fixed top-4 left-4 z-40">
          <button
            onClick={() => navigate('/dashboard/parent')}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors text-sm font-medium text-gray-700"
          >
            ← Back to Dashboard
          </button>
        </div>
        <StudentAssessmentView
          studentId={childId}
          onDownloadReport={() => {
            alert('Downloading full assessment report for student: ' + childId);
          }}
        />
      </div>
    );
  }

  return (
    <ParentDashboard
      parentName={parentName}
      children={children}
      recentActivity={dashboardData.activity || []}
      onViewChild={(id) => navigate(`/dashboard/parent?view=assessment&childId=${id}`)}
      onViewSubmission={(childId, subId) => navigate(`/submission/${subId}`)}
      onMessageTutor={(id) => navigate(`/messages/new?student=${id}`)}
      onDownloadReport={(id) => {
        // TODO: Implement PDF download
        alert('Downloading report for student: ' + id);
      }}
    />
  );
}