import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
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
import AdminBulkUpload from "./pages/AdminBulkUpload";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/business/:id" element={<BusinessProfile />} />
            <Route path="/plans" element={<ListingPlans />} />
            <Route path="/add-business" element={<AddBusiness />} />
            <Route path="/login" element={<Login />} />

            {/* SEO-friendly category and location routes */}
            <Route
              path="/category/:category"
              element={<CategoryLocationPage />}
            />
            <Route
              path="/location/:location"
              element={<CategoryLocationPage />}
            />
            <Route
              path="/:location/:category"
              element={<CategoryLocationPage />}
            />

            {/* Protected Routes - Require Authentication */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireRole="business_owner">
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bulk-upload"
              element={
                <ProtectedRoute requireRole="admin">
                  <AdminBulkUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/business/:id/edit"
              element={
                <ProtectedRoute requireRole="admin">
                  <EditBusiness />
                </ProtectedRoute>
              }
            />

            {/* Business Owner Edit Route */}
            <Route
              path="/business/:id/edit"
              element={
                <ProtectedRoute requireRole="business_owner">
                  <EditBusiness />
                </ProtectedRoute>
              }
            />

            {/* Static Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cant-find-business" element={<CantFindBusiness />} />
            <Route
              path="/help"
              element={
                <div className="min-h-screen bg-gray-50 pt-24 px-4">
                  <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                      Help Center
                    </h1>
                    <div className="bg-white rounded-lg p-8 shadow-sm">
                      <p className="text-lg text-gray-700 mb-4">
                        Find answers to frequently asked questions and get
                        support.
                      </p>
                      <p className="text-gray-600">Coming soon...</p>
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/privacy"
              element={
                <div className="min-h-screen bg-gray-50 pt-24 px-4">
                  <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                      Privacy Policy
                    </h1>
                    <div className="bg-white rounded-lg p-8 shadow-sm">
                      <p className="text-lg text-gray-700 mb-4">
                        Learn how we protect your privacy and handle your data.
                      </p>
                      <p className="text-gray-600">Coming soon...</p>
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/terms"
              element={
                <div className="min-h-screen bg-gray-50 pt-24 px-4">
                  <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                      Terms of Service
                    </h1>
                    <div className="bg-white rounded-lg p-8 shadow-sm">
                      <p className="text-lg text-gray-700 mb-4">
                        Read our terms and conditions for using VisaConsult
                        India.
                      </p>
                      <p className="text-gray-600">Coming soon...</p>
                    </div>
                  </div>
                </div>
              }
            />

            {/* Catch-all route - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
