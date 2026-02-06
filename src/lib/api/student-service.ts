/**
 * STUDENT SERVICE
 * API layer for student-related database operations
 */

import { supabase } from '../supabase/client';
import type {
  StudentProfile,
  StudentDashboardView,
  QuestProgress,
  ChallengeProgress,
  BadgeEarned,
  Submission,
  ActivityLog,
  MasteryLevel,
} from '../database.types';

// ============================================================================
// STUDENT PROFILE
// ============================================================================

/**
 * Get student profile by ID
 */
export async function getStudentProfile(studentId: string) {
  const { data, error } = await supabase
    .from('student_profiles')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', studentId)
    .single();

  if (error) {
    console.error('Error fetching student profile:', error);
    throw error;
  }

  return data;
}

/**
 * Get student dashboard data
 */
export async function getStudentDashboardData(studentId: string) {
  const { data, error } = await supabase
    .from('student_dashboard_view')
    .select('*')
    .eq('id', studentId)
    .single();

  if (error) {
    console.error('Error fetching student dashboard:', error);
    throw error;
  }

  return data;
}

/**
 * Update student profile
 */
export async function updateStudentProfile(
  studentId: string,
  updates: Partial<StudentProfile>
) {
  const { data, error } = await supabase
    .from('student_profiles')
    .update(updates)
    .eq('id', studentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating student profile:', error);
    throw error;
  }

  return data;
}

// ============================================================================
// QUEST & CHALLENGE PROGRESS
// ============================================================================

/**
 * Get student's quest progress
 */
