
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { SearchFilters } from "@/components/services/SearchFilters";
import { useService } from "@/context/ServiceContext";

export function SearchPage() {
  const { filterServices, filteredServices } = useService();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: "",
    category: "",
    location: ""
  });

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [filteredServices]);

  const handleSearch = (query: string, category?: string, location?: string) => {
    setIsLoading(true);
    setSearchParams({ query, category: category || "", location: location || "" });
    filterServices(query, category, location);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Find Services</h1>
          <p className="text-muted-foreground">
            Search for services by keywords, category or location
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <SearchFilters onSearch={handleSearch} />
          </div>
          <div className="md:col-span-3">
            {searchParams.query || searchParams.category || searchParams.location ? (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Search Results</h2>
                <p className="text-muted-foreground">
                  {isLoading ? "Searching..." : `Found ${filteredServices.length} services`}
                  {searchParams.query && ` matching "${searchParams.query}"`}
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Browse Services</h2>
                <p className="text-muted-foreground">
                  Explore all available services or use filters to narrow down
                </p>
              </div>
            )}
            
            <ServiceGrid services={filteredServices} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SearchPage;
