import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  User,
  Building,
  HelpCircle,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiry_type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Contact Us - VisaConsult India | Get Help & Support";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Contact VisaConsult India for support, inquiries, or business partnerships. Get help finding visa consultants or listing your business. 24/7 customer support available.",
      );
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiry_type: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone Support",
      details: "+91-11-4567-8901",
      description: "Mon-Fri 9AM-7PM IST",
      action: "Call Now",
      link: "tel:+911145678901",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Support",
      details: "support@visaconsultindia.com",
      description: "Response within 24 hours",
      action: "Send Email",
      link: "mailto:support@visaconsultindia.com",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Live Chat",
      details: "Chat with our experts",
      description: "Available 24/7",
      action: "Start Chat",
      link: "#",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Office Address",
      details: "Connaught Place, New Delhi",
      description: "Visit by appointment",
      action: "Get Directions",
      link: "#",
    },
  ];

  const faqItems = [
    {
      question: "How do I find the right visa consultant?",
      answer:
        "Use our search filters to find consultants by city, visa type, and ratings. Read reviews and compare success rates to make an informed choice.",
    },
    {
      question: "How do I list my business on the platform?",
      answer:
        "Click 'List Your Business' and choose from our free or premium plans. Complete the verification process to start receiving customer inquiries.",
    },
    {
      question: "Are all consultants verified?",
      answer:
        "Yes, we verify all consultants' licenses, credentials, and track records before they can join our platform.",
    },
    {
      question: "What if I have an issue with a consultant?",
      answer:
        "Contact our support team immediately. We investigate all complaints and take appropriate action to ensure customer satisfaction.",
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
                Message Sent Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for contacting us. Our team will get back to you
                within 24 hours.
              </p>
              <Button asChild>
                <Link to="/">Return to Homepage</Link>
              </Button>
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
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            Need help finding the right visa consultant or have questions about
            our platform? We're here to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Live Chat
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                Choose the most convenient way to reach us. Our support team is
                ready to help you find the perfect visa consultant for your
                needs.
              </p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                          {info.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {info.title}
                          </h3>
                          <p className="text-gray-900 mb-1">{info.details}</p>
                          <p className="text-sm text-gray-600 mb-3">
                            {info.description}
                          </p>
                          <Button size="sm" variant="outline" asChild>
                            <a href={info.link}>{info.action}</a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/browse">
                      <User className="h-4 w-4 mr-2" />
                      Find Consultants
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/plans">
                      <Building className="h-4 w-4 mr-2" />
                      List Your Business
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/cant-find-business">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Can't Find Business?
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="inquiry_type">Inquiry Type *</Label>
                        <Select
                          value={formData.inquiry_type}
                          onValueChange={(value) =>
                            handleInputChange("inquiry_type", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">
                              General Inquiry
                            </SelectItem>
                            <SelectItem value="find_consultant">
                              Help Finding Consultant
                            </SelectItem>
                            <SelectItem value="business_listing">
                              Business Listing
                            </SelectItem>
                            <SelectItem value="technical_support">
                              Technical Support
                            </SelectItem>
                            <SelectItem value="complaint">
                              Complaint/Issue
                            </SelectItem>
                            <SelectItem value="partnership">
                              Partnership
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Brief description of your inquiry"
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        placeholder="Please provide details about your inquiry. For consultant recommendations, mention your visa type, destination country, and city preference."
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By submitting this form, you agree to our privacy policy
                      and terms of service.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            {faqItems.map((faq, index) => (
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
              Still have questions? We're here to help!
            </p>
            <Button size="lg" asChild>
              <Link to="#contact-form">Send us a Message</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Business Hours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Phone Support</h3>
                  <p className="text-sm text-gray-600">
                    Monday - Friday
                    <br />
                    9:00 AM - 7:00 PM IST
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Live Chat</h3>
                  <p className="text-sm text-gray-600">
                    Available 24/7
                    <br />
                    Instant Response
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Email Support</h3>
                  <p className="text-sm text-gray-600">
                    Response within 24 hours
                    <br />
                    Monday - Sunday
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
