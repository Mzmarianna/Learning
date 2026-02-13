/**
 * Analytics Event Tracking
 * Tracks key conversion events for funnel optimization
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

/**
 * Track custom event
 */
export function trackEvent(event: string, properties?: Record<string, any>) {
  // Guard against non-browser environments (SSR, tests, serverless)
  if (typeof window === 'undefined') {
    return;
  }

  const eventData: AnalyticsEvent = {
    event,
    properties: {
      ...properties,
      url: window.location.href,
      referrer: document.referrer,
    },
    timestamp: new Date().toISOString(),
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('📊 Analytics Event:', eventData);
  }

  // Send to analytics service (Google Analytics, Mixpanel, etc.)
  // Example: Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, properties);
  }

  // Store in local analytics for debugging
  try {
    const localEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    localEvents.push(eventData);
    // Keep only last 100 events
    if (localEvents.length > 100) {
      localEvents.shift();
    }
    localStorage.setItem('analytics_events', JSON.stringify(localEvents));
  } catch (error) {
    // Silently fail if localStorage is not available
    console.warn('Failed to store analytics event locally:', error);
  }
}

// ============================================================================
// CONVERSION FUNNEL EVENTS
// ============================================================================

export function trackPageView(pageName: string, properties?: Record<string, any>) {
  trackEvent('page_view', {
    page_name: pageName,
    ...properties,
  });
}

export function trackQuizStarted(studentAge: number, interests: string[]) {
  trackEvent('quiz_started', {
    student_age: studentAge,
    interests: interests.join(','),
  });
}

export function trackQuizCompleted(attemptId: string, tier: string, score: number) {
  trackEvent('quiz_completed', {
    attempt_id: attemptId,
    recommended_tier: tier,
    overall_score: score,
  });
}

export function trackEmailCaptured(source: string, hasChildAge: boolean, hasStruggle: boolean) {
  trackEvent('email_captured', {
    source,
    has_child_age: hasChildAge,
    has_struggle: hasStruggle,
  });
}

export function trackCTAClicked(ctaName: string, location: string, destination: string) {
  trackEvent('cta_clicked', {
    cta_name: ctaName,
    location,
    destination,
  });
}

export function trackPricingViewed(tier?: string) {
  trackEvent('pricing_viewed', {
    tier,
  });
}

export function trackCheckoutStarted(planId: string, price: number) {
  trackEvent('checkout_started', {
    plan_id: planId,
    price,
  });
}

export function trackPurchaseCompleted(planId: string, price: number, orderId?: string) {
  trackEvent('purchase_completed', {
    plan_id: planId,
    price,
    order_id: orderId,
    value: price,
  });
}

export function trackExitIntentShown() {
  trackEvent('exit_intent_shown');
}

export function trackStickyCTAShown() {
  trackEvent('sticky_cta_shown');
}
