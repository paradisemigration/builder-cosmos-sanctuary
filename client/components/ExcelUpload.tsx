import { useState, useCallback } from "react";
import {
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  excelTemplate,
  validateExcelRow,
  sampleExcelData,
  type ExcelBusinessRow,
} from "@/lib/excel-template";

interface ExcelUploadProps {
  onDataProcessed: (businesses: ExcelBusinessRow[]) => void;
  maxFileSize?: number; // in MB
}

export function ExcelUpload({
  onDataProcessed,
  maxFileSize = 10,
}: ExcelUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    valid: ExcelBusinessRow[];
    errors: { row: number; errors: string[] }[];
    total: number;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Download template function
  const downloadTemplate = () => {
    const headers = excelTemplate.headers.map((h) => h.label).join("\t");
    const sampleRow = sampleExcelData[0];
    const sampleValues = excelTemplate.headers
      .map((h) => {
        const value = sampleRow[h.key as keyof ExcelBusinessRow];
        return value !== undefined ? String(value) : "";
      })
      .join("\t");

    const csvContent = `${headers}\n${sampleValues}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "business_listings_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file selection
  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      alert("Please select a valid Excel file (.xlsx, .xls) or CSV file");
      return;
    }

    // Validate file size
    if (selectedFile.size > maxFileSize * 1024 * 1024) {
      alert(`File size must be less than ${maxFileSize}MB`);
      return;
    }

    setFile(selectedFile);
    setResults(null);
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  // Process Excel file
  const processFile = async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);

    try {
      // For demonstration - in real implementation, use a library like xlsx or papaparse
      const text = await file.text();
      const lines = text.split("\n");
      const headers = lines[0].split("\t");

      setProgress(25);

      const validRows: ExcelBusinessRow[] = [];
      const errorRows: { row: number; errors: string[] }[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === "") continue;

        const values = lines[i].split("\t");
        const rowData: any = {};

        headers.forEach((header, index) => {
          const templateHeader = excelTemplate.headers.find(
            (h) => h.label === header,
          );
          if (templateHeader) {
            const value = values[index]?.trim();
            if (value !== undefined && value !== "") {
              if (templateHeader.type === "number") {
                rowData[templateHeader.key] = parseFloat(value);
              } else if (templateHeader.type === "boolean") {
                rowData[templateHeader.key] = value.toLowerCase() === "true";
              } else {
                rowData[templateHeader.key] = value;
              }
            }
          }
        });

        const validation = validateExcelRow(rowData, i - 1);
        if (validation.valid) {
          validRows.push(rowData as ExcelBusinessRow);
        } else {
          errorRows.push({ row: i, errors: validation.errors });
        }

        setProgress(25 + (i / lines.length) * 70);
      }

      setResults({
        valid: validRows,
        errors: errorRows,
        total: lines.length - 1,
      });

      if (validRows.length > 0) {
        onDataProcessed(validRows);
      }

      setProgress(100);
    } catch (error) {
      alert(
        "Error processing file: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Download Template Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Excel Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Download the Excel template with all required columns and sample
              data to get started.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">
                  Required Fields:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {excelTemplate.headers
                    .filter((h) => h.required)
                    .map((header) => (
                      <Badge
                        key={header.key}
                        variant="outline"
                        className="border-green-300 text-green-700"
                      >
                        {header.label.replace(" *", "")}
                      </Badge>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700">
                  Optional Fields:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {excelTemplate.headers
                    .filter((h) => !h.required)
                    .slice(0, 6)
                    .map((header) => (
                      <Badge
                        key={header.key}
                        variant="outline"
                        className="border-blue-300 text-blue-700"
                      >
                        {header.label}
                      </Badge>
                    ))}
                  {excelTemplate.headers.filter((h) => !h.required).length >
                    6 && (
                    <Badge
                      variant="outline"
                      className="border-gray-300 text-gray-600"
                    >
                      +
                      {excelTemplate.headers.filter((h) => !h.required).length -
                        6}{" "}
                      more
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Button onClick={downloadTemplate} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Download Template (CSV)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Business Listings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* File Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 hover:border-orange-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />

              {file ? (
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-800">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-800">
                    Drop your Excel file here or click to browse
                  </p>
                  <p className="text-sm text-gray-600">
                    Supports .xlsx, .xls, and .csv files up to {maxFileSize}MB
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) =>
                      e.target.files?.[0] && handleFileSelect(e.target.files[0])
                    }
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Choose File
                    </Button>
                  </label>
                </div>
              )}
            </div>

            {/* Process Button */}
            {file && (
              <Button
                onClick={processFile}
                disabled={processing}
                className="w-full"
              >
                {processing ? "Processing..." : "Process File"}
              </Button>
            )}

            {/* Progress Bar */}
            {processing && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600 text-center">
                  Processing... {Math.round(progress)}%
                </p>
              </div>
            )}

            {/* Results */}
            {results && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">
                        Valid Records
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-800">
                      {results.valid.length}
                    </p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-800">Errors</span>
                    </div>
                    <p className="text-2xl font-bold text-red-800">
                      {results.errors.length}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        Total Rows
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-800">
                      {results.total}
                    </p>
                  </div>
                </div>

                {/* Error Details */}
                {results.errors.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-semibold">
                          Found {results.errors.length} rows with errors:
                        </p>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {results.errors.slice(0, 10).map((error, index) => (
                            <div key={index} className="text-sm">
                              <strong>Row {error.row}:</strong>
                              <ul className="ml-4 list-disc">
                                {error.errors.map((err, i) => (
                                  <li key={i}>{err}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          {results.errors.length > 10 && (
                            <p className="text-sm text-gray-600">
                              ...and {results.errors.length - 10} more errors
                            </p>
                          )}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Success Message */}
                {results.valid.length > 0 && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Successfully processed {results.valid.length} valid
                      business listings!
                      {results.errors.length > 0 &&
                        " Please fix the errors above and re-upload to include all businesses."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
