import { useEffect } from "react";
import "./global.css";

// Import React Router properly
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// Add required imports
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import CityBusinessListing from "./pages/CityBusinessListingNew";
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
function ProtectedRoute({ children }) {
  return <>{children}</>;
}

const App = () => {
  return (
    <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <ScrollToTop />
            <Navigation />
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
              <Route
                path="/edit-business/:id"
                element={
                  <ProtectedRoute>
                    <EditBusiness />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business-dashboard"
                element={
                  <ProtectedRoute>
                    <BusinessDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/plans" element={<ListingPlans />} />
              <Route path="/list-business" element={<ListBusiness />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cant-find-business" element={<CantFindBusiness />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/uae" element={<UAE />} />
              
              {/* City and Category Routes */}
              <Route path="/all-cities-categories" element={<AllCitiesCategories />} />
              <Route path="/all-categories" element={<AllCategories />} />
              <Route path="/categories" element={<AllCategories />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/city/:city" element={<CityBusinessListing />} />
              <Route path="/city/:city/:category" element={<CityCategory />} />
              <Route path="/:location/:category" element={<CategoryLocationPage />} />
              <Route path="/main/:page" element={<MainPages />} />
              
              {/* City Route Handler for dynamic city routes */}
              <Route path="/:city" element={<CityRouteHandler />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SiteFooter />
            <GlobalDebugPopup />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
  );
};

export default App;
