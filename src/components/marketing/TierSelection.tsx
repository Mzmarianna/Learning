import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { TierRecommendation, SkillTier, TIER_INFO } from '../../lib/tier-system';

interface TierSelectionProps {
  recommendation: TierRecommendation;
  childAge: number;
  childName: string;
  onConfirm: (selectedTier: SkillTier) => void;
  onBack: () => void;
}

export default function TierSelection({
  recommendation,
  childAge,
  childName,
  onConfirm,
  onBack,
}: TierSelectionProps) {
  const [selectedTier, setSelectedTier] = useState<SkillTier>(recommendation.recommendedTier);
  const [showExplanation, setShowExplanation] = useState(true);

  const tiers: SkillTier[] = ['early-explorers', 'explorers', 'warriors'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-4xl font-bold mb-4">
              Perfect Match for {childName}!
            </h1>
            <p className="text-xl text-gray-600">
              Based on the placement quiz, we recommend a starting tier.
            </p>
          </div>

          {/* Recommendation Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-2xl p-6 mb-8"
            >
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-blue-900 mb-2">
                    Why We Recommend {TIER_INFO[recommendation.recommendedTier].name}
                  </h3>
                  <ul className="space-y-2 text-blue-800">
                    {recommendation.reasoning.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Confidence Level */}
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-700">
                    Recommendation Confidence
                  </span>
                  <span className="text-sm font-bold text-blue-900">
                    {recommendation.confidence}%
                  </span>
                </div>
                <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${recommendation.confidence}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Tier Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              Choose Your Starting Tier
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {tiers.map((tier) => {
                const tierInfo = TIER_INFO[tier];
                const isRecommended = tier === recommendation.recommendedTier;
                const isSelected = tier === selectedTier;

                return (
                  <motion.button
                    key={tier}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTier(tier)}
                    className={`relative p-6 rounded-2xl border-4 text-left transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    {/* Recommended Badge */}
                    {isRecommended && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        RECOMMENDED
                      </div>
                    )}

                    {/* Tier Icon */}
                    <div className="text-5xl mb-3">{tierInfo.icon}</div>

                    {/* Tier Name */}
                    <h3 className="text-xl font-bold mb-2">{tierInfo.name}</h3>

                    {/* Skill Range */}
                    <div className="text-sm font-semibold text-purple-600 mb-2">
                      {tierInfo.skillRange}
                    </div>

                    {/* Age Range (Marketing) */}
                    <div className="text-xs text-gray-500 mb-3">
                      Typically {tierInfo.ageRange}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {tierInfo.themeDescription}
                    </p>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Override Warning */}
          {selectedTier !== recommendation.recommendedTier && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">You've chosen a different tier</p>
                  <p>
                    No problem! The system will adapt to {childName}'s pace. We can always adjust
                    later based on their progress.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Important Message */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Important: This is Normal & Expected!
            </h3>
            <div className="space-y-2 text-purple-800 text-sm">
              <p>
                <strong>Many students need to review foundational skills</strong> — even older students.
                This is completely normal and very common!
              </p>
              <p>
                We use <strong>age-appropriate themes and visuals</strong> while building foundational skills,
                so {childAge >= 13 ? 'teens never feel like they\'re "back in elementary school"' : 'students stay engaged and motivated'}.
              </p>
              <p>
                The system will <strong>automatically adjust</strong> as {childName} masters skills
                and is ready for more advanced content.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Back to Results
            </Button>
            <Button
              onClick={() => onConfirm(selectedTier)}
              size="lg"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Continue with {TIER_INFO[selectedTier].name}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Fine Print */}
          <p className="text-xs text-gray-500 text-center mt-6">
            You can change tiers at any time from the parent dashboard. The system will recommend
            tier changes as your child progresses.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
