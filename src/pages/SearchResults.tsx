
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropertyList from "@/components/PropertyList";
import PropertyMap from "@/components/PropertyMap";
import { PropertyFilters, SortOption } from "@/types/propertyTypes";
import { Button } from "@/components/ui/button";
import SortSelector from "@/components/SortSelector";
import Sidebar from "@/components/Sidebar";

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState<PropertyFilters | null>(null);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [mapProperties, setMapProperties] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('');

  useEffect(() => {
    if (location.state) {
      if (location.state.filters) {
        setFilters(location.state.filters);
      }
      if (location.state.filteredProperties) {
        setFilteredProperties(location.state.filteredProperties);
      }
      if (location.state.mapProperties) {
        setMapProperties(location.state.mapProperties);
      }
    }
  }, [location.state]);

  // Sort properties based on selected sort option
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-high-low':
        return b.price - a.price;
      case 'price-low-high':
        return a.price - b.price;
      case 'area-high-low':
        return b.area - a.area;
      case 'area-low-high':
        return a.area - b.area;
      case 'recent-listed':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest-listed':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return 0;
    }
  });

  if (!filters) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeItem="Advanced Search" />
      <div className="flex-1">
        <div className="flex">
          <div className="w-1/2 h-screen overflow-y-auto p-6 border-r relative">
            <div className="flex justify-between items-center mb-6">
              <Button 
                onClick={() => navigate('/search')}
                variant="secondary"
              >
                Back to Advanced Search
              </Button>
            </div>
            <PropertyList properties={sortedProperties} showMap={false} />
            <div className="flex gap-4 mt-8 mb-6 justify-center">
              <Button 
                onClick={() => navigate('/search')}
                variant="secondary"
              >
                Back to Advanced Search
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
              >
                Back to Main Menu
              </Button>
            </div>
          </div>
          <div className="w-1/2 h-screen relative">
            <div className="absolute top-4 right-4 z-10">
              <SortSelector currentSort={sortBy} onSortChange={setSortBy} />
            </div>
            <PropertyMap 
              properties={mapProperties}
              fullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
