/**
 * PARENT SERVICE
 * API layer for parent-related database operations
 */

import { supabase } from '../supabase/client';
import type { ParentChildView, Message } from '../database.types';

// ============================================================================
// CHILDREN MANAGEMENT
// ============================================================================

/**
 * Get all children for a parent
 */
export async function getParentChildren(parentId: string) {
  const { data, error } = await supabase
    .from('parent_child_view')
    .select('*')
    .eq('parent_id', parentId)
    .order('display_name');

  if (error) {
    console.error('Error fetching parent children:', error);
    throw error;
  }

  return data;
}

/**
 * Get detailed child progress
 */
export async function getChildDetailedProgress(studentId: string) {
  // Get basic profile
  const { data: profile, error: profileError } = await supabase
    .from('student_profiles')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', studentId)
    .single();

  if (profileError) {
    console.error('Error fetching child profile:', error);
    throw profileError;
  }

  // Get quest progress
  const { data: questProgress } = await supabase
    .from('quest_progress')
    .select('*')
    .eq('student_id', studentId)
    .order('quest_week', { ascending: false })
    .limit(1)
    .single();

  // Get recent badges
  const { data: badges } = await supabase
    .from('badges_earned')
    .select('*')
    .eq('student_id', studentId)
    .order('earned_at', { ascending: false });

  // Get challenge completion count
  const { count: challengeCount } = await supabase
    .from('challenge_progress')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .not('completed_at', 'is', null);

  // Get recent mastery levels
  const { data: masteryLevels } = await supabase
    .from('mastery_history')
    .select('*')
    .eq('student_id', studentId)
    .order('recorded_at', { ascending: false })
    .limit(3);

  // Get weekly learning hours
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

  // Get last activity
  const { data: lastActivity } = await supabase
    .from('activity_log')
    .select('created_at')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return {
    ...profile,
    currentQuest: questProgress,
    badges: badges || [],
    challengesCompleted: challengeCount || 0,
    recentMasteryLevels: masteryLevels || [],
    weeklyHours,
    lastActive: lastActivity?.created_at,
  };
}

/**
 * Link child to parent account
 */
export async function linkChildToParent(
  parentId: string,
  studentId: string,
  relationship: string = 'parent'
) {
  const { data, error } = await supabase
    .from('parent_students')
    .insert({
      parent_id: parentId,
      student_id: studentId,
      relationship,
    })
    .select()
    .single();

  if (error) {
    console.error('Error linking child to parent:', error);
    throw error;
  }

  return data;
}

/**
 * Remove child from parent account
 */
export async function unlinkChildFromParent(parentId: string, studentId: string) {
  const { error } = await supabase
    .from('parent_students')
    .delete()
    .eq('parent_id', parentId)
    .eq('student_id', studentId);

  if (error) {
    console.error('Error unlinking child:', error);
    throw error;
  }
}

// ============================================================================
// ACTIVITY & INSIGHTS
// ============================================================================

/**
 * Get recent activity for all children
 */
