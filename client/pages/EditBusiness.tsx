import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Save,
  X,
  Upload,
  Trash2,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sampleBusinesses, businessCategories, indianCities } from "@/lib/data";

export default function EditBusiness() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [formData, setFormData] = useState({});
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load business data
    const foundBusiness = sampleBusinesses.find((b) => b.id === id);
    if (foundBusiness) {
      setBusiness(foundBusiness);
      setFormData({
        name: foundBusiness.name,
        category: foundBusiness.category,
        description: foundBusiness.description,
        address: foundBusiness.address,
        phone: foundBusiness.phone,
        whatsapp: foundBusiness.whatsapp || "",
        email: foundBusiness.email,
        website: foundBusiness.website || "",
        licenseNo: foundBusiness.licenseNo || "",
      });
      setServices(foundBusiness.services || []);
    }
  }, [id]);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices((prev) => [...prev, newService.trim()]);
      setNewService("");
      setHasChanges(true);
    }
  };

  const removeService = (service) => {
    setServices((prev) => prev.filter((s) => s !== service));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setHasChanges(false);
    alert("Business updated successfully!");
  };

  const handleStatusChange = (newStatus) => {
    // Handle status change for admin users
    alert(`Business status changed to: ${newStatus}`);
  };

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Business Not Found
          </h1>
          <p className="text-muted-foreground mb-4">
            The business you're trying to edit doesn't exist.
          </p>
          <Link to="/admin">
            <Button>Back to Admin Panel</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl font-semibold text-foreground">
                Edit Business
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {hasChanges && (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  Unsaved Changes
                </Badge>
              )}
              <Button variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving || !hasChanges}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Status Card (Admin Only) */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Business Status
              <div className="flex items-center gap-2">
                {business.isVerified ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Pending Review
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                size="sm"
                onClick={() => handleStatusChange("approved")}
                disabled={business.isVerified}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange("rejected")}
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange("suspended")}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Suspend
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => updateFormData("name", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category || ""}
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

                  <div>
                    <Label htmlFor="license">License Number</Label>
                    <Input
                      id="license"
                      value={formData.licenseNo || ""}
                      onChange={(e) =>
                        updateFormData("licenseNo", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) =>
                      updateFormData("description", e.target.value)
                    }
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ""}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp || ""}
                      onChange={(e) =>
                        updateFormData("whatsapp", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => updateFormData("email", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website || ""}
                      onChange={(e) =>
                        updateFormData("website", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a service"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addService()}
                    />
                    <Button onClick={addService} disabled={!newService.trim()}>
                      Add
                    </Button>
                  </div>

                  {services.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {services.map((service, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {service}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-1"
                            onClick={() => removeService(service)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Business Logo */}
            <Card>
              <CardHeader>
                <CardTitle>Business Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {business.logo && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted border">
                      <img
                        src={business.logo}
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Logo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <span className="font-medium">{business.rating}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reviews</span>
                  <span className="font-medium">{business.reviewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant={business.isVerified ? "default" : "secondary"}
                  >
                    {business.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    These actions are irreversible. Please proceed with caution.
                  </AlertDescription>
                </Alert>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Business
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
