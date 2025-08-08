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
    allMetaTags: Array<{
      name: string;
      content: string;
      property?: string;
    }>;
  };
  statistics: {
    totalBusinesses: number;
    totalCities: number;
    totalCategories: number;
    totalImages: number;
    totalReviews: number;
    averageRating: number;
    lastUpdated: string;
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
      ogDescription: '',
      allMetaTags: []
    },
    statistics: {
      totalBusinesses: 0,
      totalCities: 0,
      totalCategories: 0,
      totalImages: 0,
      totalReviews: 0,
      averageRating: 0,
      lastUpdated: "",
    },
    apiCalls: []
  });
  
  const location = useLocation();

  // Function to fetch database statistics
  const fetchStatistics = async () => {
    try {
      const [statsResponse, cityStatsResponse] = await Promise.all([
        fetch('/api/scraping/stats'),
        fetch('/api/city-category-stats')
      ]);

      const stats = await statsResponse.json();
      const cityStats = await cityStatsResponse.json();

      return {
        totalBusinesses: stats.totalBusinesses || 0,
        totalCities: cityStats.totalCities || 0,
        totalCategories: cityStats.totalCategories || 0,
        totalImages: stats.totalImages || 0,
        totalReviews: stats.totalReviews || 0,
        averageRating: stats.averageRating || 0,
        lastUpdated: stats.lastUpdated || "",
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        totalBusinesses: 0,
        totalCities: 0,
        totalCategories: 0,
        totalImages: 0,
        totalReviews: 0,
        averageRating: 0,
        lastUpdated: "",
      };
    }
  };

  // Function to extract meta data from document head
  const extractMetaData = () => {
    const title = document.title || 'No title found';

    // Try multiple selectors for description
    const description =
      document.querySelector('meta[name="description"]')?.getAttribute('content') ||
      document.querySelector('meta[property="description"]')?.getAttribute('content') ||
      'No description found';

    // Try multiple selectors for keywords
    const keywords =
      document.querySelector('meta[name="keywords"]')?.getAttribute('content') ||
      document.querySelector('meta[property="keywords"]')?.getAttribute('content') ||
      'No keywords found';

    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';

    // Extract ALL meta tags
    const allMetaTags: Array<{name: string; content: string; property?: string}> = [];
    const metaTags = document.querySelectorAll('meta');

    metaTags.forEach((meta) => {
      const name = meta.getAttribute('name') || meta.getAttribute('property') || meta.getAttribute('http-equiv') || '';
      const content = meta.getAttribute('content') || '';
      const property = meta.getAttribute('property') || undefined;

      if (name && content) {
        allMetaTags.push({ name, content, property });
      }
    });

    // Debug logging
    console.log('Meta extraction:', { title, description, keywords, ogTitle, ogDescription, allMetaTags });
    console.log('Total meta tags found:', allMetaTags.length);

    return {
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      allMetaTags
    };
  };

  useEffect(() => {
    // Wait a bit for meta tags to be set by page components
    const timer = setTimeout(async () => {
      const metaData = extractMetaData();
      const statistics = await fetchStatistics();

      setDebugInfo({
        currentPage: location.pathname,
        timestamp: new Date().toLocaleString(),
        userAgent: navigator.userAgent,
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        metaData,
        statistics,
        apiCalls: []
      });

      console.log("GlobalDebugPopup loaded on:", location.pathname);
      console.log("Meta data extracted:", metaData);
      console.log("Statistics fetched:", statistics);
    }, 500); // Increased delay to ensure meta tags are set

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {/* Always visible test indicator */}
      <div
        className="fixed top-2 right-2 bg-green-500 text-white px-3 py-2 text-xs rounded shadow-lg z-[9999] max-w-lg"
        style={{ fontFamily: 'monospace', lineHeight: '1.3', minWidth: '350px' }}
        title="Click red bug button for detailed popup"
      >
        <div className="text-yellow-200 font-bold mb-1">DEBUG: {location.pathname}</div>
        <div className="text-white break-words">T: {debugInfo.metaData.title}</div>
        <div className="text-white break-words">D: {debugInfo.metaData.description.substring(0, 100)}{debugInfo.metaData.description.length > 100 ? '...' : ''}</div>
        <div className="text-white break-words">K: {debugInfo.metaData.keywords}</div>
        <div className="text-yellow-200 font-bold">META: {debugInfo.metaData.allMetaTags.length} tags</div>
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
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
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
              {/* Database Statistics */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-800">📊 Database Statistics</h3>
                <div className="bg-blue-50 p-3 rounded border">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-2xl font-bold text-blue-600">{debugInfo.statistics.totalBusinesses.toLocaleString()}</div>
                      <div className="text-xs text-blue-600">Total Businesses</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-2xl font-bold text-green-600">{debugInfo.statistics.totalCities}</div>
                      <div className="text-xs text-green-600">Total Cities</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-2xl font-bold text-purple-600">{debugInfo.statistics.totalCategories}</div>
                      <div className="text-xs text-purple-600">Total Categories</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-2xl font-bold text-orange-600">{debugInfo.statistics.totalImages.toLocaleString()}</div>
                      <div className="text-xs text-orange-600">Total Images</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-2xl font-bold text-red-600">{debugInfo.statistics.totalReviews.toLocaleString()}</div>
                      <div className="text-xs text-red-600">Total Reviews</div>
                    </div>
                    <div className="text-center p-2 bg-white rounded border">
                      <div className="text-2xl font-bold text-indigo-600">{debugInfo.statistics.averageRating.toFixed(1)}</div>
                      <div className="text-xs text-indigo-600">Avg Rating</div>
                    </div>
                  </div>
                  {debugInfo.statistics.lastUpdated && (
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      Last updated: {debugInfo.statistics.lastUpdated}
                    </div>
                  )}
                </div>
              </div>

              {/* Meta Data Info */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-800">📍 Page Meta Data</h3>
                <div className="bg-gray-50 p-3 rounded border text-sm space-y-3">
                  <div className="border-b pb-2">
                    <span className="font-medium text-blue-600">📂 Path:</span>
                    <div className="text-gray-700 mt-1">{debugInfo.currentPage}</div>
                  </div>

                  <div className="border-b pb-3">
                    <span className="font-medium text-purple-600">🏷️ Title:</span>
                    <div className="text-gray-700 break-words mt-1 bg-white p-3 rounded border text-sm">
                      {debugInfo.metaData.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Length: {debugInfo.metaData.title.length} characters</div>
                  </div>

                  <div className="border-b pb-3">
                    <span className="font-medium text-green-600">📝 Description:</span>
                    <div className="text-gray-700 break-words mt-1 bg-white p-3 rounded border text-sm">
                      {debugInfo.metaData.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Length: {debugInfo.metaData.description.length} characters</div>
                  </div>

                  <div className="border-b pb-3">
                    <span className="font-medium text-orange-600">🔑 Keywords:</span>
                    <div className="text-gray-700 break-words mt-1 bg-white p-3 rounded border text-sm">
                      {debugInfo.metaData.keywords}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Length: {debugInfo.metaData.keywords.length} characters</div>
                  </div>

                  {debugInfo.metaData.ogTitle && (
                    <div className="border-b pb-2">
                      <span className="font-medium text-red-600">🌐 OG Title:</span>
                      <div className="text-gray-700 break-words mt-1 bg-white p-2 rounded border">
                        {debugInfo.metaData.ogTitle}
                      </div>
                    </div>
                  )}

                  {debugInfo.metaData.ogDescription && (
                    <div>
                      <span className="font-medium text-red-600">🌐 OG Description:</span>
                      <div className="text-gray-700 break-words mt-1 bg-white p-2 rounded border">
                        {debugInfo.metaData.ogDescription}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* All Meta Tags */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-800">🏷️ All Meta Tags ({debugInfo.metaData.allMetaTags.length})</h3>
                <div className="bg-gray-50 p-3 rounded border max-h-96 overflow-y-auto">
                  {debugInfo.metaData.allMetaTags.length > 0 ? (
                    <div className="space-y-3">
                      {debugInfo.metaData.allMetaTags.map((meta, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="mb-2">
                            <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm">
                              {meta.property ? `property="${meta.property}"` : `name="${meta.name}"`}
                            </span>
                          </div>
                          <div className="text-gray-700 break-words text-sm leading-relaxed bg-gray-50 p-2 rounded">
                            {meta.content}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Length: {meta.content.length} characters
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No meta tags found</div>
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
                <h3 className="font-semibold mb-2 text-gray-800">�� Storage</h3>
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
                      const newMetaData = extractMetaData();
                      setDebugInfo(prev => ({
                        ...prev,
                        metaData: newMetaData,
                        timestamp: new Date().toLocaleString()
                      }));
                      alert("Meta data refreshed!");
                    }}
                  >
                    🔄 Refresh Meta
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
