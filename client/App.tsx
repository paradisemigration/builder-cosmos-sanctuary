import React from "react";
import "./global.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

// Import pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminPanel from "./pages/AdminPanel";

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
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminPanel />} />
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
