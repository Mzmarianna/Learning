/**
 * Welcome Page - Initial Contact
 * First step in visitor workflow after showing interest
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, CheckCircle, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import crownLogo from '../assets/8a35650ca022ec6bc649702b5b35c75083424e81.png';

export default function WelcomePage() {
  const navigate = useNavigate();
  
  // Get visitor name from URL params or localStorage (optional)
  const urlParams = new URLSearchParams(window.location.search);
  const visitorName = urlParams.get('name') || 'there';

  const handleQuestionnaireClick = () => {
    // Open Google Form in new tab
    window.open('https://forms.gle/gkzcXHBqWca6u25K6', '_blank');
    // Navigate to next step
    setTimeout(() => {
      navigate('/assessment-offer');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <img src={crownLogo} alt="Crown Logo" className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Mz. Marianna's Academy</h1>
                <p className="text-xs text-purple-600">Learning Kingdom</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-purple-200"
        >
          {/* Welcome Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-6"
          >
            <Heart className="w-10 h-10 text-white" fill="currentColor" />
          </motion.div>

          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Hi {visitorName}! 👋
            </h1>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-8">
              <p className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" fill="currentColor" />
                <span>
                  <strong>I'm happy to help!</strong> I am passionate about helping each child succeed in their own way and building their self-confidence.
                </span>
              </p>

              <p>
                I use several methods to improve not just academics, but also <strong className="text-purple-600">motivation</strong> and <strong className="text-pink-600">overall happiness</strong>.
              </p>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
                <p className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Next Step: Share Your Child's Learning Style
                </p>
                <p className="text-gray-700 mb-4">
                  Please fill out the following questionnaire so I have background information on how best to motivate your child. I will use their <strong>strengths and learning style</strong> to help meet their specific needs.
                </p>
                
                <Button
                  onClick={handleQuestionnaireClick}
                  className="w-full md:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl"
                >
                  Fill Out Questionnaire
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-8">
              <p className="font-semibold text-gray-900 mb-4">What to expect:</p>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Quick 5-minute questionnaire about your child's strengths</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Personalized assessment recommendation</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Action plan tailored to your child's needs</span>
              </div>
            </div>

            {/* Signature */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-gray-700 mb-2">Sincerely,</p>
              <p className="text-xl font-bold text-purple-900">Marianna Vitale</p>
              <p className="text-gray-600">Founder of Mz. Marianna's Learning Kingdom</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Support */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Questions?{' '}
          <a href="mailto:mariannav920@gmail.com" className="text-purple-600 font-semibold hover:underline">
            Email me: mariannav920@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
