/**
 * Program Offerings Configuration
 * Defines available programs for neurodivergent learners
 */

export interface ProgramOffering {
  id: string;
  name: string;
  description: string;
  format: string;
  grades: string;
  frequency?: string;
  sessionLength?: string;
  tools?: string[];
  focusAreas: string[];
  educationalBenefit: string;
  pricing: {
    perSession?: number;
    perWeek?: number;
    programTotal?: number;
    programDuration?: string;
  };
  category: 'tutoring' | 'camp' | 'enrichment';
  available: boolean;
}

/**
 * Available Program Offerings
 */
export const PROGRAM_OFFERINGS: ProgramOffering[] = [
  {
    id: 'roblox-math',
    name: 'Roblox Math: Play to Learn Math',
    description: 'Virtual small group tutoring designed for neurodivergent learners (ADHD, Autism, Dyslexia, and more)',
    format: 'Virtual Small Group Tutoring',
    grades: 'K–8th',
    frequency: '1–2 times per week',
    sessionLength: '25–50 minutes',
    tools: [
      'Roblox games',
      'Progress tracking',
      'ClassDojo incentives',
      'Robux rewards'
    ],
    focusAreas: [
      'Math fact fluency (addition, subtraction, multiplication, division)',
      'Common Core State Standards alignment',
      'Word problems & logic',
      'Gamified problem-solving',
      'Teacher-created materials'
    ],
    educationalBenefit: 'Builds foundational math skills in an engaging, multisensory format',
    pricing: {
      perSession: 30,
      programTotal: 480,
      programDuration: '16 weeks'
    },
    category: 'tutoring',
    available: true
  },
  {
    id: 'reading-tutoring',
    name: 'Reading Tutoring Multi-Sensory Literacy Intervention',
    description: 'Virtual enrichment course for neurodivergent learners focusing on literacy skills',
    format: 'Virtual Enrichment Course',
    grades: 'Pre-K–8',
    frequency: '1–2 times per week',
    sessionLength: '25 minutes',
    tools: [
      'Roblox',
      'Digital worksheets',
      'Educational games',
      'Nearpod',
      'Brainzy'
    ],
    focusAreas: [
      'Phonics, phonemic awareness, vocabulary, comprehension, fluency',
      'Character analysis and plot understanding',
      'Inferences and sequence of events',
      'Theme, main idea, and details',
      'Problem solving & critical thinking'
    ],
    educationalBenefit: 'Introduces key life skills in literature through experiential learning',
    pricing: {
      perSession: 30,
      programTotal: 480,
      programDuration: '16 weeks'
    },
    category: 'tutoring',
    available: true
  },
  {
    id: 'summer-camp-2026',
    name: 'Summer Online Academic Training Camp',
    description: 'Virtual daily camp preventing summer slide and building executive functioning skills',
    format: 'Virtual Daily Camp (Up to 5 days per week)',
    grades: 'K–8',
    frequency: '5 days per week',
    sessionLength: '9:00 AM – 2:00 PM (recordings available)',
    tools: [
      'Interactive learning platforms',
      'STEAM activity kits',
      'Digital resources',
      'Coding tools'
    ],
    focusAreas: [
      '"Get Ready for" grade-level core skill prep (Reading, Math, Writing)',
      'Executive Functioning warm-ups (breathing, stretching, planning)',
      'STEAM enrichment (hands-on crafts, coding, creative projects)',
      'IEP/504 goal support',
      'Social-emotional learning'
    ],
    educationalBenefit: 'Prevents summer slide, strengthens foundational skills, supports IEP/504 goals, and builds executive functioning skills in a supportive environment',
    pricing: {
      perWeek: 250,
      programTotal: 2500,
      programDuration: '10 weeks (June 3 – August 8, 2026)'
    },
    category: 'camp',
    available: true
  },
  {
    id: 'homeschool-program',
    name: 'Complete Homeschool Program',
    description: 'Comprehensive daily homeschool program with live sessions, self-paced learning, and social hours',
    format: 'Virtual Daily Program',
    grades: 'K–8',
    frequency: '5 days per week',
    sessionLength: '4 sessions + 1 hour social hour daily',
    tools: [
      'Self-paced lessons and projects',
      'Gamified learning apps',
      'Printable workbooks',
      'Live tutoring sessions',
      'Interactive curriculum',
      'Progress tracking dashboard'
    ],
    focusAreas: [
      'Complete Common Core aligned curriculum',
      'Daily live instruction and support',
      'Self-paced learning modules',
      'Gamified educational apps',
      'Social hour for peer interaction',
      'Printable workbooks and materials',
      'Parent resources and coaching',
      'Individualized learning paths'
    ],
    educationalBenefit: 'Everything families need for successful homeschooling - live sessions, self-paced content, gamified learning, and social connections all in one comprehensive program',
    pricing: {
      perWeek: 120,
      programTotal: 480,
      programDuration: '4 weeks (monthly)'
    },
    category: 'tutoring',
    available: true
  }
];

/**
 * Get all available programs
 */
export function getAvailablePrograms(): ProgramOffering[] {
  return PROGRAM_OFFERINGS.filter(p => p.available);
}

/**
 * Get program by ID
 */
export function getProgramById(id: string): ProgramOffering | undefined {
  return PROGRAM_OFFERINGS.find(p => p.id === id);
}

/**
 * Get programs by category
 */
export function getProgramsByCategory(category: 'tutoring' | 'camp' | 'enrichment'): ProgramOffering[] {
  return PROGRAM_OFFERINGS.filter(p => p.category === category && p.available);
}

/**
 * Format program price for display
 */
export function formatProgramPrice(program: ProgramOffering): string {
  const prices: string[] = [];
  
  if (program.pricing.perSession) {
    prices.push(`$${program.pricing.perSession} per session`);
  }
  
  if (program.pricing.perWeek) {
    prices.push(`$${program.pricing.perWeek} per week`);
  }
  
  if (program.pricing.programTotal && program.pricing.programDuration) {
    prices.push(`$${program.pricing.programTotal} for ${program.pricing.programDuration}`);
  }
  
  return prices.join(' or ');
}

/**
 * Get program purchase options
 */
export interface ProgramPurchaseOption {
  id: string;
  programId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export function getProgramPurchaseOptions(programId: string): ProgramPurchaseOption[] {
  const program = getProgramById(programId);
  if (!program) return [];
  
  const options: ProgramPurchaseOption[] = [];
  
  // Single session option
  if (program.pricing.perSession) {
    options.push({
      id: `${programId}-session`,
      programId,
      name: `${program.name} - Single Session`,
      description: `One ${program.sessionLength} session`,
      price: program.pricing.perSession,
      quantity: 1
    });
  }
  
  // Weekly option
  if (program.pricing.perWeek) {
    options.push({
      id: `${programId}-week`,
      programId,
      name: `${program.name} - Weekly`,
      description: 'One week of sessions',
      price: program.pricing.perWeek,
      quantity: 1
    });
  }
  
  // Full program option
  if (program.pricing.programTotal) {
    options.push({
      id: `${programId}-full`,
      programId,
      name: `${program.name} - Full Program`,
      description: program.pricing.programDuration || 'Complete program',
      price: program.pricing.programTotal,
      quantity: 1
    });
  }
  
  return options;
}
