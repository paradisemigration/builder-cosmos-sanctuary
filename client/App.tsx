import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse" element={<Browse />} />
          {/* Placeholder routes for future development */}
          <Route
            path="/business/:id"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Business Profile Page</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="/add-business"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Add Business Page</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Login Page</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">User Dashboard</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="/admin"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            }
          />
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
          <Route
            path="/report"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Report Scam</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            }
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
