/**
 * Behavioral Email Sequence Dispatcher
 * Triggers appropriate email sequences based on user behavior and interactions
 */

import { sendMathSequenceEmail, type MathSequenceData } from './sequences/math-sequence';
import { sendWarriorsSequenceEmail, type WarriorsSequenceData } from './sequences/warriors-sequence';
import { supabase } from '../supabase/client';

/**
 * User behavior types that trigger email sequences
 */
export enum BehaviorTrigger {
  MATH_INTEREST = 'math_interest',
  WARRIORS_ELIGIBLE = 'warriors_eligible',
  PLACEMENT_QUIZ_COMPLETED = 'placement_quiz_completed',
  FIRST_QUEST_COMPLETED = 'first_quest_completed',
  SUBSCRIPTION_STARTED = 'subscription_started',
  HIGH_ENGAGEMENT = 'high_engagement',
}

/**
 * Track user behavior and trigger appropriate email sequence
 */
export async function trackBehaviorAndTriggerSequence(
  userId: string,
  behavior: BehaviorTrigger,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    // Log the behavior
    await supabase.from('user_behaviors').insert({
      user_id: userId,
      behavior_type: behavior,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    });

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) {
      console.error('Profile not found for user:', userId);
      return;
    }

    // Trigger appropriate sequence based on behavior
    switch (behavior) {
      case BehaviorTrigger.MATH_INTEREST:
        await triggerMathSequence(profile);
        break;

      case BehaviorTrigger.WARRIORS_ELIGIBLE:
        await triggerWarriorsSequence(profile);
        break;

      case BehaviorTrigger.PLACEMENT_QUIZ_COMPLETED:
        await handlePlacementQuizCompleted(profile);
        break;

      case BehaviorTrigger.FIRST_QUEST_COMPLETED:
        await handleFirstQuestCompleted(profile);
        break;

      case BehaviorTrigger.SUBSCRIPTION_STARTED:
        await handleSubscriptionStarted(profile);
        break;

      case BehaviorTrigger.HIGH_ENGAGEMENT:
        await handleHighEngagement(profile);
        break;

      default:
        console.log('Unknown behavior trigger:', behavior);
    }
  } catch (error) {
    console.error('Error tracking behavior:', error);
  }
}

/**
 * Trigger math-focused email sequence
 */
async function triggerMathSequence(profile: any): Promise<void> {
  // Check if already in math sequence
  const { data: existing } = await supabase
    .from('email_sequences')
    .select('*')
    .eq('user_id', profile.id)
    .eq('sequence_type', 'math')
    .eq('status', 'active')
    .single();

  if (existing) {
    console.log('User already in math sequence');
    return;
  }

  // Start math sequence
  await supabase.from('email_sequences').insert({
    user_id: profile.id,
    sequence_type: 'math',
    status: 'active',
    current_day: 0,
    started_at: new Date().toISOString(),
  });

  // Send first email
  const mathData: MathSequenceData = {
    studentName: profile.display_name || 'there',
    parentEmail: profile.parent_email || profile.email,
    mathLevel: determineMathLevel(profile),
    interests: profile.interests || [],
  };

  await sendMathSequenceEmail(mathData, 0);
  console.log(`✅ Started math sequence for ${profile.email}`);
}

/**
 * Trigger Warriors email sequence
 */
async function triggerWarriorsSequence(profile: any): Promise<void> {
  // Check if already in Warriors sequence
  const { data: existing } = await supabase
    .from('email_sequences')
    .select('*')
    .eq('user_id', profile.id)
    .eq('sequence_type', 'warriors')
    .eq('status', 'active')
    .single();

  if (existing) {
    console.log('User already in Warriors sequence');
    return;
  }

  // Start Warriors sequence
  await supabase.from('email_sequences').insert({
    user_id: profile.id,
    sequence_type: 'warriors',
    status: 'active',
    current_day: 0,
    started_at: new Date().toISOString(),
  });

  // Send first email
  const warriorsData: WarriorsSequenceData = {
    studentName: profile.display_name || 'Warrior',
    parentEmail: profile.parent_email || profile.email,
    age: calculateAge(profile.date_of_birth),
    interests: profile.interests || [],
    currentTier: profile.tier || 'explorers',
  };

  await sendWarriorsSequenceEmail(warriorsData, 0);
  console.log(`✅ Started Warriors sequence for ${profile.email}`);
}

