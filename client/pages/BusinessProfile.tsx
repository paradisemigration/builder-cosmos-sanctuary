import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  Camera,
  CheckCircle,
  Award,
  Users,
  Calendar,
  Download,
  Share2,
  Heart,
  Flag,
  ChevronLeft,
  ChevronRight,
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
import { sampleBusinesses, type Business } from "@/lib/data";

export default function BusinessProfile() {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundBusiness = sampleBusinesses.find((b) => b.id === id);
    setBusiness(foundBusiness || null);
    setLoading(false);

    if (foundBusiness) {
      document.title = `${foundBusiness.name} - Visa Consultant in ${foundBusiness.address.split(",").pop()?.trim()} | VisaConsult India`;
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-gray-300 rounded-lg"></div>
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
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Business Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The business you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/browse">Browse All Consultants</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const images = business.gallery || [
    business.coverImage || "/api/placeholder/800/400",
  ];
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    alert("Message sent successfully!");
    setShowContactForm(false);
  };

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: `Check out ${business.name} - Trusted visa consultant`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-8 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={business.logo} alt={business.name} />
                  <AvatarFallback className="text-lg font-bold">
                    {business.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {business.name}
                    </h1>
                    {business.isVerified && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-gray-600 mb-2">
                    {business.category}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{business.rating}</span>
                      <span>({business.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{business.address.split(",").pop()?.trim()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:w-80">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="w-full" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      onClick={() => setShowContactForm(true)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>

                  {business.website && (
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      asChild
                    >
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

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={
                        isFavorite ? "text-red-600 border-red-200" : ""
                      }
                    >
                      <Heart
                        className={`h-4 w-4 ${isFavorite ? "fill-red-600" : ""}`}
                      />
                    </Button>
                    <Button variant="outline" size="sm" onClick={shareProfile}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="relative mb-8">
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={`${business.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="pb-16">
        <div className="container mx-auto max-w-6xl px-4">
          <Tabs defaultValue="about" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="hours">Hours</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {business.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {business.description}
                      </p>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Specializations
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {business.services.map((service, index) => (
                              <Badge key={index} variant="secondary">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {business.licenseNo && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              License Information
                            </h4>
                            <p className="text-gray-600">
                              License No: {business.licenseNo}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar Info */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Established Business</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">
                          {business.reviewCount}+ Happy Customers
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Verified & Trusted</span>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Payment Methods</h4>
                        <div className="text-sm text-gray-600">
                          Cash, Card, UPI, Bank Transfer
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Languages</h4>
                        <div className="text-sm text-gray-600">
                          Hindi, English, Regional Languages
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {business.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">{service}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Countries We Serve
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "USA",
                        "Canada",
                        "UK",
                        "Australia",
                        "Germany",
                        "UAE",
                        "Singapore",
                        "New Zealand",
                      ].map((country) => (
                        <Badge
                          key={country}
                          className="bg-blue-100 text-blue-800 border-blue-300"
                        >
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">
                          {business.rating}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        Based on {business.reviewCount} reviews
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {business.reviews.slice(0, 5).map((review) => (
                        <div
                          key={review.id}
                          className="border-b pb-4 last:border-b-0"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.userAvatar} />
                              <AvatarFallback>
                                {review.userName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {review.userName}
                                </span>
                                {review.isVerified && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mb-2">
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
                                <span className="text-sm text-gray-500 ml-2">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value="photos">
              <Card>
                <CardHeader>
                  <CardTitle>Photos & Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={image}
                          alt={`${business.name} - Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600">{business.phone}</p>
                      </div>
                    </div>
                    {business.whatsapp && (
                      <div className="flex items-center gap-3">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">WhatsApp</p>
                          <p className="text-gray-600">{business.whatsapp}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">{business.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-orange-600 mt-1" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-gray-600">{business.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Send a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input id="name" required />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          rows={4}
                          placeholder="Tell us about your visa requirements..."
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Hours Tab */}
            <TabsContent value="hours">
              <Card>
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(businessHours).map(([day, hours]) => (
                      <div
                        key={day}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium">{day}</span>
                        <span
                          className={`${hours === "Closed" ? "text-red-600" : "text-gray-600"}`}
                        >
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">
                        Currently Open
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Closes at 6:00 PM today
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Contact {business.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="modal-name">Your Name</Label>
                  <Input id="modal-name" required />
                </div>
                <div>
                  <Label htmlFor="modal-email">Email</Label>
                  <Input id="modal-email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="modal-message">Message</Label>
                  <Textarea id="modal-message" rows={3} required />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Send
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
