import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import BusinessProfile from "./pages/BusinessProfile";
import AddBusiness from "./pages/AddBusiness";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import EditBusiness from "./pages/EditBusiness";
import BusinessDashboard from "./pages/BusinessDashboard";
import ReportScam from "./pages/ReportScam";
import ScamReview from "./pages/ScamReview";
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

            {/* Placeholder routes for future development */}
            <Route
              path="/contact"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Contact Page</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              }
            />
            <Route
              path="/about"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">About Page</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              }
            />
            <Route
              path="/help"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Help Center</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              }
            />
            <Route path="/report" element={<ReportScam />} />
            <Route
              path="/reviews/:location/:companyName"
              element={<ScamReview />}
            />
            <Route
              path="/privacy"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Privacy Policy</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              }
            />
            <Route
              path="/terms"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Terms of Service</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Reset Password</h1>
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
