import { motion } from 'motion/react';
import { Trophy, Users, Sparkles, TrendingUp } from 'lucide-react';
import { CLANS, getClanColorClasses } from '../../lib/clan-system';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface ClanWidgetProps {
  studentClanId: string;
  clanPoints: number;
  weeklyContribution: number;
  rank: number;
  totalMembers: number;
}

export function ClanWidget({
  studentClanId,
  clanPoints,
  weeklyContribution,
  rank,
  totalMembers,
}: ClanWidgetProps) {
  const clan = CLANS[studentClanId];
  const colors = getClanColorClasses(studentClanId);

  if (!clan) return null;

  // Calculate weekly progress (out of 100 for display)
  const weeklyGoal = 100;
  const weeklyProgress = Math.min((weeklyContribution / weeklyGoal) * 100, 100);

  return (
    <Card className="overflow-hidden border-2" style={{ borderColor: `var(--${clan.color}-500)` }}>
      {/* Header with clan colors */}
      <div className={`${colors.bg} p-4 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{clan.icon}</span>
            <div>
              <h3 className="font-bold text-lg">{clan.name}</h3>
              <p className="text-xs opacity-90">Your Learning Clan</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Trophy className="w-3 h-3 mr-1" />
            Rank #{rank}
          </Badge>
        </div>
        
        <p className="text-sm opacity-90">{clan.description}</p>
      </div>

      {/* Mascot & Values */}
      <div className="p-4 bg-gradient-to-br from-cyan-50 to-purple-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-4xl">{clan.mascot.split(' ')[0]}</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">
              {clan.mascot.split(' ').slice(1).join(' ')}
            </p>
            <p className="text-xs text-gray-600">Clan Mascot</p>
          </div>
        </div>

        {/* Clan Values */}
        <div className="flex flex-wrap gap-1.5">
          {clan.values.map((value) => (
            <Badge
              key={value}
              variant="outline"
              className={`text-xs ${colors.text} ${colors.border}`}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {value}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-4 space-y-4">
        {/* Total Clan Points */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Total Clan Points</span>
            <span className={`font-bold ${colors.text}`}>{clanPoints.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Users className="w-4 h-4" />
            <span>{totalMembers} members contributing</span>
          </div>
        </div>

        {/* Your Weekly Contribution */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Your Weekly Contribution</span>
            <span className="font-semibold text-gray-900">
              {weeklyContribution} / {weeklyGoal} pts
            </span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            {weeklyProgress >= 100 
              ? '🎉 Goal reached! Amazing work!'
              : `${Math.round(weeklyGoal - weeklyContribution)} more points to reach your goal!`
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${colors.bg} ${colors.hover} text-white rounded-lg py-2 px-3 text-sm font-medium flex items-center justify-center gap-1.5`}
          >
            <Users className="w-4 h-4" />
            Clan Feed
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 px-3 text-sm font-medium flex items-center justify-center gap-1.5"
          >
            <TrendingUp className="w-4 h-4" />
            Leaderboard
          </motion.button>
        </div>
      </div>

      {/* Fun Clan Fact */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-r from-cyan-50 to-purple-50 rounded-lg p-3 border-2 border-dashed border-cyan-200">
          <p className="text-xs font-semibold text-cyan-700 mb-1">💡 Clan Wisdom</p>
          <p className="text-xs text-gray-700 italic">
            "{getClanWisdom(studentClanId)}"
          </p>
        </div>
      </div>
    </Card>
  );
}

/**
 * Get motivational wisdom for each clan
 */
function getClanWisdom(clanId: string): string {
  const wisdom: Record<string, string[]> = {
    explorers: [
      'The best questions often lead to the most amazing discoveries!',
      'Every mistake is just a discovery in disguise.',
      'Curiosity is your superpower - use it every day!',
    ],
    creators: [
      'Your imagination is the only limit to what you can create.',
      'Every great invention started as a wild idea.',
      'The world needs your unique creative genius!',
    ],
    helpers: [
      'When you help others learn, you learn twice as much.',
      'Kindness and teamwork make everything possible.',
      'Your support makes someone else braver today.',
    ],
    champions: [
      'Every challenge you face makes you stronger.',
      'Persistence turns dreams into reality.',
      'You are braver than you think and stronger than you know!',
    ],
  };

  const messages = wisdom[clanId] || wisdom.explorers;
  return messages[Math.floor(Math.random() * messages.length)];
}
