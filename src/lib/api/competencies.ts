/**
 * COMPETENCY API - Frontend integration with Supabase
 */

import { supabase } from '../supabase';
import type { DevelopmentalArea, CompetencyProgress } from '../ib-competencies';

/**
 * Get all competencies
 */
export async function getAllCompetencies() {
  const { data, error } = await supabase
    .from('competencies')
    .select('*')
    .order('developmental_area');

  if (error) throw error;
  return data;
}

/**
 * Get competencies by developmental area
 */
export async function getCompetenciesByArea(area: DevelopmentalArea) {
  const { data, error } = await supabase
    .from('competencies')
    .select('*')
    .eq('developmental_area', area);

  if (error) throw error;
  return data;
}

/**
 * Get student's competency progress
 */
export async function getStudentCompetencyProgress(studentId: string) {
  const { data, error } = await supabase
    .from('student_competency_progress')
    .select(`
      *,
      competencies (*)
    `)
    .eq('student_id', studentId);

  if (error) throw error;
  
  // Convert to Record<string, CompetencyProgress>
  const progressMap: Record<string, any> = {};
  data?.forEach(item => {
    progressMap[item.competency_id] = item;
  });
  
  return progressMap;
}

/**
 * Get competency summary for student
 */
export async function getCompetencySummary(studentId: string) {
  const { data, error } = await supabase
    .rpc('get_competency_summary', { student_uuid: studentId });

  if (error) throw error;
  return data;
}

/**
 * Update competency progress
 */
export async function updateCompetencyProgress(
  studentId: string,
  competencyId: string,
  status: CompetencyProgress['status'],
  evidenceNote?: string,
  nextSteps?: string
) {
  const updates: any = {
    student_id: studentId,
    competency_id: competencyId,
    status,
    last_assessed: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (evidenceNote) {
    // Append to evidence_notes array
    const { data: current } = await supabase
      .from('student_competency_progress')
      .select('evidence_notes')
      .eq('student_id', studentId)
      .eq('competency_id', competencyId)
      .single();

    const notes = current?.evidence_notes || [];
    updates.evidence_notes = [...notes, evidenceNote];
  }

  if (nextSteps) {
    updates.next_steps = nextSteps;
  }

  const { data, error } = await supabase
    .from('student_competency_progress')
    .upsert(updates)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Add evidence note to competency
 */
export async function addCompetencyEvidence(
  studentId: string,
  competencyId: string,
  evidenceNote: string
) {
  // Get current evidence notes
  const { data: current } = await supabase
    .from('student_competency_progress')
    .select('evidence_notes')
    .eq('student_id', studentId)
    .eq('competency_id', competencyId)
    .single();

  const notes = current?.evidence_notes || [];
  
  const { data, error } = await supabase
    .from('student_competency_progress')
    .upsert({
      student_id: studentId,
      competency_id: competencyId,
      evidence_notes: [...notes, evidenceNote],
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Initialize competency tracking for new student
 */
export async function initializeStudentCompetencies(studentId: string) {
  // Get all competencies
  const { data: competencies } = await supabase
    .from('competencies')
    .select('id');

  if (!competencies) return;

  // Create progress records for all competencies
  const progressRecords = competencies.map(comp => ({
    student_id: studentId,
    competency_id: comp.id,
    status: 'not_started' as const,
  }));

  const { error } = await supabase
    .from('student_competency_progress')
    .upsert(progressRecords, { onConflict: 'student_id,competency_id' });

  if (error) throw error;
}
