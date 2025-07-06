import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  X,
  Plus,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building,
  Menu,
  CheckCircle,
  Star,
  Sparkles,
  Rocket,
  Shield,
  Users,
  TrendingUp,
  Camera,
  Award,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  businessCategories,
  dubaiZones,
  uaeCities,
  sampleBusinesses,
} from "@/lib/data";

interface BusinessFormData {
  name: string;
  category: string;
  description: string;
  services: string[];
  address: string;
  zone: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  licenseNo: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

export default function AddBusiness() {
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [formData, setFormData] = useState<BusinessFormData>({
    name: "",
    category: "",
    description: "",
    services: [],
    address: "",
    zone: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    licenseNo: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [newService, setNewService] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Business name search state
  const [businessSearchQuery, setBusinessSearchQuery] = useState("");
  const [showBusinessSuggestions, setShowBusinessSuggestions] = useState(false);
  const [businessSuggestions, setBusinessSuggestions] = useState<
    typeof sampleBusinesses
  >([]);
  const [businessNameVerified, setBusinessNameVerified] = useState(false);
  const [existingBusiness, setExistingBusiness] = useState<any>(null);

  // Scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => [
              ...prev,
              entry.target.getAttribute("data-section") || "",
            ]);
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => {
      observerRef.current?.observe(section);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const updateFormData = (field: keyof BusinessFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Business name search handlers
  const handleBusinessSearchChange = (value: string) => {
    setBusinessSearchQuery(value);
    setBusinessNameVerified(false);
    setExistingBusiness(null);

    if (value.length >= 3) {
      const filteredBusinesses = sampleBusinesses
        .filter((business) =>
          business.name.toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, 5);

      setBusinessSuggestions(filteredBusinesses);
      setShowBusinessSuggestions(true);
    } else {
      setShowBusinessSuggestions(false);
      setBusinessSuggestions([]);
    }
  };

  const handleBusinessSelection = (business: any) => {
    setBusinessSearchQuery(business.name);
    setExistingBusiness(business);
    setShowBusinessSuggestions(false);
    setBusinessNameVerified(false);
  };

  const handleBusinessNameVerification = () => {
    const exactMatch = sampleBusinesses.find(
      (business) =>
        business.name.toLowerCase() === businessSearchQuery.toLowerCase(),
    );

    if (exactMatch) {
      setExistingBusiness(exactMatch);
      setBusinessNameVerified(false);
    } else {
      setBusinessNameVerified(true);
      setFormData((prev) => ({ ...prev, name: businessSearchQuery }));
    }
  };

  const proceedWithNewBusiness = () => {
    setCurrentStep(1);
  };

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, newService.trim()],
      }));
      setNewService("");
    }
  };

  const removeService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s !== service),
    }));
  };

  const handleFileUpload = (file: File, type: "logo" | "cover" | "gallery") => {
    if (type === "logo") {
      setLogo(file);
    } else if (type === "cover") {
      setCoverImage(file);
    } else {
      setGalleryImages((prev) => [...prev, file]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Business submitted:", {
        ...formData,
        logo,
        coverImage,
        galleryImages,
      });
      setIsSubmitting(false);
      alert("🎉 Business listing submitted for review!");
    }, 2000);
  };

  const canProceedToNext = () => {
    if (currentStep === 0) {
      return businessNameVerified;
    }
    if (currentStep === 1) {
      return formData.name && formData.category && formData.description;
    }
    if (currentStep === 2) {
      return formData.services.length > 0;
    }
    if (currentStep === 3) {
      return formData.address && formData.phone && formData.email;
    }
    if (currentStep === 4) {
      return formData.ownerName && formData.ownerEmail && agreeToTerms;
    }
    return true;
  };

  const steps = [
    {
      number: 0,
      title: "Business Name",
      icon: <Building className="w-5 h-5" />,
      description: "Search & verify your business name",
    },
    {
      number: 1,
      title: "Basic Information",
      icon: <Building className="w-5 h-5" />,
      description: "Tell us about your business",
    },
    {
      number: 2,
      title: "Services & Media",
      icon: <Star className="w-5 h-5" />,
      description: "Showcase your services",
    },
    {
      number: 3,
      title: "Contact Details",
      icon: <Phone className="w-5 h-5" />,
      description: "How customers reach you",
    },
    {
      number: 4,
      title: "Review & Submit",
      icon: <Rocket className="w-5 h-5" />,
      description: "Final review and launch",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Navigation */}
      <Navigation />

      {/* Enhanced Hero Header */}
      <div
        className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden"
        data-section="hero"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-800/40 to-blue-900/50"></div>

          {/* Floating Shapes */}
          <div className="absolute top-16 left-8 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-32 right-12 w-24 h-24 bg-gradient-to-br from-purple-400/25 to-pink-500/25 rounded-full blur-2xl animate-float-medium"></div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-br from-green-400/20 to-teal-500/20 rounded-full blur-3xl animate-float-fast"></div>

          {/* Particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full animate-twinkle ${
                  i % 3 === 0
                    ? "w-1 h-1 bg-white/40"
                    : i % 3 === 1
                      ? "w-0.5 h-0.5 bg-cyan-300/50"
                      : "w-1.5 h-1.5 bg-purple-300/40"
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${3 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <div
            className={`text-center transition-all duration-1000 ${
              visibleSections.includes("hero")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="text-white/90 font-medium">
                Join 50+ Trusted Businesses
              </span>
              <Award className="w-5 h-5 text-green-400" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              🚀 Launch Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Business
              </span>
              <br />
              on Dubai's #1 Platform
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto mb-8 leading-relaxed">
              ✨ Join Dubai's most trusted directory of immigration and visa
              services. Reach thousands of customers and grow your business with
              verified credibility.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-cyan-400 mb-2 flex items-center justify-center gap-2">
                  <Users className="w-8 h-8" />
                  1000+
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  Monthly Visitors
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-purple-400 mb-2 flex items-center justify-center gap-2">
                  <TrendingUp className="w-8 h-8" />
                  95%
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  Success Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-green-400 mb-2 flex items-center justify-center gap-2">
                  <Shield className="w-8 h-8" />
                  100%
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  Verified Listings
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() =>
                  document
                    .getElementById("form-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                <Rocket className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                🚀 Start Your Journey
              </Button>
              <Button
                variant="outline"
                className="px-8 py-4 text-lg font-semibold rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                📞 Get Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Form Section */}
      <div
        id="form-section"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        data-section="form"
      >
        {/* Enhanced Progress Section */}
        <div
          className={`mb-12 transition-all duration-1000 ${
            visibleSections.includes("form")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Mobile Progress */}
          <div className="block lg:hidden mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-lg">
                    {currentStep}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">
                      Step {currentStep + 1} of {steps.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      {steps[currentStep].title}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-inner"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-3">
                {steps[currentStep].description}
              </p>
            </div>
          </div>

          {/* Desktop Progress */}
          <div className="hidden lg:block">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 mb-3 ${
                          step.number <= currentStep
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step.number <= currentStep ? (
                          step.number < currentStep ? (
                            <CheckCircle className="w-8 h-8" />
                          ) : (
                            step.icon
                          )
                        ) : (
                          step.icon
                        )}
                      </div>
                      <div className="text-center">
                        <div
                          className={`font-bold text-lg transition-colors duration-300 ${
                            step.number <= currentStep
                              ? "text-gray-800"
                              : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 h-1 mx-6 relative">
                        <div className="absolute inset-0 bg-gray-200 rounded-full" />
                        <div
                          className={`absolute inset-0 rounded-full transition-all duration-500 ${
                            step.number < currentStep
                              ? "bg-gradient-to-r from-blue-600 to-purple-600"
                              : "bg-gray-200"
                          }`}
                          style={{
                            width: step.number < currentStep ? "100%" : "0%",
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Form Content */}
        <div
          className={`transition-all duration-1000 ${
            visibleSections.includes("form")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border border-white/50 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-8">
              <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-4">
                {steps[currentStep].icon}
                <div>
                  <div>
                    Step {currentStep + 1}: {steps[currentStep].title}
                  </div>
                  <div className="text-lg text-gray-600 font-normal mt-1">
                    {steps[currentStep].description}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm border border-orange-200 rounded-full px-6 py-3 inline-block">
                      <span className="text-sm font-semibold tracking-wide text-orange-700">
                        🔍 BUSINESS NAME VERIFICATION
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Let's start by checking your business name
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Search for your business name to see if it's already
                      listed in our directory. If it exists, you can claim the
                      listing. If not, we'll help you create a new one.
                    </p>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Building className="h-6 w-6 text-gray-400 group-hover:text-orange-500 transition-colors duration-300" />
                      </div>
                      <Input
                        placeholder="Search by company name..."
                        value={businessSearchQuery}
                        onChange={(e) =>
                          handleBusinessSearchChange(e.target.value)
                        }
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleBusinessNameVerification()
                        }
                        className="pl-16 h-16 bg-gray-50/80 border-2 border-gray-200 text-gray-800 placeholder-gray-500 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 rounded-2xl text-lg font-medium transition-all duration-300 hover:border-gray-300"
                      />

                      {/* Autocomplete Suggestions */}
                      {showBusinessSuggestions &&
                        businessSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white/95 backdrop-blur-xl border border-orange-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
                            {businessSuggestions.map((business) => (
                              <div
                                key={business.id}
                                onClick={() =>
                                  handleBusinessSelection(business)
                                }
                                className="flex items-center gap-4 p-4 hover:bg-orange-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                              >
                                {business.logo && (
                                  <img
                                    src={business.logo}
                                    alt={business.name}
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-800 text-lg truncate">
                                    {business.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 truncate">
                                    {business.category} •{" "}
                                    {business.address.split(",")[0]}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                      <span className="text-sm text-gray-600">
                                        {business.rating} (
                                        {business.reviewCount} reviews)
                                      </span>
                                    </div>
                                    {business.isVerified && (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>

                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={handleBusinessNameVerification}
                        disabled={businessSearchQuery.length < 2}
                        className="bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        Check Business Name
                      </Button>
                    </div>

                    {/* Existing Business Found */}
                    {existingBusiness && (
                      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-yellow-100 rounded-full p-2">
                            <Building className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                              Business Already Listed
                            </h4>
                            <p className="text-yellow-700 mb-4">
                              We found a business with this name:{" "}
                              <strong>{existingBusiness.name}</strong>
                            </p>
                            <div className="bg-white/80 rounded-xl p-4 mb-4">
                              <div className="flex items-center gap-3">
                                {existingBusiness.logo && (
                                  <img
                                    src={existingBusiness.logo}
                                    alt={existingBusiness.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                )}
                                <div>
                                  <h5 className="font-semibold text-gray-800">
                                    {existingBusiness.name}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    {existingBusiness.category}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {existingBusiness.address}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                              >
                                Claim This Listing
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setBusinessSearchQuery("");
                                  setExistingBusiness(null);
                                }}
                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                              >
                                Search Different Name
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Business Name Verified */}
                    {businessNameVerified && (
                      <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-green-100 rounded-full p-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-green-800 mb-2">
                              Great! Business Name is Available
                            </h4>
                            <p className="text-green-700 mb-4">
                              "<strong>{businessSearchQuery}</strong>" is unique
                              and can be registered in our directory.
                            </p>
                            <Button
                              onClick={proceedWithNewBusiness}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Proceed with Registration →
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                      >
                        <Building className="w-5 h-5" />
                        Business Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your business name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="category"
                        className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                      >
                        <Star className="w-5 h-5" />
                        Service Category *
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          updateFormData("category", value)
                        }
                      >
                        <SelectTrigger className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessCategories.map((category) => (
                            <SelectItem
                              key={category}
                              value={category}
                              className="text-lg"
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-lg font-semibold text-gray-800"
                    >
                      Business Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your business and services in detail..."
                      value={formData.description}
                      onChange={(e) =>
                        updateFormData("description", e.target.value)
                      }
                      rows={5}
                      className="text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="license"
                      className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      Trade License Number
                    </Label>
                    <Input
                      id="license"
                      placeholder="DED-XXXXX (helps build trust)"
                      value={formData.licenseNo}
                      onChange={(e) =>
                        updateFormData("licenseNo", e.target.value)
                      }
                      className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Services Offered *
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Add a service (e.g., Tourist Visa Processing)"
                        value={newService}
                        onChange={(e) => setNewService(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addService()}
                        className="h-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
                      />
                      <Button
                        onClick={addService}
                        className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>

                    {formData.services.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                        <div className="flex flex-wrap gap-3">
                          {formData.services.map((service) => (
                            <div
                              key={service}
                              className="bg-white border-2 border-blue-200 text-blue-800 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm"
                            >
                              ✨ {service}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-red-500 hover:text-red-700"
                                onClick={() => removeService(service)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        type: "logo" as const,
                        title: "Business Logo",
                        icon: <Building className="w-8 h-8" />,
                        current: logo,
                      },
                      {
                        type: "cover" as const,
                        title: "Cover Image",
                        icon: <Camera className="w-8 h-8" />,
                        current: coverImage,
                      },
                      {
                        type: "gallery" as const,
                        title: "Gallery Images",
                        icon: <Upload className="w-8 h-8" />,
                        current: galleryImages.length > 0,
                      },
                    ].map((upload) => (
                      <div key={upload.type} className="space-y-2">
                        <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          {upload.icon}
                          {upload.title}
                        </Label>
                        <div className="relative group">
                          <div className="border-3 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors bg-gradient-to-br from-gray-50 to-blue-50 group-hover:from-blue-50 group-hover:to-purple-50">
                            <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                              <Upload className="w-12 h-12 mx-auto mb-3" />
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {upload.type === "gallery"
                                ? "Upload photos (max 5)"
                                : "Upload image (optional)"}
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              multiple={upload.type === "gallery"}
                              onChange={(e) => {
                                if (upload.type === "gallery") {
                                  Array.from(e.target.files || []).forEach(
                                    (file) => handleFileUpload(file, "gallery"),
                                  );
                                } else {
                                  e.target.files?.[0] &&
                                    handleFileUpload(
                                      e.target.files[0],
                                      upload.type,
                                    );
                                }
                              }}
                              className="hidden"
                              id={`${upload.type}-upload`}
                            />
                            <Label
                              htmlFor={`${upload.type}-upload`}
                              className="cursor-pointer"
                            >
                              <Button
                                variant="outline"
                                asChild
                                className="rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                              >
                                <span>
                                  📁 Choose{" "}
                                  {upload.type === "gallery" ? "Files" : "File"}
                                </span>
                              </Button>
                            </Label>

                            {upload.type === "logo" && logo && (
                              <p className="text-xs text-gray-600 mt-2 font-medium">
                                ✅ {logo.name}
                              </p>
                            )}
                            {upload.type === "cover" && coverImage && (
                              <p className="text-xs text-gray-600 mt-2 font-medium">
                                ✅ {coverImage.name}
                              </p>
                            )}
                            {upload.type === "gallery" &&
                              galleryImages.length > 0 && (
                                <div className="mt-3 space-y-1">
                                  {galleryImages.map((file, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between text-xs text-gray-600 bg-white/80 rounded-lg px-3 py-2"
                                    >
                                      <span className="truncate flex-1">
                                        📸 {file.name}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 text-red-500 hover:text-red-700"
                                        onClick={() =>
                                          removeGalleryImage(index)
                                        }
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                      >
                        <MapPin className="w-5 h-5" />
                        Business Address *
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your complete business address"
                        value={formData.address}
                        onChange={(e) =>
                          updateFormData("address", e.target.value)
                        }
                        rows={3}
                        className="text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="zone"
                        className="text-lg font-semibold text-gray-800"
                      >
                        Dubai Zone
                      </Label>
                      <Select
                        value={formData.zone}
                        onValueChange={(value) => updateFormData("zone", value)}
                      >
                        <SelectTrigger className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="Select zone" />
                        </SelectTrigger>
                        <SelectContent>
                          {dubaiZones.map((zone) => (
                            <SelectItem
                              key={zone}
                              value={zone}
                              className="text-lg"
                            >
                              {zone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                      >
                        <Phone className="w-5 h-5" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+971-4-XXX-XXXX"
                        value={formData.phone}
                        onChange={(e) =>
                          updateFormData("phone", e.target.value)
                        }
                        className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="whatsapp"
                        className="text-lg font-semibold text-gray-800"
                      >
                        WhatsApp Number
                      </Label>
                      <Input
                        id="whatsapp"
                        placeholder="+971-50-XXX-XXXX"
                        value={formData.whatsapp}
                        onChange={(e) =>
                          updateFormData("whatsapp", e.target.value)
                        }
                        className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                      >
                        <Mail className="w-5 h-5" />
                        Business Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="info@business.com"
                        value={formData.email}
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
                        }
                        className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="website"
                        className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                      >
                        <Globe className="w-5 h-5" />
                        Website URL
                      </Label>
                      <Input
                        id="website"
                        placeholder="https://www.business.com"
                        value={formData.website}
                        onChange={(e) =>
                          updateFormData("website", e.target.value)
                        }
                        className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                      <Users className="w-8 h-8 text-blue-600" />
                      👤 Business Owner Information
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="ownerName"
                          className="text-lg font-semibold text-gray-800"
                        >
                          Owner Name *
                        </Label>
                        <Input
                          id="ownerName"
                          placeholder="Enter owner's full name"
                          value={formData.ownerName}
                          onChange={(e) =>
                            updateFormData("ownerName", e.target.value)
                          }
                          className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="ownerPhone"
                          className="text-lg font-semibold text-gray-800"
                        >
                          Owner Phone *
                        </Label>
                        <Input
                          id="ownerPhone"
                          placeholder="+971-50-XXX-XXXX"
                          value={formData.ownerPhone}
                          onChange={(e) =>
                            updateFormData("ownerPhone", e.target.value)
                          }
                          className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Label
                        htmlFor="ownerEmail"
                        className="text-lg font-semibold text-gray-800"
                      >
                        Owner Email *
                      </Label>
                      <Input
                        id="ownerEmail"
                        type="email"
                        placeholder="owner@business.com"
                        value={formData.ownerEmail}
                        onChange={(e) =>
                          updateFormData("ownerEmail", e.target.value)
                        }
                        className="h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      📋 Review Your Information
                    </h3>
                    <div className="bg-white rounded-xl p-6 shadow-inner space-y-6">
                      <div className="border-b pb-4">
                        <h4 className="text-xl font-bold text-gray-800">
                          {formData.name || "Business Name"}
                        </h4>
                        <p className="text-gray-600 font-medium">
                          {formData.category || "Category not selected"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-700 leading-relaxed">
                          {formData.description || "No description provided"}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="w-5 h-5 mt-0.5 text-gray-500" />
                          <span className="break-words">
                            {formData.address || "Address not provided"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 text-gray-500" />
                          <span className="break-all">
                            {formData.phone || "Phone not provided"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-500" />
                          <span className="break-all">
                            {formData.email || "Email not provided"}
                          </span>
                        </div>
                        {formData.website && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Globe className="w-5 h-5 text-gray-500" />
                            <span className="break-all">
                              {formData.website}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-3 p-4 bg-white rounded-xl border-2 border-gray-200">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={setAgreeToTerms}
                        className="mt-1"
                      />
                      <Label
                        htmlFor="terms"
                        className="text-lg leading-relaxed"
                      >
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          className="text-blue-600 hover:text-blue-800 font-semibold underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-blue-600 hover:text-blue-800 font-semibold underline"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900 mb-2 text-lg">
                            🔍 Approval Process
                          </h4>
                          <p className="text-blue-700 leading-relaxed">
                            Your listing will be carefully reviewed by our
                            verification team within 24-48 hours. You'll receive
                            an email confirmation once approved and your
                            business goes live!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Navigation Buttons */}
        <div
          className={`flex flex-col sm:flex-row justify-between gap-4 mt-8 transition-all duration-1000 ${
            visibleSections.includes("form")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-2xl border-2 border-gray-300 hover:border-gray-400"
          >
            ⬅️ Previous Step
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceedToNext()}
              className="w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Next Step ➡️
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedToNext() || isSubmitting}
              size="lg"
              className="w-full sm:w-auto px-12 py-4 text-xl font-bold rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  ⏳ Submitting...
                </>
              ) : (
                <>
                  <Rocket className="w-6 h-6 mr-3" />
                  🚀 Submit for Review
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
