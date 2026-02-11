/**
 * ClassWallet Session Establishment Function
 * Step 1 of Pay by ClassWallet integration
 * Establishes a session with user account data
 */

import { Handler } from '@netlify/functions';

// In-memory session storage (replace with database in production)
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
    const { userId, userEmail, userName, userPhone } = JSON.parse(event.body || '{}');

    if (!userId || !userEmail || !userName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Generate a unique session ID
    const sessionId = `cw_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store session data (in production, use a database)
    sessions.set(sessionId, {
      sessionId,
      userId,
      userEmail,
      userName,
      userPhone,
      createdAt: new Date().toISOString(),
      status: 'pending',
    });

    // Set expiration (optional, clean up after 1 hour)
    setTimeout(() => {
      if (sessions.get(sessionId)?.status === 'pending') {
        sessions.delete(sessionId);
      }
    }, 3600000); // 1 hour

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        sessionId,
      }),
    };
  } catch (error: any) {
    console.error('Session establishment error:', error);
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

// Export sessions for other functions to access
export { sessions };
