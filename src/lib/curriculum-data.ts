// Curriculum Data Types and Structure for Mz. Marianna's Academy

export interface LessonSkill {
  skill: string;
}

export interface FeedbackPrompt {
  type: 'success' | 'encouragement' | 'hint' | 'retry';
  message: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide-react icon name
  colorClass: string;
  robuxValue: number;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  description: string;
  skills: LessonSkill[];
  feedbackPrompts: FeedbackPrompt[];
  badge: Badge;
  estimatedDuration?: number; // in minutes
  prerequisites?: string[]; // lesson IDs
}

export interface RedemptionOption {
  id: string;
  category: 'avatar' | 'gamepass' | 'special';
  name: string;
  description: string;
  robuxCost: number;
  icon: string;
}

export interface Level {
  id: string;
  number: number;
  title: string;
  subject: 'math' | 'reading' | 'science' | 'coding';
  description: string;
  learningObjectives: string[];
  assessmentMethods: string[];
  rewardFeatures: string[];
  lessons: Lesson[];
  redemptionOptions: RedemptionOption[];
  totalRobux: number;
  redemptionThreshold: number;
}

// Level 1 Unit Math (L1UM) - Complete Curriculum
export const L1UM: Level = {
  id: 'L1UM',
  number: 1,
  title: 'Level 1 Math',
  subject: 'math',
  description: 'Level 1 focuses on foundational math skills for early learners. Students will master counting, basic addition and subtraction, pattern recognition, shape identification, and skip counting. This level builds the essential numeracy skills needed for future mathematical concepts.',
  
  learningObjectives: [
    'Count numbers from 1 to 100',
    'Perform basic addition and subtraction',
    'Recognize and continue patterns',
    'Identify basic geometric shapes',
    'Count money and perform simple transactions',
    'Skip count by 2s, 5s, and 10s',
  ],
  
  assessmentMethods: [
    'Interactive digital exercises',
    'Visual recognition activities',
    'Drag-and-drop problem solving',
    'Virtual manipulatives',
    'Game-based challenges',
    'End-of-level assessment',
  ],
  
  rewardFeatures: [
    '16 achievement badges',
    '100 Robux per badge earned',
    'Rewards redeemable at 800 Robux (8 badges)',
    'Virtual certificates',
    'Unlockable avatar items',
    'Level graduation ceremony',
  ],
  
  totalRobux: 1600, // 16 lessons × 100 Robux
  redemptionThreshold: 800,
  
  lessons: [
    {
      id: 'L1UM-01',
      number: 1,
      title: 'I Can Count to 10',
      description: 'Learn to count numbers from 1 to 10',
      skills: [
        { skill: 'Number recognition (1-10)' },
        { skill: 'Counting objects' },
        { skill: 'Number sequencing' },
        { skill: 'One-to-one correspondence' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Great job counting all the objects!' },
        { type: 'success', message: 'You correctly identified the number!' },
        { type: 'retry', message: 'Try again! Count each object one by one.' },
        { type: 'hint', message: 'Remember, we start counting from 1.' },
      ],
      badge: {
        id: 'badge-count-10',
        name: 'Counting to 10',
        description: 'Mastered counting from 1 to 10',
        icon: 'TrendingUp',
        colorClass: 'bg-blue-100 text-blue-600',
        robuxValue: 100,
      },
      estimatedDuration: 30,
    },
    {
      id: 'L1UM-02',
      number: 2,
      title: 'I Can Count to 20',
      description: 'Learn to count numbers from 11 to 20',
      skills: [
        { skill: 'Number recognition (11-20)' },
        { skill: 'Teen number patterns' },
        { skill: 'Counting forward and backward' },
        { skill: 'Identifying numbers before/after' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Excellent work with those teen numbers!' },
        { type: 'encouragement', message: "You're getting good at counting beyond 10!" },
        { type: 'hint', message: 'Remember, after 19 comes 20.' },
        { type: 'retry', message: 'Try again! Count carefully from 11 to 20.' },
      ],
      badge: {
        id: 'badge-count-20',
        name: 'Counting to 20',
        description: 'Mastered counting from 1 to 20',
        icon: 'Layers',
        colorClass: 'bg-purple-100 text-purple-600',
        robuxValue: 100,
      },
      estimatedDuration: 30,
      prerequisites: ['L1UM-01'],
    },
    {
      id: 'L1UM-03',
      number: 3,
      title: 'I Can Add',
      description: 'Learn basic addition with numbers up to 10',
      skills: [
        { skill: 'Understanding addition concept' },
        { skill: 'Using visual models to add' },
        { skill: 'Addition facts to 10' },
        { skill: 'Solving simple word problems' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Great job adding those numbers!' },
        { type: 'encouragement', message: "You're becoming an addition expert!" },
        { type: 'hint', message: 'Try counting all objects to find the total.' },
        { type: 'hint', message: 'Remember, addition means combining groups.' },
      ],
      badge: {
        id: 'badge-addition',
        name: 'Addition Master',
        description: 'Mastered basic addition',
        icon: 'Plus',
        colorClass: 'bg-green-100 text-green-600',
        robuxValue: 100,
      },
      estimatedDuration: 40,
      prerequisites: ['L1UM-02'],
    },
    {
      id: 'L1UM-04',
      number: 4,
      title: 'I Can See Patterns',
      description: 'Identify and continue simple patterns',
      skills: [
        { skill: 'Recognizing repeating patterns' },
        { skill: 'Creating patterns' },
        { skill: 'Extending patterns' },
        { skill: 'Identifying pattern rules' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'You found the pattern! Great observation!' },
        { type: 'success', message: 'Nice job continuing the pattern!' },
        { type: 'hint', message: 'Look carefully at how the pattern repeats.' },
        { type: 'hint', message: 'What comes next in the pattern?' },
      ],
      badge: {
        id: 'badge-patterns',
        name: 'Pattern Spotter',
        description: 'Expert at recognizing patterns',
        icon: 'BarChart3',
        colorClass: 'bg-yellow-100 text-yellow-600',
        robuxValue: 100,
      },
      estimatedDuration: 35,
    },
    {
      id: 'L1UM-05',
      number: 5,
      title: 'I Can Name Shapes',
      description: 'Learn to identify basic geometric shapes',
      skills: [
        { skill: 'Identifying 2D shapes' },
        { skill: 'Describing shape attributes' },
        { skill: 'Sorting shapes' },
        { skill: 'Finding shapes in the environment' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'You correctly identified the shape!' },
        { type: 'success', message: 'Great job counting the sides of the shape!' },
        { type: 'hint', message: 'Remember, a triangle has 3 sides.' },
        { type: 'hint', message: 'Look at the number of corners to help you.' },
      ],
      badge: {
        id: 'badge-shapes',
        name: 'Shape Expert',
        description: 'Master of geometric shapes',
        icon: 'Shapes',
        colorClass: 'bg-indigo-100 text-indigo-600',
        robuxValue: 100,
      },
      estimatedDuration: 35,
    },
    {
      id: 'L1UM-06',
      number: 6,
      title: 'I Can Subtract',
      description: 'Learn basic subtraction with numbers up to 10',
      skills: [
        { skill: 'Understanding subtraction concept' },
        { skill: 'Using visual models to subtract' },
        { skill: 'Subtraction facts from 10' },
        { skill: 'Solving simple word problems' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Excellent subtraction skills!' },
        { type: 'encouragement', message: "You're getting good at taking away!" },
        { type: 'hint', message: 'Remember, subtraction means taking away.' },
        { type: 'hint', message: 'Try counting how many are left after taking away.' },
      ],
      badge: {
        id: 'badge-subtraction',
        name: 'Subtraction Star',
        description: 'Mastered basic subtraction',
        icon: 'Minus',
        colorClass: 'bg-red-100 text-red-600',
        robuxValue: 100,
      },
      estimatedDuration: 40,
      prerequisites: ['L1UM-03'],
    },
    {
      id: 'L1UM-07',
      number: 7,
      title: 'I Can Count to 50',
      description: 'Learn to count numbers from 21 to 50',
      skills: [
        { skill: 'Number recognition (21-50)' },
        { skill: 'Counting by ones' },
        { skill: 'Understanding place value' },
        { skill: 'Ordering numbers' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Great job counting to 50!' },
        { type: 'encouragement', message: "You're getting good with larger numbers!" },
        { type: 'hint', message: 'Remember the pattern in the tens place.' },
        { type: 'retry', message: 'Try again! Count carefully from 21 to 50.' },
      ],
      badge: {
        id: 'badge-count-50',
        name: 'Counting to 50',
        description: 'Mastered counting to 50',
        icon: 'Copy',
        colorClass: 'bg-blue-100 text-blue-600',
        robuxValue: 100,
      },
      estimatedDuration: 35,
      prerequisites: ['L1UM-02'],
    },
    {
      id: 'L1UM-08',
      number: 8,
      title: 'I Can Add Numbers up to 50',
      description: 'Practice addition with larger numbers',
      skills: [
        { skill: 'Adding single-digit numbers' },
        { skill: 'Adding to teen numbers' },
        { skill: 'Adding tens' },
        { skill: 'Using number lines for addition' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Excellent work with larger numbers!' },
        { type: 'encouragement', message: "You're becoming an addition expert!" },
        { type: 'hint', message: 'Remember to start with the ones place.' },
        { type: 'hint', message: 'Try using the number line to help you.' },
      ],
      badge: {
        id: 'badge-addition-pro',
        name: 'Addition Pro',
        description: 'Advanced addition skills',
        icon: 'PlusCircle',
        colorClass: 'bg-green-100 text-green-600',
        robuxValue: 100,
      },
      estimatedDuration: 40,
      prerequisites: ['L1UM-03', 'L1UM-07'],
    },
    {
      id: 'L1UM-09',
      number: 9,
      title: 'I Can Subtract from 50',
      description: 'Practice subtraction with larger numbers',
      skills: [
        { skill: 'Subtracting single-digit numbers' },
        { skill: 'Subtracting from teen numbers' },
        { skill: 'Subtracting tens' },
        { skill: 'Using number lines for subtraction' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Great job with subtraction!' },
        { type: 'encouragement', message: "You're getting good at taking away larger numbers!" },
        { type: 'hint', message: 'Remember to start with the ones place.' },
        { type: 'hint', message: 'Try counting backward to find the answer.' },
      ],
      badge: {
        id: 'badge-subtraction-pro',
        name: 'Subtraction Pro',
        description: 'Advanced subtraction skills',
        icon: 'MinusCircle',
        colorClass: 'bg-red-100 text-red-600',
        robuxValue: 100,
      },
      estimatedDuration: 40,
      prerequisites: ['L1UM-06', 'L1UM-07'],
    },
    {
      id: 'L1UM-10',
      number: 10,
      title: 'I Can Count Money',
      description: 'Learn to identify and count coins and bills',
      skills: [
        { skill: 'Identifying coins and bills' },
        { skill: 'Counting pennies, nickels, dimes' },
        { skill: 'Counting mixed coins' },
        { skill: 'Understanding coin values' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Great job identifying that coin!' },
        { type: 'success', message: 'You counted the money correctly!' },
        { type: 'hint', message: 'Remember, a nickel is worth 5 cents.' },
        { type: 'hint', message: 'Try counting the coins by their values.' },
      ],
      badge: {
        id: 'badge-money-counter',
        name: 'Money Counter',
        description: 'Expert at counting money',
        icon: 'DollarSign',
        colorClass: 'bg-yellow-100 text-yellow-600',
        robuxValue: 100,
      },
      estimatedDuration: 45,
    },
    {
      id: 'L1UM-11',
      number: 11,
      title: 'I Can Add Money',
      description: 'Practice adding different amounts of money',
      skills: [
        { skill: 'Adding coin values' },
        { skill: 'Making change' },
        { skill: 'Solving money word problems' },
        { skill: 'Understanding dollar notation' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Great job adding those coins!' },
        { type: 'success', message: 'You made the correct change!' },
        { type: 'hint', message: 'Remember to line up the decimal points.' },
        { type: 'hint', message: 'Try counting up from the smaller amount.' },
      ],
      badge: {
        id: 'badge-money-master',
        name: 'Money Master',
        description: 'Master of money math',
        icon: 'Wallet',
        colorClass: 'bg-yellow-100 text-yellow-600',
        robuxValue: 100,
      },
      estimatedDuration: 45,
      prerequisites: ['L1UM-10', 'L1UM-08'],
    },
    {
      id: 'L1UM-12',
      number: 12,
      title: 'I Can Skip Count by 2',
      description: 'Learn to count by 2s (2, 4, 6, 8...)',
      skills: [
        { skill: 'Counting by 2s to 20' },
        { skill: 'Recognizing even numbers' },
        { skill: 'Using number lines' },
        { skill: 'Finding patterns in skip counting' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Great job counting by 2s!' },
        { type: 'success', message: 'You found all the even numbers!' },
        { type: 'hint', message: 'Remember, we add 2 each time.' },
        { type: 'hint', message: 'Try using the number line to help you.' },
      ],
      badge: {
        id: 'badge-skip-2',
        name: 'Skip Counter (2s)',
        description: 'Master of counting by 2s',
        icon: 'Sparkles',
        colorClass: 'bg-purple-100 text-purple-600',
        robuxValue: 100,
      },
      estimatedDuration: 30,
    },
    {
      id: 'L1UM-13',
      number: 13,
      title: 'I Can Skip Count by 5',
      description: 'Learn to count by 5s (5, 10, 15...)',
      skills: [
        { skill: 'Counting by 5s to 50' },
        { skill: 'Recognizing patterns in 5s' },
        { skill: 'Using number lines' },
        { skill: 'Connecting to clock reading' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Excellent job counting by 5s!' },
        { type: 'success', message: 'You found the pattern in the numbers!' },
        { type: 'hint', message: 'Remember, we add 5 each time.' },
        { type: 'hint', message: 'Look at the pattern in the ones place.' },
      ],
      badge: {
        id: 'badge-skip-5',
        name: 'Skip Counter (5s)',
        description: 'Master of counting by 5s',
        icon: 'Zap',
        colorClass: 'bg-purple-100 text-purple-600',
        robuxValue: 100,
      },
      estimatedDuration: 30,
      prerequisites: ['L1UM-12'],
    },
    {
      id: 'L1UM-14',
      number: 14,
      title: 'I Can Skip Count by 10',
      description: 'Learn to count by 10s (10, 20, 30...)',
      skills: [
        { skill: 'Counting by 10s to 100' },
        { skill: 'Recognizing patterns in 10s' },
        { skill: 'Understanding place value' },
        { skill: 'Using a hundreds chart' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Great job counting by 10s!' },
        { type: 'success', message: 'You noticed the pattern in the tens place!' },
        { type: 'hint', message: 'Remember, only the tens digit changes.' },
        { type: 'hint', message: 'Try using the hundreds chart to help you.' },
      ],
      badge: {
        id: 'badge-skip-10',
        name: 'Skip Counter (10s)',
        description: 'Master of counting by 10s',
        icon: 'Star',
        colorClass: 'bg-purple-100 text-purple-600',
        robuxValue: 100,
      },
      estimatedDuration: 30,
      prerequisites: ['L1UM-13'],
    },
    {
      id: 'L1UM-15',
      number: 15,
      title: 'I Can Count to 100',
      description: 'Learn to count numbers from 51 to 100',
      skills: [
        { skill: 'Number recognition (51-100)' },
        { skill: 'Counting by ones' },
        { skill: 'Understanding place value' },
        { skill: 'Using a hundreds chart' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Excellent job counting to 100!' },
        { type: 'encouragement', message: "You're getting good with larger numbers!" },
        { type: 'hint', message: 'Remember the pattern in the tens place.' },
        { type: 'hint', message: 'Try using the hundreds chart to help you.' },
      ],
      badge: {
        id: 'badge-count-100',
        name: 'Counting to 100',
        description: 'Mastered counting to 100',
        icon: 'Award',
        colorClass: 'bg-blue-100 text-blue-600',
        robuxValue: 100,
      },
      estimatedDuration: 40,
      prerequisites: ['L1UM-07'],
    },
    {
      id: 'L1UM-16',
      number: 16,
      title: 'I Can Graduate Level 1',
      description: 'Final assessment for Level 1',
      skills: [
        { skill: 'Comprehensive review' },
        { skill: 'Mixed problem solving' },
        { skill: 'Application of all skills' },
        { skill: 'Preparation for Level 2' },
      ],
      feedbackPrompts: [
        { type: 'success', message: 'Congratulations on completing Level 1!' },
        { type: 'success', message: "You've mastered all the skills!" },
        { type: 'encouragement', message: "You're ready for Level 2 challenges!" },
        { type: 'encouragement', message: 'Keep practicing to maintain your skills.' },
      ],
      badge: {
        id: 'badge-graduate-l1',
        name: 'Level 1 Graduate',
        description: 'Completed Level 1 Math',
        icon: 'GraduationCap',
        colorClass: 'bg-indigo-100 text-indigo-600',
        robuxValue: 100,
      },
      estimatedDuration: 60,
      prerequisites: ['L1UM-15', 'L1UM-11', 'L1UM-14'],
    },
  ],
  
  redemptionOptions: [
    // Avatar Items
    {
      id: 'avatar-cape',
      category: 'avatar',
      name: 'Math Hero Cape',
      description: 'A flowing cape for math champions',
      robuxCost: 800,
      icon: 'Shirt',
    },
    {
      id: 'avatar-hat',
      category: 'avatar',
      name: 'Number Wizard Hat',
      description: 'Magical hat for number wizards',
      robuxCost: 800,
      icon: 'Crown',
    },
    {
      id: 'avatar-backpack',
      category: 'avatar',
      name: 'Calculator Backpack',
      description: 'Cool backpack with calculator design',
      robuxCost: 800,
      icon: 'Backpack',
    },
    {
      id: 'avatar-shirt',
      category: 'avatar',
      name: 'Counting Champion T-shirt',
      description: 'Exclusive counting champion shirt',
      robuxCost: 800,
      icon: 'Shirt',
    },
    
    // Game Passes
    {
      id: 'gamepass-vip',
      category: 'gamepass',
      name: 'Math Adventure VIP Access',
      description: 'VIP access to all math adventure games',
      robuxCost: 800,
      icon: 'Star',
    },
    {
      id: 'gamepass-bonus',
      category: 'gamepass',
      name: 'Bonus Level Access',
      description: 'Unlock bonus challenge levels',
      robuxCost: 800,
      icon: 'Unlock',
    },
    {
      id: 'gamepass-challenges',
      category: 'gamepass',
      name: 'Special Challenges Pack',
      description: 'Access to premium challenge packs',
      robuxCost: 800,
      icon: 'Zap',
    },
    {
      id: 'gamepass-speedrun',
      category: 'gamepass',
      name: 'Math Speedrun Mode',
      description: 'Compete in timed math challenges',
      robuxCost: 800,
      icon: 'Timer',
    },
    
    // Special Rewards
    {
      id: 'special-certificate',
      category: 'special',
      name: 'Math Champion Certificate',
      description: 'Digital certificate of achievement',
      robuxCost: 0, // Free upon completion
      icon: 'Award',
    },
    {
      id: 'special-trophy',
      category: 'special',
      name: 'Level 1 Completion Trophy',
      description: 'In-game trophy for your achievements',
      robuxCost: 0,
      icon: 'Trophy',
    },
    {
      id: 'special-badge',
      category: 'special',
      name: 'Math Hero Profile Badge',
      description: 'Special badge for your profile',
      robuxCost: 0,
      icon: 'Shield',
    },
    {
      id: 'special-early-access',
      category: 'special',
      name: 'Early Access to Level 2 Content',
      description: 'Get a head start on Level 2',
      robuxCost: 0,
      icon: 'Rocket',
    },
  ],
};

// Helper function to get lesson by ID
export function getLessonById(lessonId: string): Lesson | undefined {
  return L1UM.lessons.find(lesson => lesson.id === lessonId);
}

// Helper function to get next lesson
export function getNextLesson(currentLessonId: string): Lesson | null {
  const currentIndex = L1UM.lessons.findIndex(lesson => lesson.id === currentLessonId);
  if (currentIndex === -1 || currentIndex === L1UM.lessons.length - 1) {
    return null;
  }
  return L1UM.lessons[currentIndex + 1];
}

// Helper function to calculate total Robux earned
export function calculateRobuxEarned(completedLessonIds: string[]): number {
  return completedLessonIds.reduce((total, lessonId) => {
    const lesson = getLessonById(lessonId);
    return total + (lesson?.badge.robuxValue || 0);
  }, 0);
}

// Helper function to check if redemption is available
export function canRedeem(robuxEarned: number, threshold: number = L1UM.redemptionThreshold): boolean {
  return robuxEarned >= threshold;
}

// Export the curriculum as default
export default L1UM;
