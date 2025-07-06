import { useState, useEffect } from "react";
import {
  Star,
  Edit3,
  Trash2,
  Eye,
  Flag,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sampleBusinesses, Review } from "@/lib/data";

interface AdminReview extends Review {
  businessName: string;
  businessId: string;
  status: "active" | "flagged" | "hidden";
  provider?: "google" | "facebook" | "email";
}

export function ReviewManagement() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<AdminReview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState("");

  // Initialize reviews from sample businesses
  useEffect(() => {
    const allReviews: AdminReview[] = [];
    sampleBusinesses.forEach((business) => {
      business.reviews.forEach((review) => {
        allReviews.push({
          ...review,
          businessName: business.name,
          businessId: business.id,
          status: "active",
          provider: Math.random() > 0.5 ? "google" : "facebook", // Simulate social login
        });
      });
    });
    setReviews(allReviews);
    setFilteredReviews(allReviews);
  }, []);

  // Filter reviews based on search and filters
  useEffect(() => {
    let filtered = reviews;

    if (searchQuery) {
      filtered = filtered.filter(
        (review) =>
          review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.businessName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((review) => review.status === statusFilter);
    }

    if (providerFilter !== "all") {
      filtered = filtered.filter(
        (review) => review.provider === providerFilter,
      );
    }

    setFilteredReviews(filtered);
  }, [reviews, searchQuery, statusFilter, providerFilter]);

  const handleEditReview = (review: AdminReview) => {
    setSelectedReview(review);
    setEditingComment(review.comment);
    setIsEditModalOpen(true);
  };

  const handleUpdateReview = () => {
    if (!selectedReview) return;

    setReviews((prev) =>
      prev.map((review) =>
        review.id === selectedReview.id
          ? { ...review, comment: editingComment }
          : review,
      ),
    );

    setIsEditModalOpen(false);
    setSelectedReview(null);
    setEditingComment("");
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    }
  };

  const handleToggleStatus = (
    reviewId: string,
    newStatus: "active" | "flagged" | "hidden",
  ) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, status: newStatus } : review,
      ),
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "flagged":
        return <Badge className="bg-yellow-100 text-yellow-800">Flagged</Badge>;
      case "hidden":
        return <Badge className="bg-red-100 text-red-800">Hidden</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getProviderBadge = (provider?: string) => {
    switch (provider) {
      case "google":
        return (
          <Badge variant="outline" className="text-blue-600">
            Google
          </Badge>
        );
      case "facebook":
        return (
          <Badge variant="outline" className="text-blue-800">
            Facebook
          </Badge>
        );
      case "email":
        return <Badge variant="outline">Email</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Review Management</h2>
          <p className="text-muted-foreground">
            Manage customer reviews across all businesses
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Reviews
                </p>
                <p className="text-2xl font-bold">{reviews.length}</p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active
                </p>
                <p className="text-2xl font-bold">
                  {reviews.filter((r) => r.status === "active").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Flagged
                </p>
                <p className="text-2xl font-bold">
                  {reviews.filter((r) => r.status === "flagged").length}
                </p>
              </div>
              <Flag className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Social Login
                </p>
                <p className="text-2xl font-bold">
                  {reviews.filter((r) => r.provider !== "email").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search reviews, users, or businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.userAvatar} />
                      <AvatarFallback>
                        {review.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{review.userName}</h4>
                        {review.isVerified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                        {getProviderBadge(review.provider)}
                        {getStatusBadge(review.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Review for {review.businessName} • {review.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-accent fill-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {review.rating}/5
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-4">{review.comment}</p>

                  {review.businessResponse && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h5 className="font-semibold text-sm mb-2">
                        Business Response:
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {review.businessResponse}
                      </p>
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditReview(review)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Review
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleToggleStatus(
                          review.id,
                          review.status === "active" ? "flagged" : "active",
                        )
                      }
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      {review.status === "active"
                        ? "Flag Review"
                        : "Unflag Review"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleToggleStatus(
                          review.id,
                          review.status === "hidden" ? "active" : "hidden",
                        )
                      }
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {review.status === "hidden"
                        ? "Show Review"
                        : "Hide Review"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Review
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No reviews found matching your criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Review Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedReview && (
              <>
                <div>
                  <Label>Reviewer</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedReview.userName} ({selectedReview.provider})
                  </p>
                </div>
                <div>
                  <Label>Business</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedReview.businessName}
                  </p>
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < selectedReview.rating
                            ? "text-accent fill-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-comment">Review Comment</Label>
                  <Textarea
                    id="edit-comment"
                    value={editingComment}
                    onChange={(e) => setEditingComment(e.target.value)}
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateReview}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
