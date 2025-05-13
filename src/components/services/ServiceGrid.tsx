
import { ServiceCard } from "./ServiceCard";
import { Service } from "@/context/ServiceContext";

interface ServiceGridProps {
  services: Service[];
  isLoading?: boolean;
}

export function ServiceGrid({ services, isLoading = false }: ServiceGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="h-96 bg-muted animate-pulse rounded-md"></div>
        ))}
      </div>
    );
  }
  
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold mb-2">No services found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {services.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}

export default ServiceGrid;
