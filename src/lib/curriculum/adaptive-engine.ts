// Adaptive Learning Recommendation Engine
// Analyzes student mastery and recommends personalized learning paths

export interface StudentMastery {
  competencyId: number;
  domain: string;
  skillName: string;
  masteryPercentage: number;
  attempts: number;
  lastAssessedAt: string | null;
}

export interface QuestInfo {
  id: number;
  code: string;
  title: string;
  subject: string;
  tier: string;
  level: number;
  difficulty: string;
  baseXp: number;
  requiredMasteryDomain: string | null;
  requiredMasteryPercentage: number;
  prerequisiteQuestId: number | null;
}

export interface Recommendation {
  type: 'quest' | 'practice' | 'review' | 'challenge_up' | 'celebration';
  questId?: number;
  competencyId?: number;
  priority: number; // 1-100, higher = more urgent
  reason: string;
  title: string;
  description: string;
  xpReward?: number;
  domain?: string;
}

// Mastery thresholds
export const MASTERY_THRESHOLDS = {
  STRUGGLING: 25,      // Below this = needs review/practice
  DEVELOPING: 50,      // Below this = still learning
  PROFICIENT: 75,      // At or above = ready for harder content
  MASTERY: 90,         // At or above = mastered, can skip or celebrate
};

// Map subjects to domains for matching
export const SUBJECT_TO_DOMAIN: Record<string, string> = {
  'math': 'Math',
  'reading': 'Reading',
  'writing': 'Writing',
  'steam': 'Science/STEAM',
  'executive_function': 'Executive Function',
  'test_prep': 'Math', // Test prep can map to multiple, default Math
};

export const DOMAIN_TO_SUBJECT: Record<string, string> = {
  'Math': 'math',
  'Reading': 'reading',
  'Writing': 'writing',
  'Science/STEAM': 'steam',
  'Executive Function': 'executive_function',
  'Social Studies': 'steam', // Covered under steam
  'Digital Literacy': 'steam',
  'Arts & Expression': 'steam',
};

/**
 * Generate personalized recommendations for a student
 */