export async function getChildrenRecentActivity(parentId: string, limit: number = 20) {
  // Get all child IDs
  const { data: children } = await supabase
    .from('parent_students')
    .select('student_id')
    .eq('parent_id', parentId);

  if (!children || children.length === 0) {
    return [];
  }

  const studentIds = children.map(c => c.student_id);

  // Get recent submissions
  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      *,
      student:student_profiles(
        id,
        profile:profiles(display_name)
      )
    `)
    .in('student_id', studentIds)
    .eq('status', 'assessed')
    .order('submitted_at', { ascending: false })
    .limit(limit);

  // Get recent badges
  const { data: badges } = await supabase
    .from('badges_earned')
    .select(`
      *,
      student:student_profiles(
        id,
        profile:profiles(display_name)
      )
    `)
    .in('student_id', studentIds)
    .order('earned_at', { ascending: false })
    .limit(limit);

  // Combine and sort by timestamp
  const activity = [
    ...(submissions || []).map(s => ({
      id: s.id,
      type: 'submission' as const,
      childName: s.student.profile.display_name,
      title: s.challenge_title,
      timestamp: new Date(s.submitted_at),
      details: `Mastery: ${s.mastery_level}, XP: ${s.xp_earned}`,
    })),
    ...(badges || []).map(b => ({
      id: b.id,
      type: 'badge' as const,
      childName: b.student.profile.display_name,
      title: `Earned ${b.badge_id} badge`,
      timestamp: new Date(b.earned_at),
      details: `Quest: ${b.quest_id}`,
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return activity.slice(0, limit);
}

/**
 * Get learning insights for a child
 */
export async function getChildLearningInsights(studentId: string) {
  // Peak learning time
  const { data: sessions } = await supabase
    .from('learning_sessions')
    .select('started_at')
    .eq('student_id', studentId)
    .not('started_at', 'is', null);

  const hourCounts: Record<number, number> = {};
  sessions?.forEach(session => {
    const hour = new Date(session.started_at).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const peakHour = Object.entries(hourCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0];

  // Favorite subjects (by submission count and mastery)
  const { data: submissions } = await supabase
    .from('submissions')
    .select('challenge_id, mastery_level')
    .eq('student_id', studentId)
    .eq('status', 'assessed');

  // This would need challenge metadata to determine subject
  // For now, return placeholder
  const favoriteSubjects = ['STEAM', 'Math']; // TODO: Calculate from actual data

  // Average session duration
  const { data: completeSessions } = await supabase
    .from('learning_sessions')
    .select('duration_minutes')
    .eq('student_id', studentId)
    .not('duration_minutes', 'is', null);

  const avgSessionMinutes = completeSessions?.length
    ? Math.round(
        completeSessions.reduce((sum, s) => sum + s.duration_minutes, 0) /
          completeSessions.length
      )
    : 0;

  // Strengths (subjects with advanced/mastered majority)
  const { data: masteryLevels } = await supabase
    .from('mastery_history')
    .select('subject, mastery_level')
    .eq('student_id', studentId);

  const subjectMastery: Record<string, string[]> = {};
  masteryLevels?.forEach(m => {
    if (!subjectMastery[m.subject]) {
      subjectMastery[m.subject] = [];
    }
    subjectMastery[m.subject].push(m.mastery_level);
  });

  const strengths: string[] = [];
  const growthAreas: string[] = [];

  Object.entries(subjectMastery).forEach(([subject, levels]) => {
    const advancedCount = levels.filter(l => l === 'advanced' || l === 'mastered').length;
    const emergingCount = levels.filter(l => l === 'emerging' || l === 'developing').length;
    
    if (advancedCount > levels.length / 2) {
      strengths.push(subject);
    } else if (emergingCount > levels.length / 2) {
      growthAreas.push(subject);
    }
  });

  return {
    peakLearningTime: peakHour ? `${peakHour}:00` : 'Not enough data',
    favoriteSubjects,
    averageSessionMinutes: avgSessionMinutes,
    strengths,
    growthAreas,
  };
}

// ============================================================================
// REPORTS
// ============================================================================

/**
 * Generate progress report data
 */
export async function generateProgressReport(studentId: string, dateRange?: {
  startDate: string;
  endDate: string;
}) {
  const startDate = dateRange?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const endDate = dateRange?.endDate || new Date().toISOString();

  // Get submissions in date range
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('student_id', studentId)
    .gte('submitted_at', startDate)
    .lte('submitted_at', endDate)
    .order('submitted_at', { ascending: true });

  // Get badges earned in date range
  const { data: badges } = await supabase
    .from('badges_earned')
    .select('*')
    .eq('student_id', studentId)
    .gte('earned_at', startDate)
    .lte('earned_at', endDate);

  // Get learning sessions in date range
  const { data: sessions } = await supabase
    .from('learning_sessions')
    .select('*')
    .eq('student_id', studentId)
    .gte('started_at', startDate)
    .lte('ended_at', endDate)
    .not('duration_minutes', 'is', null);

  // Calculate stats
  const totalXPEarned = submissions?.reduce((sum, s) => sum + s.xp_earned, 0) || 0;
  const totalHours = sessions
    ? Math.round((sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / 60) * 10) / 10
    : 0;

  const masteryBreakdown = {
    emerging: submissions?.filter(s => s.mastery_level === 'emerging').length || 0,
    developing: submissions?.filter(s => s.mastery_level === 'developing').length || 0,
    proficient: submissions?.filter(s => s.mastery_level === 'proficient').length || 0,
    advanced: submissions?.filter(s => s.mastery_level === 'advanced').length || 0,
    mastered: submissions?.filter(s => s.mastery_level === 'mastered').length || 0,
  };

  return {
    dateRange: { startDate, endDate },
    submissions: submissions || [],
    badges: badges || [],
    sessions: sessions || [],
    stats: {
      totalSubmissions: submissions?.length || 0,
      totalXPEarned,
      totalHours,
      badgesEarned: badges?.length || 0,
      masteryBreakdown,
    },
  };
}

// ============================================================================
// MESSAGING
// ============================================================================

/**
 * Get messages for parent
 */
export async function getParentMessages(parentId: string, limit: number = 50) {
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
    .eq('recipient_id', parentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return data;
}

/**
 * Send message to tutor
 */
export async function sendMessageToTutor(
  parentId: string,
  tutorId: string,
  studentId: string,
  subject: string,
  content: string
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: parentId,
      recipient_id: tutorId,
      student_id: studentId,
      type: 'parent-tutor',
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

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: string) {
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('id', messageId);

  if (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}
