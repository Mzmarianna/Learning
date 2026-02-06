import { useNavigate } from 'react-router';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import GameStudentDashboard from '../components/dashboard/GameStudentDashboard';
import { useStudentDashboard } from '../hooks/useStudent';
import { useRealtimeStudentDashboard } from '../hooks/useRealtime';
import { showBrowserNotification } from '../hooks/useRealtime';
import LoadingScreen from '../components/common/LoadingScreen';
import { getCurrentUser } from '../lib/supabase/auth';

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const { dashboardData, loading, refresh } = useStudentDashboard();

  // Real-time updates - call the hook directly in the component body
  useRealtimeStudentDashboard(dashboardData?.id || '', {
    onSubmissionUpdate: () => {
      console.log('Submission updated - refreshing...');
      refresh();
    },
    onQuestProgressUpdate: () => {
      console.log('Quest progress updated - refreshing...');
      refresh();
    },
    onBadgeEarned: (badge) => {
      console.log('Badge earned!', badge);
      showBrowserNotification(
        '🏆 Badge Earned!',
        `You earned the ${badge.badge_id} badge!`
      );
      refresh();
    },
    onXPChange: (data) => {
      console.log('XP changed:', data);
      if (data.currentLevel > (dashboardData?.current_level || 0)) {
        showBrowserNotification(
          '⬆️ Level Up!',
          `You reached Level ${data.currentLevel}!`
        );
      }
      refresh();
    },
  });

  if (loading) {
    return <LoadingScreen />;
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error loading dashboard
          </h1>
          <button
            onClick={() => refresh()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate completed challenges from quest progress
  const completedChallenges = dashboardData.earnedBadges || [];

  return (
    <GameStudentDashboard
      studentName={dashboardData.display_name}
      studentAge={dashboardData.age}
      studentTier={dashboardData.tier}
      totalXP={dashboardData.total_xp}
      currentLevel={dashboardData.current_level}
      xpToNextLevel={dashboardData.xpToNextLevel}
      completedChallenges={completedChallenges}
      earnedBadges={dashboardData.earnedBadges}
      currentQuestId={dashboardData.current_quest_id || ''}
      recentSubmissions={dashboardData.recentSubmissions.map((s) => ({
        id: s.id,
        challengeTitle: s.challenge_title,
        questTitle: s.quest_title || 'Quest',
        submittedAt: new Date(s.submitted_at),
        status: s.status || 'pending',
        xpEarned: s.xp_earned || 0,
      }))}
    />
  );
}