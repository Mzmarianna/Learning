/**
 * Tier System for Mz. Marianna's Academy
 * 
 * Adaptive skill-based tier assignment:
 * - Early Explorers: PreK-2nd grade competencies (ages 4-8 marketing)
 * - Explorers: 3rd-5th grade competencies (ages 8-12 marketing)
 * - Warriors: 6th-8th grade competencies (ages 12-18 marketing)
 * 
 * The tier is based on COMPETENCY MASTERY, not age.
 * A 16-year-old working on division uses the Warriors UI (mature)
 * with Early Explorers content (foundational skills).
 */

import { GradeLevel } from './learning-standards';

// ============================================================================
// TYPES
// ============================================================================

export type SkillTier = 'early-explorers' | 'explorers' | 'warriors';

export interface TierInfo {
  tier: SkillTier;
  name: string;
  description: string;
  skillRange: string; // e.g., "PreK-2nd Grade Skills"
  ageRange: string; // Marketing age range (e.g., "Ages 4-8")
  themeDescription: string;
  uiStyle: string;
  icon: string;
  color: string;
}

export interface TierRecommendation {
  recommendedTier: SkillTier;
  confidence: number; // 0-100%
  reasoning: string[];
  competencyBreakdown: {
    tier: SkillTier;
    count: number;
    percentage: number;
  }[];
  allowOverride: boolean;
  overrideMessage: string;
}

// ============================================================================
// TIER DEFINITIONS
// ============================================================================

export const TIER_INFO: Record<SkillTier, TierInfo> = {
  'early-explorers': {
    tier: 'early-explorers',
    name: 'Early Explorers',
    description: 'Little Adventurers discovering the world of learning',
    skillRange: 'PreK-2nd Grade Skills',
    ageRange: 'Ages 4-8',
    themeDescription: 'Bright, colorful, and encouraging with big buttons and lots of audio support',
    uiStyle: 'Large text, simple navigation, audio-first, bright colors',
    icon: '🌟',
    color: 'from-yellow-400 to-orange-400',
  },
  'explorers': {
    tier: 'explorers',
    name: 'Explorers',
    description: 'Quest Seekers ready for adventure and discovery',
    skillRange: '3rd-5th Grade Skills',
    ageRange: 'Ages 8-12',
    themeDescription: 'Gaming aesthetic with quest maps, badges, and achievement systems',
    uiStyle: 'Quest-based navigation, badge collections, strategic challenges',
    icon: '🗺️',
    color: 'from-cyan-500 to-blue-500',
  },
  'warriors': {
    tier: 'warriors',
    name: 'Warriors',
    description: 'Kingdom Leaders mastering advanced skills',
    skillRange: '6th-8th Grade Skills',
    ageRange: 'Ages 12-18',
    themeDescription: 'Mature gaming interface with clans, strategic missions, and leadership roles',
    uiStyle: 'Dark mode available, strategic aesthetics, mature framing',
    icon: '⚔️',
    color: 'from-purple-600 to-pink-600',
  },
};

// ============================================================================
// GRADE TO TIER MAPPING
// ============================================================================

export function gradeToTier(grade: GradeLevel): SkillTier {
  const earlyGrades: GradeLevel[] = ['PreK', 'K', '1', '2'];
  const explorerGrades: GradeLevel[] = ['3', '4', '5'];
  const warriorGrades: GradeLevel[] = ['6', '7', '8', '9', '10', '11', '12'];

  if (earlyGrades.includes(grade)) return 'early-explorers';
  if (explorerGrades.includes(grade)) return 'explorers';
  return 'warriors';
}

export function tierToGradeRange(tier: SkillTier): GradeLevel[] {
  switch (tier) {
    case 'early-explorers':
      return ['PreK', 'K', '1', '2'];
    case 'explorers':
      return ['3', '4', '5'];
    case 'warriors':
      return ['6', '7', '8', '9', '10', '11', '12'];
  }
}

// ============================================================================
// AGE TO TIER (MARKETING - NOT SKILL-BASED)
// ============================================================================

/**
 * Get the "marketing" tier based on age (for defaults only)
 * This is NOT used for skill assignment, only for UI defaults
 */
export function ageToMarketingTier(age: number): SkillTier {
  if (age < 4) return 'early-explorers';
  if (age >= 4 && age <= 8) return 'early-explorers';
  if (age >= 9 && age <= 12) return 'explorers';
  return 'warriors';
}

// ============================================================================
// TIER RECOMMENDATION ENGINE
// ============================================================================

/**
 * Recommend a tier based on quiz results and competency mastery
 */
