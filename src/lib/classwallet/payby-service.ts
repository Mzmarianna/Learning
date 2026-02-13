/**
 * Pay by ClassWallet Service
 * Implements the 3-step workflow for ClassWallet Pay by integration
 * 
 * Step 1: Establish session with account data
 * Step 2: Redirect to ClassWallet checkout with order data
 * Step 3: Handle payment confirmation callback
 */

import { ClassWalletPaymentType } from './config';

/**
 * Allowed ClassWallet domains for checkout redirects
 * Used to prevent open-redirect vulnerabilities
 */
const ALLOWED_CLASSWALLET_HOSTS = [
  'app.classwallet.com',
  'www.classwallet.com',
  'classwallet.com',
  'sandbox.classwallet.com', // For testing environments
] as const;

/**
 * Session data for Pay by ClassWallet
 */
export interface PayByClassWalletSession {
  sessionId: string;
  userId: string;
  userEmail: string;
  accountData: {
    name: string;
    email: string;
    phone?: string;
  };
}

/**
 * Order data for ClassWallet checkout
 */
export interface PayByClassWalletOrder {
  sessionId: string;
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  currency: string;
}

/**
 * Payment confirmation data from ClassWallet
 */
export interface PayByClassWalletConfirmation {
  sessionId: string;
  orderId: string;
  transactionId: string;
  status: 'approved' | 'declined' | 'pending';
  amount: number;
  timestamp: string;
}

/**
 * Validates that a checkout URL is safe to redirect to
 * Prevents open-redirect vulnerabilities by ensuring URL points to ClassWallet
 */
function validateCheckoutUrl(url: string): void {
  // Check it's a non-empty string
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    throw new Error('Checkout URL must be a non-empty string');
  }

  // Parse and validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch (error) {
    throw new Error('Checkout URL is not a valid URL');
  }

  // Ensure HTTPS protocol
  if (parsedUrl.protocol !== 'https:') {
    throw new Error('Checkout URL must use HTTPS protocol');
  }

  // Validate hostname is a ClassWallet domain or proper subdomain
  const hostname = parsedUrl.hostname.toLowerCase();
  const isAllowed = ALLOWED_CLASSWALLET_HOSTS.some(host => {
    // Exact match
    if (hostname === host) {
      return true;
    }
    // Proper subdomain (must end with ".host" not just contain host)
    // This prevents "malicious-classwallet.com" from matching "classwallet.com"
    if (hostname.endsWith('.' + host)) {
      return true;
    }
    return false;
  });

  if (!isAllowed) {
    throw new Error(`Checkout URL must point to a ClassWallet domain (allowed: ${ALLOWED_CLASSWALLET_HOSTS.join(', ')})`);
  }
}

/**
 * Step 1: Establish session with account data
 * Creates a session on the server with user account information
 */
export async function establishPayByClassWalletSession(
  userId: string,
  userEmail: string,
  userName: string,
  paymentType: ClassWalletPaymentType,
  userPhone?: string
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  try {
    const response = await fetch('/api/classwallet-establish-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userEmail,
        userName,
        paymentType,
        userPhone,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to establish ClassWallet session');
    }

    const data = await response.json();
    return {
      success: true,
      sessionId: data.sessionId,
    };
  } catch (error: any) {
    console.error('ClassWallet session error:', error);
    return {
      success: false,
      error: error.message || 'Failed to establish session',
    };
  }
}

/**
 * Step 2: Redirect to ClassWallet checkout with order data
 * Constructs the checkout URL and prepares order data for ClassWallet
 */
export async function redirectToPayByClassWalletCheckout(
  sessionId: string,
  orderData: PayByClassWalletOrder,
  returnUrl: string,
  cancelUrl: string
): Promise<{ success: boolean; checkoutUrl?: string; error?: string }> {
  try {
    // Store order data on the server associated with this session
    const response = await fetch('/api/classwallet-prepare-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        orderData,
        returnUrl,
        cancelUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to prepare ClassWallet checkout');
    }

    const data = await response.json();
    
    // Use the checkout URL returned by the server which includes session/order identifier
    if (!data.checkoutUrl) {
      throw new Error(`Server did not return a checkout URL. Received: ${JSON.stringify(data)}`);
    }
    
    // Validate the checkout URL for security (prevent open-redirect attacks)
    validateCheckoutUrl(data.checkoutUrl);
    
    return {
      success: true,
      checkoutUrl: data.checkoutUrl,
    };
  } catch (error: any) {
    console.error('ClassWallet checkout preparation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to prepare checkout',
    };
  }
}

/**
 * Step 3: Verify payment confirmation
 * Called after ClassWallet redirects back with payment confirmation
 */
export async function verifyPayByClassWalletPayment(
  sessionId: string
): Promise<{ success: boolean; confirmation?: PayByClassWalletConfirmation; error?: string }> {
  try {
    const response = await fetch('/api/classwallet-verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify ClassWallet payment');
    }

    const data = await response.json();
    
    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Payment verification failed',
      };
    }

    return {
      success: true,
      confirmation: data.confirmation,
    };
  } catch (error: any) {
    console.error('ClassWallet verification error:', error);
    return {
      success: false,
      error: error.message || 'Failed to verify payment',
    };
  }
}

/**
 * Create a complete Pay by ClassWallet payment flow
 * Combines all 3 steps into a single convenient function
 */
export async function createPayByClassWalletPayment(
  userId: string,
  userEmail: string,
  userName: string,
  orderData: Omit<PayByClassWalletOrder, 'sessionId'>,
  returnUrl: string,
  cancelUrl: string,
  paymentType: ClassWalletPaymentType,
  userPhone?: string
): Promise<{ success: boolean; checkoutUrl?: string; sessionId?: string; error?: string }> {
  // Step 1: Establish session
  const sessionResult = await establishPayByClassWalletSession(
    userId,
    userEmail,
    userName,
    paymentType,
    userPhone
  );

  if (!sessionResult.success || !sessionResult.sessionId) {
    return {
      success: false,
      error: sessionResult.error || 'Failed to establish session',
    };
  }

  const sessionId = sessionResult.sessionId;

  // Step 2: Prepare checkout and get redirect URL
  const checkoutResult = await redirectToPayByClassWalletCheckout(
    sessionId,
    { ...orderData, sessionId },
    returnUrl,
    cancelUrl
  );

  if (!checkoutResult.success || !checkoutResult.checkoutUrl) {
    return {
      success: false,
      sessionId,
      error: checkoutResult.error || 'Failed to prepare checkout',
    };
  }

  return {
    success: true,
    checkoutUrl: checkoutResult.checkoutUrl,
    sessionId,
  };
}
