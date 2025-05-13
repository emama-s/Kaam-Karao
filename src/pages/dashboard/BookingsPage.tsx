
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBooking, BookingStatus } from "@/context/BookingContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BookingCard } from "@/components/bookings/BookingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function BookingsPage() {
  const { user } = useAuth();
  const { 
    getBookingsByCustomer, 
    getBookingsByProvider,
    updateBookingStatus 
  } = useBooking();
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all");
  
  const isProvider = user?.role === "provider";
  const userBookings = user 
    ? isProvider 
      ? getBookingsByProvider(user.id)
      : getBookingsByCustomer(user.id)
    : [];
  
  const filteredBookings = activeTab === "all" 
    ? userBookings 
    : userBookings.filter(booking => booking.status === activeTab);
  
  // Sort bookings by date
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    // Sort by date, most recent first for upcoming, oldest first for past
    if (["pending", "confirmed"].includes(a.status)) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {isProvider ? "Booking Requests" : "My Bookings"}
          </h1>
          <p className="text-muted-foreground">
            {isProvider 
              ? "Manage your service booking requests and appointments"
              : "View and manage your service bookings"
            }
          </p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as BookingStatus | "all")}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              All ({userBookings.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({userBookings.filter(b => b.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              Confirmed ({userBookings.filter(b => b.status === "confirmed").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({userBookings.filter(b => b.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({userBookings.filter(b => b.status === "cancelled").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBookings.length > 0 ? (
                sortedBookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onStatusChange={updateBookingStatus} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                  <p className="text-muted-foreground">
                    {activeTab === "all" 
                      ? "You don't have any bookings yet."
                      : `You don't have any ${activeTab} bookings.`
                    }
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default BookingsPage;
