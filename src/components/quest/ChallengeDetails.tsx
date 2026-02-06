import { motion } from 'motion/react';
import { ArrowLeft, CheckSquare, Clock, Zap, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ExplorerChallenge } from '../../lib/curriculum/explorers-hub-curriculum';

interface ChallengeDetailsProps {
  challenge: ExplorerChallenge;
  questTheme: string;
  onBack: () => void;
  onSubmit: () => void;
}

const SUBJECT_COLORS = {
  STEAM: 'from-purple-500 to-indigo-500',
  Math: 'from-blue-500 to-cyan-500',
  Reading: 'from-green-500 to-emerald-500',
  Writing: 'from-orange-500 to-amber-500',
  Project: 'from-pink-500 to-rose-500',
};

const SUBJECT_ICONS = {
  STEAM: '🔬',
  Math: '🔢',
  Reading: '📖',
  Writing: '✍️',
  Project: '🎨',
};

export default function ChallengeDetails({
  challenge,
  questTheme,
  onBack,
  onSubmit,
}: ChallengeDetailsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-6 border-2 border-purple-300 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quest
        </Button>

        {/* Challenge Header */}
        <Card className="p-8 border-4 border-purple-300 bg-white mb-6">
          <div className="flex items-start gap-4 mb-4">
            {/* Challenge Number */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {challenge.challengeNumber}
            </div>

            {/* Title & Meta */}
            <div className="flex-1">
              <div className="text-sm font-semibold text-purple-600 uppercase mb-1">
                {questTheme} Quest
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{challenge.title}</h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r ${SUBJECT_COLORS[challenge.subject]}`}
                >
                  <span className="mr-2">{SUBJECT_ICONS[challenge.subject]}</span>
                  {challenge.subject}
                </span>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>{challenge.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>~{challenge.estimatedMinutes} minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-700 bg-cyan-50 rounded-lg p-4 border-2 border-cyan-200">
            {challenge.description}
          </p>
        </Card>

        {/* Instructions */}
        <Card className="p-8 border-4 border-blue-300 bg-white mb-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
            <CheckSquare className="w-7 h-7" />
            Step-by-Step Instructions
          </h2>

          <div className="space-y-4">
            {challenge.instructions.map((instruction, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4"
              >
                {/* Step Number */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {idx + 1}
                </div>

                {/* Instruction */}
                <div className="flex-1 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-900 font-medium">{instruction}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Mastery Requirements */}
        <Card className="p-8 border-4 border-green-300 bg-white mb-6">
          <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            What Wowl Will Look For
          </h2>

          <p className="text-gray-700 mb-4">
            To earn full XP and show mastery, your submission should demonstrate:
          </p>

          <div className="space-y-3">
            {challenge.masteryRequirements.map((requirement, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 bg-green-50 rounded-lg p-4 border-2 border-green-200"
              >
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckSquare className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-900 font-medium flex-1">{requirement}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 mb-1">Remember:</p>
                <p className="text-amber-800 text-sm">
                  Wowl never says "wrong"! If you need to improve, you'll get specific guidance and
                  can resubmit for higher mastery (and more XP!).
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Materials (if any) */}
        {challenge.materials && challenge.materials.length > 0 && (
          <Card className="p-8 border-4 border-purple-300 bg-white mb-6">
            <h2 className="text-2xl font-bold text-purple-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">🧰</span>
              Materials You'll Need
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {challenge.materials.map((material, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200 text-center"
                >
                  <p className="font-medium text-purple-900">{material}</p>
                </motion.div>
              ))}
            </div>

            <p className="mt-4 text-sm text-gray-600">
              💡 Tip: Gather all materials before starting to make the challenge smoother!
            </p>
          </Card>
        )}

        {/* Common Core Standards (if any) */}
        {challenge.ccssStandards && challenge.ccssStandards.length > 0 && (
          <Card className="p-8 border-4 border-cyan-300 bg-white mb-6">
            <h2 className="text-2xl font-bold text-cyan-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">📚</span>
              Learning Standards
            </h2>

            <p className="text-gray-700 mb-4">This challenge aligns with:</p>

            <div className="flex flex-wrap gap-2">
              {challenge.ccssStandards.map((standard, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-cyan-100 text-cyan-900 rounded-lg text-sm font-mono font-semibold border border-cyan-300"
                >
                  {standard}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Start Challenge Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onSubmit}
            size="lg"
            className="w-full h-16 text-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            I'm Ready! Start Challenge →
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            You can save your work and come back anytime. Your progress is always saved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
