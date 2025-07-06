import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  MoreHorizontal,
  Download,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { sampleBusinesses, Business } from "@/lib/data";
import { ReviewManagement } from "@/components/ReviewManagement";

const businessStatuses = {
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
  suspended: { label: "Suspended", color: "bg-gray-100 text-gray-800" },
};

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };
  const [businesses, setBusinesses] = useState(
    sampleBusinesses.map((business) => ({
      ...business,
      status: business.isVerified ? "approved" : "pending",
      submissionDate: "2024-01-15",
    })),
  );

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null,
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "all" || business.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const handleStatusChange = (businessId: string, newStatus: string) => {
    setBusinesses((prev) =>
      prev.map((business) =>
        business.id === businessId
          ? {
              ...business,
              status: newStatus,
              isVerified: newStatus === "approved",
            }
          : business,
      ),
    );
  };

  const handleDeleteBusiness = (businessId: string) => {
    setBusinesses((prev) =>
      prev.filter((business) => business.id !== businessId),
    );
    setShowDeleteDialog(false);
    setSelectedBusiness(null);
  };

  const stats = [
    { label: "Total Businesses", value: businesses.length, icon: "📊" },
    {
      label: "Pending Review",
      value: businesses.filter((b) => b.status === "pending").length,
      icon: "⏳",
    },
    {
      label: "Approved",
      value: businesses.filter((b) => b.status === "approved").length,
      icon: "✅",
    },
    {
      label: "Rejected",
      value: businesses.filter((b) => b.status === "rejected").length,
      icon: "❌",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Mobile Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-lg sm:text-2xl font-bold text-primary">
                  Admin<span className="text-dubai-gold">Panel</span>
                </h1>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block text-sm text-muted-foreground">
                Admin: {user?.name}
              </div>
              <div className="sm:hidden text-xs text-muted-foreground">
                {user?.name}
              </div>
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Back to Site
                </Button>
                <Button variant="outline" size="sm" className="sm:hidden px-2">
                  Back
                </Button>
              </Link>
              <Button size="sm" onClick={handleLogout} className="px-3 sm:px-4">
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Business Management
          </h2>
          <p className="text-muted-foreground">
            Manage and moderate business listings in the directory
          </p>
        </div>

        {/* Responsive Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {stat.label}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className="text-lg sm:text-2xl opacity-70">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Responsive Search and Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl">
                  Business Listings
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="sm:hidden">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm" className="sm:hidden">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              {/* Mobile: Scrollable tabs */}
              <div className="w-full overflow-x-auto pb-2">
                <TabsList className="grid grid-cols-5 min-w-[600px] sm:min-w-0 sm:w-full">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">
                      All ({businesses.length})
                    </span>
                    <span className="sm:hidden">All</span>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">
                      Pending (
                      {businesses.filter((b) => b.status === "pending").length})
                    </span>
                    <span className="sm:hidden">
                      Pending (
                      {businesses.filter((b) => b.status === "pending").length})
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">
                      Approved (
                      {businesses.filter((b) => b.status === "approved").length}
                      )
                    </span>
                    <span className="sm:hidden">
                      OK (
                      {businesses.filter((b) => b.status === "approved").length}
                      )
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">
                      Rejected (
                      {businesses.filter((b) => b.status === "rejected").length}
                      )
                    </span>
                    <span className="sm:hidden">
                      No (
                      {businesses.filter((b) => b.status === "rejected").length}
                      )
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="suspended" className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">
                      Suspended (
                      {
                        businesses.filter((b) => b.status === "suspended")
                          .length
                      }
                      )
                    </span>
                    <span className="sm:hidden">
                      Sus (
                      {
                        businesses.filter((b) => b.status === "suspended")
                          .length
                      }
                      )
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={selectedTab} className="mt-6">
                {/* Mobile: Card Layout */}
                <div className="space-y-4 sm:hidden">
                  {filteredBusinesses.map((business) => (
                    <Card key={business.id} className="p-4">
                      <div className="flex items-start gap-3">
                        {business.logo && (
                          <img
                            src={business.logo}
                            alt={business.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-medium truncate">
                              {business.name}
                            </h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    window.open(
                                      `/business/${business.id}`,
                                      "_blank",
                                    )
                                  }
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    window.open(
                                      `/admin/business/${business.id}/edit`,
                                      "_blank",
                                    )
                                  }
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {business.status === "pending" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(
                                          business.id,
                                          "approved",
                                        )
                                      }
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(
                                          business.id,
                                          "rejected",
                                        )
                                      }
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {business.status === "approved" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(
                                        business.id,
                                        "suspended",
                                      )
                                    }
                                  >
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Suspend
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBusiness(business);
                                    setShowDeleteDialog(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {business.category}
                              </Badge>
                              <Badge
                                className={`text-xs ${
                                  businessStatuses[
                                    business.status as keyof typeof businessStatuses
                                  ]?.color
                                }`}
                              >
                                {
                                  businessStatuses[
                                    business.status as keyof typeof businessStatuses
                                  ]?.label
                                }
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>
                                {business.rating} ⭐ ({business.reviewCount})
                              </span>
                              <span>{business.submissionDate}</span>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {business.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Desktop: Table Layout */}
                <div className="hidden sm:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBusinesses.map((business) => (
                        <TableRow key={business.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {business.logo && (
                                <img
                                  src={business.logo}
                                  alt={business.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">
                                  {business.name}
                                </div>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {business.address}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{business.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                businessStatuses[
                                  business.status as keyof typeof businessStatuses
                                ]?.color
                              }
                            >
                              {
                                businessStatuses[
                                  business.status as keyof typeof businessStatuses
                                ]?.label
                              }
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span>{business.rating}</span>
                              <span className="text-sm text-muted-foreground">
                                ({business.reviewCount})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{business.submissionDate}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    window.open(
                                      `/business/${business.id}`,
                                      "_blank",
                                    )
                                  }
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    window.open(
                                      `/admin/business/${business.id}/edit`,
                                      "_blank",
                                    )
                                  }
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {business.status === "pending" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(
                                          business.id,
                                          "approved",
                                        )
                                      }
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(
                                          business.id,
                                          "rejected",
                                        )
                                      }
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {business.status === "approved" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(
                                        business.id,
                                        "suspended",
                                      )
                                    }
                                  >
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Suspend
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBusiness(business);
                                    setShowDeleteDialog(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Business Listing</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "{selectedBusiness?.name}"? This
              action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedBusiness && handleDeleteBusiness(selectedBusiness.id)
              }
            >
              Delete Business
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
