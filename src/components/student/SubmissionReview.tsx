import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, AlertCircle, Sparkles, TrendingUp, Target, Zap, Trophy, PartyPopper } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import ShareAchievement from '../social/ShareAchievement';
import { requestShareApproval, checkShareApproval, hasDefaultSharePermission } from '../../lib/social/parent-approval';
import { 
  MasteryAssessment, 
  MasteryLevel, 
  MASTERY_DEFINITIONS,
  WowlFeedback,
  FeedbackPoint 
} from '../../lib/wowl-mastery-engine';

interface SubmissionReviewProps {
  assessment: MasteryAssessment;
  studentName: string;
  studentId: string;
  challengeTitle: string;
  xpEarned: number;
  onResubmit?: () => void;
  onContinue: () => void;
}

export default function SubmissionReview({
  assessment,
  studentName,
  studentId,
  challengeTitle,
  xpEarned,
  onResubmit,
  onContinue,
}: SubmissionReviewProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const masteryInfo = MASTERY_DEFINITIONS[assessment.overallMastery];
  const canAdvance = assessment.overallMastery === 'proficient' || 
                     assessment.overallMastery === 'advanced' || 
                     assessment.overallMastery === 'mastered';

  // Show confetti animation for high achievements
  useState(() => {
    if (canAdvance) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Wowl Header */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">🦉</div>
          <h1 className="text-3xl font-bold mb-2">Wowl's Review</h1>
          <p className="text-xl text-gray-600">{challengeTitle}</p>
        </motion.div>

        {/* Mastery Level Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`p-8 border-4 ${
            assessment.overallMastery === 'mastered' ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50' :
            assessment.overallMastery === 'advanced' ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50' :
            assessment.overallMastery === 'proficient' ? 'border-green-500 bg-gradient-to-br from-green-50 to-cyan-50' :
            assessment.overallMastery === 'developing' ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50' :
            'border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{masteryInfo.icon}</div>
                <div>
                  <h2 className={`text-3xl font-bold ${masteryInfo.color}`}>
                    {masteryInfo.label}
                  </h2>
                  <p className="text-lg text-gray-700">{masteryInfo.description}</p>
                </div>
              </div>
              
              {canAdvance && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
              )}
            </div>

            {/* XP Multiplier */}
            <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">XP Multiplier:</span>
                <span className="text-2xl font-bold text-purple-600">
                  {masteryInfo.xpMultiplier}x
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Wowl's Feedback */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8 border-4 border-cyan-200 bg-white">
            {/* Opening */}
            <div className="mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-4xl">🦉</div>
                <div className="flex-1">
                  <p className="text-xl font-semibold text-gray-900">
                    {assessment.feedback.opening}
                  </p>
                </div>
              </div>
            </div>

            {/* Celebrations */}
            {assessment.feedback.celebrations.length > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  What Went Well
                </h3>
                <ul className="space-y-2">
                  {assessment.feedback.celebrations.map((celebration, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-green-800">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />
                      <span>{celebration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Detailed Feedback */}
            <div className="mb-6">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between p-4 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <span className="font-semibold text-purple-900">
                  {showDetails ? 'Hide' : 'Show'} Detailed Feedback
                </span>
                <motion.div
                  animate={{ rotate: showDetails ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="w-5 h-5 text-purple-600 transform rotate-90" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-4">
                      {assessment.feedback.mainPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white border-2 border-gray-200 rounded-xl"
                        >
                          <h4 className="font-bold text-gray-900 mb-2">
                            {point.criterion}
                          </h4>
                          <p className="text-gray-700 mb-2">{point.observation}</p>
                          
                          {point.strength && (
                            <div className="flex items-start gap-2 text-green-700 text-sm mb-2">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{point.strength}</span>
                            </div>
                          )}
                          
                          {point.improvement && (
                            <div className="flex items-start gap-2 text-blue-700 text-sm">
                              <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{point.improvement}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Guidance */}
            {assessment.feedback.guidance.length > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Next Steps
                </h3>
                <ul className="space-y-2">
                  {assessment.feedback.guidance.map((guide, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-blue-800">
                      <ArrowRight className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                      <span>{guide}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Closing */}
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">
                {assessment.feedback.closing}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Strengths & Growth Areas */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Strengths */}
          {assessment.strengthsIdentified.length > 0 && (
            <Card className="p-6 border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
              <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Your Strengths
              </h3>
              <ul className="space-y-2">
                {assessment.strengthsIdentified.map((strength, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Growth Areas */}
          {assessment.growthAreas.length > 0 && (
            <Card className="p-6 border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Growth Opportunities
              </h3>
              <ul className="space-y-2">
                {assessment.growthAreas.map((area, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-blue-800">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </motion.div>

        {/* Resubmission Option */}
        {assessment.allowResubmission && onResubmit && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6 border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🎯</div>
                <div className="flex-1">
                  <h3 className="font-bold text-purple-900 mb-2">
                    Want to Level Up?
                  </h3>
                  <p className="text-purple-800 mb-4">
                    {assessment.resubmissionPrompt}
                  </p>
                  {assessment.targetMasteryLevel && (
                    <div className="flex items-center gap-2 text-sm text-purple-700 mb-4">
                      <span>Target:</span>
                      <span className="font-bold">
                        {MASTERY_DEFINITIONS[assessment.targetMasteryLevel].label}
                      </span>
                      <span className="text-2xl">
                        {MASTERY_DEFINITIONS[assessment.targetMasteryLevel].icon}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="space-y-4"
        >
          {/* Share Achievement Button (only show for high mastery) */}
          {canAdvance && (
            <div className="flex justify-center">
              <ShareAchievement
                achievementTitle={challengeTitle}
                achievementDescription={`Achieved ${masteryInfo.label} mastery level!`}
                studentName={studentName}
                xpEarned={xpEarned}
                masteryLevel={assessment.overallMastery}
                requiresParentApproval={true}
                onRequestParentApproval={async () => {
                  try {
                    // Check if they have default permission
                    const hasPermission = await hasDefaultSharePermission(studentId);
                    if (hasPermission) return true;

                    // Request approval for this specific share
                    const requestId = await requestShareApproval(studentId, {
                      title: challengeTitle,
                      description: `Achieved ${masteryInfo.label} mastery level!`,
                      xpEarned: xpEarned,
                      masteryLevel: assessment.overallMastery,
                      platform: 'facebook', // Default, can be changed in modal
                    });

                    // Poll for approval (in production, use real-time subscription)
                    let attempts = 0;
                    while (attempts < 60) {
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      const status = await checkShareApproval(requestId);
                      if (status === 'approved') return true;
                      if (status === 'denied' || status === 'expired') return false;
                      attempts++;
                    }
                    return false;
                  } catch (error) {
                    console.error('Error requesting approval:', error);
                    return false;
                  }
                }}
              />
            </div>
          )}

          <div className="flex gap-4">
            {assessment.allowResubmission && onResubmit && (
              <Button
                onClick={onResubmit}
                size="lg"
                variant="outline"
                className="flex-1 h-14 text-lg border-2 border-purple-500 hover:bg-purple-50"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Revise & Resubmit
              </Button>
            )}
            
            <Button
              onClick={onContinue}
              size="lg"
              className={`flex-1 h-14 text-lg ${
                canAdvance
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {canAdvance ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Continue to Next Challenge
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Continue
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Confidence Score (for transparency) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-sm text-gray-500"
        >
          <p>Assessment Confidence: {assessment.confidenceScore}%</p>
          <p className="text-xs mt-1">
            Reviewed by {assessment.assessedBy === 'wowl-ai' ? 'Wowl AI' : 'Your Tutor'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}