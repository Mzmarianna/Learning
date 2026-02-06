/**
 * Placement Quiz Page
 * Free adaptive quiz to determine student's skill tier
 * PUBLIC - no login required!
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Check, X, Clock, Target, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import {
  startPlacementQuiz,
  getAdaptiveQuestions,
  submitAnswer,
  type QuizQuestion,
  type QuizAnswer,
} from '../lib/quiz/placement-quiz';

type QuizStep = 'intro' | 'info' | 'quiz' | 'loading';

export default function PlacementQuizPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Quiz state
  const [step, setStep] = useState<QuizStep>('intro');
  const [attemptId, setAttemptId] = useState('');
  
  // Student info
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState<number>(8);
  const [studentInterests, setStudentInterests] = useState<string[]>([]);
  const [parentEmail, setParentEmail] = useState('');
  
  // Quiz progress
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [startTime, setStartTime] = useState(Date.now());
  
  // Get age from URL if provided (for age-gated UI)
  useEffect(() => {
    const ageParam = searchParams.get('age');
    if (ageParam) {
      const age = parseInt(ageParam);
      if (!isNaN(age) && age >= 4 && age <= 18) {
        setStudentAge(age);
      }
    }
  }, [searchParams]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / Math.min(questions.length, 12)) * 100 : 0;

  // Start quiz
  const handleStartQuiz = async () => {
    if (!studentName || !studentAge) return;

    const { attemptId: id, error } = await startPlacementQuiz(
      studentName,
      studentAge,
      studentInterests,
      parentEmail
    );

    if (error) {
      alert('Error starting quiz: ' + error);
      return;
    }

    setAttemptId(id);
    setStep('quiz');
    
    // Load first set of questions
    const initialQuestions = await getAdaptiveQuestions(studentAge, []);
    setQuestions(initialQuestions);
    setStartTime(Date.now());
  };

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const timeSeconds = Math.floor((Date.now() - startTime) / 1000);

    const result = await submitAnswer(
      attemptId,
      currentQuestion.id,
      selectedAnswer,
      timeSeconds
    );

    setFeedback(result);
    setShowFeedback(true);

    // Add to answers
    const newAnswer: QuizAnswer = {
      question_id: currentQuestion.id,
      answer: selectedAnswer,
      correct: result.correct,
      time_seconds: timeSeconds,
    };
    setAnswers([...answers, newAnswer]);
  };

  // Next question
  const handleNextQuestion = async () => {
    setShowFeedback(false);
    setFeedback(null);
    setSelectedAnswer(null);
    setStartTime(Date.now());

    // Check if quiz is complete (12 questions total)
    if (answers.length >= 11) {
      navigate(`/placement-results/${attemptId}`);
      return;
    }

    // Move to next question or load more
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Load more adaptive questions
      setStep('loading');
      const newQuestions = await getAdaptiveQuestions(studentAge, answers);
      setQuestions([...questions, ...newQuestions]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setStep('quiz');
    }
  };

  // Interest selection
  const allInterests = [
    'Minecraft', 'Roblox', 'Art', 'Animals', 'Science', 'Music',
    'Sports', 'Reading', 'Math', 'Building', 'Gaming', 'Nature'
  ];

  const toggleInterest = (interest: string) => {
    if (studentInterests.includes(interest)) {
      setStudentInterests(studentInterests.filter(i => i !== interest));
    } else if (studentInterests.length < 5) {
      setStudentInterests([...studentInterests, interest]);
    }
  };

  // Age-appropriate UI colors
  const bgColor = studentAge < 8 
    ? 'from-purple-100 via-pink-100 to-orange-100'
    : studentAge < 11
    ? 'from-teal-100 via-cyan-100 to-blue-100'
    : 'from-slate-100 via-gray-100 to-zinc-100';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgColor} flex items-center justify-center p-4`}>
      <div className="max-w-3xl w-full">
        <AnimatePresence mode="wait">
          {/* INTRO STEP */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-6"
                >
                  <Brain className="w-12 h-12 text-white" />
                </motion.div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Free Placement Quiz
                </h1>
                <p className="text-xl text-gray-700 mb-6">
                  Let's discover your child's perfect learning tier! This quick quiz adapts to their skill level.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                    <Clock className="w-8 h-8 text-purple-600 mb-2" />
                    <div className="font-bold text-gray-900">10-15 Minutes</div>
                    <div className="text-sm text-gray-600">Quick & fun</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-teal-50 rounded-lg">
                    <Target className="w-8 h-8 text-teal-600 mb-2" />
                    <div className="font-bold text-gray-900">Adaptive</div>
                    <div className="text-sm text-gray-600">Adjusts to skill</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-pink-50 rounded-lg">
                    <Sparkles className="w-8 h-8 text-pink-600 mb-2" />
                    <div className="font-bold text-gray-900">100% Free</div>
                    <div className="text-sm text-gray-600">No credit card</div>
                  </div>
                </div>

                <Button
                  onClick={() => setStep('info')}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Let's Start! <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            </motion.div>
          )}

          {/* INFO STEP */}
          {step === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Tell us about your learner
                </h2>

                <div className="space-y-6">
                  {/* Student Name */}
                  <div>
                    <label className="block font-bold text-gray-900 mb-2">
                      What's your child's name?
                    </label>
                    <Input
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Enter first name"
                      className="text-lg"
                    />
                  </div>

                  {/* Student Age */}
                  <div>
                    <label className="block font-bold text-gray-900 mb-2">
                      How old are they?
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(age => (
                        <Button
                          key={age}
                          onClick={() => setStudentAge(age)}
                          variant={studentAge === age ? 'default' : 'outline'}
                          className={studentAge === age ? 'bg-purple-600' : ''}
                        >
                          {age}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block font-bold text-gray-900 mb-2">
                      What do they love? (Pick up to 5)
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {allInterests.map(interest => (
                        <Button
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          variant={studentInterests.includes(interest) ? 'default' : 'outline'}
                          className={studentInterests.includes(interest) ? 'bg-teal-600' : ''}
                          size="sm"
                        >
                          {studentInterests.includes(interest) && <Check className="w-4 h-4 mr-1" />}
                          {interest}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {studentInterests.length}/5 selected
                    </p>
                  </div>

                  {/* Parent Email (Optional) */}
                  <div>
                    <label className="block font-bold text-gray-900 mb-2">
                      Your email (optional - for results)
                    </label>
                    <Input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="parent@example.com"
                    />
                  </div>

                  <Button
                    onClick={handleStartQuiz}
                    disabled={!studentName || studentInterests.length === 0}
                    size="lg"
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                  >
                    Start Quiz <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* QUIZ STEP */}
          {step === 'quiz' && currentQuestion && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-8">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Question {currentQuestionIndex + 1} of 12</span>
                    <span>{Math.round(progress)}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Question Type Badge */}
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                    currentQuestion.question_type === 'reading' ? 'bg-purple-100 text-purple-700' :
                    currentQuestion.question_type === 'math' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {currentQuestion.question_type === 'reading' ? '📚 Reading' :
                     currentQuestion.question_type === 'math' ? '🔢 Math' :
                     '🧠 Critical Thinking'}
                  </span>
                </div>

                {/* Question Text */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {currentQuestion.question_text}
                </h2>

                {/* Answer Options */}
                {!showFeedback ? (
                  <div className="space-y-3 mb-6">
                    {currentQuestion.options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedAnswer(index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          selectedAnswer === index
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-300 bg-white hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            selectedAnswer === index
                              ? 'border-purple-600 bg-purple-600 text-white'
                              : 'border-gray-300'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="font-medium text-gray-900">{option}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  /* Feedback */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-lg mb-6 ${
                      feedback?.correct ? 'bg-green-50 border-2 border-green-300' : 'bg-orange-50 border-2 border-orange-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {feedback?.correct ? (
                        <Check className="w-8 h-8 text-green-600 flex-shrink-0" />
                      ) : (
                        <X className="w-8 h-8 text-orange-600 flex-shrink-0" />
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl mb-2">
                          {feedback?.correct ? 'Great job!' : 'Not quite!'}
                        </h3>
                        <p className="text-gray-700">{feedback?.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Button */}
                {!showFeedback ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    size="lg"
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                  >
                    {answers.length >= 11 ? 'See Results' : 'Next Question'} <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </Card>
            </motion.div>
          )}

          {/* LOADING STEP */}
          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="p-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="inline-block mb-4"
                >
                  <Brain className="w-16 h-16 text-purple-600" />
                </motion.div>
                <p className="text-xl text-gray-700">Adapting to {studentName}'s level...</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}