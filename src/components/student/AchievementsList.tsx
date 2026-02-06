import { Trophy, Star } from 'lucide-react';
import { generateMockAchievements } from '../../lib/mock-data';

interface AchievementsListProps {
  studentId: string;
}

export default function AchievementsList({ studentId }: AchievementsListProps) {
  // Use mock achievements for demo
  const achievements = generateMockAchievements(studentId);

  return (
    <div className="bg-calm-surface border-2 border-calm-border rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-reward-purple" />
        <div>
          <h2 className="text-2xl">Achievements</h2>
          <p className="text-sm text-muted-foreground">
            {achievements.length} badges unlocked
          </p>
        </div>
      </div>

      {/* Unlocked Achievements */}
      {achievements.length > 0 && (
        <div className="space-y-3 mb-8">
          <h3 className="font-semibold">Earned Badges</h3>
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center gap-4 p-4 reward-bg text-white rounded-xl shadow-lg border-2 border-reward-purple"
            >
              <div className="text-4xl">{achievement.badgeIcon}</div>
              <div className="flex-1">
                <h4 className="font-semibold">{achievement.title}</h4>
                <p className="text-sm text-white/90">{achievement.description}</p>
              </div>
              <div className="text-right">
                <Star className="w-5 h-5 inline-block mb-1" />
                <p className="text-sm xp-display">+{achievement.xpBonus} XP</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sample upcoming achievements */}
      <div className="space-y-3">
        <h3 className="font-semibold">Upcoming Achievements</h3>
        {[
          { icon: '🎯', title: 'Quest Complete', desc: 'Finish your first quest (13 more challenges!)', xp: 250 },
          { icon: '⚡', title: 'Speed Master', desc: 'Complete 5 challenges in one day', xp: 150 },
          { icon: '🌈', title: 'Rainbow Scholar', desc: 'Try all 5 subject units', xp: 200 },
        ].map((achievement, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-calm-bg border-2 border-calm-border rounded-xl opacity-60"
          >
            <div className="text-3xl">{achievement.icon}</div>
            <div className="flex-1">
              <h4 className="font-medium">{achievement.title}</h4>
              <p className="text-sm text-muted-foreground">{achievement.desc}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-reward-purple xp-display">+{achievement.xp} XP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}