/**
 * TUTOR SERVICE
 * API layer for tutor-related database operations
 */

import { supabase } from '../supabase/client';
import type {
  TutorStudentOverview,
  Submission,
  TutorAlert,
  Lesson,
  MasteryLevel,
} from '../database.types';

// ============================================================================
// STUDENT MANAGEMENT
// ============================================================================

/**
 * Get all students assigned to tutor
 */
export async function getTutorStudents(tutorId: string) {
  const { data, error } = await supabase
    .from('tutor_student_overview')
    .select('*')
    .eq('tutor_id', tutorId)
    .order('needs_attention', { ascending: false })
    .order('display_name');

  if (error) {
    console.error('Error fetching tutor students:', error);
    throw error;
  }

  return data;
}

/**
 * Get detailed student information
 */
export async function getStudentDetails(studentId: string) {
  // Get student profile
  const { data: student, error: studentError } = await supabase
    .from('student_profiles')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', studentId)
    .single();

  if (studentError) {
    console.error('Error fetching student details:', error);
    throw studentError;
  }

  // Get current quest progress
  const { data: questProgress } = await supabase
    .from('quest_progress')
    .select('*')
    .eq('student_id', studentId)
    .order('quest_week', { ascending: false })
    .limit(1)
    .single();

  // Get recent submissions
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('student_id', studentId)
    .order('submitted_at', { ascending: false })
    .limit(10);

  // Get recent mastery levels
  const { data: masteryHistory } = await supabase
    .from('mastery_history')
    .select('*')
    .eq('student_id', studentId)
    .order('recorded_at', { ascending: false })
    .limit(5);

  // Get weekly hours
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data: sessions } = await supabase
    .from('learning_sessions')
    .select('duration_minutes')
    .eq('student_id', studentId)
    .gte('started_at', oneWeekAgo.toISOString())
    .not('duration_minutes', 'is', null);

  const weeklyHours = sessions
    ? Math.round((sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / 60) * 10) / 10
    : 0;

  // Check if needs attention
  const { data: needsAttention } = await supabase.rpc('check_student_needs_attention', {
    p_student_id: studentId,
  });

  return {
    ...student,
    currentQuest: questProgress,
    recentSubmissions: submissions || [],
    recentMasteryHistory: masteryHistory || [],
    weeklyHours,
    needsAttention: needsAttention || false,
  };
}

/**
 * Assign student to tutor
 */
export async function assignStudentToTutor(
  tutorId: string,
  studentId: string,
  notes?: string
) {
  const { data, error } = await supabase
    .from('tutor_students')
    .insert({
      tutor_id: tutorId,
      student_id: studentId,
      notes,
    })
    .select()
    .single();

  if (error) {
    console.error('Error assigning student:', error);
    throw error;
  }

  return data;
}

/**
 * Update tutor notes for student
 */
export async function updateTutorNotes(
  tutorId: string,
  studentId: string,
  notes: string
) {
  const { error } = await supabase
    .from('tutor_students')
    .update({ notes })
    .eq('tutor_id', tutorId)
    .eq('student_id', studentId);

  if (error) {
    console.error('Error updating tutor notes:', error);
    throw error;
  }
}

// ============================================================================
// SUBMISSIONS & REVIEWS
// ============================================================================

/**
 * Get pending reviews for tutor
 */
export async function getPendingReviews(tutorId: string) {
  // Get all students assigned to tutor
  const { data: students } = await supabase
    .from('tutor_students')
    .select('student_id')
    .eq('tutor_id', tutorId);

  if (!students || students.length === 0) {
    return [];
  }

  const studentIds = students.map(s => s.student_id);

  // Get submissions needing manual review
  const { data: submissions, error } = await supabase
    .from('submissions')
    .select(`
      *,
      student:student_profiles(
        id,
        profile:profiles(display_name)
      )
    `)
    .in('student_id', studentIds)
    .or('needs_manual_review.eq.true,status.eq.resubmitted')
    .order('submitted_at', { ascending: true });

  if (error) {
    console.error('Error fetching pending reviews:', error);
    throw error;
  }

  return submissions?.map(s => ({
    submissionId: s.id,
    studentName: s.student.profile.display_name,
    challengeTitle: s.challenge_title,
    submittedAt: new Date(s.submitted_at),
    type: s.needs_manual_review
      ? ('manual-review' as const)
      : s.is_resubmission
      ? ('resubmission' as const)
      : ('portfolio' as const),
  })) || [];
}

/**
 * Get submission for review
 */
