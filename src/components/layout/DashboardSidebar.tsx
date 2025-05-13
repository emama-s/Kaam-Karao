
import { useAuth } from "@/context/AuthContext";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, Search, Calendar, MessageCircle,
  Heart, Settings, ShoppingBag, User, Menu,
  ChevronLeft, ShoppingCart, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DashboardSidebar() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  const isCustomer = user?.role === "customer";
  
  const getNavItemClass = ({ isActive }: { isActive: boolean }) => {
    return cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      isActive 
        ? "bg-primary text-primary-foreground" 
        : "hover:bg-primary/10 text-muted-foreground hover:text-foreground"
    );
  };
  
  return (
    <aside 
      className={cn(
        "flex flex-col border-r bg-background sticky top-16 h-[calc(100vh-4rem)] transition-all",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-2 flex justify-end">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      
      <nav className="flex-1 px-2 space-y-1">
        <NavLink to="/dashboard" className={getNavItemClass} end>
          <Home size={20} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>
        
        {isCustomer ? (
          // Customer links
          <>
            <NavLink to="/dashboard/search" className={getNavItemClass}>
              <Search size={20} />
              {!collapsed && <span>Find Services</span>}
            </NavLink>
            <NavLink to="/dashboard/bookings" className={getNavItemClass}>
              <Calendar size={20} />
              {!collapsed && <span>My Bookings</span>}
            </NavLink>
            <NavLink to="/dashboard/favorites" className={getNavItemClass}>
              <Heart size={20} />
              {!collapsed && <span>Favorites</span>}
            </NavLink>
          </>
        ) : (
          // Provider links
          <>
            <NavLink to="/dashboard/services" className={getNavItemClass}>
              <ShoppingBag size={20} />
              {!collapsed && <span>My Services</span>}
            </NavLink>
            <NavLink to="/dashboard/bookings" className={getNavItemClass}>
              <ShoppingCart size={20} />
              {!collapsed && <span>Booking Requests</span>}
            </NavLink>
            <NavLink to="/dashboard/reviews" className={getNavItemClass}>
              <Star size={20} />
              {!collapsed && <span>Reviews</span>}
            </NavLink>
          </>
        )}
        
        {/* Common links */}
        <NavLink to="/dashboard/messages" className={getNavItemClass}>
          <MessageCircle size={20} />
          {!collapsed && <span>Messages</span>}
        </NavLink>
        <NavLink to="/dashboard/profile" className={getNavItemClass}>
          <User size={20} />
          {!collapsed && <span>Profile</span>}
        </NavLink>
        <NavLink to="/dashboard/settings" className={getNavItemClass}>
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </nav>
    </aside>
  );
}

export default DashboardSidebar;
