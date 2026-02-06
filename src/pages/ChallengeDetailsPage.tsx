import { useNavigate, useParams } from 'react-router';
import { getChallengeById } from '../lib/curriculum/explorers-hub-curriculum';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Target, Upload, ChevronRight, Home } from 'lucide-react';

export default function ChallengeDetailsPage() {
  const navigate = useNavigate();
  const { challengeId } = useParams<{ challengeId: string }>();
  
  const challenge = challengeId ? getChallengeById(challengeId) : null;

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Challenge not found</h1>
          <button
            onClick={() => navigate('/quests')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg"
          >
            Back to Quests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button
              onClick={() => navigate('/dashboard/student')}
              className="hover:text-gray-900 flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => navigate('/quests')}
              className="hover:text-gray-900"
            >
              Quests
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Challenge</span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-purple-600 font-semibold mb-1">
                {challenge.subject} • {challenge.estimatedTime}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {challenge.title}
              </h1>
              <p className="text-gray-600">{challenge.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">
                {challenge.xpReward} XP
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Instructions */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Instructions</h2>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">
              {challenge.instructions}
            </p>
          </div>
        </motion.div>

        {/* Materials Needed */}
        {challenge.materialsNeeded && challenge.materialsNeeded.length > 0 && (
          <motion.div
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Materials Needed
            </h3>
            <ul className="grid md:grid-cols-2 gap-3">
              {challenge.materialsNeeded.map((material, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  {material}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Mastery Requirements */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              What Wowl Will Look For
            </h2>
          </div>
          <div className="space-y-3">
            {challenge.masteryRequirements.map((requirement, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg"
              >
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700">{requirement}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Examples (if available) */}
        {challenge.examplePrompts && challenge.examplePrompts.length > 0 && (
          <motion.div
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Example Ideas
            </h3>
            <div className="space-y-2">
              {challenge.examplePrompts.map((example, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg text-gray-700"
                >
                  💡 {example}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Standards */}
        {challenge.ccssStandards && challenge.ccssStandards.length > 0 && (
          <motion.div
            className="bg-gray-50 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Educational Standards
            </h3>
            <div className="flex flex-wrap gap-2">
              {challenge.ccssStandards.map((standard, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm border border-gray-200"
                >
                  {standard}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div
          className="sticky bottom-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => navigate(`/challenge/${challengeId}/submit`)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <Upload className="w-5 h-5" />
            Submit Your Work
          </button>
        </motion.div>
      </div>
    </div>
  );
}