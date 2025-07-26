import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface GlobalDebugInfo {
  currentPage: string;
  timestamp: string;
  userAgent: string;
  screenSize: {
    width: number;
    height: number;
  };
  metaData: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
  };
  apiCalls: Array<{
    url: string;
    method: string;
    timestamp: string;
  }>;
}

export function GlobalDebugPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<GlobalDebugInfo>({
    currentPage: '',
    timestamp: '',
    userAgent: '',
    screenSize: { width: 0, height: 0 },
    metaData: {
      title: '',
      description: '',
      keywords: '',
      ogTitle: '',
      ogDescription: ''
    },
    apiCalls: []
  });
  
  const location = useLocation();

  // Function to extract meta data from document head
  const extractMetaData = () => {
    const title = document.title || '';
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';

    return {
      title,
      description,
      keywords,
      ogTitle,
      ogDescription
    };
  };

  useEffect(() => {
    // Wait a bit for meta tags to be set by page components
    const timer = setTimeout(() => {
      const metaData = extractMetaData();

      setDebugInfo({
        currentPage: location.pathname,
        timestamp: new Date().toLocaleString(),
        userAgent: navigator.userAgent,
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        metaData,
        apiCalls: []
      });

      console.log("GlobalDebugPopup loaded on:", location.pathname);
      console.log("Meta data extracted:", metaData);
    }, 100); // Small delay to ensure meta tags are set

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {/* Always visible test indicator */}
      <div
        className="fixed top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded shadow-lg z-[9999] max-w-sm"
        style={{ fontFamily: 'monospace' }}
        title={`Path: ${location.pathname}`}
      >
        <div className="truncate">
          {debugInfo.metaData.title ? `TITLE: ${debugInfo.metaData.title}` : `DEBUG: ${location.pathname}`}
        </div>
      </div>
      
      {!isOpen ? (
        <button
          onClick={() => {
            console.log("Global debug button clicked!");
            setIsOpen(true);
          }}
          className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg font-bold text-lg border-2 border-white transition-all hover:scale-110"
          style={{ width: '60px', height: '60px', zIndex: 9998 }}
          title="Open Global Debug Info"
        >
          🐛
        </button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold">🐛 Global Debug Info</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Meta Data Info */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-800">📍 Page Meta Data</h3>
                <div className="bg-gray-50 p-3 rounded border text-sm space-y-2">
                  <div><span className="font-medium">Path:</span> {debugInfo.currentPage}</div>
                  <div>
                    <span className="font-medium">Title:</span>
                    <div className="text-xs text-gray-600 break-words mt-1">{debugInfo.metaData.title || 'No title found'}</div>
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>
                    <div className="text-xs text-gray-600 break-words mt-1">{debugInfo.metaData.description || 'No description found'}</div>
                  </div>
                  <div>
                    <span className="font-medium">Keywords:</span>
                    <div className="text-xs text-gray-600 break-words mt-1">{debugInfo.metaData.keywords || 'No keywords found'}</div>
                  </div>
                  {debugInfo.metaData.ogTitle && (
                    <div>
                      <span className="font-medium">OG Title:</span>
                      <div className="text-xs text-gray-600 break-words mt-1">{debugInfo.metaData.ogTitle}</div>
                    </div>
                  )}
                  {debugInfo.metaData.ogDescription && (
                    <div>
                      <span className="font-medium">OG Description:</span>
                      <div className="text-xs text-gray-600 break-words mt-1">{debugInfo.metaData.ogDescription}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Browser Info */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-800">💻 Browser Info</h3>
                <div className="bg-gray-50 p-3 rounded border text-sm">
                  <div><span className="font-medium">Screen:</span> {debugInfo.screenSize.width} x {debugInfo.screenSize.height}</div>
                  <div><span className="font-medium">User Agent:</span> 
                    <div className="text-xs text-gray-600 break-all mt-1">{debugInfo.userAgent}</div>
                  </div>
                </div>
              </div>

              {/* Local Storage Info */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-800">💾 Storage</h3>
                <div className="bg-gray-50 p-3 rounded border text-sm">
                  <div><span className="font-medium">Local Storage Items:</span> {localStorage.length}</div>
                  <div><span className="font-medium">Session Storage Items:</span> {sessionStorage.length}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t">
                <div className="flex gap-3 flex-wrap">
                  <button
                    className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                    onClick={() => {
                      console.log("Global Debug Info:", debugInfo);
                      console.log("Current URL:", window.location.href);
                      console.log("Local Storage:", localStorage);
                      alert("Debug info logged to console!");
                    }}
                  >
                    📋 Log to Console
                  </button>
                  <button
                    className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                    onClick={() => {
                      const data = {
                        ...debugInfo,
                        fullURL: window.location.href,
                        localStorage: {...localStorage},
                        timestamp: new Date().toISOString()
                      };
                      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                      alert("Debug info copied to clipboard!");
                    }}
                  >
                    📄 Copy Debug Data
                  </button>
                  <button
                    className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    🔄 Reload Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
