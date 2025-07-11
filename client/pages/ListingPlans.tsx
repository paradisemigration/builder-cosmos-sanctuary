import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  Star,
  Zap,
  Crown,
  Shield,
  TrendingUp,
  Camera,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Award,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const plans = [
  {
    id: "free",
    name: "Free Listing",
    price: 0,
    period: "Forever",
    description: "Get started with basic listing features",
    icon: <Shield className="h-6 w-6" />,
    color: "border-gray-200",
    buttonColor: "bg-gray-600 hover:bg-gray-700",
    features: [
      "Basic business profile",
      "Contact information display",
      "Business category listing",
      "Customer reviews",
      "Basic search visibility",
    ],
    limitations: [
      "Limited to 3 photos",
      "No priority ranking",
      "No featured badge",
      "Standard support only",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 2999,
    period: "per month",
    description: "Enhanced visibility and professional features",
    icon: <Star className="h-6 w-6" />,
    color: "border-orange-300 bg-orange-50",
    buttonColor: "bg-orange-600 hover:bg-orange-700",
    popular: true,
    features: [
      "All Free features included",
      "Up to 20 photos & videos",
      "Premium badge & verification",
      "Priority search ranking",
      "Analytics dashboard",
      "WhatsApp integration",
      "Social media links",
      "Priority customer support",
      "Mobile-optimized profile",
    ],
    limitations: [],
    savings: "Save ₹6,000 annually",
  },
  {
    id: "business",
    name: "Business Pro",
    price: 4999,
    period: "per month",
    description: "Complete business growth solution",
    icon: <Crown className="h-6 w-6" />,
    color: "border-purple-300 bg-purple-50",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    features: [
      "All Premium features included",
      "Unlimited photos & videos",
      "Featured listing placement",
      "Homepage showcase opportunity",
      "Advanced analytics & insights",
      "Lead generation tools",
      "Multiple branch listings",
      "API integration support",
      "Dedicated account manager",
      "Custom profile design",
      "Social media promotion",
    ],
    limitations: [],
    savings: "Save ₹12,000 annually",
  },
];

const additionalFeatures = [
  {
    icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
    title: "Boost Your Visibility",
    description: "Get up to 10x more profile views with premium placement",
  },
  {
    icon: <Users className="h-8 w-8 text-purple-600" />,
    title: "Generate More Leads",
    description: "Connect with customers actively searching for your services",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "Track Performance",
    description: "Monitor your listing performance with detailed analytics",
  },
  {
    icon: <Award className="h-8 w-8 text-green-600" />,
    title: "Build Trust",
    description: "Verified badges and customer reviews build credibility",
  },
];

const successStories = [
  {
    name: "Delhi Visa Experts",
    location: "Delhi",
    increase: "300%",
    metric: "Lead Generation",
    quote:
      "Premium listing helped us triple our customer inquiries within 2 months.",
  },
  {
    name: "Mumbai Immigration Hub",
    location: "Mumbai",
    increase: "250%",
    metric: "Profile Views",
    quote:
      "Featured placement gave us incredible visibility in search results.",
  },
  {
    name: "Bangalore Study Abroad",
    location: "Bangalore",
    increase: "400%",
    metric: "Customer Calls",
    quote:
      "The analytics helped us understand our customers better and improve our services.",
  },
];

export default function ListingPlans() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const getPrice = (plan: (typeof plans)[0]) => {
    if (plan.price === 0) return "Free";

    const price = billingCycle === "yearly" ? plan.price * 10 : plan.price;
    return `₹${price.toLocaleString()}`;
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Redirect to add-business page with selected plan
    navigate(`/add-business?plan=${planId}&billing=${billingCycle}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Grow Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">
              {" "}
              Visa Business{" "}
            </span>
            with VisaConsult India
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Join thousands of successful visa consultants who have grown their
            business with our platform. Choose the perfect plan for your needs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span
              className={`font-medium ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"}`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly",
                )
              }
              className={`relative w-16 h-8 rounded-full transition-colors ${
                billingCycle === "yearly" ? "bg-orange-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  billingCycle === "yearly" ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`font-medium ${billingCycle === "yearly" ? "text-gray-900" : "text-gray-500"}`}
            >
              Yearly
            </span>
            {billingCycle === "yearly" && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Save 17%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.color} ${
                  plan.popular ? "scale-105 shadow-xl" : "shadow-lg"
                } transition-all duration-300 hover:shadow-2xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-white shadow-lg">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {getPrice(plan)}
                    {plan.price > 0 && (
                      <span className="text-lg font-normal text-gray-600">
                        /{billingCycle === "yearly" ? "year" : "month"}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                  {plan.savings && billingCycle === "yearly" && (
                    <Badge variant="secondary" className="mt-2">
                      {plan.savings}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Included Features:
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Limitations:
                      </h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-5 w-5 mt-0.5 flex-shrink-0 flex items-center justify-center">
                              <div className="h-1 w-3 bg-gray-400 rounded"></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {limitation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full ${plan.buttonColor} text-white`}
                    size="lg"
                  >
                    {plan.price === 0 ? "Get Started Free" : "Choose Plan"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  {plan.price > 0 && (
                    <p className="text-xs text-center text-gray-500">
                      No setup fees • Cancel anytime • 30-day money back
                      guarantee
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose VisaConsult India?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join the platform that's helping visa consultants across India
              grow their business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-gray-50 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
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
              See how businesses like yours have grown with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      +{story.increase}
                    </div>
                    <div className="text-sm text-gray-600">{story.metric}</div>
                  </div>
                  <blockquote className="text-gray-700 mb-4 italic">
                    "{story.quote}"
                  </blockquote>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {story.name}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {story.location}
                    </div>
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
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How quickly will my listing go live?",
                answer:
                  "Free listings are reviewed and activated within 24 hours. Premium listings are prioritized and typically go live within 2-4 hours.",
              },
              {
                question: "Can I upgrade or downgrade my plan anytime?",
                answer:
                  "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely.",
              },
              {
                question: "Do you offer a money-back guarantee?",
                answer:
                  "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your full payment.",
              },
              {
                question: "Can I have multiple branch listings?",
                answer:
                  "Yes, Business Pro plan includes multiple branch listings. You can manage all your locations from a single dashboard.",
              },
            ].map((faq, index) => (
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Visa Business?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful visa consultants who trust VisaConsult
            India to grow their business and connect with customers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleSelectPlan("premium")}
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              Start with Premium <Star className="h-4 w-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-orange-600"
              onClick={() => handleSelectPlan("free")}
            >
              Try Free First <Shield className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <p className="text-sm opacity-75 mt-4">
            No setup fees • Cancel anytime • 24/7 support
          </p>
        </div>
      </section>
    </div>
  );
}