export async function getSubmissionForReview(submissionId: string) {
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      student:student_profiles(
        id,
        age,
        tier,
        profile:profiles(display_name)
      ),
      scores:assessment_scores(*)
    `)
    .eq('id', submissionId)
    .single();

  if (error) {
    console.error('Error fetching submission:', error);
    throw error;
  }

  return data;
}

/**
 * Update submission after manual review
 */
export async function updateSubmissionAfterReview(
  submissionId: string,
  tutorId: string,
  updates: {
    mastery_level: MasteryLevel;
    xp_earned: number;
    feedback: any;
    notes?: string;
  }
) {
  const { data, error } = await supabase
    .from('submissions')
    .update({
      status: 'assessed',
      mastery_level: updates.mastery_level,
      xp_earned: updates.xp_earned,
      feedback: updates.feedback,
      reviewed_by: tutorId,
      assessed_at: new Date().toISOString(),
      needs_manual_review: false,
      flagged_for_tutor: false,
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
// ALERTS
// ============================================================================

/**
 * Get alerts for tutor
 */
export async function getTutorAlerts(tutorId: string, includeResolved: boolean = false) {
  let query = supabase
    .from('tutor_alerts')
    .select(`
      *,
      student:student_profiles(
        id,
        profile:profiles(display_name)
      )
    `)
    .eq('tutor_id', tutorId)
    .order('created_at', { ascending: false });

  if (!includeResolved) {
    query = query.eq('resolved', false);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching tutor alerts:', error);
    throw error;
  }

  return data?.map(alert => ({
    id: alert.id,
    type: alert.alert_type as 'warning' | 'info' | 'success',
    studentName: alert.student.profile.display_name,
    message: alert.message,
    timestamp: new Date(alert.created_at),
    actionable: alert.actionable,
    resolved: alert.resolved,
  })) || [];
}

/**
 * Create alert
 */
export async function createTutorAlert(
  tutorId: string,
  studentId: string,
  alertType: 'warning' | 'info' | 'success',
  message: string,
  actionable: boolean = false
) {
  const { data, error } = await supabase
    .from('tutor_alerts')
    .insert({
      tutor_id: tutorId,
      student_id: studentId,
      alert_type: alertType,
      message,
      actionable,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating alert:', error);
    throw error;
  }

  return data;
}

/**
 * Resolve alert
 */
export async function resolveAlert(alertId: string) {
  const { error } = await supabase
    .from('tutor_alerts')
    .update({ resolved: true })
    .eq('id', alertId);

  if (error) {
    console.error('Error resolving alert:', error);
    throw error;
  }
}

// ============================================================================
// LESSONS
// ============================================================================

/**
 * Get tutor's lessons
 */
export async function getTutorLessons(tutorId: string, futureOnly: boolean = false) {
  let query = supabase
    .from('lessons')
    .select(`
      *,
      participants:lesson_participants(
        student:student_profiles(
          id,
          profile:profiles(display_name)
        ),
        attended
      )
    `)
    .eq('tutor_id', tutorId)
    .order('scheduled_at', { ascending: true });

  if (futureOnly) {
    query = query.gte('scheduled_at', new Date().toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }

  return data;
}

/**
 * Create lesson
 */
export async function createLesson(
  tutorId: string,
  lesson: {
    title: string;
    description?: string;
    type: 'one-on-one' | 'small-group' | 'workshop' | 'assessment';
    scheduled_at: string;
    duration_minutes?: number;
    notes?: string;
  },
  studentIds: string[]
) {
  // Create lesson
  const { data: newLesson, error: lessonError } = await supabase
    .from('lessons')
    .insert({
      tutor_id: tutorId,
      ...lesson,
    })
    .select()
    .single();

  if (lessonError) {
    console.error('Error creating lesson:', error);
    throw lessonError;
  }

  // Add participants
  if (studentIds.length > 0) {
    const participants = studentIds.map(studentId => ({
      lesson_id: newLesson.id,
      student_id: studentId,
    }));

    const { error: participantsError } = await supabase
      .from('lesson_participants')
      .insert(participants);

    if (participantsError) {
      console.error('Error adding lesson participants:', participantsError);
      throw participantsError;
    }
  }

  return newLesson;
}

/**
 * Update lesson
 */
export async function updateLesson(
  lessonId: string,
  updates: {
    title?: string;
    description?: string;
    scheduled_at?: string;
    duration_minutes?: number;
    notes?: string;
  }
) {
  const { data, error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', lessonId)
    .select()
    .single();

  if (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }

  return data;
}

/**
 * Mark student attendance
 */
export async function markAttendance(lessonId: string, studentId: string, attended: boolean) {
  const { error } = await supabase
    .from('lesson_participants')
    .update({ attended })
    .eq('lesson_id', lessonId)
    .eq('student_id', studentId);

  if (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
}

// ============================================================================
// MESSAGING
// ============================================================================

/**
 * Get tutor's messages
 */
export async function getTutorMessages(tutorId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(display_name),
      student:student_profiles(
        id,
        profile:profiles(display_name)
      )
    `)
    .eq('recipient_id', tutorId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return data;
}

/**
 * Send message to parent
 */
export async function sendMessageToParent(
  tutorId: string,
  parentId: string,
  studentId: string,
  subject: string,
  content: string
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: tutorId,
      recipient_id: parentId,
      student_id: studentId,
      type: 'tutor-parent',
      subject,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }

  return data;
}

// ============================================================================
// ANALYTICS
// ============================================================================

/**
 * Get tutor dashboard statistics
 */
export async function getTutorDashboardStats(tutorId: string) {
  // Get all assigned students
  const { data: students } = await supabase
    .from('tutor_students')
    .select('student_id')
    .eq('tutor_id', tutorId);

  if (!students || students.length === 0) {
    return {
      totalStudents: 0,
      activeThisWeek: 0,
      needsAttention: 0,
      pendingReviews: 0,
    };
  }

  const studentIds = students.map(s => s.student_id);

  // Active this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data: activeStudents } = await supabase
    .from('activity_log')
    .select('student_id')
    .in('student_id', studentIds)
    .gte('created_at', oneWeekAgo.toISOString());

  const activeThisWeek = new Set(activeStudents?.map(a => a.student_id)).size;

  // Needs attention (check function for each student)
  let needsAttention = 0;
  for (const studentId of studentIds) {
    const { data } = await supabase.rpc('check_student_needs_attention', {
      p_student_id: studentId,
    });
    if (data) needsAttention++;
  }

  // Pending reviews
  const { count: pendingReviews } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .in('student_id', studentIds)
    .or('needs_manual_review.eq.true,status.eq.resubmitted');

  return {
    totalStudents: studentIds.length,
    activeThisWeek,
    needsAttention,
    pendingReviews: pendingReviews || 0,
  };
}
