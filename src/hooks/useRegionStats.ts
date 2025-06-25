
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { predictPrices } from "@/utils/pricePrediction";
import { 
  calculateNeighborhoodPriceStats,
  calculateRegionPriceStats,
  calculateAthensPriceStats,
  calculateYearlyPriceData
} from "@/utils/regionStats/priceUtils";
import { 
  calculateBedroomStats,
  calculateAthensBedroomStats
} from "@/utils/regionStats/bedroomUtils";
import { 
  calculatePropertyTypeDistribution,
  calculateNeighborhoodDistribution
} from "@/utils/regionStats/distributionUtils";
import { RegionPropertyData } from "@/types/regionTypes";

export const useRegionStats = (regionName: string | undefined) => {
  return useQuery({
    queryKey: ['region-stats', regionName],
    queryFn: async () => {
      try {
        const { data: properties, error } = await supabase
          .from('properties')
          .select('historical_prices, region, area, property_type, neighborhood, price, bedrooms')
          .not('historical_prices', 'is', null);

        if (error) throw error;

        if (!properties || properties.length === 0) {
          throw new Error('No property data found');
        }

        const typedProperties = properties as unknown as RegionPropertyData[];
        const regionProperties = typedProperties.filter(p => p.region === regionName);
        const allProperties = typedProperties;

        if (regionProperties.length === 0) {
          throw new Error(`No properties found for region: ${regionName}`);
        }

        // Calculate bedroom statistics
        const { bedroomPricesByNeighborhood, regionAvgPerBedroom } = calculateBedroomStats(regionProperties);
        const { athensAvgPerBedroom } = calculateAthensBedroomStats(allProperties);

        // Calculate price statistics
        const neighborhoodPrices = calculateNeighborhoodPriceStats(regionProperties);
        const regionAvg = calculateRegionPriceStats(regionProperties);
        const athensAvg = calculateAthensPriceStats(allProperties);

        // Calculate distributions
        const propertyTypeData = calculatePropertyTypeDistribution(regionProperties);
        const neighborhoodData = calculateNeighborhoodDistribution(regionProperties);

        // Calculate yearly price data and predictions
        const { priceDataRaw, pricePerMeterDataRaw } = calculateYearlyPriceData(allProperties, regionName);
        const priceData = predictPrices(priceDataRaw, 5);
        const pricePerMeterData = predictPrices(pricePerMeterDataRaw, 5);

        return {
          avgPrice: regionAvg.price,
          pricePerMeter: regionAvg.pricePerMeter,
          totalProperties: regionProperties.length,
          priceData,
          pricePerMeterData,
          properties: regionProperties,
          propertyTypeData,
          neighborhoodData,
          neighborhoodPrices,
          bedroomPricesByNeighborhood,
          regionAvg,
          athensAvg,
          regionAvgPerBedroom,
          athensAvgPerBedroom
        };
      } catch (error) {
        console.error('Error in useRegionStats:', error);
        throw error;
      }
    }
  });
};
