
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RegionPricePerMeterData } from "@/types/regionPriceTypes";

export const useRegionPricePerMeterData = () => {
  return useQuery({
    queryKey: ['region-price-per-meter-data'],
    queryFn: async () => {
      try {
        const { data: properties, error } = await supabase
          .from('properties')
          .select('region, price, area')
          .not('price', 'is', null)
          .not('region', 'is', null)
          .not('area', 'is', null)
          .gt('price', 0)
          .gt('area', 0);

        if (error) {
          console.error('Error fetching properties for price per meter matrix:', error);
          throw new Error(error.message);
        }

        if (!properties || properties.length === 0) {
          throw new Error('No property data found');
        }

        // Calculate Athens average price per meter first to ensure consistency
        const validProperties = properties.filter(p => 
          p.price && p.price > 0 && p.area && p.area > 0
        );
        
        const allPricesPerMeter = validProperties.map(p => p.price / p.area);
          
        const athensAveragePricePerMeter = allPricesPerMeter.length > 0 
          ? allPricesPerMeter.reduce((a, b) => a + b, 0) / allPricesPerMeter.length
          : 0;
        
        // Group by region and calculate stats
        const regionData = validProperties.reduce((acc: Record<string, number[]>, property) => {
          const region = property.region;
          if (!acc[region]) {
            acc[region] = [];
          }
          acc[region].push(property.price / property.area);
          return acc;
        }, {});
        
        // Calculate regional statistics
        const results: RegionPricePerMeterData[] = Object.entries(regionData).map(([region, pricesPerMeter]) => {
          if (!pricesPerMeter || pricesPerMeter.length === 0) return null;
          
          return {
            region,
            avgPricePerMeter: pricesPerMeter.reduce((a, b) => a + b, 0) / pricesPerMeter.length,
            minPricePerMeter: Math.min(...pricesPerMeter),
            maxPricePerMeter: Math.max(...pricesPerMeter),
            count: pricesPerMeter.length
          };
        }).filter(Boolean) as RegionPricePerMeterData[];

        // Add Athens average data with the consistently calculated value
        if (allPricesPerMeter.length > 0) {
          results.push({
            region: 'athens-average',
            avgPricePerMeter: athensAveragePricePerMeter, // Use the calculated Athens average
            minPricePerMeter: Math.min(...allPricesPerMeter),
            maxPricePerMeter: Math.max(...allPricesPerMeter),
            count: allPricesPerMeter.length
          });
        }
        
        return results;
      } catch (error) {
        console.error('RegionPricePerMeterMatrix: Error in queryFn:', error);
        throw error;
      }
    },
    retry: 2,
    refetchOnWindowFocus: false
  });
};
