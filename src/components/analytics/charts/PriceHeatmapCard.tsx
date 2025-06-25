
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/utils/regionUtils';
import { getRegionDisplayName } from '@/utils/regionUtils';

interface RegionPriceData {
  region: string;
  pricePerBedroom: number;
  totalProperties: number;
}

export const PriceHeatmapCard = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const { data: heatmapData, isLoading } = useQuery({
    queryKey: ['region-price-heatmap'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('region, price, bedrooms')
        .not('region', 'is', null)
        .not('price', 'is', null)
        .not('bedrooms', 'is', null)
        .gt('price', 0)
        .gt('bedrooms', 0);

      if (error) throw error;

      // Filter out invalid data first
      const validProperties = data.filter(p => 
        p.region && p.price > 0 && p.bedrooms > 0
      );

      // Calculate Athens average price per bedroom with a consistent method
      const allPricesPerBedroom = validProperties.map(p => p.price / p.bedrooms);
      const athensAvgPricePerBedroom = allPricesPerBedroom.length > 0 
        ? allPricesPerBedroom.reduce((a, b) => a + b, 0) / allPricesPerBedroom.length
        : 0;

      // Process the data to calculate average price per bedroom by region
      const regionData = validProperties.reduce((acc: { [key: string]: { total: number, count: number } }, property) => {
        const region = property.region;
        if (!acc[region]) {
          acc[region] = { total: 0, count: 0 };
        }
        acc[region].total += property.price / property.bedrooms;
        acc[region].count += 1;
        return acc;
      }, {});

      // Convert to array and calculate averages
      const formattedData: RegionPriceData[] = Object.entries(regionData)
        .map(([region, { total, count }]) => ({
          region,
          pricePerBedroom: Math.round(total / count),
          totalProperties: count
        }))
        .sort((a, b) => b.pricePerBedroom - a.pricePerBedroom); // Sort by price, most expensive first

      return { 
        regions: formattedData, 
        athensAvgPricePerBedroom: Math.round(athensAvgPricePerBedroom)
      };
    }
  });

  const getColor = (value: number) => {
    if (!heatmapData?.regions) return "#ffebee";
    
    const maxPrice = Math.max(...heatmapData.regions.map(r => r.pricePerBedroom));
    const minPrice = Math.min(...heatmapData.regions.map(r => r.pricePerBedroom));
    const range = maxPrice - minPrice;
    
    // Calculate intensity based on price position in the range
    const intensity = range > 0 ? (value - minPrice) / range : 0.5;

    // More expensive = darker/more intense color
    if (isDark) {
      // Dark mode colors from least to most expensive (light to dark red)
      if (intensity < 0.2) return "#e57373";
      if (intensity < 0.4) return "#ef5350";
      if (intensity < 0.6) return "#f44336";
      if (intensity < 0.8) return "#d32f2f";
      return "#b71c1c";
    } else {
      // Light mode colors from least to most expensive (light to dark red)
      if (intensity < 0.2) return "#ffebee";
      if (intensity < 0.4) return "#ffcdd2";
      if (intensity < 0.6) return "#ef9a9a";
      if (intensity < 0.8) return "#e57373";
      return "#d32f2f";
    }
  };

  const getTextColor = (bgColor: string) => {
    // Simple heuristic: use white text on darker backgrounds, black on lighter ones
    const darkBackgrounds = ["#b71c1c", "#d32f2f", "#f44336"];
    const isLightBackground = isDark
      ? ["#e57373"].includes(bgColor)
      : ["#ffebee", "#ffcdd2", "#ef9a9a"].includes(bgColor);
      
    return isLightBackground ? "text-foreground" : "text-white";
  };

  if (isLoading) {
    return (
      <Card className="p-6 mb-8">
        <div className="h-[500px] flex items-center justify-center">
          <div className="animate-pulse h-8 w-8 rounded-full bg-primary/50"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t("Price per Bedroom by Region")}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t("Average price per bedroom across different regions of Athens")}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {heatmapData?.regions.map((region) => (
          <div
            key={region.region}
            className="relative p-4 rounded-lg transition-colors duration-200 hover:opacity-90"
            style={{
              backgroundColor: getColor(region.pricePerBedroom),
            }}
          >
            <div className="space-y-2">
              <h4 className={`font-medium text-sm ${getTextColor(getColor(region.pricePerBedroom))}`}>
                {getRegionDisplayName(region.region, t)}
              </h4>
              <p className={`text-lg font-bold ${getTextColor(getColor(region.pricePerBedroom))}`}>
                {formatPrice(region.pricePerBedroom)}
              </p>
              <p className={`text-xs ${getTextColor(getColor(region.pricePerBedroom))}`}>
                {t("Properties")}: {region.totalProperties}
              </p>
            </div>
          </div>
        ))}
        
        {/* Athens Average Card */}
        <div
          className="relative p-4 rounded-lg border-2 border-blue-500 transition-colors duration-200"
          style={{
            backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
          }}
        >
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-foreground">
              {t("ATHENS AVERAGE")}
            </h4>
            <p className="text-lg font-bold text-foreground">
              {formatPrice(heatmapData?.athensAvgPricePerBedroom || 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("All regions")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Separator className="mb-4" />
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {t("Lower price")}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-14 h-2 bg-gradient-to-r from-[#ffebee] to-[#d32f2f] rounded-sm" />
          </div>
          <div className="text-xs text-muted-foreground">
            {t("Higher price")}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {t("The darker the color, the higher the price per bedroom in the region")}
        </p>
      </div>
    </Card>
  );
};
