/**
 * Assessment Offer Page
 * Post-questionnaire page explaining the $30 assessment
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileCheck, 
  Gamepad2,
  ArrowRight,
  Sparkles,
  Target
} from 'lucide-react';
import { Button } from '../components/ui/button';
import crownLogo from '../assets/8a35650ca022ec6bc649702b5b35c75083424e81.png';

export default function AssessmentOfferPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get child name from URL params if available
  const childName = searchParams.get('child') || 'your child';
  const parentName = searchParams.get('name') || 'there';
  const struggles = searchParams.get('struggles') || 'their learning goals';

  const assessmentFeatures = [
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      title: 'Fun & Interactive',
      description: 'Feels like playing games and having conversations'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Common Core Aligned',
      description: 'Age and grade-appropriate assessment'
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: 'Action Plan Included',
      description: 'Detailed report of skills to work on'
    }
  ];

  const handleSchedule = () => {
    // Navigate to scheduling page or open Google Calendar
    navigate('/schedule-assessment' + window.location.search);
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
      <div className="max-w-5xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Thank You Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-600 mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Thank You, {parentName}! 🎉
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thank you for choosing Mz. Marianna's Tutoring to help <strong className="text-purple-600">{childName}</strong>
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-purple-200 mb-8">
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" fill="currentColor" />
                <span>
                  I'm happy to help improve <strong className="text-pink-600">{struggles}</strong>. I usually start with an assessment to see what they already know and what they still need to learn to be on grade level.
                </span>
              </p>

              <p>
                I'll use <strong>Common Core standards</strong> for their age and grade and depending on answers, I'll adjust to either harder or easier questions. It'll feel like a conversation to them because I use simple questions and games/stories to keep it interactive.
              </p>

              <div className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-6">
                <p className="font-semibold text-cyan-900 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  What to Expect
                </p>
                <p className="text-gray-700">
                  We meet on <strong>Zoom for 25-30 minutes</strong>, and it'll feel like we're just talking and playing games. It'll give me an unofficial idea of which Common Core concepts they've learned.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 my-8">
              {assessmentFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Pricing & Offer */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-300 mb-8">
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                    <span className="text-5xl font-bold text-purple-900">30</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Complete Assessment Package
                  </h3>
                  <p className="text-gray-700">
                    Includes personalized <strong>action plan</strong> for the skills your child needs to work on.
                  </p>
                </div>
                <div className="shrink-0">
                  <Button
                    onClick={handleSchedule}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What Happens Next?</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Schedule Your Assessment</p>
                    <p className="text-gray-600">Pick a time that works for your family</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Complete the Assessment</p>
                    <p className="text-gray-600">25-30 minutes of fun, interactive learning</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Receive Action Plan</p>
                    <p className="text-gray-600">Detailed report on skills to work on</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Choose Your Path</p>
                    <p className="text-gray-600">Teach yourself or sign up for tutoring packages</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <p className="text-gray-700">
                <strong className="text-yellow-900">💡 Pro Tip:</strong> I like to use games and apps that make learning fun and easy to understand. Your child will love the interactive approach!
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Ready to get started? If you don't see a time that works, let me know!
            </p>
            <Button
              onClick={handleSchedule}
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-purple-500/50"
            >
              <Calendar className="w-6 h-6 mr-2" />
              Schedule Assessment
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </motion.div>

        {/* Contact */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">Questions or need a different time?</p>
          <a 
            href="mailto:mariannav920@gmail.com" 
            className="text-purple-600 font-semibold hover:underline text-lg"
          >
            Email me: mariannav920@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
