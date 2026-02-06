/**
 * Wowl Mastery Assessment Engine
 * 
 * The "Game Master" that:
 * - Reviews student submissions (text, images, videos, screenshots)
 * - Assesses mastery level
 * - Provides respectful, tier-appropriate feedback
 * - Suggests improvements without condescension
 * - Allows resubmission for higher mastery
 * - Never says "wrong" - always guides
 */

import { SkillTier, TIER_INFO } from './tier-system';
import { GradeLevel } from './learning-standards';

// ============================================================================
// TYPES
// ============================================================================

export type MasteryLevel = 'emerging' | 'developing' | 'proficient' | 'advanced' | 'mastered';
export type SubmissionType = 'text' | 'image' | 'video' | 'screenshot' | 'audio' | 'roblox' | 'multiple';

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  studentAge: number;
  studentTier: SkillTier;
  
  challengeId: string;
  challengeTitle: string;
  skillLevel: GradeLevel;
  competencyId: string;
  
  type: SubmissionType;
  content: {
    text?: string;
    imageUrls?: string[];
    videoUrl?: string;
    audioUrl?: string;
    metadata?: any; // Roblox game ID, etc.
  };
  
  submittedAt: Date;
  attemptNumber: number; // For tracking resubmissions
  previousAttemptId?: string;
}

export interface MasteryAssessment {
  id: string;
  submissionId: string;
  
  // Mastery Levels
  overallMastery: MasteryLevel;
  criteriaScores: {
    [criterion: string]: MasteryLevel;
  };
  
  // Feedback (tier-appropriate)
  feedback: WowlFeedback;
  
  // Improvement Areas
  strengthsIdentified: string[];
  growthAreas: string[];
  nextSteps: string[];
  
  // Resubmission
  allowResubmission: boolean;
  resubmissionPrompt?: string;
  targetMasteryLevel?: MasteryLevel;
  
  // Metadata
  assessedAt: Date;
  assessedBy: 'wowl-ai' | 'tutor' | 'parent';
  confidenceScore: number; // 0-100
}

export interface WowlFeedback {
  // Opening (tier-appropriate greeting)
  opening: string;
  
  // Main feedback (specific, actionable)
  mainPoints: FeedbackPoint[];
  
  // Celebration (what went well)
  celebrations: string[];
  
  // Guidance (next steps)
  guidance: string[];
  
  // Closing (tier-appropriate)
  closing: string;
  
  // Tone
  tone: 'encouraging' | 'direct' | 'celebratory' | 'guiding';
}

export interface FeedbackPoint {
  criterion: string;
  observation: string;
  strength?: string;
  improvement?: string;
  example?: string;
}

// ============================================================================
// MASTERY LEVEL DEFINITIONS
// ============================================================================

export const MASTERY_DEFINITIONS: Record<MasteryLevel, {
  label: string;
  description: string;
  xpMultiplier: number;
  color: string;
  icon: string;
}> = {
  emerging: {
    label: 'Emerging',
    description: 'Beginning to understand - keep building!',
    xpMultiplier: 0.5,
    color: 'text-yellow-600',
    icon: '🌱',
  },
  developing: {
    label: 'Developing',
    description: 'Making progress - you\'re getting there!',
    xpMultiplier: 0.75,
    color: 'text-blue-600',
    icon: '🌿',
  },
  proficient: {
    label: 'Proficient',
    description: 'Solid understanding - nice work!',
    xpMultiplier: 1.0,
    color: 'text-green-600',
    icon: '✅',
  },
  advanced: {
    label: 'Advanced',
    description: 'Excellent mastery - you\'ve got this!',
    xpMultiplier: 1.5,
    color: 'text-purple-600',
    icon: '⭐',
  },
  mastered: {
    label: 'Mastered',
    description: 'Complete mastery - you could teach this!',
    xpMultiplier: 2.0,
    color: 'text-pink-600',
    icon: '🏆',
  },
};

// ============================================================================
// WOWL MASTERY ENGINE
// ============================================================================

