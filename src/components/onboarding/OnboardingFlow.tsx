import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle, Sparkles, Award, BookOpen, Code, Palette, Brain, Zap } from 'lucide-react';
import AvatarCustomizer from '../student/AvatarCustomizer';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import wowlIntro from '../../assets/d793d71f8bba9c420a59bd904e5c55a30b6f73a3.png';

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
}

interface OnboardingData {
  avatarData: any;
  selectedSubjects: string[];
  learningGoals: string[];
  studentName: string;
}

const SUBJECTS = [
  {
    id: 'roblox-math',
    name: 'Roblox Math',
    icon: '🎮',
    color: 'from-cyan-500 to-blue-600',
    description: 'Earn Robux while mastering math',
  },
  {
    id: 'reading',
    name: 'Reading',
    icon: '📚',
    color: 'from-purple-500 to-purple-600',
    description: 'Build confidence & comprehension',
  },
  {
    id: 'writing',
    name: 'Writing',
    icon: '✍️',
    color: 'from-pink-500 to-pink-600',
    description: 'Express yourself with ease',
  },
  {
    id: 'steam',
    name: 'STEAM',
    icon: '🔬',
    color: 'from-amber-500 to-orange-600',
    description: 'Build, code, create',
  },
  {
    id: 'executive-function',
    name: 'Life Skills',
    icon: '🧠',
    color: 'from-teal-500 to-teal-600',
    description: 'Organization & planning',
  },
  {
    id: 'coding',
    name: 'Coding',
    icon: '💻',
    color: 'from-green-500 to-green-600',
    description: 'Real programming skills',
  },
];

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [studentName, setStudentName] = useState('');
  const [avatarData, setAvatarData] = useState<any>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleSubjectToggle = (subjectId: string) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  const handleComplete = () => {
    onComplete({
      avatarData,
      selectedSubjects,
      learningGoals: [],
      studentName,
    });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const canProceed = () => {
    if (step === 1) return studentName.trim().length > 0 && avatarData;
    if (step === 2) return selectedSubjects.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-300 to-purple-300 rounded-full opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 50 - 25, 0],
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="max-w-5xl w-full relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl mb-2">
            <span className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to Learning Kingdom
            </span>
          </h1>
          <p className="text-xl text-gray-600">Personalized Onboarding Experience</p>
          <p className="text-sm text-gray-500 mt-2">
            Setup takes 3 minutes. Learning starts immediately.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-full p-2 shadow-lg mb-8 max-w-md mx-auto"
        >
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-sm font-semibold text-gray-700">Step {step} of {totalSteps}</span>
            <span className="text-xs text-gray-500">
              {step === 1 && 'Create Your Avatar'}
              {step === 2 && 'Choose Your Subjects'}
              {step === 3 && 'Your Learning Path'}
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div
          layout
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-purple-100"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Avatar Creation */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {/* Wowl Welcome */}
                <div className="flex justify-center mb-6">
                  <motion.img 
                    src={wowlIntro}
                    alt="Hi! I'm Wowl the Owl"
                    className="w-64 h-auto object-contain"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  />
                </div>

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl mb-2">Create Your Avatar</h2>
                  <p className="text-gray-600 text-lg">
                    Design your learning companion! Choose your style.
                  </p>
                </div>

                {/* Name Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What should we call you?
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>

                {/* Avatar Preview or Customization Trigger */}
                {!showAvatarCustomization ? (
                  <div className="bg-gradient-to-br from-cyan-50 to-purple-50 rounded-2xl p-8 text-center border-2 border-purple-200">
                    <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      {avatarData?.avatar ? (
                        <span className="text-6xl">{avatarData.avatar === 'unicorn' ? '🦄' : avatarData.avatar === 'horse' ? '🐴' : '🐔'}</span>
                      ) : (
                        <span className="text-6xl">👤</span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowAvatarCustomization(true)}
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2"
                    >
                      <Palette className="w-5 h-5" />
                      {avatarData ? 'Change Your Avatar' : 'Customize Your Avatar'}
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-purple-200 rounded-2xl p-4 bg-gradient-to-br from-cyan-50 to-purple-50">
                    <AvatarCustomizer
                      currentXP={0}
                      selectedAvatar={avatarData?.avatar || 'unicorn'}
                      avatarName={avatarData?.name || studentName}
                      onSelectAvatar={(avatarId) => {
                        setAvatarData({ ...avatarData, avatar: avatarId });
                      }}
                      onNameAvatar={(name) => {
                        setAvatarData({ ...avatarData, name });
                      }}
                      onClose={() => {
                        // Make sure we have at least basic avatar data
                        if (!avatarData) {
                          setAvatarData({ avatar: 'unicorn', name: studentName });
                        }
                        setShowAvatarCustomization(false);
                      }}
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Subject Selection */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl mb-2">Choose Your Subjects</h2>
                  <p className="text-gray-600 text-lg">
                    Select the subjects you want to explore (pick at least one)
                  </p>
                </div>

                {/* Visual Guide for Subjects */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-300 rounded-xl p-4 text-center">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1593791784695-8f7dc5472703?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGNvbG9yZnVsJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzY4MjQ5ODMyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Books for learning"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <p className="text-sm font-semibold text-purple-900">📚 Core Skills</p>
                    <p className="text-xs text-purple-700">Reading, Writing, Math</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 border-2 border-cyan-300 rounded-xl p-4 text-center">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1712390978993-faa4edb44d48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwY29udHJvbGxlciUyMHBsYXlmdWx8ZW58MXx8fHwxNzY4MjQ5ODMyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Fun learning through games"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <p className="text-sm font-semibold text-cyan-900">🎮 Fun Learning</p>
                    <p className="text-xs text-cyan-700">STEAM, Coding, Gaming</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-100 to-pink-50 border-2 border-pink-300 rounded-xl p-4 text-center">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1762345127396-ac4a970436c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waHklMjBhY2hpZXZlbWVudCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzY4MjI5NzQwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Achievement and success"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <p className="text-sm font-semibold text-pink-900">🌟 Life Skills</p>
                    <p className="text-xs text-pink-700">Organization & Planning</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {SUBJECTS.map((subject, index) => {
                    const isSelected = selectedSubjects.includes(subject.id);
                    return (
                      <motion.button
                        key={subject.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSubjectToggle(subject.id)}
                        className={`relative rounded-2xl p-6 text-center transition-all border-2 ${
                          isSelected
                            ? 'border-purple-500 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50'
                            : 'border-gray-200 hover:border-purple-300 bg-white'
                        }`}
                      >
                        {/* Selection Checkmark */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-1"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </motion.div>
                        )}

                        {/* Icon */}
                        <div
                          className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-3xl shadow-lg`}
                        >
                          {subject.icon}
                        </div>

                        {/* Name */}
                        <h3 className="font-semibold text-gray-800 mb-1">{subject.name}</h3>
                        <p className="text-xs text-gray-500">{subject.description}</p>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Selected Count */}
                {selectedSubjects.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-200"
                  >
                    <p className="text-purple-700 font-semibold">
                      ✨ {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''} selected
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 3: Learning Path Preview */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl mb-2">Your Learning Path</h2>
                  <p className="text-gray-600 text-lg">
                    Here's what your adventure looks like!
                  </p>
                </div>

                {/* Path Preview */}
                <div className="bg-gradient-to-b from-cyan-50 via-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
                  {/* Avatar + Name */}
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                      <span className="text-5xl">👤</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800">{studentName || 'Student'}</h3>
                    <p className="text-gray-600">Level 1 Explorer</p>
                  </div>

                  {/* Quest Map Preview */}
                  <div className="space-y-4 max-w-md mx-auto">
                    {selectedSubjects.map((subjectId, index) => {
                      const subject = SUBJECTS.find(s => s.id === subjectId);
                      if (!subject) return null;

                      return (
                        <motion.div
                          key={subjectId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-xl p-4 shadow-lg border border-purple-200 flex items-center gap-4"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl shadow`}>
                            {subject.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{subject.name}</h4>
                            <p className="text-sm text-gray-500">Quest 1 ready!</p>
                          </div>
                          <div className="bg-cyan-100 rounded-full px-3 py-1">
                            <span className="text-sm font-semibold text-cyan-700">Start</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* XP Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 grid grid-cols-3 gap-4"
                  >
                    <div className="bg-white rounded-xl p-4 text-center border border-cyan-200">
                      <Zap className="w-6 h-6 text-cyan-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-cyan-600">0 XP</div>
                      <div className="text-xs text-gray-500">Ready to earn!</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-purple-200">
                      <Award className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-purple-600">0</div>
                      <div className="text-xs text-gray-500">Badges</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-pink-200">
                      <Sparkles className="w-6 h-6 text-pink-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-pink-600">0</div>
                      <div className="text-xs text-gray-500">Robux</div>
                    </div>
                  </motion.div>
                </div>

                {/* Ready Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 text-center"
                >
                  <p className="text-lg text-gray-700">
                    You're all set! Let's start your adventure! 🚀
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
            {/* Back Button */}
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:border-purple-400 transition-colors"
              >
                Back
              </button>
            )}

            {/* Skip for now */}
            {step === 1 && onSkip && (
              <button
                onClick={onSkip}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Skip for now
              </button>
            )}

            <div className="flex-1" />

            {/* Next/Complete Button */}
            <motion.button
              whileHover={{ scale: canProceed() ? 1.05 : 1 }}
              whileTap={{ scale: canProceed() ? 0.95 : 1 }}
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-xl inline-flex items-center gap-2 transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {step === totalSteps ? (
                <>
                  <span>Let's Go and Play!</span>
                  <Sparkles className="w-5 h-5" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}