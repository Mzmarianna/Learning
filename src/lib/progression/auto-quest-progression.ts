/**
 * Auto-Quest Progression System
 * Automatically unlocks the next quest when student demonstrates mastery
 */

import { supabase } from '../supabase/client';
import { EXPLORERS_HUB_CURRICULUM } from '../curriculum/explorers-hub-curriculum';
import type { MasteryLevel } from '../wowl-mastery-engine';

export interface ProgressionCriteria {
  minimumMasteryLevel: MasteryLevel;
  minimumChallengesCompleted: number;
  minimumCompletionRate: number; // Percentage (0-100)
  requireAllChallenges: boolean;
}

export interface QuestProgressionResult {
  eligible: boolean;
  nextQuestId: string | null;
  nextQuestTheme: string | null;
  reason: string;
  congratsMessage?: string;
}

/**
 * Default progression criteria for advancing to next quest
 */
const DEFAULT_PROGRESSION_CRITERIA: ProgressionCriteria = {
  minimumMasteryLevel: 'proficient', // Must achieve proficient or higher
  minimumChallengesCompleted: 12, // Must complete at least 12/16 challenges
  minimumCompletionRate: 75, // Must complete at least 75% of quest
  requireAllChallenges: false, // Don't require 100% completion
};

/**
 * Check if student is eligible to progress to next quest
 */
export async function checkQuestProgression(
  studentId: string,
  currentQuestId: string,
  criteria: ProgressionCriteria = DEFAULT_PROGRESSION_CRITERIA
): Promise<QuestProgressionResult> {
  try {
    // Get current quest data
    const currentQuestWeek = parseInt(currentQuestId.split('-W')[1]);
    const currentQuest = EXPLORERS_HUB_CURRICULUM.find(q => q.week === currentQuestWeek);
    
    if (!currentQuest) {
      return {
        eligible: false,
        nextQuestId: null,
        nextQuestTheme: null,
        reason: 'Current quest not found',
      };
    }

    // Get student's progress on this quest
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('challenge_id, mastery_level')
      .eq('student_id', studentId)
      .in('challenge_id', currentQuest.challenges.map(c => c.challengeId));

    if (error) throw error;

    // Calculate progress
    const totalChallenges = currentQuest.challenges.length;
    const completedChallenges = submissions?.length || 0;
    const completionRate = (completedChallenges / totalChallenges) * 100;

    // Calculate average mastery level
    const masteryLevels: MasteryLevel[] = submissions?.map(s => s.mastery_level) || [];
    const averageMasteryScore = calculateAverageMastery(masteryLevels);

    // Check criteria
    const meetsMinimumChallenges = completedChallenges >= criteria.minimumChallengesCompleted;
    const meetsCompletionRate = completionRate >= criteria.minimumCompletionRate;
    const meetsMasteryLevel = averageMasteryScore >= getMasteryScore(criteria.minimumMasteryLevel);
    const meetsAllChallenges = criteria.requireAllChallenges ? completedChallenges === totalChallenges : true;

    // Not eligible - return reason
    if (!meetsMinimumChallenges) {
      return {
        eligible: false,
        nextQuestId: null,
        nextQuestTheme: null,
        reason: `Complete at least ${criteria.minimumChallengesCompleted} challenges (currently ${completedChallenges})`,
      };
    }

    if (!meetsCompletionRate) {
      return {
        eligible: false,
        nextQuestId: null,
        nextQuestTheme: null,
        reason: `Complete at least ${criteria.minimumCompletionRate}% of the quest (currently ${Math.round(completionRate)}%)`,
      };
    }

    if (!meetsMasteryLevel) {
      return {
        eligible: false,
        nextQuestId: null,
        nextQuestTheme: null,
        reason: `Achieve ${criteria.minimumMasteryLevel} mastery level or higher on average`,
      };
    }

    if (!meetsAllChallenges) {
      return {
        eligible: false,
        nextQuestId: null,
        nextQuestTheme: null,
        reason: 'Complete all challenges in this quest',
      };
    }

    // Eligible! Find next quest
    const nextQuest = EXPLORERS_HUB_CURRICULUM.find(q => q.week === currentQuestWeek + 1);
    
    if (!nextQuest) {
      return {
        eligible: true,
        nextQuestId: null,
        nextQuestTheme: null,
        reason: 'You\'ve completed all available quests! 🎉',
        congratsMessage: '🏆 Incredible work! You\'ve mastered all quests in this tier. Check back soon for new adventures!',
      };
    }

    return {
      eligible: true,
      nextQuestId: nextQuest.questId,
      nextQuestTheme: nextQuest.theme,
      reason: 'Quest mastery achieved!',
      congratsMessage: `🎉 Congratulations! You've mastered "${currentQuest.theme}"! Your next adventure awaits: "${nextQuest.theme}"`,
    };

  } catch (error) {
    console.error('Error checking quest progression:', error);
    return {
      eligible: false,
      nextQuestId: null,
      nextQuestTheme: null,
      reason: 'Error checking progression',
    };
  }
}

/**
 * Automatically assign next quest to student
 */
