/**
 * Form Processing Service
 * Processes Google Sheets form submissions and creates student profiles
 */

import { supabase } from '../../src/lib/supabase/client';
import type { FormSubmission } from './google-sheets-service';
import {
  parseChildNameAndGrade,
  estimateAgeFromGrade,
  determineTierFromGrade,
} from './google-sheets-service';

/**
 * Check if form submission has already been processed
 */
export async function isSubmissionProcessed(rowNumber: number): Promise<boolean> {
  const { data, error } = await supabase
    .from('form_submissions')
    .select('id')
    .eq('sheet_row_number', rowNumber)
    .single();

  return !!data && !error;
}

/**
 * Save form submission to database
 */
export async function saveFormSubmission(submission: FormSubmission) {
  const { data, error } = await supabase
    .from('form_submissions')
    .insert({
      sheet_row_number: submission.rowNumber,
      timestamp: submission.timestamp.toISOString(),
      email: submission.email,
      parent_name: submission.parentName,
      child_name_and_grade: submission.childNameAndGrade,
      biggest_struggles: submission.biggestStruggles,
      programs_interested: submission.programsInterested,
      tutoring_preference: submission.tutoringPreference,
      child_strengths: submission.childStrengths,
      child_likes: submission.childLikes,
      payment_method: submission.paymentMethod,
      availability: submission.availability,
      questions: submission.questions,
      processed: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving form submission:', error);
    throw error;
  }

  return data;
}

/**
 * Create parent profile if doesn't exist
 */
async function createOrGetParentProfile(email: string, name: string) {
  // Check if parent already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .eq('role', 'parent')
    .single();

  if (existingProfile) {
    return existingProfile;
  }

  // Create auth user (this would typically be done via Supabase Auth)
  // For now, we'll create a profile directly
  // In production, you'd invite the parent to create an account

  const { data: newProfile, error } = await supabase
    .from('profiles')
    .insert({
      email,
      display_name: name,
      role: 'parent',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating parent profile:', error);
    throw error;
  }

  return newProfile;
}

/**
 * Create student profile from form submission
 */
async function createStudentProfile(
  submission: FormSubmission,
  parentId: string,
  formSubmissionId: string
) {
  const { name: childName, grade } = parseChildNameAndGrade(submission.childNameAndGrade);
  const age = estimateAgeFromGrade(grade);
  const tier = determineTierFromGrade(grade);

  // Create auth user for student
  const { data: studentProfile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      email: `${submission.email.split('@')[0]}+${childName.toLowerCase().replace(/\s+/g, '')}@${submission.email.split('@')[1]}`,
      display_name: childName,
      role: 'student',
    })
    .select()
    .single();

  if (profileError) {
    console.error('Error creating student profile:', profileError);
    throw profileError;
  }

  // Create student-specific profile
  const { data: studentData, error: studentError } = await supabase
    .from('student_profiles')
    .insert({
      id: studentProfile.id,
      age,
      tier,
      current_level: 1,
      total_xp: 0,
      gems: 0,
      preferences: {
        interests: submission.childLikes.split(',').map(s => s.trim()),
        strengths: submission.childStrengths.split(',').map(s => s.trim()),
      },
    })
    .select()
    .single();

  if (studentError) {
    console.error('Error creating student profile data:', studentError);
    throw studentError;
  }

  // Create parent-student relationship
  const { error: relationError } = await supabase
    .from('parent_students')
    .insert({
      parent_id: parentId,
      student_id: studentProfile.id,
      relationship: 'parent',
    });

  if (relationError) {
    console.error('Error creating parent-student relationship:', relationError);
    throw relationError;
  }

  // Create student intake record
  const { error: intakeError } = await supabase
    .from('student_intake')
    .insert({
      student_id: studentProfile.id,
      form_submission_id: formSubmissionId,
      grade,
      age_estimated: age,
      biggest_struggles: submission.biggestStruggles.split(',').map(s => s.trim()),
      strengths: submission.childStrengths.split(',').map(s => s.trim()),
      interests: submission.childLikes.split(',').map(s => s.trim()),
      programs_interested: submission.programsInterested,
      tutoring_preference: submission.tutoringPreference,
      payment_method: submission.paymentMethod,
      availability_schedule: submission.availability,
      parent_questions: submission.questions,
    });

  if (intakeError) {
    console.error('Error creating student intake:', intakeError);
    throw intakeError;
  }

  return studentProfile;
}

/**
 * Create initial assessment record
 */
async function createAssessmentRecord(
  studentId: string,
  formSubmissionId: string,
  grade: number | null
) {
  const { data, error } = await supabase
    .from('assessments')
    .insert({
      student_id: studentId,
      form_submission_id: formSubmissionId,
      assessment_type: 'initial',
      status: 'scheduled',
      grade_level_assessed: grade,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating assessment:', error);
    throw error;
  }

  return data;
}

/**
 * Process a form submission end-to-end
 */
export async function processFormSubmission(submission: FormSubmission) {
  try {
    console.log(`Processing submission for ${submission.email}...`);

    // Check if already processed
    const alreadyProcessed = await isSubmissionProcessed(submission.rowNumber);
    if (alreadyProcessed) {
      console.log(`Submission ${submission.rowNumber} already processed`);
      return { success: false, reason: 'already_processed' };
    }

    // Save form submission
    const formRecord = await saveFormSubmission(submission);

    // Create or get parent profile
    const parent = await createOrGetParentProfile(submission.email, submission.parentName);

    // Create student profile
    const student = await createStudentProfile(submission, parent.id, formRecord.id);

    // Create assessment record
    const { name: childName, grade } = parseChildNameAndGrade(submission.childNameAndGrade);
    await createAssessmentRecord(student.id, formRecord.id, grade);

    // Mark submission as processed
    await supabase
      .from('form_submissions')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        student_id: student.id,
        parent_id: parent.id,
      })
      .eq('id', formRecord.id);

    console.log(`Successfully processed submission for ${childName}`);

    return {
      success: true,
      studentId: student.id,
      parentId: parent.id,
      assessmentNeeded: true,
    };
  } catch (error) {
    console.error('Error processing form submission:', error);
    throw error;
  }
}

/**
 * Process all new submissions
 */
export async function processNewSubmissions() {
  // Get last processed row number
  const { data: lastSubmission } = await supabase
    .from('form_submissions')
    .select('sheet_row_number')
    .order('sheet_row_number', { ascending: false })
    .limit(1)
    .single();

  const lastRowNumber = lastSubmission?.sheet_row_number || 0;

  // This would be called by a cron job or webhook
  // For now, we'll return instructions on how to set it up
  return {
    lastProcessedRow: lastRowNumber,
    message: 'Use fetchNewSubmissions() to get new rows, then process each with processFormSubmission()',
  };
}
