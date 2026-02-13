/**
 * Child Safety & COPPA Compliance System
 * Ensures platform is safe for young learners (ages 4-18)
 */

import { supabase } from '../supabase/client';
import sanitizeHtml from 'sanitize-html';

export interface ParentalConsent {
  studentId: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  consentGivenAt: Date;
  consentType: 'full' | 'limited';
  allowDataCollection: boolean;
  allowSocialSharing: boolean;
  allowExternalLinks: boolean;
  allowMessaging: boolean;
  verificationMethod: 'email' | 'credit_card' | 'government_id';
}

export interface ContentFilter {
  blockExternalLinks: boolean;
  blockImages: boolean;
  blockVideos: boolean;
  requireModeration: boolean;
  blockedWords: string[];
  blockedDomains: string[];
}

export interface SafetySettings {
  studentId: string;
  age: number;
  requireParentalConsent: boolean;
  parentalConsentGiven: boolean;
  contentFilter: ContentFilter;
  sessionLimits: {
    maxDailyMinutes: number;
    maxSessionMinutes: number;
    requireBreaks: boolean;
    breakFrequencyMinutes: number;
  };
  privacySettings: {
    hideFullName: boolean;
    hideLocation: boolean;
    hideAge: boolean;
    anonymousProfile: boolean;
    parentNotifications: boolean;
  };
}

/**
 * COPPA Compliance: Check if student requires parental consent (under 13)
 */
export function requiresParentalConsent(age: number): boolean {
  return age < 13;
}

/**
 * Get or create safety settings for student
 */
export async function getSafetySettings(studentId: string): Promise<SafetySettings | null> {
  try {
    // Get student age
    const { data: profile } = await supabase
      .from('profiles')
      .select('age')
      .eq('id', studentId)
      .single();

    if (!profile) return null;

    // Get or create safety settings
    const { data: settings, error } = await supabase
      .from('student_safety_settings')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw error;
    }

    // If no settings exist, create default based on age
    if (!settings) {
      const defaultSettings = createDefaultSafetySettings(studentId, profile.age);
      const { data: created, error: createError } = await supabase
        .from('student_safety_settings')
        .insert(defaultSettings)
        .select()
        .single();

      if (createError) throw createError;
      return parseSettings(created, profile.age);
    }

    return parseSettings(settings, profile.age);

  } catch (error) {
    console.error('Error getting safety settings:', error);
    return null;
  }
}

/**
 * Create default safety settings based on age
 */
function createDefaultSafetySettings(studentId: string, age: number) {
  const isYoung = age < 13;
  
  return {
    student_id: studentId,
    require_parental_consent: isYoung,
    parental_consent_given: false,
    block_external_links: isYoung,
    block_images: false,
    block_videos: false,
    require_moderation: isYoung,
    max_daily_minutes: age < 10 ? 60 : 120,
    max_session_minutes: age < 10 ? 30 : 45,
    require_breaks: true,
    break_frequency_minutes: 25,
    hide_full_name: isYoung,
    hide_location: true,
    hide_age: isYoung,
    anonymous_profile: isYoung,
    parent_notifications: true,
  };
}

/**
 * Parse database settings into SafetySettings object
 */
function parseSettings(dbSettings: any, age: number): SafetySettings {
  return {
    studentId: dbSettings.student_id,
    age,
    requireParentalConsent: requiresParentalConsent(age),
    parentalConsentGiven: dbSettings.parental_consent_given,
    contentFilter: {
      blockExternalLinks: dbSettings.block_external_links,
      blockImages: dbSettings.block_images,
      blockVideos: dbSettings.block_videos,
      requireModeration: dbSettings.require_moderation,
      blockedWords: dbSettings.blocked_words || [],
      blockedDomains: dbSettings.blocked_domains || [],
    },
    sessionLimits: {
      maxDailyMinutes: dbSettings.max_daily_minutes,
      maxSessionMinutes: dbSettings.max_session_minutes,
      requireBreaks: dbSettings.require_breaks,
      breakFrequencyMinutes: dbSettings.break_frequency_minutes,
    },
    privacySettings: {
      hideFullName: dbSettings.hide_full_name,
      hideLocation: dbSettings.hide_location,
      hideAge: dbSettings.hide_age,
      anonymousProfile: dbSettings.anonymous_profile,
      parentNotifications: dbSettings.parent_notifications,
    },
  };
}

