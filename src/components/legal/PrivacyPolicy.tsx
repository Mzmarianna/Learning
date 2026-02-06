import { FileText, Shield, Lock, Eye, Download, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { CURRENT_PRIVACY_POLICY_VERSION } from '../../lib/privacy-compliance';

export default function PrivacyPolicy() {
  const lastUpdated = 'January 9, 2026';

  return (
    <div className="min-h-screen bg-calm-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
              <p className="text-purple-100">Version {CURRENT_PRIVACY_POLICY_VERSION}</p>
            </div>
          </div>
          <p className="text-lg">
            Protecting your family's privacy is our top priority. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-purple-100 mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-lg mb-4">Quick Navigation</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <a href="#information-we-collect" className="text-purple-600 hover:underline text-sm">→ What Information We Collect</a>
            <a href="#how-we-use" className="text-purple-600 hover:underline text-sm">→ How We Use Your Information</a>
            <a href="#coppa" className="text-purple-600 hover:underline text-sm">→ COPPA Compliance (Under 13)</a>
            <a href="#ferpa" className="text-purple-600 hover:underline text-sm">→ FERPA Compliance</a>
            <a href="#your-rights" className="text-purple-600 hover:underline text-sm">→ Your Rights & Choices</a>
            <a href="#data-security" className="text-purple-600 hover:underline text-sm">→ Data Security</a>
            <a href="#third-parties" className="text-purple-600 hover:underline text-sm">→ Third-Party Services</a>
            <a href="#contact" className="text-purple-600 hover:underline text-sm">→ Contact Us</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <Section
            id="introduction"
            icon={FileText}
            title="Introduction"
            content={
              <div className="space-y-4">
                <p>
                  Welcome to Mz. Marianna's Academy ("we," "us," or "our"). We are committed to protecting the privacy and security of students (ages 12-18) and their families.
                </p>
                <p>
                  This Privacy Policy explains:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>What information we collect</li>
                  <li>How we use and protect that information</li>
                  <li>Your rights and choices regarding your data</li>
                  <li>How we comply with COPPA, FERPA, and state privacy laws</li>
                </ul>
                <div className="bg-cyan-50 border-2 border-cyan-300 rounded-xl p-4 mt-4">
                  <p className="font-semibold text-cyan-900">
                    ⚠️ Important: We are NOT designed to collect Personally Identifiable Information (PII) beyond what's necessary for educational services. We do NOT sell student data. We do NOT use student data for advertising.
                  </p>
                </div>
              </div>
            }
          />

          {/* Information We Collect */}
          <Section
            id="information-we-collect"
            icon={Eye}
            title="What Information We Collect"
            content={
              <div className="space-y-4">
                <h3 className="font-bold text-lg">1. Information You Provide Directly</h3>
                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-semibold">Parent/Guardian Information:</p>
                    <ul className="list-disc list-inside ml-4 text-gray-700">
                      <li>Name, email address, phone number</li>
                      <li>Billing and payment information</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Student Information:</p>
                    <ul className="list-disc list-inside ml-4 text-gray-700">
                      <li>First name, age/grade level (NOT full date of birth)</li>
                      <li>Learning profile (from placement quiz)</li>
                      <li>Avatar customization choices</li>
                      <li>Accessibility preferences (dyslexic font, high contrast, etc.)</li>
                    </ul>
                  </div>
                </div>

                <h3 className="font-bold text-lg mt-6">2. Educational Data We Collect Automatically</h3>
                <div className="ml-4">
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Learning progress (lessons completed, quests finished)</li>
                    <li>Quiz and assessment results</li>
                    <li>Competency mastery levels (aligned with Common Core standards)</li>
                    <li>Time spent on lessons and activities</li>
                    <li>XP earned and achievements unlocked</li>
                    <li>Portfolio submissions (writing samples, projects)</li>
                  </ul>
                </div>

                <h3 className="font-bold text-lg mt-6">3. Technical Data</h3>
                <div className="ml-4">
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Device type and browser information</li>
                    <li>IP address (for security purposes only)</li>
                    <li>Login times and session duration</li>
                    <li>Error logs and app performance data</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 mt-4">
                  <p className="font-semibold text-purple-900">
                    ✅ We do NOT collect: Social Security Numbers, precise geolocation, biometric data, or any information not directly related to educational services.
                  </p>
                </div>
              </div>
            }
          />

          {/* How We Use Information */}
          <Section
            id="how-we-use"
            icon={Shield}
            title="How We Use Your Information"
            content={
              <div className="space-y-4">
                <p>We use the information we collect ONLY for educational purposes:</p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Personalized Learning</p>
                      <p className="text-gray-700 text-sm">Adaptive assignment of quests, lessons, and difficulty levels based on competency assessments.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Progress Tracking</p>
                      <p className="text-gray-700 text-sm">Monitor learning growth, generate progress reports, and identify areas needing support.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Tutor Support</p>
                      <p className="text-gray-700 text-sm">Share student progress with assigned tutors to enable personalized instruction.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Parent Communication</p>
                      <p className="text-gray-700 text-sm">Send weekly progress reports, class schedules, and important updates to parents.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Platform Improvement</p>
                      <p className="text-gray-700 text-sm">Analyze anonymized usage data to improve our adaptive learning algorithms and user experience.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Security & Compliance</p>
                      <p className="text-gray-700 text-sm">Detect and prevent fraud, maintain system security, and comply with legal obligations.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mt-6">
                  <p className="font-bold text-red-900 mb-2">❌ We NEVER:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-800 ml-4">
                    <li>Sell or rent student data to third parties</li>
                    <li>Use student data for advertising or marketing</li>
                    <li>Create behavioral profiles for non-educational purposes</li>
                    <li>Share data without parental consent (except as required by law)</li>
                  </ul>
                </div>
              </div>
            }
          />

          {/* COPPA Compliance */}
          <Section
            id="coppa"
            icon={Shield}
            title="COPPA Compliance (Students Under 13)"
            content={
              <div className="space-y-4">
                <p>
                  The Children's Online Privacy Protection Act (COPPA) provides additional protections for children under 13. While our platform is designed for ages 12-18, we comply with COPPA for any students under 13.
                </p>
                
                <h3 className="font-bold text-lg">Verifiable Parental Consent</h3>
                <p className="ml-4 text-gray-700">
                  Before collecting any information from a student under 13, we obtain verifiable parental consent through our electronic consent process, which includes email verification and electronic signature.
                </p>

                <h3 className="font-bold text-lg">Parent Rights</h3>
                <div className="ml-4 space-y-2">
                  <p className="text-gray-700">Parents of students under 13 can:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Review their child's personal information</li>
                    <li>Request deletion of their child's information</li>
                    <li>Refuse to allow further collection or use of their child's information</li>
                    <li>Revoke consent at any time</li>
                  </ul>
                </div>

                <h3 className="font-bold text-lg">Data Minimization</h3>
                <p className="ml-4 text-gray-700">
                  We only collect information that is reasonably necessary for educational activities and do not require children to provide more information than necessary to participate.
                </p>
              </div>
            }
          />

          {/* FERPA Compliance */}
          <Section
            id="ferpa"
            icon={Lock}
            title="FERPA Compliance"
            content={
              <div className="space-y-4">
                <p>
                  The Family Educational Rights and Privacy Act (FERPA) protects the privacy of student education records. We comply with FERPA as an educational service provider.
                </p>

                <h3 className="font-bold text-lg">Your FERPA Rights</h3>
                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-semibold">Right to Inspect and Review</p>
                    <p className="text-gray-700 text-sm">Parents can review all educational records we maintain about their child through the Parent Dashboard or by requesting a data export.</p>
                  </div>

                  <div>
                    <p className="font-semibold">Right to Request Amendment</p>
                    <p className="text-gray-700 text-sm">If you believe information is inaccurate or misleading, you can request corrections through your Parent Dashboard or by contacting us.</p>
                  </div>

                  <div>
                    <p className="font-semibold">Right to Consent to Disclosures</p>
                    <p className="text-gray-700 text-sm">We will not share your child's educational records without your consent, except in specific circumstances allowed by law (e.g., to tutors providing direct services, for safety emergencies, or pursuant to legal process).</p>
                  </div>
                </div>
              </div>
            }
          />

          {/* Your Rights */}
          <Section
            id="your-rights"
            icon={Download}
            title="Your Rights & Choices"
            content={
              <div className="space-y-4">
                <p>
                  You have the following rights regarding your family's data:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <RightCard
                    icon={Eye}
                    title="Access Your Data"
                    description="View all information we have about your family through your Parent Dashboard or request a complete data export."
                  />

                  <RightCard
                    icon={Download}
                    title="Export Your Data"
                    description="Download a complete copy of your student's educational records in machine-readable format."
                  />

                  <RightCard
                    icon={Trash2}
                    title="Delete Your Data"
                    description="Request deletion of your account and student records. We'll retain only what's legally required."
                  />

                  <RightCard
                    icon={Shield}
                    title="Update Consents"
                    description="Change your consent preferences at any time through your Parent Dashboard settings."
                  />
                </div>

                <h3 className="font-bold text-lg mt-6">How to Exercise Your Rights</h3>
                <div className="bg-cyan-50 border-2 border-cyan-300 rounded-xl p-4">
                  <p className="text-cyan-900 mb-3">You can manage your privacy settings through:</p>
                  <ul className="list-disc list-inside space-y-1 text-cyan-800 ml-4">
                    <li>Your Parent Dashboard (Settings → Privacy & Data)</li>
                    <li>Email: <a href="mailto:privacy@mzmariannas.academy" className="font-semibold underline">privacy@mzmariannas.academy</a></li>
                    <li>Response time: Within 30 days of request</li>
                  </ul>
                </div>
              </div>
            }
          />

          {/* Data Security */}
          <Section
            id="data-security"
            icon={Lock}
            title="Data Security"
            content={
              <div className="space-y-4">
                <p>We protect your information using industry-standard security measures:</p>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
                    <p className="font-bold text-purple-900 mb-2">🔒 Encryption</p>
                    <p className="text-sm text-purple-800">All data is encrypted in transit (HTTPS/TLS) and at rest (AES-256).</p>
                  </div>

                  <div className="bg-pink-50 border-2 border-pink-300 rounded-xl p-4">
                    <p className="font-bold text-pink-900 mb-2">🔐 Access Controls</p>
                    <p className="text-sm text-pink-800">Role-based access ensures only authorized personnel can access student data.</p>
                  </div>

                  <div className="bg-cyan-50 border-2 border-cyan-300 rounded-xl p-4">
                    <p className="font-bold text-cyan-900 mb-2">📝 Audit Logging</p>
                    <p className="text-sm text-cyan-800">All access to student data is logged for security monitoring.</p>
                  </div>

                  <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                    <p className="font-bold text-green-900 mb-2">💾 Secure Backups</p>
                    <p className="text-sm text-green-800">Regular encrypted backups ensure data is never lost.</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-4">
                  While we use robust security measures, no system is 100% secure. We continuously monitor and update our security practices.
                </p>
              </div>
            }
          />

          {/* Third Parties */}
          <Section
            id="third-parties"
            icon={Shield}
            title="Third-Party Services"
            content={
              <div className="space-y-4">
                <p>We use carefully vetted third-party services that are COPPA/FERPA compliant:</p>

                <div className="space-y-3 mt-4">
                  <ThirdPartyService
                    name="Supabase (PostgreSQL)"
                    purpose="Secure database, authentication, and file storage"
                    compliance="COPPA/FERPA compliant with signed Data Processing Addendum"
                  />

                  <ThirdPartyService
                    name="Zoom Video Communications"
                    purpose="Live tutoring sessions"
                    compliance="FERPA compliant, K-12 approved"
                  />

                  <ThirdPartyService
                    name="Shopify"
                    purpose="Payment processing and billing"
                    compliance="PCI-DSS compliant, no student data shared"
                  />
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mt-4">
                  <p className="text-yellow-900">
                    <strong>Important:</strong> We have Data Processing Agreements with all third-party vendors that access student data. These agreements prohibit them from using student data for their own purposes.
                  </p>
                </div>
              </div>
            }
          />

          {/* Data Retention */}
          <Section
            id="data-retention"
            title="Data Retention"
            content={
              <div className="space-y-4">
                <p>We retain student data only as long as necessary:</p>

                <div className="space-y-2 ml-4">
                  <p><strong>Active Students:</strong> Data retained while account is active</p>
                  <p><strong>Closed Accounts:</strong> Educational records retained for 7 years (standard for educational institutions), then automatically deleted</p>
                  <p><strong>Billing Records:</strong> Retained for 7 years for tax/legal compliance</p>
                  <p><strong>Audit Logs:</strong> Retained for 7 years for security and compliance</p>
                </div>

                <p className="text-sm text-gray-600 mt-4">
                  You can request early deletion at any time. Some records may be retained if legally required (e.g., financial records for tax purposes).
                </p>
              </div>
            }
          />

          {/* Changes to Policy */}
          <Section
            id="changes"
            title="Changes to This Privacy Policy"
            content={
              <div className="space-y-4">
                <p>
                  We may update this Privacy Policy periodically. If we make material changes, we will:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Notify you via email at least 30 days before changes take effect</li>
                  <li>Update the "Last Updated" date at the top of this policy</li>
                  <li>Request renewed consent if required by law</li>
                  <li>Maintain previous versions for your reference</li>
                </ul>

                <p className="text-sm text-gray-600 mt-4">
                  Continued use of our services after changes take effect constitutes acceptance of the updated policy.
                </p>
              </div>
            }
          />

          {/* Contact */}
          <Section
            id="contact"
            icon={FileText}
            title="Contact Us"
            content={
              <div className="space-y-4">
                <p>If you have questions about this Privacy Policy or our privacy practices:</p>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6">
                  <p className="font-bold text-lg mb-4">Mz. Marianna's Academy</p>
                  <div className="space-y-2">
                    <p><strong>Privacy Officer:</strong> [Name]</p>
                    <p><strong>Email:</strong> <a href="mailto:privacy@mzmariannas.academy" className="text-purple-600 underline">privacy@mzmariannas.academy</a></p>
                    <p><strong>Phone:</strong> [Phone Number]</p>
                    <p><strong>Mail:</strong> [Physical Address]</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  We aim to respond to all privacy inquiries within 5 business days.
                </p>
              </div>
            }
          />
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex gap-4 justify-center">
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-2 border-purple-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Print or Save as PDF
          </Button>
          <Button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            Return to Application
          </Button>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  id?: string;
  icon?: any;
  title: string;
  content: React.ReactNode;
}

function Section({ id, icon: Icon, title, content }: SectionProps) {
  return (
    <div id={id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 scroll-mt-20">
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="w-6 h-6 text-purple-600" />}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="text-gray-800">{content}</div>
    </div>
  );
}

interface RightCardProps {
  icon: any;
  title: string;
  description: string;
}

function RightCard({ icon: Icon, title, description }: RightCardProps) {
  return (
    <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
      <Icon className="w-6 h-6 text-purple-600 mb-2" />
      <h4 className="font-bold text-purple-900 mb-2">{title}</h4>
      <p className="text-sm text-purple-800">{description}</p>
    </div>
  );
}

interface ThirdPartyServiceProps {
  name: string;
  purpose: string;
  compliance: string;
}

function ThirdPartyService({ name, purpose, compliance }: ThirdPartyServiceProps) {
  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl p-4">
      <p className="font-bold text-gray-900">{name}</p>
      <p className="text-sm text-gray-700 mt-1"><strong>Purpose:</strong> {purpose}</p>
      <p className="text-sm text-green-700 mt-1">✅ {compliance}</p>
    </div>
  );
}