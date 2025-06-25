
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  centralAthensData,
  piraeusCoastData,
  northAtticaData,
  eastAtticaData,
  westAtticaData,
  southAthensData,
  northeastAthensData
} from "@/utils/regionData";
import RegionPropertyDistribution from "./charts/RegionPropertyDistribution";
import RegionStats from "./RegionStats";
import NeighborhoodTags from "./NeighborhoodTags";
import { getRegionDbId } from "@/utils/regionMapping";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/use-theme";

const RegionsOverview = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const { data: neighborhoodStats } = useQuery({
    queryKey: ['neighborhoodStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: propertyCounts } = useQuery({
    queryKey: ['propertyCounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_region_property_counts');
      
      if (error) throw error;
      return data;
    }
  });

  // Use the useQuery hook to get property data for price calculations
  const { data: properties } = useQuery({
    queryKey: ['properties-for-overview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('price, area, region, historical_prices');
      
      if (error) throw error;
      return data;
    }
  });

  // Calculate metrics
  const calculateMetrics = (regionId: string) => {
    if (!properties) return { yoyGrowth: null, avgYearlyGrowth: null, pricePerMeter: null };
    
    const dbRegionId = getRegionDbId(regionId);
    const regionProperties = properties.filter(p => p.region === dbRegionId);
    
    if (regionProperties.length === 0) return { yoyGrowth: null, avgYearlyGrowth: null, pricePerMeter: null };

    let sum2024 = 0;
    let sum2023 = 0;
    let count2024 = 0;
    let count2023 = 0;
    let totalArea = 0;
    let allGrowthRates: number[] = [];

    regionProperties.forEach(property => {
      const historicalPrices = property.historical_prices as Array<{ year: number; price: number }>;
      if (!historicalPrices) return;

      const price2024 = historicalPrices.find(h => h.year === 2024)?.price;
      const price2023 = historicalPrices.find(h => h.year === 2023)?.price;

      if (price2024) {
        sum2024 += price2024;
        count2024++;
        totalArea += property.area || 0;
      }
      if (price2023) {
        sum2023 += price2023;
        count2023++;
      }

      const sortedPrices = [...historicalPrices].sort((a, b) => a.year - b.year);
      for (let i = 1; i < sortedPrices.length; i++) {
        const prevPrice = sortedPrices[i - 1].price;
        const currentPrice = sortedPrices[i].price;
        if (prevPrice > 0) {
          const growthRate = (currentPrice - prevPrice) / prevPrice;
          allGrowthRates.push(growthRate);
        }
      }
    });

    const avg2024 = count2024 > 0 ? sum2024 / count2024 : 0;
    const avg2023 = count2023 > 0 ? sum2023 / count2023 : 0;
    const yoyGrowth = avg2023 > 0 ? ((avg2024 - avg2023) / avg2023) * 100 : null;
    const avgYearlyGrowth = allGrowthRates.length > 0 
      ? (allGrowthRates.reduce((a, b) => a + b, 0) / allGrowthRates.length) * 100 
      : null;
    const pricePerMeter = totalArea > 0 ? sum2024 / totalArea : null;

    return {
      yoyGrowth: yoyGrowth?.toFixed(1),
      avgYearlyGrowth: avgYearlyGrowth?.toFixed(1),
      pricePerMeter: pricePerMeter ? Math.round(pricePerMeter) : null
    };
  };

  // Get the actual average price for a region from the properties data
  const getAveragePrice = (regionId: string) => {
    if (!properties) return null;
    
    const dbRegionId = getRegionDbId(regionId);
    const regionProperties = properties.filter(p => p.region === dbRegionId && p.price && p.price > 0);
    
    if (regionProperties.length === 0) return null;
    
    const totalPrice = regionProperties.reduce((sum, property) => sum + property.price, 0);
    return totalPrice / regionProperties.length;
  }

  // Get the actual price per meter for a region from the properties data
  const getPricePerMeter = (regionId: string) => {
    if (!properties) return null;
    
    const dbRegionId = getRegionDbId(regionId);
    const regionProperties = properties.filter(
      p => p.region === dbRegionId && p.price && p.price > 0 && p.area && p.area > 0
    );
    
    if (regionProperties.length === 0) return null;
    
    const prices = regionProperties.map(p => p.price / p.area);
    return prices.reduce((sum, price) => sum + price, 0) / prices.length;
  }

  const getPropertyCounts = (regionId: string) => {
    const dbRegionId = getRegionDbId(regionId);
    const counts = propertyCounts?.find(count => count.region_id === dbRegionId);
    if (!counts) return { apartments: 0, houses: 0, apartmentsPercent: '0%', housesPercent: '0%' };

    const total = counts.apartment_count + counts.house_count;
    const apartmentsPercent = total > 0 ? Math.round((counts.apartment_count / total) * 100) : 0;
    const housesPercent = total > 0 ? Math.round((counts.house_count / total) * 100) : 0;

    return {
      apartments: counts.apartment_count,
      houses: counts.house_count,
      apartmentsPercent: `${apartmentsPercent}%`,
      housesPercent: `${housesPercent}%`
    };
  };

  const getNeighborhoodCount = (regionId: string) => {
    const stats = getRegionStats(regionId);
    return stats ? stats.length : 0;
  };

  const getRegionStats = (regionId: string) => {
    if (!neighborhoodStats) return null;
    return neighborhoodStats.filter(n => n.region_id === regionId);
  };

  const regions = [
    centralAthensData,
    piraeusCoastData,
    northAtticaData,
    eastAtticaData,
    westAtticaData,
    southAthensData,
    northeastAthensData
  ];

  return (
    <div className="mt-12">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">{t("Athens Regions Overview")}</h2>
        <p className="text-muted-foreground mt-1">{t("Comprehensive breakdown of all regions and their key metrics")}</p>
      </div>

      <div className="space-y-4">
        {regions.map((region) => {
          const counts = getPropertyCounts(region.id);
          const neighborhoodCount = getNeighborhoodCount(region.id);
          const metrics = calculateMetrics(region.id);
          
          // Get real average prices from database
          const avgPrice = getAveragePrice(region.id);
          const pricePerMeter = getPricePerMeter(region.id);
          
          return (
            <div 
              key={region.id} 
              className={`
                rounded-lg p-6 transition-all duration-500 ease-in-out
                ${isDark 
                  ? 'bg-[#131B2C]' 
                  : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                }
              `}
              style={{ '--region-color': region.color } as React.CSSProperties}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.backgroundColor = `${region.color}${isDark ? '25' : '10'}`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.backgroundColor = isDark ? '#131B2C' : 'white';
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: region.color }} 
                    />
                    <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t(region.name)}
                    </h3>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    {neighborhoodCount} {t("neighborhoods")}
                  </p>
                </div>
                <Button 
                  onClick={() => navigate(`/region/${region.id}`)}
                  className={`
                    text-white 
                    ${isDark ? '' : 'bg-gray-900 hover:bg-gray-800'}
                  `}
                  style={{ backgroundColor: region.color }}
                >
                  {t("VIEW DETAILS")}
                </Button>
              </div>

              <div className="grid grid-cols-5 gap-8">
                <RegionPropertyDistribution
                  houses={counts.houses}
                  apartments={counts.apartments}
                  color={region.color}
                />
                <RegionStats
                  // Use real data from the database for average price and price per meter
                  avgPrice={`€${avgPrice ? Math.round(avgPrice).toLocaleString() : '0'}`}
                  pricePerMeter={`€${pricePerMeter ? Math.round(pricePerMeter).toLocaleString() : '0'}`}
                  yoyGrowth={metrics.yoyGrowth}
                  avgYearlyGrowth={metrics.avgYearlyGrowth}
                  apartments={counts.apartments}
                  houses={counts.houses}
                  apartmentsPercent={counts.apartmentsPercent}
                  housesPercent={counts.housesPercent}
                />
              </div>

              <NeighborhoodTags
                neighborhoods={getRegionStats(region.id) || []}
                color={region.color}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegionsOverview;
