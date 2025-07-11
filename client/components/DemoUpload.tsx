import { useState } from "react";
import { Upload, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface DemoUploadProps {
  title: string;
  multiple?: boolean;
  maxFiles?: number;
}

export function DemoUpload({
  title,
  multiple = false,
  maxFiles = 10,
}: DemoUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragOver(true);
    } else if (e.type === "dragleave") {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    simulateUpload(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      simulateUpload(files);
    }
  };

  const simulateUpload = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      toast.error("Please select image files only");
      return;
    }

    const remainingSlots = maxFiles - uploadedFiles.length;
    const filesToProcess = imageFiles.slice(0, remainingSlots);

    if (filesToProcess.length < imageFiles.length) {
      toast.warning(`Only uploading first ${filesToProcess.length} files`);
    }

    // Simulate upload process
    filesToProcess.forEach((file, index) => {
      setTimeout(
        () => {
          setUploadedFiles((prev) => [...prev, file.name]);
          toast.success(`Demo: "${file.name}" uploaded successfully!`);
        },
        (index + 1) * 500,
      ); // Stagger the "uploads"
    });
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-all cursor-pointer ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-input-${title}`)?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 text-center">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Demo mode - {multiple ? `Up to ${maxFiles} images` : "Single image"}{" "}
            (PNG, JPG, JPEG)
          </p>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        id={`file-input-${title}`}
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Demo Uploads:</h4>
          <div className="space-y-1">
            {uploadedFiles.map((fileName, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded"
              >
                <Check className="w-4 h-4" />
                <ImageIcon className="w-4 h-4" />
                <span>{fileName}</span>
                <span className="text-xs text-green-500 ml-auto">
                  ✅ Demo upload complete
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUploadedFiles([])}
          >
            Clear Demo Files
          </Button>
        </div>
      )}
    </div>
  );
}

export default DemoUpload;