export async function getQuestProgress(studentId: string, questId?: string) {
  let query = supabase
    .from('quest_progress')
    .select('*')
    .eq('student_id', studentId);

  if (questId) {
    query = query.eq('quest_id', questId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching quest progress:', error);
    throw error;
  }

  return data;
}

/**
 * Start a new quest
 */
export async function startQuest(
  studentId: string,
  questId: string,
  questWeek: number,
  totalChallenges: number
) {
  const { data, error } = await supabase
    .from('quest_progress')
    .insert({
      student_id: studentId,
      quest_id: questId,
      quest_week: questWeek,
      total_challenges: totalChallenges,
    })
    .select()
    .single();

  if (error) {
    console.error('Error starting quest:', error);
    throw error;
  }

  // Update student's current quest
  await updateStudentProfile(studentId, { current_quest_id: questId });

  // Log activity
  await logActivity(studentId, 'quest_start', { questId, questWeek });

  return data;
}

/**
 * Get challenge progress
 */
export async function getChallengeProgress(studentId: string, challengeId?: string) {
  let query = supabase
    .from('challenge_progress')
    .select('*')
    .eq('student_id', studentId);

  if (challengeId) {
    query = query.eq('challenge_id', challengeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching challenge progress:', error);
    throw error;
  }

  return data;
}

/**
 * Start a challenge
 */
export async function startChallenge(
  studentId: string,
  challengeId: string,
  questId: string
) {
  const { data, error } = await supabase
    .from('challenge_progress')
    .insert({
      student_id: studentId,
      challenge_id: challengeId,
      quest_id: questId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error starting challenge:', error);
    throw error;
  }

  // Log activity
  await logActivity(studentId, 'challenge_start', { challengeId, questId });

  return data;
}

/**
 * Complete a challenge
 */
export async function completeChallenge(
  studentId: string,
  challengeId: string,
  masteryLevel: MasteryLevel,
  xpEarned: number
) {
  // Update challenge progress
  const { data, error } = await supabase
    .from('challenge_progress')
    .update({
      completed_at: new Date().toISOString(),
      mastery_level: masteryLevel,
      xp_earned: xpEarned,
    })
    .eq('student_id', studentId)
    .eq('challenge_id', challengeId)
    .select()
    .single();

  if (error) {
    console.error('Error completing challenge:', error);
    throw error;
  }

  // Award XP to student
  await awardXP(studentId, xpEarned);

  // Update quest progress
  const questId = data.quest_id;
  await supabase.rpc('increment_quest_progress', {
    p_student_id: studentId,
    p_quest_id: questId,
    p_xp_amount: xpEarned,
  });

  // Log activity
  await logActivity(studentId, 'challenge_complete', {
    challengeId,
    questId,
    masteryLevel,
    xpEarned,
  });

  return data;
}

// ============================================================================
// XP & BADGES
// ============================================================================

/**
 * Award XP to student
 */
export async function awardXP(studentId: string, xpAmount: number) {
  const { error } = await supabase.rpc('award_xp_to_student', {
    p_student_id: studentId,
    p_xp_amount: xpAmount,
  });

  if (error) {
    console.error('Error awarding XP:', error);
    throw error;
  }

  // Log activity
  await logActivity(studentId, 'xp_earned', { amount: xpAmount });
}

/**
 * Get student's earned badges
 */
export async function getEarnedBadges(studentId: string) {
  const { data, error } = await supabase
    .from('badges_earned')
    .select('*')
    .eq('student_id', studentId)
    .order('earned_at', { ascending: false });

  if (error) {
    console.error('Error fetching badges:', error);
    throw error;
  }

  return data;
}

/**
 * Award badge to student
 */
export async function awardBadge(
  studentId: string,
  badgeId: string,
  questId: string
) {
  const { data, error } = await supabase
    .from('badges_earned')
    .insert({
      student_id: studentId,
      badge_id: badgeId,
      quest_id: questId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error awarding badge:', error);
    throw error;
  }

  // Log activity
  await logActivity(studentId, 'badge_earned', { badgeId, questId });

  return data;
}

// ============================================================================
// SUBMISSIONS
// ============================================================================

/**
 * Get student's submissions
 */
export async function getSubmissions(studentId: string, challengeId?: string) {
  let query = supabase
    .from('submissions')
    .select('*')
    .eq('student_id', studentId)
    .order('submitted_at', { ascending: false });

  if (challengeId) {
    query = query.eq('challenge_id', challengeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }

  return data;
}

/**
 * Get recent submissions (for dashboard)
 */
export async function getRecentSubmissions(studentId: string, limit: number = 5) {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('student_id', studentId)
    .order('submitted_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent submissions:', error);
    throw error;
  }

  return data;
}

/**
 * Create submission
 */
export async function createSubmission(submission: {
  student_id: string;
  challenge_id: string;
  challenge_title: string;
  quest_id: string;
  type: string;
  text_content?: string;
  image_urls?: string[];
  video_url?: string;
}) {
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      ...submission,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating submission:', error);
    throw error;
  }

  // Log activity
  await logActivity(submission.student_id, 'submission_created', {
    challengeId: submission.challenge_id,
    submissionId: data.id,
  });

  return data;
}

/**
 * Update submission with assessment
 */
export async function updateSubmissionWithAssessment(
  submissionId: string,
  assessment: {
    mastery_level: MasteryLevel;
    xp_earned: number;
    feedback: any;
  }
) {
  const { data, error } = await supabase
    .from('submissions')
    .update({
      status: 'assessed',
      mastery_level: assessment.mastery_level,
      xp_earned: assessment.xp_earned,
      feedback: assessment.feedback,
      assessed_at: new Date().toISOString(),
    })
    .eq('id', submissionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating submission:', error);
    throw error;
  }

  return data;
}

// ============================================================================
// ACTIVITY LOGGING
// ============================================================================

/**
 * Log student activity
 */
export async function logActivity(
  studentId: string,
  activityType: string,
  activityData?: Record<string, any>
) {
  const { error } = await supabase.from('activity_log').insert({
    student_id: studentId,
    activity_type: activityType,
    activity_data: activityData || {},
  });

  if (error) {
    console.error('Error logging activity:', error);
    // Don't throw - activity logging is non-critical
  }
}

/**
 * Get student's activity log
 */
export async function getActivityLog(
  studentId: string,
  limit: number = 50,
  activityType?: string
) {
  let query = supabase
    .from('activity_log')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (activityType) {
    query = query.eq('activity_type', activityType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching activity log:', error);
    throw error;
  }

  return data;
}

// ============================================================================
// LEARNING SESSIONS
// ============================================================================

/**
 * Start learning session
 */
export async function startLearningSession(studentId: string) {
  const { data, error } = await supabase
    .from('learning_sessions')
    .insert({
      student_id: studentId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error starting learning session:', error);
    throw error;
  }

  return data;
}

/**
 * End learning session
 */
export async function endLearningSession(
  sessionId: string,
  challengesWorkedOn: string[],
  xpEarned: number
) {
  const endedAt = new Date().toISOString();
  
  // Get session to calculate duration
  const { data: session } = await supabase
    .from('learning_sessions')
    .select('started_at')
    .eq('id', sessionId)
    .single();

  let durationMinutes = 0;
  if (session) {
    const startTime = new Date(session.started_at).getTime();
    const endTime = new Date(endedAt).getTime();
    durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
  }

  const { data, error } = await supabase
    .from('learning_sessions')
    .update({
      ended_at: endedAt,
      duration_minutes: durationMinutes,
      challenges_worked_on: challengesWorkedOn,
      xp_earned_in_session: xpEarned,
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error ending learning session:', error);
    throw error;
  }

  return data;
}

/**
 * Get weekly learning hours
 */
export async function getWeeklyLearningHours(studentId: string) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('learning_sessions')
    .select('duration_minutes')
    .eq('student_id', studentId)
    .gte('started_at', oneWeekAgo.toISOString())
    .not('duration_minutes', 'is', null);

  if (error) {
    console.error('Error fetching weekly hours:', error);
    return 0;
  }

  const totalMinutes = data.reduce((sum, session) => sum + (session.duration_minutes || 0), 0);
  return Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place
}

// ============================================================================
// MASTERY HISTORY
// ============================================================================

/**
 * Record mastery level for subject
 */
export async function recordMasteryLevel(
  studentId: string,
  subject: string,
  masteryLevel: MasteryLevel
) {
  const { error } = await supabase.from('mastery_history').insert({
    student_id: studentId,
    subject,
    mastery_level: masteryLevel,
  });

  if (error) {
    console.error('Error recording mastery level:', error);
    throw error;
  }
}

/**
 * Get recent mastery levels by subject
 */
export async function getRecentMasteryLevels(studentId: string, limit: number = 3) {
  const { data, error } = await supabase
    .from('mastery_history')
    .select('*')
    .eq('student_id', studentId)
    .order('recorded_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching mastery history:', error);
    throw error;
  }

  return data;
}
