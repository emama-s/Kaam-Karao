
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  price: number;
  location: string;
  createdAt: string;
}

interface BookingContextType {
  bookings: Booking[];
  createBooking: (booking: Omit<Booking, "id" | "createdAt" | "status">) => void;
  getBookingsByCustomer: (customerId: string) => Booking[];
  getBookingsByProvider: (providerId: string) => Booking[];
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  getBookingById: (id: string) => Booking | undefined;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Mock data
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b1",
    serviceId: "s1",
    serviceName: "Professional Plumbing Services",
    customerId: "1",
    customerName: "John Customer",
    providerId: "2", 
    providerName: "Mary Provider",
    date: "2025-05-15",
    timeSlot: "10:00 - 12:00",
    status: "confirmed",
    price: 50,
    location: "New Delhi",
    createdAt: "2025-05-13T10:30:00Z"
  },
  {
    id: "b2",
    serviceId: "s2",
    serviceName: "Electrical Repair and Installation",
    customerId: "1",
    customerName: "John Customer",
    providerId: "3",
    providerName: "Alex Electrician",
    date: "2025-05-18",
    timeSlot: "14:00 - 16:00",
    status: "pending",
    price: 60, 
    location: "Mumbai",
    createdAt: "2025-05-13T12:45:00Z"
  },
  {
    id: "b3",
    serviceId: "s3",
    serviceName: "Deep Home Cleaning",
    customerId: "7",
    customerName: "Emma Wilson",
    providerId: "2",
    providerName: "Mary Provider",
    date: "2025-05-14",
    timeSlot: "09:00 - 13:00",
    status: "confirmed",
    price: 45,
    location: "New Delhi",
    createdAt: "2025-05-12T08:20:00Z"
  }
];

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  const createBooking = useCallback((bookingData: Omit<Booking, "id" | "createdAt" | "status">) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking_${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  }, []);

  const getBookingsByCustomer = useCallback((customerId: string) => {
    return bookings.filter(booking => booking.customerId === customerId);
  }, [bookings]);

  const getBookingsByProvider = useCallback((providerId: string) => {
    return bookings.filter(booking => booking.providerId === providerId);
  }, [bookings]);

  const updateBookingStatus = useCallback((id: string, status: BookingStatus) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      )
    );
  }, []);

  const getBookingById = useCallback((id: string) => {
    return bookings.find(booking => booking.id === id);
  }, [bookings]);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        createBooking,
        getBookingsByCustomer,
        getBookingsByProvider,
        updateBookingStatus,
        getBookingById
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
