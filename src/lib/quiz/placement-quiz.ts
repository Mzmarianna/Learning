/**
 * Placement Quiz Logic
 * Handles adaptive quiz flow and scoring
 */

import { supabase } from '../supabase/client';

export interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: 'reading' | 'math' | 'critical_thinking' | 'writing';
  difficulty_level: 'early_explorers' | 'explorers' | 'warriors';
  options: string[];
  correct_answer: number;
  explanation: string;
  min_age: number;
  max_age: number;
}

export interface QuizAnswer {
  question_id: string;
  answer: number;
  correct: boolean;
  time_seconds: number;
}

export interface QuizAttempt {
  id: string;
  student_name: string;
  student_age: number;
  student_interests: string[];
  parent_email?: string;
  started_at: string;
  completed_at?: string;
  recommended_tier?: 'early_explorers' | 'explorers' | 'warriors';
  total_questions_answered: number;
  correct_answers: number;
  accuracy_percentage: number;
  reading_score: number;
  math_score: number;
  critical_thinking_score: number;
  answers: QuizAnswer[];
}

/**
 * Start a new placement quiz attempt
 */
export async function startPlacementQuiz(
  studentName: string,
  studentAge: number,
  studentInterests: string[],
  parentEmail?: string
): Promise<{ attemptId: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('placement_quiz_attempts')
      .insert({
        student_name: studentName,
        student_age: studentAge,
        student_interests: studentInterests,
        parent_email: parentEmail,
        answers: [],
      })
      .select('id')
      .single();

    if (error) throw error;

    return { attemptId: data.id };
  } catch (error: any) {
    console.error('Error starting quiz:', error);
    return { attemptId: '', error: error.message };
  }
}

/**
 * Get adaptive questions based on student age and previous answers
 */
