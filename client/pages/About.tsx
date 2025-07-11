import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Award,
  Shield,
  Globe,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  TrendingUp,
  Heart,
  Target,
  Zap,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function About() {
  useEffect(() => {
    document.title =
      "About Us - VisaConsult India | India's Leading Visa Consultant Directory";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Learn about VisaConsult India - India's most trusted platform connecting visa applicants with verified immigration consultants. Our mission, values, and commitment to your visa journey.",
      );
    }
  }, []);

  const stats = [
    {
      icon: <Users className="h-6 w-6" />,
      value: "8,500+",
      label: "Verified Consultants",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      value: "2.5L+",
      label: "Successful Applications",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      value: "50+",
      label: "Cities Covered",
    },
    { icon: <Star className="h-6 w-6" />, value: "95%", label: "Success Rate" },
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Trust & Verification",
      description:
        "Every consultant on our platform undergoes rigorous verification to ensure they meet the highest standards of professionalism and expertise.",
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Customer First",
      description:
        "We prioritize your visa journey above all else. Our platform is designed to make finding the right consultant simple and stress-free.",
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Success Focused",
      description:
        "We connect you with consultants who have proven track records and high success rates for your specific visa type and destination.",
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Innovation",
      description:
        "We continuously improve our platform using the latest technology to provide the best user experience and most accurate information.",
    },
  ];

  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      description:
        "15+ years in immigration consulting with expertise in US, Canada, and Australia visa processes.",
      image: "/api/placeholder/150/150",
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      description:
        "Former visa officer with deep understanding of immigration policies and consultant verification.",
      image: "/api/placeholder/150/150",
    },
    {
      name: "Amit Patel",
      role: "Technology Lead",
      description:
        "IIT graduate with passion for creating technology solutions that simplify complex processes.",
      image: "/api/placeholder/150/150",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About VisaConsult India
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            India's most trusted platform connecting visa applicants with
            verified immigration experts. We're on a mission to make visa
            consulting transparent, reliable, and accessible to everyone.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2 text-blue-200">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold">
                  {stat.value}
                </div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                To democratize access to reliable visa consulting services
                across India by creating a transparent, trustworthy platform
                that connects visa applicants with the most qualified
                immigration experts.
              </p>
              <p className="text-gray-600 mb-8">
                We believe that every person deserves access to professional
                guidance for their international dreams. Whether you're a
                student aspiring to study abroad, a professional seeking global
                opportunities, or a family planning to immigrate, we're here to
                help you find the right consultant who understands your unique
                needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/browse">Find Consultants</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/plans">List Your Business</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/api/placeholder/500/400"
                alt="Our Mission"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="font-semibold">Trusted by 250K+ Users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and shape our
              commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto mb-4">{value.icon}</div>
                  <CardTitle className="text-xl font-semibold">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to revolutionizing the visa
              consulting industry in India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {member.name}
                  </CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From a simple idea to India's largest visa consultant directory
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="bg-blue-600 text-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">
                    2019 - The Beginning
                  </h3>
                  <p>
                    Founded with a vision to solve the trust deficit in visa
                    consulting
                  </p>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700">
                  Started as a small team of immigration experts and technology
                  enthusiasts who experienced firsthand the challenges of
                  finding reliable visa consultants. We realized the need for a
                  transparent platform that could connect genuine consultants
                  with visa applicants.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="md:w-1/3">
                <div className="bg-green-600 text-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">
                    2021 - Rapid Growth
                  </h3>
                  <p>Reached 1,000+ verified consultants across 25+ cities</p>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700">
                  Expanded our verification process and built trust among both
                  consultants and applicants. Launched advanced search features
                  and introduced our rating system to ensure quality services.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="bg-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">
                    2024 - Industry Leader
                  </h3>
                  <p>
                    Now serving 250K+ users with 8,500+ verified consultants
                  </p>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700">
                  Today, we're proud to be India's most trusted visa consultant
                  directory, helping thousands achieve their international
                  dreams every month while maintaining the highest standards of
                  quality and trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Visa Journey?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect visa
            consultant through our platform
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex items-center justify-center gap-3">
              <Phone className="h-5 w-5 text-blue-400" />
              <span>+91-11-4567-8901</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Mail className="h-5 w-5 text-blue-400" />
              <span>support@visaconsultindia.com</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock className="h-5 w-5 text-blue-400" />
              <span>24/7 Support Available</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/browse">Find Consultants</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-gray-900"
              asChild
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <p>&copy; 2024 VisaConsult India. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
