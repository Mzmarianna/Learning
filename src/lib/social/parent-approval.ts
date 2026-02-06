/**
 * Parent Approval System for Social Sharing
 * COPPA Compliant - Requires parental consent for children under 13
 */

import { supabase } from '../supabase/client';

export interface ShareRequest {
  id: string;
  studentId: string;
  studentName: string;
  parentId: string;
  achievementTitle: string;
  achievementDescription: string;
  xpEarned: number;
  masteryLevel?: string;
  imageUrl?: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'link';
  status: 'pending' | 'approved' | 'denied';
  requestedAt: Date;
  respondedAt?: Date;
  expiresAt: Date;
}

/**
 * Request parent approval for social sharing
 */
export async function requestShareApproval(
  studentId: string,
  achievementData: {
    title: string;
    description: string;
    xpEarned: number;
    masteryLevel?: string;
    imageUrl?: string;
    platform: 'facebook' | 'twitter' | 'instagram' | 'link';
  }
): Promise<string> {
  try {
    // Get student profile to find parent
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('display_name, parent_email')
      .eq('id', studentId)
      .single();

    if (profileError || !profile) {
      throw new Error('Could not find student profile');
    }

    // Get parent ID from parent_email
    const { data: parentProfile, error: parentError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', profile.parent_email)
      .eq('role', 'parent')
      .single();

    if (parentError || !parentProfile) {
      throw new Error('Parent account not found');
    }

    // Create share request
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expires in 24 hours

    const { data, error } = await supabase
      .from('share_requests')
      .insert({
        student_id: studentId,
        student_name: profile.display_name,
        parent_id: parentProfile.id,
        achievement_title: achievementData.title,
        achievement_description: achievementData.description,
        xp_earned: achievementData.xpEarned,
        mastery_level: achievementData.masteryLevel,
        image_url: achievementData.imageUrl,
        platform: achievementData.platform,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // TODO: Send notification to parent (email, in-app, push)
    await notifyParentOfShareRequest(parentProfile.id, data.id);

    return data.id;
  } catch (error) {
    console.error('Error requesting share approval:', error);
    throw error;
  }
}

/**
 * Check if student has parent approval for a specific share request
 */
export async function checkShareApproval(requestId: string): Promise<'pending' | 'approved' | 'denied' | 'expired'> {
  try {
    const { data, error } = await supabase
      .from('share_requests')
      .select('status, expires_at')
      .eq('id', requestId)
      .single();

    if (error) throw error;

    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      return 'expired';
    }

    return data.status;
  } catch (error) {
    console.error('Error checking share approval:', error);
    return 'denied';
  }
}

/**
 * Parent approves or denies share request
 */
export async function respondToShareRequest(
  requestId: string,
  parentId: string,
  approved: boolean
): Promise<void> {
  try {
    const { error } = await supabase
      .from('share_requests')
      .update({
        status: approved ? 'approved' : 'denied',
        responded_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .eq('parent_id', parentId); // Ensure only the parent can respond

    if (error) throw error;

    // Notify student of decision
    const { data: request } = await supabase
      .from('share_requests')
      .select('student_id')
      .eq('id', requestId)
      .single();

    if (request) {
      await notifyStudentOfDecision(request.student_id, requestId, approved);
    }
  } catch (error) {
    console.error('Error responding to share request:', error);
    throw error;
  }
}

/**
 * Get pending share requests for a parent
 */
export async function getPendingShareRequests(parentId: string): Promise<ShareRequest[]> {
  try {
    const { data, error } = await supabase
      .from('share_requests')
      .select('*')
      .eq('parent_id', parentId)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('requested_at', { ascending: false });

    if (error) throw error;

    return data.map(row => ({
      id: row.id,
      studentId: row.student_id,
      studentName: row.student_name,
      parentId: row.parent_id,
      achievementTitle: row.achievement_title,
      achievementDescription: row.achievement_description,
      xpEarned: row.xp_earned,
      masteryLevel: row.mastery_level,
      imageUrl: row.image_url,
      platform: row.platform,
      status: row.status,
      requestedAt: new Date(row.requested_at),
      respondedAt: row.responded_at ? new Date(row.responded_at) : undefined,
      expiresAt: new Date(row.expires_at),
    }));
  } catch (error) {
    console.error('Error getting pending share requests:', error);
    return [];
  }
}

/**
 * Set default share permissions for a student
 * If true, student can share without asking each time
 */
export async function setDefaultSharePermission(
  studentId: string,
  parentId: string,
  allowAutoShare: boolean
): Promise<void> {
  try {
    const { error } = await supabase
      .from('student_settings')
      .upsert({
        student_id: studentId,
        allow_auto_share: allowAutoShare,
        updated_by: parentId,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error setting default share permission:', error);
    throw error;
  }
}

/**
 * Check if student has default permission to share
 */
export async function hasDefaultSharePermission(studentId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('student_settings')
      .select('allow_auto_share')
      .eq('student_id', studentId)
      .single();

    if (error) return false;
    return data.allow_auto_share || false;
  } catch (error) {
    return false;
  }
}

/**
 * Notify parent of share request (stub - implement with email service)
 */
async function notifyParentOfShareRequest(parentId: string, requestId: string): Promise<void> {
  // TODO: Implement with email service (SendGrid, Resend, etc.)
  console.log(`[NOTIFICATION] Parent ${parentId} has new share request: ${requestId}`);
  
  // Create in-app notification
  try {
    await supabase.from('notifications').insert({
      user_id: parentId,
      type: 'share_request',
      title: 'Share Permission Needed',
      message: 'Your child wants to share an achievement on social media',
      data: { request_id: requestId },
      read: false,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

/**
 * Notify student of parent's decision (stub - implement with notification system)
 */
async function notifyStudentOfDecision(
  studentId: string,
  requestId: string,
  approved: boolean
): Promise<void> {
  // TODO: Implement with notification system
  console.log(`[NOTIFICATION] Student ${studentId} share request ${requestId}: ${approved ? 'APPROVED' : 'DENIED'}`);
  
  // Create in-app notification
  try {
    await supabase.from('notifications').insert({
      user_id: studentId,
      type: 'share_response',
      title: approved ? 'Share Approved!' : 'Share Not Approved',
      message: approved 
        ? 'Your parent approved your share request! You can now post your achievement.'
        : 'Your parent did not approve this share request. You can try again or ask them in person.',
      data: { request_id: requestId, approved },
      read: false,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
