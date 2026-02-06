import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Loader, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { QuizResults } from './PlacementQuiz';
import { assignFirstQuestFromQuiz } from '../../lib/quest-assignment-service';
import { toast } from 'sonner';
import ParentalConsentFlow from '../legal/ParentalConsentFlow';
import TierSelection from './TierSelection';
import { isAgeEligible } from '../../lib/privacy-compliance';
import { SkillTier } from '../../lib/tier-system';
import { supabase } from '../../lib/supabase/client';

interface CreateAccountFromQuizProps {
  quizResults: QuizResults;
  onSuccess: (userId: string) => void;
  onCancel: () => void;
}

export default function CreateAccountFromQuiz({
  quizResults,
  onSuccess,
  onCancel
}: CreateAccountFromQuizProps) {
  const [step, setStep] = useState<'tier-selection' | 'consent' | 'password' | 'creating'>('tier-selection');
  const [selectedTier, setSelectedTier] = useState<SkillTier | null>(null);
  const [consentId, setConsentId] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check age eligibility
  const ageEligible = isAgeEligible(quizResults.childDateOfBirth);

  const handleTierConfirm = (tier: SkillTier) => {
    console.log('✅ Tier selected:', tier);
    setSelectedTier(tier);
    setStep('consent');
    toast.success(`Great! Starting with ${tier} tier.`);
  };

  const handleConsentComplete = (id: string) => {
    console.log('✅ Consent recorded:', id);
    setConsentId(id);
    setStep('password');
    toast.success('Thank you! Now let\'s create your account.');
  };

  const handleCreateAccount = async () => {
    // Validation
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsCreating(true);

    try {
      // 1. Create Firebase user account
      const { data, error } = await supabase.auth.signUp({
        email: quizResults.parentEmail,
        password: password
      });
      
      if (error) {
        throw error;
      }

      const userId = data.user?.id;
      console.log('✅ User account created:', userId);

      // 2. Auto-assign first quest based on quiz results
      console.log('🎯 Assigning first quest...');
      const firstQuest = await assignFirstQuestFromQuiz(userId, {
        estimatedGrade: quizResults.estimatedGrade,
        subject: quizResults.subject,
        competencyMastery: [], // Will be generated from quiz answers
      });

      console.log('✅ First quest assigned:', firstQuest.questTitle);

      // 3. Show success animation
      setShowSuccess(true);
      toast.success('🎉 Account created! Your first quest awaits!');

      // 4. Navigate to dashboard after animation
      setTimeout(() => {
        onSuccess(userId);
      }, 2000);

    } catch (error: any) {
      console.error('Error creating account:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Please log in instead.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else {
        toast.error('Failed to create account. Please try again.');
      }
      
      setIsCreating(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-6"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold mb-4">
            🎉 Welcome, {quizResults.childName}!
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Your account is ready and your first quest has been assigned!
          </p>
          <div className="flex items-center justify-center gap-2 text-purple-600">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-semibold">Entering the Kingdom...</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  // STEP 1: Tier Selection
  if (step === 'tier-selection') {
    return (
      <TierSelection
        recommendation={quizResults.tierRecommendation}
        childAge={quizResults.childAge}
        childName={quizResults.childName}
        onConfirm={handleTierConfirm}
        onBack={onCancel}
      />
    );
  }

  // STEP 2: Consent Flow
  if (step === 'consent') {
    return (
      <ParentalConsentFlow
        studentName={quizResults.childName}
        studentDateOfBirth={quizResults.childDateOfBirth}
        parentName={quizResults.parentName}
        parentEmail={quizResults.parentEmail}
        parentId={`parent-${Date.now()}`} // Temporary ID
        studentId={`student-${Date.now()}`} // Temporary ID
        onConsentComplete={handleConsentComplete}
        onCancel={onCancel}
      />
    );
  }

  // STEP 3: Password Creation
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              🚀 Create Your Account
            </h1>
            <p className="text-xl text-gray-600">
              Just one more step to start your learning adventure!
            </p>
          </div>

          {/* Student Info Display */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-purple-700 font-semibold mb-1">STUDENT NAME</p>
                <p className="text-lg font-bold text-purple-900">{quizResults.childName}</p>
              </div>
              <div>
                <p className="text-sm text-purple-700 font-semibold mb-1">EMAIL</p>
                <p className="text-lg font-bold text-purple-900">{quizResults.parentEmail}</p>
              </div>
              <div>
                <p className="text-sm text-purple-700 font-semibold mb-1">LEVEL</p>
                <p className="text-lg font-bold text-purple-900">
                  {quizResults.estimatedGrade === 'K' ? 'Kindergarten' : `Grade ${quizResults.estimatedGrade}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-purple-700 font-semibold mb-1">SUBJECT</p>
                <p className="text-lg font-bold text-purple-900 capitalize">{quizResults.subject}</p>
              </div>
            </div>
          </div>

          {/* Password Fields */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Create Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="h-12 text-lg border-2 border-purple-200 focus:border-purple-500"
                disabled={isCreating}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="h-12 text-lg border-2 border-purple-200 focus:border-purple-500"
                disabled={isCreating}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateAccount();
                  }
                }}
              />
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-600" />
              What Happens Next?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <span className="text-gray-700">Your account will be created instantly</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <span className="text-gray-700">
                  We'll automatically assign your first quest based on your quiz results
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <span className="text-gray-700">You'll enter your personalized dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  4
                </div>
                <span className="text-gray-700">Start earning XP and leveling up immediately!</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isCreating}
              className="flex-1 h-14 text-lg border-2 border-gray-300"
            >
              Back to Results
            </Button>
            <Button
              onClick={handleCreateAccount}
              disabled={isCreating || !password || !confirmPassword}
              className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              {isCreating ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Create Account & Start!
                </>
              )}
            </Button>
          </div>

          {/* Terms */}
          <p className="text-center text-sm text-gray-500 mt-6">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}