/**
 * Schedule Assessment Page
 * Google Calendar integration for booking assessment
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, Video, CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import crownLogo from '../assets/8a35650ca022ec6bc649702b5b35c75083424e81.png';

export default function ScheduleAssessmentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const childName = searchParams.get('child') || 'your child';
  const parentName = searchParams.get('name') || 'there';

  // Google Calendar scheduling link
  const googleCalendarLink = 'https://calendar.app.google/uyb2i5jPznbuH6z46';

  const handleOpenCalendar = () => {
    // Open Google Calendar in new tab
    window.open(googleCalendarLink, '_blank');
  };

  const handleRequestCustomTime = () => {
    // Open email client with pre-filled message
    const subject = encodeURIComponent('Custom Assessment Time Request');
    const body = encodeURIComponent(
      `Hi Mz. Marianna,\n\nI'd like to schedule an assessment for ${childName}, but I need a different time than what's available on the calendar.\n\nMy preferred times are:\n- [Please list 2-3 options]\n\nThank you!\n${parentName}`
    );
    window.location.href = `mailto:mariannav920@gmail.com?subject=${subject}&body=${body}`;
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
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-2 border-purple-200 hover:border-purple-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-6"
            >
              <Calendar className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Schedule {childName}'s Assessment
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pick a time that works best for your family
            </p>
          </div>

          {/* Calendar Embed or Link */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-purple-200 mb-8">
            <div className="space-y-6">
              {/* Assessment Details */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">25-30 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Platform</p>
                    <p className="text-sm text-gray-600">Zoom Meeting</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Investment</p>
                    <p className="text-sm text-gray-600">$30 (includes action plan)</p>
                  </div>
                </div>
              </div>

              {/* Calendar Integration */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Choose Your Time
                </h3>
                <p className="text-gray-700 mb-6">
                  Click below to view available times and book your assessment
                </p>
                
                <Button
                  onClick={handleOpenCalendar}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-10 py-6 text-lg font-bold shadow-xl hover:shadow-2xl mb-4"
                >
                  <Calendar className="w-6 h-6 mr-2" />
                  Open Scheduling Calendar
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-sm text-gray-600">
                  You'll be redirected to Google Calendar to select a time
                </p>
              </div>

              {/* Alternative Option */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Don't See a Time That Works?
                </h3>
                <p className="text-gray-700 text-center mb-4">
                  No problem! Let me know your availability and I'll do my best to accommodate.
                </p>
                <div className="text-center">
                  <Button
                    onClick={handleRequestCustomTime}
                    variant="outline"
                    className="border-2 border-purple-300 hover:border-purple-400 px-8 py-3"
                  >
                    Request Custom Time
                  </Button>
                </div>
              </div>

              {/* What to Expect */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mt-8">
                <h4 className="font-bold text-yellow-900 mb-3">📋 Before the Assessment:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>You'll receive a Zoom link via email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Make sure your child has a quiet space</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Have paper and pencil ready (optional)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Relax! This will be fun and engaging</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Testimonial or Trust Signal */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-cyan-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                M
              </div>
              <div>
                <p className="text-gray-700 italic mb-3">
                  "I make learning feel like an adventure! Your child will have fun while I assess their skills and create a personalized plan for success."
                </p>
                <p className="font-bold text-purple-900">- Mz. Marianna</p>
                <p className="text-sm text-gray-600">Founder & Lead Educator</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">Questions or technical issues?</p>
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
