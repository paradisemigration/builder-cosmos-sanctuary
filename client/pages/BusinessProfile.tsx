import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Shield,
  ExternalLink,
  MessageCircle,
  CheckCircle,
  Award,
  Users,
  Camera,
  Share2,
  Heart,
  Flag,
  ArrowLeft,
  Calendar,
  ThumbsUp,
  Eye,
  ChevronRight,
  PlayCircle,
  Download,
  Send,
  Verified,
  BadgeCheck,
  TrendingUp,
  Building,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Business } from "@/lib/data";
import { toast } from "sonner";

export default function BusinessProfile() {
  console.log("🔍 BusinessProfile component mounted!");

  const { city, companyName, id } = useParams<{
    city?: string;
    companyName?: string;
    id?: string;
  }>();
  const navigate = useNavigate();

  console.log("📍 URL Params received:", { city, companyName, id });
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    let foundBusiness: Business | null = null;

    // Handle legacy URL structure (/business/:id)
    if (id) {
      foundBusiness = sampleBusinesses.find((b) => b.id === id) || null;
    }
    // Handle new URL structure (/:city/:companyName)
    else if (city && companyName) {
      const searchName = companyName.replace(/-/g, " ");
      const searchCity = city.replace(/-/g, " ");

      // First try exact match
      foundBusiness = sampleBusinesses.find(
        (b) =>
          b.name.toLowerCase() === searchName.toLowerCase() &&
          b.city.toLowerCase() === searchCity.toLowerCase(),
      );

      // If no exact match, try partial match
      if (!foundBusiness) {
        foundBusiness = sampleBusinesses.find(
          (b) =>
            b.name.toLowerCase().includes(searchName.toLowerCase()) &&
            b.city.toLowerCase().includes(searchCity.toLowerCase()),
        );
      }

      // Debug logging
      console.log("=== Business Profile URL Debug ===");
      console.log("URL params:", { city, companyName });
      console.log("Converted search terms:", { searchCity, searchName });
      console.log("Found business:", foundBusiness?.name || "NONE");
      console.log(
        "All businesses:",
        sampleBusinesses.map((b) => ({
          name: b.name,
          city: b.city,
          nameMatches: b.name.toLowerCase() === searchName.toLowerCase(),
          cityMatches: b.city.toLowerCase() === searchCity.toLowerCase(),
        })),
      );
      console.log("================================");
    }

    // Fallback to first business for demo if not found
    if (!foundBusiness) {
      foundBusiness = sampleBusinesses[0];
    }

    setBusiness(foundBusiness);
    setLoading(false);

    if (foundBusiness) {
      document.title = `${foundBusiness.name} - Visa Consultant in ${foundBusiness.city} | VisaConsult India`;
      document.description = `${foundBusiness.description.substring(0, 150)}...`;
    }
  }, [city, companyName, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="animate-pulse space-y-6">
              <div className="h-80 bg-gray-300 rounded-xl"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-7xl text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Business Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The business you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link to="/business">Browse All Consultants</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const images = business.gallery || [
    business.coverImage || "/api/placeholder/800/400",
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    setShowContactForm(false);
  };

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: `Check out ${business.name} - Trusted visa consultant in ${business.city}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const businessHours = business.openingHours || {
    Monday: "9:00 AM - 6:00 PM",
    Tuesday: "9:00 AM - 6:00 PM",
    Wednesday: "9:00 AM - 6:00 PM",
    Thursday: "9:00 AM - 6:00 PM",
    Friday: "9:00 AM - 6:00 PM",
    Saturday: "10:00 AM - 4:00 PM",
    Sunday: "Closed",
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section with Cover */}
      <section className="relative pt-20">
        {/* Cover Image */}
        <div className="relative h-80 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
          <img
            src={business.coverImage || "/api/placeholder/1200/320"}
            alt={business.name}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Back Button */}
          <div className="absolute top-6 left-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(-1)}
              className="bg-white/90 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Actions */}
          <div className="absolute top-6 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleFavorite}
              className={`bg-white/90 hover:bg-white ${isFavorite ? "text-red-600" : ""}`}
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-red-600" : ""}`}
              />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={shareProfile}
              className="bg-white/90 hover:bg-white"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white"
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>

          {/* Business Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto max-w-7xl">
              <div className="flex items-end gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                    <AvatarImage src={business.logo} alt={business.name} />
                    <AvatarFallback className="text-2xl font-bold bg-white text-gray-800">
                      {business.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {business.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <BadgeCheck className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    {business.isVerified && (
                      <Badge className="bg-green-500 text-white border-0">
                        <Verified className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-blue-100 mb-2">
                    {business.category}
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{business.rating}</span>
                      <span className="text-blue-100">
                        ({business.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{business.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>2.5K views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
                  <div className="text-2xl font-bold text-blue-600">
                    {business.reviewCount}+
                  </div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
                  <div className="text-2xl font-bold text-purple-600">10+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm border">
                  <div className="text-2xl font-bold text-orange-600">24h</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
              </div>

              {/* About Section */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    About {business.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {business.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Specializations
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {business.services.slice(0, 6).map((service, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Countries Served
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "USA",
                          "Canada",
                          "UK",
                          "Australia",
                          "Germany",
                          "UAE",
                        ].map((country) => (
                          <Badge
                            key={country}
                            variant="outline"
                            className="border-green-200 text-green-700"
                          >
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Services Offered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {business.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Section */}
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Customer Reviews
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xl font-bold">
                          {business.rating}
                        </span>
                      </div>
                      <span className="text-gray-600">
                        ({business.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {business.reviews
                      .slice(0, showAllReviews ? business.reviews.length : 3)
                      .map((review) => (
                        <div
                          key={review.id}
                          className="border-b pb-4 last:border-b-0"
                        >
                          <div className="flex items-start gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.userAvatar} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                {review.userName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">
                                  {review.userName}
                                </span>
                                {review.isVerified && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-green-100 text-green-700"
                                  >
                                    Verified Client
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700 leading-relaxed">
                                {review.comment}
                              </p>
                              <div className="flex items-center gap-4 mt-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  Helpful (12)
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {business.reviews.length > 3 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowAllReviews(!showAllReviews)}
                      >
                        {showAllReviews
                          ? "Show Less"
                          : `View All ${business.reviews.length} Reviews`}
                        <ChevronRight
                          className={`h-4 w-4 ml-1 transition-transform ${showAllReviews ? "rotate-90" : ""}`}
                        />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Photo Gallery */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-purple-600" />
                    Photos & Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.slice(0, 8).map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity group"
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={image}
                          alt={`${business.name} - Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 7 && images.length > 8 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold">
                            +{images.length - 8} more
                          </div>
                        )}
                        {index === 0 && (
                          <div className="absolute top-2 left-2">
                            <PlayCircle className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="shadow-sm sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Call & Message Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowContactForm(true)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>

                  {/* WhatsApp */}
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp Chat
                  </Button>

                  {/* Website */}
                  {business.website && (
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}

                  <Separator />

                  {/* Contact Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-gray-600">{business.phone}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-gray-600 break-all">
                          {business.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Address</div>
                        <div className="text-gray-600">{business.address}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-1" />
                      Brochure
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Book Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(businessHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="font-medium">{day}</span>
                        <span
                          className={
                            hours === "Closed"
                              ? "text-red-600"
                              : "text-gray-600"
                          }
                        >
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-sm">Open Now</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Closes at 6:00 PM today
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                    Why Choose Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        icon: BadgeCheck,
                        text: "Verified & Trusted",
                        color: "text-green-600",
                      },
                      {
                        icon: Award,
                        text: "10+ Years Experience",
                        color: "text-blue-600",
                      },
                      {
                        icon: Users,
                        text: "500+ Happy Clients",
                        color: "text-purple-600",
                      },
                      {
                        icon: TrendingUp,
                        text: "95% Success Rate",
                        color: "text-orange-600",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <span className="text-sm text-gray-700">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Send Message to {business.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="service">Service Interested In</Label>
                  <select
                    id="service"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a service</option>
                    {business.services.slice(0, 5).map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us about your visa requirements, destination country, timeline..."
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContactForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
