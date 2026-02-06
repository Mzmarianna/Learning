/**
 * Payment Success Page
 * Displays after successful payment with invoice/receipt
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Download, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import InvoiceTemplate from '../components/payments/InvoiceTemplate';

// Import logo
import crownLogo from '../assets/8a35650ca022ec6bc649702b5b35c75083424e81.png';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    // In production, fetch session data from Stripe
    // For now, use mock data
    const mockInvoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      customerName: 'Demo Customer',
      customerEmail: 'mariannav920@gmail.com',
      customerAddress: '123 Main St, San Francisco, CA 94102',
      planName: 'Warrior',
      planDescription: 'Monthly subscription',
      amount: 29.00,
      tax: 2.32,
      total: 31.32,
      paymentMethod: 'Visa ending in 4242',
      billingPeriod: new Date().toLocaleDateString() + ' - ' + new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    };

    setInvoiceData(mockInvoiceData);
  }, [sessionId]);

  const handleDownloadInvoice = () => {
    setShowInvoice(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <img src={crownLogo} alt="Crown Logo" className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">Mz. Marianna's Academy</h1>
              <p className="text-xs text-green-600 font-semibold">Payment Successful!</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Success Content */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-green-600 mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to the Academy! 🎉
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Your payment was successful. Let's unlock your child's genius together!
          </p>

          {/* Confetti Effect */}
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -100, opacity: 0 }}
                transition={{ delay: i * 0.1, duration: 1, repeat: 3 }}
              >
                <Sparkles className="w-6 h-6 text-purple-500" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Receipt Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-green-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Receipt</h2>

          {invoiceData && (
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Invoice Number</span>
                <span className="font-bold text-gray-900">{invoiceData.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Date</span>
                <span className="font-semibold text-gray-900">{invoiceData.date}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Plan</span>
                <span className="font-semibold text-gray-900">{invoiceData.planName}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Billing Period</span>
                <span className="font-semibold text-gray-900">{invoiceData.billingPeriod}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">${invoiceData.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold text-gray-900">${invoiceData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 text-xl">
                <span className="font-bold text-gray-900">Total Paid</span>
                <span className="font-bold text-green-600">${invoiceData.total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <Button
              onClick={handleDownloadInvoice}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all"
            >
              <Download className="w-5 h-5 inline mr-2" />
              Download Invoice
            </Button>

            <Button
              onClick={() => {
                window.location.href = `mailto:mariannav920@gmail.com?subject=Receipt Request - ${invoiceData?.invoiceNumber}`;
              }}
              className="w-full bg-white text-gray-900 border-2 border-gray-300 py-3 rounded-xl font-semibold hover:border-gray-400 transition-all"
            >
              <Mail className="w-5 h-5 inline mr-2" />
              Email Receipt
            </Button>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 mb-8 border-2 border-purple-300"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>

          <div className="space-y-4">
            {[
              {
                step: '1',
                title: 'Check your email',
                desc: 'We sent you a welcome email with your login credentials and getting started guide.',
              },
              {
                step: '2',
                title: 'Set up your child\'s profile',
                desc: 'Complete the learning profile quiz to personalize their experience.',
              },
              {
                step: '3',
                title: 'Start the first quest',
                desc: 'Your child can begin their first Warriors challenge immediately!',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full mt-8 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 inline ml-2" />
          </Button>
        </motion.div>

        {/* Support */}
        <div className="text-center text-gray-600">
          <p className="mb-2">Questions about your subscription?</p>
          <a
            href="mailto:mariannav920@gmail.com"
            className="text-purple-600 font-semibold hover:underline"
          >
            Contact Support
          </a>
        </div>
      </div>

      {/* Hidden Invoice Template (for printing) */}
      {showInvoice && invoiceData && (
        <div className="hidden print:block">
          <InvoiceTemplate data={invoiceData} />
        </div>
      )}
    </div>
  );
}
