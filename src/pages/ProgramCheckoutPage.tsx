/**
 * Program Checkout Page
 * Handles ClassWallet checkout for program offerings
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, ArrowLeft, CheckCircle, Wallet } from 'lucide-react';
import { getProgramById, getProgramPurchaseOptions, type ProgramPurchaseOption } from '../lib/programs/offerings';
import { isClassWalletConfigured } from '../lib/classwallet/config';
import { createPayByClassWalletPayment } from '../lib/classwallet/payby-service';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase/client';

// Import logo
import crownLogo from '../assets/8a35650ca022ec6bc649702b5b35c75083424e81.png';

export default function ProgramCheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const programId = searchParams.get('program');

  const [program, setProgram] = useState<any>(null);
  const [purchaseOptions, setPurchaseOptions] = useState<ProgramPurchaseOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ProgramPurchaseOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    if (!programId) {
      toast.error('Invalid program selected');
      navigate('/programs');
      return;
    }

    const foundProgram = getProgramById(programId);
    if (!foundProgram) {
      toast.error('Program not found');
      navigate('/programs');
      return;
    }

    setProgram(foundProgram);
    const options = getProgramPurchaseOptions(programId);
    setPurchaseOptions(options);
    
    // Select the full program option by default
    const fullProgramOption = options.find(o => o.id.endsWith('-full'));
    setSelectedOption(fullProgramOption || options[0]);
  }, [programId, navigate]);

  const handleCheckout = async () => {
    if (!selectedOption) {
      toast.error('Please select a purchase option');
      return;
    }

    setIsProcessing(true);

    try {
      if (!currentUser) {
        toast.error('Please log in to complete checkout');
        navigate('/login');
        return;
      }

      if (!isClassWalletConfigured()) {
        toast.error('ClassWallet is not configured yet. Please contact support.');
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
            id: selectedOption.id,
            name: selectedOption.name,
            description: selectedOption.description,
            quantity: selectedOption.quantity,
            price: selectedOption.price,
          },
        ],
        total: selectedOption.price,
        currency: 'USD',
      };

      // Use the Pay by ClassWallet service
      const result = await createPayByClassWalletPayment(
        currentUser.id,
        currentUser.email || '',
        userName,
        orderData,
        `${window.location.origin}/classwallet-callback`,
        `${window.location.origin}/programs`
      );

      if (result.success && result.checkoutUrl) {
        // Redirect to ClassWallet Pay by checkout
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error(result.error || 'Failed to create ClassWallet payment');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!program) {
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
              onClick={() => navigate('/programs')}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold px-4 py-2 rounded-lg border-2 border-purple-200 hover:border-purple-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Programs
            </button>
          </div>
        </div>
      </nav>

      {/* Checkout Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Program Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Program Summary</h2>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{program.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{program.description}</p>

                <div className="border-t border-purple-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-semibold text-gray-900">{program.format}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Grades:</span>
                    <span className="font-semibold text-gray-900">{program.grades}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-semibold text-gray-900">{program.frequency}</span>
                  </div>
                </div>
              </div>

              {/* Educational Benefit */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-1">Educational Benefit</p>
                    <p className="text-xs text-gray-600">{program.educationalBenefit}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Purchase Options & Payment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase Options</h2>

              {/* Option Selector */}
              <div className="space-y-4 mb-8">
                {purchaseOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedOption?.id === option.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{option.name}</p>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">${option.price}</div>
                        {selectedOption?.id === option.id && (
                          <CheckCircle className="w-6 h-6 text-purple-500 mx-auto mt-2" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Payment Method - ClassWallet Only */}
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-4">Payment Method:</p>
                <div className="p-4 rounded-xl border-2 border-green-500 bg-green-50">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-bold text-gray-900">ClassWallet</p>
                      <p className="text-sm text-gray-600">Pay with scholarship or education funds</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isProcessing || !selectedOption}
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
                  <span>Secure ClassWallet payment</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Your payment is processed securely through ClassWallet's digital checkout service.
                </p>
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
