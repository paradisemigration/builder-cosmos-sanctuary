import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ExcelUpload } from "@/components/ExcelUpload";
import { DebugPageInfo } from "@/components/DebugPageInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Upload, Save, Eye } from "lucide-react";
import { type ExcelBusinessRow } from "@/lib/excel-template";
import { apiClient } from "@/lib/api";

export default function AdminBulkUpload() {
  const navigate = useNavigate();
  const [processedData, setProcessedData] = useState<ExcelBusinessRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleDataProcessed = (businesses: ExcelBusinessRow[]) => {
    setProcessedData(businesses);
    setUploadResults(null);
  };

  const uploadToDatabase = async () => {
    if (processedData.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    try {
      for (const business of processedData) {
        try {
          // Convert Excel format to Business format
          const businessData = {
            name: business.business_name,
            category: business.category as any,
            description: business.description,
            services: business.services
              ? business.services.split(",").map((s) => s.trim())
              : [],
            address: business.address,
            zone: business.city,
            phone: business.phone,
            whatsapp: business.whatsapp,
            email: business.email,
            website: business.website,
            licenseNo: business.license_number,
            logo: business.logo_url,
            coverImage: business.cover_image_url,
            gallery: business.gallery_urls
              ? business.gallery_urls.split(",").map((url) => url.trim())
              : [],
            coordinates: {
              lat: business.latitude || 25.2048,
              lng: business.longitude || 55.2708,
            },
            openingHours: {
              Monday: business.monday_hours || "9:00 AM - 6:00 PM",
              Tuesday: business.tuesday_hours || "9:00 AM - 6:00 PM",
              Wednesday: business.wednesday_hours || "9:00 AM - 6:00 PM",
              Thursday: business.thursday_hours || "9:00 AM - 6:00 PM",
              Friday: business.friday_hours || "9:00 AM - 6:00 PM",
              Saturday: business.saturday_hours || "10:00 AM - 4:00 PM",
              Sunday: business.sunday_hours || "Closed",
            },
            isVerified: business.is_verified || false,
            isScamReported: false,
            importedFromGoogle: false,
            reviews: [],
          };

          await apiClient.createBusiness(businessData);
          successCount++;
        } catch (error) {
          failedCount++;
          errors.push(
            `Failed to upload "${business.business_name}": ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      }

      setUploadResults({
        success: successCount,
        failed: failedCount,
        errors,
      });
    } catch (error) {
      errors.push(
        `Upload process failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setUploadResults({
        success: successCount,
        failed: failedCount,
        errors,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-purple-50/20">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bulk Upload Business Listings
              </h1>
              <p className="text-gray-600 mt-1">
                Upload multiple business listings using Excel or CSV files
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ExcelUpload onDataProcessed={handleDataProcessed} />
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Processed Records:
                    </span>
                    <Badge variant="outline">{processedData.length}</Badge>
                  </div>

                  {uploadResults && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Successfully Uploaded:
                        </span>
                        <Badge className="bg-green-100 text-green-800">
                          {uploadResults.success}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Failed:</span>
                        <Badge
                          variant={
                            uploadResults.failed > 0 ? "destructive" : "outline"
                          }
                        >
                          {uploadResults.failed}
                        </Badge>
                      </div>
                    </>
                  )}

                  {processedData.length > 0 && !uploadResults && (
                    <Button
                      onClick={uploadToDatabase}
                      disabled={uploading}
                      className="w-full"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {uploading
                        ? "Uploading..."
                        : `Upload ${processedData.length} Records`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            {processedData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(
                      processedData.reduce(
                        (acc, business) => {
                          acc[business.category] =
                            (acc[business.category] || 0) + 1;
                          return acc;
                        },
                        {} as Record<string, number>,
                      ),
                    ).map(([category, count]) => (
                      <div
                        key={category}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-600">
                          {category}:
                        </span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Preview Table */}
        {processedData.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview Data ({processedData.length} records)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Verified</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedData.slice(0, 10).map((business, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {business.business_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{business.category}</Badge>
                        </TableCell>
                        <TableCell>{business.city}</TableCell>
                        <TableCell>{business.phone}</TableCell>
                        <TableCell>{business.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              business.is_verified ? "default" : "secondary"
                            }
                          >
                            {business.is_verified ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {processedData.length > 10 && (
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    Showing first 10 of {processedData.length} records
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Results */}
        {uploadResults && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Upload Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">
                      Successfully Uploaded
                    </h3>
                    <p className="text-2xl font-bold text-green-800">
                      {uploadResults.success}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-red-800 mb-2">Failed</h3>
                    <p className="text-2xl font-bold text-red-800">
                      {uploadResults.failed}
                    </p>
                  </div>
                </div>

                {uploadResults.errors.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      Error Details
                    </h3>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {uploadResults.errors.map((error, index) => (
                        <p key={index} className="text-sm text-yellow-700">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={() => navigate("/admin")}
                    variant="outline"
                    className="flex-1"
                  >
                    Back to Admin Panel
                  </Button>
                  <Button
                    onClick={() => {
                      setProcessedData([]);
                      setUploadResults(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Upload More Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <DebugPageInfo />
    </div>
  );
}
