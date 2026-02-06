/**
 * Stripe Configuration for Mz. Marianna's Academy
 * Handles payment processing and subscription management
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe Publishable Key (from environment)
const stripePublishableKey = import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || '';

let stripePromise: Promise<Stripe | null>;

/**
 * Get Stripe instance (singleton pattern)
 */
export const getStripe = () => {
  if (!stripePromise) {
    if (!stripePublishableKey) {
      console.warn('⚠️ Stripe publishable key not found. Add VITE_STRIPE_PUBLISHABLE_KEY to .env');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

/**
 * Pricing Plans
 */
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  stripePriceId: string; // Set these in Stripe Dashboard
  features: string[];
  recommended?: boolean;
  tier: 'free' | 'warrior' | 'scholar' | 'legend';
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Explorer',
    description: 'Perfect for trying out the system',
    price: 0,
    interval: 'month',
    stripePriceId: '', // No Stripe for free tier
    tier: 'free',
    features: [
      '5 quests per month',
      'Basic progress tracking',
      'Wowl AI assistance (limited)',
      'Access to community forum',
      'Parent dashboard',
    ],
  },
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'For serious learners ready to level up',
    price: 29,
    interval: 'month',
    stripePriceId: 'price_WARRIOR_MONTHLY', // Replace with actual Stripe Price ID
    tier: 'warrior',
    recommended: true,
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
    id: 'scholar',
    name: 'Scholar',
    description: 'Advanced curriculum with 1-on-1 support',
    price: 79,
    interval: 'month',
    stripePriceId: 'price_SCHOLAR_MONTHLY', // Replace with actual Stripe Price ID
    tier: 'scholar',
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
    id: 'legend',
    name: 'Legend (Family Plan)',
    description: 'Up to 4 students, unlimited everything',
    price: 149,
    interval: 'month',
    stripePriceId: 'price_LEGEND_MONTHLY', // Replace with actual Stripe Price ID
    tier: 'legend',
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
 * Annual Plans (20% discount)
 */
export const ANNUAL_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'warrior-annual',
    name: 'Warrior (Annual)',
    description: 'Save $70/year',
    price: 279, // $23.25/month
    interval: 'year',
    stripePriceId: 'price_WARRIOR_ANNUAL',
    tier: 'warrior',
    recommended: true,
    features: PRICING_PLANS[1].features,
  },
  {
    id: 'scholar-annual',
    name: 'Scholar (Annual)',
    description: 'Save $170/year',
    price: 779, // $64.92/month
    interval: 'year',
    stripePriceId: 'price_SCHOLAR_ANNUAL',
    tier: 'scholar',
    features: PRICING_PLANS[2].features,
  },
  {
    id: 'legend-annual',
    name: 'Legend (Annual)',
    description: 'Save $340/year',
    price: 1449, // $120.75/month
    interval: 'year',
    stripePriceId: 'price_LEGEND_ANNUAL',
    tier: 'legend',
    features: PRICING_PLANS[3].features,
  },
];

/**
 * Create Stripe Checkout Session
 */
export interface CheckoutSessionData {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(data: CheckoutSessionData) {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Create Stripe Customer Portal Session
 * For managing subscriptions, payment methods, invoices
 */
export async function createCustomerPortalSession(customerId: string) {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

/**
 * Format currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
}