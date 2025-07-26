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

  console.log("DebugPopup render:", { debugInfo, isOpen });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg font-bold text-lg"
        style={{ width: '60px', height: '60px' }}
        title="Open Debug Info"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">🐛 Debug Information</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-6">
          {/* Business Counts */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">📊 Business Counts</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded border">
                <div className="text-xl font-bold text-blue-600">
                  {debugInfo.categoryBusinesses}
                </div>
                <div className="text-xs text-blue-600">Category Specific</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded border">
                <div className="text-xl font-bold text-green-600">
                  {debugInfo.cityBusinesses}
                </div>
                <div className="text-xs text-green-600">City Businesses</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded border">
                <div className="text-xl font-bold text-purple-600">
                  {debugInfo.totalBusinesses}
                </div>
                <div className="text-xs text-purple-600">Total Displayed</div>
              </div>
            </div>
          </div>

          {/* Search Parameters */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">🔍 Search Parameters</h3>
            <div className="bg-gray-50 p-3 rounded border space-y-2 text-sm">
              <div><span className="font-medium">URL City:</span> {debugInfo.searchParams.city}</div>
              <div><span className="font-medium">URL Category:</span> {debugInfo.searchParams.category}</div>
              <div><span className="font-medium">Resolved City:</span> {debugInfo.searchParams.cityName}</div>
              <div><span className="font-medium">Resolved Category:</span> {debugInfo.searchParams.categoryName}</div>
            </div>
          </div>

          {/* API Calls */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">🌐 API Calls</h3>
            <div className="space-y-2">
              {debugInfo.apiCalls.map((call, index) => (
                <div key={index} className="text-sm p-3 bg-gray-50 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        call.status === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {call.status}
                    </span>
                    <span className="text-xs text-gray-500">{call.timestamp}</span>
                  </div>
                  <div className="font-mono text-xs break-all text-gray-600 mb-1">
                    {call.url}
                  </div>
                  <div className="text-xs text-gray-600">Results: {call.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Meta Data */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">📝 Meta Data</h3>
            <div className="bg-gray-50 p-3 rounded border space-y-3 text-sm">
              <div>
                <span className="font-medium">Title:</span>
                <div className="text-xs text-gray-600 break-words mt-1">{debugInfo.metaData.title}</div>
              </div>
              <div>
                <span className="font-medium">Description:</span>
                <div className="text-xs text-gray-600 break-words mt-1">{debugInfo.metaData.description}</div>
              </div>
              <div>
                <span className="font-medium">Keywords:</span>
                <div className="text-xs text-gray-600 break-words mt-1">{debugInfo.metaData.keywords}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t">
            <div className="flex gap-3">
              <button
                className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                onClick={() => {
                  console.log("Debug Info:", debugInfo);
                  alert("Debug info logged to console!");
                }}
              >
                📋 Log to Console
              </button>
              <button
                className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
                  alert("Debug info copied to clipboard!");
                }}
              >
                📄 Copy JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
