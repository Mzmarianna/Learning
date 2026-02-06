/**
 * Pricing Table Component
 * Displays subscription tiers with Stripe checkout
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Crown, Sparkles, Users, Zap, ArrowRight } from 'lucide-react';
import { PRICING_PLANS, ANNUAL_PRICING_PLANS, formatPrice } from '../../lib/stripe/config';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface PricingTableProps {
  onSelectPlan?: (planId: string) => void;
  currentTier?: 'free' | 'warrior' | 'scholar' | 'legend';
}

export default function PricingTable({ onSelectPlan, currentTier = 'free' }: PricingTableProps) {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const plans = billingInterval === 'month' ? PRICING_PLANS : [PRICING_PLANS[0], ...ANNUAL_PRICING_PLANS];

  const handleSelectPlan = async (planId: string, stripePriceId: string) => {
    if (planId === 'free') {
      toast.info('You\'re already on the free plan!');
      return;
    }

    setIsLoading(planId);

    if (onSelectPlan) {
      onSelectPlan(planId);
    } else {
      // Redirect to checkout page with plan ID
      window.location.href = `/checkout?plan=${planId}`;
    }
  };

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case 'warrior':
        return <Zap className="w-6 h-6" />;
      case 'scholar':
        return <Sparkles className="w-6 h-6" />;
      case 'legend':
        return <Crown className="w-6 h-6" />;
      default:
        return <Users className="w-6 h-6" />;
    }
  };

  const getPlanGradient = (tier: string) => {
    switch (tier) {
      case 'warrior':
        return 'from-orange-500 to-red-500';
      case 'scholar':
        return 'from-purple-500 to-pink-500';
      case 'legend':
        return 'from-yellow-400 to-orange-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="w-full">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-purple-100 rounded-full p-1 flex items-center gap-2">
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              billingInterval === 'month'
                ? 'bg-white text-purple-700 shadow-md'
                : 'text-purple-600 hover:text-purple-800'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              billingInterval === 'year'
                ? 'bg-white text-purple-700 shadow-md'
                : 'text-purple-600 hover:text-purple-800'
            }`}
          >
            Annual
            <span className="ml-2 text-xs bg-green-400 text-green-900 px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan, idx) => {
          const isCurrentPlan = plan.tier === currentTier;
          const isRecommended = plan.recommended;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-xl border-2 overflow-hidden ${
                isRecommended ? 'border-purple-400 scale-105' : 'border-gray-200'
              }`}
            >
              {/* Recommended Badge */}
              {isRecommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-br-lg">
                  CURRENT PLAN
                </div>
              )}

              {/* Plan Header */}
              <div className="p-6 text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getPlanGradient(
                    plan.tier
                  )} text-white mb-4`}
                >
                  {getPlanIcon(plan.tier)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900">{formatPrice(plan.price)}</span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">
                        /{billingInterval === 'month' ? 'mo' : 'yr'}
                      </span>
                    )}
                  </div>
                  {billingInterval === 'year' && plan.price > 0 && (
                    <p className="text-sm text-green-600 font-semibold mt-1">
                      {formatPrice(plan.price / 12)}/month
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.id, plan.stripePriceId)}
                  disabled={isCurrentPlan || isLoading === plan.id}
                  className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                    isRecommended
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl'
                      : plan.price === 0
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } ${isCurrentPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading === plan.id ? (
                    'Loading...'
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : plan.price === 0 ? (
                    'Get Started Free'
                  ) : (
                    <>
                      Upgrade Now <ArrowRight className="w-5 h-5 inline ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* Features List */}
              <div className="px-6 pb-6">
                <div className="border-t border-gray-200 pt-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Money-Back Guarantee */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-3 bg-green-50 border-2 border-green-200 rounded-full px-6 py-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
            ✓
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-900">30-Day Money-Back Guarantee</p>
            <p className="text-sm text-gray-600">Not seeing progress? Get a full refund. No questions asked.</p>
          </div>
        </div>
      </motion.div>

      {/* FAQ */}
      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Questions about pricing?{' '}
          <a href="mailto:mariannav920@gmail.com" className="text-purple-600 font-semibold hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
