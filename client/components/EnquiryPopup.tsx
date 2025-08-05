import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allCategories, allIndianCities, uaeCities } from "@/lib/all-categories";

interface EnquiryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export function EnquiryPopup({ isOpen, onClose, onSubmit }: EnquiryPopupProps) {
  const location = useLocation();
  const params = useParams();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    category: "",
  });

  // Generate dynamic title based on current page
  const getPopupTitle = () => {
    const pathname = location.pathname;
    const { city, category } = params;

    // Check if it's a UAE page
    const isUAEPage = pathname.startsWith('/uae');
    const cities = isUAEPage ? uaeCities : allIndianCities;
    const country = isUAEPage ? 'UAE' : 'India';

    if (city && category) {
      // City + Category page
      const categoryObj = allCategories.find(c => c.slug === category);
      const categoryName = categoryObj ? categoryObj.name.toLowerCase() : 'consultants';
      const cityName = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ');
      return `Apply With Trusted ${categoryName} in ${cityName}`;
    } else if (city) {
      // City only page
      const cityName = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ');
      return `Apply with Most Trusted Immigration Consultants in ${cityName}`;
    } else {
      // Home page or other pages
      return `Get the list of best Immigration Consultants in ${country}`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Handle form submission
    console.log("Enquiry submitted:", formData);

    if (onSubmit) {
      onSubmit(formData);
    }

    // Reset form and close popup
    setFormData({
      name: "",
      phone: "",
      email: "",
      city: "",
      category: "",
    });
    onClose();

    // You can add actual API call here
    // toast.success("Enquiry submitted successfully!");
  };

  if (!isOpen) return null;

  const isUAEPage = location.pathname.startsWith('/uae');
  const cities = isUAEPage ? uaeCities : allIndianCities;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md mx-4 shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 pr-4 leading-tight">
            {getPopupTitle()}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-8 w-8 rounded-full hover:bg-gray-100 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder={isUAEPage ? "+971 XX XXX XXXX" : "+91 XXXXX XXXXX"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isUAEPage ? 'Emirate' : 'City'} *
            </label>
            <select
              required
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">Select {isUAEPage ? 'Emirate' : 'City'}</option>
              {cities.slice(0, 20).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">Select Category</option>
              {allCategories.slice(0, 15).map((category) => (
                <option key={category.slug} value={category.slug}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Submit Enquiry
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            We'll connect you with verified consultants in your area
          </p>
        </div>
      </div>
    </div>
  );
}

// Floating Call-to-Action Button Component
interface FloatingCTAProps {
  onClick: () => void;
}

export function FloatingCTA({ onClick }: FloatingCTAProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[9998]">
      <Button
        onClick={onClick}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl rounded-full px-4 sm:px-6 py-3 flex items-center gap-2 transform transition-all duration-300 hover:scale-105 animate-pulse hover:animate-none"
      >
        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline font-medium">List Your Business</span>
        <span className="sm:hidden font-medium text-sm">List Business</span>
      </Button>
    </div>
  );
}
