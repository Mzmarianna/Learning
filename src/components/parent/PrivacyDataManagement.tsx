import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Download, Trash2, Eye, Settings, Check, AlertCircle, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import {
  getParentalConsent,
  updateParentalConsent,
  requestDataExport,
  requestDataDeletion,
  ParentalConsent,
} from '../../lib/privacy-compliance';

interface PrivacyDataManagementProps {
  parentId: string;
  studentId: string;
  studentName: string;
}

export default function PrivacyDataManagement({
  parentId,
  studentId,
  studentName,
}: PrivacyDataManagementProps) {
  const [consent, setConsent] = useState<ParentalConsent | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportStatus, setExportStatus] = useState<'idle' | 'requesting' | 'processing' | 'ready'>('idle');
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'requesting' | 'scheduled'>('idle');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadConsent();
  }, [studentId]);

  const loadConsent = async () => {
    try {
      const data = await getParentalConsent(studentId);
      setConsent(data);
    } catch (error) {
      console.error('Error loading consent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConsent = async (key: keyof ParentalConsent['consents'], value: boolean) => {
    if (!consent) return;

    try {
      await updateParentalConsent(studentId, { [key]: value });
      setConsent({
        ...consent,
        consents: { ...consent.consents, [key]: value },
      });
    } catch (error) {
      console.error('Error updating consent:', error);
      alert('Failed to update consent. Please try again.');
    }
  };

  const handleExportData = async () => {
    setExportStatus('requesting');
    try {
      const requestId = await requestDataExport(parentId, studentId);
      setExportStatus('processing');
      
      // Simulate processing time
      setTimeout(() => {
        setExportStatus('ready');
      }, 3000);
      
      alert('Your data export is being prepared. You\'ll receive an email when it\'s ready (typically within 24 hours).');
    } catch (error) {
      console.error('Error requesting export:', error);
      alert('Failed to request data export. Please try again.');
      setExportStatus('idle');
    }
  };

  const handleDeleteData = async () => {
    setDeleteStatus('requesting');
    try {
      await requestDataDeletion(
        parentId,
        studentId,
        studentName,
        {
          studentProfile: true,
          learningData: true,
          communications: true,
          billingHistory: false, // Retained for legal/tax
        },
        'Parent-requested deletion'
      );
      
      setDeleteStatus('scheduled');
      setShowDeleteConfirm(false);
      
      alert(`Account deletion has been scheduled for ${studentName}. You have 30 days to cancel this request if you change your mind.`);
    } catch (error) {
      console.error('Error requesting deletion:', error);
      alert('Failed to request account deletion. Please try again.');
      setDeleteStatus('idle');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!consent) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
        <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
        <p className="text-center text-yellow-900">
          No consent record found for {studentName}. This shouldn't happen. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Privacy & Data Management</h2>
        </div>
        <p className="text-purple-100">
          Manage data collection preferences and exercise your privacy rights for {studentName}
        </p>
      </div>

      {/* Consent Status */}
      <div className="bg-white border-2 border-green-300 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Check className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold">Consent Status: Active</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <p><strong>Consent Given:</strong> {consent.consentGivenAt.toLocaleDateString()}</p>
          <p><strong>Privacy Policy Version:</strong> {consent.privacyPolicyVersion}</p>
          <p><strong>Last Updated:</strong> {consent.updatedAt?.toLocaleDateString() || 'Never'}</p>
          <p><strong>COPPA Compliant:</strong> {consent.coppaCompliant ? 'Yes' : 'N/A'}</p>
        </div>
      </div>

      {/* Data Collection Preferences */}
      <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold">Data Collection Preferences</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          You can update these preferences at any time. Changes take effect immediately.
        </p>

        <div className="space-y-3">
          <ConsentToggle
            checked={consent.consents.dataCollection}
            onChange={(checked) => handleUpdateConsent('dataCollection', checked)}
            required
            title="Educational Data Collection"
            description="Required for core learning features"
          />

          <ConsentToggle
            checked={consent.consents.dataSharing}
            onChange={(checked) => handleUpdateConsent('dataSharing', checked)}
            required
            title="Data Sharing with Tutors"
            description="Required for personalized tutoring"
          />

          <ConsentToggle
            checked={consent.consents.progressReports}
            onChange={(checked) => handleUpdateConsent('progressReports', checked)}
            required
            title="Progress Reports & Analytics"
            description="Required for parent dashboard features"
          />

          <ConsentToggle
            checked={consent.consents.emailCommunication}
            onChange={(checked) => handleUpdateConsent('emailCommunication', checked)}
            title="Parent Email Communication"
            description="Weekly reports and important updates"
          />

          <ConsentToggle
            checked={consent.consents.studentEmailCommunication}
            onChange={(checked) => handleUpdateConsent('studentEmailCommunication', checked)}
            title="Student Email Communication"
            description="Motivational messages and reminders"
          />

          <ConsentToggle
            checked={consent.consents.thirdPartyTools}
            onChange={(checked) => handleUpdateConsent('thirdPartyTools', checked)}
            required
            title="Third-Party Educational Tools"
            description="Required for video classes and content delivery"
          />

          <ConsentToggle
            checked={consent.consents.researchParticipation}
            onChange={(checked) => handleUpdateConsent('researchParticipation', checked)}
            title="Anonymous Research Participation"
            description="Help improve our platform (fully anonymized)"
          />
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white border-2 border-cyan-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-6 h-6 text-cyan-600" />
          <h3 className="text-xl font-bold">Export Your Data</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Download a complete copy of {studentName}'s educational records, including learning progress, assessments, and portfolio items. The export will be delivered via email within 24 hours.
        </p>

        {exportStatus === 'idle' && (
          <Button
            onClick={handleExportData}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Request Data Export
          </Button>
        )}

        {exportStatus === 'requesting' && (
          <div className="bg-cyan-50 border border-cyan-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-cyan-600 border-t-transparent rounded-full"></div>
              <p className="text-cyan-900">Submitting request...</p>
            </div>
          </div>
        )}

        {exportStatus === 'processing' && (
          <div className="bg-cyan-50 border border-cyan-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyan-600" />
              <div>
                <p className="font-semibold text-cyan-900">Export in Progress</p>
                <p className="text-sm text-cyan-700">You'll receive an email when your data is ready (typically within 24 hours)</p>
              </div>
            </div>
          </div>
        )}

        {exportStatus === 'ready' && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Export Ready!</p>
                <p className="text-sm text-green-700">Check your email for the download link</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            ℹ️ Export includes: Student profile, learning progress, quest history, assessment results, portfolio submissions, and communication history. Export links expire after 7 days for security.
          </p>
        </div>
      </div>

      {/* Data Deletion */}
      <div className="bg-white border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-bold">Delete Account & Data</h3>
        </div>
        
        {deleteStatus === 'idle' && (
          <>
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-900">
                <strong>⚠️ Warning:</strong> This will permanently delete {studentName}'s account and all associated learning data. This action cannot be undone.
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              What will be deleted:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mb-4 ml-4">
              <li>Student profile and account access</li>
              <li>All learning progress and quest history</li>
              <li>Assessment results and competency data</li>
              <li>Portfolio submissions and communications</li>
            </ul>

            <p className="text-sm text-gray-600 mb-4">
              What will be retained (required by law):
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mb-6 ml-4">
              <li>Billing and payment records (7 years for tax purposes)</li>
              <li>Security audit logs (7 years for compliance)</li>
            </ul>

            {!showDeleteConfirm ? (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="outline"
                className="border-2 border-red-400 text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Request Account Deletion
              </Button>
            ) : (
              <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4">
                <p className="font-bold text-red-900 mb-3">
                  Are you absolutely sure you want to delete {studentName}'s account?
                </p>
                <p className="text-sm text-red-800 mb-4">
                  Deletion will be scheduled for 30 days from now, giving you time to cancel if you change your mind.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteData}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Yes, Delete Account
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {deleteStatus === 'scheduled' && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-900">Deletion Scheduled</p>
                <p className="text-sm text-yellow-800">
                  {studentName}'s account will be deleted in 30 days. You can cancel this request from your Parent Dashboard.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Privacy Policy */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-bold">Privacy Resources</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => window.open('/privacy-policy', '_blank')}
            variant="outline"
          >
            View Privacy Policy
          </Button>
          <Button
            onClick={() => window.open('/terms-of-service', '_blank')}
            variant="outline"
          >
            View Terms of Service
          </Button>
          <Button
            onClick={() => window.location.href = 'mailto:privacy@mzmariannas.academy'}
            variant="outline"
          >
            Contact Privacy Officer
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ConsentToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  title: string;
  description: string;
}

function ConsentToggle({ checked, onChange, required, title, description }: ConsentToggleProps) {
  return (
    <div className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-colors">
      <div className="flex items-center h-6">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={required}
          className="w-5 h-5 text-purple-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <div className="flex-1">
        <div className="font-semibold mb-1">
          {title}
          {required && <span className="text-red-500 ml-1 text-sm">(Required)</span>}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
