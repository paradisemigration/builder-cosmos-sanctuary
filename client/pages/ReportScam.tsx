import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Upload,
  FileImage,
  FileText,
  X,
  Shield,
  MapPin,
  Phone,
  Mail,
  Building2,
  Camera,
  Receipt,
  FileText as FileContract,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";

interface FormData {
  companyName: string;
  location: string;
  contactNumber: string;
  emailId: string;
  scamDescription: string;
  paymentReceipt: File | null;
  agreement: File | null;
  companyPicture: File | null;
}

interface FormErrors {
  companyName?: string;
  location?: string;
  contactNumber?: string;
  emailId?: string;
  scamDescription?: string;
  paymentReceipt?: string;
  agreement?: string;
}

export default function ReportScam() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    location: "",
    contactNumber: "",
    emailId: "",
    scamDescription: "",
    paymentReceipt: null,
    agreement: null,
    companyPicture: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [wordCount, setWordCount] = useState(0);

  const paymentReceiptRef = useRef<HTMLInputElement>(null);
  const agreementRef = useRef<HTMLInputElement>(null);
  const companyPictureRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid contact number";
    }

    if (!formData.emailId.trim()) {
      newErrors.emailId = "Email ID is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = "Please enter a valid email address";
    }

    if (!formData.scamDescription.trim()) {
      newErrors.scamDescription = "Scam description is required";
    } else if (wordCount > 250) {
      newErrors.scamDescription = "Description cannot exceed 250 words";
    }

    if (!formData.paymentReceipt) {
      newErrors.paymentReceipt = "Payment receipt screenshot is required";
    }

    if (!formData.agreement) {
      newErrors.agreement = "Agreement screenshot is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "scamDescription") {
      const words = value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(words.length);
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (
    field: "paymentReceipt" | "agreement" | "companyPicture",
    file: File | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: file }));

    // Clear error when user uploads a file
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const removeFile = (
    field: "paymentReceipt" | "agreement" | "companyPicture",
  ) => {
    setFormData((prev) => ({ ...prev, [field]: null }));

    // Reset the file input
    if (field === "paymentReceipt" && paymentReceiptRef.current) {
      paymentReceiptRef.current.value = "";
    } else if (field === "agreement" && agreementRef.current) {
      agreementRef.current.value = "";
    } else if (field === "companyPicture" && companyPictureRef.current) {
      companyPictureRef.current.value = "";
    }
  };

  const formatFileName = (name: string) => {
    return name.length > 20 ? name.substring(0, 20) + "..." : name;
  };

  const createReviewUrl = (companyName: string, location: string): string => {
    const formatForUrl = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    return `reviews/${formatForUrl(location)}/${formatForUrl(companyName)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create the review URL
      const reviewUrl = createReviewUrl(
        formData.companyName,
        formData.location,
      );

      setIsSubmitted(true);

      // Note: Don't redirect immediately since reports need admin approval first
    } catch (error) {
      console.error("Error submitting scam report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
        <Navigation />
        <div className="pt-20 pb-10">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl border border-green-200 p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-800 mb-4">
                Report Submitted Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for reporting this scam. Your report helps protect
                others in our community.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-700">
                  <strong>🔍 Review Process:</strong>
                  <br />
                  Your report has been submitted to our administrators for
                  review. Once verified and approved, it will be published at:
                  <br />
                  <span className="font-mono text-orange-600 block mt-2">
                    /{createReviewUrl(formData.companyName, formData.location)}
                  </span>
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-yellow-700">
                  <strong>⏰ Timeline:</strong> Admin review typically takes
                  24-48 hours. You'll be notified once your report is live.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Thank you for helping keep our community safe!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <Navigation />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-purple-200/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-orange-200/30 rounded-full blur-3xl animate-float-medium"></div>
      </div>

      <div className="relative pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Report a Scam
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help protect our community by reporting fraudulent immigration
              companies and scams
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Shield className="w-6 h-6" />
                Scam Report Details
              </h2>
              <p className="text-orange-100 mt-2">
                Please provide detailed information to help us investigate this
                scam
              </p>
            </div>

            <div className="p-8 space-y-8">
              {/* Company Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-orange-600" />
                  Company Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) =>
                        handleInputChange("companyName", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        errors.companyName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter company name"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        errors.location ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="City, State/Country"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        handleInputChange("contactNumber", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        errors.contactNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.contactNumber && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.contactNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email ID *
                    </label>
                    <input
                      type="email"
                      value={formData.emailId}
                      onChange={(e) =>
                        handleInputChange("emailId", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        errors.emailId ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="company@example.com"
                    />
                    {errors.emailId && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.emailId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Scam Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Scam Description
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe the scam in detail (Max 250 words) *
                  </label>
                  <textarea
                    value={formData.scamDescription}
                    onChange={(e) =>
                      handleInputChange("scamDescription", e.target.value)
                    }
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none ${
                      errors.scamDescription
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Please provide a detailed description of how you were scammed, what promises were made, how much money was involved, and any other relevant details..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.scamDescription ? (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.scamDescription}
                      </p>
                    ) : (
                      <div></div>
                    )}
                    <p
                      className={`text-sm ${wordCount > 250 ? "text-red-500" : "text-gray-500"}`}
                    >
                      {wordCount}/250 words
                    </p>
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-orange-600" />
                  Supporting Documents
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Payment Receipt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Receipt className="w-4 h-4 inline mr-1" />
                      Payment Receipt Screenshot *
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                        formData.paymentReceipt
                          ? "border-green-300 bg-green-50"
                          : errors.paymentReceipt
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 hover:border-orange-400"
                      }`}
                    >
                      {formData.paymentReceipt ? (
                        <div className="space-y-3">
                          <FileImage className="w-8 h-8 text-green-600 mx-auto" />
                          <p className="text-sm font-medium text-green-700">
                            {formatFileName(formData.paymentReceipt.name)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(
                              formData.paymentReceipt.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile("paymentReceipt")}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Upload payment receipt
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG up to 10MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => paymentReceiptRef.current?.click()}
                            className="border-orange-300 text-orange-600 hover:bg-orange-50"
                          >
                            Choose File
                          </Button>
                        </div>
                      )}
                      <input
                        ref={paymentReceiptRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(
                            "paymentReceipt",
                            e.target.files?.[0] || null,
                          )
                        }
                        className="hidden"
                      />
                    </div>
                    {errors.paymentReceipt && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.paymentReceipt}
                      </p>
                    )}
                  </div>

                  {/* Agreement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <FileContract className="w-4 h-4 inline mr-1" />
                      Agreement Screenshot *
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                        formData.agreement
                          ? "border-green-300 bg-green-50"
                          : errors.agreement
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 hover:border-orange-400"
                      }`}
                    >
                      {formData.agreement ? (
                        <div className="space-y-3">
                          <FileText className="w-8 h-8 text-green-600 mx-auto" />
                          <p className="text-sm font-medium text-green-700">
                            {formatFileName(formData.agreement.name)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(formData.agreement.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile("agreement")}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Upload agreement/contract
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, PDF up to 10MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => agreementRef.current?.click()}
                            className="border-orange-300 text-orange-600 hover:bg-orange-50"
                          >
                            Choose File
                          </Button>
                        </div>
                      )}
                      <input
                        ref={agreementRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) =>
                          handleFileUpload(
                            "agreement",
                            e.target.files?.[0] || null,
                          )
                        }
                        className="hidden"
                      />
                    </div>
                    {errors.agreement && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.agreement}
                      </p>
                    )}
                  </div>
                </div>

                {/* Optional Company Picture */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Camera className="w-4 h-4 inline mr-1" />
                    Company Picture (Optional)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                      formData.companyPicture
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300 hover:border-orange-400"
                    }`}
                  >
                    {formData.companyPicture ? (
                      <div className="space-y-3">
                        <FileImage className="w-8 h-8 text-green-600 mx-auto" />
                        <p className="text-sm font-medium text-green-700">
                          {formatFileName(formData.companyPicture.name)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(formData.companyPicture.size / 1024 / 1024).toFixed(
                            2,
                          )}{" "}
                          MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile("companyPicture")}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Upload company photo
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 10MB (Optional)
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => companyPictureRef.current?.click()}
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          Choose File
                        </Button>
                      </div>
                    )}
                    <input
                      ref={companyPictureRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(
                          "companyPicture",
                          e.target.files?.[0] || null,
                        )
                      }
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-200 pt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting Report...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5" />
                      Submit Scam Report
                    </div>
                  )}
                </Button>

                <p className="text-sm text-gray-500 text-center mt-4">
                  By submitting this report, you confirm that the information
                  provided is accurate to the best of your knowledge.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
