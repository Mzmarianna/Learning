import { useState } from 'react';
import { Level, Lesson, calculateRobuxEarned } from '@/lib/curriculum-data';
import LevelOverview from './LevelOverview';
import LessonCard from './LessonCard';
import RedemptionOptions from './RedemptionOptions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Award, ShoppingBag } from 'lucide-react';

interface CurriculumViewerProps {
  level: Level;
  completedLessonIds?: string[];
  currentLessonId?: string;
  onStartLesson?: (lesson: Lesson) => void;
  onContinueLesson?: (lesson: Lesson) => void;
  onReviewLesson?: (lesson: Lesson) => void;
}

export default function CurriculumViewer({
  level,
  completedLessonIds = [],
  currentLessonId,
  onStartLesson,
  onContinueLesson,
  onReviewLesson,
}: CurriculumViewerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'rewards'>('overview');
  
  const totalRobuxEarned = calculateRobuxEarned(completedLessonIds);

  // Determine lesson status
  const getLessonStatus = (lesson: Lesson): 'locked' | 'available' | 'in-progress' | 'completed' => {
    // Check if completed
    if (completedLessonIds.includes(lesson.id)) {
      return 'completed';
    }

    // Check if in progress
    if (currentLessonId === lesson.id) {
      return 'in-progress';
    }

    // Check prerequisites
    if (lesson.prerequisites && lesson.prerequisites.length > 0) {
      const allPrereqsComplete = lesson.prerequisites.every(prereqId =>
        completedLessonIds.includes(prereqId)
      );
      if (!allPrereqsComplete) {
        return 'locked';
      }
    }

    // Check if it's the first lesson or sequential
    const lessonIndex = level.lessons.findIndex(l => l.id === lesson.id);
    if (lessonIndex === 0) {
      return 'available';
    }

    // For lessons without explicit prerequisites, require previous lesson completion
    const previousLesson = level.lessons[lessonIndex - 1];
    if (previousLesson && !completedLessonIds.includes(previousLesson.id)) {
      return 'locked';
    }

    return 'available';
  };

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3 bg-calm-surface border-2 border-calm-border">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Lessons ({level.lessons.length})</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Rewards</span>
            {totalRobuxEarned >= level.redemptionThreshold && (
              <span className="ml-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            )}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <LevelOverview
            level={level}
            completedLessons={completedLessonIds.length}
            totalRobuxEarned={totalRobuxEarned}
          />
        </TabsContent>

        {/* Lessons Tab */}
        <TabsContent value="lessons" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">All Lessons</h2>
                <p className="text-muted-foreground">
                  {completedLessonIds.length} of {level.lessons.length} completed
                </p>
              </div>
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl px-4 py-2">
                <div className="text-2xl font-bold text-purple-600">{totalRobuxEarned}</div>
                <div className="text-xs text-muted-foreground">Robux Earned</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {level.lessons.map((lesson) => {
                const status = getLessonStatus(lesson);
                return (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    status={status}
                    onStart={() => onStartLesson?.(lesson)}
                    onContinue={() => onContinueLesson?.(lesson)}
                    onReview={() => onReviewLesson?.(lesson)}
                  />
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="mt-6">
          <RedemptionOptions
            level={level}
            totalRobuxEarned={totalRobuxEarned}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
