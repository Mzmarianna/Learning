import { useNavigate } from 'react-router';
import StudentDashboard from '../components/dashboard/StudentDashboard';

export default function DemoStudentDashboardPage() {
  const navigate = useNavigate();

  // Mock data for demo mode - Explorers student with weekly schedule
  const mockDashboardData = {
    id: 'demo-student-1',
    display_name: 'Alex Explorer',
    age: 10,
    tier: 'explorers' as const,
    total_xp: 2500,
    current_level: 5,
    xpToNextLevel: 500, // 3000 (Level 6) - 2500 (current XP)
    earnedBadges: ['first-quest', 'quick-learner', 'creative-thinker'],
    current_quest_id: 'quest-fractions-real-world',
    recentSubmissions: [
      {
        id: 'sub-1',
        challengeTitle: 'Pizza Fraction Challenge',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        masteryLevel: 'mastery' as const,
        xpEarned: 150,
      },
      {
        id: 'sub-2',
        challengeTitle: 'Decimal Detective',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        masteryLevel: 'proficient' as const,
        xpEarned: 100,
      },
      {
        id: 'sub-3',
        challengeTitle: 'Build a Tiny House',
        submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
        masteryLevel: 'mastery' as const,
        xpEarned: 200,
      },
    ],
  };

  return (
    <div>
      {/* Demo Mode Banner */}
      <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-800 font-semibold">🎮 Demo Mode</span>
            <span className="text-yellow-700 text-sm">
              Exploring without Supabase - This is sample data
            </span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-yellow-700 hover:text-yellow-900 text-sm font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>

      <StudentDashboard
        studentName={mockDashboardData.display_name}
        studentAge={mockDashboardData.age}
        studentTier={mockDashboardData.tier}
        totalXP={mockDashboardData.total_xp}
        currentLevel={mockDashboardData.current_level}
        xpToNextLevel={mockDashboardData.xpToNextLevel}
        completedChallenges={mockDashboardData.earnedBadges}
        earnedBadges={mockDashboardData.earnedBadges}
        currentQuestId={mockDashboardData.current_quest_id}
        recentSubmissions={mockDashboardData.recentSubmissions}
        onNavigateToQuests={() => navigate('/demo/quests')}
        onNavigateToChallenge={(id) => alert(`Demo: Would navigate to challenge ${id}`)}
        onNavigateToPortfolio={() => alert('Demo: Portfolio not available in demo mode')}
      />
    </div>
  );
}