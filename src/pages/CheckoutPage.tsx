/**
 * Checkout Page
 * Handles Stripe and PayPal payment processing
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, Lock, ArrowLeft, CheckCircle, Wallet, DollarSign } from 'lucide-react';
import { PRICING_PLANS, ANNUAL_PRICING_PLANS, formatPrice, getStripe } from '../lib/stripe/config';
import { isClassWalletConfigured, ClassWalletPaymentType } from '../lib/classwallet/config';
import { createClassWalletPayment } from '../lib/classwallet/service';
import { createPayByClassWalletPayment } from '../lib/classwallet/payby-service';
import { isPayPalConfigured, getPayPalConfig } from '../lib/paypal/config';
import { createPayPalSubscription } from '../lib/paypal/service';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import StripeNotConfiguredBanner from '../components/payments/StripeNotConfiguredBanner';
import { supabase } from '../lib/supabase/client';

// Import logo
import crownLogo from '../assets/8a35650ca022ec6bc649702b5b35c75083424e81.png';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('plan');

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'classwallet'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [classWalletType, setClassWalletType] = useState<ClassWalletPaymentType>(ClassWalletPaymentType.SCHOLARSHIP);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    // Find the selected plan
    const allPlans = [...PRICING_PLANS, ...ANNUAL_PRICING_PLANS];
    const plan = allPlans.find((p) => p.id === planId);
    
    if (!plan) {
      toast.error('Invalid plan selected');
      navigate('/pricing');
      return;
    }

    setSelectedPlan(plan);
  }, [planId, navigate]);

  const handleStripeCheckout = async () => {
    setIsProcessing(true);

    try {
      if (!currentUser) {
        toast.error('Please log in to complete checkout');
        navigate('/login');
        return;
      }

      const stripe = await getStripe();
      if (!stripe) {
        toast.error('Stripe is not configured yet. Please add your Stripe keys to continue.');
        setIsProcessing(false);
        return;
      }

      // In production, call your backend to create a checkout session
      // For now, show a demo message
      toast.info('Demo Mode: Stripe checkout would open here. Add VITE_STRIPE_PUBLISHABLE_KEY to .env to enable.');
      
      // Uncomment when backend is ready:
      /*
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: selectedPlan.stripePriceId,
          userId: currentUser.id,
          userEmail: currentUser.email,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }
      */
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalCheckout = async () => {
    setIsProcessing(true);

    try {
      if (!currentUser) {
        toast.error('Please log in to complete checkout');
        navigate('/login');
        return;
      }

      if (!isPayPalConfigured()) {
        toast.error('PayPal is not configured yet. Please use Stripe or ClassWallet.');
        setIsProcessing(false);
        return;
      }

      // Validate PayPal Plan ID exists and is properly configured
      const paypalPlanId = selectedPlan.paypalPlanId;
      if (!paypalPlanId || paypalPlanId === '') {
        toast.error('PayPal subscription plan is not configured yet. Please contact support or use another payment method.');
        setIsProcessing(false);
        return;
      }

      // Get user profile for name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', currentUser.id)
        .single();

      // Create PayPal subscription
      const result = await createPayPalSubscription({
        userId: currentUser.id,
        userEmail: currentUser.email || '',
        userName: profile?.display_name || currentUser.email || 'User',
        planId: selectedPlan.id,
        paypalPlanId,
        returnUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/pricing`,
      });

      if (result.success && result.approvalUrl) {
        // Redirect to PayPal for approval
        window.location.href = result.approvalUrl;
      } else {
        throw new Error(result.error || 'Failed to create PayPal subscription');
      }
    } catch (error: any) {
      console.error('PayPal checkout error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClassWalletCheckout = async () => {
    setIsProcessing(true);

    try {
      if (!currentUser) {
        toast.error('Please log in to complete checkout');
        navigate('/login');
        return;
      }

      if (!isClassWalletConfigured()) {
        toast.error('ClassWallet is not configured yet. Please use Stripe or PayPal.');
        setIsProcessing(false);
        return;
      }

      // Get user profile for name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', currentUser.id)
        .single();

      const userName = profile?.display_name || currentUser.email || 'User';

      // Create order data for Pay by ClassWallet
      const orderData = {
        orderId: `order_${crypto.randomUUID()}`,
        items: [
          {
            id: selectedPlan.id,
            name: selectedPlan.name,
            description: selectedPlan.description,
            quantity: 1,
            price: selectedPlan.price,
          },
        ],
        total: selectedPlan.price,
        currency: 'USD',
      };

      // Use the Pay by ClassWallet service
      const result = await createPayByClassWalletPayment(
        currentUser.id,
        currentUser.email || '',
        userName,
        orderData,
        `${window.location.origin}/payment-success`,
        `${window.location.origin}/pricing`
      );

      if (result.success && result.checkoutUrl) {
        // Redirect to ClassWallet Pay by checkout
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error(result.error || 'Failed to create ClassWallet payment');
      }
    } catch (error: any) {
      console.error('ClassWallet checkout error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <img src={crownLogo} alt="Crown Logo" className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Mz. Marianna's Academy</h1>
                <p className="text-xs text-purple-600">Secure Checkout</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold px-4 py-2 rounded-lg border-2 border-purple-200 hover:border-purple-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Pricing
            </button>
          </div>
        </div>
      </nav>

      {/* Checkout Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Plan Details */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedPlan.name}</h3>
                    <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{formatPrice(selectedPlan.price)}</div>
                    <div className="text-sm text-gray-600">
                      per {selectedPlan.interval === 'month' ? 'month' : 'year'}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="border-t border-purple-200 pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">What's included:</p>
                  <ul className="space-y-2">
                    {selectedPlan.features.slice(0, 5).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {selectedPlan.features.length > 5 && (
                      <li className="text-sm text-gray-600 italic">
                        + {selectedPlan.features.length - 5} more features
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedPlan.price)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(selectedPlan.price)}</span>
                </div>
              </div>

              {/* Money-Back Guarantee */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">30-Day Money-Back Guarantee</p>
                    <p className="text-xs text-gray-600">
                      Not seeing progress? Get a full refund, no questions asked.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Payment Method */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

              {/* Payment Method Selector */}
              <div className="space-y-4 mb-8">
                {/* Stripe */}
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === 'stripe'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="font-bold text-gray-900">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Powered by Stripe</p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'stripe' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                      }`}
                    >
                      {paymentMethod === 'stripe' && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </button>

                {/* PayPal */}
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        P
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">PayPal</p>
                        <p className="text-sm text-gray-600">Autopay subscription</p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}
                    >
                      {paymentMethod === 'paypal' && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </button>

                {/* ClassWallet */}
                <button
                  onClick={() => setPaymentMethod('classwallet')}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === 'classwallet'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-bold text-gray-900">ClassWallet</p>
                        <p className="text-sm text-gray-600">Scholarship & reimbursement</p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'classwallet' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                      }`}
                    >
                      {paymentMethod === 'classwallet' && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </button>

                {/* ClassWallet Payment Type Selector */}
                {paymentMethod === 'classwallet' && (
                  <div className="ml-9 mt-2 space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Payment Type:</p>
                    <select
                      value={classWalletType}
                      onChange={(e) => setClassWalletType(e.target.value as ClassWalletPaymentType)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value={ClassWalletPaymentType.SCHOLARSHIP}>Scholarship Program</option>
                      <option value={ClassWalletPaymentType.REIMBURSEMENT}>Reimbursement</option>
                      <option value={ClassWalletPaymentType.ESA}>Education Savings Account (ESA)</option>
                      <option value={ClassWalletPaymentType.EMPOWERMENT}>Empowerment Scholarship</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <Button
                onClick={
                  paymentMethod === 'stripe'
                    ? handleStripeCheckout
                    : paymentMethod === 'paypal'
                    ? handlePayPalCheckout
                    : handleClassWalletCheckout
                }
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 transition-all"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Lock className="w-5 h-5 inline mr-2" />
                    Complete Secure Checkout
                  </>
                )}
              </Button>

              {/* Security Notice */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>Secure SSL encrypted payment</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="text-center">
                    <p className="font-semibold">🔒 SSL Secure</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">✓ PCI Compliant</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">💳 Stripe Verified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Need help?{' '}
              <a href="mailto:mariannav920@gmail.com" className="text-purple-600 font-semibold hover:underline">
                Contact Support
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}