export class WowlMasteryEngine {
  /**
   * Assess a student submission and provide tier-appropriate feedback
   */
  async assessSubmission(
    submission: Submission,
    criteria: AssessmentCriteria[]
  ): Promise<MasteryAssessment> {
    
    // 1. Evaluate each criterion
    const criteriaScores: Record<string, MasteryLevel> = {};
    const strengthsIdentified: string[] = [];
    const growthAreas: string[] = [];
    
    for (const criterion of criteria) {
      const score = this.evaluateCriterion(submission, criterion);
      criteriaScores[criterion.id] = score;
      
      if (score === 'advanced' || score === 'mastered') {
        strengthsIdentified.push(criterion.name);
      } else if (score === 'emerging' || score === 'developing') {
        growthAreas.push(criterion.name);
      }
    }
    
    // 2. Calculate overall mastery
    const overallMastery = this.calculateOverallMastery(Object.values(criteriaScores));
    
    // 3. Generate tier-appropriate feedback
    const feedback = this.generateFeedback(
      submission,
      overallMastery,
      criteriaScores,
      criteria,
      strengthsIdentified,
      growthAreas
    );
    
    // 4. Determine if resubmission is allowed
    const { allowResubmission, resubmissionPrompt, targetMasteryLevel } = 
      this.determineResubmission(overallMastery, submission.attemptNumber);
    
    // 5. Generate next steps
    const nextSteps = this.generateNextSteps(
      overallMastery,
      growthAreas,
      submission.studentTier
    );
    
    return {
      id: `assessment-${Date.now()}`,
      submissionId: submission.id,
      overallMastery,
      criteriaScores,
      feedback,
      strengthsIdentified,
      growthAreas,
      nextSteps,
      allowResubmission,
      resubmissionPrompt,
      targetMasteryLevel,
      assessedAt: new Date(),
      assessedBy: 'wowl-ai',
      confidenceScore: 85, // Mock confidence
    };
  }
  
  /**
   * Evaluate a specific criterion
   */
  private evaluateCriterion(
    submission: Submission,
    criterion: AssessmentCriteria
  ): MasteryLevel {
    // In production, this would use AI to analyze the submission content
    // For now, we'll use a mock evaluation
    
    // Mock logic: Check content completeness and quality
    const hasContent = submission.content.text || 
                       (submission.content.imageUrls && submission.content.imageUrls.length > 0) ||
                       submission.content.videoUrl;
    
    if (!hasContent) return 'emerging';
    
    const contentLength = submission.content.text?.length || 0;
    
    // Simulate evaluation
    if (contentLength > 200 || (submission.content.imageUrls && submission.content.imageUrls.length >= 3)) {
      return 'advanced';
    } else if (contentLength > 100 || (submission.content.imageUrls && submission.content.imageUrls.length >= 2)) {
      return 'proficient';
    } else if (contentLength > 50) {
      return 'developing';
    } else {
      return 'emerging';
    }
  }
  
  /**
   * Calculate overall mastery from individual criterion scores
   */
  private calculateOverallMastery(scores: MasteryLevel[]): MasteryLevel {
    const levelValues: Record<MasteryLevel, number> = {
      emerging: 1,
      developing: 2,
      proficient: 3,
      advanced: 4,
      mastered: 5,
    };
    
    const averageValue = scores.reduce((sum, score) => sum + levelValues[score], 0) / scores.length;
    
    if (averageValue >= 4.5) return 'mastered';
    if (averageValue >= 3.5) return 'advanced';
    if (averageValue >= 2.5) return 'proficient';
    if (averageValue >= 1.5) return 'developing';
    return 'emerging';
  }
  
  /**
   * Generate tier-appropriate feedback
   */
  private generateFeedback(
    submission: Submission,
    overallMastery: MasteryLevel,
    criteriaScores: Record<string, MasteryLevel>,
    criteria: AssessmentCriteria[],
    strengths: string[],
    growthAreas: string[]
  ): WowlFeedback {
    const tier = submission.studentTier;
    const age = submission.studentAge;
    
    // Opening (tier-appropriate)
    const opening = this.generateOpening(tier, age, submission.studentName, overallMastery);
    
    // Main feedback points
    const mainPoints: FeedbackPoint[] = criteria.map(criterion => ({
      criterion: criterion.name,
      observation: this.generateObservation(criterion, criteriaScores[criterion.id]),
      strength: criteriaScores[criterion.id] === 'advanced' || criteriaScores[criterion.id] === 'mastered'
        ? this.generateStrengthNote(criterion, tier)
        : undefined,
      improvement: criteriaScores[criterion.id] === 'emerging' || criteriaScores[criterion.id] === 'developing'
        ? this.generateImprovementSuggestion(criterion, tier, age)
        : undefined,
    }));
    
    // Celebrations
    const celebrations = this.generateCelebrations(strengths, tier, overallMastery);
    
    // Guidance
    const guidance = this.generateGuidance(growthAreas, tier, age);
    
    // Closing
    const closing = this.generateClosing(tier, age, overallMastery);
    
    // Tone
    const tone = this.determineTone(overallMastery);
    
    return {
      opening,
      mainPoints,
      celebrations,
      guidance,
      closing,
      tone,
    };
  }
  
