/**
 * IB-Aligned Competency Framework
 * Simplified version for immediate integration
 * 
 * Full version would have 100+ competencies across 12 domains
 * This version has core competencies for each tier to get started
 */

export interface Competency {
  id: string;
  code: string;
  name: string;
  domain: string;
  tier: 'early-explorers' | 'explorers' | 'warriors';
  description: string;
  performanceIndicators: {
    attempted: string;
    familiar: string;
    proficient: string;
    mastery: string;
  };
}

// Domains
export const DOMAINS = {
  MATH: 'Math',
  READING: 'Reading',
  WRITING: 'Writing',
  STEAM: 'Science/STEAM',
  EXECUTIVE_FUNCTION: 'Executive Function',
  SOCIAL_STUDIES: 'Social Studies',
  DIGITAL_LITERACY: 'Digital Literacy',
  ARTS: 'Arts & Expression',
  SEL: 'Social-Emotional Learning',
  RESEARCH: 'Research & Inquiry',
  FOUR_CS: '4 Cs (Creativity, Critical Thinking, Collaboration, Communication)',
  TRANSDISCIPLINARY: 'Transdisciplinary Skills',
};

// Mastery Levels
export const MASTERY_LEVELS = {
  ATTEMPTED: 'attempted',       // 0-24%
  FAMILIAR: 'familiar',          // 25-49%
  PROFICIENT: 'proficient',      // 50-89%
  MASTERY: 'mastery',            // 90-100%
};

/**
 * Core Competencies (Simplified Set)
 * 
 * In production, expand to 100+ competencies across all domains
 */
