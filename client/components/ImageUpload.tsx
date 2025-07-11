import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  existingImages?: string[];
  folder?: string;
}

export function ImageUpload({
  onUpload,
  multiple = false,
  maxFiles = 10,
  existingImages = [],
  folder = "businesses",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [images, setImages] = useState<string[]>(existingImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;

    const maxAllowed = multiple ? maxFiles : 1;
    const currentCount = images.length;
    const remainingSlots = maxAllowed - currentCount;

    if (files.length > remainingSlots) {
      toast.error(`Can only upload ${remainingSlots} more image(s)`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      if (multiple) {
        Array.from(files).forEach((file) => {
          formData.append("images", file);
        });
        formData.append("folder", folder);

        const response = await fetch("/api/upload/multiple", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          const newUrls = result.data.map((item: any) => item.publicUrl);
          const updatedImages = [...images, ...newUrls];
          setImages(updatedImages);
          onUpload(updatedImages);
          toast.success(`${newUrls.length} image(s) uploaded successfully`);
        } else {
          toast.error(result.error || "Upload failed");
        }
      } else {
        formData.append("image", files[0]);
        formData.append("folder", folder);

        const response = await fetch("/api/upload/single", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          const newUrl = result.data.publicUrl;
          const updatedImages = [newUrl];
          setImages(updatedImages);
          onUpload(updatedImages);
          toast.success("Image uploaded successfully");
        } else {
          toast.error(result.error || "Upload failed");
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onUpload(updatedImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-all ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } ${uploading ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-gray-400"}`}
        onClick={openFileDialog}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 text-center">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {multiple ? `Up to ${maxFiles} images` : "Single image"} (PNG,
                JPG, JPEG up to 10MB)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Status */}
      {multiple && (
        <div className="text-xs text-gray-500 text-center">
          {images.length} of {maxFiles} images uploaded
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
