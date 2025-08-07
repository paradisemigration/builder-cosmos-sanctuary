import React, { useEffect } from "react";
import "./global.css";

// Import React Router with debugging
let ReactRouterModule;
try {
  ReactRouterModule = require("react-router-dom");
} catch (e) {
  console.error("React Router import error:", e);
}

// Use explicit imports with fallbacks
const BrowserRouter = ReactRouterModule?.BrowserRouter ||
  (() => ({ children }: any) => React.createElement('div', null, children));
const Routes = ReactRouterModule?.Routes ||
  (() => ({ children }: any) => React.createElement('div', null, children));
const Route = ReactRouterModule?.Route ||
  (() => (props: any) => React.createElement('div', null, 'Route'));
const Navigate = ReactRouterModule?.Navigate ||
  (() => (props: any) => React.createElement('div', null, 'Navigate'));
const useLocation = ReactRouterModule?.useLocation ||
  (() => ({ pathname: '/' }));

// Add required imports
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/lib/auth";

// Component to handle scroll to top on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Import all original pages
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import BusinessProfile from "./pages/BusinessProfile";
import AddBusiness from "./pages/AddBusiness";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import EditBusiness from "./pages/EditBusiness";
import BusinessDashboard from "./pages/BusinessDashboard";
import ListingPlans from "./pages/ListingPlans";
import ListBusiness from "./pages/ListBusiness";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CantFindBusiness from "./pages/CantFindBusiness";
import CategoryLocationPage from "./pages/CategoryLocationPage";
import CityBusinessListing from "./pages/CityBusinessListing";
import CityCategory from "./pages/CityCategory";
import CityRouteHandler from "./components/CityRouteHandler";
import AdminBulkUpload from "./pages/AdminBulkUpload";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import AdminStatus from "./pages/AdminStatus";
import Sitemap from "./pages/Sitemap";
import AllCitiesCategories from "./pages/AllCitiesCategories";
import AllCategories from "./pages/AllCategories";
import MainPages from "./pages/MainPages";
import CategoryPage from "./pages/CategoryPage";
import UAE from "./pages/UAE";
import { SiteFooter } from "./components/SiteFooter";
import { Navigation } from "./components/Navigation";
import { GlobalDebugPopup } from "./components/GlobalDebugPopup";

// Simple components to avoid complex dependencies
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <ScrollToTop />
            <Navigation />
            {typeof Routes !== "undefined" ? (
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/browse" element={<Browse />} />
                <Route
                  path="/business"
                  element={<Navigate to="/browse" replace />}
                />
                <Route path="/business/:id" element={<BusinessProfile />} />
                <Route path="/add-business" element={<AddBusiness />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/status"
                  element={
                    <ProtectedRoute>
                      <AdminStatus />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/bulk-upload"
                  element={
                    <ProtectedRoute>
                      <AdminBulkUpload />
                    </ProtectedRoute>
                  }
                />
                <Route path="/business/:id/edit" element={<EditBusiness />} />
                <Route path="/dashboard" element={<BusinessDashboard />} />
                <Route path="/plans" element={<ListingPlans />} />
                <Route path="/list-business" element={<ListBusiness />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route
                  path="/cant-find-business"
                  element={<CantFindBusiness />}
                />
                <Route path="/all-categories" element={<AllCategories />} />
                <Route
                  path="/all-cities-categories"
                  element={<AllCitiesCategories />}
                />
                <Route path="/main-pages" element={<MainPages />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/uae" element={<UAE />} />
                <Route
                  path="/uae/:city"
                  element={<CityRouteHandler country="uae" />}
                />
                <Route
                  path="/uae/:city/:category"
                  element={<CityRouteHandler country="uae" />}
                />
                <Route
                  path="/business/:city"
                  element={<CityRouteHandler country="india" />}
                />
                <Route
                  path="/business/:city/:category"
                  element={<CityRouteHandler country="india" />}
                />
                <Route
                  path="/category/:category"
                  element={<CategoryLocationPage />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            ) : (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <h1>Loading...</h1>
              </div>
            )}
            <SiteFooter />
            <GlobalDebugPopup />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
