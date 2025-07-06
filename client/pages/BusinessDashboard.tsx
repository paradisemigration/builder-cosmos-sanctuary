import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Navigation } from "@/components/Navigation";
import {
  Eye,
  Edit,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  AlertCircle,
  Settings,
  Camera,
  Download,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sampleBusinesses } from "@/lib/data";

export default function BusinessDashboard() {
  const { user, logout } = useAuth();

  // Get business for the logged-in user
  const business =
    sampleBusinesses.find((b) => b.id === user?.businessId) ||
    sampleBusinesses[0];
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const stats = [
    { label: "Profile Views", value: "1,234", change: "+12%", icon: Eye },
    {
      label: "Total Reviews",
      value: business.reviewCount.toString(),
      change: "+5%",
      icon: MessageSquare,
    },
    {
      label: "Average Rating",
      value: business.rating.toString(),
      change: "+0.2",
      icon: Star,
    },
    {
      label: "Click to Website",
      value: "456",
      change: "+18%",
      icon: TrendingUp,
    },
  ];

  const recentReviews = business.reviews.map((review, index) => ({
    ...review,
    date: `2024-01-${15 + index}`,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="p-8">
        <h1>Business Dashboard</h1>
      </div>
    </div>
  );
}
