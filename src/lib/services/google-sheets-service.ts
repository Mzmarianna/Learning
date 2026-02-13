/**
 * Google Sheets Integration Service
 * Fetches and processes form submissions from Google Sheets
 */

import { google } from 'googleapis';

// Google Sheets configuration (resolved lazily to avoid top-level process.env usage)
function getSheetsConfig() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME;

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID environment variable is not set.');
  }

  if (!sheetName) {
    throw new Error('GOOGLE_SHEETS_SHEET_NAME environment variable is not set.');
  }

  const range = `${sheetName}!A:Q`; // Columns A through Q

  return {
    spreadsheetId,
    sheetName,
    range,
  };
}

// Column mapping (0-indexed)
const COLUMNS = {
  TIMESTAMP: 0,
  EMAIL: 1,
  PARENT_NAME: 2,
  CHILD_NAME_GRADE: 3,
  STRUGGLES: 4,
  PROGRAMS_INTERESTED: 5,
  TUTORING_PREFERENCE: 6,
  STRENGTHS: 7,
  LIKES: 8,
  PAYMENT_METHOD: 9,
  MONDAY: 10,
  TUESDAY: 11,
  WEDNESDAY: 12,
  THURSDAY: 13,
  FRIDAY: 14,
  SATURDAY: 15,
  QUESTIONS: 16,
};

/**
 * Form submission data structure
 */
export interface FormSubmission {
  rowNumber: number;
  timestamp: Date;
  email: string;
  parentName: string;
  childNameAndGrade: string;
  biggestStruggles: string;
  programsInterested: string[];
  tutoringPreference: string;
  childStrengths: string;
  childLikes: string;
  paymentMethod: string;
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
  };
  questions: string;
}

/**
 * Initialize Google Sheets API client
 */
function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

/**
 * Parse availability from checkbox or text field
 */
function parseAvailability(value: string): string[] {
  if (!value) return [];
  
  // Split by common delimiters
  return value
    .split(/[,;]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Parse programs interested (checkbox field)
 */
function parsePrograms(value: string): string[] {
  if (!value) return [];
  
  return value
    .split(/[,;]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Fetch all form submissions from Google Sheets
 */
export async function fetchFormSubmissions(): Promise<FormSubmission[]> {
  try {
    const sheets = getGoogleSheetsClient();
    const config = getSheetsConfig();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: config.range,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.log('No data found in spreadsheet');
      return [];
    }

    // Skip header row, process data rows
    const submissions: FormSubmission[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // Skip empty rows
      if (!row[COLUMNS.EMAIL]) continue;

      submissions.push({
        rowNumber: i + 1, // 1-indexed for Google Sheets
        timestamp: new Date(row[COLUMNS.TIMESTAMP] || Date.now()),
        email: row[COLUMNS.EMAIL] || '',
        parentName: row[COLUMNS.PARENT_NAME] || '',
        childNameAndGrade: row[COLUMNS.CHILD_NAME_GRADE] || '',
        biggestStruggles: row[COLUMNS.STRUGGLES] || '',
        programsInterested: parsePrograms(row[COLUMNS.PROGRAMS_INTERESTED] || ''),
        tutoringPreference: row[COLUMNS.TUTORING_PREFERENCE] || '',
        childStrengths: row[COLUMNS.STRENGTHS] || '',
        childLikes: row[COLUMNS.LIKES] || '',
        paymentMethod: row[COLUMNS.PAYMENT_METHOD] || '',
        availability: {
          monday: parseAvailability(row[COLUMNS.MONDAY] || ''),
          tuesday: parseAvailability(row[COLUMNS.TUESDAY] || ''),
          wednesday: parseAvailability(row[COLUMNS.WEDNESDAY] || ''),
          thursday: parseAvailability(row[COLUMNS.THURSDAY] || ''),
          friday: parseAvailability(row[COLUMNS.FRIDAY] || ''),
          saturday: parseAvailability(row[COLUMNS.SATURDAY] || ''),
        },
        questions: row[COLUMNS.QUESTIONS] || '',
      });
    }

    return submissions;
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    throw error;
  }
}

/**
 * Fetch new form submissions since last check
 * @param lastRowNumber - Last processed row number
 */
export async function fetchNewSubmissions(lastRowNumber: number = 0): Promise<FormSubmission[]> {
  const allSubmissions = await fetchFormSubmissions();
  return allSubmissions.filter(s => s.rowNumber > lastRowNumber);
}

/**
 * Parse child name and grade
 * Expected formats: "John (3rd grade)", "Emma - Grade 5", etc.
 */
export function parseChildNameAndGrade(input: string): { name: string; grade: number | null } {
  const name = input.split(/[\(\-]/)[0].trim();
  
  // Try to extract grade
  const gradeMatch = input.match(/(\d+)(st|nd|rd|th)?\s*grade/i) || input.match(/grade\s*(\d+)/i);
  const grade = gradeMatch ? parseInt(gradeMatch[1]) : null;
  
  return { name, grade };
}

/**
 * Estimate age from grade
 */
export function estimateAgeFromGrade(grade: number | null): number {
  if (!grade) return 8; // Default middle age
  
  // Kindergarten = 5, 1st grade = 6, etc.
  if (grade === 0) return 5;
  return grade + 5;
}

/**
 * Determine tier from grade
 */
export function determineTierFromGrade(grade: number | null): 'early-explorers' | 'explorers' | 'warriors' {
  if (!grade) return 'explorers'; // Default
  
  if (grade <= 2) return 'early-explorers'; // K-2
  if (grade <= 5) return 'explorers'; // 3-5
  return 'warriors'; // 6+
}