export function recommendTier(params: {
  estimatedGrade: GradeLevel;
  age: number;
  competencyGrades?: GradeLevel[]; // Grades of competencies the student has mastered
  quizScore?: number;
}): TierRecommendation {
  const { estimatedGrade, age, competencyGrades = [], quizScore = 0 } = params;

  // 1. Calculate tier distribution from competencies
  const tierCounts: Record<SkillTier, number> = {
    'early-explorers': 0,
    'explorers': 0,
    'warriors': 0,
  };

  // Count competencies by tier
  if (competencyGrades.length > 0) {
    competencyGrades.forEach(grade => {
      const tier = gradeToTier(grade);
      tierCounts[tier]++;
    });
  } else {
    // Fallback to estimated grade
    const tier = gradeToTier(estimatedGrade);
    tierCounts[tier] = 1;
  }

  const totalCompetencies = Object.values(tierCounts).reduce((sum, count) => sum + count, 0);

  const competencyBreakdown = Object.entries(tierCounts).map(([tier, count]) => ({
    tier: tier as SkillTier,
    count,
    percentage: totalCompetencies > 0 ? (count / totalCompetencies) * 100 : 0,
  }));

  // 2. Find dominant tier
  const dominantTier = competencyBreakdown.reduce((max, current) =>
    current.count > max.count ? current : max
  );

  const recommendedTier = dominantTier.tier;
  const confidence = dominantTier.percentage;

  // 3. Generate reasoning
  const reasoning: string[] = [];

  // Primary reason: competency distribution
  if (confidence >= 80) {
    reasoning.push(
      `${Math.round(confidence)}% of assessed skills fall in the ${TIER_INFO[recommendedTier].skillRange} range.`
    );
  } else if (confidence >= 50) {
    reasoning.push(
      `Most assessed skills (${Math.round(confidence)}%) are in the ${TIER_INFO[recommendedTier].skillRange} range.`
    );
  } else {
    reasoning.push(
      `Skills are distributed across multiple levels, with ${Math.round(confidence)}% in ${TIER_INFO[recommendedTier].skillRange}.`
    );
  }

  // Check for foundational skill gaps
  const hasEarlyExplorersGaps = tierCounts['early-explorers'] > 0;
  if (hasEarlyExplorersGaps && recommendedTier !== 'early-explorers') {
    reasoning.push(
      `Some foundational skills (${TIER_INFO['early-explorers'].skillRange}) need review. This is completely normal and common!`
    );
  }

  // Age vs. skill mismatch (supportive messaging)
  const ageBasedTier = ageToMarketingTier(age);
  if (recommendedTier !== ageBasedTier && age >= 10) {
    if (recommendedTier === 'early-explorers' || recommendedTier === 'explorers') {
      reasoning.push(
        `We'll use age-appropriate visuals and mature themes while building these foundational skills.`
      );
    }
  }

  // Quiz score consideration
  if (quizScore > 0) {
    if (quizScore >= 80) {
      reasoning.push('Strong performance on the placement quiz!');
    } else if (quizScore >= 60) {
      reasoning.push('Good foundation with room to grow.');
    } else {
      reasoning.push('We\'ll build confidence with skills at the right level.');
    }
  }

  // 4. Override message
  const overrideMessage = generateOverrideMessage(recommendedTier, age, hasEarlyExplorersGaps);

  return {
    recommendedTier,
    confidence: Math.round(confidence),
    reasoning,
    competencyBreakdown: competencyBreakdown.filter(b => b.count > 0),
    allowOverride: true,
    overrideMessage,
  };
}

function generateOverrideMessage(
  recommendedTier: SkillTier,
  age: number,
  hasFoundationalGaps: boolean
): string {
  const tierInfo = TIER_INFO[recommendedTier];

  let message = `We recommend starting with ${tierInfo.name} (${tierInfo.skillRange}) based on the placement quiz. `;

  if (hasFoundationalGaps && recommendedTier !== 'early-explorers') {
    message += `\n\n✅ **This is completely normal!** Many students need to review earlier skills before advancing. `;
    message += `We'll use ${age >= 10 ? 'age-appropriate, mature visuals' : 'engaging themes'} while building these foundations. `;
  }

  message += `\n\n💡 **You can override this recommendation** if you prefer a different starting point. `;
  message += `The system will adapt to your child's pace and adjust content as they progress.`;

  return message;
}

// ============================================================================
// UI THEME SELECTION
// ============================================================================

/**
 * Get the UI tier (for visual presentation)
 * This can be different from the content tier!
 * 
 * Example: 16-year-old learning division
 * - Content Tier: Early Explorers (PreK-2nd skills)
 * - UI Tier: Warriors (age-appropriate interface)
 */
