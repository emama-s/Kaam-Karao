import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ServiceProvider } from "./context/ServiceContext";
import { BookingProvider } from "./context/BookingContext";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import DashboardRouter from "./pages/dashboard/DashboardRouter";
import SearchPage from "./pages/dashboard/SearchPage";
import BookingsPage from "./pages/dashboard/BookingsPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import ServiceDetailPage from "./pages/services/ServiceDetailPage";
import NotFound from "./pages/NotFound";

// Provider pages
import MyServicesPage from "./pages/dashboard/provider/MyServicesPage";
import ReviewsPage from "./pages/dashboard/provider/ReviewsPage";
import ProfilePage from "./pages/dashboard/provider/ProfilePage";
import SettingsPage from "./pages/dashboard/provider/SettingsPage";

// Components
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ServiceProvider>
        <BookingProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/services/:id" element={<ServiceDetailPage />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardRouter />} />
                  <Route path="/dashboard/search" element={<SearchPage />} />
                  <Route path="/dashboard/bookings" element={<BookingsPage />} />
                  <Route path="/dashboard/messages" element={<MessagesPage />} />
                  
                  {/* Provider-specific routes */}
                  <Route path="/dashboard/services" element={<MyServicesPage />} />
                  <Route path="/dashboard/reviews" element={<ReviewsPage />} />
                  <Route path="/dashboard/profile" element={<ProfilePage />} />
                  <Route path="/dashboard/settings" element={<SettingsPage />} />
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </BookingProvider>
      </ServiceProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;