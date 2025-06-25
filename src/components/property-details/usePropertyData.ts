
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePropertyData = (id: string) => {
  const [neighborhoodScores, setNeighborhoodScores] = useState<any>(null);

  const { data: property, isLoading, refetch } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select(`
          *,
          historical_prices
        `)
        .eq('id', id)
        .single();

      if (propertyError) throw propertyError;
      
      console.log("Property Data from DB:", propertyData);

      const { data: averagesData, error: averagesError } = await supabase
        .rpc('get_property_averages', { property_id: id });

      if (averagesError) throw averagesError;

      // Fetch neighborhood scores
      const { data: neighborhoodData, error: neighborhoodError } = await supabase
        .from('neighborhoods')
        .select('*')
        .eq('name', propertyData.neighborhood)
        .single();

      if (neighborhoodError) {
        console.error('Error fetching neighborhood data:', neighborhoodError);
      } else {
        setNeighborhoodScores({
          walkability: neighborhoodData.walkability,
          safety: neighborhoodData.safety,
          education: neighborhoodData.education,
          entertainment: neighborhoodData.entertainment,
          retail: neighborhoodData.retail,
          green_spaces: neighborhoodData.green_spaces
        });
      }

      const historicalPrices = propertyData.historical_prices || [];
      const enrichedHistoricalPrices = historicalPrices.map((item: any) => ({
        ...item,
        marketAvg: averagesData[0].market_avg,
        neighborhoodAvg: averagesData[0].neighborhood_avg
      }));

      return {
        ...propertyData,
        historical_prices: enrichedHistoricalPrices
      };
    }
  });

  return { property, isLoading, refetch, neighborhoodScores };
};
