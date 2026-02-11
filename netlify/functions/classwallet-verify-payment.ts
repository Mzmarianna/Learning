/**
 * ClassWallet Payment Verification Function
 * Verifies the payment status for a session
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
    const { sessionId } = JSON.parse(event.body || '{}');

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
        body: JSON.stringify({
          success: false,
          error: 'Session not found',
        }),
      };
    }

    // Check if payment confirmation exists
    if (!session.paymentConfirmation) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Payment not yet confirmed',
          status: session.status,
        }),
      };
    }

    // Return payment confirmation
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        confirmation: session.paymentConfirmation,
        status: session.status,
      }),
    };
  } catch (error: any) {
    console.error('Payment verification error:', error);
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
