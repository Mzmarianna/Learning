/**
 * Complete Submission Flow with Wowl Assessment
 * 
 * Flow:
 * 1. Student submits work (text, image, video, screenshot)
 * 2. Wowl assesses submission
 * 3. Student sees feedback
 * 4. Student can resubmit or continue
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PortfolioSubmission from './PortfolioSubmission';
import SubmissionReview from './SubmissionReview';
import {
  WowlMasteryEngine,
  Submission,
  MasteryAssessment,
  getDefaultCriteria,
} from '../../lib/wowl-mastery-engine';
import { SkillTier } from '../../lib/tier-system';
import { GradeLevel } from '../../lib/learning-standards';

interface SubmissionFlowProps {
  studentId: string;
  studentName: string;
  studentAge: number;
  studentTier: SkillTier;
  
  challengeId: string;
  challengeTitle: string;
  challengeType: string;
  skillLevel: GradeLevel;
  competencyId: string;
  baseXP: number;
  
  questId?: string;
  onComplete: (assessment: MasteryAssessment) => void;
  onCancel?: () => void;
}

export default function SubmissionFlow({
  studentId,
  studentName,
  studentAge,
  studentTier,
  challengeId,
  challengeTitle,
  challengeType,
  skillLevel,
  competencyId,
  baseXP,
  questId,
  onComplete,
  onCancel,
}: SubmissionFlowProps) {
  const [step, setStep] = useState<'submit' | 'reviewing' | 'feedback'>('submit');
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [assessment, setAssessment] = useState<MasteryAssessment | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);

  const handleSubmit = async (submissionData: {
    type: 'text' | 'image' | 'video' | 'screenshot' | 'multiple';
    text?: string;
    imageUrls?: string[];
    videoUrl?: string;
  }) => {
    // Create submission object
    const submission: Submission = {
      id: `submission-${Date.now()}`,
      studentId,
      studentName,
      studentAge,
      studentTier,
      challengeId,
      challengeTitle,
      skillLevel,
      competencyId,
      type: submissionData.type,
      content: {
        text: submissionData.text,
        imageUrls: submissionData.imageUrls,
        videoUrl: submissionData.videoUrl,
      },
      submittedAt: new Date(),
      attemptNumber,
      previousAttemptId: currentSubmission?.id,
    };

    setCurrentSubmission(submission);
    setStep('reviewing');

    // Simulate Wowl thinking (in production, this would call AI)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Assess submission
    const engine = new WowlMasteryEngine();
    const criteria = getDefaultCriteria(challengeType);
    const masteryAssessment = await engine.assessSubmission(submission, criteria);

    setAssessment(masteryAssessment);
    setStep('feedback');
  };

  const handleResubmit = () => {
    setAttemptNumber(attemptNumber + 1);
    setStep('submit');
  };

  const handleContinue = () => {
    if (assessment) {
      onComplete(assessment);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'submit' && (
        <motion.div
          key="submit"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <PortfolioSubmission
            studentId={studentId}
            studentName={studentName}
            challengeId={challengeId}
            challengeTitle={challengeTitle}
            questId={questId}
            onComplete={() => {
              // Submission uploaded to Firebase
              // Now trigger Wowl assessment
            }}
          />
          
          {/* Temporary submission button for demo */}
          <div className="max-w-2xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-4">Demo: Quick Submit</h3>
            <p className="text-gray-600 mb-4">
              This is a demo. In production, your work above would be automatically submitted.
            </p>
            <button
              onClick={() => handleSubmit({
                type: 'text',
                text: 'I completed this challenge by creating a Roblox game with color-changing parts. I learned how to use variables and loops.',
              })}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Submit for Review
            </button>
          </div>
        </motion.div>
      )}

      {step === 'reviewing' && (
        <motion.div
          key="reviewing"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 flex items-center justify-center p-4"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="text-9xl mb-6"
            >
              🦉
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Wowl is Reviewing...</h2>
            <p className="text-xl text-gray-600 mb-6">
              Analyzing your work and preparing feedback
            </p>
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                className="w-3 h-3 bg-purple-600 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                className="w-3 h-3 bg-pink-600 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                className="w-3 h-3 bg-cyan-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}

      {step === 'feedback' && assessment && (
        <motion.div
          key="feedback"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <SubmissionReview
            assessment={assessment}
            studentName={studentName}
            challengeTitle={challengeTitle}
            onResubmit={assessment.allowResubmission ? handleResubmit : undefined}
            onContinue={handleContinue}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
