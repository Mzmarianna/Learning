/**
 * ClassWallet Payment Callback Function
 * Step 3 of Pay by ClassWallet integration
 * Receives payment confirmation from ClassWallet
 */

import { Handler } from '@netlify/functions';

// In-memory session storage (shared with other functions)
const sessions = new Map<string, any>();

export const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // ClassWallet can send data via query params or POST body
    let callbackData: any = {};

    if (event.httpMethod === 'GET') {
      // Extract from query parameters
      callbackData = event.queryStringParameters || {};
    } else if (event.httpMethod === 'POST') {
      // Extract from POST body
      callbackData = JSON.parse(event.body || '{}');
    }

    const { sessionId, transactionId, status, amount, orderId } = callbackData;

    if (!sessionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing session ID' }),
      };
    }

    // Retrieve session
    const session = sessions.get(sessionId);
    if (!session) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Session not found' }),
      };
    }

    // Update session with payment confirmation
    session.paymentConfirmation = {
      transactionId,
      status,
      amount,
      orderId: orderId || session.orderData?.orderId,
      timestamp: new Date().toISOString(),
    };
    session.status = status === 'approved' ? 'completed' : 'failed';
    session.completedAt = new Date().toISOString();

    sessions.set(sessionId, session);

    // In production, this would:
    // 1. Verify the transaction with ClassWallet API
    // 2. Update subscription in database
    // 3. Send confirmation email
    // 4. Trigger any post-payment workflows

    // Redirect user back to success/failure page
    const redirectUrl = status === 'approved' 
      ? session.returnUrl || '/payment-success'
      : session.cancelUrl || '/pricing';

    return {
      statusCode: 302,
      headers: {
        ...headers,
        'Location': `${redirectUrl}?sessionId=${sessionId}&status=${status}`,
      },
      body: '',
    };
  } catch (error: any) {
    console.error('Payment callback error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
    };
  }
};

export { sessions };
