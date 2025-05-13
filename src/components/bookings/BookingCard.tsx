
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Booking, BookingStatus } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface BookingCardProps {
  booking: Booking;
  onStatusChange?: (id: string, status: BookingStatus) => void;
}

export function BookingCard({ booking, onStatusChange }: BookingCardProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const isProvider = user?.role === "provider";
  
  const {
    id,
    serviceName,
    customerName,
    providerName,
    date,
    timeSlot,
    status,
    price,
    location,
  } = booking;
  
  const formattedDate = format(new Date(date), "PPP");
  
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-primary/10 text-primary border-primary/20";
      case "completed":
        return "bg-accent/20 text-accent border-accent/30";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  
  const handleStatusChange = async (newStatus: BookingStatus) => {
    if (!onStatusChange) return;
    
    setIsLoading(true);
    try {
      onStatusChange(id, newStatus);
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{serviceName}</CardTitle>
          <Badge variant="outline" className={getStatusColor()}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {isProvider ? `Customer: ${customerName}` : `Provider: ${providerName}`}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{timeSlot}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{location}</span>
          </div>
          <div className="text-sm font-medium mt-1">
            Price: ₹{price}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {isProvider && status === "pending" && (
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleStatusChange("cancelled")}
              disabled={isLoading}
            >
              Decline
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleStatusChange("confirmed")}
              disabled={isLoading}
            >
              Accept
            </Button>
          </div>
        )}
        
        {isProvider && status === "confirmed" && (
          <div className="flex w-full gap-2">
            <Button
              className="flex-1"
              onClick={() => handleStatusChange("completed")}
              disabled={isLoading}
            >
              Mark Completed
            </Button>
          </div>
        )}
        
        {!isProvider && (status === "pending" || status === "confirmed") && (
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleStatusChange("cancelled")}
              disabled={isLoading}
            >
              Cancel Booking
            </Button>
            <Link to={`/services/${booking.serviceId}`} className="flex-1">
              <Button variant="secondary" className="w-full">
                View Service
              </Button>
            </Link>
          </div>
        )}
        
        {status === "completed" && (
          <div className="flex w-full gap-2">
            <Link to="/dashboard/messages" className="flex-1">
              <Button variant="outline" className="w-full">
                Message {isProvider ? "Customer" : "Provider"}
              </Button>
            </Link>
            {!isProvider && (
              <Link to={`/review/${booking.id}`} className="flex-1">
                <Button className="w-full">
                  Leave Review
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default BookingCard;
