/**
 * Analytics Integration
 * Google Analytics 4 + Conversion Tracking
 */

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Initialize Google Analytics
 * Call this in your App.tsx or _app.tsx
 */
export function initAnalytics(measurementId: string) {
  // Add GA4 script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: true,
  });
}

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string) {
  if (!window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: title || document.title,
  });
}

/**
 * Track custom event
 */
export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (!window.gtag) return;

  window.gtag('event', eventName, parameters);
}

// ============================================================================
// CONVERSION EVENTS
// ============================================================================

/**
 * Track when user starts placement quiz
 */
export function trackQuizStart() {
  trackEvent('begin_quiz', {
    event_category: 'engagement',
    event_label: 'placement_quiz_start',
  });
}

/**
 * Track quiz completion
 */
export function trackQuizComplete(tier: string, overallLevel: number) {
  trackEvent('complete_quiz', {
    event_category: 'conversion',
    event_label: 'placement_quiz_complete',
    tier,
    overall_level: overallLevel,
  });
}

/**
 * Track user signup
 */
export function trackSignup(role: 'student' | 'parent' | 'tutor') {
  trackEvent('sign_up', {
    method: 'email',
    user_role: role,
  });
}

/**
 * Track enrollment
 */
export function trackEnrollment(tier: string, planType: string) {
  trackEvent('purchase', {
    event_category: 'conversion',
    event_label: 'enrollment_complete',
    tier,
    plan_type: planType,
    currency: 'USD',
  });
}

/**
 * Track quest start
 */
export function trackQuestStart(questId: string) {
  trackEvent('level_start', {
    event_category: 'engagement',
    level_name: questId,
  });
}

/**
 * Track quest completion
 */
export function trackQuestComplete(questId: string, xpEarned: number) {
  trackEvent('level_end', {
    event_category: 'engagement',
    level_name: questId,
    score: xpEarned,
  });
}

/**
 * Track challenge submission
 */
export function trackChallengeSubmission(
  challengeId: string,
  masteryLevel: string,
  xpEarned: number
) {
  trackEvent('submit_challenge', {
    event_category: 'engagement',
    challenge_id: challengeId,
    mastery_level: masteryLevel,
    xp_earned: xpEarned,
  });
}

/**
 * Track badge earned
 */
export function trackBadgeEarned(badgeId: string) {
  trackEvent('unlock_achievement', {
    event_category: 'engagement',
    achievement_id: badgeId,
  });
}

/**
 * Track CTA click
 */
export function trackCTAClick(ctaName: string, location: string) {
  trackEvent('cta_click', {
    event_category: 'engagement',
    cta_name: ctaName,
    cta_location: location,
  });
}

/**
 * Track video play
 */
export function trackVideoPlay(videoTitle: string) {
  trackEvent('video_start', {
    event_category: 'engagement',
    video_title: videoTitle,
  });
}

/**
 * Track form abandonment
 */
export function trackFormAbandonment(formName: string, fieldName: string) {
  trackEvent('form_abandon', {
    event_category: 'engagement',
    form_name: formName,
    field_name: fieldName,
  });
}

// ============================================================================
// FACEBOOK PIXEL (Optional)
// ============================================================================

/**
 * Initialize Facebook Pixel
 */
export function initFacebookPixel(pixelId: string) {
  const fbq = function() {
    window.fbq = fbq;
    (window.fbq as any).callMethod
      ? (window.fbq as any).callMethod.apply(window.fbq, arguments)
      : (window.fbq as any).queue.push(arguments);
  };
  
  if (!(window as any).fbq) {
    (window as any).fbq = fbq;
    (fbq as any).push = fbq;
    (fbq as any).loaded = true;
    (fbq as any).version = '2.0';
    (fbq as any).queue = [];
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }
  
  (window as any).fbq('init', pixelId);
  (window as any).fbq('track', 'PageView');
}

/**
 * Track Facebook conversion
 */
export function trackFBConversion(eventName: string, parameters?: Record<string, any>) {
  if (!(window as any).fbq) return;
  (window as any).fbq('track', eventName, parameters);
}

// ============================================================================
// HOTJAR (Heatmaps & Session Recording)
// ============================================================================

/**
 * Initialize Hotjar
 */
export function initHotjar(siteId: number) {
  (window as any).hj = (window as any).hj || function() {
    ((window as any).hj.q = (window as any).hj.q || []).push(arguments);
  };
  (window as any)._hjSettings = { hjid: siteId, hjsv: 6 };
  
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://static.hotjar.com/c/hotjar-${siteId}.js?sv=6`;
  document.head.appendChild(script);
}

/**
 * Identify user in Hotjar
 */
export function identifyHotjarUser(userId: string, attributes?: Record<string, any>) {
  if (!(window as any).hj) return;
  (window as any).hj('identify', userId, attributes);
}
