import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Mail,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  Share2,
  Heart,
  Calendar,
  Camera,
  Flag,
  ExternalLink,
  Navigation,
  ArrowLeft,
  Award,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Eye,
  ThumbsUp,
  Send,
  Sparkles,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Navigation as Nav } from "@/components/Navigation";
import { sampleBusinesses, Business, Review } from "@/lib/data";
import { ReviewModal } from "@/components/ReviewModal";

export default function BusinessProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [businessReviews, setBusinessReviews] = useState<Review[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const business = sampleBusinesses.find((b) => b.id === id);

  // Scroll animations
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);

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
      window.removeEventListener("scroll", handleScroll);
      observerRef.current?.disconnect();
    };
  }, []);

  // Initialize business reviews
  useEffect(() => {
    if (business) {
      setBusinessReviews(business.reviews);
    }
  }, [business]);

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Business Not Found</h1>
          <p className="text-blue-100 mb-8">
            The business you're looking for doesn't exist.
          </p>
          <Link to="/browse">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Browse All Businesses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitReview = () => {
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmitted = (reviewData: {
    rating: number;
    comment: string;
    userName: string;
    userAvatar?: string;
  }) => {
    const newReview: Review = {
      id: `review_${Date.now()}`,
      userId: `user_${Date.now()}`,
      userName: reviewData.userName,
      userAvatar: reviewData.userAvatar,
      rating: reviewData.rating,
      comment: reviewData.comment,
      isVerified: true,
      date: new Date().toLocaleDateString(),
    };

    setBusinessReviews((prev) => [newReview, ...prev]);
  };

  const handleWhatsAppClick = () => {
    if (business.whatsapp) {
      const message = `Hi! I found your business "${business.name}" on Trusted Immigration. I'd like to know more about your services.`;
      const whatsappUrl = `https://wa.me/${business.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const toggleLikeReview = (reviewId: string) => {
    setLikedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const visibleReviews = showAllReviews
    ? businessReviews
    : businessReviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Navigation */}
      <Nav />

      {/* Hero Section with Stunning Animations */}
      <div
        className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden pt-20"
        data-section="hero"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20"></div>
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-float-medium"></div>
          <div className="absolute bottom-10 left-1/3 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl animate-float-fast"></div>

          {/* Particle System */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative">
          {/* Back Navigation */}
          <div
            className={`mb-8 transition-all duration-1000 ${
              visibleSections.includes("hero")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Link to="/browse">
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Browse
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Business Info */}
            <div
              className={`lg:col-span-2 transition-all duration-1000 ${
                visibleSections.includes("hero")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                {business.logo && (
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-sm animate-pulse"></div>
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 transform group-hover:scale-105 group-hover:rotate-3">
                      <img
                        src={business.logo}
                        alt={`${business.name} logo`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                      {business.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2">
                      {business.isVerified && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/30 backdrop-blur-sm animate-pulse">
                          <Shield className="w-4 h-4 mr-1" />
                          Verified
                        </Badge>
                      )}

                      {business.isScamReported && (
                        <Badge className="bg-red-500/20 text-red-300 border-red-400/30 backdrop-blur-sm">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Reported
                        </Badge>
                      )}

                      {business.importedFromGoogle && (
                        <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                          <Globe className="w-3 h-3 mr-1" />
                          Google Import
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 backdrop-blur-sm mb-6 text-base px-4 py-2">
                    {business.category}
                  </Badge>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 transition-all duration-300 ${
                            i < Math.floor(business.rating)
                              ? "text-yellow-400 fill-yellow-400 drop-shadow-sm scale-110"
                              : "text-gray-400"
                          }`}
                          style={{ animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {business.rating}
                    </span>
                    <span className="text-blue-200 text-lg">
                      ({business.reviewCount} reviews)
                    </span>
                  </div>

                  <p className="text-blue-100 text-lg leading-relaxed mb-8">
                    {business.description}
                  </p>

                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-blue-200">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm">{business.address}</span>
                    </div>

                    <div className="flex items-center gap-3 text-blue-200">
                      <Phone className="w-5 h-5 text-green-400" />
                      <span className="text-sm">{business.phone}</span>
                    </div>

                    {business.email && (
                      <div className="flex items-center gap-3 text-blue-200">
                        <Mail className="w-5 h-5 text-purple-400" />
                        <span className="text-sm">{business.email}</span>
                      </div>
                    )}

                    {business.website && (
                      <div className="flex items-center gap-3 text-blue-200">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-300 hover:text-white transition-colors duration-300 text-sm hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div
              className={`transition-all duration-1000 ${
                visibleSections.includes("hero")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="sticky top-24">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardContent className="p-6 lg:p-8">
                    <div className="space-y-4">
                      <Button
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                        size="lg"
                        onClick={() =>
                          window.open(`tel:${business.phone}`, "_self")
                        }
                      >
                        <Phone className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                        📞 Call Now
                      </Button>

                      {business.whatsapp && (
                        <Button
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                          size="lg"
                          onClick={handleWhatsAppClick}
                        >
                          <MessageCircle className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                          💬 WhatsApp
                        </Button>
                      )}

                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                        size="lg"
                        onClick={() => {
                          // Open directions in Google Maps
                          const address = encodeURIComponent(business.address);
                          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
                          window.open(mapsUrl, "_blank");
                        }}
                      >
                        <Navigation className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                        🗺️ Get Directions
                      </Button>

                      <div className="grid grid-cols-3 gap-2 lg:gap-3 mt-6">
                        <Button
                          className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 px-2 lg:px-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                          size="sm"
                          onClick={() => {
                            // Share functionality
                            if (navigator.share) {
                              navigator.share({
                                title: business.name,
                                text: `Check out ${business.name} on Trusted Immigration`,
                                url: window.location.href,
                              });
                            } else {
                              navigator.clipboard.writeText(
                                window.location.href,
                              );
                              alert("Link copied to clipboard!");
                            }
                          }}
                        >
                          <Share2 className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-xs block">Share</span>
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 text-white font-semibold py-3 px-2 lg:px-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                          size="sm"
                          onClick={() => {
                            // Save/bookmark functionality
                            const saved =
                              localStorage.getItem("savedBusinesses");
                            const savedList = saved ? JSON.parse(saved) : [];
                            if (!savedList.includes(business.id)) {
                              savedList.push(business.id);
                              localStorage.setItem(
                                "savedBusinesses",
                                JSON.stringify(savedList),
                              );
                              alert("Business saved to your favorites!");
                            } else {
                              alert("Business already saved!");
                            }
                          }}
                        >
                          <Heart className="w-4 h-4 mb-1 group-hover:scale-110 transition-all duration-300" />
                          <span className="text-xs block">Save</span>
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-semibold py-3 px-2 lg:px-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                          size="sm"
                          onClick={() => {
                            // Report functionality
                            const reason = prompt(
                              "Please tell us why you want to report this business:",
                            );
                            if (reason) {
                              alert(
                                "Thank you for your report. We will review it shortly.",
                              );
                              // Here you would typically send the report to your backend
                            }
                          }}
                        >
                          <Flag className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-xs block">Report</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Opening Hours Card */}
                {business.openingHours && (
                  <Card className="mt-6 bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white text-lg">
                        <Clock className="w-5 h-5 mr-2 text-cyan-400" />⏰
                        Opening Hours
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(business.openingHours).map(
                          ([day, hours]) => (
                            <div
                              key={day}
                              className="flex justify-between items-center py-1"
                            >
                              <span className="font-medium text-blue-200">
                                {day}
                              </span>
                              <span className="text-white text-sm bg-white/10 px-3 py-1 rounded-lg">
                                {hours}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Tabs - Mobile Responsive Design */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12"
        data-section="content"
      >
        <div
          className={`transition-all duration-1000 ${
            visibleSections.includes("content")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Enhanced Mobile-First TabsList */}
            <div className="sticky top-24 z-40 mb-8">
              <TabsList className="w-full h-auto bg-gradient-to-r from-white via-blue-50 to-purple-50 backdrop-blur-xl border-2 border-blue-200/50 rounded-2xl p-3 shadow-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 w-full">
                  <TabsTrigger
                    value="overview"
                    className="flex flex-col items-center gap-2 rounded-xl font-bold text-xs md:text-sm text-gray-700 py-3 md:py-4 px-2 md:px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-blue-50"
                  >
                    <Award className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="services"
                    className="flex flex-col items-center gap-2 rounded-xl font-bold text-xs md:text-sm text-gray-700 py-3 md:py-4 px-2 md:px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-green-50"
                  >
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Services</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="flex flex-col items-center gap-2 rounded-xl font-bold text-xs md:text-sm text-gray-700 py-3 md:py-4 px-2 md:px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-yellow-50"
                  >
                    <Star className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Reviews</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="photos"
                    className="flex flex-col items-center gap-2 rounded-xl font-bold text-xs md:text-sm text-gray-700 py-3 md:py-4 px-2 md:px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-pink-50"
                  >
                    <Camera className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Photos</span>
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="w-full">
              <div className="space-y-6 md:space-y-8">
                {/* About Section */}
                <Card className="bg-gradient-to-br from-white via-white to-blue-50/30 border-2 border-blue-100/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <Award className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                      💼 About This Business
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                      {business.description}
                    </p>

                    {business.licenseNo && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 md:p-6 rounded-2xl border border-green-200/50">
                        <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2 text-sm md:text-base">
                          <Shield className="w-4 h-4 md:w-5 md:h-5" />
                          🏛️ License Information
                        </h4>
                        <p className="text-green-700 font-medium text-sm md:text-base">
                          License No: {business.licenseNo}
                        </p>
                      </div>
                    )}

                    {/* Mobile-Optimized Trust Indicators */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 md:p-4 rounded-xl border border-blue-200/50 text-center">
                        <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-lg md:text-2xl font-bold text-blue-800">
                          {business.reviewCount}
                        </div>
                        <div className="text-blue-600 text-xs md:text-sm">
                          Happy Customers
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 md:p-4 rounded-xl border border-green-200/50 text-center">
                        <Star className="w-6 h-6 md:w-8 md:h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-lg md:text-2xl font-bold text-green-800">
                          {business.rating}
                        </div>
                        <div className="text-green-600 text-xs md:text-sm">
                          Average Rating
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 md:p-4 rounded-xl border border-purple-200/50 text-center col-span-2 md:col-span-1">
                        <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-lg md:text-2xl font-bold text-purple-800">
                          {business.isVerified ? "✓" : "✗"}
                        </div>
                        <div className="text-purple-600 text-xs md:text-sm">
                          Verified Status
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                  {/* Location & Contact */}
                  <Card className="bg-gradient-to-br from-white via-white to-purple-50/30 border-2 border-purple-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-purple-600" />
                        📍 Location & Contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                        <div className="relative text-center">
                          <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                          <span className="text-gray-700 font-semibold text-lg">
                            🗺️ Interactive Map
                          </span>
                          <p className="text-gray-600 mt-2">
                            {business.address}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700 font-medium">
                              {business.address}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                            <Phone className="w-5 h-5 text-green-600" />
                            <span className="text-gray-700 font-medium">
                              {business.phone}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {business.email && (
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                              <Mail className="w-5 h-5 text-purple-600" />
                              <span className="text-gray-700 font-medium">
                                {business.email}
                              </span>
                            </div>
                          )}

                          {business.website && (
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200/50">
                              <Globe className="w-5 h-5 text-orange-600" />
                              <a
                                href={business.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 font-medium hover:text-orange-600 transition-colors duration-300"
                              >
                                Visit Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions Sidebar */}
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-white via-white to-green-50/30 border-2 border-green-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-green-600" />⚡ Quick
                        Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group">
                          <Calendar className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                          📅 Book Consultation
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold py-3 rounded-xl transition-all duration-300 group"
                        >
                          <MessageCircle className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                          💬 Send Message
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start border-2 border-orange-200 text-orange-700 hover:bg-orange-50 font-semibold py-3 rounded-xl transition-all duration-300 group"
                        >
                          <ExternalLink className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                          📄 Request Quote
                        </Button>

                        <Button
                          onClick={handleSubmitReview}
                          className="w-full justify-start bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                        >
                          <Star className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                          ⭐ Write Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="mt-8">
              <Card className="bg-gradient-to-br from-white via-white to-blue-50/30 border-2 border-blue-100/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <Award className="w-6 h-6 text-blue-600" />
                    🛠️ Services Offered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {business.services.map((service, index) => (
                      <div
                        key={index}
                        className={`group p-6 bg-gradient-to-br from-white to-blue-50/50 border-2 border-blue-100/50 rounded-2xl hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                          {index % 6 === 0
                            ? "🛂"
                            : index % 6 === 1
                              ? "📋"
                              : index % 6 === 2
                                ? "🛡️"
                                : index % 6 === 3
                                  ? "👨‍💼"
                                  : index % 6 === 4
                                    ? "📝"
                                    : "✈️"}
                        </div>
                        <h4 className="font-bold text-gray-800 mb-3 text-lg group-hover:text-blue-600 transition-colors duration-300">
                          {service}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          Professional {service.toLowerCase()} services with
                          expert guidance and verified credentials.
                        </p>
                        <div className="mt-4 pt-4 border-t border-blue-100">
                          <Badge className="bg-blue-100 text-blue-700 font-medium">
                            Expert Service
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {visibleReviews.map((review, index) => (
                    <Card
                      key={review.id}
                      className={`bg-gradient-to-br from-white via-white to-purple-50/30 border-2 border-purple-100/50 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] opacity-0 animate-fadeInUp`}
                      style={{
                        animationDelay: `${index * 150}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12 border-2 border-purple-200">
                            <AvatarImage src={review.userAvatar} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                              {review.userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <h4 className="font-bold text-gray-800">
                                  {review.userName}
                                </h4>
                                {review.isVerified && (
                                  <Badge className="bg-green-100 text-green-700 border-green-200 font-medium">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {review.date}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-5 h-5 transition-all duration-300 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-lg font-bold text-gray-800 ml-2">
                                {review.rating}.0
                              </span>
                            </div>

                            <p className="text-gray-700 mb-6 leading-relaxed">
                              {review.comment}
                            </p>

                            {review.businessResponse && (
                              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200/50 mb-4">
                                <h5 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                  <MessageCircle className="w-4 h-4" />
                                  Business Response:
                                </h5>
                                <p className="text-blue-700">
                                  {review.businessResponse}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleLikeReview(review.id)}
                                className={`transition-all duration-300 ${
                                  likedReviews.has(review.id)
                                    ? "text-red-600 bg-red-50"
                                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                                }`}
                              >
                                <ThumbsUp
                                  className={`w-4 h-4 mr-2 ${likedReviews.has(review.id) ? "fill-current" : ""}`}
                                />
                                Helpful{" "}
                                {likedReviews.has(review.id) ? "(1)" : ""}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-blue-600"
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {businessReviews.length > 3 && (
                    <div className="text-center">
                      <Button
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        variant="outline"
                        className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 text-blue-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 font-semibold px-8 py-3 rounded-xl transition-all duration-300 group"
                      >
                        {showAllReviews ? (
                          <>
                            <ChevronUp className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                            Show Less Reviews
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                            Show All {businessReviews.length} Reviews
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Enhanced Review Writing Section */}
                <div>
                  <Card className="sticky top-24 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-2 border-yellow-200/50 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <Star className="w-6 h-6 text-yellow-600" />⭐ Write a
                        Review
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-6">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                          <Star className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3">
                          Share Your Experience
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          Help others by sharing your experience with{" "}
                          {business.name}. Your review makes a difference!
                        </p>
                        <Button
                          onClick={handleSubmitReview}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                          size="lg"
                        >
                          <Send className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                          ✍️ Write Review
                        </Button>
                        <p className="text-xs text-gray-500 mt-4 bg-white/50 p-3 rounded-lg">
                          Sign in with Google or Facebook to verify your review
                          and build trust in our community
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="photos" className="mt-8">
              <Card className="bg-gradient-to-br from-white via-white to-pink-50/30 border-2 border-pink-100/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <Camera className="w-6 h-6 text-pink-600" />
                      📸 Photos
                    </span>
                    <Button
                      variant="outline"
                      className="border-2 border-pink-200 text-pink-700 hover:bg-pink-50 font-semibold rounded-xl transition-all duration-300 group"
                    >
                      <Camera className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                      📷 Add Photos
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {business.gallery?.map((photo, index) => (
                      <div
                        key={index}
                        className="group aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={() => {
                          setSelectedImage(photo);
                          setIsImageModalOpen(true);
                        }}
                      >
                        <img
                          src={photo}
                          alt={`${business.name} photo ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}

                    {/* Placeholder photos with animations */}
                    {[...Array(8)].map((_, index) => (
                      <div
                        key={`placeholder-${index}`}
                        className={`group aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl opacity-0 animate-fadeInUp`}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: "forwards",
                        }}
                      >
                        <div className="text-center">
                          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:animate-bounce" />
                          <p className="text-xs text-gray-500">Add Photo</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        businessName={business.name}
        businessId={business.id}
        onReviewSubmitted={handleReviewSubmitted}
      />

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              onClick={() => setIsImageModalOpen(false)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}