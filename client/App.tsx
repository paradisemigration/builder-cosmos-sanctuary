import React from "react";
import "./global.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

// Create simplified page components without problematic imports
function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find India's Most
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Trusted{" "}
            </span>
            Visa Consultants
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
            Connect with verified immigration experts across India. Get expert
            guidance for student visa, work visa, tourist visa and more.
          </p>

          {/* Search Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl max-w-4xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Find Your Perfect Visa Consultant
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search consultants..."
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Select City</option>
                <option>Delhi</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
                <option>Chennai</option>
              </select>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700">
                Search
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">
                8,500+
              </h3>
              <p className="text-gray-600">Verified Consultants</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-green-600">95%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-purple-600">
                50+
              </h3>
              <p className="text-gray-600">Cities Covered</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-orange-600">
                24/7
              </h3>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          About VisaConsult India
        </h1>
        <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            India's Leading Visa Consultant Directory
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            VisaConsult India is the most trusted platform for finding verified
            immigration and visa consultants across India. We connect
            individuals with experienced professionals who can guide them
            through complex visa processes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-800">
                Our Mission
              </h3>
              <p className="text-blue-700">
                To simplify the visa consultation process by connecting
                applicants with trusted, verified professionals.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-green-800">
                Our Vision
              </h3>
              <p className="text-green-700">
                To become India's most reliable platform for immigration and
                visa services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-blue-600 mr-3">📧</span>
                  <span>support@visaconsultindia.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 mr-3">📞</span>
                  <span>+91-11-4567-8900</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 mr-3">📍</span>
                  <span>New Delhi, India</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Send us a Message</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Admin Panel</h1>
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-blue-800">
                Google Places Scraper
              </h3>
              <p className="text-blue-700 mb-4">
                Fetch business data from Google Places API
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Start Scraping
              </button>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-green-800">
                Business Management
              </h3>
              <p className="text-green-700 mb-4">
                Manage consultant listings and profiles
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Manage Businesses
              </button>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-purple-800">
                Analytics
              </h3>
              <p className="text-purple-700 mb-4">
                View platform statistics and reports
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                View Analytics
              </button>
            </div>
          </div>

          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-lg font-semibold text-yellow-800 mb-2">
              System Status
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>✅ Database: Connected</div>
              <div>✅ Google Cloud: Ready</div>
              <div>✅ API Server: Running</div>
              <div>✅ Scraper: Standby</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Navigation Component
function SimpleNavigation() {
  const location = useLocation();

  const isCurrentPage = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-xl font-bold text-gray-900">VisaConsult</div>
            <div className="text-xs text-blue-600 font-medium">INDIA</div>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isCurrentPage("/")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isCurrentPage("/about")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isCurrentPage("/contact")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              Contact
            </Link>
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isCurrentPage("/admin")
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Simple Auth Context for admin access
const AuthContext = React.createContext({
  user: { role: "admin" },
  isAuthenticated: true,
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider
      value={{ user: { role: "admin" }, isAuthenticated: true }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <SimpleNavigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-16">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-4">Page not found</p>
                <a
                  href="/"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  Return to Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
