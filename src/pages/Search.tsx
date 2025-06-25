
import { useState, useEffect } from "react";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import PropertyTypeSection from "@/components/property-filter/PropertyTypeSection";
import NeighborhoodScoresSection from "@/components/property-filter/NeighborhoodScoresSection";
import PropertyFeaturesSection from "@/components/property-filter/PropertyFeaturesSection";
import { PropertyFilters } from "@/types/propertyTypes";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { parseCoordinates } from "@/utils/propertyUtils";

const initialFilters: PropertyFilters = {
  propertyType: null,
  floorNumbers: [],
  priceRange: [0, 1000000],
  yearBuilt: [1950, 2024],
  energyClasses: [],
  regions: [],
  hasParking: null,
  heatingType: null,
  hasSolarWaterHeater: null,
  walkabilityScore: [0, 10],
  safetyScore: [0, 10],
  educationScore: [0, 10],
  entertainmentScore: [0, 10],
  retailScore: [0, 10],
  greenSpacesScore: [0, 10],
  areaRange: [0, 500],
  bedroomRange: [0, 6],
  bathroomRange: [0, 4],
  selectedRegions: [],
  sortBy: '',
};

const Search = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Fetch all properties
  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*');

      if (error) {
        throw error;
      }

      return data || [];
    }
  });

  useEffect(() => {
    let count = 0;
    
    if (filters.propertyType) count++;
    if (filters.floorNumbers.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) count++;
    if (filters.yearBuilt[0] > 1950 || filters.yearBuilt[1] < 2024) count++;
    if (filters.energyClasses.length > 0) count++;
    if (filters.areaRange[0] > 0 || filters.areaRange[1] < 500) count++;
    if (filters.bedroomRange[0] > 0 || filters.bedroomRange[1] < 6) count++;
    if (filters.bathroomRange[0] > 0 || filters.bathroomRange[1] < 4) count++;
    if (filters.regions.length > 0) count++;
    if (filters.hasParking !== null) count++;
    if (filters.heatingType !== null) count++;
    if (filters.hasSolarWaterHeater !== null) count++;
    if (filters.walkabilityScore[0] > 0 || filters.walkabilityScore[1] < 10) count++;
    if (filters.safetyScore[0] > 0 || filters.safetyScore[1] < 10) count++;
    if (filters.educationScore[0] > 0 || filters.educationScore[1] < 10) count++;
    if (filters.entertainmentScore[0] > 0 || filters.entertainmentScore[1] < 10) count++;
    if (filters.retailScore[0] > 0 || filters.retailScore[1] < 10) count++;
    if (filters.greenSpacesScore[0] > 0 || filters.greenSpacesScore[1] < 10) count++;

    setActiveFiltersCount(count);
  }, [filters]);

  const handleSearch = () => {
    // Filter properties based on selected criteria
    const filteredProperties = properties.filter(property => {
      // Basic property filtering
      const matchesPropertyType = !filters.propertyType || property.property_type === filters.propertyType;
      
      const isInPriceRange = property.price >= filters.priceRange[0] && 
                            property.price <= filters.priceRange[1];
      
      const isInAreaRange = property.area >= filters.areaRange[0] && 
                           property.area <= filters.areaRange[1];
      
      const isInBedroomRange = property.bedrooms >= filters.bedroomRange[0] && 
                              property.bedrooms <= filters.bedroomRange[1];
      
      const isInBathroomRange = property.bathrooms >= filters.bathroomRange[0] && 
                               property.bathrooms <= filters.bathroomRange[1];
      
      // Check for floor numbers if it's an apartment
      const matchesFloor = property.property_type !== 'apartment' || 
                          filters.floorNumbers.length === 0 || 
                          (property.floor !== null && filters.floorNumbers.includes(property.floor));
      
      // Energy class filtering
      const matchesEnergyClass = filters.energyClasses.length === 0 || 
                                filters.energyClasses.includes(property.energy_class as any);
      
      // Year built filtering
      const matchesYearBuilt = property.year_built >= filters.yearBuilt[0] && 
                              property.year_built <= filters.yearBuilt[1];
      
      // Features filtering
      const matchesParking = filters.hasParking === null || 
                            Boolean(property.parking) === filters.hasParking;
      
      const matchesHeating = filters.heatingType === null || 
                            property.heating_type === filters.heatingType;
      
      const matchesSolarHeater = filters.hasSolarWaterHeater === null || 
                                property.solar_water_heater === filters.hasSolarWaterHeater;
      
      // Region filtering
      const hasSelectedRegions = filters.selectedRegions.length > 0;
      const matchesRegion = !hasSelectedRegions || 
                           filters.selectedRegions.some(region => property.neighborhood === region.name);
      
      return matchesPropertyType && isInPriceRange && isInAreaRange && isInBedroomRange && 
             isInBathroomRange && matchesFloor && matchesEnergyClass && matchesYearBuilt && 
             matchesParking && matchesHeating && matchesSolarHeater && matchesRegion;
    });

    // Convert properties for map display
    const mapProperties = filteredProperties.map(property => ({
      id: property.id,
      title: property.title,
      price: property.price,
      coordinates: parseCoordinates(property.coordinates),
      image: property.image_url || "/placeholder.svg"
    }));

    // Navigate to search results with filtered properties and filters
    navigate('/search-results', { 
      state: { 
        filters, 
        filteredProperties,
        mapProperties
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Main Menu
              </button>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>Active Filters:</span>
                  <span className="font-bold">{activeFiltersCount}</span>
                </Badge>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2 dark:text-white">Advanced Search</h1>
              <p className="text-muted-foreground">Find your perfect property with our advanced filters</p>
            </div>

            <div className="grid gap-8">
              <PropertyTypeSection 
                filters={filters}
                setFilters={setFilters}
              />

              <PropertyFeaturesSection 
                filters={filters}
                setFilters={setFilters}
              />

              <NeighborhoodScoresSection 
                filters={filters}
                setFilters={setFilters}
              />

              <div className="flex justify-end">
                <Button 
                  size="lg"
                  onClick={handleSearch}
                  className="flex items-center gap-2"
                >
                  <SearchIcon className="w-4 h-4" />
                  Search Properties
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Search;