  /**
   * Generate tier-appropriate opening
   */
  private generateOpening(tier: SkillTier, age: number, name: string, mastery: MasteryLevel): string {
    if (tier === 'warriors' || age >= 13) {
      // Mature, direct tone
      const openings: Record<MasteryLevel, string[]> = {
        emerging: [
          `Hey ${name}. I've reviewed your work. Let's talk about what you're building here.`,
          `${name}, I see where you're headed with this. Let's refine it.`,
        ],
        developing: [
          `${name}, solid start. You're building the foundation. Let's take it further.`,
          `Good work, ${name}. You're making progress. Here's how to level it up.`,
        ],
        proficient: [
          `${name}, nice work. You've got a solid understanding of this.`,
          `Well done, ${name}. This shows you understand the concept.`,
        ],
        advanced: [
          `${name}, excellent work. You've clearly mastered this.`,
          `Impressive, ${name}. This demonstrates advanced understanding.`,
        ],
        mastered: [
          `${name}, this is outstanding. You've completely mastered this concept.`,
          `${name}, exceptional work. You could teach this to others.`,
        ],
      };
      return openings[mastery][Math.floor(Math.random() * openings[mastery].length)];
    } else if (tier === 'explorers' || age >= 9) {
      // Encouraging, achievement-focused
      const openings: Record<MasteryLevel, string[]> = {
        emerging: [
          `Great start, ${name}! I can see what you're working on. Let's make it even better!`,
          `${name}, you're on the right track! Let me show you how to take this to the next level.`,
        ],
        developing: [
          `${name}, you're making great progress! Let's build on what you've got.`,
          `Nice work, ${name}! You're getting there. Here's how to make it awesome!`,
        ],
        proficient: [
          `${name}, excellent work! You really understand this!`,
          `Great job, ${name}! This shows you've got it!`,
        ],
        advanced: [
          `${name}, wow! This is really impressive work!`,
          `Amazing, ${name}! You've totally mastered this!`,
        ],
        mastered: [
          `${name}, this is incredible! You're a master at this!`,
          `Outstanding, ${name}! You could be the teacher now!`,
        ],
      };
      return openings[mastery][Math.floor(Math.random() * openings[mastery].length)];
    } else {
      // Early explorers: warm, encouraging
      const openings: Record<MasteryLevel, string[]> = {
        emerging: [
          `${name}, I love that you tried this! Let's make it even more amazing!`,
          `Great job trying, ${name}! Let me help you make it better!`,
        ],
        developing: [
          `${name}, you're doing great! Let's add some more to make it perfect!`,
          `Nice work, ${name}! You're learning so much!`,
        ],
        proficient: [
          `${name}, wonderful work! You did it!`,
          `Yay, ${name}! You really get this!`,
        ],
        advanced: [
          `${name}, wow! This is so good!`,
          `Amazing, ${name}! You're a superstar!`,
        ],
        mastered: [
          `${name}, this is perfect! You're a champion!`,
          `Incredible, ${name}! You're so good at this!`,
        ],
      };
      return openings[mastery][Math.floor(Math.random() * openings[mastery].length)];
    }
  }
  
  /**
   * Generate observation for a criterion
   */
  private generateObservation(criterion: AssessmentCriteria, score: MasteryLevel): string {
    const levelPhrases: Record<MasteryLevel, string[]> = {
      emerging: [
        'You\'re starting to work with this',
        'You\'re beginning to understand this concept',
        'This is a work in progress',
      ],
      developing: [
        'You\'re making good progress here',
        'You\'re developing this skill',
        'You\'re on the right track',
      ],
      proficient: [
        'You\'ve demonstrated solid understanding',
        'This shows you get it',
        'You\'ve got this down',
      ],
      advanced: [
        'You\'ve shown advanced mastery',
        'This demonstrates excellent understanding',
        'You\'ve mastered this',
      ],
      mastered: [
        'You\'ve completely mastered this',
        'This is exceptional work',
        'You could teach this to others',
      ],
    };
    
    return levelPhrases[score][Math.floor(Math.random() * levelPhrases[score].length)];
  }
  