export function generateRecommendations(
  _studentTier: string,
  masteryData: StudentMastery[],
  availableQuests: QuestInfo[],
  completedQuestIds: number[],
  inProgressQuestIds: number[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Group mastery by domain
  const domainMastery = new Map<string, { total: number; count: number; weakest: StudentMastery | null }>();
  
  for (const mastery of masteryData) {
    const existing = domainMastery.get(mastery.domain) || { total: 0, count: 0, weakest: null };
    existing.total += mastery.masteryPercentage;
    existing.count += 1;
    if (!existing.weakest || mastery.masteryPercentage < existing.weakest.masteryPercentage) {
      existing.weakest = mastery;
    }
    domainMastery.set(mastery.domain, existing);
  }

  // Calculate average mastery per domain
  const domainAverages = new Map<string, number>();
  for (const [domain, data] of domainMastery.entries()) {
    domainAverages.set(domain, Math.round(data.total / data.count));
  }

  // Find weakest domains (priority for recommendations)
  const sortedDomains = Array.from(domainAverages.entries())
    .sort((a, b) => a[1] - b[1]);

  // 1. Check for struggling areas that need immediate attention
  for (const [domain, avgMastery] of sortedDomains) {
    if (avgMastery < MASTERY_THRESHOLDS.STRUGGLING) {
      const weakestSkill = domainMastery.get(domain)?.weakest;
      if (weakestSkill) {
        recommendations.push({
          type: 'review',
          competencyId: weakestSkill.competencyId,
          priority: 95, // High priority
          reason: `${domain} skills need attention - currently at ${avgMastery}% mastery`,
          title: `Review: ${weakestSkill.skillName}`,
          description: `Let's strengthen your ${domain.toLowerCase()} foundation before moving forward.`,
          domain,
        });
      }
    }
  }

  // 2. Find quests that match weakest areas
  const weakestDomains = sortedDomains.slice(0, 3).map(d => d[0]);
  
  for (const quest of availableQuests) {
    // Skip completed or in-progress quests
    if (completedQuestIds.includes(quest.id) || inProgressQuestIds.includes(quest.id)) {
      continue;
    }

    // Skip if prerequisites not met
    if (quest.prerequisiteQuestId && !completedQuestIds.includes(quest.prerequisiteQuestId)) {
      continue;
    }

    // Check mastery requirements
    if (quest.requiredMasteryDomain && quest.requiredMasteryPercentage > 0) {
      const domainAvg = domainAverages.get(quest.requiredMasteryDomain) || 0;
      if (domainAvg < quest.requiredMasteryPercentage) {
        continue; // Not ready for this quest yet
      }
    }

    const questDomain = SUBJECT_TO_DOMAIN[quest.subject] || quest.subject;
    const domainAvg = domainAverages.get(questDomain) || 50;

    // Prioritize quests for weak domains
    let priority = 50;
    let reason = '';

    if (weakestDomains.includes(questDomain)) {
      priority = 85 - (weakestDomains.indexOf(questDomain) * 10);
      reason = `This quest will help strengthen your ${questDomain.toLowerCase()} skills`;
    } else if (domainAvg < MASTERY_THRESHOLDS.DEVELOPING) {
      priority = 60;
      reason = `Continue building ${questDomain.toLowerCase()} fundamentals`;
    } else if (domainAvg >= MASTERY_THRESHOLDS.PROFICIENT) {
      priority = 40;
      reason = `You're ready for this ${questDomain.toLowerCase()} challenge!`;
    } else {
      priority = 50;
      reason = `Keep practicing ${questDomain.toLowerCase()} with this quest`;
    }

    // Adjust priority by quest level (lower level = higher priority if struggling)
    if (domainAvg < MASTERY_THRESHOLDS.DEVELOPING) {
      priority += (5 - quest.level) * 2; // Favor lower-level quests
    } else {
      priority += quest.level * 2; // Favor higher-level quests
    }

    recommendations.push({
      type: 'quest',
      questId: quest.id,
      priority: Math.min(priority, 90),
      reason,
      title: quest.title,
      description: `Level ${quest.level} ${quest.difficulty || 'Novice'} • ${quest.baseXp} XP`,
      xpReward: quest.baseXp,
      domain: questDomain,
    });
  }

  // 3. Add practice recommendations for developing skills
  for (const [domain, data] of domainMastery.entries()) {
    const avg = domainAverages.get(domain) || 0;
    if (avg >= MASTERY_THRESHOLDS.STRUGGLING && avg < MASTERY_THRESHOLDS.PROFICIENT) {
      if (data.weakest) {
        recommendations.push({
          type: 'practice',
          competencyId: data.weakest.competencyId,
          priority: 65,
          reason: `Keep building ${domain.toLowerCase()} skills`,
          title: `Practice: ${data.weakest.skillName}`,
          description: `A few more practice sessions will help solidify this skill.`,
          domain,
        });
      }
    }
  }

  // 4. Add challenge-up recommendations for strong areas
  for (const [domain, avg] of domainAverages.entries()) {
    if (avg >= MASTERY_THRESHOLDS.PROFICIENT) {
      // Find a harder quest in this domain
      const harderQuest = availableQuests.find(q => {
        const qDomain = SUBJECT_TO_DOMAIN[q.subject] || q.subject;
        return qDomain === domain && 
               !completedQuestIds.includes(q.id) && 
               !inProgressQuestIds.includes(q.id) &&
               (q.difficulty === 'Skilled' || q.difficulty === 'Master');
      });

      if (harderQuest) {
        recommendations.push({
          type: 'challenge_up',
          questId: harderQuest.id,
          priority: 70,
          reason: `You're excelling in ${domain.toLowerCase()}! Ready for a bigger challenge?`,
          title: `Challenge Up: ${harderQuest.title}`,
          description: `${harderQuest.difficulty} difficulty • ${harderQuest.baseXp} XP`,
          xpReward: harderQuest.baseXp,
          domain,
        });
      }
    }
  }

  // 5. Add celebration for mastered areas
  for (const [domain, avg] of domainAverages.entries()) {
    if (avg >= MASTERY_THRESHOLDS.MASTERY) {
      recommendations.push({
        type: 'celebration',
        priority: 30,
        reason: `You've mastered ${domain.toLowerCase()}! Amazing work!`,
        title: `🎉 ${domain} Master!`,
        description: `You've achieved mastery level. Keep it up!`,
        domain,
      });
    }
  }

  // Sort by priority (highest first) and return top recommendations
  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 10);
}

