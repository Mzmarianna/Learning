/**
 * EXPLORERS OF KNOWLEDGE: WEEKLY LESSON SCHEDULE
 * Ages 8-12 (3rd-5th grade competencies)
 * Monday: Math | Tuesday: Writing | Wednesday: STEAM | Thursday: Reading
 */

export interface PracticeGame {
  name: string;
  url: string;
  description: string;
  gameType: 'interactive' | 'practice' | 'visual' | 'challenge';
  estimatedMinutes: number;
  icon: string; // emoji
}

export interface WeeklyLesson {
  id: string;
  week: number;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  subject: 'Math' | 'Writing' | 'Reading' | 'STEAM';
  title: string;
  description: string;
  startTime: string; // Format: "12:00"
  endTime: string;   // Format: "12:25"
  xpReward: number;
  materials?: string[];
  objectives?: string[];
  practiceGames?: PracticeGame[];
  googleMeetLink?: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  completedAt?: Date;
}

export interface WeekSchedule {
  weekNumber: number;
  weekTheme: string;
  lessons: WeeklyLesson[];
  totalXP: number;
  questId?: string; // Links to EXPLORERS_HUB_CURRICULUM
}

// ============================================================================
// WEEK 1: FRACTIONS & DECIMALS CROSS-CURRICULAR THEME
// ============================================================================

export const EXPLORERS_WEEK_1: WeekSchedule = {
  weekNumber: 1,
  weekTheme: 'Fractions and Decimals in the Real World',
  questId: 'EH-W1-FOUNDATIONS',
  lessons: [
    {
      id: 'EXP-W1-MON',
      week: 1,
      day: 'Monday',
      subject: 'Math',
      title: 'Understanding Fractions and Decimals',
      description: 'Explore how fractions and decimals represent parts of a whole. Learn to convert between the two and apply them to real-world situations.',
      startTime: '12:00',
      endTime: '12:25',
      xpReward: 75,
      materials: [
        'Fraction circles or paper for folding',
        'Ruler with decimal measurements',
        'Calculator',
        'Worksheet (provided)',
      ],
      objectives: [
        'Understand fractions as parts of a whole',
        'Convert simple fractions to decimals (1/2 = 0.5, 1/4 = 0.25)',
        'Identify fractions and decimals on a number line',
        'Solve real-world problems using fractions and decimals',
      ],
      practiceGames: [
        {
          name: 'Math Playground - Fraction Games',
          url: 'https://www.mathplayground.com/index_fractions.html',
          description: 'Visual, kid-friendly games with number lines, pizza fractions, and matching activities',
          gameType: 'visual',
          estimatedMinutes: 15,
          icon: '🎮',
        },
        {
          name: 'SplashLearn - Fractions',
          url: 'https://www.splashlearn.com/fraction-games-for-kids',
          description: 'Grade-based practice with progress tracking and fun challenges',
          gameType: 'practice',
          estimatedMinutes: 20,
          icon: '💦',
        },
        {
          name: 'Khan Academy - Fractions',
          url: 'https://www.khanacademy.org/math/arithmetic/fraction-arithmetic',
          description: 'Step-by-step practice with hints and video explanations',
          gameType: 'practice',
          estimatedMinutes: 25,
          icon: '🎓',
        },
        {
          name: 'Toy Theater - Fractions',
          url: 'https://toytheater.com/category/teachers/fractions/',
          description: 'Simple, visual fraction tools and mini-games for exploration',
          gameType: 'visual',
          estimatedMinutes: 10,
          icon: '🎭',
        },
        {
          name: 'ABCya - Fraction Games',
          url: 'https://www.abcya.com/games/category/fractions',
          description: 'Game-style activities perfect for elementary grades',
          gameType: 'interactive',
          estimatedMinutes: 15,
          icon: '🎯',
        },
      ],
      status: 'upcoming',
      googleMeetLink: 'PLACEHOLDER_MEET_LINK_MON',
    },
    {
      id: 'EXP-W1-TUE',
      week: 1,
      day: 'Tuesday',
      subject: 'Writing',
      title: 'Descriptive Writing on Geometric Shapes',
      description: 'Practice descriptive writing by exploring the properties of shapes divided into fractional parts. Use precise mathematical language in creative writing.',
      startTime: '12:00',
      endTime: '12:25',
      xpReward: 75,
      materials: [
        'Paper and pencil',
        'Colored pencils or markers',
        'Ruler',
        'Examples of geometric art (provided)',
      ],
      objectives: [
        'Use descriptive language to explain shapes and their parts',
        'Write clear, detailed descriptions using mathematical vocabulary',
        'Practice organizing ideas with topic sentences and supporting details',
        'Connect math concepts (fractions) to creative expression',
      ],
      status: 'upcoming',
      googleMeetLink: 'PLACEHOLDER_MEET_LINK_TUE',
    },
    {
      id: 'EXP-W1-WED',
      week: 1,
      day: 'Wednesday',
      subject: 'STEAM',
      title: 'Baking Project: Measuring with Fractions',
      description: 'Apply fractions and measurements in a hands-on baking project. Learn how engineers and chefs use precise measurements to create consistent results.',
      startTime: '12:00',
      endTime: '12:25',
      xpReward: 100,
      materials: [
        'Simple recipe (cookies or muffins)',
        'Measuring cups (1 cup, 1/2 cup, 1/4 cup, 1/3 cup)',
        'Measuring spoons',
        'Mixing bowl and utensils',
        'Ingredients (flour, sugar, butter, etc.)',
        'Camera to document process',
      ],
      objectives: [
        'Use fractional measurements accurately',
        'Understand the importance of precision in recipes',
        'Double or halve a recipe using fraction operations',
        'Document the scientific process with photos',
        'Explain how temperature and time affect chemical reactions',
      ],
      status: 'upcoming',
      googleMeetLink: 'PLACEHOLDER_MEET_LINK_WED',
    },
    {
      id: 'EXP-W1-THU',
      week: 1,
      day: 'Thursday',
      subject: 'Reading',
      title: 'Fractions and Decimals in Cooking',
      description: 'Read informational texts about cooking measurements and recipe scaling. Practice comprehension strategies and identify key mathematical concepts in real-world contexts.',
      startTime: '12:00',
      endTime: '12:25',
      xpReward: 75,
      materials: [
        'Recipe article (provided)',
        'Highlighters',
        'Reading comprehension worksheet',
        'Dictionary for vocabulary',
      ],
      objectives: [
        'Read and comprehend informational text',
        'Identify main ideas and supporting details',
        'Understand domain-specific vocabulary (halve, double, ratio, proportion)',
        'Make connections between reading and real-life applications',
        'Answer text-based questions with evidence',
      ],
      status: 'upcoming',
      googleMeetLink: 'PLACEHOLDER_MEET_LINK_THU',
    },
  ],
  totalXP: 325,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getTodaysLesson(schedule: WeekSchedule, dayOfWeek: string): WeeklyLesson | null {
  const days: Record<number, string> = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    0: 'Sunday',
  };
  
  const today = new Date();
  const todayName = days[today.getDay()];
  
  return schedule.lessons.find(lesson => lesson.day === todayName) || null;
}

