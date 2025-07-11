import React from "react";
import "./global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminPanel from "./pages/AdminPanel";
import { Navigation } from "@/components/Navigation";

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
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <Navigation />
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
