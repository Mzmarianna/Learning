/**
 * WOWL Adaptive Service
 * 
 * Connects WOWL AI to the Adaptive Recommendation Engine
 * Provides smart challenge selection, quest recommendations, and progress tracking
 */

import {
  generateRecommendations,
  getNextCompetencyToWork,
  calculateDomainReadiness,
  isQuestUnlocked,
  type StudentMastery,
  type QuestInfo,
  type Recommendation,
  MASTERY_THRESHOLDS,
  SUBJECT_TO_DOMAIN,
  DOMAIN_TO_SUBJECT,
} from '@/lib/curriculum/adaptive-engine';

// ============================================================================
// TYPES
// ============================================================================

export interface AdaptiveChallengeRequest {
  studentId: string;
  studentTier: 'early-explorers' | 'explorers' | 'warriors';
  currentQuestId?: number;
  preferredSubject?: string;
}

export interface AdaptiveChallengeResponse {
  challenge: {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    xpReward: number;
    estimatedMinutes: number;
  } | null;
  recommendation: Recommendation | null;
  wowlMessage: string;
  suggestedAction: 'practice' | 'challenge' | 'review' | 'break' | 'celebrate' | null;
  domainReadiness: {
    domain: string;
    score: number;
    level: string;
    nextMilestone: number;
  }[];
}

