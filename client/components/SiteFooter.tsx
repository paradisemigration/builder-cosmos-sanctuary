import { Link } from "react-router-dom";
import { MapPin, Building, Mail, Phone, Globe } from "lucide-react";
import { allCities, allIndianCities, allCategories } from "@/lib/all-categories";

export function SiteFooter() {
  // Get top cities for the footer
  const topCities = indianCities.slice(0, 24);
  const allCategories = Object.entries(categoryMapping);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl font-bold text-white">VisaConsult</div>
              <div className="text-xs text-blue-400 font-medium">INDIA</div>
            </div>
            <p className="text-gray-400 mb-4 text-sm">
              India's trusted platform for finding verified visa and immigration consultants. 
              Connect with expert consultants across {indianCities.length} cities and {allCategories.length} service categories.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                to="/contact"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">Contact Us</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">About</span>
              </Link>
            </div>
          </div>

          {/* Top Cities */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Top Cities
            </h3>
            <div className="grid grid-cols-2 gap-1">
              {topCities.map(city => (
                <Link
                  key={city}
                  to={`/business/${city.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors py-1"
                >
                  {city}
                </Link>
              ))}
            </div>
            <Link
              to="/all-cities-categories"
              className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all {indianCities.length} cities →
            </Link>
          </div>

          {/* Service Categories */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-400" />
              Services
            </h3>
            <div className="space-y-1">
              {allCategories.map(([slug, name]) => (
                <Link
                  key={slug}
                  to={`/category/${slug}`}
                  className="block text-sm text-gray-400 hover:text-white transition-colors py-1"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* Popular City-Category Combinations */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">
              Popular Searches
            </h3>
            <div className="space-y-1">
              {/* Generate popular combinations */}
              {['Delhi', 'Mumbai', 'Bangalore', 'Chennai'].map(city => (
                <div key={city}>
                  {['immigration-consultants', 'visa-consultants', 'study-abroad'].map(category => (
                    <Link
                      key={`${city}-${category}`}
                      to={`/business/${city.toLowerCase()}/${category}`}
                      className="block text-sm text-gray-400 hover:text-white transition-colors py-1"
                    >
                      {categoryMapping[category]} in {city}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <Link
              to="/sitemap"
              className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View complete sitemap →
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              <span>© 2024 VisaConsult India. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/sitemap"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sitemap
              </Link>
              <Link
                to="/all-cities-categories"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Browse All
              </Link>
            </div>
          </div>

          {/* SEO Text Block */}
          <div className="mt-6 text-xs text-gray-500 leading-relaxed">
            <p>
              VisaConsult India is the leading platform connecting individuals with verified visa and immigration consultants 
              across {indianCities.length} major cities in India. Our comprehensive directory includes specialists in {allCategories.length} service 
              categories including immigration consulting, student visa services, work permit assistance, and study abroad guidance. 
              Whether you're looking for consultants in metros like Delhi, Mumbai, Bangalore, and Chennai, or smaller cities, 
              our platform helps you find trusted professionals for all your visa and immigration needs.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
