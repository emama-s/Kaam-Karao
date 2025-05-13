
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useService } from "@/context/ServiceContext";
import { Search, Star, MapPin } from "lucide-react";

interface SearchFiltersProps {
  onSearch: (query: string, category?: string, location?: string) => void;
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const { categories } = useService();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  
  // Simulated locations
  const locations = ["New Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad"];
  
  useEffect(() => {
    // Debounce search to avoid too many searches while typing
    const handler = setTimeout(() => {
      onSearch(searchQuery, selectedCategory, selectedLocation);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, selectedCategory, selectedLocation, onSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedCategory, selectedLocation);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleRatingChange = (value: number[]) => {
    setMinRating(value[0]);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLocation("");
    setPriceRange([0, 100]);
    setMinRating(0);
    onSearch("", "", "");
  };

  return (
    <div className="space-y-6 bg-white rounded-lg p-6 shadow-sm border">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for services..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Location</label>
          <Select value={selectedLocation} onValueChange={handleLocationChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{location}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium">Price Range</label>
            <span className="text-sm text-muted-foreground">
              ₹{priceRange[0]} - ₹{priceRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={priceRange}
            min={0}
            max={100}
            step={5}
            onValueChange={handlePriceChange}
            className="py-4"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium">Minimum Rating</label>
            <div className="flex items-center">
              <Star className={`h-4 w-4 ${minRating >= 1 ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
              <Star className={`h-4 w-4 ${minRating >= 2 ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
              <Star className={`h-4 w-4 ${minRating >= 3 ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
              <Star className={`h-4 w-4 ${minRating >= 4 ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
              <Star className={`h-4 w-4 ${minRating >= 5 ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
            </div>
          </div>
          <Slider
            defaultValue={[minRating]}
            min={0}
            max={5}
            step={1}
            onValueChange={handleRatingChange}
            className="py-4"
          />
        </div>

        <div className="pt-4 grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={handleClear}>
            Clear Filters
          </Button>
          <Button onClick={() => onSearch(searchQuery, selectedCategory, selectedLocation)}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SearchFilters;
