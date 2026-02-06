/**
 * Exit Intent Popup
 * Captures abandoning visitors with last-chance offer
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export default function ExitIntentPopup() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show on certain pages
  const excludePages = ['/placement-quiz', '/checkout', '/payment-success', '/login', '/signup'];
  const shouldShow = !excludePages.includes(location.pathname);

  useEffect(() => {
    if (!shouldShow || isDismissed) return;

    // Check if already dismissed in session
    const dismissed = sessionStorage.getItem('exit-intent-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse leaves from top of page (navigating away)
      if (e.clientY <= 0 && !isDismissed) {
        setIsVisible(true);
      }
    };

    // Add delay before activating
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000); // Wait 5 seconds before activating

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [shouldShow, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('exit-intent-dismissed', 'true');
  };

  const handleCTA = () => {
    handleDismiss();
    navigate('/placement-quiz');
  };

  if (!shouldShow || isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 relative pointer-events-auto">
              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Content */}
              <div className="text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6"
                >
                  <Gift className="w-10 h-10 text-white" />
                </motion.div>

                {/* Headline */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Wait! Don't Miss Your{' '}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Free Gift
                  </span>
                </h2>

                {/* Subheadline */}
                <p className="text-xl text-gray-700 mb-8">
                  Before you go... Discover your child's perfect learning path in just 10 minutes!
                </p>

                {/* Benefits */}
                <div className="bg-purple-50 rounded-2xl p-6 mb-8 text-left">
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">Free Placement Quiz</p>
                      <p className="text-sm text-gray-600">Personalized tier recommendation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">Instant Results</p>
                      <p className="text-sm text-gray-600">No waiting, see results immediately</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">Custom Action Plan</p>
                      <p className="text-sm text-gray-600">Tailored next steps for your child</p>
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleCTA}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-bold rounded-xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Gift className="w-5 h-5" />
                    Start Free Quiz Now
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    No Thanks
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                  100% free • No credit card required • Instant results
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
