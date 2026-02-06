/**
 * Approved Roblox Games for Educational Challenges
 * Curated list of safe, educational Roblox games
 */

export interface RobloxGame {
  gameId: string;
  gameName: string;
  gameUrl: string;
  thumbnailUrl?: string;
  instructions: string;
  completionCriteria: string[];
  estimatedMinutes: number;
  educationalValue: string[];
  ageAppropriate: {
    minAge: number;
    maxAge: number;
  };
  subjects: string[];
  tier: 'early-explorers' | 'explorers' | 'warriors';
}

/**
 * Curated Roblox Games for Math Learning
 */
export const MATH_ROBLOX_GAMES: RobloxGame[] = [
  {
    gameId: '606849621', // Roblox Math Obby
    gameName: 'Math Obby Adventure',
    gameUrl: 'https://www.roblox.com/games/606849621',
    instructions: 'Complete the obstacle course by solving math problems at each checkpoint!',
    completionCriteria: [
      'Reach at least checkpoint 5',
      'Solve 10 math problems correctly',
      'Take a screenshot showing your progress',
    ],
    estimatedMinutes: 20,
    educationalValue: [
      'Mental math practice',
      'Problem-solving under time pressure',
      'Basic arithmetic (addition, subtraction, multiplication)',
    ],
    ageAppropriate: {
      minAge: 6,
      maxAge: 12,
    },
    subjects: ['Math', 'Problem Solving'],
    tier: 'explorers',
  },
  {
    gameId: '5670218085', // Math Tycoon
    gameName: 'Math Factory Tycoon',
    gameUrl: 'https://www.roblox.com/games/5670218085',
    instructions: 'Build a math factory! Solve equations to earn money and expand your business.',
    completionCriteria: [
      'Build at least 3 factory upgrades',
      'Earn 1000+ coins by solving problems',
      'Screenshot your factory layout',
    ],
    estimatedMinutes: 25,
    educationalValue: [
      'Business math and economics',
      'Resource management',
      'Multiplication and division',
    ],
    ageAppropriate: {
      minAge: 8,
      maxAge: 14,
    },
    subjects: ['Math', 'Economics', 'Strategy'],
    tier: 'explorers',
  },
  {
    gameId: '4872321990', // Fraction Simulator
    gameName: 'Pizza Fraction Builder',
    gameUrl: 'https://www.roblox.com/games/4872321990',
    instructions: 'Run a pizza shop and practice fractions by cutting pizzas for customers!',
    completionCriteria: [
      'Serve 15 customers correctly',
      'Master at least 5 different fraction combinations (1/2, 1/4, 3/4, etc.)',
      'Screenshot your high score',
    ],
    estimatedMinutes: 15,
    educationalValue: [
      'Visual fraction understanding',
      'Equivalent fractions',
      'Real-world application of fractions',
    ],
    ageAppropriate: {
      minAge: 7,
      maxAge: 12,
    },
    subjects: ['Math', 'Fractions'],
    tier: 'explorers',
  },
];

/**
 * Curated Roblox Games for Coding/Logic
 */
export const CODING_ROBLOX_GAMES: RobloxGame[] = [
  {
    gameId: '2041312716', // Lua Learning
    gameName: 'Code Builder Academy',
    gameUrl: 'https://www.roblox.com/games/2041312716',
    instructions: 'Learn basic coding concepts by programming robots to complete tasks!',
    completionCriteria: [
      'Complete the first 3 coding tutorials',
      'Program a robot to navigate a maze',
      'Screenshot your completed code',
    ],
    estimatedMinutes: 30,
    educationalValue: [
      'Introduction to Lua programming',
      'Sequence, loops, and conditionals',
      'Debugging and problem-solving',
    ],
    ageAppropriate: {
      minAge: 10,
      maxAge: 18,
    },
    subjects: ['Coding', 'Logic', 'Computer Science'],
    tier: 'warriors',
  },
  {
    gameId: '3527629287', // Logic Puzzles
    gameName: 'Brain Teaser Island',
    gameUrl: 'https://www.roblox.com/games/3527629287',
    instructions: 'Solve logic puzzles to unlock new areas of the island!',
    completionCriteria: [
      'Solve 10 logic puzzles',
      'Unlock at least 3 island sections',
      'Screenshot your puzzle-solving progress',
    ],
    estimatedMinutes: 20,
    educationalValue: [
      'Critical thinking',
      'Pattern recognition',
      'Logical reasoning',
    ],
    ageAppropriate: {
      minAge: 8,
      maxAge: 16,
    },
    subjects: ['Logic', 'Problem Solving', 'Critical Thinking'],
    tier: 'explorers',
  },
];

/**
 * Curated Roblox Games for Science
 */
