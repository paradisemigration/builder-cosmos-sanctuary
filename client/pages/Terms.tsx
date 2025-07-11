import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Scale,
  Mail,
  Users,
} from "lucide-react";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Service - VisaConsult India";
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
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Terms of Service
              </h1>
              <p className="text-lg text-gray-600">
                Please read these terms carefully before using our services.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Last updated: January 15, 2024
              </p>
            </div>
          </div>

          {/* Important Notice */}
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 text-sm">
                By accessing and using VisaConsult India, you agree to be bound
                by these Terms of Service. If you do not agree to these terms,
                please do not use our services. These terms constitute a legal
                agreement between you and VisaConsult India.
              </p>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  By accessing, browsing, or using the VisaConsult India
                  platform ("Service"), you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service
                  ("Terms") and our Privacy Policy.
                </p>
                <p className="text-gray-700">
                  These Terms apply to all users of the Service, including users
                  who browse, register, post content, or use our services in any
                  capacity.
                </p>
              </CardContent>
            </Card>

            {/* Description of Service */}
            <Card>
              <CardHeader>
                <CardTitle>2. Description of Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  VisaConsult India is an online platform that:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>
                    Connects individuals with licensed visa consultants and
                    immigration experts
                  </li>
                  <li>Provides a directory of verified visa consultants</li>
                  <li>
                    Facilitates communication between clients and consultants
                  </li>
                  <li>Offers reviews and ratings for consultants</li>
                  <li>
                    Provides information about visa services and immigration
                    processes
                  </li>
                </ul>
                <p className="text-gray-700 mt-4">
                  <strong>Important:</strong> We are a platform that connects
                  users with independent visa consultants. We do not provide
                  visa consultation services directly.
                </p>
              </CardContent>
            </Card>

            {/* User Accounts and Registration */}
            <Card>
              <CardHeader>
                <CardTitle>3. User Accounts and Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Account Creation
                  </h4>
                  <p className="text-gray-700">
                    To access certain features, you must create an account. You
                    agree to provide accurate, current, and complete information
                    and to keep your account information updated.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Account Security
                  </h4>
                  <p className="text-gray-700">
                    You are responsible for maintaining the confidentiality of
                    your account credentials and for all activities under your
                    account. Notify us immediately of any unauthorized use.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Eligibility
                  </h4>
                  <p className="text-gray-700">
                    You must be at least 18 years old to use our services. By
                    using our Service, you represent that you meet this age
                    requirement.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Conduct */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  4. User Conduct and Prohibited Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    You Agree To:
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Use the Service lawfully and respectfully</li>
                    <li>Provide accurate information in all interactions</li>
                    <li>Respect the privacy and rights of other users</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Report any suspicious or fraudulent activity</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    You May NOT:
                  </h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>
                      Impersonate any person or entity or misrepresent your
                      identity
                    </li>
                    <li>Post false, misleading, or fraudulent information</li>
                    <li>
                      Engage in spam, phishing, or other deceptive practices
                    </li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>
                      Use the Service for any illegal or unauthorized purpose
                    </li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>
                      Post content that is offensive, defamatory, or infringing
                    </li>
                    <li>Interfere with or disrupt the Service or servers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Consultant Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>5. Consultant Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  If you are a visa consultant using our platform, you
                  additionally agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Maintain all required licenses and certifications</li>
                  <li>
                    Provide accurate information about your qualifications and
                    services
                  </li>
                  <li>
                    Respond to client inquiries in a timely and professional
                    manner
                  </li>
                  <li>
                    Comply with all applicable immigration laws and regulations
                  </li>
                  <li>Maintain client confidentiality and data protection</li>
                  <li>
                    Not guarantee visa approval outcomes (as this is beyond
                    anyone's control)
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Reviews and Ratings */}
            <Card>
              <CardHeader>
                <CardTitle>6. Reviews and Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Our platform allows users to leave reviews and ratings:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>
                    Reviews must be based on genuine experiences with
                    consultants
                  </li>
                  <li>Reviews should be honest, fair, and constructive</li>
                  <li>False or defamatory reviews will be removed</li>
                  <li>Consultants may not incentivize positive reviews</li>
                  <li>
                    We reserve the right to moderate and remove inappropriate
                    content
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card>
              <CardHeader>
                <CardTitle>7. Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Platform Fees
                  </h4>
                  <p className="text-gray-700">
                    Consultants may be charged subscription fees for enhanced
                    listings and premium features. All fees are clearly
                    displayed before purchase.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Consultant Fees
                  </h4>
                  <p className="text-gray-700">
                    Payment for consultation services is between clients and
                    consultants directly. VisaConsult India does not process
                    these payments or guarantee service delivery.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Refunds</h4>
                  <p className="text-gray-700">
                    Platform subscription fees may be refunded according to our
                    refund policy. Refunds for consultation services are subject
                    to individual consultant policies.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  8. Important Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-yellow-800">
                  <div>
                    <h4 className="font-semibold mb-2">
                      No Guarantee of Outcomes
                    </h4>
                    <p className="text-sm">
                      We do not guarantee visa approval or any specific
                      outcomes. Visa decisions are made solely by relevant
                      government authorities.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">
                      Independent Consultants
                    </h4>
                    <p className="text-sm">
                      Consultants on our platform are independent professionals.
                      We do not employ them or control their services.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Information Accuracy</h4>
                    <p className="text-sm">
                      While we strive for accuracy, immigration laws and
                      procedures change frequently. Always verify information
                      with official sources.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  9. Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  To the maximum extent permitted by law, VisaConsult India
                  shall not be liable for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>
                    Any indirect, incidental, special, or consequential damages
                  </li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Actions or omissions of consultants or third parties</li>
                  <li>Visa application outcomes or immigration decisions</li>
                  <li>Interruption or termination of services</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Our total liability shall not exceed the amount paid by you
                  for our services in the 12 months preceding the claim.
                </p>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle>10. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  The Service and its content, including but not limited to
                  text, graphics, logos, and software, are owned by or licensed
                  to VisaConsult India and protected by intellectual property
                  laws.
                </p>
                <p className="text-gray-700">
                  You may not copy, modify, distribute, sell, or lease any part
                  of our Service without explicit written permission.
                </p>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>11. Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Your privacy is important to us. Please review our{" "}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  , which explains how we collect, use, and protect your
                  information. By using our Service, you consent to our privacy
                  practices.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle>12. Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  We may suspend or terminate your account and access to the
                  Service at our discretion, without notice, for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Violation of these Terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Harm to other users or our reputation</li>
                  <li>Non-payment of fees (for paid services)</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  You may terminate your account at any time by contacting us.
                  Termination does not relieve you of obligations incurred
                  before termination.
                </p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle>13. Governing Law and Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  These Terms are governed by the laws of India. Any disputes
                  arising from these Terms or your use of the Service will be
                  subject to the exclusive jurisdiction of the courts in New
                  Delhi, India.
                </p>
                <p className="text-gray-700">
                  We encourage resolving disputes through direct communication
                  before pursuing legal action.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle>14. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We may update these Terms periodically to reflect changes in
                  our services or legal requirements. We will notify users of
                  significant changes by email or prominent notice on our
                  website. Continued use of the Service after changes
                  constitutes acceptance of the new Terms.
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
                  If you have questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">
                      Email
                    </div>
                    <a
                      href="mailto:legal@visaconsultindia.com"
                      className="text-blue-600 hover:underline"
                    >
                      legal@visaconsultindia.com
                    </a>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">
                      Address
                    </div>
                    <div className="text-blue-700">
                      VisaConsult India
                      <br />
                      Legal Department
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
                <Link to="/privacy">Read Privacy Policy</Link>
              </Button>
              <Button asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              These terms are effective as of January 15, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
