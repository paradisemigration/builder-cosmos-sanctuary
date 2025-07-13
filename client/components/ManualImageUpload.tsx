import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  Image,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Camera,
  FileImage,
  Building,
} from "lucide-react";
import { toast } from "sonner";

interface Business {
  id: string;
  name: string;
  city: string;
  googlePlaceId: string;
  logo: string | null;
  coverImage: string | null;
  gallery: string | null;
}

interface UploadProgress {
  [businessId: string]: {
    logo?: boolean;
    cover?: boolean;
    gallery?: boolean;
    uploading?: boolean;
  };
}

export function ManualImageUpload() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null,
  );
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(
    null,
  );

  // Configure API base URL
  const getApiUrl = (endpoint: string) => {
    const override = localStorage.getItem("VITE_API_URL_OVERRIDE");
    if (override) {
      return `${override}${endpoint}`;
    }
    const baseUrl = import.meta.env.VITE_API_URL || "";
    return baseUrl ? `${baseUrl}${endpoint}` : endpoint;
  };

  // Check if backend API is available
  const checkBackendHealth = async () => {
    // Detect frontend-only deployments
    const hostname = window.location.hostname;
    const isFrontendOnlyDeployment =
      hostname.includes("fly.dev") ||
      hostname.includes("vercel.app") ||
      hostname.includes("netlify.app") ||
      hostname.includes("github.io");

    // If this is a frontend-only deployment, immediately mark as unavailable
    if (isFrontendOnlyDeployment) {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        setBackendAvailable(false);
        return false;
      }
    }

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("timeout")), 3000);
      });

      const fetchPromise = fetch(getApiUrl("/api/scraping/stats"), {
        method: "HEAD",
        mode: "cors",
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      const available = response && response.ok;
      setBackendAvailable(available);
      return available;
    } catch (error) {
      setBackendAvailable(false);
      return false;
    }
  };

  // Load businesses missing images
  const loadBusinessesMissingImages = async () => {
    // Check backend availability first
    const isBackendAvailable = await checkBackendHealth();

    if (!isBackendAvailable) {
      console.log("🚫 Backend unavailable - skipping businesses load");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        getApiUrl("/api/admin/businesses-missing-images"),
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setBusinesses(result.businesses || []);
      } else {
        toast.error(
          "Failed to load businesses: " + (result.error || "Unknown error"),
        );
      }
    } catch (error) {
      console.error("Error loading businesses:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error("Cannot connect to backend API");
        setBackendAvailable(false);
      } else {
        toast.error("Error loading businesses: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinessesMissingImages();
  }, []);

  // Upload single image to S3
  const uploadImageToS3 = async (
    file: File,
    businessId: string,
    imageType: "logo" | "cover" | "gallery",
  ) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("businessId", businessId);
      formData.append("imageType", imageType);

      const response = await fetch(
        getApiUrl("/api/admin/upload-business-image"),
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (result.success) {
        return result.imageUrl;
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    businessId: string,
    imageType: "logo" | "cover" | "gallery",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      setUploadProgress((prev) => ({
        ...prev,
        [businessId]: { ...prev[businessId], uploading: true },
      }));

      const imageUrl = await uploadImageToS3(file, businessId, imageType);

      // Update local state
      setBusinesses((prev) =>
        prev.map((business) => {
          if (business.id === businessId) {
            const updated = { ...business };
            if (imageType === "logo") updated.logo = imageUrl;
            else if (imageType === "cover") updated.coverImage = imageUrl;
            else if (imageType === "gallery") {
              const existingGallery = updated.gallery
                ? JSON.parse(updated.gallery)
                : [];
              existingGallery.push(imageUrl);
              updated.gallery = JSON.stringify(existingGallery);
            }
            return updated;
          }
          return business;
        }),
      );

      setUploadProgress((prev) => ({
        ...prev,
        [businessId]: {
          ...prev[businessId],
          [imageType === "cover" ? "cover" : imageType]: true,
          uploading: false,
        },
      }));

      toast.success(
        `${imageType.charAt(0).toUpperCase() + imageType.slice(1)} uploaded successfully!`,
      );
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(`Failed to upload ${imageType}`);
      setUploadProgress((prev) => ({
        ...prev,
        [businessId]: { ...prev[businessId], uploading: false },
      }));
    }

    // Reset file input
    event.target.value = "";
  };

  // Get missing images count for a business
  const getMissingImagesCount = (business: Business) => {
    let missing = 0;
    if (!business.logo) missing++;
    if (!business.coverImage) missing++;
    if (
      !business.gallery ||
      business.gallery === "[]" ||
      business.gallery === ""
    )
      missing++;
    return missing;
  };

  // Check if business has specific image type
  const hasImage = (business: Business, type: "logo" | "cover" | "gallery") => {
    if (type === "logo") return !!business.logo;
    if (type === "cover") return !!business.coverImage;
    if (type === "gallery") {
      try {
        const gallery = business.gallery ? JSON.parse(business.gallery) : [];
        return gallery.length > 0;
      } catch {
        return false;
      }
    }
    return false;
  };

  const ImageUploadDialog = ({ business }: { business: Business }) => (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <Building className="w-5 h-5 mr-2" />
          Upload Images for {business.name}
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Image className="w-4 h-4 mr-2" />
              Logo
              {hasImage(business, "logo") && (
                <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {business.logo && (
              <div className="mb-3">
                <img
                  src={business.logo}
                  alt="Current logo"
                  className="w-full h-24 object-cover rounded border"
                />
                <p className="text-xs text-gray-500 mt-1">Current logo</p>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, business.id, "logo")}
              disabled={uploadProgress[business.id]?.uploading}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">Upload business logo</p>
          </CardContent>
        </Card>

        {/* Cover Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              Cover Photo
              {hasImage(business, "cover") && (
                <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {business.coverImage && (
              <div className="mb-3">
                <img
                  src={business.coverImage}
                  alt="Current cover"
                  className="w-full h-24 object-cover rounded border"
                />
                <p className="text-xs text-gray-500 mt-1">Current cover</p>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, business.id, "cover")}
              disabled={uploadProgress[business.id]?.uploading}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">Upload cover photo</p>
          </CardContent>
        </Card>

        {/* Gallery Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <FileImage className="w-4 h-4 mr-2" />
              Gallery
              {hasImage(business, "gallery") && (
                <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {business.gallery && business.gallery !== "[]" && (
              <div className="mb-3">
                <div className="grid grid-cols-2 gap-2">
                  {JSON.parse(business.gallery || "[]")
                    .slice(0, 4)
                    .map((url: string, index: number) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-16 object-cover rounded border"
                      />
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Current gallery</p>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, business.id, "gallery")}
              disabled={uploadProgress[business.id]?.uploading}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">Add gallery image</p>
          </CardContent>
        </Card>
      </div>

      {uploadProgress[business.id]?.uploading && (
        <div className="flex items-center justify-center mt-4 p-4 bg-blue-50 rounded">
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-sm text-blue-700">Uploading to AWS S3...</span>
        </div>
      )}
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Manual Image Upload
          </h2>
          <p className="text-gray-600">
            Upload missing business images to AWS S3
          </p>
        </div>
        <Button
          onClick={loadBusinessesMissingImages}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Businesses Missing Images
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {businesses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Upload className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Manual Uploads
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(uploadProgress).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    Object.values(uploadProgress).filter(
                      (p) => p.logo && p.cover && p.gallery,
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Businesses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Businesses Missing Images</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Loading businesses...</span>
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
              <p>All businesses have complete image sets!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Missing Images</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => {
                  const missingCount = getMissingImagesCount(business);
                  return (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">
                        {business.name}
                      </TableCell>
                      <TableCell>{business.city}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {!hasImage(business, "logo") && (
                            <Badge variant="outline" className="text-red-600">
                              Logo
                            </Badge>
                          )}
                          {!hasImage(business, "cover") && (
                            <Badge variant="outline" className="text-red-600">
                              Cover
                            </Badge>
                          )}
                          {!hasImage(business, "gallery") && (
                            <Badge variant="outline" className="text-red-600">
                              Gallery
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {uploadProgress[business.id]?.uploading ? (
                          <Badge variant="secondary" className="text-blue-600">
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            Uploading
                          </Badge>
                        ) : missingCount === 0 ? (
                          <Badge variant="default" className="text-green-600">
                            Complete
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600">
                            {missingCount} missing
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBusiness(business)}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Images
                            </Button>
                          </DialogTrigger>
                          <ImageUploadDialog business={business} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ManualImageUpload;
