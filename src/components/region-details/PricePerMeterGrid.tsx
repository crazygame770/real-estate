
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";

interface NeighborhoodPrice {
  name: string;
  pricePerMeter: number;
}

interface PricePerMeterGridProps {
  neighborhoodPrices: NeighborhoodPrice[];
  regionAvg: {
    pricePerMeter: number;
  };
  athensAvg: {
    pricePerMeter: number;
  };
  color: string;
}

export const PricePerMeterGrid = ({ 
  neighborhoodPrices, 
  regionAvg, 
  athensAvg, 
  color 
}: PricePerMeterGridProps) => {
  const { t } = useLanguage();
  
  // Sort neighborhoods by price per meter from highest to lowest
  const sortedNeighborhoods = [...neighborhoodPrices].sort((a, b) => 
    b.pricePerMeter - a.pricePerMeter
  );
  
  // Calculate intensity based on price position in the range
  const getColorIntensity = (price: number, allPrices: number[]) => {
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const range = maxPrice - minPrice;
    
    // Calculate intensity (0 to 0.9 to avoid too dark colors)
    return range > 0 ? 0.3 + ((price - minPrice) / range) * 0.6 : 0.5;
  };
  
  const allPrices = neighborhoodPrices.map(item => item.pricePerMeter);
  
  return (
    <Card className="p-6 mb-8 bg-[#0C1021] text-white border-none">
      <h3 className="text-lg font-semibold mb-2 text-white">{t("Average Price per m²")}</h3>
      <p className="text-sm text-gray-400 mb-4">{t("Average price per square meter in each neighborhood")}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Map through neighborhoods */}
        {sortedNeighborhoods.map((item) => {
          const intensity = getColorIntensity(item.pricePerMeter, allPrices);
          const bgColor = `${color}${Math.round(intensity * 30)}`;
          
          return (
            <div 
              key={item.name}
              className="p-4 rounded-lg"
              style={{ backgroundColor: bgColor }}
            >
              <div className="text-sm text-gray-400 mb-1">{t(item.name)}</div>
              <div className="text-xl font-semibold">€{Math.round(item.pricePerMeter).toLocaleString()}/m²</div>
            </div>
          );
        })}
        
        {/* Region average */}
        <div 
          className="p-4 rounded-lg"
          style={{
            backgroundColor: `${color}20`,
            borderColor: color,
          }}
        >
          <div className="text-sm text-gray-400 mb-1">{t("Region Avg")}</div>
          <div className="text-xl font-semibold">€{Math.round(regionAvg.pricePerMeter).toLocaleString()}/m²</div>
        </div>
        
        {/* Athens average */}
        <div 
          className="p-4 rounded-lg"
          style={{
            backgroundColor: '#1e40af40',
          }}
        >
          <div className="text-sm text-gray-400 mb-1">{t("Athens Avg")}</div>
          <div className="text-xl font-semibold">€{Math.round(athensAvg.pricePerMeter).toLocaleString()}/m²</div>
        </div>
      </div>
      
      {/* Color legend */}
      <div className="mt-6">
        <Separator className="mb-4" />
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">{t("Lower price per m²")}</div>
          <div className="h-2 w-64 bg-gradient-to-r rounded-sm" style={{
            backgroundImage: `linear-gradient(to right, ${color}10, ${color})`
          }}></div>
          <div className="text-xs text-gray-400">{t("Higher price per m²")}</div>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          {t("The darker the color, the higher the price per square meter in the neighborhood")}
        </p>
      </div>
    </Card>
  );
};
