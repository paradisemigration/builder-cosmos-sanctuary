import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: "user" | "business_owner" | "admin";
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the attempted location for redirect after login
      navigate(redirectTo, {
        state: { from: location.pathname },
        replace: true,
      });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, redirectTo]);

  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      requireRole &&
      user?.role !== requireRole
    ) {
      // If user doesn't have required role, redirect based on their role
      if (user?.role === "admin") {
        navigate("/admin");
      } else if (user?.role === "business_owner") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, isLoading, requireRole, user?.role, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requireRole && user?.role !== requireRole) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
