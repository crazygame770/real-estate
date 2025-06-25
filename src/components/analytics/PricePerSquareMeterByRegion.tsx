
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/use-theme";
import { Separator } from "@/components/ui/separator";
import { LoadingMatrix } from "./matrix/LoadingMatrix";
import { ErrorMatrix } from "./matrix/ErrorMatrix";
import { useRegionPricePerMeterData } from "@/hooks/useRegionPricePerMeterData";
import { formatPrice, getRegionDisplayName } from "@/utils/regionUtils";

const PricePerSquareMeterByRegion = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { data: regionPricePerMeterData, isLoading, error, refetch } = useRegionPricePerMeterData();

  const getColor = (price: number, minPrice: number, maxPrice: number) => {
    const range = maxPrice - minPrice;
    
    // Calculate intensity based on price position in the range
    const intensity = range > 0 ? (price - minPrice) / range : 0.5;
    
    // Use different color palettes for light and dark mode
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
    const darkBackgrounds = ["#b71c1c", "#d32f2f", "#f44336", "#d32f2f"];
    const isLightBackground = isDark
      ? ["#e57373"].includes(bgColor)
      : ["#ffebee", "#ffcdd2", "#ef9a9a"].includes(bgColor);
      
    return isLightBackground ? "text-foreground" : "text-white";
  };

  if (isLoading) {
    return <LoadingMatrix title={t("Price per Square Meter by Region")} />;
  }

  if (error) {
    return <ErrorMatrix title={t("Price per Square Meter by Region")} error={error} onRetry={() => refetch()} />;
  }

  // Ensure we have valid data
  if (!regionPricePerMeterData || regionPricePerMeterData.length === 0) {
    return (
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold text-foreground">
          {t("Price per Square Meter by Region")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("No price per square meter data available")}
        </p>
      </Card>
    );
  }

  // Filter out athens-average for display in the grid
  const regionEntries = regionPricePerMeterData.filter(item => item.region !== 'athens-average');
  
  // Find the Athens average entry - this is now consistently calculated in useRegionPricePerMeterData
  const athensAvg = regionPricePerMeterData.find(item => item.region === 'athens-average');

  // Sort regions by price per meter from highest to lowest
  const sortedRegions = [...regionEntries].sort((a, b) => b.avgPricePerMeter - a.avgPricePerMeter);

  // Calculate min and max prices for color scaling
  const minPrice = Math.min(...regionEntries.map(item => item.avgPricePerMeter));
  const maxPrice = Math.max(...regionEntries.map(item => item.avgPricePerMeter));

  return (
    <Card className="p-6 mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t("Price per Square Meter by Region")}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t("Average price per square meter across different regions of Athens")}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {sortedRegions.map((region) => {
          const color = getColor(region.avgPricePerMeter, minPrice, maxPrice);
          return (
            <div
              key={region.region}
              className="relative p-4 rounded-lg transition-colors duration-200 hover:opacity-90"
              style={{
                backgroundColor: color,
              }}
            >
              <div className="space-y-2">
                <h4 className={`font-medium text-sm ${getTextColor(color)}`}>
                  {getRegionDisplayName(region.region, t)}
                </h4>
                <p className={`text-lg font-bold ${getTextColor(color)}`}>
                  {formatPrice(region.avgPricePerMeter)}/m²
                </p>
                <p className={`text-xs ${getTextColor(color)}`}>
                  {t("Properties")}: {region.count}
                </p>
              </div>
            </div>
          );
        })}
        
        {/* Athens Average Card */}
        {athensAvg && (
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
                {formatPrice(athensAvg.avgPricePerMeter)}/m²
              </p>
              <p className="text-xs text-muted-foreground">
                {t("All regions")}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Separator className="mb-4" />
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {t("Lower price per m²")}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-14 h-2 bg-gradient-to-r from-[#ffebee] to-[#d32f2f] rounded-sm" />
          </div>
          <div className="text-xs text-muted-foreground">
            {t("Higher price per m²")}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {t("The darker the color, the higher the price per square meter in the region")}
        </p>
      </div>
    </Card>
  );
};

export default PricePerSquareMeterByRegion;
