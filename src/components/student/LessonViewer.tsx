/**
 * Embedded Lesson Viewer
 * Students watch lessons WITHOUT leaving the platform
 * Replaces Khan Academy, YouTube, etc.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Check,
  X,
  ChevronRight,
  BookOpen,
  FileText,
  Award,
  Lightbulb,
} from 'lucide-react';
import { Button } from '../ui/button';
import { GeneratedLesson, Question } from '../../lib/ai-content-engine';
import { speakAsWowl, stopWowlSpeaking } from '../../lib/wowl-voice';

interface LessonViewerProps {
  lesson: GeneratedLesson;
  onComplete?: (xpEarned: number) => void;
}

export default function LessonViewer({ lesson, onComplete }: LessonViewerProps) {
  const [currentSection, setCurrentSection] = useState<'intro' | 'content' | 'quiz' | 'complete'>('intro');
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string | number }>({});
  const [quizResults, setQuizResults] = useState<{ [key: string]: boolean }>({});
  const [showTranscript, setShowTranscript] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopWowlSpeaking();
    };
  }, []);

  const handleStartLesson = () => {
    setCurrentSection('content');
    if (lesson.videoScript) {
      speakAsWowl(
        `Let's learn about ${lesson.topic}!`,
        'friendly',
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  const handleQuizAnswer = (questionId: string, answer: string | number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = () => {
    const results: { [key: string]: boolean } = {};
    let correctCount = 0;

    lesson.checkUnderstanding.forEach((q) => {
      const studentAnswer = quizAnswers[q.id];
      const isCorrect = studentAnswer === q.correctAnswer;
      results[q.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setQuizResults(results);

    // Calculate XP
    const percentage = correctCount / lesson.checkUnderstanding.length;
    let earnedXP = 100; // Base XP

    if (percentage >= 0.8) {
      earnedXP += 50; // Bonus for 80%+
    }
    if (percentage === 1) {
      earnedXP += 50; // Perfect score bonus
    }

    setXpEarned(earnedXP);

    if (percentage >= 0.7) {
      setCurrentSection('complete');
      speakAsWowl(
        `Awesome work! You earned ${earnedXP} XP!`,
        'excited',
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
      if (onComplete) onComplete(earnedXP);
    } else {
      speakAsWowl(
        'Let\'s review the content and try again.',
        'encouraging',
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
            <p className="text-slate-400">
              {lesson.duration} minutes • {lesson.subject}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {/* INTRO */}
        {currentSection === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900 rounded-2xl p-8 border border-slate-800"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">What You'll Learn</h2>
              <ul className="space-y-3">
                {lesson.learningObjectives.map((objective, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {lesson.vocabulary.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Key Vocabulary</h3>
                <div className="grid grid-cols-2 gap-4">
                  {lesson.vocabulary.map((vocab, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800 rounded-lg p-4 border border-slate-700"
                    >
                      <div className="font-semibold text-cyan-400 mb-1">{vocab.term}</div>
                      <div className="text-sm text-slate-400">{vocab.definition}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleStartLesson}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg"
            >
              Start Learning <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* CONTENT */}
        {currentSection === 'content' && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Wowl Avatar (Speaking Indicator) */}
            <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-6 mb-6 border border-purple-500/30">
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  animate={{
                    scale: isSpeaking ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl"
                >
                  🦉
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Wowl is teaching</h3>
                  <p className="text-slate-400 text-sm">
                    {isSpeaking ? 'Speaking...' : 'Ready to learn'}
                  </p>
                </div>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="ml-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-sm"
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  {showTranscript ? 'Hide' : 'Show'} Transcript
                </button>
              </div>

              {showTranscript && lesson.videoScript && (
                <div className="bg-slate-800/60 rounded-xl p-4 text-slate-300 text-sm leading-relaxed">
                  {lesson.videoScript}
                </div>
              )}
            </div>

            {/* Lesson Content */}
            <div className="bg-slate-900 rounded-2xl p-8 mb-6 border border-slate-800">
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(lesson.content) }}
              />
            </div>

            {/* Examples */}
            {lesson.examples.length > 0 && (
              <div className="bg-gradient-to-br from-cyan-900 to-slate-900 rounded-2xl p-6 mb-6 border border-cyan-500/30">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-cyan-400" />
                  Examples
                </h3>
                <div className="space-y-4">
                  {lesson.examples.map((example, idx) => (
                    <div key={idx} className="bg-slate-800/60 rounded-lg p-4 text-slate-300">
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={() => setCurrentSection('quiz')}
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-lg"
            >
              Check My Understanding <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* QUIZ */}
        {currentSection === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900 rounded-2xl p-8 border border-slate-800"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Check Your Understanding</h2>

            <div className="space-y-6">
              {lesson.checkUnderstanding.map((question, idx) => (
                <div
                  key={question.id}
                  className={`p-6 rounded-xl border-2 transition-colors ${
                    quizResults[question.id] !== undefined
                      ? quizResults[question.id]
                        ? 'bg-emerald-900/20 border-emerald-500'
                        : 'bg-red-900/20 border-red-500'
                      : 'bg-slate-800/60 border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-4">{question.question}</p>

                      {question.type === 'multiple-choice' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => handleQuizAnswer(question.id, optIdx)}
                              disabled={quizResults[question.id] !== undefined}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                                quizAnswers[question.id] === optIdx
                                  ? 'bg-purple-600 border-purple-500 text-white'
                                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-purple-500'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}

                      {question.type === 'short-answer' && (
                        <textarea
                          value={(quizAnswers[question.id] as string) || ''}
                          onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                          disabled={quizResults[question.id] !== undefined}
                          className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
                          rows={4}
                          placeholder="Type your answer here..."
                        />
                      )}

                      {quizResults[question.id] !== undefined && (
                        <div
                          className={`mt-4 p-4 rounded-lg ${
                            quizResults[question.id]
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-semibold mb-2">
                            {quizResults[question.id] ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <X className="w-5 h-5" />
                            )}
                            {quizResults[question.id] ? 'Correct!' : 'Not quite'}
                          </div>
                          <p className="text-sm">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {Object.keys(quizResults).length === 0 && (
              <Button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length !== lesson.checkUnderstanding.length}
                size="lg"
                className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-lg disabled:opacity-50"
              >
                Submit Answers
              </Button>
            )}

            {Object.keys(quizResults).length > 0 &&
              Object.values(quizResults).filter(Boolean).length < lesson.checkUnderstanding.length * 0.7 && (
                <Button
                  onClick={() => {
                    setCurrentSection('content');
                    setQuizAnswers({});
                    setQuizResults({});
                  }}
                  size="lg"
                  className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
                >
                  Review Lesson
                </Button>
              )}
          </motion.div>
        )}

        {/* COMPLETE */}
        {currentSection === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <Award className="w-24 h-24 text-white mx-auto mb-6" />
              </motion.div>

              <h2 className="text-4xl font-bold text-white mb-3">Lesson Complete!</h2>
              <p className="text-2xl text-emerald-100 mb-8">
                +{xpEarned} XP Earned
              </p>

              <div className="bg-white/10 rounded-xl p-6 mb-8 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-4">Quiz Results</h3>
                <div className="text-emerald-100">
                  {Object.values(quizResults).filter(Boolean).length} /{' '}
                  {lesson.checkUnderstanding.length} correct
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => window.location.reload()}
                  size="lg"
                  className="flex-1 bg-white text-emerald-600 hover:bg-emerald-50"
                >
                  Review Lesson
                </Button>
                <Button
                  onClick={() => {
                    /* Navigate to next lesson */
                  }}
                  size="lg"
                  className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white"
                >
                  Next Lesson <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function to format markdown (basic)
function formatMarkdown(content: string): string {
  return content
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-2">$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong class="text-purple-400">$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n/gim, '<br />');
}
