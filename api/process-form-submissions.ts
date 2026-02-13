/**
 * Process Form Submissions API Endpoint
 * Vercel Serverless Function
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Security check
  const authHeader = req.headers.authorization;
  const expectedAuth = `Bearer ${process.env.FORM_PROCESSING_SECRET}`;
  
  if (authHeader !== expectedAuth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Import services from server-only location
    const { fetchNewSubmissions } = await import('./_lib/google-sheets-service');
    const { processFormSubmission, isSubmissionProcessed } = await import('./_lib/form-processing-service');

    console.log('Starting form submission processing...');

    const lastRowNumber = parseInt((req.query.lastRow as string) || '0');
    const newSubmissions = await fetchNewSubmissions(lastRowNumber);
    
    console.log(`Found ${newSubmissions.length} new submissions`);

    if (newSubmissions.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No new submissions to process',
        processed: 0,
      });
    }

    const results = {
      total: newSubmissions.length,
      processed: 0,
      skipped: 0,
      errors: [] as any[],
    };

    for (const submission of newSubmissions) {
      try {
        const alreadyProcessed = await isSubmissionProcessed(submission.rowNumber);
        if (alreadyProcessed) {
          results.skipped++;
          continue;
        }

        const result = await processFormSubmission(submission);
        
        if (result.success) {
          results.processed++;
        } else {
          results.skipped++;
        }
      } catch (error: any) {
        results.errors.push({
          rowNumber: submission.rowNumber,
          email: submission.email,
          error: error.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      results,
      message: `Processed ${results.processed} new submissions`,
    });

  } catch (error: any) {
    console.error('Error in form processing endpoint:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
