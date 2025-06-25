
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PropertyList from "@/components/PropertyList";
import { parseCoordinates } from "@/utils/propertyUtils";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFilter } from "@/contexts/FilterContext";
import LoadingView from "@/components/home/LoadingView";
import SortSelector from "@/components/SortSelector";
import { SortOption } from "@/types/propertyTypes";

const MapView = () => {
  const location = useLocation();
  const { mainFilters } = useFilter();
  const [propertiesFromState, setPropertiesFromState] = useState<any[]>([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('');

  // Use state properties if they exist
  useEffect(() => {
    if (location.state?.properties) {
      setPropertiesFromState(location.state.properties);
    }
    if (location.state?.filterApplied) {
      setFilterApplied(location.state.filterApplied);
    }
  }, [location.state]);

  // Only fetch properties from API if we don't have them from state
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties', 'map-view'],
    queryFn: async () => {
      // If we already have properties from state, return those
      if (propertiesFromState.length > 0) {
        return propertiesFromState;
      }
      
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      
      // Return all properties if no filter is applied
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: propertiesFromState.length === 0 // Only run query if we don't have properties from state
  });

  if (isLoading && propertiesFromState.length === 0) {
    return <LoadingView />;
  }

  // Determine which properties to use - from state or from query
  const displayProperties = propertiesFromState.length > 0 ? propertiesFromState : properties;

  // Sort properties based on selected sort option
  const sortedProperties = [...displayProperties].sort((a, b) => {
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

  // Map properties for the PropertyList component with all necessary information
  const title = filterApplied ? "Filtered Properties" : "All Properties";

  return (
    <div className="space-y-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      {/* Sort selector positioned in the top right corner of the map */}
      <div className="absolute top-4 right-4 z-10">
        <SortSelector currentSort={sortBy} onSortChange={setSortBy} />
      </div>
      
      <PropertyList 
        properties={sortedProperties} 
        showMap={true} 
      />
    </div>
  );
};

export default MapView;
