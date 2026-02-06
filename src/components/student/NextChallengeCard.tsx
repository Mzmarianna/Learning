import { motion } from 'motion/react';
import { Play, Palette, Gamepad2, Video, Hammer, Eye, Ear, Hand, Brain, Heart } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export type MultisensoryType = 'visual' | 'auditory' | 'kinesthetic' | 'tactile' | 'creative' | 'game';

export interface MultisensoryActivity {
  type: MultisensoryType;
  title: string;
  description: string;
  icon: JSX.Element;
  estimatedTime: string;
  materials?: string[];
}

export interface NextChallengeCardProps {
  challengeTitle: string;
  theme: string;
  subject: 'math' | 'reading' | 'writing' | 'steam' | 'play';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  activities: MultisensoryActivity[];
  onStartChallenge?: () => void;
}

export function NextChallengeCard({
  challengeTitle,
  theme,
  subject,
  difficulty,
  xpReward,
  activities,
  onStartChallenge,
}: NextChallengeCardProps) {
  const subjectColors: Record<string, { bg: string; text: string; border: string }> = {
    math: { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-300' },
    reading: { bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-300' },
    writing: { bg: 'bg-purple-500', text: 'text-purple-700', border: 'border-purple-300' },
    steam: { bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-300' },
    play: { bg: 'bg-pink-500', text: 'text-pink-700', border: 'border-pink-300' },
  };

  const colors = subjectColors[subject];

  const difficultyEmoji: Record<string, string> = {
    easy: '⭐',
    medium: '⭐⭐',
    hard: '⭐⭐⭐',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-2 border-cyan-200 shadow-lg">
        {/* Header */}
        <div className={`${colors.bg} text-white p-4`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <Badge variant="secondary" className="bg-white/20 text-white mb-2">
                📚 {theme}
              </Badge>
              <h3 className="font-bold text-xl mb-1">{challengeTitle}</h3>
              <p className="text-sm opacity-90">Your next adventure awaits!</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">+{xpReward}</div>
                  <div className="text-xs opacity-90">XP</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {subject.toUpperCase()}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {difficultyEmoji[difficulty]} {difficulty}
            </Badge>
          </div>
        </div>

        {/* Multisensory Activities */}
        <div className="p-4 bg-gradient-to-br from-cyan-50 to-purple-50">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-800">
              Choose Your Learning Adventure
            </h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Pick how you want to learn! Every brain is different, so choose what works best for you:
          </p>

          <div className="space-y-3">
            {activities.map((activity, index) => (
              <MultisensoryActivityOption
                key={index}
                activity={activity}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Genius Builder Section */}
        <div className="p-4 bg-white border-t-2 border-cyan-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-2xl">🌟</div>
            <div>
              <h4 className="font-semibold text-gray-800">Your Inner Genius</h4>
              <p className="text-xs text-gray-600">
                Every child is a genius - let's help yours shine!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-2 text-center">
              <Brain className="w-5 h-5 mx-auto mb-1 text-cyan-600" />
              <p className="text-xs font-medium text-gray-700">Think</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 text-center">
              <Hand className="w-5 h-5 mx-auto mb-1 text-purple-600" />
              <p className="text-xs font-medium text-gray-700">Create</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-2 text-center">
              <Heart className="w-5 h-5 mx-auto mb-1 text-pink-600" />
              <p className="text-xs font-medium text-gray-700">Grow</p>
            </div>
          </div>

          <Button
            onClick={onStartChallenge}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 text-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Learning Adventure!
          </Button>
        </div>

        {/* Teacher's Note */}
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border-2 border-dashed border-amber-200">
            <p className="text-xs font-semibold text-amber-700 mb-1">
              🦉 Wowl's Wisdom
            </p>
            <p className="text-xs text-gray-700">
              "Remember: There's no wrong way to learn! Try different activities and discover what helps you understand best. Your genius is unique!"
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/**
 * Individual multisensory activity option
 */
function MultisensoryActivityOption({
  activity,
  index,
}: {
  activity: MultisensoryActivity;
  index: number;
}) {
  const typeIcons: Record<MultisensoryType, { icon: JSX.Element; color: string; label: string }> = {
    visual: {
      icon: <Eye className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      label: 'See & Learn',
    },
    auditory: {
      icon: <Ear className="w-4 h-4" />,
      color: 'bg-green-100 text-green-700 border-green-300',
      label: 'Listen & Learn',
    },
    kinesthetic: {
      icon: <Hand className="w-4 h-4" />,
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      label: 'Move & Learn',
    },
    tactile: {
      icon: <Hammer className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      label: 'Touch & Build',
    },
    creative: {
      icon: <Palette className="w-4 h-4" />,
      color: 'bg-pink-100 text-pink-700 border-pink-300',
      label: 'Create & Express',
    },
    game: {
      icon: <Gamepad2 className="w-4 h-4" />,
      color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
      label: 'Play & Discover',
    },
  };

  const typeInfo = typeIcons[activity.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg p-3 border-2 border-gray-200 hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className={`${typeInfo.color} rounded-lg p-2 border-2`}>
          {activity.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-semibold text-gray-800 text-sm">{activity.title}</h5>
            <Badge variant="outline" className="text-xs">
              {activity.estimatedTime}
            </Badge>
          </div>
          
          <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={`text-xs ${typeInfo.color} border-0`}>
              {typeInfo.icon}
              <span className="ml-1">{typeInfo.label}</span>
            </Badge>
            
            {activity.materials && activity.materials.length > 0 && (
              <span className="text-xs text-gray-500">
                📦 {activity.materials.length} materials needed
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Example usage data
 */
export const EXAMPLE_NEXT_CHALLENGE: NextChallengeCardProps = {
  challengeTitle: 'The Great Garden Adventure',
  theme: 'Plants & Growing Things',
  subject: 'steam',
  difficulty: 'medium',
  xpReward: 150,
  activities: [
    {
      type: 'visual',
      title: 'Watch: How Plants Grow',
      description: 'Watch an animated video showing how seeds become plants with music and colors',
      icon: <Video className="w-4 h-4" />,
      estimatedTime: '10 min',
    },
    {
      type: 'kinesthetic',
      title: 'Activity: Plant Your Own Seed',
      description: 'Get your hands dirty! Plant a real seed and watch it grow over the next week',
      icon: <Hand className="w-4 h-4" />,
      estimatedTime: '20 min',
      materials: ['Seed', 'Soil', 'Small pot', 'Water'],
    },
    {
      type: 'game',
      title: 'Game: Garden Builder',
      description: 'Play an interactive game where you design your own magical garden',
      icon: <Gamepad2 className="w-4 h-4" />,
      estimatedTime: '15 min',
    },
    {
      type: 'creative',
      title: 'Create: Draw Your Dream Garden',
      description: 'Draw or paint what your garden would look like if you could grow anything!',
      icon: <Palette className="w-4 h-4" />,
      estimatedTime: '25 min',
      materials: ['Paper', 'Crayons/markers', 'Imagination'],
    },
  ],
  onStartChallenge: () => {
    console.log('Starting challenge!');
  },
};
