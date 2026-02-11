/**
 * PayPal Subscription Configuration
 * For autopay self-pay subscriptions
 * Docs: https://developer.paypal.com/docs/subscriptions/
 */

// PayPal API credentials
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';
const PAYPAL_MODE = import.meta.env.VITE_PAYPAL_MODE || 'sandbox'; // 'sandbox' or 'live'

export interface PayPalConfig {
  clientId: string;
  mode: 'sandbox' | 'live';
}

/**
 * Get PayPal configuration
 */
export function getPayPalConfig(): PayPalConfig {
  return {
    clientId: PAYPAL_CLIENT_ID,
    mode: PAYPAL_MODE as 'sandbox' | 'live',
  };
}

/**
 * Check if PayPal is configured
 */
export function isPayPalConfigured(): boolean {
  return Boolean(PAYPAL_CLIENT_ID);
}

/**
 * PayPal subscription plan
 */
export interface PayPalPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  interval: 'month' | 'year';
  paypalPlanId: string; // Set these in PayPal Dashboard
  planTier: 'warrior' | 'scholar' | 'legend';
  features: string[];
}

/**
 * PayPal subscription plans (mapped to our tiers)
 */
export const PAYPAL_PLANS: PayPalPlan[] = [
  {
    id: 'pp-warrior-monthly',
    name: 'Warrior Monthly (PayPal)',
    description: 'For serious learners ready to level up',
    amount: 29,
    interval: 'month',
    paypalPlanId: "", // TODO: Replace with actual PayPal Plan ID from dashboard
    planTier: 'warrior',
    features: [
      'Unlimited quests & challenges',
      'Full Wowl AI tutoring',
      'Personalized learning paths',
      'Video lessons & tutorials',
      'Weekly progress reports',
      'Parent coaching resources',
      'Priority email support',
    ],
  },
  {
    id: 'pp-warrior-annual',
    name: 'Warrior Annual (PayPal)',
    description: 'Save $70/year',
    amount: 279,
    interval: 'year',
    paypalPlanId: "", // TODO: Replace with actual PayPal Plan ID from dashboard
    planTier: 'warrior',
    features: [
      'Unlimited quests & challenges',
      'Full Wowl AI tutoring',
      'Personalized learning paths',
      'Video lessons & tutorials',
      'Weekly progress reports',
      'Parent coaching resources',
      'Priority email support',
    ],
  },
  {
    id: 'pp-scholar-monthly',
    name: 'Scholar Monthly (PayPal)',
    description: 'Advanced curriculum with 1-on-1 support',
    amount: 79,
    interval: 'month',
    paypalPlanId: "", // TODO: Replace with actual PayPal Plan ID from dashboard
    planTier: 'scholar',
    features: [
      'Everything in Warrior',
      '2 live 1-on-1 sessions/month with Mz. Marianna',
      'Custom curriculum design',
      'IEP/504 accommodation support',
      'Advanced Warriors challenges',
      'Direct messaging with educators',
      'Monthly family strategy call',
    ],
  },
  {
    id: 'pp-scholar-annual',
    name: 'Scholar Annual (PayPal)',
    description: 'Save $170/year',
    amount: 779,
    interval: 'year',
    paypalPlanId: "", // TODO: Replace with actual PayPal Plan ID from dashboard
    planTier: 'scholar',
    features: [
      'Everything in Warrior',
      '2 live 1-on-1 sessions/month with Mz. Marianna',
      'Custom curriculum design',
      'IEP/504 accommodation support',
      'Advanced Warriors challenges',
      'Direct messaging with educators',
      'Monthly family strategy call',
    ],
  },
  {
    id: 'pp-legend-monthly',
    name: 'Legend Family Plan (PayPal)',
    description: 'Up to 4 students, unlimited everything',
    amount: 149,
    interval: 'month',
    paypalPlanId: "", // TODO: Replace with actual PayPal Plan ID from dashboard
    planTier: 'legend',
    features: [
      'Everything in Scholar',
      'Up to 4 student accounts',
      'Weekly 1-on-1 sessions',
      'Custom family learning plan',
      'Unlimited Wowl AI',
      'Private Slack channel with educators',
      '24/7 priority support',
    ],
  },
  {
    id: 'pp-legend-annual',
    name: 'Legend Annual (PayPal)',
    description: 'Save $340/year',
    amount: 1449,
    interval: 'year',
    paypalPlanId: "", // TODO: Replace with actual PayPal Plan ID from dashboard
    planTier: 'legend',
    features: [
      'Everything in Scholar',
      'Up to 4 student accounts',
      'Weekly 1-on-1 sessions',
      'Custom family learning plan',
      'Unlimited Wowl AI',
      'Private Slack channel with educators',
      '24/7 priority support',
    ],
  },
];

/**
 * Create PayPal subscription request
 */
export interface PayPalSubscriptionRequest {
  userId: string;
  userEmail: string;
  userName: string;
  planId: string;
  paypalPlanId: string;
  returnUrl: string;
  cancelUrl: string;
}

/**
 * PayPal subscription response
 */
export interface PayPalSubscriptionResponse {
  success: boolean;
  subscriptionId?: string;
  approvalUrl?: string;
  error?: string;
}
