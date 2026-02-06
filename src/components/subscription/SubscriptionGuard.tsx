/**
 * Subscription Guard Component
 * Blocks access to LMS if subscription is inactive
 * Shows beautiful upgrade/renewal screen
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, CreditCard, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { checkSubscriptionStatus, type SubscriptionStatus } from '../../lib/auth/subscription-guard';
import LoadingScreen from '../common/LoadingScreen';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const result = await checkSubscriptionStatus();
    setStatus(result);
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // If subscription is active, render children
  if (status?.isActive) {
    return <>{children}</>;
  }

  // Otherwise, show subscription required screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        {/* Lock Icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4"
          >
            <Lock className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {status?.status === 'cancelled' ? 'Subscription Cancelled' : 
             status?.status === 'expired' ? 'Subscription Expired' :
             'Subscription Required'}
          </h1>
          <p className="text-xl text-gray-700">
            {status?.message}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Explorer Plan */}
          <Card className="p-6 border-4 border-purple-300 hover:border-purple-500 transition-all hover:shadow-xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Explorer</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-purple-600">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-6 text-left">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 student account</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Full quest system</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Roblox challenges</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Parent dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Weekly progress reports</span>
                </li>
              </ul>
              <Button
                onClick={() => window.location.href = status?.renewalUrl || 'https://yourstore.myshopify.com/products/explorer-plan'}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Subscribe Now
              </Button>
            </div>
          </Card>

          {/* Family Plan (Popular) */}
          <Card className="p-6 border-4 border-green-400 hover:border-green-500 transition-all hover:shadow-xl relative">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Most Popular
              </div>
            </div>

            <div className="text-center mt-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Family</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold text-green-600">$49</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-6 text-left">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Up to 3 students</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Everything in Explorer</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Multi-student dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Sibling progress comparison</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
              <Button
                onClick={() => window.location.href = status?.renewalUrl || 'https://yourstore.myshopify.com/products/family-plan'}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                size="lg"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Subscribe Now
              </Button>
            </div>
          </Card>

          {/* Annual Plan */}
          <Card className="p-6 border-4 border-orange-300 hover:border-orange-500 transition-all hover:shadow-xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Annual</h3>
              <div className="mb-1">
                <span className="text-5xl font-bold text-orange-600">$199</span>
                <span className="text-gray-600">/year</span>
              </div>
              <div className="text-green-600 font-bold mb-4">Save $149!</div>
              <ul className="space-y-3 mb-6 text-left">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 student account</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Everything in Explorer</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Best value (43% off)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Lock in current price</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">VIP support</span>
                </li>
              </ul>
              <Button
                onClick={() => window.location.href = status?.renewalUrl || 'https://yourstore.myshopify.com/products/annual-plan'}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Subscribe Now
              </Button>
            </div>
          </Card>
        </div>

        {/* Why Subscribe Section */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-4 border-purple-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Why Mz. Marianna's Academy?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Neurodivergent-First</h3>
                <p className="text-gray-700 text-sm">
                  Designed specifically for ADHD, autistic, and dyslexic learners
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Mastery-Based</h3>
                <p className="text-gray-700 text-sm">
                  Progress at your own pace based on skill, not age
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Gamified Learning</h3>
                <p className="text-gray-700 text-sm">
                  Quests, badges, and Roblox challenges make learning fun
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Parent Transparency</h3>
                <p className="text-gray-700 text-sm">
                  Weekly reports, real-time dashboards, and milestone alerts
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>Questions? <a href="mailto:support@mzmariannaacademy.com" className="text-purple-600 hover:underline">Contact Support</a></p>
        </div>
      </motion.div>
    </div>
  );
}