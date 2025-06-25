
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { parseCoordinates } from '@/utils/propertyUtils';
import { PropertyGeoJSON, PropertyFeature } from '../types/mapTypes';

export const usePropertyHeatmap = () => {
  const [themeModeChanged, setThemeModeChanged] = useState(false);

  const { data: properties, isLoading } = useQuery({
    queryKey: ['heatmap-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('coordinates, price, area, title')
        .not('coordinates', 'is', null);

      if (error) throw error;
      
      return data.filter(property => property.coordinates && property.area);
    }
  });

  // Generate heatmap data points with proper typing
  const getHeatmapData = (): PropertyGeoJSON => {
    if (!properties) return { type: "FeatureCollection", features: [] };

    return {
      type: "FeatureCollection",
      features: properties.map(property => {
        const coordinates = parseCoordinates(property.coordinates);
        const pricePerMeter = property.price / property.area;
        
        return {
          type: "Feature",
          properties: {
            intensity: pricePerMeter,
            price: property.price,
            pricePerMeter: pricePerMeter,
            title: property.title || ""
          },
          geometry: {
            type: "Point",
            coordinates: coordinates
          }
        };
      })
    };
  };

  return {
    properties,
    isLoading,
    getHeatmapData,
    themeModeChanged,
    setThemeModeChanged
  };
};

export default usePropertyHeatmap;
