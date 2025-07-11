import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Eye, EyeOff, Code, Globe } from "lucide-react";

export function DebugPageInfo() {
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  const getCurrentPageName = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);

    // Extract page info based on current path
    if (path === "/") {
      return "Homepage";
    } else if (path === "/browse") {
      const category = searchParams.get("category");
      const zone = searchParams.get("zone");
      const query = searchParams.get("q");

      let pageName = "Browse Page";
      if (query) pageName += ` - Search: ${query}`;
      if (category) pageName += ` - Category: ${category}`;
      if (zone) pageName += ` - Zone: ${zone}`;

      return pageName;
    } else if (path.startsWith("/business/")) {
      // Legacy structure: /business/id
      const businessId = path.split("/")[2];
      return `Business Profile - ID: ${businessId}`;
    } else if (path.startsWith("/city/")) {
      const pathParts = path.split("/");
      if (pathParts.length === 3) {
        // City listing: /city/city-name
        const [, , city] = pathParts;
        return `City Business Listing - ${city}`;
      } else if (pathParts.length === 4) {
        // Business profile: /city/city/company-name
        const [, , city, companyName] = pathParts;
        return `Business Profile - ${city}/${companyName}`;
      }
    } else if (path === "/add-business") {
      return "Add Business";
    } else if (path === "/login") {
      return "Login/Sign In";
    } else if (path === "/admin") {
      return "Admin Panel";
    } else if (path === "/dashboard") {
      return "Business Dashboard";
    } else if (path === "/report") {
      return "Report Scam";
    } else if (path.startsWith("/reviews/")) {
      return `Scam Review Page - ${path}`;
    } else if (path.startsWith("/category/")) {
      const category = path.split("/")[2];
      return `Category Page - ${category}`;
    } else if (path.startsWith("/location/")) {
      const location = path.split("/")[2];
      return `Location Page - ${location}`;
    } else if (path.split("/").length === 3 && path !== "/") {
      // SEO friendly URLs like /dubai/work-visa
      const [, location, category] = path.split("/");
      return `SEO Page - ${location}/${category}`;
    } else {
      return `Unknown Page - ${path}`;
    }
  };

  const getFullUrl = () => {
    return `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.hash}`;
  };

  const getDocumentTitle = () => {
    return document.title || "No title set";
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999]">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          title="Show debug info"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-gray-900/95 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl border border-gray-700 max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-orange-400 flex items-center gap-2">
          <Code className="w-4 h-4" />
          DEBUG INFO
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white transition-colors"
          title="Hide debug info"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <div className="text-purple-400 font-semibold mb-1">
            📄 Page Name:
          </div>
          <div className="text-gray-100 font-mono bg-gray-800 p-2 rounded">
            {getCurrentPageName()}
          </div>
        </div>

        <div>
          <div className="text-blue-400 font-semibold mb-1 flex items-center gap-1">
            <Globe className="w-3 h-3" />
            URL Path:
          </div>
          <div className="text-gray-100 font-mono bg-gray-800 p-2 rounded break-all">
            {location.pathname}
            {location.search && (
              <span className="text-yellow-300">{location.search}</span>
            )}
            {location.hash && (
              <span className="text-green-300">{location.hash}</span>
            )}
          </div>
        </div>

        <div>
          <div className="text-green-400 font-semibold mb-1">
            🏷️ Document Title:
          </div>
          <div className="text-gray-100 font-mono bg-gray-800 p-2 rounded text-xs">
            {getDocumentTitle()}
          </div>
        </div>

        <div>
          <div className="text-cyan-400 font-semibold mb-1">🔗 Full URL:</div>
          <div className="text-gray-100 font-mono bg-gray-800 p-2 rounded break-all text-xs">
            {getFullUrl()}
          </div>
        </div>

        <div className="text-gray-500 text-xs mt-3 pt-2 border-t border-gray-700">
          ⚠️ Remove this component before production
        </div>
      </div>
    </div>
  );
}
