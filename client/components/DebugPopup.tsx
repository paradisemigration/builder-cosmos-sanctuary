import { useState } from "react";

interface DebugInfo {
  categoryBusinesses: number;
  cityBusinesses: number;
  totalBusinesses: number;
  apiCalls: Array<{
    url: string;
    status: string;
    count: number;
    timestamp: string;
  }>;
  metaData: {
    title: string;
    description: string;
    keywords: string;
  };
  searchParams: {
    city: string;
    category: string;
    cityName: string;
    categoryName: string;
  };
}

interface DebugPopupProps {
  debugInfo: DebugInfo;
}

export function DebugPopup({ debugInfo }: DebugPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg"
        size="sm"
      >
        <Bug className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Debug Information
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Business Counts */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Business Counts
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">
                  {debugInfo.categoryBusinesses}
                </div>
                <div className="text-xs text-blue-600">Category Specific</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">
                  {debugInfo.cityBusinesses}
                </div>
                <div className="text-xs text-green-600">City Businesses</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">
                  {debugInfo.totalBusinesses}
                </div>
                <div className="text-xs text-purple-600">Total Displayed</div>
              </div>
            </div>
          </div>

          {/* Search Parameters */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Parameters
            </h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">URL City:</span>{" "}
                {debugInfo.searchParams.city}
              </div>
              <div>
                <span className="font-medium">URL Category:</span>{" "}
                {debugInfo.searchParams.category}
              </div>
              <div>
                <span className="font-medium">Resolved City:</span>{" "}
                {debugInfo.searchParams.cityName}
              </div>
              <div>
                <span className="font-medium">Resolved Category:</span>{" "}
                {debugInfo.searchParams.categoryName}
              </div>
            </div>
          </div>

          {/* API Calls */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              API Calls
            </h3>
            <div className="space-y-2">
              {debugInfo.apiCalls.map((call, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        call.status === "success" ? "default" : "destructive"
                      }
                    >
                      {call.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {call.timestamp}
                    </span>
                  </div>
                  <div className="font-mono text-xs break-all mt-1">
                    {call.url}
                  </div>
                  <div className="text-xs text-gray-600">
                    Results: {call.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meta Data */}
          <div>
            <h3 className="font-semibold mb-2">Meta Data</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Title:</span>
                <div className="text-xs text-gray-600 break-words">
                  {debugInfo.metaData.title}
                </div>
              </div>
              <div>
                <span className="font-medium">Description:</span>
                <div className="text-xs text-gray-600 break-words">
                  {debugInfo.metaData.description}
                </div>
              </div>
              <div>
                <span className="font-medium">Keywords:</span>
                <div className="text-xs text-gray-600 break-words">
                  {debugInfo.metaData.keywords}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log("Debug Info:", debugInfo);
                }}
              >
                Log to Console
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(debugInfo, null, 2),
                  );
                }}
              >
                Copy JSON
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