  /**
   * Generate strength note (what student did well)
   */
  private generateStrengthNote(criterion: AssessmentCriteria, tier: SkillTier): string {
    const phrases = [
      `Your ${criterion.name} is excellent.`,
      `You really nailed the ${criterion.name} part.`,
      `Strong work on ${criterion.name}.`,
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  /**
   * Generate improvement suggestion (NOT "you did this wrong")
   */
  private generateImprovementSuggestion(criterion: AssessmentCriteria, tier: SkillTier, age: number): string {
    if (tier === 'warriors' || age >= 13) {
      // Direct, strategic framing
      return `To strengthen your ${criterion.name}, try this: ${this.getSuggestion(criterion)}`;
    } else if (tier === 'explorers' || age >= 9) {
      // Achievement framing
      return `Want to level up your ${criterion.name}? Here's how: ${this.getSuggestion(criterion)}`;
    } else {
      // Encouraging framing
      return `Let's make your ${criterion.name} even better! Try: ${this.getSuggestion(criterion)}`;
    }
  }
  
  private getSuggestion(criterion: AssessmentCriteria): string {
    // In production, this would be AI-generated based on the actual gap
    return criterion.improvementHint || 'Review the examples and try again.';
  }
  
  /**
   * Generate celebrations
   */
  private generateCelebrations(strengths: string[], tier: SkillTier, mastery: MasteryLevel): string[] {
    if (strengths.length === 0) {
      return ['You\'re building the foundation - keep going!'];
    }
    
    const celebrations: string[] = [];
    
    if (tier === 'warriors') {
      celebrations.push(`You demonstrated strength in: ${strengths.join(', ')}`);
      if (mastery === 'advanced' || mastery === 'mastered') {
        celebrations.push('This work shows you\'re ready for more advanced challenges.');
      }
    } else if (tier === 'explorers') {
      celebrations.push(`You crushed it in: ${strengths.join(', ')}!`);
      if (mastery === 'advanced' || mastery === 'mastered') {
        celebrations.push('You\'re ready to level up!');
      }
    } else {
      celebrations.push(`You did great with: ${strengths.join(', ')}!`);
      if (mastery === 'advanced' || mastery === 'mastered') {
        celebrations.push('You\'re a superstar!');
      }
    }
    
    return celebrations;
  }
  
  /**
   * Generate guidance
   */
  private generateGuidance(growthAreas: string[], tier: SkillTier, age: number): string[] {
    if (growthAreas.length === 0) {
      return ['Keep up the excellent work!'];
    }
    
    const guidance: string[] = [];
    
    if (tier === 'warriors' || age >= 13) {
      guidance.push(`Focus areas for next time: ${growthAreas.join(', ')}`);
      guidance.push('Revise these sections and resubmit for a higher mastery level.');
    } else if (tier === 'explorers' || age >= 9) {
      guidance.push(`Let\'s work on: ${growthAreas.join(', ')}`);
      guidance.push('You can try again to earn more XP!');
    } else {
      guidance.push(`Next, we\'ll practice: ${growthAreas.join(', ')}`);
      guidance.push('You can do it again to make it even better!');
    }
    
    return guidance;
  }
  
  /**
   * Generate closing
   */
  private generateClosing(tier: SkillTier, age: number, mastery: MasteryLevel): string {
    if (tier === 'warriors' || age >= 13) {
      const closings: Record<MasteryLevel, string[]> = {
        emerging: ['Keep building. You\'re on the right path.', 'Solid foundation. Let\'s refine it.'],
        developing: ['Good progress. Keep pushing.', 'You\'re getting there. Stay focused.'],
        proficient: ['Well done. Ready for the next challenge?', 'Solid work. What\'s next?'],
        advanced: ['Excellent work. You\'re ready to advance.', 'Impressive. Keep it up.'],
        mastered: ['Outstanding. You\'ve mastered this.', 'Exceptional work. Ready to lead?'],
      };
      return closings[mastery][Math.floor(Math.random() * closings[mastery].length)];
    } else if (tier === 'explorers' || age >= 9) {
      return mastery === 'proficient' || mastery === 'advanced' || mastery === 'mastered'
        ? 'Keep crushing it! 🚀'
        : 'Keep going - you\'ve got this! 💪';
    } else {
      return mastery === 'proficient' || mastery === 'advanced' || mastery === 'mastered'
        ? 'You\'re doing amazing! ⭐'
        : 'Keep trying - you\'re learning! 🌟';
    }
  }
  
  /**
   * Determine feedback tone
   */
  private determineTone(mastery: MasteryLevel): WowlFeedback['tone'] {
    if (mastery === 'mastered' || mastery === 'advanced') return 'celebratory';
    if (mastery === 'proficient') return 'encouraging';
    if (mastery === 'developing') return 'guiding';
    return 'encouraging';
  }
  
  /**
   * Determine if resubmission is allowed
   */
  private determineResubmission(
    mastery: MasteryLevel,
    attemptNumber: number
  ): {
    allowResubmission: boolean;
    resubmissionPrompt?: string;
    targetMasteryLevel?: MasteryLevel;
  } {
    // Always allow resubmission if not mastered
    if (mastery === 'mastered') {
      return { allowResubmission: false };
    }
    
    // Allow up to 3 attempts
    if (attemptNumber >= 3) {
      return {
        allowResubmission: false,
        resubmissionPrompt: 'You\'ve made great progress! Let\'s move forward and come back to this later.',
      };
    }
    
    const targetLevels: Record<MasteryLevel, MasteryLevel> = {
      emerging: 'developing',
      developing: 'proficient',
      proficient: 'advanced',
      advanced: 'mastered',
      mastered: 'mastered',
    };
    
    return {
      allowResubmission: true,
      resubmissionPrompt: `Want to revise your work to reach ${MASTERY_DEFINITIONS[targetLevels[mastery]].label} level? You can resubmit for more XP!`,
      targetMasteryLevel: targetLevels[mastery],
    };
  }
  
  /**
   * Generate next steps
   */
  private generateNextSteps(
    mastery: MasteryLevel,
    growthAreas: string[],
    tier: SkillTier
  ): string[] {
    const steps: string[] = [];
    
    if (mastery === 'mastered') {
      steps.push('Challenge complete! Ready for the next one.');
      steps.push('Consider helping a peer who needs support.');
      return steps;
    }
    
    if (growthAreas.length > 0) {
      steps.push(`Review: ${growthAreas.join(', ')}`);
      steps.push('Check the examples in the challenge description');
      steps.push('Resubmit when you\'re ready');
    } else {
      steps.push('Add more detail to your submission');
      steps.push('Explain your thinking process');
    }
    
    return steps;
  }
}

// ============================================================================
// ASSESSMENT CRITERIA
// ============================================================================

export interface AssessmentCriteria {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-1 (for weighted average)
  improvementHint?: string;
}

export function getDefaultCriteria(challengeType: string): AssessmentCriteria[] {
  // These would be defined per challenge in production
  return [
    {
      id: 'completeness',
      name: 'Completeness',
      description: 'All required parts included',
      weight: 0.3,
      improvementHint: 'Make sure you\'ve addressed all parts of the challenge.',
    },
    {
      id: 'accuracy',
      name: 'Accuracy',
      description: 'Correct understanding demonstrated',
      weight: 0.4,
      improvementHint: 'Double-check your work against the examples.',
    },
    {
      id: 'explanation',
      name: 'Explanation',
      description: 'Clear explanation of thinking',
      weight: 0.3,
      improvementHint: 'Explain WHY you made these choices.',
    },
  ];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate XP earned based on mastery level
 */
export function calculateMasteryXP(baseXP: number, masteryLevel: MasteryLevel): number {
  const multiplier = MASTERY_DEFINITIONS[masteryLevel].xpMultiplier;
  return Math.round(baseXP * multiplier);
}

/**
 * Get mastery badge SVG or emoji
 */
export function getMasteryBadge(masteryLevel: MasteryLevel): string {
  return MASTERY_DEFINITIONS[masteryLevel].icon;
}

/**
 * Check if student can advance to next challenge
 */
export function canAdvanceToNextChallenge(masteryLevel: MasteryLevel): boolean {
  // Require at least "proficient" to advance
  const advanceLevels: MasteryLevel[] = ['proficient', 'advanced', 'mastered'];
  return advanceLevels.includes(masteryLevel);
}