export const SCIENCE_ROBLOX_GAMES: RobloxGame[] = [
  {
    gameId: '4282985734', // Physics Simulator
    gameName: 'Gravity Lab Experiments',
    gameUrl: 'https://www.roblox.com/games/4282985734',
    instructions: 'Experiment with gravity, mass, and force in a physics playground!',
    completionCriteria: [
      'Complete 5 physics experiments',
      'Build a working Rube Goldberg machine',
      'Screenshot your most creative experiment',
    ],
    estimatedMinutes: 25,
    educationalValue: [
      'Basic physics principles',
      'Cause and effect',
      'Scientific experimentation',
    ],
    ageAppropriate: {
      minAge: 9,
      maxAge: 15,
    },
    subjects: ['Science', 'Physics', 'Engineering'],
    tier: 'explorers',
  },
  {
    gameId: '5155368353', // Chemistry Lab
    gameName: 'Element Mixer Lab',
    gameUrl: 'https://www.roblox.com/games/5155368353',
    instructions: 'Mix chemical elements to create reactions and discover new compounds!',
    completionCriteria: [
      'Create 8 different compounds',
      'Complete the periodic table challenge',
      'Screenshot your lab notebook',
    ],
    estimatedMinutes: 20,
    educationalValue: [
      'Introduction to chemistry',
      'Periodic table familiarity',
      'Safe experimentation',
    ],
    ageAppropriate: {
      minAge: 11,
      maxAge: 16,
    },
    subjects: ['Science', 'Chemistry'],
    tier: 'warriors',
  },
];

/**
 * Curated Roblox Games for Building/Creativity
 */
export const CREATIVE_ROBLOX_GAMES: RobloxGame[] = [
  {
    gameId: '537413528', // Welcome to Bloxburg (Building)
    gameName: 'Build-A-Home Challenge',
    gameUrl: 'https://www.roblox.com/games/537413528',
    instructions: 'Design and build your dream house using geometry and spatial reasoning!',
    completionCriteria: [
      'Build a house with at least 3 rooms',
      'Use at least 5 different shapes/structures',
      'Screenshot your finished house from multiple angles',
    ],
    estimatedMinutes: 35,
    educationalValue: [
      'Spatial reasoning',
      'Geometry application',
      'Budget management',
      'Design thinking',
    ],
    ageAppropriate: {
      minAge: 8,
      maxAge: 18,
    },
    subjects: ['Math', 'Geometry', 'Art', 'Economics'],
    tier: 'explorers',
  },
  {
    gameId: '4282985734', // Build & Race
    gameName: 'Vehicle Engineering Studio',
    gameUrl: 'https://www.roblox.com/games/4282985734',
    instructions: 'Design and build a vehicle, then race it to test your engineering!',
    completionCriteria: [
      'Build a functional vehicle',
      'Test at least 3 design iterations',
      'Screenshot your best-performing vehicle',
    ],
    estimatedMinutes: 30,
    educationalValue: [
      'Engineering design process',
      'Trial and error learning',
      'Physics of motion',
    ],
    ageAppropriate: {
      minAge: 9,
      maxAge: 16,
    },
    subjects: ['Engineering', 'Physics', 'Design'],
    tier: 'explorers',
  },
];

/**
 * All approved games combined
 */
export const ALL_APPROVED_ROBLOX_GAMES: RobloxGame[] = [
  ...MATH_ROBLOX_GAMES,
  ...CODING_ROBLOX_GAMES,
  ...SCIENCE_ROBLOX_GAMES,
  ...CREATIVE_ROBLOX_GAMES,
];

/**
 * Get approved games by subject
 */
export function getGamesBySubject(subject: string): RobloxGame[] {
  return ALL_APPROVED_ROBLOX_GAMES.filter(game =>
    game.subjects.some(s => s.toLowerCase().includes(subject.toLowerCase()))
  );
}

/**
 * Get approved games by tier
 */
export function getGamesByTier(tier: 'early-explorers' | 'explorers' | 'warriors'): RobloxGame[] {
  return ALL_APPROVED_ROBLOX_GAMES.filter(game => game.tier === tier);
}

/**
 * Get game by ID
 */
export function getGameById(gameId: string): RobloxGame | undefined {
  return ALL_APPROVED_ROBLOX_GAMES.find(game => game.gameId === gameId);
}

/**
 * Check if a game is approved
 */
export function isGameApproved(gameId: string): boolean {
  return ALL_APPROVED_ROBLOX_GAMES.some(game => game.gameId === gameId);
}

/**
 * Get age-appropriate games
 */
export function getAgeAppropriateGames(age: number): RobloxGame[] {
  return ALL_APPROVED_ROBLOX_GAMES.filter(
    game => age >= game.ageAppropriate.minAge && age <= game.ageAppropriate.maxAge
  );
}
