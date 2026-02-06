import { motion } from 'motion/react';
import { Play, CheckCircle, Clock, Zap, Trophy, BookOpen } from 'lucide-react';
import { QuestAssignment } from '../../lib/quest-assignment-service';
import { Button } from '../ui/button';
import type { Level } from '../../lib/curriculum-data';

interface AssignedQuestCardProps {
  assignment: QuestAssignment;
  onStartQuest: () => void;
}

export default function AssignedQuestCard({ assignment, onStartQuest }: AssignedQuestCardProps) {
  const quest = assignment.questData as Level;
  const totalLessons = quest?.lessons?.length || 16;
  const completedLessons = assignment.lessonsCompleted.length;
  const progressPercent = (completedLessons / totalLessons) * 100;

  const getStatusColor = () => {
    switch (assignment.status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'in-progress':
        return 'from-purple-500 to-pink-500';
      case 'assigned':
        return 'from-cyan-500 to-blue-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (assignment.status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6" />;
      case 'in-progress':
        return <Zap className="w-6 h-6 animate-pulse" />;
      case 'assigned':
        return <Clock className="w-6 h-6" />;
      default:
        return <BookOpen className="w-6 h-6" />;
    }
  };

  const getStatusText = () => {
    switch (assignment.status) {
      case 'completed':
        return 'Quest Complete!';
      case 'in-progress':
        return 'In Progress';
      case 'assigned':
        return 'Ready to Start';
      default:
        return 'Pending';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-4 border-purple-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-shadow"
    >
      {/* Header with Status Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-xl bg-gradient-to-r ${getStatusColor()} text-white`}>
              {getStatusIcon()}
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">{getStatusText()}</span>
              <p className="text-xs text-gray-500">Assigned {formatDate(assignment.assignedAt)}</p>
            </div>
          </div>
        </div>
        
        {assignment.status === 'completed' && (
          <div className="flex items-center gap-1 bg-green-100 border-2 border-green-400 rounded-full px-3 py-1">
            <Trophy className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-green-700">COMPLETE</span>
          </div>
        )}
      </div>

      {/* Quest Title */}
      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
        {assignment.questTitle}
      </h3>

      {/* Quest Description */}
      {quest?.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {quest.description}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Progress: {completedLessons} / {totalLessons} Lessons
          </span>
          <span className="text-sm font-bold text-purple-600">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${getStatusColor()}`}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-3 text-center">
          <p className="text-xs text-cyan-700 font-semibold mb-1">XP EARNED</p>
          <p className="text-2xl font-bold text-cyan-600">{assignment.xpEarned}</p>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-3 text-center">
          <p className="text-xs text-purple-700 font-semibold mb-1">TOTAL XP</p>
          <p className="text-2xl font-bold text-purple-600">{quest?.totalRobux || 1600}</p>
        </div>
        <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-3 text-center">
          <p className="text-xs text-pink-700 font-semibold mb-1">TIME</p>
          <p className="text-2xl font-bold text-pink-600">{assignment.estimatedTimeMinutes}m</p>
        </div>
      </div>

      {/* Competencies Targeted */}
      {assignment.competenciesTargeted && assignment.competenciesTargeted.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">SKILLS YOU'LL MASTER:</p>
          <div className="flex flex-wrap gap-2">
            {assignment.competenciesTargeted.slice(0, 3).map((compId, idx) => (
              <div key={idx} className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-full px-3 py-1">
                <span className="text-xs font-medium text-purple-700">
                  {compId.split('-').pop()?.replace(/-/g, ' ').toUpperCase()}
                </span>
              </div>
            ))}
            {assignment.competenciesTargeted.length > 3 && (
              <div className="bg-gray-100 border border-gray-300 rounded-full px-3 py-1">
                <span className="text-xs font-medium text-gray-600">
                  +{assignment.competenciesTargeted.length - 3} more
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      {assignment.status !== 'completed' && (
        <Button
          onClick={onStartQuest}
          className={`w-full h-12 text-lg font-bold bg-gradient-to-r ${getStatusColor()} text-white hover:opacity-90 transition-opacity shadow-lg`}
        >
          <Play className="w-5 h-5 mr-2" />
          {assignment.status === 'in-progress' ? 'Continue Quest' : 'Start Quest'}
        </Button>
      )}

      {assignment.status === 'completed' && assignment.completedAt && (
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 text-center">
          <p className="font-bold text-green-700 mb-1">🎉 Completed!</p>
          <p className="text-sm text-green-600">
            Finished on {assignment.completedAt.toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Assigned By Badge */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>
          Assigned by: <strong className="text-purple-600">
            {assignment.assignedBy === 'placement-quiz' && '🎯 Placement Quiz'}
            {assignment.assignedBy === 'auto-progression' && '⚡ Auto-Progression'}
            {assignment.assignedBy === 'tutor' && '👩‍🏫 Your Tutor'}
            {assignment.assignedBy === 'wowl-ai' && '🦉 Wowl AI'}
            {assignment.assignedBy === 'parent' && '👪 Your Parent'}
          </strong>
        </span>
        <span className="bg-gray-100 px-2 py-1 rounded-full">
          Level: <strong>{assignment.difficulty.toUpperCase()}</strong>
        </span>
      </div>
    </motion.div>
  );
}
