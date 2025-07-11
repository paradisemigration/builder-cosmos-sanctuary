import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Building,
  CheckCircle,
  Star,
  ArrowRight,
  HelpCircle,
  Send,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CantFindBusiness() {
  const [businessName, setBusinessName] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title =
      "Can't Find Your Business? - VisaConsult India | Request Listing";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Can't find your visa consultancy business on VisaConsult India? Request to add your business or report missing listings. We'll help get you listed quickly.",
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setBusinessName("");
      setBusinessLocation("");
      setContactInfo("");
      setAdditionalInfo("");
    }, 3000);
  };

  const quickActions = [
    {
      icon: <Plus className="h-6 w-6" />,
      title: "Add Your Business",
      description: "Create a new listing for your visa consultancy",
      action: "Get Started",
      link: "/plans",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Advanced Search",
      description: "Try searching with different keywords or filters",
      action: "Search Again",
      link: "/browse",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Contact Support",
      description: "Get personalized help finding the right consultant",
      action: "Get Help",
      link: "/contact",
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  const reasons = [
    {
      title: "Business is New",
      description:
        "Recently established consultancies may not be listed yet. We can fast-track the verification process.",
    },
    {
      title: "Different Business Name",
      description:
        "The business might be listed under a different name or legal entity. Try searching for variations.",
    },
    {
      title: "Location Specific",
      description:
        "Some consultants operate from multiple locations. Check different city filters.",
    },
    {
      title: "Not Yet Verified",
      description:
        "The business might be in our verification queue. Contact us to check the status.",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Submit Request",
      description:
        "Fill out the form below with the business details you're looking for.",
    },
    {
      step: "2",
      title: "We Investigate",
      description:
        "Our team searches and verifies the business information within 24-48 hours.",
    },
    {
      step: "3",
      title: "Get Results",
      description:
        "We'll contact you with findings and help connect you with the consultant.",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Request Submitted Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for your request. Our team will investigate and get
                back to you within 24-48 hours with information about the
                business you're looking for.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/browse">Continue Browsing</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">Return Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Can't Find Your Business?
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            Looking for a specific visa consultant that's not showing up in our
            directory? We're here to help you find them or get them listed.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What would you like to do?
            </h2>
            <p className="text-lg text-gray-600">
              Choose the option that best describes your situation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <div className="text-gray-600">{action.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{action.description}</p>
                  <Button
                    className={`w-full ${action.color} text-white`}
                    asChild
                  >
                    <Link to={action.link}>
                      {action.action}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Request Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Request Missing Business
              </h2>
              <p className="text-gray-600 mb-8">
                Can't find the visa consultant you're looking for? Fill out this
                form and we'll help locate them or assist in getting them listed
                on our platform.
              </p>

              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="business-name">Business Name *</Label>
                      <Input
                        id="business-name"
                        type="text"
                        placeholder="Enter the business name you're looking for"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="business-location">Location/City *</Label>
                      <Input
                        id="business-location"
                        type="text"
                        placeholder="City where the business is located"
                        value={businessLocation}
                        onChange={(e) => setBusinessLocation(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact-info">
                        Known Contact Information
                      </Label>
                      <Input
                        id="contact-info"
                        type="text"
                        placeholder="Phone, email, or website (if known)"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="additional-info">
                        Additional Information
                      </Label>
                      <Textarea
                        id="additional-info"
                        rows={4}
                        placeholder="Any other details that might help us find this business (address, services offered, consultant name, etc.)"
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                      />
                    </div>

                    <Alert>
                      <HelpCircle className="h-4 w-4" />
                      <AlertDescription>
                        Our team will search for this business and verify their
                        credentials. If found, we'll help you connect with them.
                        If not listed, we'll reach out to them about joining our
                        platform.
                      </AlertDescription>
                    </Alert>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting Request...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Why might a business be missing?
              </h2>

              <div className="space-y-6 mb-8">
                {reasons.map((reason, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {reason.title}
                      </h3>
                      <p className="text-gray-600">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-6">
                How we help you find businesses
              </h3>

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {step.title}
                      </h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Need immediate help?
                </h4>
                <p className="text-blue-800 text-sm mb-4">
                  Contact our support team for personalized assistance in
                  finding the right visa consultant.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/contact">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Solutions */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Alternative Solutions
            </h2>
            <p className="text-lg text-gray-600">
              While we search for your specific business, consider these options
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Top Rated Consultants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Browse our highest-rated visa consultants in your city. All
                  are verified and have excellent success records.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/browse">View Top Rated</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-500" />
                  Similar Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Find consultants offering similar visa services in your area.
                  Filter by visa type and destination country.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/browse">Browse Services</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Are you a visa consultant?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join VisaConsult India and connect with thousands of visa applicants
            looking for expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              asChild
            >
              <Link to="/plans">
                <Plus className="h-4 w-4 mr-2" />
                List Your Business
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
