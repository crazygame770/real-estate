
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "./cards/StatCard";
import { useLanguage } from "@/contexts/LanguageContext";

const AnalyticsSummaryCards = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const { data: properties, error } = await supabase
        .from('properties')
        .select('price, historical_prices, area')
        .not('historical_prices', 'is', null);

      if (error) throw error;
      if (!properties || properties.length === 0) {
        return {
          avgPrice2025: 0,
          totalProperties: 0,
          lastYearGrowth: "0",
          marketGrowth: "0",
          avgPricePerMeter: 0
        };
      }

      // Calculate average price for 2025
      const validPrices2025 = properties.flatMap(property => {
        const history = property.historical_prices as Array<{ year: number; price: number }>;
        if (!Array.isArray(history)) return [];
        
        const yearData = history.find(h => h.year === 2025);
        return yearData ? [yearData.price] : [];
      }).filter(price => price > 0);

      const avgPrice2025 = validPrices2025.length > 0 
        ? Math.round(validPrices2025.reduce((acc, price) => acc + price, 0) / validPrices2025.length)
        : 0;

      // Calculate last year's growth (2024 to 2025)
      const yearlyGrowthRates = properties.reduce((acc, property) => {
        const history = property.historical_prices as Array<{ year: number; price: number }>;
        if (!Array.isArray(history)) return acc;

        // Sort by year to ensure correct order
        const sortedHistory = [...history].sort((a, b) => a.year - b.year);
        const growth2024To2025 = sortedHistory.reduce((gAcc, curr, idx, arr) => {
          if (idx === 0) return gAcc;
          const prev = arr[idx - 1];
          if (curr.year === 2025 && prev.year === 2024 && prev.price > 0) {
            gAcc.push((curr.price - prev.price) / prev.price);
          }
          return gAcc;
        }, [] as number[]);

        return [...acc, ...growth2024To2025];
      }, [] as number[]);

      const averageLastYearGrowth = yearlyGrowthRates.length > 0
        ? ((yearlyGrowthRates.reduce((a, b) => a + b, 0) / yearlyGrowthRates.length) * 100).toFixed(1)
        : "0";

      // Calculate average yearly growth across all consecutive years
      const allYearlyGrowthRates = properties.reduce((acc, property) => {
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

      const averageMarketGrowth = allYearlyGrowthRates.length > 0
        ? ((allYearlyGrowthRates.reduce((a, b) => a + b, 0) / allYearlyGrowthRates.length) * 100).toFixed(1)
        : "0";

      // Calculate average price per meter for 2025
      const validPricesPerMeter2025 = properties.flatMap(property => {
        const history = property.historical_prices as Array<{ year: number; price: number }>;
        if (!Array.isArray(history) || !property.area || property.area === 0) return [];
        
        const yearData = history.find(h => h.year === 2025);
        return yearData ? [yearData.price / property.area] : [];
      }).filter(price => price > 0);

      const avgPricePerMeter = validPricesPerMeter2025.length > 0
        ? Math.round(validPricesPerMeter2025.reduce((acc, price) => acc + price, 0) / validPricesPerMeter2025.length)
        : 0;

      // Log calculations for verification
      console.log('Analytics Calculations:', {
        avgPrice2025,
        lastYearGrowth: averageLastYearGrowth,
        marketGrowth: averageMarketGrowth,
        avgPricePerMeter,
        totalProperties: validPrices2025.length,
        yearlyGrowthRatesCount: yearlyGrowthRates.length,
        allYearlyGrowthRatesCount: allYearlyGrowthRates.length
      });

      return {
        avgPrice2025,
        totalProperties: validPrices2025.length,
        lastYearGrowth: averageLastYearGrowth,
        marketGrowth: averageMarketGrowth,
        avgPricePerMeter
      };
    }
  });

  const { t } = useLanguage();

  if (isLoading) {
    return <div>{t("Loading analytics...")}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        label={t("AVERAGE PROPERTY PRICE (2025)")} 
        value={`€${analyticsData?.avgPrice2025?.toLocaleString('de-DE') || '0'}`} 
        subtext={`+${analyticsData?.lastYearGrowth || '0'}% ${t("Last year")}`} 
      />
      <StatCard 
        label={t("TOTAL PROPERTIES")} 
        value={(analyticsData?.totalProperties || 0).toLocaleString('de-DE')} 
        subtext={t("Active listings")} 
      />
      <StatCard 
        label={t("MARKET GROWTH")} 
        value={`${analyticsData?.marketGrowth || '0'}%`} 
        subtext={t("Average yearly growth")} 
      />
      <StatCard 
        label={t("AVERAGE PRICE PER M² (2025)")} 
        value={`€${analyticsData?.avgPricePerMeter?.toLocaleString('de-DE') || '0'}`} 
        subtext={t("Per square meter")} 
      />
    </div>
  );
};

export default AnalyticsSummaryCards;
