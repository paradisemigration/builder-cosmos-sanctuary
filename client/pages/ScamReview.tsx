import { useParams, Link } from "react-router-dom";
import {
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Building2,
  FileText,
  Image as ImageIcon,
  Calendar,
  Shield,
  ArrowLeft,
  Flag,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";

// Mock data - In a real app, this would come from your backend
const mockScamReports = {
  "dubai/fake-immigration-services": {
    companyName: "Fake Immigration Services",
    location: "Dubai, UAE",
    contactNumber: "+971-4-123-4567",
    emailId: "contact@fakeimmigration.com",
    scamDescription:
      "This company promised to process my visa within 2 weeks for $5000. After taking my money, they stopped responding to my calls and emails. Their office address doesn't exist and their website has been taken down. They created fake government stamps and documents. I later found out they are not licensed to provide immigration services. Please avoid this company at all costs.",
    reportDate: "2024-01-15",
    verificationStatus: "verified",
    evidenceCount: 3,
  },
};

export default function ScamReview() {
  const { location, companyName } = useParams();
  const reportKey = `${location}/${companyName}`;
  const report = mockScamReports[reportKey as keyof typeof mockScamReports];

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Scam Report Not Found
              </h1>
              <p className="text-gray-600 mb-8">
                The scam report you're looking for doesn't exist or hasn't been
                published yet.
              </p>
              <Link to="/browse">
                <Button className="bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Browse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <Navigation />

      {/* Warning Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            <span>
              SCAM ALERT - This company has been reported for fraudulent
              activities
            </span>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-purple-200/20 rounded-full blur-3xl animate-float-medium"></div>
      </div>

      <div className="relative pt-6 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/browse">
              <Button
                variant="outline"
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Browse
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Scam Report: {report.companyName}
                  </h1>
                  <div className="flex items-center gap-4 text-red-100">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{report.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Reported on{" "}
                        {new Date(report.reportDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {report.verificationStatus === "verified"
                      ? "Verified Report"
                      : "Under Review"}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-600" />
                Reported Company Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <Phone className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Contact Number</p>
                    <p className="font-medium text-red-700">
                      {report.contactNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <Mail className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-red-700">{report.emailId}</p>
                  </div>
                </div>
              </div>

              {/* Warning Notice */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      ⚠️ SCAM WARNING
                    </h3>
                    <p className="text-red-700">
                      <strong>DO NOT</strong> contact this company or provide
                      them with any money, documents, or personal information.
                      This company has been reported for fraudulent activities
                      and may not be licensed to provide immigration services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scam Details */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-600" />
              Detailed Scam Report
            </h2>

            <div className="prose max-w-none">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {report.scamDescription}
                </p>
              </div>
            </div>

            {/* Evidence Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-600" />
                Supporting Evidence
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-yellow-800 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">
                    {report.evidenceCount} pieces of evidence
                  </span>
                  have been submitted and verified by our team (payment
                  receipts, agreements, communications).
                </p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Protect Yourself and Others
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Been Scammed Too?
                </h3>
                <p className="text-blue-700 mb-4">
                  If you've also been scammed by this company, please report it
                  to help protect others.
                </p>
                <Link to="/report">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Flag className="w-4 h-4 mr-2" />
                    Report This Company
                  </Button>
                </Link>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  Find Legitimate Services
                </h3>
                <p className="text-green-700 mb-4">
                  Browse verified and trusted immigration service providers in
                  your area.
                </p>
                <Link to="/browse">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Shield className="w-4 h-4 mr-2" />
                    Browse Trusted Companies
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">
                Tips to Avoid Immigration Scams
              </h3>
              <ul className="text-orange-700 space-y-2">
                <li>
                  • Verify the company's license with government authorities
                </li>
                <li>
                  • Never pay large sums upfront without proper documentation
                </li>
                <li>
                  • Research the company online and check reviews from multiple
                  sources
                </li>
                <li>• Be wary of companies that guarantee specific outcomes</li>
                <li>• Always get agreements and receipts in writing</li>
                <li>• Report suspicious activities to local authorities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