/**
 * Handle placement quiz completion
 */
async function handlePlacementQuizCompleted(profile: any): Promise<void> {
  // Determine which sequence to trigger based on quiz results
  const age = calculateAge(profile.date_of_birth);
  
  if (age >= 11 && age <= 18) {
    // Middle schoolers get Warriors sequence
    await triggerWarriorsSequence(profile);
  } else {
    // Check if they showed math interest in quiz
    const { data: quizResults } = await supabase
      .from('placement_quiz_results')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (quizResults && quizResults.math_score > 70) {
      await triggerMathSequence(profile);
    }
  }
}

/**
 * Handle first quest completion
 */
async function handleFirstQuestCompleted(profile: any): Promise<void> {
  // Get quest details
  const { data: quest } = await supabase
    .from('challenge_submissions')
    .select('challenge_id, challenges(subject)')
    .eq('student_id', profile.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (quest?.challenges?.subject === 'math') {
    await triggerMathSequence(profile);
  }
}

/**
 * Handle subscription started
 */
async function handleSubscriptionStarted(profile: any): Promise<void> {
  // Send welcome sequence based on tier
  const age = calculateAge(profile.date_of_birth);
  
  if (age >= 11 && age <= 18) {
    await triggerWarriorsSequence(profile);
  }
}

/**
 * Handle high engagement behavior
 */
async function handleHighEngagement(profile: any): Promise<void> {
  // Check which subjects they're most engaged with
  const { data: submissions } = await supabase
    .from('challenge_submissions')
    .select('challenge_id, challenges(subject)')
    .eq('student_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (!submissions || submissions.length === 0) return;

  // Count by subject
  const subjectCounts: Record<string, number> = {};
  submissions.forEach((sub: any) => {
    const subject = sub.challenges?.subject || 'unknown';
    subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
  });

  // Trigger sequence for most engaged subject
  const topSubject = Object.keys(subjectCounts).reduce((a, b) =>
    subjectCounts[a] > subjectCounts[b] ? a : b
  );

  if (topSubject === 'math') {
    await triggerMathSequence(profile);
  }
}

/**
 * Determine math level from profile/quiz results
 */
function determineMathLevel(profile: any): 'beginner' | 'intermediate' | 'advanced' {
  const age = calculateAge(profile.date_of_birth);
  
  if (age < 8) return 'beginner';
  if (age < 12) return 'intermediate';
  return 'advanced';
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: string | null): number {
  if (!dateOfBirth) return DEFAULT_USER_AGE;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Process scheduled sequence emails (called by cron job)
 */
export async function processScheduledSequenceEmails(): Promise<void> {
  try {
    // Get all active sequences
    const { data: sequences } = await supabase
      .from('email_sequences')
      .select('*')
      .eq('status', 'active');

    if (!sequences || sequences.length === 0) {
      console.log('No active sequences to process');
      return;
    }

    for (const sequence of sequences) {
      const daysSinceStart = Math.floor(
        (Date.now() - new Date(sequence.started_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Check if we need to send next email
      if (daysSinceStart > sequence.current_day) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sequence.user_id)
          .single();

        if (!profile) continue;

        // Send appropriate sequence email
        if (sequence.sequence_type === 'math') {
          const mathData: MathSequenceData = {
            studentName: profile.display_name || 'there',
            parentEmail: profile.parent_email || profile.email,
            mathLevel: determineMathLevel(profile),
            interests: profile.interests || [],
          };

          await sendMathSequenceEmail(mathData, daysSinceStart);
        } else if (sequence.sequence_type === 'warriors') {
          const warriorsData: WarriorsSequenceData = {
            studentName: profile.display_name || 'Warrior',
            parentEmail: profile.parent_email || profile.email,
            age: calculateAge(profile.date_of_birth),
            interests: profile.interests || [],
            currentTier: profile.tier || 'explorers',
          };

          await sendWarriorsSequenceEmail(warriorsData, daysSinceStart);
        }

        // Update sequence
        await supabase
          .from('email_sequences')
          .update({
            current_day: daysSinceStart,
            last_email_sent_at: new Date().toISOString(),
          })
          .eq('id', sequence.id);

        console.log(`✅ Sent ${sequence.sequence_type} day ${daysSinceStart} to ${profile.email}`);
      }
    }
  } catch (error) {
    console.error('Error processing scheduled emails:', error);
  }
}
