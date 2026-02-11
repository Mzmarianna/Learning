/**
 * ClassWallet API Configuration
 * For scholarship and education reimbursement payments
 * Docs: https://developers.classwallet.com/
 */

// ClassWallet API credentials
// NOTE: These environment variables are intentionally *not* prefixed with VITE_
// so they are only available in server/edge runtimes and are not exposed to the browser bundle.
const CLASSWALLET_API_KEY = import.meta.env.CLASSWALLET_API_KEY || '';
const CLASSWALLET_MERCHANT_ID = import.meta.env.CLASSWALLET_MERCHANT_ID || '';
const CLASSWALLET_VENDOR_ID = import.meta.env.CLASSWALLET_VENDOR_ID || '';
const CLASSWALLET_API_URL =
  import.meta.env.CLASSWALLET_API_URL || 'https://api.classwallet.com/v3';
const CLASSWALLET_CHECKOUT_URL =
  import.meta.env.VITE_CLASSWALLET_CHECKOUT_URL || 'https://app.classwallet.com/payby-checkout/';

export interface ClassWalletConfig {
  apiKey: string;
  merchantId: string;
  vendorId: string;
  apiUrl: string;
  checkoutUrl: string;
}

/**
 * Get ClassWallet configuration
 */
export function getClassWalletConfig(): ClassWalletConfig {
  return {
    apiKey: CLASSWALLET_API_KEY,
    merchantId: CLASSWALLET_MERCHANT_ID,
    vendorId: CLASSWALLET_VENDOR_ID,
    apiUrl: CLASSWALLET_API_URL,
    checkoutUrl: CLASSWALLET_CHECKOUT_URL,
  };
}

/**
 * Check if ClassWallet is configured
 */
export function isClassWalletConfigured(): boolean {
  return Boolean(CLASSWALLET_VENDOR_ID);
}

/**
 * Get Pay by ClassWallet checkout URL
 * Constructs the checkout URL with callback parameter
 */
export function getPayByClassWalletCheckoutUrl(callbackUrl: string): string {
  const config = getClassWalletConfig();
  return `${config.checkoutUrl}?callback=${encodeURIComponent(callbackUrl)}`;
}

/**
 * Payment types supported by ClassWallet
 */
export enum ClassWalletPaymentType {
  SCHOLARSHIP = 'scholarship',
  REIMBURSEMENT = 'reimbursement',
  ESA = 'esa', // Education Savings Account
  EMPOWERMENT = 'empowerment', // Empowerment Scholarship Account
}

/**
 * ClassWallet payment plan
 */
export interface ClassWalletPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  interval: 'month' | 'year';
  planTier: 'warrior' | 'scholar' | 'legend';
  features: string[];
}

/**
 * ClassWallet pricing plans (mapped to our tiers)
 */
export const CLASSWALLET_PLANS: ClassWalletPlan[] = [
  {
    id: 'cw-warrior-monthly',
    name: 'Warrior Monthly (ClassWallet)',
    description: 'For serious learners ready to level up',
    amount: 29,
    interval: 'month',
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
    id: 'cw-scholar-monthly',
    name: 'Scholar Monthly (ClassWallet)',
    description: 'Advanced curriculum with 1-on-1 support',
    amount: 79,
    interval: 'month',
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
    id: 'cw-legend-monthly',
    name: 'Legend Family Plan (ClassWallet)',
    description: 'Up to 4 students, unlimited everything',
    amount: 149,
    interval: 'month',
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
 * Create ClassWallet payment request
 */
export interface ClassWalletPaymentRequest {
  userId: string;
  userEmail: string;
  userName: string;
  planId: string;
  amount: number;
  description: string;
  paymentType: ClassWalletPaymentType;
  returnUrl: string;
  cancelUrl: string;
}

/**
 * ClassWallet payment response
 */
export interface ClassWalletPaymentResponse {
  success: boolean;
  transactionId?: string;
  authorizationUrl?: string;
  error?: string;
}