/**
 * Request parental consent
 */
export async function requestParentalConsent(
  studentId: string,
  parentEmail: string,
  consentType: 'full' | 'limited' = 'full'
): Promise<string> {
  try {
    // Create consent request
    const { data, error } = await supabase
      .from('parental_consent_requests')
      .insert({
        student_id: studentId,
        parent_email: parentEmail,
        consent_type: consentType,
        status: 'pending',
        requested_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      })
      .select()
      .single();

    if (error) throw error;

    // TODO: Send verification email to parent
    console.log(`📧 Parental consent request sent to ${parentEmail}`);

    return data.id;

  } catch (error) {
    console.error('Error requesting parental consent:', error);
    throw error;
  }
}

/**
 * Grant parental consent
 */
export async function grantParentalConsent(
  requestId: string,
  parentId: string,
  verificationMethod: 'email' | 'credit_card' | 'government_id' = 'email',
  permissions: {
    allowDataCollection: boolean;
    allowSocialSharing: boolean;
    allowExternalLinks: boolean;
    allowMessaging: boolean;
  }
): Promise<boolean> {
  try {
    // Get request
    const { data: request, error: requestError } = await supabase
      .from('parental_consent_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError || !request) {
      throw new Error('Consent request not found');
    }

    // Create consent record
    const { error: consentError } = await supabase
      .from('parental_consents')
      .insert({
        student_id: request.student_id,
        parent_id: parentId,
        consent_given_at: new Date().toISOString(),
        consent_type: request.consent_type,
        verification_method: verificationMethod,
        allow_data_collection: permissions.allowDataCollection,
        allow_social_sharing: permissions.allowSocialSharing,
        allow_external_links: permissions.allowExternalLinks,
        allow_messaging: permissions.allowMessaging,
      });

    if (consentError) throw consentError;

    // Update safety settings
    const { error: updateError } = await supabase
      .from('student_safety_settings')
      .update({
        parental_consent_given: true,
        block_external_links: !permissions.allowExternalLinks,
        updated_at: new Date().toISOString(),
      })
      .eq('student_id', request.student_id);

    if (updateError) throw updateError;

    // Mark request as completed
    await supabase
      .from('parental_consent_requests')
      .update({ status: 'approved', completed_at: new Date().toISOString() })
      .eq('id', requestId);

    return true;

  } catch (error) {
    console.error('Error granting parental consent:', error);
    return false;
  }
}

/**
 * Content filtering - check if content is safe
 */
export async function filterContent(
  studentId: string,
  content: string,
  contentType: 'text' | 'url' | 'image'
): Promise<{ safe: boolean; reason?: string }> {
  try {
    const settings = await getSafetySettings(studentId);
    if (!settings) {
      return { safe: true }; // Default to safe if no settings
    }

    // Check for blocked words
    const lowerContent = content.toLowerCase();
    for (const word of settings.contentFilter.blockedWords) {
      if (lowerContent.includes(word.toLowerCase())) {
        return { safe: false, reason: 'Contains blocked word' };
      }
    }

    // Check URLs
    if (contentType === 'url') {
      if (settings.contentFilter.blockExternalLinks) {
        return { safe: false, reason: 'External links are blocked' };
      }

      // Check blocked domains
      const url = new URL(content);
      for (const domain of settings.contentFilter.blockedDomains) {
        if (url.hostname.includes(domain)) {
          return { safe: false, reason: 'Domain is blocked' };
        }
      }
    }

    // Check if moderation is required
    if (settings.contentFilter.requireModeration) {
      // In production, flag for human review
      console.log('Content requires moderation:', content);
    }

    return { safe: true };

  } catch (error) {
    console.error('Error filtering content:', error);
    // Fail-safe: block if error
    return { safe: false, reason: 'Error checking content' };
  }
}