export function getUpcomingLessons(schedule: WeekSchedule): WeeklyLesson[] {
  return schedule.lessons.filter(lesson => lesson.status === 'upcoming');
}

export function getCompletedLessons(schedule: WeekSchedule): WeeklyLesson[] {
  return schedule.lessons.filter(lesson => lesson.status === 'completed');
}

export function calculateWeekProgress(schedule: WeekSchedule): number {
  const completed = schedule.lessons.filter(l => l.status === 'completed').length;
  const total = schedule.lessons.length;
  return Math.round((completed / total) * 100);
}

export function getNextLesson(schedule: WeekSchedule): WeeklyLesson | null {
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date();
  const todayIndex = today.getDay();
  
  // Find the next upcoming lesson
  for (let i = 0; i < dayOrder.length; i++) {
    const checkDay = dayOrder[(todayIndex + i) % dayOrder.length];
    const lesson = schedule.lessons.find(
      l => l.day === checkDay && l.status === 'upcoming'
    );
    if (lesson) return lesson;
  }
  
  return null;
}

export function markLessonCompleted(lessonId: string, schedule: WeekSchedule): WeekSchedule {
  return {
    ...schedule,
    lessons: schedule.lessons.map(lesson =>
      lesson.id === lessonId
        ? { ...lesson, status: 'completed' as const, completedAt: new Date() }
        : lesson
    ),
  };
}

export function getSubjectColor(subject: WeeklyLesson['subject']): string {
  switch (subject) {
    case 'Math':
      return 'from-cyan-500 to-blue-500';
    case 'Reading':
      return 'from-purple-500 to-pink-500';
    case 'Writing':
      return 'from-amber-500 to-orange-500';
    case 'STEAM':
      return 'from-emerald-500 to-teal-500';
    default:
      return 'from-gray-500 to-gray-600';
  }
}

export function getSubjectIcon(subject: WeeklyLesson['subject']): string {
  switch (subject) {
    case 'Math':
      return '🔢';
    case 'Reading':
      return '📖';
    case 'Writing':
      return '✏️';
    case 'STEAM':
      return '🔬';
    default:
      return '📚';
  }
}

// ============================================================================
// FUTURE WEEKS (To be expanded)
// ============================================================================

export const EXPLORERS_WEEKLY_SCHEDULES: WeekSchedule[] = [
  EXPLORERS_WEEK_1,
  // Week 2: Ancient Civilizations theme
  // Week 3: Landforms theme
  // Week 4: States of Matter theme
  // ... etc.
];

export function getWeekSchedule(weekNumber: number): WeekSchedule | null {
  return EXPLORERS_WEEKLY_SCHEDULES.find(w => w.weekNumber === weekNumber) || null;
}

export function getCurrentWeekSchedule(): WeekSchedule {
  // In production, this would check student's current week in curriculum
  // For now, default to Week 1
  return EXPLORERS_WEEK_1;
}