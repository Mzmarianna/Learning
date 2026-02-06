import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, AlertCircle, Shield, FileText, Download } from 'lucide-react';
import { Button } from '../ui/button';
import {
  recordParentalConsent,
  CURRENT_PRIVACY_POLICY_VERSION,
  CURRENT_TERMS_OF_SERVICE_VERSION,
  isAgeEligible,
  requiresCOPPA,
} from '../../lib/privacy-compliance';

interface ParentalConsentFlowProps {
  studentName: string;
  studentDateOfBirth: Date;
  parentName: string;
  parentEmail: string;
  parentId: string;
  studentId: string;
  onConsentComplete: (consentId: string) => void;
  onCancel?: () => void;
}

export default function ParentalConsentFlow({
  studentName,
  studentDateOfBirth,
  parentName,
  parentEmail,
  parentId,
  studentId,
  onConsentComplete,
  onCancel,
}: ParentalConsentFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [consents, setConsents] = useState({
    dataCollection: false,
    dataSharing: false,
    emailCommunication: false,
    studentEmailCommunication: false,
    progressReports: false,
    thirdPartyTools: false,
    researchParticipation: false,
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);

  const ageEligible = isAgeEligible(studentDateOfBirth);
  const needsCOPPA = requiresCOPPA(studentDateOfBirth);

  const handleSubmit = async () => {
    if (!agreedToTerms || !agreedToPrivacy || !signature) {
      alert('Please complete all required fields');
      return;
    }

    setLoading(true);

    try {
      // Get IP and user agent for audit trail
      const ipAddress = await fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then(d => d.ip)
        .catch(() => 'unknown');
      
      const userAgent = navigator.userAgent;

      const consentId = await recordParentalConsent({
        studentId,
        parentId,
        parentName,
        parentEmail,
        studentName,
        studentDateOfBirth,
        ipAddress,
        userAgent,
        consents,
        coppaCompliant: needsCOPPA,
        privacyPolicyVersion: CURRENT_PRIVACY_POLICY_VERSION,
        termsOfServiceVersion: CURRENT_TERMS_OF_SERVICE_VERSION,
      });

      onConsentComplete(consentId);
    } catch (error) {
      console.error('Error recording consent:', error);
      alert('Failed to record consent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Welcome',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto text-purple-600 mb-4" />
            <h2 className="text-3xl font-bold mb-4">Protecting Your Family's Privacy</h2>
            <p className="text-lg text-gray-700 mb-6">
              At Mz. Marianna's Academy, we take student privacy seriously. Before we begin, we need your consent to work with {studentName}.
            </p>
          </div>

          {!ageEligible && (
            <div className="bg-red-50 border-2 border-red-400 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-red-900 mb-2">Age Requirement Not Met</h3>
                  <p className="text-red-800">
                    Our program is designed for students ages 12-18. Based on the date of birth provided, {studentName} does not meet this requirement. Please contact us if you believe this is an error.
                  </p>
                </div>
              </div>
            </div>
          )}

          {needsCOPPA && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-900 mb-2">Additional Protections for Younger Students</h3>
                  <p className="text-yellow-800">
                    Since {studentName} is under 13, additional privacy protections under COPPA (Children's Online Privacy Protection Act) apply. We'll walk you through these requirements.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-cyan-50 border-2 border-cyan-300 rounded-xl p-6">
            <h3 className="font-bold text-cyan-900 mb-3">This process will take about 5 minutes</h3>
            <ul className="space-y-2 text-cyan-800">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <span>Review our privacy practices</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <span>Choose what data we can collect and use</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <span>Review our terms and policies</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <span>Provide your consent electronically</span>
              </li>
            </ul>
          </div>

          {ageEligible && (
            <Button
              onClick={() => setCurrentStep(1)}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Continue to Consent Form
            </Button>
          )}

          {onCancel && (
            <Button
              onClick={onCancel}
              variant="ghost"
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </div>
      ),
    },
    {
      title: 'Data Collection Consent',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">What Data We Collect & Why</h2>
            <p className="text-gray-700 mb-6">
              Please review and consent to the following data collection practices. You can withdraw consent at any time from your Parent Dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <ConsentCheckbox
              checked={consents.dataCollection}
              onChange={(checked) => setConsents({ ...consents, dataCollection: checked })}
              required
              title="Educational Data Collection"
              description="Collect and store learning progress, quiz results, competency assessments, and assignment completion data to track your child's educational growth and personalize their learning path."
            />

            <ConsentCheckbox
              checked={consents.dataSharing}
              onChange={(checked) => setConsents({ ...consents, dataSharing: checked })}
              required
              title="Data Sharing with Tutors"
              description="Share your child's learning data with their assigned tutor to enable personalized instruction and support. Tutors can see progress, strengths, areas for growth, and assignment history."
            />

            <ConsentCheckbox
              checked={consents.progressReports}
              onChange={(checked) => setConsents({ ...consents, progressReports: checked })}
              required
              title="Progress Reports & Analytics"
              description="Generate and display progress reports, competency growth charts, and learning analytics in your Parent Dashboard and weekly email summaries."
            />

            <ConsentCheckbox
              checked={consents.emailCommunication}
              onChange={(checked) => setConsents({ ...consents, emailCommunication: checked })}
              title="Parent Email Communication"
              description="Send you weekly progress reports, important updates, class schedules, and tutor messages via email. You can unsubscribe from non-essential emails at any time."
            />

            <ConsentCheckbox
              checked={consents.studentEmailCommunication}
              onChange={(checked) => setConsents({ ...consents, studentEmailCommunication: checked })}
              title="Student Email Communication"
              description="Send your child motivational messages, assignment reminders, and celebration emails for achievements. All student emails are educational in nature."
            />

            <ConsentCheckbox
              checked={consents.thirdPartyTools}
              onChange={(checked) => setConsents({ ...consents, thirdPartyTools: checked })}
              required
              title="Third-Party Educational Tools"
              description="Use trusted third-party tools for live video classes (Zoom), content delivery, and educational resources. We only use COPPA/FERPA-compliant vendors with signed data protection agreements."
            />

            <ConsentCheckbox
              checked={consents.researchParticipation}
              onChange={(checked) => setConsents({ ...consents, researchParticipation: checked })}
              title="Anonymous Research Participation"
              description="Include anonymized learning data in research studies to improve our adaptive learning algorithms and help other neurodivergent learners. No personally identifiable information is ever shared."
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setCurrentStep(0)}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!consents.dataCollection || !consents.dataSharing || !consents.progressReports || !consents.thirdPartyTools}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Continue
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: 'Terms & Privacy',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Review Our Policies</h2>
            <p className="text-gray-700 mb-6">
              Please review our Terms of Service and Privacy Policy before proceeding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-purple-300 rounded-xl p-6">
              <FileText className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-bold text-lg mb-2">Privacy Policy</h3>
              <p className="text-sm text-gray-600 mb-4">
                Details how we collect, use, and protect your family's data. Includes COPPA and FERPA compliance information.
              </p>
              <p className="text-xs text-gray-500 mb-3">Version {CURRENT_PRIVACY_POLICY_VERSION}</p>
              <Button
                onClick={() => window.open('/privacy-policy', '_blank')}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Read Privacy Policy
              </Button>
            </div>

            <div className="bg-white border-2 border-pink-300 rounded-xl p-6">
              <FileText className="w-8 h-8 text-pink-600 mb-3" />
              <h3 className="font-bold text-lg mb-2">Terms of Service</h3>
              <p className="text-sm text-gray-600 mb-4">
                Outlines the agreement between you and Mz. Marianna's Academy, including usage rights and responsibilities.
              </p>
              <p className="text-xs text-gray-500 mb-3">Version {CURRENT_TERMS_OF_SERVICE_VERSION}</p>
              <Button
                onClick={() => window.open('/terms-of-service', '_blank')}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Read Terms of Service
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <span className="text-sm">
                I have read and agree to the <strong>Privacy Policy</strong> (Version {CURRENT_PRIVACY_POLICY_VERSION})
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 rounded"
              />
              <span className="text-sm">
                I have read and agree to the <strong>Terms of Service</strong> (Version {CURRENT_TERMS_OF_SERVICE_VERSION})
              </span>
            </label>
          </div>

          {needsCOPPA && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
              <p className="text-sm text-yellow-900">
                <strong>COPPA Notice:</strong> By providing consent, you certify that you are the parent or legal guardian of {studentName} and have the authority to consent to the collection and use of their information as described.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => setCurrentStep(1)}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={!agreedToPrivacy || !agreedToTerms}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Continue to Signature
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: 'Electronic Signature',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Electronic Signature</h2>
            <p className="text-gray-700 mb-6">
              Please type your full legal name to provide electronic consent. This has the same legal weight as a handwritten signature.
            </p>
          </div>

          <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6">
            <h3 className="font-bold mb-3">Consent Summary</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Parent/Guardian:</strong> {parentName}</p>
              <p><strong>Email:</strong> {parentEmail}</p>
              <p><strong>Student:</strong> {studentName}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Type Your Full Legal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Your full legal name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            />
            {signature && signature !== parentName && (
              <p className="text-sm text-yellow-600 mt-2">
                ⚠️ Signature doesn't match parent name on file. Please ensure this is correct.
              </p>
            )}
          </div>

          <div className="bg-cyan-50 border-2 border-cyan-300 rounded-xl p-4">
            <p className="text-sm text-cyan-900">
              By typing your name and clicking "Provide Consent," you agree to all the consents selected above and acknowledge that you have read and agree to our Privacy Policy and Terms of Service.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setCurrentStep(2)}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!signature || loading}
              className="flex-1 h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Provide Consent
                </>
              )}
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    idx <= currentStep
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {idx < currentStep ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-1 w-16 md:w-24 transition-colors ${
                      idx < currentStep ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </p>
        </div>

        {/* Content Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white border-4 border-purple-200 rounded-3xl p-8 shadow-2xl"
        >
          {steps[currentStep].content}
        </motion.div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Questions? Email us at{' '}
            <a href="mailto:privacy@mzmariannas.academy" className="text-purple-600 font-semibold">
              privacy@mzmariannas.academy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  title: string;
  description: string;
}

function ConsentCheckbox({ checked, onChange, required, title, description }: ConsentCheckboxProps) {
  return (
    <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-5 h-5 text-purple-600 rounded"
      />
      <div className="flex-1">
        <div className="font-semibold mb-1">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </label>
  );
}
