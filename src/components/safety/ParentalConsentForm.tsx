import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, CheckCircle, Mail, CreditCard, FileText, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { grantParentalConsent, requestParentalConsent } from '../../lib/safety/child-safety';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';

interface ParentalConsentFormProps {
  studentId: string;
  studentName: string;
  studentAge: number;
  parentEmail: string;
  onConsentGranted: () => void;
}

export default function ParentalConsentForm({
  studentId,
  studentName,
  studentAge,
  parentEmail,
  onConsentGranted,
}: ParentalConsentFormProps) {
  const [step, setStep] = useState<'info' | 'permissions' | 'verify'>('info');
  const [permissions, setPermissions] = useState({
    allowDataCollection: true,
    allowSocialSharing: false,
    allowExternalLinks: false,
    allowMessaging: false,
  });
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'credit_card' | 'government_id'>('email');
  const [loading, setLoading] = useState(false);

  const handleGrantConsent = async () => {
    setLoading(true);
    try {
      // First create a consent request
      const requestId = await requestParentalConsent(studentId, parentEmail, 'full');
      
      // Then grant the consent (in production, this would be after email verification)
      const { data: parentProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', parentEmail)
        .eq('role', 'parent')
        .single();

      if (!parentProfile) {
        throw new Error('Parent profile not found');
      }

      const success = await grantParentalConsent(
        requestId,
        parentProfile.id,
        verificationMethod,
        permissions
      );

      if (success) {
        toast.success('Parental consent granted successfully!');
        onConsentGranted();
      } else {
        throw new Error('Failed to grant consent');
      }
    } catch (error: any) {
      console.error('Error granting consent:', error);
      toast.error(error.message || 'Failed to grant consent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 border-4 border-purple-300 bg-white">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-16 h-16 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Parental Consent Required
              </h1>
              <p className="text-gray-600">
                COPPA Compliance for {studentName} (Age {studentAge})
              </p>
            </div>

            {/* Info Step */}
            {step === 'info' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-blue-900 mb-2">
                        Why is this required?
                      </h3>
                      <p className="text-blue-800 text-sm">
                        The Children's Online Privacy Protection Act (COPPA) requires us to obtain
                        verifiable parental consent before collecting personal information from
                        children under 13 years old. This protects your child's privacy and safety online.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">What we collect:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Learning progress and mastery levels (for educational purposes)</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Challenge submissions and portfolio work</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Session time and activity logs (for safety limits)</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">We do NOT collect:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Social security numbers or government IDs</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Precise geolocation data</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Financial information</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-600 font-bold">✗</span>
                      <span>Contact lists or device information</span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={() => setStep('permissions')}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Continue to Permissions
                </Button>
              </motion.div>
            )}

            {/* Permissions Step */}
            {step === 'permissions' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="font-bold text-gray-900 text-xl mb-4">
                  Customize Permissions
                </h3>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions.allowDataCollection}
                        onChange={(e) => setPermissions({ ...permissions, allowDataCollection: e.target.checked })}
                        className="w-5 h-5 mt-0.5"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">
                          Allow Learning Data Collection
                        </h4>
                        <p className="text-sm text-gray-600">
                          Required for progress tracking, mastery assessment, and personalized learning.
                        </p>
                        <p className="text-xs text-purple-600 font-semibold mt-1">
                          ✓ Recommended
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions.allowSocialSharing}
                        onChange={(e) => setPermissions({ ...permissions, allowSocialSharing: e.target.checked })}
                        className="w-5 h-5 mt-0.5"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">
                          Allow Social Media Sharing
                        </h4>
                        <p className="text-sm text-gray-600">
                          Student can share achievements to Facebook, Twitter, and Instagram with your approval.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions.allowExternalLinks}
                        onChange={(e) => setPermissions({ ...permissions, allowExternalLinks: e.target.checked })}
                        className="w-5 h-5 mt-0.5"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">
                          Allow External Links
                        </h4>
                        <p className="text-sm text-gray-600">
                          Some challenges may link to educational videos or resources on other websites.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions.allowMessaging}
                        onChange={(e) => setPermissions({ ...permissions, allowMessaging: e.target.checked })}
                        className="w-5 h-5 mt-0.5"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">
                          Allow Messaging with Tutor
                        </h4>
                        <p className="text-sm text-gray-600">
                          Student can send messages to their assigned tutor (monitored and moderated).
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep('info')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep('verify')}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Continue to Verification
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Verification Step */}
            {step === 'verify' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="font-bold text-gray-900 text-xl mb-4">
                  Verify Parental Consent
                </h3>

                <p className="text-gray-700 mb-4">
                  Choose a verification method to confirm you are the parent or legal guardian of {studentName}:
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setVerificationMethod('email')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      verificationMethod === 'email'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-6 h-6 text-purple-600" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">Email Verification</h4>
                        <p className="text-sm text-gray-600">
                          Receive a verification link at {parentEmail}
                        </p>
                        <p className="text-xs text-purple-600 font-semibold mt-1">
                          ✓ Recommended - Free & Quick
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setVerificationMethod('credit_card')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      verificationMethod === 'credit_card'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">Credit Card</h4>
                        <p className="text-sm text-gray-600">
                          Verify with a small refundable charge ($0.30)
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setVerificationMethod('government_id')}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      verificationMethod === 'government_id'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-purple-600" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">Government ID</h4>
                        <p className="text-sm text-gray-600">
                          Upload a photo ID (encrypted & deleted after verification)
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <p className="text-sm text-gray-700">
                    <strong className="text-green-900">Privacy Guarantee:</strong> We will never sell
                    or share your child's information with third parties. All data is encrypted and
                    used solely for educational purposes.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep('permissions')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleGrantConsent}
                    disabled={loading}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {loading ? 'Processing...' : 'Grant Consent'}
                  </Button>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Questions? Email us at privacy@mzmariannaacademy.com
        </p>
      </div>
    </div>
  );
}