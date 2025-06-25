
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useFilter } from "@/contexts/FilterContext";
import { PropertyFilters } from "@/types/propertyTypes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePropertyFiltering = (
  showFavorites: boolean = false, 
  advancedFilters?: PropertyFilters
) => {
  const { mainFilters, favorites } = useFilter();
  const location = useLocation();
  const [showViewAllButton, setShowViewAllButton] = useState(false);
  const isAdvancedSearch = location.pathname === '/search';
  const filters = isAdvancedSearch ? advancedFilters || mainFilters : mainFilters;

  // Fetch properties
  const { data: properties = [], isLoading } = useQuery({
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

  // Format price helper function
  const formatPrice = (price: number) => {
    return price.toLocaleString('de-DE');
  };

  // Scroll handler to show "View All" button
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/') {
        const sixthPropertyElement = document.querySelector('[data-property-index="5"]');
        if (sixthPropertyElement) {
          const rect = sixthPropertyElement.getBoundingClientRect();
          setShowViewAllButton(rect.bottom <= window.innerHeight);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Filter properties
  const filteredProperties = properties.filter(property => {
    if (showFavorites) {
      return favorites.includes(property.id);
    }

    const hasSelectedRegions = filters.selectedRegions.length > 0;
    const matchesNeighborhood = !hasSelectedRegions || filters.selectedRegions.some(
      region => property.neighborhood === region.name
    );

    const isInPriceRange = property.price >= filters.priceRange[0] && 
                          property.price <= filters.priceRange[1];

    const isInAreaRange = property.area >= filters.areaRange[0] && 
                         property.area <= filters.areaRange[1];

    const isInBedroomRange = property.bedrooms >= filters.bedroomRange[0] && 
                            property.bedrooms <= filters.bedroomRange[1];

    const isInBathroomRange = property.bathrooms >= filters.bathroomRange[0] && 
                             property.bathrooms <= filters.bathroomRange[1];

    const matchesPropertyType = !filters.propertyType || 
                               property.property_type === filters.propertyType;

    return matchesNeighborhood && isInPriceRange && isInAreaRange && 
           isInBedroomRange && isInBathroomRange && matchesPropertyType;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (filters.sortBy) {
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

  return {
    properties,
    filteredProperties,
    sortedProperties,
    isLoading,
    showViewAllButton,
    formatPrice,
    filters
  };
};
