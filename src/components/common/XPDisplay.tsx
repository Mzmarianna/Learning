import { Sparkles } from 'lucide-react';
import { formatXP } from '../../lib/xp-calculator';

interface XPDisplayProps {
  totalXP: number;
  xpToNextLevel: number;
  percentToNextLevel: number;
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export default function XPDisplay({
  totalXP,
  xpToNextLevel,
  percentToNextLevel,
  level,
  size = 'md',
  showProgress = true,
}: XPDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const progressHeight = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="bg-calm-surface border-2 border-calm-border rounded-xl p-4">
      {/* XP Display */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full reward-bg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total XP</p>
            <p className={`xp-display ${sizeClasses[size]} text-reward-purple`}>
              {formatXP(totalXP)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Level</p>
          <p className={`xp-display ${sizeClasses[size]} text-calm-primary-dark`}>
            {level}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && level < 6 && (
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Progress to Level {level + 1}</span>
            <span>{percentToNextLevel}%</span>
          </div>
          <div className={`${progressHeight[size]} bg-calm-border rounded-full overflow-hidden`}>
            <div
              className="h-full reward-bg transition-all duration-500 ease-out rounded-full"
              style={{ width: `${percentToNextLevel}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {formatXP(xpToNextLevel)} XP to next level
          </p>
        </div>
      )}

      {/* Max Level Message */}
      {level === 6 && (
        <div className="text-center">
          <p className="text-sm text-reward-purple font-medium">
            🏆 Maximum Level Reached!
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Keep learning to unlock more achievements
          </p>
        </div>
      )}
    </div>
  );
}
