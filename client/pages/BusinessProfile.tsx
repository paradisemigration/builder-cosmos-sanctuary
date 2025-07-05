import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sampleBusinesses, Business, Review } from "@/lib/data";

export default function BusinessProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);

  const business = sampleBusinesses.find((b) => b.id === id);

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Business Not Found
          </h1>
          <p className="text-muted-foreground mb-4">
            The business you're looking for doesn't exist.
          </p>
          <Link to="/browse">
            <Button>Browse All Businesses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitReview = () => {
    // In a real app, this would submit to an API
    console.log("Review submitted:", { rating: newRating, comment: newReview });
    setNewReview("");
    setNewRating(5);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">
                  Dubai<span className="text-dubai-gold">Visa</span>Directory
                </h1>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/browse"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Browse Services
                </Link>
                <Link
                  to="/add-business"
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Add Business
                </Link>
                <Button size="sm">Sign In</Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Business Info */}
            <div className="flex-1">
              <div className="flex items-start gap-6 mb-6">
                {business.logo && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white border shadow-sm">
                    <img
                      src={business.logo}
                      alt={`${business.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">
                      {business.name}
                    </h1>

                    <div className="flex items-center gap-2">
                      {business.isVerified && (
                        <Badge className="bg-verified/10 text-verified border-verified/20">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </Badge>
                      )}

                      {business.isScamReported && (
                        <Badge className="bg-warning/10 text-warning border-warning/20">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Reported
                        </Badge>
                      )}

                      {business.importedFromGoogle && (
                        <Badge variant="secondary">
                          <Globe className="w-3 h-3 mr-1" />
                          Google Import
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Badge variant="outline" className="mb-4">
                    {business.category}
                  </Badge>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(business.rating) ? "text-accent fill-accent" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-foreground">
                      {business.rating}
                    </span>
                    <span className="text-muted-foreground">
                      ({business.reviewCount} reviews)
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    {business.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{business.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{business.phone}</span>
                    </div>

                    {business.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{business.email}</span>
                      </div>
                    )}

                    {business.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="lg:w-80">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>

                    {business.whatsapp && (
                      <Button variant="outline" className="w-full" size="lg">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    )}

                    <Button variant="outline" className="w-full" size="lg">
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Heart className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Flag className="w-4 h-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {business.openingHours && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Clock className="w-4 h-4 mr-2" />
                      Opening Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      {Object.entries(business.openingHours).map(
                        ([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="font-medium">{day}</span>
                            <span className="text-muted-foreground">
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

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Business</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {business.description}
                    </p>

                    {business.licenseNo && (
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold mb-2">
                          License Information
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          License No: {business.licenseNo}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Location & Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground">
                        Map placeholder for {business.address}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{business.address}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{business.phone}</span>
                      </div>

                      {business.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{business.email}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Consultation
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Request Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {business.services.map((service, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <h4 className="font-semibold mb-2">{service}</h4>
                      <p className="text-sm text-muted-foreground">
                        Professional {service.toLowerCase()} services with
                        expert guidance.
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {business.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.userAvatar} />
                          <AvatarFallback>
                            {review.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">
                                {review.userName}
                              </h4>
                              {review.isVerified && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-verified/10 text-verified border-verified/20"
                                >
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {review.date}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "text-accent fill-accent" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>

                          <p className="text-muted-foreground mb-4">
                            {review.comment}
                          </p>

                          {review.businessResponse && (
                            <div className="bg-muted/30 p-4 rounded-lg">
                              <h5 className="font-semibold text-sm mb-2">
                                Business Response:
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                {review.businessResponse}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Write a Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-6 h-6 cursor-pointer ${i < newRating ? "text-accent fill-accent" : "text-muted-foreground"}`}
                              onClick={() => setNewRating(i + 1)}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="review">Your Review</Label>
                        <Textarea
                          id="review"
                          placeholder="Share your experience..."
                          value={newReview}
                          onChange={(e) => setNewReview(e.target.value)}
                          className="mt-2"
                          rows={4}
                        />
                      </div>

                      <Button
                        onClick={handleSubmitReview}
                        className="w-full"
                        disabled={!newReview.trim()}
                      >
                        Submit Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Photos
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Add Photos
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {business.gallery?.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-muted rounded-lg overflow-hidden"
                    >
                      <img
                        src={photo}
                        alt={`${business.name} photo ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    </div>
                  ))}

                  {/* Placeholder photos */}
                  {[...Array(8)].map((_, index) => (
                    <div
                      key={`placeholder-${index}`}
                      className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                    >
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