export interface StudentProgressSummary {
  studentId: string;
  overallMasteryScore: number;
  strongestDomains: string[];
  weakestDomains: string[];
  nextCompetencyToWork: {
    competencyId: number;
    skillName: string;
    domain: string;
    masteryPercentage: number;
  } | null;
  recommendations: Recommendation[];
  readyForChallengeUp: boolean;
  needsReview: boolean;
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Get the next best challenge for a student using adaptive engine
 * This is the main function called by /api/students/:id/next-challenge
 */
export async function getAdaptiveNextChallenge(
  request: AdaptiveChallengeRequest,
  masteryData: StudentMastery[],
  availableQuests: QuestInfo[],
  completedQuestIds: number[],
  inProgressQuestIds: number[]
): Promise<AdaptiveChallengeResponse> {
  // Generate smart recommendations using adaptive engine
  const recommendations = generateRecommendations(
    request.studentTier,
    masteryData,
    availableQuests,
    completedQuestIds,
    inProgressQuestIds
  );

  // Get the next competency to work on
  const nextCompetency = getNextCompetencyToWork(
    masteryData,
    request.preferredSubject ? SUBJECT_TO_DOMAIN[request.preferredSubject] : undefined
  );

  // Calculate domain readiness
  const domainReadiness = calculateDomainReadinessForStudent(masteryData);

  // Get top recommendation
  const topRecommendation = recommendations[0] || null;

  // Generate WOWL message based on recommendation type
  const wowlMessage = generateWowlMessage(topRecommendation, nextCompetency, masteryData);

  // Determine suggested action
  const suggestedAction = determineSuggestedAction(topRecommendation, masteryData);

  // TODO: Fetch actual challenge from database based on recommendation
  // For now, return the recommendation data
  const challenge = topRecommendation ? {
    id: topRecommendation.questId || 0,
    title: topRecommendation.title,
    description: topRecommendation.description,
    difficulty: 'Novice', // Would come from database
    xpReward: topRecommendation.xpReward || 0,
    estimatedMinutes: 15, // Would come from database
  } : null;

  return {
    challenge,
    recommendation: topRecommendation,
    wowlMessage,
    suggestedAction,
    domainReadiness,
  };
}

/**
 * Get comprehensive progress summary for a student
 * Used for dashboard, tutor view, and progress reports
 */
export function getStudentProgressSummary(
  studentId: string,
  studentTier: string,
  masteryData: StudentMastery[],
  availableQuests: QuestInfo[],
  completedQuestIds: number[],
  inProgressQuestIds: number[]
): StudentProgressSummary {
  // Calculate overall mastery
  const overallMastery = masteryData.length > 0
    ? Math.round(masteryData.reduce((sum, m) => sum + m.masteryPercentage, 0) / masteryData.length)
    : 0;

  // Group by domain
  const domainAverages = new Map<string, number>();
  const domainMastery = new Map<string, StudentMastery[]>();

  for (const mastery of masteryData) {
    if (!domainMastery.has(mastery.domain)) {
      domainMastery.set(mastery.domain, []);
    }
    domainMastery.get(mastery.domain)!.push(mastery);
  }

  for (const [domain, skills] of domainMastery.entries()) {
    const avg = Math.round(skills.reduce((sum, s) => sum + s.masteryPercentage, 0) / skills.length);
    domainAverages.set(domain, avg);
  }

  // Find strongest and weakest domains
  const sortedDomains = Array.from(domainAverages.entries()).sort((a, b) => b[1] - a[1]);
  const strongestDomains = sortedDomains.slice(0, 3).map(d => d[0]);
  const weakestDomains = sortedDomains.slice(-3).reverse().map(d => d[0]);

  // Get next competency to work on
  const nextComp = getNextCompetencyToWork(masteryData);
  const nextCompetencyToWork = nextComp ? {
    competencyId: nextComp.competencyId,
    skillName: nextComp.skillName,
    domain: nextComp.domain,
    masteryPercentage: nextComp.masteryPercentage,
  } : null;

  // Generate recommendations
  const recommendations = generateRecommendations(
    studentTier,
    masteryData,
    availableQuests,
    completedQuestIds,
    inProgressQuestIds
  );

  // Check if ready for challenge-up
  const readyForChallengeUp = sortedDomains.length > 0 && sortedDomains[0][1] >= MASTERY_THRESHOLDS.PROFICIENT;

  // Check if needs review
  const needsReview = sortedDomains.length > 0 && sortedDomains[sortedDomains.length - 1][1] < MASTERY_THRESHOLDS.STRUGGLING;

  return {
    studentId,
    overallMasteryScore: overallMastery,
    strongestDomains,
    weakestDomains,
    nextCompetencyToWork,
    recommendations,
    readyForChallengeUp,
    needsReview,
  };
}

/**
 * Check if student should take a brain break
 * Based on behavior signals and mastery data
 */
export function shouldSuggestBreak(
  timeOnCurrentProblem: number,
  successRateLast5: number,
  helpRequests: number,
  masteryData: StudentMastery[]
): { shouldBreak: boolean; reason: string } {
  // Struggling for 5+ minutes
  if (timeOnCurrentProblem > 300 && successRateLast5 < 0.3) {
    return {
      shouldBreak: true,
      reason: "You've been working hard on this. A quick break helps your brain reset!",
    };
  }

  // Many help requests in short time
  if (helpRequests >= 3) {
    return {
      shouldBreak: true,
      reason: "Let's take a breather. Sometimes stepping away helps things click!",
    };
  }

  // Working in struggling domain
  const avgMastery = masteryData.length > 0
    ? masteryData.reduce((sum, m) => sum + m.masteryPercentage, 0) / masteryData.length
    : 0;

  if (avgMastery < MASTERY_THRESHOLDS.STRUGGLING && timeOnCurrentProblem > 180) {
    return {
      shouldBreak: true,
      reason: "This skill is still growing. A 5-minute dance break will help you come back fresh!",
    };
  }

  return { shouldBreak: false, reason: '' };
}

/**
 * Recommend quest progression after completing current quest
 */
export function recommendNextQuestAfterCompletion(
  completedQuestId: number,
  studentTier: string,
  masteryData: StudentMastery[],
  availableQuests: QuestInfo[],
  completedQuestIds: number[]
): Recommendation | null {
  // Add the just-completed quest to the list
  const allCompleted = [...completedQuestIds, completedQuestId];

  // Generate fresh recommendations
  const recommendations = generateRecommendations(
    studentTier,
    masteryData,
    availableQuests,
    allCompleted,
    []
  );

  // Return top quest recommendation
  const questRec = recommendations.find(r => r.type === 'quest' || r.type === 'challenge_up');
  return questRec || null;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate domain readiness for all domains
 */
function calculateDomainReadinessForStudent(masteryData: StudentMastery[]) {
  const domains = [...new Set(masteryData.map(m => m.domain))];
  
  return domains.map(domain => 
    calculateDomainReadiness(domain, masteryData)
  ).map((readiness, i) => ({
    domain: domains[i],
    ...readiness,
  }));
}

/**
 * Generate WOWL message based on recommendation
 */
function generateWowlMessage(
  recommendation: Recommendation | null,
  nextCompetency: StudentMastery | null,
  masteryData: StudentMastery[]
): string {
  if (!recommendation) {
    return "You're doing great! Keep up the awesome work! 🦉✨";
  }

  switch (recommendation.type) {
    case 'review':
      return `Let's review ${recommendation.domain?.toLowerCase()} together. Building a strong foundation helps everything else!`;
    
    case 'practice':
      return `A little more practice with ${nextCompetency?.skillName.toLowerCase()} and you'll have it down!`;
    
    case 'quest':
      return `I found the perfect quest for you: ${recommendation.title}. Want to try it?`;
    
    case 'challenge_up':
      return `You're crushing it! Ready for a tougher challenge? ${recommendation.title} is waiting!`;
    
    case 'celebration':
      return `Amazing work! You've mastered ${recommendation.domain}! 🎉`;
    
    default:
      return "What do you want to work on next?";
  }
}

/**
 * Determine suggested action type
 */
function determineSuggestedAction(
  recommendation: Recommendation | null,
  masteryData: StudentMastery[]
): 'practice' | 'challenge' | 'review' | 'break' | 'celebrate' | null {
  if (!recommendation) return null;

  switch (recommendation.type) {
    case 'review':
      return 'review';
    case 'practice':
      return 'practice';
    case 'quest':
      return 'challenge';
    case 'challenge_up':
      return 'challenge';
    case 'celebration':
      return 'celebrate';
    default:
      return null;
  }
}

/**
 * Map recommendation to challenge difficulty
 */
export function getRecommendedDifficulty(
  recommendation: Recommendation | null,
  currentMastery: number
): 'Novice' | 'Beginner' | 'Skilled' | 'Master' {
  if (!recommendation) {
    if (currentMastery < MASTERY_THRESHOLDS.STRUGGLING) return 'Novice';
    if (currentMastery < MASTERY_THRESHOLDS.DEVELOPING) return 'Beginner';
    if (currentMastery < MASTERY_THRESHOLDS.PROFICIENT) return 'Skilled';
    return 'Master';
  }

  if (recommendation.type === 'review') return 'Novice';
  if (recommendation.type === 'practice') return 'Beginner';
  if (recommendation.type === 'quest') return 'Skilled';
  if (recommendation.type === 'challenge_up') return 'Master';

  return 'Beginner';
}

/**
 * Check if student meets quest unlock requirements
 */
export function checkQuestUnlockStatus(
  quest: QuestInfo,
  masteryData: StudentMastery[],
  completedQuestIds: number[]
): { unlocked: boolean; reason: string; recommendedAction?: string } {
  // Calculate domain averages
  const domainAverages = new Map<string, number>();
  const domainMastery = new Map<string, StudentMastery[]>();

  for (const mastery of masteryData) {
    if (!domainMastery.has(mastery.domain)) {
      domainMastery.set(mastery.domain, []);
    }
    domainMastery.get(mastery.domain)!.push(mastery);
  }

  for (const [domain, skills] of domainMastery.entries()) {
    const avg = Math.round(skills.reduce((sum, s) => sum + s.masteryPercentage, 0) / skills.length);
    domainAverages.set(domain, avg);
  }

  // Use adaptive engine's unlock check
  const result = isQuestUnlocked(quest, completedQuestIds, domainAverages);

  // Add recommended action if locked
  if (!result.unlocked) {
    if (quest.prerequisiteQuestId) {
      return {
        ...result,
        recommendedAction: `Complete prerequisite quest first`,
      };
    } else if (quest.requiredMasteryDomain) {
      const currentMastery = domainAverages.get(quest.requiredMasteryDomain) || 0;
      const needed = quest.requiredMasteryPercentage - currentMastery;
      return {
        ...result,
        recommendedAction: `Practice ${quest.requiredMasteryDomain.toLowerCase()} to gain ${needed}% more mastery`,
      };
    }
  }

  return result;
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  getAdaptiveNextChallenge,
  getStudentProgressSummary,
  shouldSuggestBreak,
  recommendNextQuestAfterCompletion,
  checkQuestUnlockStatus,
  getRecommendedDifficulty,
};
