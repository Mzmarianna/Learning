import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Mic, Check, X, ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  Competency, 
  AssessmentQuestion, 
  getCompetenciesForGrade, 
  GradeLevel,
  Subject 
} from '../../lib/learning-standards';
import { SkillTier, recommendTier, TierRecommendation } from '../../lib/tier-system';

interface PlacementQuizProps {
  onComplete: (results: QuizResults) => void;
  onBack: () => void;
}

export interface QuizResults {
  // Parent info (for consent)
  parentName: string;
  parentEmail: string;
  
  // Student info
  childName: string;
  childDateOfBirth: Date; // For age verification
  childAge: number;
  
  // Quiz results
  estimatedGrade: GradeLevel;
  subject: Subject;
  score: number;
  strengths: string[];
  areasForGrowth: string[];
  answers: QuestionAnswer[];
  completedAt: Date;
  
  // Tier recommendation (NEW!)
  tierRecommendation: TierRecommendation;
}

interface QuestionAnswer {
  questionId: string;
  correct: boolean;
  timeSpent: number;
}

export default function PlacementQuiz({ onComplete, onBack }: PlacementQuizProps) {
  // Step state
  const [step, setStep] = useState<'intro' | 'info' | 'quiz' | 'results'>('intro');
  
  // User info
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [childDateOfBirth, setChildDateOfBirth] = useState('');
  const [childAge, setChildAge] = useState<number>(12); // Default to 12 (target age)
  const [subject, setSubject] = useState<Subject>('reading');
  
  // Quiz state
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  // Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  
  // Refs
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        handleSpeechAnswer(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    // Auto-read question when it changes
    if (step === 'quiz' && autoReadEnabled && questions[currentQuestionIndex]) {
      speakText(questions[currentQuestionIndex].question);
    }
  }, [currentQuestionIndex, step]);

  // ==================== SPEECH FUNCTIONS ====================

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.1; // Slightly higher for child-friendly
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSpeechAnswer = (transcript: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion || !currentQuestion.options) return;

    // Try to match transcript to one of the options
    const matchedOption = currentQuestion.options.find(option =>
      option.toLowerCase().includes(transcript) || 
      transcript.includes(option.toLowerCase())
    );

    if (matchedOption) {
      setSelectedAnswer(matchedOption);
      // Auto-submit after a brief delay
      setTimeout(() => {
        handleSubmitAnswer(matchedOption);
      }, 500);
    } else {
      speakText("I didn't quite catch that. Can you try again?");
    }
  };

  // ==================== QUIZ LOGIC ====================

  const startQuiz = () => {
    // Calculate age from date of birth
    const dob = new Date(childDateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    setChildAge(age);
    
    // Generate adaptive questions based on age
    const estimatedGrade = ageToGrade(age);
    const competencies = getCompetenciesForGrade(estimatedGrade, subject);
    
    // Collect all assessment questions from competencies
    const allQuestions = competencies.flatMap(c => c.assessmentQuestions);
    
    // Select 10-15 questions (adaptive)
    const selectedQuestions = allQuestions.slice(0, 12);
    
    setQuestions(selectedQuestions);
    setStep('quiz');
    setQuestionStartTime(Date.now());
  };

  const handleSubmitAnswer = (answer?: string) => {
    const finalAnswer = answer || selectedAnswer;
    if (!finalAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const timeSpent = Date.now() - questionStartTime;
    const isCorrect = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer.includes(finalAnswer)
      : currentQuestion.correctAnswer === finalAnswer;

    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        correct: isCorrect,
        timeSpent,
      },
    ]);

    // Speak encouragement
    if (isCorrect) {
      const encouragements = [
        'Great job!',
        'You got it!',
        'Awesome!',
        'Perfect!',
        'Well done!',
      ];
      speakText(encouragements[Math.floor(Math.random() * encouragements.length)]);
    } else {
      speakText('Good try! Let\'s keep going.');
    }

    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer('');
        setQuestionStartTime(Date.now());
      }, 1500);
    } else {
      setTimeout(() => {
        finishQuiz();
      }, 1500);
    }
  };

  const finishQuiz = () => {
    const score = (answers.filter(a => a.correct).length / questions.length) * 100;
    const estimatedGrade = calculateGradeLevel(score, childAge);
    
    // Calculate tier recommendation based on quiz performance
    const tierRecommendation = recommendTier({
      estimatedGrade,
      age: childAge,
      quizScore: score,
    });
    
    const results: QuizResults = {
      parentName,
      parentEmail: email,
      childName,
      childDateOfBirth: new Date(childDateOfBirth),
      childAge,
      estimatedGrade,
      subject,
      score: Math.round(score),
      strengths: identifyStrengths(answers, questions),
      areasForGrowth: identifyAreasForGrowth(answers, questions),
      answers,
      completedAt: new Date(),
      tierRecommendation,
    };

    // Save to localStorage (demo mode)
    localStorage.setItem('quizResults', JSON.stringify(results));
    
    setStep('results');
    onComplete(results);
  };

  // ==================== HELPER FUNCTIONS ====================

  const ageToGrade = (age: number): GradeLevel => {
    if (age < 5) return 'PreK';
    if (age === 5) return 'K';
    if (age >= 6 && age <= 18) return String(age - 5) as GradeLevel;
    return '12';
  };

  const calculateGradeLevel = (score: number, age: number): GradeLevel => {
    const baseGrade = ageToGrade(age);
    const grades: GradeLevel[] = ['PreK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const baseIndex = grades.indexOf(baseGrade);

    if (score >= 80 && baseIndex < grades.length - 1) {
      return grades[baseIndex + 1]; // Move up a grade
    } else if (score < 50 && baseIndex > 0) {
      return grades[baseIndex - 1]; // Move down a grade
    }
    return baseGrade;
  };

  const identifyStrengths = (answers: QuestionAnswer[], questions: AssessmentQuestion[]): string[] => {
    const correctAnswers = answers.filter(a => a.correct).map(a => a.questionId);
    const strengthSkills = correctAnswers
      .map(id => questions.find(q => q.id === id))
      .filter(Boolean)
      .map(q => q!.skillLevel);
    
    return ['Quick learner', 'Great focus', 'Excellent memory']; // Simplified
  };

  const identifyAreasForGrowth = (answers: QuestionAnswer[], questions: AssessmentQuestion[]): string[] => {
    const incorrectAnswers = answers.filter(a => !a.correct).map(a => a.questionId);
    const growthSkills = incorrectAnswers
      .map(id => questions.find(q => q.id === id))
      .filter(Boolean)
      .map(q => q!.skillLevel);
    
    return ['Phonics practice', 'Letter recognition']; // Simplified
  };

  const progress = step === 'quiz' 
    ? ((currentQuestionIndex + 1) / questions.length) * 100 
    : 0;

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        {step === 'quiz' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-purple-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-semibold text-purple-600">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* INTRO SCREEN */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-purple-200"
            >
              <div className="text-center">
                <div className="text-8xl mb-6">🦉</div>
                <h1 className="text-4xl font-bold mb-4">
                  Hi! I'm Wowl, your learning buddy!
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Let's take a quick quiz to find out what you know and what we'll learn together!
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {[
                    { icon: '🎤', text: 'I can read questions aloud' },
                    { icon: '👂', text: 'You can answer by speaking' },
                    { icon: '⏱️', text: 'Takes 5-10 minutes' },
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl p-4"
                    >
                      <div className="text-4xl mb-2">{feature.icon}</div>
                      <p className="text-sm font-semibold text-purple-900">{feature.text}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => setStep('info')}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl px-12 py-6"
                >
                  Let's Start! <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* INFO COLLECTION */}
          {step === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-purple-200"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">
                Tell me a bit about your learner!
              </h2>

              <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parent/Guardian Name
                  </label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                    placeholder="Full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Parent/Guardian Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Child's Name
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                    placeholder="First name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Child's Date of Birth
                  </label>
                  <input
                    type="date"
                    value={childDateOfBirth}
                    onChange={(e) => setChildDateOfBirth(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What subject should we focus on?
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['reading', 'math', 'spelling'] as Subject[]).map((subj) => (
                      <button
                        key={subj}
                        onClick={() => setSubject(subj)}
                        className={`py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                          subject === subj
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                        }`}
                      >
                        {subj === 'reading' && '📖'}
                        {subj === 'math' && '🔢'}
                        {subj === 'spelling' && '✏️'}
                        <br />
                        {subj.charAt(0).toUpperCase() + subj.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={onBack}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={startQuiz}
                    disabled={!parentName || !email || !childName || !childDateOfBirth}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  >
                    Start Quiz
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* QUIZ QUESTIONS */}
          {step === 'quiz' && questions[currentQuestionIndex] && (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-purple-200"
            >
              <div className="mb-8">
                {/* Question Text */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-6xl">🦉</div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-4">
                      {questions[currentQuestionIndex].question}
                    </h2>
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="flex gap-3 mb-8">
                  <Button
                    onClick={() => speakText(questions[currentQuestionIndex].question)}
                    variant="outline"
                    size="lg"
                    className="border-2 border-purple-300"
                    disabled={isSpeaking}
                  >
                    {isSpeaking ? (
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Volume2 className="w-5 h-5 mr-2" />
                    )}
                    Read Question
                  </Button>

                  {questions[currentQuestionIndex].type !== 'read-aloud' && (
                    <Button
                      onClick={isListening ? stopListening : startListening}
                      variant="outline"
                      size="lg"
                      className={`border-2 ${
                        isListening
                          ? 'border-red-500 bg-red-50'
                          : 'border-green-500 bg-green-50'
                      }`}
                    >
                      <Mic
                        className={`w-5 h-5 mr-2 ${
                          isListening ? 'animate-pulse text-red-600' : 'text-green-600'
                        }`}
                      />
                      {isListening ? 'Listening...' : 'Speak Answer'}
                    </Button>
                  )}
                </div>

                {/* Answer Options */}
                {questions[currentQuestionIndex].options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {questions[currentQuestionIndex].options!.map((option, idx) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrect =
                        answers.find(a => a.questionId === questions[currentQuestionIndex].id)
                          ?.correct && isSelected;
                      const isWrong =
                        answers.find(a => a.questionId === questions[currentQuestionIndex].id) &&
                        !isCorrect &&
                        isSelected;

                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedAnswer(option)}
                          className={`p-6 rounded-2xl border-4 text-lg font-semibold text-left transition-all ${
                            isSelected
                              ? 'border-purple-500 bg-purple-100'
                              : 'border-purple-200 hover:border-purple-400 bg-white'
                          } ${isCorrect ? 'border-green-500 bg-green-100' : ''} ${
                            isWrong ? 'border-red-500 bg-red-100' : ''
                          }`}
                        >
                          {option}
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={() => handleSubmitAnswer()}
                  disabled={!selectedAnswer}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl py-6"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}