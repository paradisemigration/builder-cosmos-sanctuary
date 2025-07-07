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
  Shield,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
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
import { Navigation } from "@/components/Navigation";

const businessStatuses = {
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
  suspended: { label: "Suspended", color: "bg-gray-100 text-gray-800" },
};

const scamReportStatuses = {
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Published", color: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
  investigating: {
    label: "Under Investigation",
    color: "bg-blue-100 text-blue-800",
  },
};

interface ScamReport {
  id: string;
  companyName: string;
  location: string;
  contactNumber: string;
  emailId: string;
  scamDescription: string;
  reportDate: string;
  status: "pending" | "approved" | "rejected" | "investigating";
  reporterInfo: {
    name: string;
    email: string;
  };
  evidenceFiles: {
    paymentReceipt?: string;
    agreement?: string;
    companyPicture?: string;
  };
  reviewUrl?: string;
  adminNotes?: string;
}

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [activeSection, setActiveSection] = useState("businesses");

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

  // Scam Reports State
  const [scamReports, setScamReports] = useState<ScamReport[]>([
    {
      id: "scam-1",
      companyName: "Fake Immigration Services",
      location: "Dubai, UAE",
      contactNumber: "+971-4-123-4567",
      emailId: "contact@fakeimmigration.com",
      scamDescription:
        "This company promised to process my visa within 2 weeks for $5000. After taking my money, they stopped responding to my calls and emails. Their office address doesn't exist and their website has been taken down. They created fake government stamps and documents. I later found out they are not licensed to provide immigration services. Please avoid this company at all costs.",
      reportDate: "2024-01-15",
      status: "pending",
      reporterInfo: {
        name: "Anonymous Reporter",
        email: "reporter1@email.com",
      },
      evidenceFiles: {
        paymentReceipt: "receipt-1.jpg",
        agreement: "agreement-1.pdf",
        companyPicture: "company-1.jpg",
      },
    },
    {
      id: "scam-2",
      companyName: "Quick Visa Solutions",
      location: "Abu Dhabi, UAE",
      contactNumber: "+971-2-987-6543",
      emailId: "info@quickvisascam.com",
      scamDescription:
        "Paid 8000 AED for family visa processing. They provided fake documents and disappeared after 3 months. When I tried to verify the documents with immigration authorities, they were completely fake. The company office was closed and phone numbers disconnected.",
      reportDate: "2024-01-20",
      status: "approved",
      reporterInfo: {
        name: "John Smith",
        email: "john@email.com",
      },
      evidenceFiles: {
        paymentReceipt: "receipt-2.jpg",
        agreement: "agreement-2.pdf",
      },
      reviewUrl: "reviews/abu-dhabi/quick-visa-solutions",
    },
    {
      id: "scam-3",
      companyName: "Express Immigration Hub",
      location: "Sharjah, UAE",
      contactNumber: "+971-6-555-1234",
      emailId: "support@expressimmigration.ae",
      scamDescription:
        "They claimed to have connections with government officials and guaranteed visa approval within 1 week. After paying 12000 AED, they provided fake stamps and certificates. The immigration office confirmed all documents were forged.",
      reportDate: "2024-01-25",
      status: "investigating",
      reporterInfo: {
        name: "Sarah Johnson",
        email: "sarah@email.com",
      },
      evidenceFiles: {
        paymentReceipt: "receipt-3.jpg",
        agreement: "agreement-3.pdf",
        companyPicture: "company-3.jpg",
      },
      adminNotes:
        "Contacted authorities. Multiple reports against this company received.",
    },
  ]);

  const [selectedScamReport, setSelectedScamReport] =
    useState<ScamReport | null>(null);
  const [showScamDeleteDialog, setShowScamDeleteDialog] = useState(false);
  const [scamSearchQuery, setScamSearchQuery] = useState("");
  const [selectedScamTab, setSelectedScamTab] = useState("all");

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

  // Scam Report Handlers
  const handleScamReportStatusChange = (
    reportId: string,
    newStatus: "pending" | "approved" | "rejected" | "investigating",
  ) => {
    setScamReports((prev) =>
      prev.map((report) => {
        if (report.id === reportId) {
          const updatedReport = { ...report, status: newStatus };

          // Generate review URL when approved
          if (newStatus === "approved" && !report.reviewUrl) {
            const formatForUrl = (str: string) =>
              str
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");

            updatedReport.reviewUrl = `reviews/${formatForUrl(report.location)}/${formatForUrl(report.companyName)}`;
          }

          return updatedReport;
        }
        return report;
      }),
    );
  };

  const handleDeleteScamReport = (reportId: string) => {
    setScamReports((prev) => prev.filter((report) => report.id !== reportId));
    setShowScamDeleteDialog(false);
    setSelectedScamReport(null);
  };

  const filteredScamReports = scamReports.filter((report) => {
    const matchesSearch =
      report.companyName
        .toLowerCase()
        .includes(scamSearchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(scamSearchQuery.toLowerCase()) ||
      report.emailId.toLowerCase().includes(scamSearchQuery.toLowerCase());
    const matchesTab =
      selectedScamTab === "all" || report.status === selectedScamTab;
    return matchesSearch && matchesTab;
  });

  const stats =
    activeSection === "businesses"
      ? [
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
        ]
      : activeSection === "scam-reports"
        ? [
            { label: "Total Reports", value: scamReports.length, icon: "🚨" },
            {
              label: "Pending Review",
              value: scamReports.filter((r) => r.status === "pending").length,
              icon: "⏳",
            },
            {
              label: "Published",
              value: scamReports.filter((r) => r.status === "approved").length,
              icon: "✅",
            },
            {
              label: "Under Investigation",
              value: scamReports.filter((r) => r.status === "investigating")
                .length,
              icon: "🔍",
            },
          ]
        : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-orange-50 to-purple-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                size="sm"
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Admin Panel
          </h2>
          <p className="text-muted-foreground">
            Manage business listings, reviews, and directory content
          </p>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs
          value={activeSection}
          onValueChange={setActiveSection}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="businesses">Business Management</TabsTrigger>
            <TabsTrigger value="reviews">Review Management</TabsTrigger>
            <TabsTrigger value="scam-reports">Scam Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="businesses">
            {/* Business Management Content */}

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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:inline-flex"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={downloadExcelTemplate}>
                            <Download className="w-4 h-4 mr-2" />
                            Download Excel Template
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={exportBusinesses}>
                            <Download className="w-4 h-4 mr-2" />
                            Export Current Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button variant="outline" size="sm" className="sm:hidden">
                        <Download className="w-4 h-4" />
                      </Button>

                      <Link to="/admin/bulk-upload">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hidden sm:inline-flex"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Bulk Upload
                        </Button>
                      </Link>

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
                      <TabsTrigger
                        value="pending"
                        className="text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">
                          Pending (
                          {
                            businesses.filter((b) => b.status === "pending")
                              .length
                          }
                          )
                        </span>
                        <span className="sm:hidden">
                          Pending (
                          {
                            businesses.filter((b) => b.status === "pending")
                              .length
                          }
                          )
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="approved"
                        className="text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">
                          Approved (
                          {
                            businesses.filter((b) => b.status === "approved")
                              .length
                          }
                          )
                        </span>
                        <span className="sm:hidden">
                          OK (
                          {
                            businesses.filter((b) => b.status === "approved")
                              .length
                          }
                          )
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="rejected"
                        className="text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">
                          Rejected (
                          {
                            businesses.filter((b) => b.status === "rejected")
                              .length
                          }
                          )
                        </span>
                        <span className="sm:hidden">
                          No (
                          {
                            businesses.filter((b) => b.status === "rejected")
                              .length
                          }
                          )
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="suspended"
                        className="text-xs sm:text-sm"
                      >
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
                                    {business.rating} ⭐ ({business.reviewCount}
                                    )
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
                                <Badge variant="outline">
                                  {business.category}
                                </Badge>
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
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewManagement />
          </TabsContent>

          <TabsContent value="scam-reports">
            {/* Scam Reports Management Content */}

            {/* Scam Reports Stats Cards */}
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

            {/* Scam Reports Search and Filters */}
            <Card className="mb-6">
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Scam Reports
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
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search scam reports..."
                      value={scamSearchQuery}
                      onChange={(e) => setScamSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs
                  value={selectedScamTab}
                  onValueChange={setSelectedScamTab}
                >
                  {/* Mobile: Scrollable tabs */}
                  <div className="w-full overflow-x-auto pb-2">
                    <TabsList className="grid grid-cols-5 min-w-[600px] sm:min-w-0 sm:w-full">
                      <TabsTrigger value="all" className="text-xs sm:text-sm">
                        All ({scamReports.length})
                      </TabsTrigger>
                      <TabsTrigger
                        value="pending"
                        className="text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">
                          Pending (
                          {
                            scamReports.filter((r) => r.status === "pending")
                              .length
                          }
                          )
                        </span>
                        <span className="sm:hidden">
                          Pending (
                          {
                            scamReports.filter((r) => r.status === "pending")
                              .length
                          }
                          )
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="approved"
                        className="text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">
                          Published (
                          {
                            scamReports.filter((r) => r.status === "approved")
                              .length
                          }
                          )
                        </span>
                        <span className="sm:hidden">
                          Live (
                          {
                            scamReports.filter((r) => r.status === "approved")
                              .length
                          }
                          )
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="investigating"
                        className="text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">
                          Investigating (
                          {
                            scamReports.filter(
                              (r) => r.status === "investigating",
                            ).length
                          }
                          )
                        </span>
                        <span className="sm:hidden">
                          Investigating (
                          {
                            scamReports.filter(
                              (r) => r.status === "investigating",
                            ).length
                          }
                          )
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="rejected"
                        className="text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">
                          Rejected (
                          {
                            scamReports.filter((r) => r.status === "rejected")
                              .length
                          }
                          )
                        </span>
                        <span className="sm:hidden">
                          Rejected (
                          {
                            scamReports.filter((r) => r.status === "rejected")
                              .length
                          }
                          )
                        </span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value={selectedScamTab} className="mt-6">
                    {/* Mobile: Card Layout */}
                    <div className="space-y-4 sm:hidden">
                      {filteredScamReports.map((report) => (
                        <Card
                          key={report.id}
                          className="p-4 border-l-4 border-l-red-500"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-red-800 truncate flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                  {report.companyName}
                                </h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3" />
                                  {report.location}
                                </p>
                              </div>
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
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 text-red-800">
                                          <AlertTriangle className="w-5 h-5" />
                                          Scam Report Details
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <label className="text-sm font-medium text-gray-600">
                                              Company Name
                                            </label>
                                            <p className="text-red-800 font-medium">
                                              {report.companyName}
                                            </p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-600">
                                              Location
                                            </label>
                                            <p className="flex items-center gap-1">
                                              <MapPin className="w-4 h-4" />
                                              {report.location}
                                            </p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-600">
                                              Contact Number
                                            </label>
                                            <p className="flex items-center gap-1">
                                              <Phone className="w-4 h-4" />
                                              {report.contactNumber}
                                            </p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-600">
                                              Email
                                            </label>
                                            <p className="flex items-center gap-1">
                                              <Mail className="w-4 h-4" />
                                              {report.emailId}
                                            </p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-600">
                                              Report Date
                                            </label>
                                            <p className="flex items-center gap-1">
                                              <Calendar className="w-4 h-4" />
                                              {report.reportDate}
                                            </p>
                                          </div>
                                          <div>
                                            <label className="text-sm font-medium text-gray-600">
                                              Status
                                            </label>
                                            <Badge
                                              className={
                                                scamReportStatuses[
                                                  report.status
                                                ]?.color
                                              }
                                            >
                                              {
                                                scamReportStatuses[
                                                  report.status
                                                ]?.label
                                              }
                                            </Badge>
                                          </div>
                                        </div>

                                        <div>
                                          <label className="text-sm font-medium text-gray-600">
                                            Scam Description
                                          </label>
                                          <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-gray-800 leading-relaxed">
                                              {report.scamDescription}
                                            </p>
                                          </div>
                                        </div>

                                        <div>
                                          <label className="text-sm font-medium text-gray-600">
                                            Evidence Files
                                          </label>
                                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            {report.evidenceFiles
                                              .paymentReceipt && (
                                              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                <FileText className="w-4 h-4" />
                                                <span className="text-sm">
                                                  Payment Receipt
                                                </span>
                                              </div>
                                            )}
                                            {report.evidenceFiles.agreement && (
                                              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                <FileText className="w-4 h-4" />
                                                <span className="text-sm">
                                                  Agreement
                                                </span>
                                              </div>
                                            )}
                                            {report.evidenceFiles
                                              .companyPicture && (
                                              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                <FileText className="w-4 h-4" />
                                                <span className="text-sm">
                                                  Company Picture
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {report.reviewUrl && (
                                          <div>
                                            <label className="text-sm font-medium text-gray-600">
                                              Published URL
                                            </label>
                                            <div className="mt-2 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                              <ExternalLink className="w-4 h-4 text-green-600" />
                                              <span className="text-green-700 font-mono text-sm">
                                                /{report.reviewUrl}
                                              </span>
                                            </div>
                                          </div>
                                        )}

                                        {report.adminNotes && (
                                          <div>
                                            <label className="text-sm font-medium text-gray-600">
                                              Admin Notes
                                            </label>
                                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                              <p className="text-blue-800">
                                                {report.adminNotes}
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </DialogContent>
                                  </Dialog>

                                  {report.status === "pending" && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleScamReportStatusChange(
                                            report.id,
                                            "approved",
                                          )
                                        }
                                        className="text-green-600"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve & Publish
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleScamReportStatusChange(
                                            report.id,
                                            "investigating",
                                          )
                                        }
                                        className="text-blue-600"
                                      >
                                        <Shield className="w-4 h-4 mr-2" />
                                        Mark as Investigating
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleScamReportStatusChange(
                                            report.id,
                                            "rejected",
                                          )
                                        }
                                        className="text-red-600"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                      </DropdownMenuItem>
                                    </>
                                  )}

                                  {report.status === "approved" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        window.open(
                                          `/${report.reviewUrl}`,
                                          "_blank",
                                        )
                                      }
                                      className="text-blue-600"
                                    >
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      View Live Page
                                    </DropdownMenuItem>
                                  )}

                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedScamReport(report);
                                      setShowScamDeleteDialog(true);
                                    }}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Report
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  className={`text-xs ${scamReportStatuses[report.status]?.color}`}
                                >
                                  {scamReportStatuses[report.status]?.label}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {report.reportDate}
                                </span>
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {report.scamDescription}
                              </p>

                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {report.contactNumber}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {report.emailId}
                                </span>
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
                            <TableHead>Company</TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Report Date</TableHead>
                            <TableHead>Evidence</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredScamReports.map((report) => (
                            <TableRow
                              key={report.id}
                              className="border-l-4 border-l-red-500"
                            >
                              <TableCell>
                                <div>
                                  <div className="font-medium text-red-800 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    {report.companyName}
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {report.location}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="text-sm flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {report.contactNumber}
                                  </div>
                                  <div className="text-sm flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {report.emailId}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    scamReportStatuses[report.status]?.color
                                  }
                                >
                                  {scamReportStatuses[report.status]?.label}
                                </Badge>
                                {report.reviewUrl && (
                                  <div className="mt-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                      onClick={() =>
                                        window.open(
                                          `/${report.reviewUrl}`,
                                          "_blank",
                                        )
                                      }
                                    >
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      Live
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {report.reportDate}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  <span className="text-sm">
                                    {
                                      Object.values(
                                        report.evidenceFiles,
                                      ).filter(Boolean).length
                                    }{" "}
                                    files
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <DropdownMenuItem
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          <Eye className="w-4 h-4 mr-2" />
                                          View Details
                                        </DropdownMenuItem>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                          <DialogTitle className="flex items-center gap-2 text-red-800">
                                            <AlertTriangle className="w-5 h-5" />
                                            Scam Report Details
                                          </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-6">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                              <label className="text-sm font-medium text-gray-600">
                                                Company Name
                                              </label>
                                              <p className="text-red-800 font-medium">
                                                {report.companyName}
                                              </p>
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium text-gray-600">
                                                Location
                                              </label>
                                              <p className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {report.location}
                                              </p>
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium text-gray-600">
                                                Contact Number
                                              </label>
                                              <p className="flex items-center gap-1">
                                                <Phone className="w-4 h-4" />
                                                {report.contactNumber}
                                              </p>
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium text-gray-600">
                                                Email
                                              </label>
                                              <p className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {report.emailId}
                                              </p>
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium text-gray-600">
                                                Report Date
                                              </label>
                                              <p className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {report.reportDate}
                                              </p>
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium text-gray-600">
                                                Status
                                              </label>
                                              <Badge
                                                className={
                                                  scamReportStatuses[
                                                    report.status
                                                  ]?.color
                                                }
                                              >
                                                {
                                                  scamReportStatuses[
                                                    report.status
                                                  ]?.label
                                                }
                                              </Badge>
                                            </div>
                                          </div>

                                          <div>
                                            <label className="text-sm font-medium text-gray-600">
                                              Scam Description
                                            </label>
                                            <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                                              <p className="text-gray-800 leading-relaxed">
                                                {report.scamDescription}
                                              </p>
                                            </div>
                                          </div>

                                          <div>
                                            <label className="text-sm font-medium text-gray-600">
                                              Evidence Files
                                            </label>
                                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                              {report.evidenceFiles
                                                .paymentReceipt && (
                                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                  <FileText className="w-4 h-4" />
                                                  <span className="text-sm">
                                                    Payment Receipt
                                                  </span>
                                                </div>
                                              )}
                                              {report.evidenceFiles
                                                .agreement && (
                                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                  <FileText className="w-4 h-4" />
                                                  <span className="text-sm">
                                                    Agreement
                                                  </span>
                                                </div>
                                              )}
                                              {report.evidenceFiles
                                                .companyPicture && (
                                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                  <FileText className="w-4 h-4" />
                                                  <span className="text-sm">
                                                    Company Picture
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                          </div>

                                          {report.reviewUrl && (
                                            <div>
                                              <label className="text-sm font-medium text-gray-600">
                                                Published URL
                                              </label>
                                              <div className="mt-2 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <ExternalLink className="w-4 h-4 text-green-600" />
                                                <span className="text-green-700 font-mono text-sm">
                                                  /{report.reviewUrl}
                                                </span>
                                              </div>
                                            </div>
                                          )}

                                          {report.adminNotes && (
                                            <div>
                                              <label className="text-sm font-medium text-gray-600">
                                                Admin Notes
                                              </label>
                                              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-blue-800">
                                                  {report.adminNotes}
                                                </p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </DialogContent>
                                    </Dialog>

                                    {report.status === "pending" && (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleScamReportStatusChange(
                                              report.id,
                                              "approved",
                                            )
                                          }
                                          className="text-green-600"
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Approve & Publish
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleScamReportStatusChange(
                                              report.id,
                                              "investigating",
                                            )
                                          }
                                          className="text-blue-600"
                                        >
                                          <Shield className="w-4 h-4 mr-2" />
                                          Mark as Investigating
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleScamReportStatusChange(
                                              report.id,
                                              "rejected",
                                            )
                                          }
                                          className="text-red-600"
                                        >
                                          <XCircle className="w-4 h-4 mr-2" />
                                          Reject
                                        </DropdownMenuItem>
                                      </>
                                    )}

                                    {report.status === "approved" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          window.open(
                                            `/${report.reviewUrl}`,
                                            "_blank",
                                          )
                                        }
                                        className="text-blue-600"
                                      >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        View Live Page
                                      </DropdownMenuItem>
                                    )}

                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedScamReport(report);
                                        setShowScamDeleteDialog(true);
                                      }}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete Report
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
          </TabsContent>
        </Tabs>
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

      {/* Scam Report Delete Confirmation Dialog */}
      <Dialog
        open={showScamDeleteDialog}
        onOpenChange={setShowScamDeleteDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Delete Scam Report
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete the scam report for "
              {selectedScamReport?.companyName}"? This action cannot be undone
              and will remove the report from both the admin panel and any live
              pages.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScamDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedScamReport &&
                handleDeleteScamReport(selectedScamReport.id)
              }
            >
              Delete Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
