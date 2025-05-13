
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BookingCard } from "@/components/bookings/BookingCard";
import { Link } from "react-router-dom";

export function ProviderDashboard() {
  const { user } = useAuth();
  const { getBookingsByProvider, updateBookingStatus } = useBooking();

  // Get provider's bookings
  const providerBookings = user ? getBookingsByProvider(user.id) : [];
  
  // Pending bookings
  const pendingBookings = providerBookings
    .filter(b => b.status === "pending")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Upcoming confirmed bookings
  const upcomingBookings = providerBookings
    .filter(b => b.status === "confirmed")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  // Stats
  const stats = {
    total: providerBookings.length,
    pending: pendingBookings.length,
    confirmed: providerBookings.filter(b => b.status === "confirmed").length,
    completed: providerBookings.filter(b => b.status === "completed").length,
    earnings: providerBookings
      .filter(b => b.status === "completed")
      .reduce((sum, booking) => sum + booking.price, 0)
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your service bookings and business performance.
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
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All time bookings
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
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
                {stats.pending}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires your response
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Jobs</CardTitle>
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
                {stats.confirmed}
              </div>
              <p className="text-xs text-muted-foreground">
                Confirmed bookings
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
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
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{stats.earnings}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.completed} completed jobs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending booking requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Booking Requests</CardTitle>
            <CardDescription>
              New service requests that need your approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingBookings.length > 0 ? (
                pendingBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onStatusChange={updateBookingStatus}
                  />
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No pending bookings</p>
                </div>
              )}
              
              {pendingBookings.length > 0 && pendingBookings.length > 2 && (
                <div className="mt-4 text-center">
                  <Link to="/dashboard/bookings">
                    <Button variant="outline">View All Requests</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming confirmed bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Jobs</CardTitle>
            <CardDescription>
              Your next confirmed service appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onStatusChange={updateBookingStatus}
                  />
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No upcoming jobs</p>
                </div>
              )}
              
              {upcomingBookings.length > 0 && (
                <div className="mt-4 text-center">
                  <Link to="/dashboard/bookings">
                    <Button variant="outline">View All Jobs</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Quick actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/dashboard/services">
            <Button variant="outline" className="w-full h-24 text-lg">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-6 w-6 mb-2"
                >
                  <path d="M13.5 3H12h.5Zm-.5 0H3v18h18V12h-7.5ZM3 3h9.5M3 3v18M21 12V3m-9.5 0V12H21" />
                </svg>
                Manage Services
              </div>
            </Button>
          </Link>
          <Link to="/dashboard/reviews">
            <Button variant="outline" className="w-full h-24 text-lg">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-6 w-6 mb-2"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                View Reviews
              </div>
            </Button>
          </Link>
          <Link to="/dashboard/messages">
            <Button variant="outline" className="w-full h-24 text-lg">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-6 w-6 mb-2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Customer Messages
              </div>
            </Button>
          </Link>
          <Link to="/dashboard/profile">
            <Button variant="outline" className="w-full h-24 text-lg">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-6 w-6 mb-2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Update Profile
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProviderDashboard;
