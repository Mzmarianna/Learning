/**
 * CLAN API - Frontend integration with Supabase
 */

import { supabase } from '../supabase';
import type { ClanActivity } from '../clan-system';

export interface ClanStats {
  clanId: string;
  totalPoints: number;
  memberCount: number;
  weeklyContribution: number;
  rank: number;
}

/**
 * Get student's clan information
 */
export async function getStudentClan(studentId: string) {
  const { data, error } = await supabase
    .from('student_profiles')
    .select('clan_id, clan_points, weekly_clan_contribution')
    .eq('id', studentId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get clan statistics
 */
export async function getClanStats(clanId: string): Promise<ClanStats> {
  // Get total members in clan
  const { count: memberCount } = await supabase
    .from('student_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('clan_id', clanId);

  // Get total clan points
  const { data: members } = await supabase
    .from('student_profiles')
    .select('clan_points, weekly_clan_contribution')
    .eq('clan_id', clanId);

  const totalPoints = members?.reduce((sum, m) => sum + m.clan_points, 0) || 0;
  const weeklyContribution = members?.reduce((sum, m) => sum + m.weekly_clan_contribution, 0) || 0;

  // Calculate rank (placeholder - would need global clan comparison)
  const rank = 1;

  return {
    clanId,
    totalPoints,
    memberCount: memberCount || 0,
    weeklyContribution,
    rank,
  };
}

/**
 * Get student's clan rank within their clan
 */
export async function getStudentClanRank(studentId: string): Promise<number> {
  const { data: rank, error } = await supabase
    .rpc('get_student_clan_rank', { student_uuid: studentId });

  if (error) throw error;
  return rank || 999;
}

/**
 * Award clan points to student
 */
export async function awardClanPoints(
  studentId: string,
  activityType: ClanActivity['activityType'],
  points: number,
  description: string
) {
  const { data, error } = await supabase
    .rpc('award_clan_points', {
      p_student_id: studentId,
      p_activity_type: activityType,
      p_points: points,
      p_description: description,
    });

  if (error) throw error;
  return data;
}

/**
 * Get clan activities for a student
 */
export async function getStudentClanActivities(studentId: string, limit = 10) {
  const { data, error } = await supabase
    .from('clan_activities')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Get active clan challenges
 */
export async function getActiveClanChallenges() {
  const { data, error } = await supabase
    .from('clan_challenges')
    .select('*')
    .eq('status', 'active')
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Assign student to clan (admin/tutor only)
 */
export async function assignStudentToClan(studentId: string, clanId: string) {
  const { data, error } = await supabase
    .from('student_profiles')
    .update({ clan_id: clanId })
    .eq('id', studentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
