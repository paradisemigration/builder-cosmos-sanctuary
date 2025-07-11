import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  UserCheck,
  Database,
  Mail,
} from "lucide-react";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy - VisaConsult India";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg text-gray-600">
                Your privacy is important to us. Learn how we collect, use, and
                protect your information.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Last updated: January 15, 2024
              </p>
            </div>
          </div>

          {/* Quick Overview */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Eye className="h-5 w-5" />
                Privacy Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Lock className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-800">
                      Data Security
                    </div>
                    <div className="text-blue-700">
                      Your data is encrypted and secure
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <UserCheck className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-800">
                      Your Control
                    </div>
                    <div className="text-blue-700">
                      You control your information
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Database className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-blue-800">No Sale</div>
                    <div className="text-blue-700">We never sell your data</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="space-y-8">
            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Personal Information
                  </h4>
                  <p className="text-gray-700 mb-2">
                    When you use our service, we may collect:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Name, email address, and phone number</li>
                    <li>Profile information and preferences</li>
                    <li>Business information (for consultants)</li>
                    <li>Communication records and inquiries</li>
                    <li>Reviews and ratings you provide</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Technical Information
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>IP address and device information</li>
                    <li>Browser type and operating system</li>
                    <li>Usage data and analytics</li>
                    <li>Cookies and similar technologies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>
                    <strong>Provide our services:</strong> Connect you with visa
                    consultants and facilitate communication
                  </li>
                  <li>
                    <strong>Improve user experience:</strong> Personalize
                    content and recommendations
                  </li>
                  <li>
                    <strong>Ensure security:</strong> Verify identities and
                    prevent fraud
                  </li>
                  <li>
                    <strong>Communication:</strong> Send updates, notifications,
                    and respond to inquiries
                  </li>
                  <li>
                    <strong>Analytics:</strong> Understand how our platform is
                    used to improve services
                  </li>
                  <li>
                    <strong>Legal compliance:</strong> Meet regulatory
                    requirements and legal obligations
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <CardTitle>3. Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    With Visa Consultants
                  </h4>
                  <p className="text-gray-700">
                    When you contact a consultant through our platform, we share
                    your inquiry details and contact information with them to
                    facilitate the service.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    We Do NOT Share Information With:
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Third-party marketers or advertisers</li>
                    <li>Data brokers or aggregators</li>
                    <li>Anyone for commercial purposes without your consent</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Legal Requirements
                  </h4>
                  <p className="text-gray-700">
                    We may disclose information when required by law, court
                    order, or government request, or to protect our rights and
                    safety.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle>4. Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We implement comprehensive security measures:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>
                    <strong>Encryption:</strong> All data is encrypted in
                    transit and at rest
                  </li>
                  <li>
                    <strong>Access Controls:</strong> Strict access controls and
                    authentication
                  </li>
                  <li>
                    <strong>Regular Audits:</strong> Security audits and
                    vulnerability assessments
                  </li>
                  <li>
                    <strong>Secure Infrastructure:</strong> Industry-standard
                    hosting and security protocols
                  </li>
                  <li>
                    <strong>Staff Training:</strong> Regular security training
                    for all employees
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle>5. Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal
                    information
                  </li>
                  <li>
                    <strong>Correct:</strong> Update or correct inaccurate
                    information
                  </li>
                  <li>
                    <strong>Delete:</strong> Request deletion of your personal
                    information
                  </li>
                  <li>
                    <strong>Portability:</strong> Request your data in a
                    portable format
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from marketing
                    communications
                  </li>
                  <li>
                    <strong>Restrict:</strong> Limit how we process your
                    information
                  </li>
                </ul>
                <p className="text-gray-700 mt-4">
                  To exercise these rights, contact us at{" "}
                  <a
                    href="mailto:privacy@visaconsultindia.com"
                    className="text-blue-600 hover:underline"
                  >
                    privacy@visaconsultindia.com
                  </a>
                </p>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <CardTitle>6. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Essential website functionality</li>
                  <li>User authentication and security</li>
                  <li>Analytics and performance monitoring</li>
                  <li>User preferences and settings</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  You can control cookies through your browser settings.
                  However, disabling cookies may affect website functionality.
                </p>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle>7. Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We retain personal information only as long as necessary for
                  the purposes outlined in this policy, typically:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
                  <li>
                    Account information: While your account is active and for 2
                    years after deletion
                  </li>
                  <li>
                    Communication records: 3 years for customer support purposes
                  </li>
                  <li>
                    Analytics data: Aggregated and anonymized data may be
                    retained longer
                  </li>
                  <li>Legal requirements: As required by applicable law</li>
                </ul>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card>
              <CardHeader>
                <CardTitle>8. International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Your information may be transferred to and processed in
                  countries other than India. We ensure adequate protection
                  through appropriate safeguards and compliance with applicable
                  data protection laws.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>9. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Our services are not intended for children under 16. We do not
                  knowingly collect personal information from children. If you
                  believe we have collected information from a child, please
                  contact us immediately.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Policy */}
            <Card>
              <CardHeader>
                <CardTitle>10. Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We may update this Privacy Policy periodically. We will notify
                  you of significant changes by email or through our website.
                  The "Last updated" date at the top indicates when the policy
                  was last revised.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Mail className="h-5 w-5" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 mb-4">
                  If you have questions about this Privacy Policy or our privacy
                  practices, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">
                      Email
                    </div>
                    <a
                      href="mailto:privacy@visaconsultindia.com"
                      className="text-blue-600 hover:underline"
                    >
                      privacy@visaconsultindia.com
                    </a>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">
                      Address
                    </div>
                    <div className="text-blue-700">
                      VisaConsult India
                      <br />
                      Privacy Officer
                      <br />
                      New Delhi, India
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline">
                <Link to="/terms">Read Terms of Service</Link>
              </Button>
              <Button asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              This policy is effective as of January 15, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
