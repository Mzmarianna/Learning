/**
 * THEMES API - Frontend integration with Supabase
 */

import { supabase } from '../supabase';
import type { WeeklyTheme } from '../theme-based-curriculum';

/**
 * Get active weekly themes
 */
export async function getActiveThemes(tier?: string) {
  let query = supabase
    .from('weekly_themes')
    .select('*')
    .eq('active', true)
    .order('start_date', { ascending: false });

  if (tier) {
    query = query.eq('tier', tier);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Get current theme for student's tier
 */
export async function getCurrentTheme(tier: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('weekly_themes')
    .select('*')
    .eq('tier', tier)
    .eq('active', true)
    .lte('start_date', today)
    .gte('end_date', today)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}

/**
 * Get theme by ID with all related data
 */
export async function getThemeById(themeId: string) {
  const { data: theme, error: themeError } = await supabase
    .from('weekly_themes')
    .select('*')
    .eq('id', themeId)
    .single();

  if (themeError) throw themeError;

  // Get daily activities
  const { data: activities, error: activitiesError } = await supabase
    .from('daily_activities')
    .select('*')
    .eq('theme_id', themeId)
    .order('day_of_week');

  if (activitiesError) throw activitiesError;

  // Get learning centers
  const { data: centers, error: centersError } = await supabase
    .from('learning_centers')
    .select('*')
    .eq('theme_id', themeId)
    .eq('active', true);

  if (centersError) throw centersError;

  return {
    ...theme,
    dailyActivities: activities,
    learningCenters: centers,
  };
}

/**
 * Get daily activities for a theme
 */
export async function getDailyActivities(themeId: string, dayOfWeek?: string) {
  let query = supabase
    .from('daily_activities')
    .select('*')
    .eq('theme_id', themeId);

  if (dayOfWeek) {
    query = query.eq('day_of_week', dayOfWeek);
  }

  query = query.order('day_of_week');

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Get today's activity
 */
export async function getTodaysActivity(themeId: string) {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];

  const { data, error } = await supabase
    .from('daily_activities')
    .select('*')
    .eq('theme_id', themeId)
    .eq('day_of_week', today)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/**
 * Get learning centers for a theme
 */
export async function getLearningCenters(themeId?: string) {
  let query = supabase
    .from('learning_centers')
    .select('*')
    .eq('active', true);

  if (themeId) {
    query = query.eq('theme_id', themeId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Create new theme (admin/tutor only)
 */
export async function createTheme(themeData: Partial<WeeklyTheme>) {
  const { data, error } = await supabase
    .from('weekly_themes')
    .insert(themeData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update theme
 */
export async function updateTheme(themeId: string, updates: Partial<WeeklyTheme>) {
  const { data, error } = await supabase
    .from('weekly_themes')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', themeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Deactivate theme
 */
export async function deactivateTheme(themeId: string) {
  const { data, error } = await supabase
    .from('weekly_themes')
    .update({ active: false })
    .eq('id', themeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
