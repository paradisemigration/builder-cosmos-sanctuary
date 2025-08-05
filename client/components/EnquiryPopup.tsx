import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { X, MessageSquare, MapPin, Search, ChevronDown, User, Phone, Mail, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allIndianCities, uaeCities, allCategories } from "@/lib/all-categories";

interface EnquiryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

// Simplified categories as requested
const simplifiedCategories = [
  { slug: "visit-visa", name: "Visit Visa" },
  { slug: "work-visa", name: "Work Visa" },
  { slug: "education-visa", name: "Education Visa" },
  { slug: "study-visa", name: "Study Visa" },
  { slug: "pr-citizenship", name: "PR & Citizenship" },
];

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

  // City autocomplete states
  const [cityQuery, setCityQuery] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const citySuggestionsRef = useRef<HTMLDivElement>(null);

  // Form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Generate dynamic title based on current page
  const getPopupTitle = () => {
    const pathname = location.pathname;
    const { city, category } = params;

    // Check if it's a UAE page
    const isUAEPage = pathname.startsWith("/uae");
    const country = isUAEPage ? "UAE" : "India";

    if (city && category) {
      // City + Category page
      const categoryObj = allCategories.find((c) => c.slug === category);
      const categoryName = categoryObj ? categoryObj.name.toLowerCase() : "consultants";
      const cityName = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, " ");
      return `Apply With Trusted ${categoryName} in ${cityName}`;
    } else if (city) {
      // City only page
      const cityName = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, " ");
      return `Apply with Most Trusted Immigration Consultants in ${cityName}`;
    } else {
      // Home page or other pages
      return `Get Expert Immigration Consultation in ${country}`;
    }
  };

  // Handle city input change and filtering
  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityQuery(value);
    setFormData(prev => ({ ...prev, city: value }));

    if (value.length >= 2) {
      const isUAEPage = location.pathname.startsWith("/uae");
      const cities = isUAEPage ? uaeCities : allIndianCities;
      
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      
      setFilteredCities(filtered);
      setShowCitySuggestions(true);
    } else {
      setShowCitySuggestions(false);
    }
  };

  // Handle city selection from suggestions
  const handleCitySelect = (city: string) => {
    setCityQuery(city);
    setFormData(prev => ({ ...prev, city }));
    setShowCitySuggestions(false);
    setErrors(prev => ({ ...prev, city: "" }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.category) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

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
    setCityQuery("");
    setErrors({});
    onClose();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        citySuggestionsRef.current &&
        !citySuggestionsRef.current.contains(event.target as Node) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(event.target as Node)
      ) {
        setShowCitySuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const isUAEPage = location.pathname.startsWith("/uae");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg mx-4 shadow-2xl transform transition-all duration-300 scale-100 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="pr-12">
            <h2 className="text-xl font-bold leading-tight">
              {getPopupTitle()}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Fill the form below and we'll connect you with verified consultants
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  setErrors(prev => ({ ...prev, name: "" }));
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, phone: e.target.value }));
                  setErrors(prev => ({ ...prev, phone: "" }));
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.phone ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder={isUAEPage ? "+971 XX XXX XXXX" : "+91 XXXXX XXXXX"}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  setErrors(prev => ({ ...prev, email: "" }));
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* City Field with Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                {isUAEPage ? "Emirate" : "City"} *
              </label>
              <div className="relative">
                <input
                  ref={cityInputRef}
                  type="text"
                  required
                  value={cityQuery}
                  onChange={handleCityInputChange}
                  onFocus={() => {
                    if (cityQuery.length >= 2 && filteredCities.length > 0) {
                      setShowCitySuggestions(true);
                    }
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10 ${
                    errors.city ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder={`Type ${isUAEPage ? "emirate" : "city"} name (min 2 letters)`}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                
                {/* City Suggestions */}
                {showCitySuggestions && filteredCities.length > 0 && (
                  <div
                    ref={citySuggestionsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto"
                  >
                    {filteredCities.map((city, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        onClick={() => handleCitySelect(city)}
                      >
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{city}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Service Category *
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.category}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, category: e.target.value }));
                    setErrors(prev => ({ ...prev, category: "" }));
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white pr-10 ${
                    errors.category ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select visa category</option>
                  {simplifiedCategories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-2 hover:bg-gray-50 py-3 rounded-xl font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3 rounded-xl font-semibold shadow-lg"
              >
                Get Consultants
              </Button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              🔒 Your information is secure and will only be shared with verified consultants
            </p>
          </div>
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
