import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MathCurriculum, calculateOverallProgress, canAccessLevel } from '@/lib/curriculum-index';
import { Level } from '@/lib/curriculum-data';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  CheckCircle2, 
  PlayCircle, 
  Trophy, 
  Award,
  BookOpen,
  Coins,
  TrendingUp,
  Star,
  ChevronRight
} from 'lucide-react';

interface AllLevelsOverviewProps {
  studentProgress: {
    [levelId: string]: {
      completedLessons: string[];
      totalLessons: number;
      currentLessonId?: string | null;
    };
  };
  onSelectLevel?: (levelId: string) => void;
}

export default function AllLevelsOverview({ 
  studentProgress, 
  onSelectLevel 
}: AllLevelsOverviewProps) {
  const overallProgress = calculateOverallProgress(studentProgress);
  const completedLevelIds = Object.entries(studentProgress)
    .filter(([_, progress]) => progress.completedLessons.length === progress.totalLessons)
    .map(([levelId]) => levelId);

  const getLevelStatus = (level: Level): 'locked' | 'available' | 'in-progress' | 'completed' => {
    const progress = studentProgress[level.id];
    
    if (!progress || progress.completedLessons.length === 0) {
      // Check if level is accessible
      return canAccessLevel(level.id, completedLevelIds) ? 'available' : 'locked';
    }
    
    if (progress.completedLessons.length === level.lessons.length) {
      return 'completed';
    }
    
    return 'in-progress';
  };

  const statusConfig = {
    locked: {
      icon: Lock,
      iconColor: 'text-gray-400',
      borderColor: 'border-gray-300',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      buttonText: 'Locked',
      buttonDisabled: true,
    },
    available: {
      icon: PlayCircle,
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-300',
      bgColor: 'bg-blue-50',
      textColor: 'text-gray-700',
      buttonText: 'Start Level',
      buttonDisabled: false,
    },
    'in-progress': {
      icon: BookOpen,
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

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-cyan-100 via-purple-100 to-pink-100 border-2 border-purple-300 rounded-3xl p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 text-center">
            🎓 My Math Learning Journey
          </h1>
          <p className="text-xl text-gray-700 text-center mb-6">
            Master math from counting to multiplication - one level at a time!
          </p>

          {/* Overall Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 text-center border-2 border-purple-200"
            >
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-purple-600">
                {overallProgress.currentLevel}
              </div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 text-center border-2 border-blue-200"
            >
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-600">
                {overallProgress.completedLessons}
              </div>
              <div className="text-sm text-muted-foreground">
                of {overallProgress.totalLessons} Lessons
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-4 text-center border-2 border-yellow-200"
            >
              <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-yellow-600">
                {overallProgress.totalRobuxEarned}
              </div>
              <div className="text-sm text-muted-foreground">Robux Earned</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 text-center border-2 border-green-200"
            >
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600">
                {overallProgress.percentComplete}%
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </motion.div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-6 bg-white rounded-xl p-4 border-2 border-purple-200">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-sm font-semibold text-purple-600">
                {overallProgress.completedLessons} / {overallProgress.totalLessons} lessons
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress.percentComplete}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Level Cards */}
      <div className="space-y-6">
        {MathCurriculum.map((level, index) => {
          const status = getLevelStatus(level);
          const config = statusConfig[status];
          const StatusIcon = config.icon;
          const progress = studentProgress[level.id];
          const completionPercent = progress 
            ? Math.round((progress.completedLessons.length / level.lessons.length) * 100)
            : 0;
          const robuxEarned = progress ? progress.completedLessons.length * 100 : 0;

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${config.bgColor} border-2 ${config.borderColor} rounded-2xl p-6 transition-all ${
                status !== 'locked' ? 'hover:shadow-lg' : 'opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                {/* Level Info */}
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center`}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{level.number}</div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold text-gray-800">{level.title}</h2>
                      <StatusIcon className={`w-6 h-6 ${config.iconColor}`} />
                    </div>
                    <p className="text-gray-600 mb-3">{level.description}</p>
                    
                    {/* Progress Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span className={config.textColor}>
                          {progress?.completedLessons.length || 0} / {level.lessons.length} lessons
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className={config.textColor}>
                          {robuxEarned} / {level.totalRobux} Robux
                        </span>
                      </div>
                      {status === 'completed' && (
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <Trophy className="w-4 h-4" />
                          <span>Graduated!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => onSelectLevel?.(level.id)}
                  disabled={config.buttonDisabled}
                  className={`${
                    status === 'completed'
                      ? 'bg-green-500 hover:bg-green-600'
                      : status === 'in-progress'
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : status === 'available'
                      ? 'reward-bg'
                      : 'bg-gray-300'
                  } text-white`}
                >
                  {config.buttonText}
                  {status !== 'locked' && <ChevronRight className="w-4 h-4 ml-1" />}
                </Button>
              </div>

              {/* Progress Bar */}
              {status !== 'locked' && (
                <div className="bg-white rounded-xl p-3 border-2 border-calm-border">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">Level Progress</span>
                    <span className="text-xs font-semibold text-purple-600">{completionPercent}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Locked Message */}
              {status === 'locked' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                  <Lock className="w-4 h-4" />
                  <span>Complete Level {level.number - 1} to unlock this level</span>
                </div>
              )}

              {/* Learning Objectives Preview */}
              {status === 'available' && (
                <div className="mt-4 pt-4 border-t border-calm-border">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">What you'll learn:</h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {level.learningObjectives.slice(0, 4).map((objective, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 text-center">
        <h3 className="text-2xl font-bold mb-2">
          {overallProgress.percentComplete === 100
            ? '🎉 Amazing! You completed ALL levels!'
            : overallProgress.percentComplete >= 50
            ? '🚀 You\'re more than halfway there!'
            : overallProgress.percentComplete > 0
            ? '💪 Keep going! Every lesson counts!'
            : '🌟 Start your math adventure today!'}
        </h3>
        <p className="text-purple-100">
          {overallProgress.percentComplete === 100
            ? 'You\'re a true math master! Share your achievement with your family!'
            : `${overallProgress.totalLessons - overallProgress.completedLessons} lessons remaining until mastery!`}
        </p>
      </div>
    </div>
  );
}
