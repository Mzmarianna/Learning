/**
 * ClassWallet Callback Page
 * Handles the return from ClassWallet checkout after payment
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { verifyPayByClassWalletPayment, PayByClassWalletConfirmation } from '../lib/classwallet/payby-service';
import { Button } from '../components/ui/button';

export default function ClassWalletCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const sessionId = searchParams.get('sessionId');
  
  const [verifying, setVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending');
  const [confirmation, setConfirmation] = useState<PayByClassWalletConfirmation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid callback - missing session ID');
      setVerifying(false);
      return;
    }

    // Verify the payment
    verifyPayByClassWalletPayment(sessionId)
      .then((result) => {
        if (result.success && result.confirmation) {
          setPaymentStatus(result.confirmation.status === 'approved' ? 'success' : 'failed');
          setConfirmation(result.confirmation);
        } else {
          setError(result.error || 'Failed to verify payment');
          setPaymentStatus('failed');
        }
      })
      .catch((err) => {
        setError(err.message || 'Verification error');
        setPaymentStatus('failed');
      })
      .finally(() => {
        setVerifying(false);
      });
  }, [sessionId]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your ClassWallet payment...</p>
        </motion.div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your ClassWallet payment has been processed successfully.
          </p>

          {confirmation && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-gray-900">{confirmation.transactionId}</span>
                
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">${confirmation.amount}</span>
                
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-green-600 capitalize">{confirmation.status}</span>
              </div>
            </div>
          )}

          <Button
            onClick={() => navigate('/dashboard/student')}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-3 rounded-xl font-bold"
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  // Failed or error state
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          {error || 'Your ClassWallet payment could not be processed.'}
        </p>

        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/pricing')}
            variant="outline"
            className="flex-1"
          >
            Try Again
          </Button>
          <Button
            onClick={() => navigate('/dashboard/student')}
            className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white"
          >
            Go to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
