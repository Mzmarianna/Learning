/**
 * PayPal Subscription Service
 * Handles autopay recurring subscriptions
 */

import {
  isPayPalConfigured,
  type PayPalSubscriptionRequest,
  type PayPalSubscriptionResponse,
} from './config';

/**
 * Create a PayPal subscription
 * Returns an approval URL where the user can authorize the subscription
 */
export async function createPayPalSubscription(
  request: PayPalSubscriptionRequest
): Promise<PayPalSubscriptionResponse> {
  if (!isPayPalConfigured()) {
    return {
      success: false,
      error: 'PayPal is not configured. Please add Client ID to environment variables.',
    };
  }

  try {
    // Call the backend API to create PayPal subscription
    const response = await fetch('/.netlify/functions/paypal-create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: request.userId,
        userEmail: request.userEmail,
        userName: request.userName,
        planId: request.planId,
        paypalPlanId: request.paypalPlanId,
        returnUrl: request.returnUrl,
        cancelUrl: request.cancelUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create PayPal subscription');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('PayPal subscription error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create PayPal subscription',
    };
  }
}

/**
 * Verify PayPal subscription callback
 */
export async function verifyPayPalSubscription(
  subscriptionId: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/.netlify/functions/paypal-verify-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId, token }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify PayPal subscription');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('PayPal verification error:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify PayPal subscription',
    };
  }
}

/**
 * Cancel PayPal subscription
 */
export async function cancelPayPalSubscription(
  subscriptionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/.netlify/functions/paypal-cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel PayPal subscription');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('PayPal cancellation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to cancel PayPal subscription',
    };
  }
}

/**
 * Get PayPal subscription details
 */
export async function getPayPalSubscriptionDetails(
  subscriptionId: string
): Promise<{ success: boolean; subscription?: any; error?: string }> {
  try {
    const response = await fetch(`/.netlify/functions/paypal-get-subscription?id=${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get PayPal subscription details');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('PayPal subscription details error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get PayPal subscription details',
    };
  }
}
