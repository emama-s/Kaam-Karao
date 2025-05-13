
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { useService } from "@/context/ServiceContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ServiceCard } from "@/components/services/ServiceCard";
import { BookingCard } from "@/components/bookings/BookingCard";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export function CustomerDashboard() {
  const { user } = useAuth();
  const { services } = useService();
  const { getBookingsByCustomer, updateBookingStatus } = useBooking();

  // Get user's bookings
  const userBookings = user ? getBookingsByCustomer(user.id) : [];
  const recentBookings = userBookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);

  // Get recommended services (for simplicity, just show top rated)
  const recommendedServices = [...services]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your service bookings today.
          </p>
        </div>

        {/* Stats overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                +{userBookings.filter(b => b.status === "pending").length} pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userBookings.filter(b => b.status === "confirmed").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Next: {
                  userBookings.filter(b => b.status === "confirmed").length > 0 
                    ? format(new Date(userBookings.filter(b => b.status === "confirmed")[0].date), 'MMM d')
                    : 'None'
                }
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userBookings.filter(b => b.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">
                +{userBookings.filter(b => 
                  b.status === "completed" && 
                  new Date(b.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length} this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M20 16v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2Z" />
                <path d="M14 16v4" />
                <path d="M10 16v4" />
                <path d="M12 4v10" />
                <path d="m15 7-3-3-3 3" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userBookings.filter(b => b.status === "cancelled").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {userBookings.filter(b => b.status === "cancelled").length} total cancellations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent bookings */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                Your most recent service bookings and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.length > 0 ? (
                  recentBookings.map(booking => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      onStatusChange={updateBookingStatus}
                    />
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No bookings found</p>
                    <Link to="/dashboard/search">
                      <Button variant="link" className="mt-2">Find services now</Button>
                    </Link>
                  </div>
                )}
                
                {recentBookings.length > 0 && (
                  <div className="mt-4 text-center">
                    <Link to="/dashboard/bookings">
                      <Button variant="outline">View All Bookings</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recommended Services</CardTitle>
              <CardDescription>
                Top-rated services you might be interested in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedServices.map(service => (
                  <div key={service.id} className="flex gap-4 items-center border-b pb-4 last:border-b-0">
                    <div className="h-16 w-16 rounded-md overflow-hidden">
                      <img 
                        src={service.images[0]} 
                        alt={service.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/services/${service.id}`} className="hover:underline">
                        <h4 className="font-medium text-sm">{service.title}</h4>
                      </Link>
                      <div className="flex items-center gap-1 mt-1">
                        <svg
                          className="h-4 w-4 text-yellow-400 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span className="text-xs">{service.rating}</span>
                        <span className="text-xs text-muted-foreground">({service.reviewCount})</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{service.location}</p>
                    </div>
                    <div>
                      <Link to={`/services/${service.id}`}>
                        <Button size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="mt-2 text-center">
                  <Link to="/dashboard/search">
                    <Button variant="outline">Find More Services</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CustomerDashboard;
