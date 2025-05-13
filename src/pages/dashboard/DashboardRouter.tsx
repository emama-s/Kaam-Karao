
import { useAuth } from "@/context/AuthContext";
import CustomerDashboard from "./customer/CustomerDashboard";
import ProviderDashboard from "./provider/ProviderDashboard";

export function DashboardRouter() {
  const { user } = useAuth();
  
  return user?.role === "provider" ? <ProviderDashboard /> : <CustomerDashboard />;
}

export default DashboardRouter;
