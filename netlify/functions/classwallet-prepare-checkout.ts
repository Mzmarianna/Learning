/**
 * ClassWallet Checkout Preparation Function
 * Step 2 of Pay by ClassWallet integration
 * Prepares order data and makes it available to ClassWallet
 */

import { Handler } from '@netlify/functions';

// In-memory session storage (shared with other functions)
const sessions = new Map<string, any>();

export const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { sessionId, orderData, returnUrl, cancelUrl } = JSON.parse(event.body || '{}');

    if (!sessionId || !orderData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Retrieve session
    const session = sessions.get(sessionId);
    if (!session) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Session not found or expired' }),
      };
    }

    // Update session with order data
    session.orderData = orderData;
    session.returnUrl = returnUrl;
    session.cancelUrl = cancelUrl;
    session.status = 'checkout_prepared';
    session.updatedAt = new Date().toISOString();

    sessions.set(sessionId, session);

    // In a real implementation, this would communicate with ClassWallet API
    // to register the order and get a checkout token

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Checkout prepared successfully',
      }),
    };
  } catch (error: any) {
    console.error('Checkout preparation error:', error);
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
