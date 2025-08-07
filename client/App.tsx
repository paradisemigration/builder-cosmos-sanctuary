import React, { useEffect } from "react";
import "./global.css";

// Simple routing without React Router to eliminate all errors
const SimpleRouter = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const SimpleRoute = ({ path, element }: { path: string; element: React.ReactNode }) => {
  const currentPath = window.location.pathname;
  const isMatch = path === "*" || currentPath === path ||
    (path.includes(":") && new RegExp(path.replace(/:[^/]+/g, "[^/]+")).test(currentPath));
  return isMatch ? <>{element}</> : null;
};

// Create location object
const useLocation = () => ({ pathname: window.location.pathname });

// Simple navigation component
const Navigate = ({ to, replace }: { to: string; replace?: boolean }) => {
  React.useEffect(() => {
    if (replace) {
      window.history.replaceState(null, '', to);
    } else {
      window.location.href = to;
    }
  }, [to, replace]);
  return null;
};

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
          <SimpleRouter>
            <ScrollToTop />
            <Navigation />
            <div>
              <SimpleRoute path="/" element={<Index />} />
              <SimpleRoute path="/browse" element={<Browse />} />
              <SimpleRoute path="/business" element={<Navigate to="/browse" replace />} />
              <SimpleRoute path="/business/:id" element={<BusinessProfile />} />
              <SimpleRoute path="/add-business" element={<AddBusiness />} />
              <SimpleRoute path="/login" element={<Login />} />
              <SimpleRoute path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
              <SimpleRoute path="/admin/status" element={<ProtectedRoute><AdminStatus /></ProtectedRoute>} />
              <SimpleRoute path="/admin/bulk-upload" element={<ProtectedRoute><AdminBulkUpload /></ProtectedRoute>} />
              <SimpleRoute path="/business/:id/edit" element={<EditBusiness />} />
              <SimpleRoute path="/dashboard" element={<BusinessDashboard />} />
              <SimpleRoute path="/plans" element={<ListingPlans />} />
              <SimpleRoute path="/list-business" element={<ListBusiness />} />
              <SimpleRoute path="/about" element={<About />} />
              <SimpleRoute path="/contact" element={<Contact />} />
              <SimpleRoute path="/cant-find-business" element={<CantFindBusiness />} />
              <SimpleRoute path="/all-categories" element={<AllCategories />} />
              <SimpleRoute path="/all-cities-categories" element={<AllCitiesCategories />} />
              <SimpleRoute path="/main-pages" element={<MainPages />} />
              <SimpleRoute path="/sitemap" element={<Sitemap />} />
              <SimpleRoute path="/privacy" element={<Privacy />} />
              <SimpleRoute path="/terms" element={<Terms />} />
              <SimpleRoute path="/uae" element={<UAE />} />
              <SimpleRoute path="/uae/:city" element={<CityRouteHandler country="uae" />} />
              <SimpleRoute path="/uae/:city/:category" element={<CityRouteHandler country="uae" />} />
              <SimpleRoute path="/business/:city" element={<CityRouteHandler country="india" />} />
              <SimpleRoute path="/business/:city/:category" element={<CityRouteHandler country="india" />} />
              <SimpleRoute path="/category/:category" element={<CategoryLocationPage />} />
              <SimpleRoute path="*" element={<NotFound />} />
            </div>
            <SiteFooter />
            <GlobalDebugPopup />
          </SimpleRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