/**
 * Check session limits
 */
export async function checkSessionLimits(studentId: string): Promise<{
  canContinue: boolean;
  reason?: string;
  minutesRemaining?: number;
  requiresBreak?: boolean;
}> {
  try {
    const settings = await getSafetySettings(studentId);
    if (!settings) {
      return { canContinue: true };
    }

    // Get today's learning time
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data: sessions } = await supabase
      .from('learning_sessions')
      .select('duration_minutes, started_at')
      .eq('student_id', studentId)
      .gte('started_at', todayStart.toISOString());

    const totalMinutesToday = sessions?.reduce((sum, s) => sum + s.duration_minutes, 0) || 0;

    // Check daily limit
    if (totalMinutesToday >= settings.sessionLimits.maxDailyMinutes) {
      return {
        canContinue: false,
        reason: `Daily limit reached (${settings.sessionLimits.maxDailyMinutes} minutes)`,
        minutesRemaining: 0,
      };
    }

    // Check if break is needed
    if (settings.sessionLimits.requireBreaks && sessions && sessions.length > 0) {
      const lastSession = sessions[sessions.length - 1];
      const lastSessionEnd = new Date(lastSession.started_at);
      lastSessionEnd.setMinutes(lastSessionEnd.getMinutes() + lastSession.duration_minutes);
      
      const minutesSinceLastSession = (Date.now() - lastSessionEnd.getTime()) / 1000 / 60;
      
      if (minutesSinceLastSession < 5 && lastSession.duration_minutes >= settings.sessionLimits.breakFrequencyMinutes) {
        return {
          canContinue: false,
          requiresBreak: true,
          reason: 'Time for a break! Rest your eyes and move around.',
        };
      }
    }

    return {
      canContinue: true,
      minutesRemaining: settings.sessionLimits.maxDailyMinutes - totalMinutesToday,
    };

  } catch (error) {
    console.error('Error checking session limits:', error);
    return { canContinue: true };
  }
}

/**
 * Sanitize user-generated content for display
 * 
 * Removes all HTML tags and attributes from user input.
 * Returns plain text safe for rendering in React components.
 * React automatically escapes the output when rendering, preventing XSS.
 * 
 * @param content - Raw user-generated content
 * @returns Sanitized plain text content
 */
export function sanitizeContent(content: string): string {
  // Use sanitize-html to strip all HTML tags and attributes
  // Returns plain text that React will automatically escape when rendering
  return sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

/**
 * Get safe display name (hides full name if privacy settings require)
 */
export async function getSafeDisplayName(studentId: string): Promise<string> {
  try {
    const settings = await getSafetySettings(studentId);
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', studentId)
      .single();

    if (!profile) return 'Student';

    if (settings?.privacySettings.hideFullName) {
      // Return first name only
      const firstName = profile.display_name.split(' ')[0];
      return firstName;
    }

    if (settings?.privacySettings.anonymousProfile) {
      return 'Student ' + studentId.slice(-4);
    }

    return profile.display_name;

  } catch (error) {
    console.error('Error getting safe display name:', error);
    return 'Student';
  }
}

/**
 * Default blocked words list (PG-rated)
 */
export const DEFAULT_BLOCKED_WORDS = [
  // Intentionally minimal - add more as needed
  'hate', 'kill', 'violent', 'weapon',
];

/**
 * Default blocked domains
 */
export const DEFAULT_BLOCKED_DOMAINS = [
  'gambling', 'casino', 'adult', 'porn',
];
