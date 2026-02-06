/**
 * SUPABASE CLIENT
 * Singleton client instance for database access
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { config, isConfigured } from '../../config';

// ============================================================================
// CONFIGURATION LOADING
// ============================================================================
// Figma Make doesn't support .env files, so we use /config.ts instead
// For production deployments, environment variables will override config.ts
// ============================================================================

// Get environment variables (Vite uses import.meta.env)
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

// Priority: Environment variables > config.ts > empty
let supabaseUrl = env.VITE_SUPABASE_URL || config.supabase.url || '';
let supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || config.supabase.anonKey || '';

// Determine configuration source for logging
const configSource = env.VITE_SUPABASE_URL 
  ? 'environment variables' 
  : isConfigured 
    ? '/config.ts file'
    : 'none (demo mode)';

// Check if using placeholder values
const isPlaceholder = 
  !supabaseUrl || 
  !supabaseAnonKey ||
  supabaseUrl.includes('REPLACE_WITH') || 
  supabaseUrl.includes('your-project') ||
  supabaseUrl.includes('your-real') ||
  supabaseUrl.includes('YOUR_SUPABASE') ||
  supabaseUrl === 'https://your-project-id-here.supabase.co' ||
  !isConfigured;

// ============================================================================
// SUPABASE CLIENT INITIALIZATION
// ============================================================================

let supabase: any;

if (isPlaceholder) {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 DEMO MODE ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Ready to test! Login with: demo@test.com / test123

ℹ️  Demo mode uses mock data (no persistence across refreshes)
ℹ️  To enable real database: Edit /config.ts with Supabase credentials

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
  
  // Create a mock Supabase client for demo mode
  // Mock user session for demo mode
  let mockSession: any = null;
  let mockAuthCallbacks: Array<(event: string, session: any) => void> = [];
  
  // Demo accounts
  const DEMO_ACCOUNTS = {
    'demo@test.com': {
      password: 'test123',
      user: {
        id: 'demo-student-123',
        email: 'demo@test.com',
        user_metadata: {
          display_name: 'Demo Student',
          role: 'student',
        },
        created_at: new Date().toISOString(),
      },
      profile: {
        id: 'demo-student-123',
        email: 'demo@test.com',
        role: 'student',
        display_name: 'Demo Student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      student: {
        id: 'demo-student-123',
        user_id: 'demo-student-123',
        display_name: 'Demo Student',
        age: 10,
        tier: 'explorers',
        xp_total: 450,
        current_level: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  };
  
  // Mock placement quiz questions
  const MOCK_QUIZ_QUESTIONS = [
    {
      id: 'q1',
      question_text: 'What is 1/2 + 1/4?',
      question_type: 'math',
      difficulty_level: 'explorers',
      options: ['1/6', '2/6', '3/4', '1/3'],
      correct_answer: 2,
      explanation: '1/2 is the same as 2/4, so 2/4 + 1/4 = 3/4',
      min_age: 8,
      max_age: 11,
      is_active: true,
      sort_order: 1,
    },
    {
      id: 'q2',
      question_text: 'If you have 12 cookies and share them equally with 3 friends (4 people total), how many cookies does each person get?',
      question_type: 'math',
      difficulty_level: 'explorers',
      options: ['2 cookies', '3 cookies', '4 cookies', '6 cookies'],
      correct_answer: 1,
      explanation: '12 divided by 4 equals 3 cookies per person',
      min_age: 8,
      max_age: 11,
      is_active: true,
      sort_order: 2,
    },
    {
      id: 'q3',
      question_text: 'What does the word "curious" mean?',
      question_type: 'reading',
      difficulty_level: 'explorers',
      options: ['Angry', 'Wanting to learn or know about something', 'Tired', 'Happy'],
      correct_answer: 1,
      explanation: 'Curious means wanting to learn or know about something',
      min_age: 8,
      max_age: 11,
      is_active: true,
      sort_order: 3,
    },
    {
      id: 'q4',
      question_text: 'If a plant needs water to grow, and it hasn\'t rained in two weeks, what should you do?',
      question_type: 'critical_thinking',
      difficulty_level: 'explorers',
      options: ['Wait for rain', 'Water the plant yourself', 'Move the plant inside', 'Give up on the plant'],
      correct_answer: 1,
      explanation: 'The best solution is to water the plant yourself since it needs water to survive',
      min_age: 8,
      max_age: 11,
      is_active: true,
      sort_order: 4,
    },
    {
      id: 'q5',
      question_text: 'What is 25 + 37?',
      question_type: 'math',
      difficulty_level: 'explorers',
      options: ['52', '62', '72', '82'],
      correct_answer: 1,
      explanation: '25 + 37 = 62',
      min_age: 8,
      max_age: 11,
      is_active: true,
      sort_order: 5,
    },
  ];
  
  // Store quiz attempts in memory
  let mockQuizAttempts: Record<string, any> = {};
  
  supabase = {
    auth: {
      getSession: async () => ({ 
        data: { session: mockSession }, 
        error: null 
      }),
      getUser: async () => ({ 
        data: { user: mockSession?.user || null }, 
        error: null 
      }),
      signUp: async () => ({ 
        data: null, 
        error: { message: 'Demo mode - Use demo@test.com / test123 to login' } 
      }),
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        // Case-insensitive email lookup
        const normalizedEmail = email.toLowerCase().trim();
        const account = DEMO_ACCOUNTS[normalizedEmail as keyof typeof DEMO_ACCOUNTS];
        
        if (account && account.password === password) {
          // Create mock session
          mockSession = {
            user: account.user,
            access_token: 'mock-token',
            refresh_token: 'mock-refresh',
          };
          
          // Store in localStorage for persistence
          localStorage.setItem('mock-session', JSON.stringify(mockSession));
          
          // Notify listeners
          setTimeout(() => {
            mockAuthCallbacks.forEach(cb => cb('SIGNED_IN', mockSession));
          }, 0);
          
          console.log('✅ Demo login successful:', email);
          return { 
            data: { user: account.user, session: mockSession }, 
            error: null 
          };
        }
        
        console.log('❌ Login failed. Email:', email, 'Expected: demo@test.com');
        return { 
          data: null, 
          error: { message: 'Invalid credentials. Use demo@test.com / test123' } 
        };
      },
      signOut: async () => {
        mockSession = null;
        localStorage.removeItem('mock-session');
        
        // Notify listeners
        setTimeout(() => {
          mockAuthCallbacks.forEach(cb => cb('SIGNED_OUT', null));
        }, 0);
        
        console.log('✅ Demo logout successful');
        return { error: null };
      },
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        mockAuthCallbacks.push(callback);
        
        // Check for existing session in localStorage
        const stored = localStorage.getItem('mock-session');
        if (stored && !mockSession) {
          try {
            mockSession = JSON.parse(stored);
            setTimeout(() => callback('SIGNED_IN', mockSession), 0);
          } catch (e) {
            console.error('Failed to restore session:', e);
          }
        }
        
        return { 
          data: { 
            subscription: { 
              unsubscribe: () => {
                mockAuthCallbacks = mockAuthCallbacks.filter(cb => cb !== callback);
              } 
            } 
          } 
        };
      },
    },
    from: (table: string) => ({
      select: (...args: any[]) => {
        // Create a chainable query builder
        let filters: any = {};
        
        const buildQuery = () => {
          // Return mock data based on table and filters
          if (table === 'profiles' && filters.id === 'demo-student-123') {
            return { 
              data: DEMO_ACCOUNTS['demo@test.com'].profile, 
              error: null 
            };
          }
          
          if (table === 'students') {
            if (filters.user_id === 'demo-student-123' || filters.id === 'demo-student-123') {
              return { 
                data: DEMO_ACCOUNTS['demo@test.com'].student, 
                error: null 
              };
            }
          }
          
          // Placement quiz questions
          if (table === 'placement_quiz_questions') {
            let results = [...MOCK_QUIZ_QUESTIONS];
            
            // Apply filters
            if (filters.is_active === true) {
              results = results.filter(q => q.is_active);
            }
            if (filters.difficulty_level) {
              results = results.filter(q => q.difficulty_level === filters.difficulty_level);
            }
            if (filters.id) {
              results = results.filter(q => q.id === filters.id);
              return { data: results[0] || null, error: null };
            }
            if (filters['id_in']) {
              results = results.filter(q => filters['id_in'].includes(q.id));
            }
            
            // Apply age filters
            if (filters.min_age_lte !== undefined) {
              results = results.filter(q => q.min_age <= filters.min_age_lte);
            }
            if (filters.max_age_gte !== undefined) {
              results = results.filter(q => q.max_age >= filters.max_age_gte);
            }
            
            // Apply limit
            if (filters._limit) {
              results = results.slice(0, filters._limit);
            }
            
            return { data: results, error: null };
          }
          
          // Placement quiz attempts
          if (table === 'placement_quiz_attempts') {
            if (filters.id) {
              return { 
                data: mockQuizAttempts[filters.id] || null, 
                error: mockQuizAttempts[filters.id] ? null : { message: 'Not found' }
              };
            }
            return { data: Object.values(mockQuizAttempts), error: null };
          }
          
          // For empty result tables (no demo data yet)
          if (table === 'xp_events' || 
              table === 'challenge_instances' || 
              table === 'quest_instances' ||
              table === 'badges' ||
              table === 'portfolio_submissions' ||
              table === 'submissions' ||
              table === 'student_badges') {
            return { data: [], error: null };
          }
          
          // Default: return empty array instead of error
          return { data: [], error: null };
        };
        
        const queryBuilder: any = {
          eq: (column: string, value: any) => {
            filters[column] = value;
            return queryBuilder;
          },
          neq: (column: string, value: any) => {
            filters[`${column}_neq`] = value;
            return queryBuilder;
          },
          gte: (column: string, value: any) => {
            filters[`${column}_gte`] = value;
            return queryBuilder;
          },
          lte: (column: string, value: any) => {
            filters[`${column}_lte`] = value;
            return queryBuilder;
          },
          gt: (column: string, value: any) => {
            filters[`${column}_gt`] = value;
            return queryBuilder;
          },
          lt: (column: string, value: any) => {
            filters[`${column}_lt`] = value;
            return queryBuilder;
          },
          in: (column: string, values: any[]) => {
            filters[`${column}_in`] = values;
            return queryBuilder;
          },
          not: (column: string, operator: string, value: any) => {
            filters[`${column}_not_${operator}`] = value;
            return queryBuilder;
          },
          is: (column: string, value: any) => {
            filters[`${column}_is`] = value;
            return queryBuilder;
          },
          order: (column: string, options?: any) => {
            filters._order = { column, ...options };
            return queryBuilder;
          },
          limit: (count: number) => {
            filters._limit = count;
            return queryBuilder;
          },
          range: (from: number, to: number) => {
            filters._range = { from, to };
            return queryBuilder;
          },
          single: async () => buildQuery(),
        };
        
        // Allow direct await on the query builder
        queryBuilder.then = async (resolve: any, reject: any) => {
          try {
            const result = await buildQuery();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        };
        
        return queryBuilder;
      },
      insert: async (data: any) => {
        // Handle placement quiz attempts
        if (table === 'placement_quiz_attempts') {
          const attemptId = 'attempt-' + Date.now();
          const newAttempt = {
            id: attemptId,
            ...data,
            started_at: new Date().toISOString(),
            total_questions_answered: 0,
            correct_answers: 0,
            accuracy_percentage: 0,
            reading_score: 0,
            math_score: 0,
            critical_thinking_score: 0,
          };
          mockQuizAttempts[attemptId] = newAttempt;
          
          return {
            data: newAttempt,
            error: null,
            select: () => ({
              single: async () => ({ data: newAttempt, error: null }),
            }),
          };
        }
        
        return { 
          data: null, 
          error: { message: 'Demo mode - Use demo@test.com / test123 to login' } 
        };
      },
      update: (data: any) => ({
        eq: async (column: string, value: any) => {
          // Handle placement quiz attempts updates
          if (table === 'placement_quiz_attempts' && column === 'id' && mockQuizAttempts[value]) {
            mockQuizAttempts[value] = {
              ...mockQuizAttempts[value],
              ...data,
            };
            return { 
              data: mockQuizAttempts[value], 
              error: null 
            };
          }
          
          return { 
            data: null, 
            error: { message: 'Demo mode - Changes not saved' } 
          };
        },
      }),
      delete: () => ({
        eq: async () => ({ 
          error: { message: 'Demo mode - Changes not saved' } 
        }),
      }),
      upsert: async () => ({
        data: null,
        error: { message: 'Demo mode - Changes not saved' }
      }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ 
          data: null, 
          error: { message: 'Demo mode - File uploads disabled' } 
        }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
    }),
  };
  
  console.log('📦 Demo mode initialized - using mock Supabase client');
  console.log('🔑 Demo credentials: demo@test.com / test123');
} else {
  // Real Supabase client
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  
  console.log(`📝 Using configuration from ${configSource}`);
  console.log('✅ Supabase client initialized successfully');
  console.log('🔗 Connected to:', supabaseUrl);
}

export { supabase };
export const isSupabaseConfigured = !isPlaceholder;