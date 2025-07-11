import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Building,
  Shield,
  Globe,
  Phone,
  BarChart3,
  Award,
  Clock,
  Zap,
  Crown,
  Camera,
  MessageCircle,
  Target,
  ThumbsUp,
  FileText,
  CreditCard,
  Rocket,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ListBusiness() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title =
      "List Your Visa Consultancy Business - VisaConsult India | Grow Your Business";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "List your visa consultancy business on VisaConsult India. Reach thousands of potential customers, grow your business with our verified platform. Free and premium listing options available.",
      );
    }
  }, []);

  const benefits = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Reach More Customers",
      description:
        "Get discovered by 250K+ monthly users actively searching for visa consultants",
      stat: "250K+ Monthly Users",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Grow Your Business",
      description:
        "Increase your customer base by up to 300% with our verified platform",
      stat: "300% Average Growth",
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Build Trust",
      description:
        "Verified badge and customer reviews help establish credibility",
      stat: "95% Trust Rate",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: "Track Performance",
      description:
        "Get detailed analytics on profile views, leads, and conversions",
      stat: "Real-time Analytics",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Choose Your Plan",
      description:
        "Select from our free basic listing or premium plans with enhanced features",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      step: "2",
      title: "Create Your Profile",
      description:
        "Add your business information, services, photos, and credentials",
      icon: <Building className="h-6 w-6" />,
    },
    {
      step: "3",
      title: "Get Verified",
      description:
        "Our team verifies your credentials and approves your listing within 24-48 hours",
      icon: <CheckCircle className="h-6 w-6" />,
    },
    {
      step: "4",
      title: "Start Getting Leads",
      description:
        "Receive customer inquiries and grow your business immediately",
      icon: <Rocket className="h-6 w-6" />,
    },
  ];

  const features = [
    {
      category: "Basic Features",
      items: [
        "Professional business profile",
        "Contact information display",
        "Service categories listing",
        "Customer review system",
        "Basic search visibility",
        "Mobile-optimized profile",
      ],
    },
    {
      category: "Premium Features",
      items: [
        "Priority search ranking",
        "Enhanced profile with photos/videos",
        "Analytics dashboard",
        "Lead generation tools",
        "Social media integration",
        "Featured listing placement",
      ],
    },
    {
      category: "Business Pro Features",
      items: [
        "Homepage showcase opportunity",
        "Multiple branch listings",
        "Advanced analytics & insights",
        "Dedicated account manager",
        "API integration support",
        "Custom profile design",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      business: "Delhi Global Visa Services",
      location: "Delhi",
      testimonial:
        "VisaConsult India helped us increase our customer inquiries by 400% within 3 months. The verification process gave us credibility.",
      rating: 5,
      increase: "400%",
      metric: "Customer Inquiries",
    },
    {
      name: "Priya Sharma",
      business: "Mumbai Immigration Hub",
      location: "Mumbai",
      testimonial:
        "The analytics dashboard helps us understand our customers better. We've improved our success rate significantly.",
      rating: 5,
      increase: "250%",
      metric: "Profile Views",
    },
    {
      name: "Amit Patel",
      business: "Bangalore Study Abroad",
      location: "Bangalore",
      testimonial:
        "Premium listing gave us the visibility we needed. Now we're the top-rated consultant in our category.",
      rating: 5,
      increase: "300%",
      metric: "Business Growth",
    },
  ];

  const faqs = [
    {
      question: "How quickly will my listing go live?",
      answer:
        "Free listings are reviewed and activated within 24-48 hours. Premium listings are prioritized and typically go live within 4-6 hours after verification.",
    },
    {
      question: "What documents do I need for verification?",
      answer:
        "You'll need business registration certificate, professional license (if applicable), ID proof, and business address proof. Our team will guide you through the process.",
    },
    {
      question: "Can I update my listing information later?",
      answer:
        "Yes, you can update your business information, photos, services, and other details anytime through your dashboard.",
    },
    {
      question: "Do you offer support for setting up my profile?",
      answer:
        "Yes, our support team provides assistance with profile setup. Business Pro customers get dedicated account manager support.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major payment methods including credit/debit cards, UPI, net banking, and digital wallets.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Grow Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                {" "}
                Visa Business{" "}
              </span>
              with India's #1 Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-4xl mx-auto opacity-90">
              Join 8,500+ verified visa consultants who trust VisaConsult India
              to connect with customers and grow their business. Get started
              today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => navigate("/plans")}
              >
                <Rocket className="h-5 w-5 mr-2" />
                Start Free Listing
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => navigate("/contact")}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Talk to Expert
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1">
                  8,500+
                </div>
                <div className="text-sm opacity-80">Verified Consultants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1">250K+</div>
                <div className="text-sm opacity-80">Monthly Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1">95%</div>
                <div className="text-sm opacity-80">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1">50+</div>
                <div className="text-sm opacity-80">Cities Covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose VisaConsult India?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join the platform that's helping visa consultants across India
              grow their business and reach more customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto mb-4">{benefit.icon}</div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{benefit.description}</p>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {benefit.stat}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your business listed in 4 simple steps and start receiving
              customer inquiries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    {step.icon}
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigate("/plans")}>
              Get Started Now <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Every Business
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From basic listings to enterprise solutions, we have features that
              grow with your business
            </p>
          </div>

          <Tabs defaultValue="basic" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
              <TabsTrigger value="business">Business Pro</TabsTrigger>
            </TabsList>

            {features.map((feature, index) => (
              <TabsContent
                key={index}
                value={
                  index === 0 ? "basic" : index === 1 ? "premium" : "business"
                }
                className="mt-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-2xl">
                      {feature.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {feature.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="text-center mt-8">
            <Button
              size="lg"
              onClick={() => navigate("/plans")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              View All Plans & Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how businesses like yours have grown with VisaConsult India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">
                        {testimonial.business}
                      </p>
                    </div>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      +{testimonial.increase}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.metric}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-700 mb-4">
                    "{testimonial.testimonial}"
                  </blockquote>
                  <div className="flex justify-center">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about listing your business
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Still have questions? Our team is here to help!
            </p>
            <Button variant="outline" asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Visa Business?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful visa consultants who trust VisaConsult
            India. Start your free listing today and watch your business grow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigate("/plans")}
            >
              <Star className="h-5 w-5 mr-2" />
              Start Free Listing
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => navigate("/contact")}
            >
              <Phone className="h-5 w-5 mr-2" />
              Talk to Sales
            </Button>
          </div>

          <p className="text-sm opacity-75 mt-6">
            No setup fees • Cancel anytime • 30-day money back guarantee
          </p>
        </div>
      </section>
    </div>
  );
}
