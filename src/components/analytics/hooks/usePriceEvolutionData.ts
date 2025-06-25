
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { predictPrices } from "@/utils/pricePrediction";

export const usePriceEvolutionData = () => {
  return useQuery({
    queryKey: ['price-evolution'],
    queryFn: async () => {
      // Fetch property data with historical prices
      const { data: properties, error } = await supabase
        .from('properties')
        .select('price, historical_prices, area')
        .not('historical_prices', 'is', null);

      if (error) throw error;

      console.log("Fetched properties with historical data:", properties?.length);
      
      // Define the years range we want to analyze
      const years = Array.from({ length: 10 }, (_, i) => 2016 + i);
      
      // Calculate average prices per year
      const priceDataRaw = years.map(year => {
        // Extract all valid prices for this year
        const validPrices = properties?.flatMap(property => {
          const history = property.historical_prices as Array<{ year: number; price: number }>;
          if (!Array.isArray(history)) return [];
          
          const yearData = history.find(h => h.year === year);
          return yearData ? [yearData.price] : [];
        }).filter(price => price > 0);

        // Calculate average price for this year
        const value = validPrices.length > 0
          ? Math.round(validPrices.reduce((acc, price) => acc + price, 0) / validPrices.length)
          : 0;

        return { year, value };
      }).filter(item => item.value > 0); // Only include years with actual data
      
      // Calculate price per meter data
      const pricePerMeterDataRaw = years.map(year => {
        // Extract all valid price per meter values for this year
        const validPricesPerMeter = properties?.flatMap(property => {
          const history = property.historical_prices as Array<{ year: number; price: number }>;
          if (!Array.isArray(history) || !property.area) return [];
          
          const yearData = history.find(h => h.year === year);
          return yearData && property.area ? [yearData.price / property.area] : [];
        }).filter(price => price > 0);

        // Calculate average price per meter for this year
        const value = validPricesPerMeter.length > 0
          ? Math.round(validPricesPerMeter.reduce((acc, price) => acc + price, 0) / validPricesPerMeter.length)
          : 0;

        return { year, value };
      }).filter(item => item.value > 0); // Only include years with actual data

      console.log("Raw price data before prediction:", priceDataRaw);
      console.log("Raw price per meter data before prediction:", pricePerMeterDataRaw);
      
      // Apply ML prediction for the next 5 years
      const priceData = predictPrices(priceDataRaw, 5);
      const pricePerMeterData = predictPrices(pricePerMeterDataRaw, 5);
      
      console.log("Price data with predictions:", priceData);
      console.log("Price per meter data with predictions:", pricePerMeterData);

      // Calculate average yearly growth across all consecutive years
      const allYearlyGrowthRates = properties?.reduce((acc, property) => {
        const history = property.historical_prices as Array<{ year: number; price: number }>;
        if (!Array.isArray(history) || history.length < 2) return acc;

        const sortedHistory = [...history].sort((a, b) => a.year - b.year);
        const propertyGrowthRates = sortedHistory.reduce((gAcc, curr, idx, arr) => {
          if (idx === 0) return gAcc;
          const prev = arr[idx - 1];
          if (prev.price > 0) {
            gAcc.push((curr.price - prev.price) / prev.price);
          }
          return gAcc;
        }, [] as number[]);

        return [...acc, ...propertyGrowthRates];
      }, [] as number[]);

      console.log("All yearly growth rates count:", allYearlyGrowthRates?.length);

      const averageMarketGrowth = allYearlyGrowthRates?.length > 0
        ? ((allYearlyGrowthRates.reduce((a, b) => a + b, 0) / allYearlyGrowthRates.length) * 100).toFixed(1)
        : "0";

      // Log analytics calculations for debugging
      console.log("Analytics Calculations:", {
        avgPrice2025: priceData.find(d => d.year === 2025)?.value || 0,
        lastYearGrowth: averageMarketGrowth,
        marketGrowth: averageMarketGrowth,
        avgPricePerMeter: pricePerMeterData.find(d => d.year === 2023)?.value || 0,
        totalProperties: properties?.length || 0,
        yearlyGrowthRatesCount: allYearlyGrowthRates?.length || 0,
        allYearlyGrowthRatesCount: properties?.reduce((acc, p) => {
          const history = p.historical_prices as Array<{ year: number; price: number }>;
          return acc + (Array.isArray(history) ? history.length : 0);
        }, 0) || 0
      });

      return {
        priceData,
        pricePerMeterData,
        marketGrowth: averageMarketGrowth
      };
    }
  });
};