export function selectUITier(params: {
  contentTier: SkillTier;
  age: number;
  userPreference?: SkillTier;
}): SkillTier {
  const { contentTier, age, userPreference } = params;

  // 1. User preference overrides everything
  if (userPreference) {
    return userPreference;
  }

  // 2. If age is significantly higher than content tier, use age-appropriate UI
  const ageBasedTier = ageToMarketingTier(age);

  // Examples:
  // - Age 15, Content: Early Explorers → UI: Warriors (mature interface)
  // - Age 7, Content: Warriors → UI: Early Explorers (simple interface)
  // - Age 10, Content: Explorers → UI: Explorers (aligned)

  if (age >= 13) {
    // Teens always get Warriors UI (mature, not babyish)
    return 'warriors';
  } else if (age >= 9) {
    // Tweens get Explorers or Warriors UI
    return contentTier === 'early-explorers' ? 'explorers' : contentTier;
  } else {
    // Young kids get Early Explorers or Explorers UI
    return contentTier === 'warriors' ? 'explorers' : contentTier;
  }
}

// ============================================================================
// TIER PROGRESSION
// ============================================================================

/**
 * Determine if a student is ready to advance to the next tier
 */
export function canAdvanceToNextTier(params: {
  currentTier: SkillTier;
  masteredCompetencies: GradeLevel[];
  minimumMasteryPercentage?: number;
}): { canAdvance: boolean; nextTier?: SkillTier; reason: string } {
  const { currentTier, masteredCompetencies, minimumMasteryPercentage = 80 } = params;

  const currentGrades = tierToGradeRange(currentTier);
  const masteredInCurrentTier = masteredCompetencies.filter(grade =>
    currentGrades.includes(grade)
  );

  const masteryPercentage = (masteredInCurrentTier.length / currentGrades.length) * 100;

  if (masteryPercentage >= minimumMasteryPercentage) {
    const nextTier = getNextTier(currentTier);
    return {
      canAdvance: true,
      nextTier,
      reason: `Mastered ${Math.round(masteryPercentage)}% of ${TIER_INFO[currentTier].skillRange}. Ready for ${TIER_INFO[nextTier].name}!`,
    };
  }

  return {
    canAdvance: false,
    reason: `Currently mastered ${Math.round(masteryPercentage)}% of ${TIER_INFO[currentTier].skillRange}. Keep going!`,
  };
}

function getNextTier(currentTier: SkillTier): SkillTier {
  switch (currentTier) {
    case 'early-explorers':
      return 'explorers';
    case 'explorers':
      return 'warriors';
    case 'warriors':
      return 'warriors'; // Already at top tier
  }
}

// ============================================================================
// TIER LABELING (ANTI-BABYISH)
// ============================================================================

/**
 * Get age-appropriate tier labels that don't sound condescending
 */
export function getTierLabel(tier: SkillTier, age: number): string {
  if (age >= 13) {
    // Teens: Use skill-based language, not age-based
    switch (tier) {
      case 'early-explorers':
        return 'Foundational Skills';
      case 'explorers':
        return 'Core Skills';
      case 'warriors':
        return 'Advanced Skills';
    }
  } else if (age >= 9) {
    // Tweens: Use achievement-based language
    switch (tier) {
      case 'early-explorers':
        return 'Skill Builder';
      case 'explorers':
        return 'Quest Seeker';
      case 'warriors':
        return 'Master Warrior';
    }
  } else {
    // Young kids: Use fun, encouraging labels
    return TIER_INFO[tier].name;
  }
}

/**
 * Get quest framing for a specific tier and age
 * This ensures 16-year-olds learning division don't feel like they're "back in 2nd grade"
 */
export function getQuestFraming(params: {
  skillLevel: string; // e.g., "Division"
  tier: SkillTier;
  age: number;
}): { title: string; description: string } {
  const { skillLevel, tier, age } = params;

  if (age >= 13 && tier === 'early-explorers') {
    // Teen learning foundational skills: Use strategic, mature framing
    return {
      title: `${skillLevel} Mastery Quest`,
      description: `Master the strategic foundation of ${skillLevel} to unlock advanced problem-solving.`,
    };
  } else if (age >= 13) {
    // Teen learning age-appropriate skills
    return {
      title: `${skillLevel} Challenge`,
      description: `Prove your mastery of ${skillLevel} through strategic missions.`,
    };
  } else if (age >= 9 && tier === 'early-explorers') {
    // Tween learning foundational skills: Use achievement framing
    return {
      title: `${skillLevel} Power-Up`,
      description: `Build your ${skillLevel} skills to unlock new adventures!`,
    };
  } else {
    // Default: Fun, encouraging framing
    return {
      title: `${skillLevel} Adventure`,
      description: `Learn ${skillLevel} through exciting quests and challenges!`,
    };
  }
}
