import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, ArrowRight, Target, Zap, TrendingUp, Award, X, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { User } from '../../lib/types';
import { 
  getRobuxBalance, 
  getEncouragementForLowBalance,
  calculateRobuxFromXP,
  MIN_REDEMPTION 
} from '../../lib/robux-rewards';
import { generateInquiryProject, inquiryToProject } from '../../lib/curriculum-project-mapper';
import { getStudentCompetencies } from '../../lib/adaptive-learning';
import { speakAsWowl, stopWowlSpeaking } from '../../lib/wowl-voice';

interface WowlInstructorProps {
  user: User;
  currentSubject?: 'math' | 'reading' | 'writing' | 'spelling';
  onStartQuest?: () => void;
  onStartProject?: () => void;
  onDismiss?: () => void;
}

type InstructionStep = 'welcome' | 'system' | 'robux' | 'project-offer' | 'dismissed';

export default function WowlInstructor({ user, currentSubject, onStartQuest, onStartProject, onDismiss }: WowlInstructorProps) {
  const [step, setStep] = useState<InstructionStep>('welcome');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSeenInstructions, setHasSeenInstructions] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(`wowl-instructions-${user.uid}`);
    if (seen) {
      setHasSeenInstructions(true);
      setStep('dismissed');
    }
  }, [user.uid]);

  const handleNextStep = () => {
    if (step === 'welcome') {
      setStep('system');
      speakAsWowl(
        'Here\'s how the system works. You complete challenges to build skills and earn XP.',
        'teaching',
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    } else if (step === 'system') {
      setStep('robux');
      speakAsWowl(
        'Your XP converts directly to Robux. Hit 800 and you can redeem for real currency.',
        'excited',
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    } else if (step === 'robux') {
      setStep('project-offer');
      speakAsWowl(
        'Based on your skills, I have a project for you to work on. It will help you grow and earn more XP.',
        'friendly',
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    } else if (step === 'project-offer') {
      markAsComplete();
    }
  };

  const markAsComplete = () => {
    localStorage.setItem(`wowl-instructions-${user.uid}`, 'true');
    setStep('dismissed');
    stopWowlSpeaking();
    if (onDismiss) onDismiss();
  };

  const robuxBalance = getRobuxBalance(user.uid);
  const totalXP = user.totalXP || 0;
  const robuxFromXP = calculateRobuxFromXP(totalXP);

  if (step === 'dismissed' && hasSeenInstructions) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 mb-6 shadow-2xl relative overflow-hidden border border-purple-500/30"
      >
        {/* Glowing accent lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />

        {/* Close Button */}
        {hasSeenInstructions && (
          <button
            onClick={markAsComplete}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 flex items-center justify-center transition-colors z-10 border border-slate-700"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        )}

        <div className="relative z-10">
          <div className="flex items-start gap-6">
            {/* Wowl AI Avatar */}
            <motion.div
              animate={{
                scale: isSpeaking ? [1, 1.02, 1] : 1,
              }}
              transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
              className="relative flex-shrink-0"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-[2px]">
                <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                  {/* Replace with actual Wowl image */}
                  <div className="text-5xl">🦉</div>
                  {/* <img src="/wowl.png" alt="Wowl AI" className="w-full h-full object-contain rounded-2xl" /> */}
                </div>
              </div>

              {/* AI Indicator */}
              <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border border-purple-400">
                <Zap className="w-3 h-3" />
                AI
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {/* STEP 1: WELCOME */}
                {step === 'welcome' && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-3xl font-bold text-white">
                        I'm Wowl
                      </h2>
                      <span className="text-slate-400 text-lg">Your AI learning companion</span>
                    </div>
                    
                    <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                      I adapt to your learning style, track your progress, and help you master skills at your own pace. 
                      This platform is built for people who learn differently.
                    </p>

                    <Button
                      onClick={handleNextStep}
                      size="lg"
                      className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-lg px-8 py-6 rounded-xl"
                    >
                      Show Me How It Works <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {/* STEP 2: SYSTEM */}
                {step === 'system' && (
                  <motion.div
                    key="system"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">
                      The System
                    </h2>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {/* Card 1 */}
                      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 border border-cyan-500/30 hover:border-cyan-500/60 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-4">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Complete Challenges</h3>
                        <p className="text-sm text-slate-400">
                          Work through adaptive challenges that match your skill level
                        </p>
                      </div>

                      {/* Card 2 */}
                      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 border border-purple-500/30 hover:border-purple-500/60 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Earn XP</h3>
                        <p className="text-sm text-slate-400">
                          Experience points track your progress and unlock rewards
                        </p>
                      </div>

                      {/* Card 3 */}
                      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 border border-pink-500/30 hover:border-pink-500/60 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Build Mastery</h3>
                        <p className="text-sm text-slate-400">
                          Skills are tracked individually—master one, move to the next
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 mb-6">
                      <p className="text-slate-300 text-sm">
                        <span className="text-cyan-400 font-semibold">Note:</span> Your XP never decreases. 
                        This system is designed for progress, not punishment. Take risks, make mistakes, learn.
                      </p>
                    </div>

                    <Button
                      onClick={handleNextStep}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg px-8 py-6 rounded-xl w-full"
                    >
                      What About Rewards? <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {/* STEP 3: ROBUX */}
                {step === 'robux' && (
                  <motion.div
                    key="robux"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">
                      The Reward System
                    </h2>

                    {/* Conversion Display */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-center gap-8 mb-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-white mb-1">1 XP</div>
                          <div className="text-emerald-200 text-sm">Experience Point</div>
                        </div>
                        <div className="text-3xl text-white">=</div>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-white mb-1">1 Robux</div>
                          <div className="text-emerald-200 text-sm">Redeemable Currency</div>
                        </div>
                      </div>
                      <div className="text-center text-white text-sm bg-black/20 rounded-lg py-2 px-4">
                        Reach 800 Robux → Redeem for real Roblox currency
                      </div>
                    </div>

                    {/* Current Balance */}
                    <div className="bg-slate-800/60 border border-emerald-500/30 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-400">Your Balance</span>
                        <span className="text-2xl font-bold text-emerald-400">{robuxFromXP} Robux</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((robuxFromXP / MIN_REDEMPTION) * 100, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500">0</span>
                        <span className="text-xs text-slate-500">800 (minimum)</span>
                      </div>

                      {robuxFromXP < MIN_REDEMPTION && (
                        <div className="mt-4 text-center">
                          <p className="text-sm text-slate-400">
                            {MIN_REDEMPTION - robuxFromXP} more to redeem
                          </p>
                        </div>
                      )}

                      {robuxFromXP >= MIN_REDEMPTION && (
                        <div className="mt-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-3 text-center">
                          <p className="text-emerald-300 font-semibold">
                            Redemption available—check with your parent
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleNextStep}
                      size="lg"
                      className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:opacity-90 text-white text-lg px-8 py-6 rounded-xl w-full"
                    >
                      Get Started <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {/* STEP 4: PROJECT OFFER */}
                {step === 'project-offer' && (
                  <motion.div
                    key="project-offer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Project Offer
                    </h2>

                    <div className="bg-slate-800/60 border border-emerald-500/30 rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-400">Based on your skills, I have a project for you:</span>
                        <span className="text-2xl font-bold text-emerald-400">Inquiry Project</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((robuxFromXP / MIN_REDEMPTION) * 100, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500">0</span>
                        <span className="text-xs text-slate-500">800 (minimum)</span>
                      </div>

                      {robuxFromXP < MIN_REDEMPTION && (
                        <div className="mt-4 text-center">
                          <p className="text-sm text-slate-400">
                            {MIN_REDEMPTION - robuxFromXP} more to redeem
                          </p>
                        </div>
                      )}

                      {robuxFromXP >= MIN_REDEMPTION && (
                        <div className="mt-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-3 text-center">
                          <p className="text-emerald-300 font-semibold">
                            Redemption available—check with your parent
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => {
                        markAsComplete();
                        if (onStartProject) onStartProject();
                      }}
                      size="lg"
                      className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:opacity-90 text-white text-lg px-8 py-6 rounded-xl w-full"
                    >
                      Start Project <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Progress Indicators */}
          {step !== 'dismissed' && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {['welcome', 'system', 'robux', 'project-offer'].map((s, idx) => (
                <button
                  key={s}
                  onClick={() => setStep(s as InstructionStep)}
                  className={`h-1 rounded-full transition-all ${
                    step === s
                      ? 'bg-purple-500 w-12'
                      : 'bg-slate-700 w-8 hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}