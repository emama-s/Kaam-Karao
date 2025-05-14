import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Star } from "lucide-react";

// Mock data for reviews
const mockReviews = [
  {
    id: "r1",
    customer: {
      id: "c1",
      name: "Amit Kumar",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww"
    },
    service: {
      id: "s1",
      title: "Plumbing Services"
    },
    rating: 5,
    comment: "Excellent work! Fixed my leaking pipe quickly and efficiently. Would definitely recommend to others.",
    date: "2023-10-15T10:30:00Z",
    response: "Thank you for your kind review! It was a pleasure working with you."
  },
  {
    id: "r2",
    customer: {
      id: "c2",
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D"
    },
    service: {
      id: "s1",
      title: "Plumbing Services"
    },
    rating: 4,
    comment: "Good service, arrived on time and completed the work as promised. The price was reasonable too.",
    date: "2023-09-28T14:15:00Z",
    response: null
  },
  {
    id: "r3",
    customer: {
      id: "c3",
      name: "Rajesh Patel",
      avatar: ""
    },
    service: {
      id: "s2",
      title: "Electrical Repairs"
    },
    rating: 3,
    comment: "The work was done properly but took longer than expected. Communication could have been better.",
    date: "2023-09-10T16:45:00Z",
    response: "I apologize for the delay. We appreciate your feedback and will work on improving our time management."
  }
];

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(mockReviews);
  const [activeTab, setActiveTab] = useState("all");
  
  const filterReviews = () => {
    if (activeTab === "all") return reviews;
    if (activeTab === "positive") return reviews.filter(r => r.rating >= 4);
    if (activeTab === "neutral") return reviews.filter(r => r.rating === 3);
    if (activeTab === "negative") return reviews.filter(r => r.rating < 3);
    if (activeTab === "unanswered") return reviews.filter(r => r.response === null);
    return reviews;
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  // Format date to local string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  // Calculate average rating
  const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  // Rating counts
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  // Active reviews
  const filteredReviews = filterReviews();

  const [responseInput, setResponseInput] = useState<{[key: string]: string}>({});

  const handleResponseSubmit = (reviewId: string) => {
    if (!responseInput[reviewId]?.trim()) return;
    
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return { ...review, response: responseInput[reviewId] };
      }
      return review;
    }));
    
    // Clear input
    setResponseInput(prev => ({...prev, [reviewId]: ""}));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews & Ratings</h1>
          <p className="text-muted-foreground">
            Manage and respond to customer reviews of your services
          </p>
        </div>

        {/* Summary Card */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Rating Summary</CardTitle>
              <CardDescription>Overall performance based on customer reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">
                  {avgRating.toFixed(1)}
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${star <= Math.round(avgRating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on {reviews.length} reviews
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <div className="w-4 text-sm">{star}</div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(ratingCounts[star as keyof typeof ratingCounts] / reviews.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-10 text-right text-sm text-muted-foreground">
                      {ratingCounts[star as keyof typeof ratingCounts]}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="positive">Positive</TabsTrigger>
            <TabsTrigger value="neutral">Neutral</TabsTrigger>
            <TabsTrigger value="negative">Negative</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader className="flex flex-row items-start space-y-0">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={review.customer.avatar} alt={review.customer.name} />
                        <AvatarFallback>{getInitials(review.customer.name)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <CardTitle className="text-base">{review.customer.name}</CardTitle>
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-primary text-primary" : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <CardDescription>
                            {review.service.title} • {formatDate(review.date)}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{review.comment}</p>
                      
                      {review.response && (
                        <div className="rounded-md bg-muted p-3">
                          <p className="text-xs font-medium mb-1">Your Response:</p>
                          <p className="text-sm">{review.response}</p>
                        </div>
                      )}
                      
                      {!review.response && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium">Reply to this review:</p>
                          <textarea
                            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Type your response here..."
                            value={responseInput[review.id] || ""}
                            onChange={(e) => setResponseInput({...responseInput, [review.id]: e.target.value})}
                          ></textarea>
                          <div className="flex justify-end">
                            <button 
                              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                              onClick={() => handleResponseSubmit(review.id)}
                            >
                              Submit Response
                            </button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
                  <p className="text-muted-foreground">No reviews found in this category</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}