
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RegionPriceData } from "@/types/regionPriceTypes";

export const useRegionPriceData = () => {
  return useQuery({
    queryKey: ['region-price-data'],
    queryFn: async () => {
      try {
        const { data: properties, error } = await supabase
          .from('properties')
          .select('region, price')
          .not('price', 'is', null)
          .not('region', 'is', null)
          .gt('price', 0);

        if (error) {
          console.error('Error fetching properties for price matrix:', error);
          throw new Error(error.message);
        }

        if (!properties || properties.length === 0) {
          throw new Error('No property data found');
        }

        // Calculate Athens average first to ensure consistency
        const allPrices = properties
          .filter(p => p.price && p.price > 0)
          .map(p => p.price);
          
        const athensAverage = allPrices.length > 0 
          ? allPrices.reduce((a, b) => a + b, 0) / allPrices.length
          : 0;
        
        // Group by region and calculate stats
        const regionData = properties.reduce((acc: Record<string, number[]>, property) => {
          if (!property.region || !property.price || property.price <= 0) return acc;
          
          const region = property.region;
          if (!acc[region]) {
            acc[region] = [];
          }
          acc[region].push(property.price);
          return acc;
        }, {});
        
        // Calculate regional statistics
        const results: RegionPriceData[] = Object.entries(regionData).map(([region, prices]) => {
          if (!prices || prices.length === 0) return null;
          
          return {
            region,
            avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            count: prices.length
          };
        }).filter(Boolean) as RegionPriceData[];

        // Add Athens average data with the consistently calculated value
        if (allPrices.length > 0) {
          results.push({
            region: 'athens-average',
            avgPrice: athensAverage, // Use the calculated Athens average
            minPrice: Math.min(...allPrices),
            maxPrice: Math.max(...allPrices),
            count: allPrices.length
          });
        }
        
        return results;
      } catch (error) {
        console.error('RegionPriceMatrix: Error in queryFn:', error);
        throw error;
      }
    },
    retry: 2,
    refetchOnWindowFocus: false
  });
};