/**
 * Check if a student has unlocked a specific quest
 */
export function isQuestUnlocked(
  quest: QuestInfo,
  completedQuestIds: number[],
  domainAverages: Map<string, number>
): { unlocked: boolean; reason: string } {
  // Check prerequisite quest
  if (quest.prerequisiteQuestId && !completedQuestIds.includes(quest.prerequisiteQuestId)) {
    return {
      unlocked: false,
      reason: 'Complete the prerequisite quest first',
    };
  }

  // Check mastery requirement
  if (quest.requiredMasteryDomain && quest.requiredMasteryPercentage > 0) {
    const domainAvg = domainAverages.get(quest.requiredMasteryDomain) || 0;
    if (domainAvg < quest.requiredMasteryPercentage) {
      return {
        unlocked: false,
        reason: `Reach ${quest.requiredMasteryPercentage}% mastery in ${quest.requiredMasteryDomain} to unlock`,
      };
    }
  }

  return { unlocked: true, reason: 'Quest available!' };
}

/**
 * Calculate overall readiness score for a domain
 */
export function calculateDomainReadiness(
  domain: string,
  masteryData: StudentMastery[]
): { score: number; level: string; nextMilestone: number } {
  const domainSkills = masteryData.filter(m => m.domain === domain);
  
  if (domainSkills.length === 0) {
    return { score: 0, level: 'Not Started', nextMilestone: 25 };
  }

  const avgMastery = Math.round(
    domainSkills.reduce((sum, s) => sum + s.masteryPercentage, 0) / domainSkills.length
  );

  let level: string;
  let nextMilestone: number;

  if (avgMastery < MASTERY_THRESHOLDS.STRUGGLING) {
    level = 'Beginning';
    nextMilestone = MASTERY_THRESHOLDS.STRUGGLING;
  } else if (avgMastery < MASTERY_THRESHOLDS.DEVELOPING) {
    level = 'Developing';
    nextMilestone = MASTERY_THRESHOLDS.DEVELOPING;
  } else if (avgMastery < MASTERY_THRESHOLDS.PROFICIENT) {
    level = 'Advancing';
    nextMilestone = MASTERY_THRESHOLDS.PROFICIENT;
  } else if (avgMastery < MASTERY_THRESHOLDS.MASTERY) {
    level = 'Proficient';
    nextMilestone = MASTERY_THRESHOLDS.MASTERY;
  } else {
    level = 'Mastery';
    nextMilestone = 100;
  }

  return { score: avgMastery, level, nextMilestone };
}

/**
 * Suggest which competency to work on next
 */
export function getNextCompetencyToWork(
  masteryData: StudentMastery[],
  preferredDomain?: string
): StudentMastery | null {
  let candidates = masteryData;
  
  if (preferredDomain) {
    const domainCandidates = masteryData.filter(m => m.domain === preferredDomain);
    if (domainCandidates.length > 0) {
      candidates = domainCandidates;
    }
  }

  // Find skills in the "sweet spot" - not too easy, not too hard
  // Ideal: 25-50% mastery (familiar but needs work)
  const sweetSpot = candidates.filter(
    m => m.masteryPercentage >= 25 && m.masteryPercentage < 50
  );

  if (sweetSpot.length > 0) {
    // Return the one with fewest attempts (most room for growth)
    return sweetSpot.sort((a, b) => a.attempts - b.attempts)[0];
  }

  // Fall back to lowest mastery that's been attempted
  const attempted = candidates.filter(m => m.attempts > 0);
  if (attempted.length > 0) {
    return attempted.sort((a, b) => a.masteryPercentage - b.masteryPercentage)[0];
  }

  // If nothing attempted, return lowest mastery overall
  return candidates.sort((a, b) => a.masteryPercentage - b.masteryPercentage)[0] || null;
}