export async function autoAssignNextQuest(
  studentId: string,
  currentQuestId: string
): Promise<boolean> {
  try {
    // Check if eligible
    const progressionResult = await checkQuestProgression(studentId, currentQuestId);
    
    if (!progressionResult.eligible || !progressionResult.nextQuestId) {
      console.log('Not eligible for auto-progression:', progressionResult.reason);
      return false;
    }

    // Assign next quest
    const { error: assignError } = await supabase
      .from('student_quests')
      .insert({
        student_id: studentId,
        quest_id: progressionResult.nextQuestId,
        assigned_by: 'auto-progression',
        assigned_at: new Date().toISOString(),
        status: 'active',
        unlocked: true,
      });

    if (assignError) throw assignError;

    // Update student's current quest
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        current_quest_id: progressionResult.nextQuestId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', studentId);

    if (updateError) throw updateError;

    // Create notification for student
    await supabase.from('notifications').insert({
      user_id: studentId,
      type: 'quest_unlocked',
      title: '🎉 New Quest Unlocked!',
      message: progressionResult.congratsMessage,
      data: {
        quest_id: progressionResult.nextQuestId,
        quest_theme: progressionResult.nextQuestTheme,
      },
      read: false,
    });

    // Notify parent/tutor
    const { data: profile } = await supabase
      .from('profiles')
      .select('parent_email')
      .eq('id', studentId)
      .single();

    if (profile?.parent_email) {
      const { data: parentProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', profile.parent_email)
        .eq('role', 'parent')
        .single();

      if (parentProfile) {
        await supabase.from('notifications').insert({
          user_id: parentProfile.id,
          type: 'student_progress',
          title: 'Quest Completed!',
          message: `Your child has mastered a quest and unlocked a new one: "${progressionResult.nextQuestTheme}"`,
          data: {
            student_id: studentId,
            quest_id: progressionResult.nextQuestId,
          },
          read: false,
        });
      }
    }

    console.log(`✅ Auto-assigned quest ${progressionResult.nextQuestId} to student ${studentId}`);
    return true;

  } catch (error) {
    console.error('Error auto-assigning next quest:', error);
    return false;
  }
}

/**
 * Check progression after completing a challenge
 */
export async function checkProgressionAfterChallenge(
  studentId: string,
  challengeId: string,
  masteryLevel: MasteryLevel
): Promise<void> {
  try {
    // Only check if proficient or higher
    if (getMasteryScore(masteryLevel) < getMasteryScore('proficient')) {
      return;
    }

    // Get challenge's quest
    let questId: string | null = null;
    for (const quest of EXPLORERS_HUB_CURRICULUM) {
      if (quest.challenges.some(c => c.challengeId === challengeId)) {
        questId = quest.questId;
        break;
      }
    }

    if (!questId) return;

    // Check if student is eligible for next quest
    const result = await checkQuestProgression(studentId, questId);
    
    if (result.eligible && result.nextQuestId) {
      // Auto-assign next quest
      await autoAssignNextQuest(studentId, questId);
    }

  } catch (error) {
    console.error('Error checking progression after challenge:', error);
  }
}

/**
 * Helper: Convert mastery level to numeric score
 */
function getMasteryScore(level: MasteryLevel): number {
  const scores = {
    'emerging': 1,
    'developing': 2,
    'proficient': 3,
    'advanced': 4,
    'mastered': 5,
  };
  return scores[level];
}

/**
 * Helper: Calculate average mastery level from array
 */
function calculateAverageMastery(levels: MasteryLevel[]): number {
  if (levels.length === 0) return 0;
  
  const total = levels.reduce((sum, level) => sum + getMasteryScore(level), 0);
  return total / levels.length;
}

/**
 * Get student's quest progression status
 */
export async function getStudentProgressionStatus(studentId: string): Promise<{
  currentQuest: string;
  completedChallenges: number;
  totalChallenges: number;
  averageMastery: number;
  nextQuestEligible: boolean;
  nextQuestName?: string;
}> {
  try {
    // Get current quest
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_quest_id')
      .eq('id', studentId)
      .single();

    if (!profile?.current_quest_id) {
      return {
        currentQuest: 'none',
        completedChallenges: 0,
        totalChallenges: 0,
        averageMastery: 0,
        nextQuestEligible: false,
      };
    }

    const currentQuestWeek = parseInt(profile.current_quest_id.split('-W')[1]);
    const currentQuest = EXPLORERS_HUB_CURRICULUM.find(q => q.week === currentQuestWeek);

    if (!currentQuest) {
      return {
        currentQuest: profile.current_quest_id,
        completedChallenges: 0,
        totalChallenges: 0,
        averageMastery: 0,
        nextQuestEligible: false,
      };
    }

    // Get submissions
    const { data: submissions } = await supabase
      .from('submissions')
      .select('challenge_id, mastery_level')
      .eq('student_id', studentId)
      .in('challenge_id', currentQuest.challenges.map(c => c.challengeId));

    const completedChallenges = submissions?.length || 0;
    const totalChallenges = currentQuest.challenges.length;
    const masteryLevels = submissions?.map(s => s.mastery_level) || [];
    const averageMastery = calculateAverageMastery(masteryLevels);

    // Check eligibility
    const progressionResult = await checkQuestProgression(studentId, profile.current_quest_id);

    return {
      currentQuest: currentQuest.theme,
      completedChallenges,
      totalChallenges,
      averageMastery,
      nextQuestEligible: progressionResult.eligible,
      nextQuestName: progressionResult.nextQuestTheme || undefined,
    };

  } catch (error) {
    console.error('Error getting progression status:', error);
    return {
      currentQuest: 'error',
      completedChallenges: 0,
      totalChallenges: 0,
      averageMastery: 0,
      nextQuestEligible: false,
    };
  }
}
