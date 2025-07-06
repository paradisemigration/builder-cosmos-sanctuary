import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  Eye,
  Edit,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  AlertCircle,
  Settings,
  Camera,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sampleBusinesses } from "@/lib/data";

export default function BusinessDashboard() {
  const { user, logout } = useAuth();

  // Get business for the logged-in user
  const business =
    sampleBusinesses.find((b) => b.id === user?.businessId) ||
    sampleBusinesses[0];
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const stats = [
    { label: "Profile Views", value: "1,234", change: "+12%", icon: Eye },
    {
      label: "Total Reviews",
      value: business.reviewCount.toString(),
      change: "+5%",
      icon: MessageSquare,
    },
    {
      label: "Average Rating",
      value: business.rating.toString(),
      change: "+0.2",
      icon: Star,
    },
    {
      label: "Click to Website",
      value: "456",
      change: "+18%",
      icon: TrendingUp,
    },
  ];

  const recentReviews = business.reviews.map((review, index) => ({
    ...review,
    date: `2024-01-${15 + index}`,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">
                  Business<span className="text-dubai-gold">Dashboard</span>
                </h1>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-muted-foreground">
                Welcome, {user?.name}
              </div>
              <Link to={`/business/${business.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Public Page
                </Button>
              </Link>
              <Button size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex items-start gap-4">
            {business.logo && (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted border flex-shrink-0">
                <img
                  src={business.logo}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {business.name}
              </h2>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline">{business.category}</Badge>
                {business.isVerified ? (
                  <Badge className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary">Pending Verification</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{business.address}</p>
            </div>
          </div>

          <div className="lg:ml-auto flex gap-3">
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Add Photos
            </Button>
          </div>
        </div>

        {/* Verification Alert */}
        {!business.isVerified && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your business listing is pending verification. Our team will
              review your submission within 24-48 hours.
              <Link to="/help" className="text-primary hover:underline ml-1">
                Learn more
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">New review received</p>
                          <p className="text-sm text-muted-foreground">
                            Ahmed Hassan left a 5-star review
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground ml-auto">
                          2 hours ago
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Eye className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">Profile viewed</p>
                          <p className="text-sm text-muted-foreground">
                            45 new profile views today
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground ml-auto">
                          1 day ago
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Contact inquiry</p>
                          <p className="text-sm text-muted-foreground">
                            3 people contacted you via WhatsApp
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground ml-auto">
                          2 days ago
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-muted-foreground">
                          {business.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {business.services.map((service, index) => (
                            <Badge key={index} variant="secondary">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">
                          Contact Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Phone:</strong> {business.phone}
                          </p>
                          <p>
                            <strong>Email:</strong> {business.email}
                          </p>
                          {business.website && (
                            <p>
                              <strong>Website:</strong> {business.website}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full justify-start">
                        <Edit className="w-4 h-4 mr-2" />
                        Update Business Info
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Manage Photos
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Respond to Reviews
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Profile Views
                        </span>
                        <span className="font-medium">1,234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          New Reviews
                        </span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          WhatsApp Clicks
                        </span>
                        <span className="font-medium">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Phone Calls
                        </span>
                        <span className="font-medium">23</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-border last:border-0 pb-6 last:pb-0"
                    >
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
                                <Badge variant="outline" className="text-xs">
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

                          {review.businessResponse ? (
                            <div className="bg-muted/30 p-4 rounded-lg">
                              <h5 className="font-semibold text-sm mb-2">
                                Your Response:
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                {review.businessResponse}
                              </p>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Respond
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-muted-foreground">
                Detailed analytics and insights coming soon!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Business Settings
              </h3>
              <p className="text-muted-foreground">
                Manage your business settings and preferences.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
