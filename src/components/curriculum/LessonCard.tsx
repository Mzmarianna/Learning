import { motion } from 'motion/react';
import { Lesson } from '@/lib/curriculum-data';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Clock,
  Award,
  TrendingUp,
  Layers,
  Plus,
  BarChart3,
  Shapes,
  Minus,
  Copy,
  PlusCircle,
  MinusCircle,
  DollarSign,
  Wallet,
  Sparkles,
  Zap,
  Star,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LessonCardProps {
  lesson: Lesson;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  onStart?: () => void;
  onContinue?: () => void;
  onReview?: () => void;
}

// Map icon names to components
const iconMap: Record<string, any> = {
  TrendingUp,
  Layers,
  Plus,
  BarChart3,
  Shapes,
  Minus,
  Copy,
  PlusCircle,
  MinusCircle,
  DollarSign,
  Wallet,
  Sparkles,
  Zap,
  Star,
  Award,
  GraduationCap,
};

export default function LessonCard({ 
  lesson, 
  status, 
  onStart, 
  onContinue, 
  onReview 
}: LessonCardProps) {
  const BadgeIcon = iconMap[lesson.badge.icon] || Award;
  
  const statusConfig = {
    locked: {
      icon: Lock,
      iconColor: 'text-gray-400',
      borderColor: 'border-gray-300',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-500',
      buttonText: 'Locked',
      buttonDisabled: true,
    },
    available: {
      icon: Circle,
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-300',
      bgColor: 'bg-blue-50',
      textColor: 'text-gray-700',
      buttonText: 'Start Lesson',
      buttonDisabled: false,
    },
    'in-progress': {
      icon: Clock,
      iconColor: 'text-yellow-500',
      borderColor: 'border-yellow-300',
      bgColor: 'bg-yellow-50',
      textColor: 'text-gray-700',
      buttonText: 'Continue',
      buttonDisabled: false,
    },
    completed: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      borderColor: 'border-green-300',
      bgColor: 'bg-green-50',
      textColor: 'text-gray-700',
      buttonText: 'Review',
      buttonDisabled: false,
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const handleClick = () => {
    if (status === 'available' && onStart) onStart();
    else if (status === 'in-progress' && onContinue) onContinue();
    else if (status === 'completed' && onReview) onReview();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={status !== 'locked' ? { scale: 1.02 } : undefined}
      className={`${config.bgColor} border-2 ${config.borderColor} rounded-2xl p-6 transition-all ${
        status !== 'locked' ? 'cursor-pointer hover:shadow-lg' : 'opacity-60'
      }`}
      onClick={status !== 'locked' ? handleClick : undefined}
    >
      {/* Header with Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center font-bold ${config.textColor}`}>
            {lesson.number}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{lesson.title}</h3>
            <p className="text-sm text-muted-foreground">{lesson.description}</p>
          </div>
        </div>
        <StatusIcon className={`w-6 h-6 ${config.iconColor}`} />
      </div>

      {/* Skills List */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills Covered:</h4>
        <ul className="grid grid-cols-1 gap-1">
          {lesson.skills.slice(0, 3).map((skill, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-calm-primary mt-0.5">•</span>
              <span>{skill.skill}</span>
            </li>
          ))}
          {lesson.skills.length > 3 && (
            <li className="text-sm text-muted-foreground italic">
              +{lesson.skills.length - 3} more skills
            </li>
          )}
        </ul>
      </div>

      {/* Badge & Robux */}
      <div className={`flex items-center gap-3 p-3 rounded-xl border-2 ${config.borderColor} bg-white mb-4`}>
        <div className={`p-2 rounded-lg ${lesson.badge.colorClass}`}>
          <BadgeIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-gray-800">{lesson.badge.name}</div>
          <div className="text-xs text-muted-foreground">+{lesson.badge.robuxValue} Robux</div>
        </div>
        {status === 'completed' && (
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        )}
      </div>

      {/* Duration & Button */}
      <div className="flex items-center justify-between">
        {lesson.estimatedDuration && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{lesson.estimatedDuration} min</span>
          </div>
        )}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          disabled={config.buttonDisabled}
          className={`${
            status === 'completed' 
              ? 'bg-green-500 hover:bg-green-600' 
              : status === 'in-progress'
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'reward-bg'
          } text-white`}
          size="sm"
        >
          {config.buttonText}
        </Button>
      </div>

      {/* Prerequisites warning */}
      {status === 'locked' && lesson.prerequisites && (
        <div className="mt-3 text-xs text-gray-500 italic">
          Complete prerequisite lessons to unlock
        </div>
      )}
    </motion.div>
  );
}
