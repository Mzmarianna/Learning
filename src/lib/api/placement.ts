/**
 * Placement Quiz API
 * Save and retrieve placement quiz results
 */

import { supabase } from '../supabase';
import type { PlacementResult } from '../placement-quiz';

/**
 * Save placement quiz results to database
 */
export async function savePlacementResults(
  studentId: string,
  result: PlacementResult,
  quizAnswers: any[]
) {
  const { data, error } = await supabase.rpc('save_placement_quiz_result', {
    p_student_id: studentId,
    p_assigned_tier: result.tier,
    p_math_level: result.mathLevel,
    p_reading_level: result.readingLevel,
    p_writing_level: result.writingLevel,
    p_overall_level: result.overallLevel,
    p_learning_style: result.learningStyle,
    p_strengths: result.strengths,
    p_growth_areas: result.growthAreas,
    p_recommendations: result.recommendations,
    p_neurodivergent_supports: result.neurodivergentSupports,
    p_recommended_start_quest: result.recommendedStartQuest,
    p_quiz_answers: quizAnswers,
  });

  if (error) throw error;
  return data;
}

/**
 * Get placement quiz results for student
 */
export async function getPlacementResults(studentId: string) {
  const { data, error } = await supabase
    .rpc('get_placement_result', { p_student_id: studentId });

  if (error) throw error;
  return data?.[0] || null;
}

/**
 * Check if student has completed placement quiz
 */
export async function hasCompletedPlacementQuiz(studentId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('placement_quiz_results')
    .select('id')
    .eq('student_id', studentId)
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}
