import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  X,
  Plus,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { businessCategories, dubaiZones } from "@/lib/data";

interface BusinessFormData {
  name: string;
  category: string;
  description: string;
  services: string[];
  address: string;
  zone: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  licenseNo: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

export default function AddBusiness() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BusinessFormData>({
    name: "",
    category: "",
    description: "",
    services: [],
    address: "",
    zone: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    licenseNo: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [newService, setNewService] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const updateFormData = (field: keyof BusinessFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, newService.trim()],
      }));
      setNewService("");
    }
  };

  const removeService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s !== service),
    }));
  };

  const handleFileUpload = (file: File, type: "logo" | "cover" | "gallery") => {
    if (type === "logo") {
      setLogo(file);
    } else if (type === "cover") {
      setCoverImage(file);
    } else {
      setGalleryImages((prev) => [...prev, file]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // In a real app, this would submit to an API
    console.log("Business submitted:", {
      ...formData,
      logo,
      coverImage,
      galleryImages,
    });
    alert("Business listing submitted for review!");
  };

  const canProceedToNext = () => {
    if (currentStep === 1) {
      return formData.name && formData.category && formData.description;
    }
    if (currentStep === 2) {
      return formData.services.length > 0;
    }
    if (currentStep === 3) {
      return formData.address && formData.phone && formData.email;
    }
    if (currentStep === 4) {
      return formData.ownerName && formData.ownerEmail && agreeToTerms;
    }
    return true;
  };

  const steps = [
    { number: 1, title: "Basic Information" },
    { number: 2, title: "Services & Photos" },
    { number: 3, title: "Contact Details" },
    { number: 4, title: "Review & Submit" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Browse Services
                </Link>
                <Link
                  to="/add-business"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Add Business
                </Link>
                <Link to="/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Add Your Business
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join Dubai's trusted directory of immigration and visa services.
              Reach more customers and grow your business.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step.number <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`ml-3 text-sm font-medium ${
                    step.number <= currentStep
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-4 ${
                    step.number < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              Step {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Business Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your business name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Service Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        updateFormData("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Business Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your business and services..."
                    value={formData.description}
                    onChange={(e) =>
                      updateFormData("description", e.target.value)
                    }
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="license">Trade License Number</Label>
                  <Input
                    id="license"
                    placeholder="DED-XXXXX"
                    value={formData.licenseNo}
                    onChange={(e) =>
                      updateFormData("licenseNo", e.target.value)
                    }
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <Label>Services Offered *</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add a service"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addService()}
                    />
                    <Button onClick={addService} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {formData.services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.services.map((service) => (
                        <div
                          key={service}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {service}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0"
                            onClick={() => removeService(service)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>Business Logo</Label>
                    <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload logo (optional)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleFileUpload(e.target.files[0], "logo")
                        }
                        className="hidden"
                        id="logo-upload"
                      />
                      <Label htmlFor="logo-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                      {logo && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {logo.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Cover Image</Label>
                    <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload cover (optional)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleFileUpload(e.target.files[0], "cover")
                        }
                        className="hidden"
                        id="cover-upload"
                      />
                      <Label htmlFor="cover-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>Choose File</span>
                        </Button>
                      </Label>
                      {coverImage && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {coverImage.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Gallery Images</Label>
                    <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload photos (max 5)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          Array.from(e.target.files || []).forEach((file) =>
                            handleFileUpload(file, "gallery"),
                          );
                        }}
                        className="hidden"
                        id="gallery-upload"
                      />
                      <Label
                        htmlFor="gallery-upload"
                        className="cursor-pointer"
                      >
                        <Button variant="outline" size="sm" asChild>
                          <span>Choose Files</span>
                        </Button>
                      </Label>
                      {galleryImages.length > 0 && (
                        <div className="mt-2">
                          {galleryImages.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-xs text-muted-foreground"
                            >
                              <span>{file.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0"
                                onClick={() => removeGalleryImage(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="address">Business Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete address"
                      value={formData.address}
                      onChange={(e) =>
                        updateFormData("address", e.target.value)
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="zone">Dubai Zone</Label>
                    <Select
                      value={formData.zone}
                      onValueChange={(value) => updateFormData("zone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {dubaiZones.map((zone) => (
                          <SelectItem key={zone} value={zone}>
                            {zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+971-4-XXX-XXXX"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input
                      id="whatsapp"
                      placeholder="+971-50-XXX-XXXX"
                      value={formData.whatsapp}
                      onChange={(e) =>
                        updateFormData("whatsapp", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Business Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="info@business.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      placeholder="https://www.business.com"
                      value={formData.website}
                      onChange={(e) =>
                        updateFormData("website", e.target.value)
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Business Owner Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="ownerName">Owner Name *</Label>
                        <Input
                          id="ownerName"
                          placeholder="Enter owner's full name"
                          value={formData.ownerName}
                          onChange={(e) =>
                            updateFormData("ownerName", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="ownerPhone">Owner Phone *</Label>
                        <Input
                          id="ownerPhone"
                          placeholder="+971-50-XXX-XXXX"
                          value={formData.ownerPhone}
                          onChange={(e) =>
                            updateFormData("ownerPhone", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor="ownerEmail">Owner Email *</Label>
                      <Input
                        id="ownerEmail"
                        type="email"
                        placeholder="owner@business.com"
                        value={formData.ownerEmail}
                        onChange={(e) =>
                          updateFormData("ownerEmail", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Review Your Information
                    </h3>
                    <div className="bg-muted/30 p-6 rounded-lg space-y-4">
                      <div>
                        <h4 className="font-semibold">{formData.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formData.category}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm">{formData.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{formData.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{formData.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{formData.email}</span>
                        </div>
                        {formData.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>{formData.website}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={setAgreeToTerms}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-primary hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          Approval Process
                        </h4>
                        <p className="text-sm text-blue-700">
                          Your listing will be reviewed by our team within 24-48
                          hours. You'll receive an email confirmation once
                          approved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceedToNext()}
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedToNext()}
              size="lg"
            >
              Submit for Review
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
