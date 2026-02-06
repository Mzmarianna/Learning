/**
 * Email Integration Layer
 * Connects TypeScript business logic with Supabase email system
 */

import { supabase } from '../supabase/client';
import { generateWeeklyDigest, type WeeklyDigest, type MilestoneNotification } from './progress-reports';

/**
 * Queue a weekly digest email for a student
 * Called by cron job or manually
 */
export async function queueWeeklyDigest(studentId: string): Promise<boolean> {
  try {
    // Get parent email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('parent_email, display_name')
      .eq('id', studentId)
      .single();

    if (profileError || !profile?.parent_email) {
      console.error('No parent email found for student:', studentId);
      return false;
    }

    // Check if parent has digest enabled
    const { data: preferences } = await supabase
      .from('email_preferences')
      .select('weekly_digest_enabled')
      .eq('user_id', studentId)
      .single();

    if (preferences && preferences.weekly_digest_enabled === false) {
      console.log('Weekly digest disabled for student:', studentId);
      return false;
    }

    // Generate digest data
    const digest = await generateWeeklyDigest(studentId);
    if (!digest) {
      console.error('Failed to generate digest for student:', studentId);
      return false;
    }

    // Queue in Supabase
    const { error: queueError } = await supabase
      .from('email_queue')
      .insert({
        recipient_email: profile.parent_email,
        recipient_name: `Parent of ${profile.display_name}`,
        subject: `${digest.studentName}'s Weekly Learning Report - Week of ${digest.weekStart.toLocaleDateString()}`,
        template: 'weekly_digest',
        data: digest,
        scheduled_for: new Date().toISOString(),
        priority: 'normal',
      });

    if (queueError) {
      console.error('Error queueing email:', queueError);
      return false;
    }

    console.log(`✅ Queued weekly digest for ${profile.parent_email}`);
    return true;
  } catch (error) {
    console.error('Error queueing weekly digest:', error);
    return false;
  }
}

/**
 * Queue a milestone notification email
 * Triggered by Supabase triggers or called manually
 */
export async function queueMilestoneEmail(
  studentId: string,
  milestone: MilestoneNotification
): Promise<boolean> {
  try {
    // Get parent email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('parent_email')
      .eq('id', studentId)
      .single();

    if (profileError || !profile?.parent_email) {
      console.error('No parent email found for student:', studentId);
      return false;
    }

    // Check if parent has milestone notifications enabled
    const { data: preferences } = await supabase
      .from('email_preferences')
      .select('milestone_notifications_enabled')
      .eq('user_id', studentId)
      .single();

    if (preferences && preferences.milestone_notifications_enabled === false) {
      console.log('Milestone notifications disabled for student:', studentId);
      return false;
    }

    // Queue in Supabase
    const { error: queueError } = await supabase
      .from('email_queue')
      .insert({
        recipient_email: profile.parent_email,
        subject: `🎉 ${milestone.studentName} ${milestone.title}!`,
        template: 'milestone_notification',
        data: milestone,
        scheduled_for: new Date().toISOString(),
        priority: 'high', // Milestones are high priority
      });

    if (queueError) {
      console.error('Error queueing milestone email:', queueError);
      return false;
    }

    console.log(`✅ Queued milestone email for ${profile.parent_email}`);
    return true;
  } catch (error) {
    console.error('Error queueing milestone email:', error);
    return false;
  }
}

/**
 * Queue a share request approval email
 */
export async function queueShareRequestEmail(
  studentId: string,
  requestId: string,
  achievementData: {
    title: string;
    description: string;
  }
): Promise<boolean> {
  try {
    // Get parent email and student name
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('parent_email, display_name')
      .eq('id', studentId)
      .single();

    if (profileError || !profile?.parent_email) {
      console.error('No parent email found for student:', studentId);
      return false;
    }

    // Generate approval URLs
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mzmariannaacademy.com';
    const approveUrl = `${baseUrl}/api/share-approval?request=${requestId}&action=approve`;
    const denyUrl = `${baseUrl}/api/share-approval?request=${requestId}&action=deny`;

    // Queue in Supabase
    const { error: queueError } = await supabase
      .from('email_queue')
      .insert({
        recipient_email: profile.parent_email,
        subject: `${profile.display_name} wants to share an achievement`,
        template: 'share_request',
        data: {
          studentName: profile.display_name,
          achievementTitle: achievementData.title,
          achievementDescription: achievementData.description,
          approveUrl,
          denyUrl,
          requestId,
        },
        scheduled_for: new Date().toISOString(),
        priority: 'high',
      });

    if (queueError) {
      console.error('Error queueing share request email:', queueError);
      return false;
    }

    console.log(`✅ Queued share request email for ${profile.parent_email}`);
    return true;
  } catch (error) {
    console.error('Error queueing share request email:', error);
    return false;
  }
}

/**
 * Get user's email preferences
 */
export async function getEmailPreferences(userId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('email_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw error;
    }

    // Return defaults if not found
    if (!data) {
      return {
        weekly_digest_enabled: true,
        milestone_notifications_enabled: true,
        share_request_notifications_enabled: true,
        progress_alerts_enabled: true,
        digest_day: 'sunday',
        digest_time: '18:00:00',
        email_format: 'html',
      };
    }

    return data;
  } catch (error) {
    console.error('Error getting email preferences:', error);
    return null;
  }
}

/**
 * Update user's email preferences
 */
export async function updateEmailPreferences(
  userId: string,
  preferences: {
    weekly_digest_enabled?: boolean;
    milestone_notifications_enabled?: boolean;
    share_request_notifications_enabled?: boolean;
    progress_alerts_enabled?: boolean;
    digest_day?: string;
    digest_time?: string;
  }
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('email_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating email preferences:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating email preferences:', error);
    return false;
  }
}

/**
 * Get pending emails for a user (for debugging)
 */
export async function getPendingEmails(userEmail: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('email_queue')
      .select('*')
      .eq('recipient_email', userEmail)
      .eq('status', 'pending')
      .order('scheduled_for', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error getting pending emails:', error);
    return [];
  }
}

/**
 * Manually trigger weekly digest for all students (admin function)
 */
export async function triggerAllWeeklyDigests(): Promise<{
  queued: number;
  failed: number;
}> {
  try {
    const { data: students, error } = await supabase
      .from('profiles')
      .select('id, parent_email')
      .eq('role', 'student')
      .not('parent_email', 'is', null);

    if (error) throw error;

    let queued = 0;
    let failed = 0;

    for (const student of students || []) {
      const success = await queueWeeklyDigest(student.id);
      if (success) {
        queued++;
      } else {
        failed++;
      }
    }

    console.log(`📧 Weekly digests: ${queued} queued, ${failed} failed`);
    return { queued, failed };
  } catch (error) {
    console.error('Error triggering all weekly digests:', error);
    return { queued: 0, failed: 0 };
  }
}

/**
 * Test email system by sending a test email
 */
export async function sendTestEmail(recipientEmail: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('email_queue')
      .insert({
        recipient_email: recipientEmail,
        subject: 'Test Email from Mz. Marianna\'s Academy',
        template: 'milestone_notification',
        data: {
          studentName: 'Test Student',
          type: 'test',
          title: 'Test Email',
          description: 'This is a test email to verify the email system is working.',
          celebrationMessage: '🎉 If you received this, the email system is working!',
          timestamp: new Date().toISOString(),
        },
        scheduled_for: new Date().toISOString(),
        priority: 'high',
      });

    if (error) {
      console.error('Error queuing test email:', error);
      return false;
    }

    console.log(`✅ Test email queued for ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    return false;
  }
}
