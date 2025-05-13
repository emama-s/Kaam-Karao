
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Service } from "@/context/ServiceContext";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface BookingFormProps {
  service: Service;
}

export function BookingForm({ service }: BookingFormProps) {
  const { user } = useAuth();
  const { createBooking } = useBooking();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState("10:00 - 12:00");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const timeSlots = [
    "8:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00"
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to book a service",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a date for your booking",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      createBooking({
        serviceId: service.id,
        serviceName: service.title,
        customerId: user.id,
        customerName: user.name,
        providerId: service.providerId,
        providerName: service.providerName,
        date: format(date, "yyyy-MM-dd"),
        timeSlot,
        price: service.price,
        location: address || service.location,
      });
      
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Booking failed:", error);
      toast({
        title: "Booking failed",
        description: "There was an error creating your booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleConfirm = () => {
    navigate("/dashboard/bookings");
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h3 className="text-xl font-semibold mb-6">Book this Service</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timeslot">Time Slot</Label>
          <select 
            id="timeslot" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
          >
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Service Address</Label>
          <Input 
            id="address" 
            placeholder={`Default: ${service.location}`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter the address where you'd like to receive the service
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any special requirements or instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none min-h-[100px]"
          />
        </div>
        
        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Booking..." : "Book Now"}
          </Button>
          <p className="mt-2 text-xs text-center text-muted-foreground">
            You won't be charged yet. Payment will be collected after service completion.
          </p>
        </div>
      </form>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Successful!</DialogTitle>
            <DialogDescription>
              Your booking request has been sent to the service provider.
              They will confirm your booking soon.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="font-medium">{service.title}</p>
            <p className="text-sm mt-1">{date && format(date, "PPP")}, {timeSlot}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Provider: {service.providerName}
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={handleConfirm}>
              View My Bookings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BookingForm;
