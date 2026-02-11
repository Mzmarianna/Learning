/**
 * ClassWallet API Service
 * Handles scholarship and reimbursement payments
 */

import {
  getClassWalletConfig,
  isClassWalletConfigured,
  type ClassWalletPaymentRequest,
  type ClassWalletPaymentResponse,
  ClassWalletPaymentType,
} from './config';

/**
 * Create a ClassWallet payment authorization
 * Returns a URL where the user can authorize the payment
 */
export async function createClassWalletPayment(
  request: ClassWalletPaymentRequest
): Promise<ClassWalletPaymentResponse> {
  if (!isClassWalletConfigured()) {
    return {
      success: false,
      error: 'ClassWallet is not configured. Please add API keys to environment variables.',
    };
  }

  try {
    const config = getClassWalletConfig();

    // Call the backend API to create ClassWallet payment
    const response = await fetch('/api/classwallet-establish-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: request.userId,
        userEmail: request.userEmail,
        userName: request.userName,
        planId: request.planId,
        amount: request.amount,
        description: request.description,
        paymentType: request.paymentType,
        returnUrl: request.returnUrl,
        cancelUrl: request.cancelUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create ClassWallet payment');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('ClassWallet payment error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create ClassWallet payment',
    };
  }
}

/**
 * Verify ClassWallet payment callback
 */
export async function verifyClassWalletPayment(
  transactionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/classwallet-verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify ClassWallet payment');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('ClassWallet verification error:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify ClassWallet payment',
    };
  }
}

/**
 * Get available payment types for user
 * Returns which ClassWallet payment types the user is eligible for
 */
export function getAvailablePaymentTypes(userState?: string): ClassWalletPaymentType[] {
  // Most states support basic scholarship and reimbursement
  const types = [ClassWalletPaymentType.SCHOLARSHIP, ClassWalletPaymentType.REIMBURSEMENT];

  // ESA (Education Savings Account) - Available in: AZ, FL, IN, MS, MT, NV, TN, NC, SC
  const esaStates = ['AZ', 'FL', 'IN', 'MS', 'MT', 'NV', 'TN', 'NC', 'SC'];
  if (userState && esaStates.includes(userState.toUpperCase())) {
    types.push(ClassWalletPaymentType.ESA);
  }

  // Empowerment Scholarship - Available in: AZ, FL, AR, IA, KS, LA, NH, NC, OK, SC, UT, WV
  const empowermentStates = ['AZ', 'FL', 'AR', 'IA', 'KS', 'LA', 'NH', 'NC', 'OK', 'SC', 'UT', 'WV'];
  if (userState && empowermentStates.includes(userState.toUpperCase())) {
    types.push(ClassWalletPaymentType.EMPOWERMENT);
  }

  return types;
}

/**
 * Format ClassWallet payment type for display
 */
export function formatPaymentType(type: ClassWalletPaymentType): string {
  switch (type) {
    case ClassWalletPaymentType.SCHOLARSHIP:
      return 'Scholarship Program';
    case ClassWalletPaymentType.REIMBURSEMENT:
      return 'Reimbursement';
    case ClassWalletPaymentType.ESA:
      return 'Education Savings Account (ESA)';
    case ClassWalletPaymentType.EMPOWERMENT:
      return 'Empowerment Scholarship Account';
    default:
      return 'ClassWallet Payment';
  }
}