export async function getAdaptiveQuestions(
  studentAge: number,
  previousAnswers: QuizAnswer[] = []
): Promise<QuizQuestion[]> {
  try {
    // Determine starting difficulty based on age
    let targetDifficulty: string;
    if (studentAge < 8) {
      targetDifficulty = 'early_explorers';
    } else if (studentAge < 11) {
      targetDifficulty = 'explorers';
    } else {
      targetDifficulty = 'warriors';
    }

    // Calculate current performance
    const recentCorrect = previousAnswers.slice(-3).filter(a => a.correct).length;
    const recentTotal = Math.min(previousAnswers.length, 3);

    // Adapt difficulty based on performance
    if (recentTotal >= 3) {
      if (recentCorrect === 3 && targetDifficulty === 'early_explorers') {
        targetDifficulty = 'explorers';
      } else if (recentCorrect === 3 && targetDifficulty === 'explorers') {
        targetDifficulty = 'warriors';
      } else if (recentCorrect === 0 && targetDifficulty === 'warriors') {
        targetDifficulty = 'explorers';
      } else if (recentCorrect === 0 && targetDifficulty === 'explorers') {
        targetDifficulty = 'early_explorers';
      }
    }

    // Get questions for current difficulty
    const { data, error } = await supabase
      .from('placement_quiz_questions')
      .select('*')
      .eq('is_active', true)
      .eq('difficulty_level', targetDifficulty)
      .lte('min_age', studentAge)
      .gte('max_age', studentAge)
      .order('sort_order')
      .limit(5);

    if (error) throw error;

    // Filter out already answered questions
    const answeredIds = previousAnswers.map(a => a.question_id);
    const unansweredQuestions = (data || []).filter(
      q => !answeredIds.includes(q.id)
    );

    return unansweredQuestions as QuizQuestion[];
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

/**
 * Submit an answer and update quiz attempt
 */
export async function submitAnswer(
  attemptId: string,
  questionId: string,
  answer: number,
  timeSeconds: number
): Promise<{ correct: boolean; explanation: string; error?: string }> {
  try {
    // Get question to check answer
    const { data: question, error: questionError } = await supabase
      .from('placement_quiz_questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (questionError) throw questionError;

    const correct = answer === question.correct_answer;

    // Get current attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('placement_quiz_attempts')
      .select('answers, total_questions_answered, correct_answers')
      .eq('id', attemptId)
      .single();

    if (attemptError) throw attemptError;

    // Update answers array
    const newAnswer: QuizAnswer = {
      question_id: questionId,
      answer,
      correct,
      time_seconds: timeSeconds,
    };

    const updatedAnswers = [...(attempt.answers || []), newAnswer];

    // Update attempt
    const { error: updateError } = await supabase
      .from('placement_quiz_attempts')
      .update({
        answers: updatedAnswers,
        total_questions_answered: (attempt.total_questions_answered || 0) + 1,
        correct_answers: (attempt.correct_answers || 0) + (correct ? 1 : 0),
      })
      .eq('id', attemptId);

    if (updateError) throw updateError;

    return {
      correct,
      explanation: question.explanation,
    };
  } catch (error: any) {
    console.error('Error submitting answer:', error);
    return {
      correct: false,
      explanation: '',
      error: error.message,
    };
  }
}

/**
 * Complete quiz and calculate results
 */
export async function completeQuiz(attemptId: string): Promise<{
  recommendedTier: 'early_explorers' | 'explorers' | 'warriors';
  results: {
    totalQuestions: number;
    correctAnswers: number;
    accuracyPercentage: number;
    readingScore: number;
    mathScore: number;
    criticalThinkingScore: number;
  };
  error?: string;
}> {
  try {
    // Get attempt with all answers
    const { data: attempt, error: attemptError } = await supabase
      .from('placement_quiz_attempts')
      .select('*')
      .eq('id', attemptId)
      .single();

    if (attemptError) throw attemptError;

    const answers = attempt.answers || [];
    
    // Get all questions to categorize
    const questionIds = answers.map((a: QuizAnswer) => a.question_id);
    const { data: questions, error: questionsError } = await supabase
      .from('placement_quiz_questions')
      .select('*')
      .in('id', questionIds);

    if (questionsError) throw questionsError;

    // Calculate scores by category
    const scoresByType: Record<string, { correct: number; total: number }> = {
      reading: { correct: 0, total: 0 },
      math: { correct: 0, total: 0 },
      critical_thinking: { correct: 0, total: 0 },
    };

    answers.forEach((answer: QuizAnswer) => {
      const question = questions?.find(q => q.id === answer.question_id);
      if (question) {
        const type = question.question_type;
        scoresByType[type].total++;
        if (answer.correct) {
          scoresByType[type].correct++;
        }
      }
    });

    // Calculate percentages
    const readingScore = scoresByType.reading.total > 0
      ? (scoresByType.reading.correct / scoresByType.reading.total) * 100
      : 0;
    const mathScore = scoresByType.math.total > 0
      ? (scoresByType.math.correct / scoresByType.math.total) * 100
      : 0;
    const criticalThinkingScore = scoresByType.critical_thinking.total > 0
      ? (scoresByType.critical_thinking.correct / scoresByType.critical_thinking.total) * 100
      : 0;

    const accuracyPercentage = answers.length > 0
      ? (attempt.correct_answers / answers.length) * 100
      : 0;

    // Call Supabase function to calculate recommended tier
    const { data: tierData, error: tierError } = await supabase.rpc(
      'calculate_recommended_tier',
      {
        p_reading_score: readingScore,
        p_math_score: mathScore,
        p_critical_thinking_score: criticalThinkingScore,
        p_student_age: attempt.student_age,
      }
    );

    if (tierError) throw tierError;

    const recommendedTier = tierData as 'early_explorers' | 'explorers' | 'warriors';

    // Update attempt with final results
    const { error: updateError } = await supabase
      .from('placement_quiz_attempts')
      .update({
        completed_at: new Date().toISOString(),
        recommended_tier: recommendedTier,
        accuracy_percentage: accuracyPercentage,
        reading_score: readingScore,
        math_score: mathScore,
        critical_thinking_score: criticalThinkingScore,
      })
      .eq('id', attemptId);

    if (updateError) throw updateError;

    // Send email with results if email provided
    if (attempt.parent_email) {
      try {
        const { sendQuizResultsEmail } = await import('../email/automation');
        await sendQuizResultsEmail(
          attempt.parent_email,
          attempt.student_name,
          recommendedTier,
          {
            reading: readingScore,
            math: mathScore,
            criticalThinking: criticalThinkingScore,
            overall: accuracyPercentage
          }
        );
      } catch (emailError) {
        console.error('Error sending quiz results email:', emailError);
        // Don't fail the quiz completion if email fails
      }
    }

    return {
      recommendedTier,
      results: {
        totalQuestions: answers.length,
        correctAnswers: attempt.correct_answers,
        accuracyPercentage,
        readingScore,
        mathScore,
        criticalThinkingScore,
      },
    };
  } catch (error: any) {
    console.error('Error completing quiz:', error);
    return {
      recommendedTier: 'early_explorers',
      results: {
        totalQuestions: 0,
        correctAnswers: 0,
        accuracyPercentage: 0,
        readingScore: 0,
        mathScore: 0,
        criticalThinkingScore: 0,
      },
      error: error.message,
    };
  }
}

/**
 * Get quiz attempt by ID
 */
export async function getQuizAttempt(attemptId: string): Promise<QuizAttempt | null> {
  try {
    const { data, error } = await supabase
      .from('placement_quiz_attempts')
      .select('*')
      .eq('id', attemptId)
      .single();

    if (error) throw error;

    return data as QuizAttempt;
  } catch (error) {
    console.error('Error fetching quiz attempt:', error);
    return null;
  }
}