export const CORE_COMPETENCIES: Competency[] = [
  // ==================== MATH ====================
  {
    id: 'MATH-EE-001',
    code: 'MATH.EE.001',
    name: 'Counting 1-20',
    domain: DOMAINS.MATH,
    tier: 'early-explorers',
    description: 'Count objects and numerals 1-20 with one-to-one correspondence',
    performanceIndicators: {
      attempted: 'Counts with some support, may skip numbers',
      familiar: 'Counts consistently to 10, working on 11-20',
      proficient: 'Counts 1-20 accurately with objects and numerals',
      mastery: 'Counts fluently, can count backwards, identifies missing numbers',
    },
  },
  {
    id: 'MATH-EE-002',
    code: 'MATH.EE.002',
    name: 'Basic Addition',
    domain: DOMAINS.MATH,
    tier: 'early-explorers',
    description: 'Add numbers within 10 using concrete objects or visual models',
    performanceIndicators: {
      attempted: 'Understands addition concept, uses fingers or objects',
      familiar: 'Solves simple addition within 5',
      proficient: 'Adds within 10 consistently',
      mastery: 'Adds fluently, recognizes number bonds',
    },
  },
  {
    id: 'MATH-E-001',
    code: 'MATH.E.001',
    name: 'Multiplication Concepts',
    domain: DOMAINS.MATH,
    tier: 'explorers',
    description: 'Understand multiplication as repeated addition and equal groups',
    performanceIndicators: {
      attempted: 'Recognizes multiplication symbols, groups objects',
      familiar: 'Solves simple multiplication problems (2x, 5x, 10x tables)',
      proficient: 'Multiplies single digits confidently',
      mastery: 'Applies multiplication to word problems and real-world contexts',
    },
  },
  {
    id: 'MATH-W-001',
    code: 'MATH.W.001',
    name: 'Algebraic Thinking',
    domain: DOMAINS.MATH,
    tier: 'warriors',
    description: 'Solve equations with variables and apply algebraic reasoning',
    performanceIndicators: {
      attempted: 'Identifies variables, solves simple one-step equations',
      familiar: 'Solves two-step equations, works with expressions',
      proficient: 'Applies algebraic thinking to complex problems',
      mastery: 'Creates and solves original algebraic problems',
    },
  },

  // ==================== READING ====================
  {
    id: 'READ-EE-001',
    code: 'READ.EE.001',
    name: 'Phonics & Letter Sounds',
    domain: DOMAINS.READING,
    tier: 'early-explorers',
    description: 'Recognize and produce sounds for all letters',
    performanceIndicators: {
      attempted: 'Identifies some letters and sounds',
      familiar: 'Knows most letter sounds, beginning to blend',
      proficient: 'Blends sounds to read simple CVC words',
      mastery: 'Reads fluently with phonics strategies',
    },
  },
  {
    id: 'READ-E-001',
    code: 'READ.E.001',
    name: 'Reading Comprehension',
    domain: DOMAINS.READING,
    tier: 'explorers',
    description: 'Understand and analyze what is read',
    performanceIndicators: {
      attempted: 'Recalls basic facts from text',
      familiar: 'Answers literal comprehension questions',
      proficient: 'Makes inferences, identifies main idea',
      mastery: 'Analyzes themes, makes connections across texts',
    },
  },
  {
    id: 'READ-W-001',
    code: 'READ.W.001',
    name: 'Critical Reading & Analysis',
    domain: DOMAINS.READING,
    tier: 'warriors',
    description: 'Critically evaluate texts, identify bias, analyze author\'s purpose',
    performanceIndicators: {
      attempted: 'Identifies author\'s perspective',
      familiar: 'Recognizes persuasive techniques',
      proficient: 'Evaluates credibility and bias',
      mastery: 'Synthesizes multiple sources, forms evidence-based conclusions',
    },
  },

  // ==================== WRITING ====================
  {
    id: 'WRITE-EE-001',
    code: 'WRITE.EE.001',
    name: 'Letter Formation',
    domain: DOMAINS.WRITING,
    tier: 'early-explorers',
    description: 'Form letters correctly (uppercase and lowercase)',
    performanceIndicators: {
      attempted: 'Attempts letter formation, some reversals',
      familiar: 'Forms most letters correctly',
      proficient: 'Writes all letters legibly',
      mastery: 'Writes fluently with proper spacing and size',
    },
  },
  {
    id: 'WRITE-E-001',
    code: 'WRITE.E.001',
    name: 'Paragraph Writing',
    domain: DOMAINS.WRITING,
    tier: 'explorers',
    description: 'Write organized paragraphs with topic sentences and supporting details',
    performanceIndicators: {
      attempted: 'Writes sentences with support',
      familiar: 'Organizes ideas into basic paragraphs',
      proficient: 'Writes structured paragraphs with clear topic sentences',
      mastery: 'Writes cohesive multi-paragraph pieces',
    },
  },

  // ==================== EXECUTIVE FUNCTION ====================
  {
    id: 'EF-ALL-001',
    code: 'EF.ALL.001',
    name: 'Task Initiation',
    domain: DOMAINS.EXECUTIVE_FUNCTION,
    tier: 'early-explorers',
    description: 'Begin tasks independently with minimal prompting',
    performanceIndicators: {
      attempted: 'Starts tasks with significant support',
      familiar: 'Starts tasks with reminder',
      proficient: 'Starts tasks independently most of the time',
      mastery: 'Self-initiates tasks, manages time effectively',
    },
  },
  {
    id: 'EF-ALL-002',
    code: 'EF.ALL.002',
    name: 'Working Memory',
    domain: DOMAINS.EXECUTIVE_FUNCTION,
    tier: 'explorers',
    description: 'Hold and manipulate information in mind while completing tasks',
    performanceIndicators: {
      attempted: 'Remembers 1-2 step directions',
      familiar: 'Follows 3-step directions',
      proficient: 'Handles multi-step tasks independently',
      mastery: 'Manages complex tasks with multiple components',
    },
  },

  // ==================== DIGITAL LITERACY ====================
  {
    id: 'DL-E-001',
    code: 'DL.E.001',
    name: 'Basic Coding Concepts',
    domain: DOMAINS.DIGITAL_LITERACY,
    tier: 'explorers',
    description: 'Understand sequencing, loops, and conditional logic in coding',
    performanceIndicators: {
      attempted: 'Completes simple block-based coding',
      familiar: 'Creates basic programs with sequences',
      proficient: 'Uses loops and conditionals effectively',
      mastery: 'Debugs code, creates original projects',
    },
  },
  {
    id: 'DL-W-001',
    code: 'DL.W.001',
    name: 'Game Design & Development',
    domain: DOMAINS.DIGITAL_LITERACY,
    tier: 'warriors',
    description: 'Design and build complete games using Lua/Roblox Studio',
    performanceIndicators: {
      attempted: 'Modifies existing games, follows tutorials',
      familiar: 'Creates simple games with guidance',
      proficient: 'Designs and builds original games',
      mastery: 'Develops complex games, teaches others',
    },
  },

  // ==================== SOCIAL-EMOTIONAL LEARNING ====================
  {
    id: 'SEL-ALL-001',
    code: 'SEL.ALL.001',
    name: 'Self-Regulation',
    domain: DOMAINS.SEL,
    tier: 'early-explorers',
    description: 'Manage emotions and behaviors in different situations',
    performanceIndicators: {
      attempted: 'Identifies emotions with support',
      familiar: 'Uses basic calming strategies',
      proficient: 'Self-regulates independently most of the time',
      mastery: 'Teaches strategies to others, adapts to new situations',
    },
  },
];

/**
 * Get competencies by tier
 */
export function getCompetenciesByTier(tier: 'early-explorers' | 'explorers' | 'warriors'): Competency[] {
  return CORE_COMPETENCIES.filter(c => c.tier === tier);
}

/**
 * Get competencies by domain
 */
export function getCompetenciesByDomain(domain: string): Competency[] {
  return CORE_COMPETENCIES.filter(c => c.domain === domain);
}

/**
 * Get competency by ID
 */
export function getCompetencyById(id: string): Competency | undefined {
  return CORE_COMPETENCIES.find(c => c.id === id);
}

/**
 * Get competency by code
 */
export function getCompetencyByCode(code: string): Competency | undefined {
  return CORE_COMPETENCIES.find(c => c.code === code);
}

/**
 * Get all domains
 */
export function getAllDomains(): string[] {
  return Object.values(DOMAINS);
}

/**
 * Get mastery level from percentage
 */
export function getMasteryLevel(percentage: number): string {
  if (percentage < 25) return MASTERY_LEVELS.ATTEMPTED;
  if (percentage < 50) return MASTERY_LEVELS.FAMILIAR;
  if (percentage < 90) return MASTERY_LEVELS.PROFICIENT;
  return MASTERY_LEVELS.MASTERY;
}

/**
 * Get performance indicator for mastery level
 */
export function getPerformanceIndicator(competency: Competency, masteryPercentage: number): string {
  const level = getMasteryLevel(masteryPercentage);
  return competency.performanceIndicators[level as keyof typeof competency.performanceIndicators];
}
