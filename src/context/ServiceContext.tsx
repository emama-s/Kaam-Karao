
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  providerId: string;
  providerName: string;
  providerAvatar?: string;
  rating: number;
  reviewCount: number;
  location: string;
  images: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

interface ServiceContextType {
  services: Service[];
  categories: Category[];
  filteredServices: Service[];
  filterServices: (query: string, category?: string, location?: string) => void;
  getServiceById: (id: string) => Service | undefined;
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// Mock data
const MOCK_CATEGORIES: Category[] = [
  { id: "c1", name: "Plumbing", icon: "🔧" },
  { id: "c2", name: "Electrical", icon: "⚡" },
  { id: "c3", name: "Cleaning", icon: "🧹" },
  { id: "c4", name: "Gardening", icon: "🌱" },
  { id: "c5", name: "Tutoring", icon: "📚" },
  { id: "c6", name: "Home Repair", icon: "🏠" },
  { id: "c7", name: "Moving", icon: "📦" },
  { id: "c8", name: "Personal Training", icon: "💪" },
];

const MOCK_SERVICES: Service[] = [
  {
    id: "s1",
    title: "Professional Plumbing Services",
    description: "Expert plumbing solutions for all your household needs. Available 24/7 for emergencies. Specialized in leaks, installations, and repairs.",
    category: "c1",
    price: 50,
    providerId: "2",
    providerName: "Mary Provider",
    providerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 4.8,
    reviewCount: 124,
    location: "New Delhi",
    images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"]
  },
  {
    id: "s2",
    title: "Electrical Repair and Installation",
    description: "Licensed electrician with 10+ years experience. Residential and commercial services available. Safety guaranteed.",
    category: "c2",
    price: 60,
    providerId: "3",
    providerName: "Alex Electrician",
    providerAvatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 4.9,
    reviewCount: 89,
    location: "Mumbai",
    images: ["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"]
  },
  {
    id: "s3",
    title: "Deep Home Cleaning",
    description: "Professional home cleaning service. We bring all supplies and equipment. Eco-friendly products available upon request.",
    category: "c3",
    price: 45,
    providerId: "4",
    providerName: "Sarah Cleaner",
    providerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 4.7,
    reviewCount: 156,
    location: "Bangalore",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"]
  },
  {
    id: "s4",
    title: "Garden Maintenance",
    description: "Keep your garden looking beautiful all year round. Services include lawn mowing, weeding, pruning, and seasonal planting.",
    category: "c4",
    price: 40,
    providerId: "5",
    providerName: "Tom Gardener",
    providerAvatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 4.6,
    reviewCount: 78,
    location: "Chennai",
    images: ["https://images.unsplash.com/photo-1599685315640-9ceab2f58148?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"]
  },
  {
    id: "s5",
    title: "Mathematics Tutoring",
    description: "Experienced math tutor for all levels from elementary to college. Personalized lessons to help students excel.",
    category: "c5",
    price: 35,
    providerId: "6",
    providerName: "Lisa Tutor",
    providerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    rating: 5.0,
    reviewCount: 92,
    location: "Hyderabad",
    images: ["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"]
  }
];

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [filteredServices, setFilteredServices] = useState<Service[]>(MOCK_SERVICES);

  const filterServices = useCallback((query: string, category?: string, location?: string) => {
    let filtered = [...services];
    
    if (query) {
      const searchTerms = query.toLowerCase();
      filtered = filtered.filter(
        service => 
          service.title.toLowerCase().includes(searchTerms) || 
          service.description.toLowerCase().includes(searchTerms)
      );
    }
    
    if (category) {
      filtered = filtered.filter(service => service.category === category);
    }
    
    if (location) {
      filtered = filtered.filter(
        service => service.location.toLowerCase() === location.toLowerCase()
      );
    }
    
    setFilteredServices(filtered);
  }, [services]);

  const getServiceById = useCallback((id: string) => {
    return services.find(service => service.id === id);
  }, [services]);

  const addService = useCallback((service: Omit<Service, "id">) => {
    const newService = {
      ...service,
      id: `service_${Date.now()}`,
    };
    setServices(prev => [...prev, newService]);
    setFilteredServices(prev => [...prev, newService]);
  }, []);

  const updateService = useCallback((id: string, updatedFields: Partial<Service>) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id ? { ...service, ...updatedFields } : service
      )
    );
    
    setFilteredServices(prev => 
      prev.map(service => 
        service.id === id ? { ...service, ...updatedFields } : service
      )
    );
  }, []);

  const deleteService = useCallback((id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
    setFilteredServices(prev => prev.filter(service => service.id !== id));
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        services,
        categories: MOCK_CATEGORIES,
        filteredServices,
        filterServices,
        getServiceById,
        addService,
        updateService,
        deleteService
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useService must be used within a ServiceProvider");
  }
  return context;
};
