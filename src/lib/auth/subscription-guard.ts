/**
 * Subscription Guard
 * Checks if user has active subscription before allowing access
 */

import { supabase } from '../supabase/client';
import { getCurrentUser, getUserProfile } from '../supabase/auth';

export interface SubscriptionStatus {
  isActive: boolean;
  tier: string | null;
  status: string | null;
  message?: string;
  renewalUrl?: string;
}

/**
 * Check if current user has active subscription
 */
export async function checkSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        isActive: false,
        tier: null,
        status: null,
        message: 'Not logged in',
      };
    }

    const profile = await getUserProfile();
    if (!profile) {
      return {
        isActive: false,
        tier: null,
        status: null,
        message: 'Profile not found',
      };
    }

    // Check subscription status
    const subscriptionStatus = profile.subscription_status || 'inactive';
    const subscriptionTier = profile.subscription_tier;

    // Allow demo accounts
    if (profile.email === 'demo@test.com') {
      return {
        isActive: true,
        tier: 'demo',
        status: 'active',
      };
    }

    // Allow admins and tutors (they don't need subscriptions)
    if (profile.role === 'admin' || profile.role === 'tutor') {
      return {
        isActive: true,
        tier: 'unlimited',
        status: 'active',
      };
    }

    // Check if active
    if (subscriptionStatus === 'active') {
      return {
        isActive: true,
        tier: subscriptionTier,
        status: subscriptionStatus,
      };
    }

    // Subscription inactive
    return {
      isActive: false,
      tier: subscriptionTier,
      status: subscriptionStatus,
      message: getInactiveMessage(subscriptionStatus),
      renewalUrl: getRenewalUrl(subscriptionStatus),
    };

  } catch (error) {
    console.error('Error checking subscription:', error);
    return {
      isActive: false,
      tier: null,
      status: null,
      message: 'Error checking subscription status',
    };
  }
}

/**
 * Get message for inactive subscription
 */
function getInactiveMessage(status: string): string {
  switch (status) {
    case 'cancelled':
      return 'Your subscription has been cancelled. Reactivate to continue learning!';
    case 'expired':
      return 'Your subscription has expired. Renew now to keep exploring!';
    case 'paused':
      return 'Your subscription is paused. Resume to continue your learning journey!';
    case 'past_due':
      return 'Your payment is past due. Update your payment method to continue.';
    default:
      return 'You need an active subscription to access Mz. Marianna\'s Academy.';
  }
}

/**
 * Get renewal URL based on status
 */
function getRenewalUrl(status: string): string {
  // Replace with your actual Shopify store URL
  const shopifyUrl = 'https://yourstore.myshopify.com';
  
  switch (status) {
    case 'cancelled':
    case 'expired':
      return `${shopifyUrl}/products/subscription`;
    case 'past_due':
      return `${shopifyUrl}/account/login`;
    default:
      return `${shopifyUrl}/products/subscription`;
  }
}

/**
 * Lock user account if subscription inactive
 */
export async function enforceSubscriptionAccess(): Promise<boolean> {
  const status = await checkSubscriptionStatus();
  return status.isActive;
}

/**
 * Get number of students allowed for current subscription
 */
export async function getStudentLimit(): Promise<number> {
  try {
    const profile = await getUserProfile();
    if (!profile) return 0;

    // Admins/tutors have unlimited
    if (profile.role === 'admin' || profile.role === 'tutor') {
      return 999;
    }

    // Check tier
    switch (profile.subscription_tier) {
      case 'family':
        return 3;
      case 'annual':
      case 'explorer':
        return 1;
      default:
        return 1;
    }
  } catch (error) {
    console.error('Error getting student limit:', error);
    return 0;
  }
}

/**
 * Check if user can add more students
 */
export async function canAddStudent(): Promise<{
  allowed: boolean;
  current: number;
  limit: number;
  message?: string;
}> {
  try {
    const profile = await getUserProfile();
    if (!profile) {
      return {
        allowed: false,
        current: 0,
        limit: 0,
        message: 'Profile not found',
      };
    }

    const limit = await getStudentLimit();

    // Get current student count
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('parent_id', profile.id)
      .eq('role', 'student');

    if (error) throw error;

    const current = count || 0;

    if (current >= limit) {
      return {
        allowed: false,
        current,
        limit,
        message: `You've reached your limit of ${limit} student${limit > 1 ? 's' : ''}. Upgrade to add more!`,
      };
    }

    return {
      allowed: true,
      current,
      limit,
    };

  } catch (error) {
    console.error('Error checking student limit:', error);
    return {
      allowed: false,
      current: 0,
      limit: 0,
      message: 'Error checking student limit',
    };
  }
}
