
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface NeighborhoodPriceData {
  name: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  pricePerMeter: number;
  minPricePerMeter: number;
  maxPricePerMeter: number;
}

interface NeighborhoodPriceTablesProps {
  neighborhoodData: NeighborhoodPriceData[];
  regionAvg: {
    price: number;
    pricePerMeter: number;
    minPrice: number;
    maxPrice: number;
    minPricePerMeter: number;
    maxPricePerMeter: number;
  };
  athensAvg: {
    price: number;
    pricePerMeter: number;
    minPrice: number;
    maxPrice: number;
    minPricePerMeter: number;
    maxPricePerMeter: number;
  };
  color: string;
}

export const NeighborhoodPriceTables = ({
  neighborhoodData,
  regionAvg,
  athensAvg,
  color
}: NeighborhoodPriceTablesProps) => {
  const { t } = useLanguage();
  
  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return "-";
    return `€${Math.round(price).toLocaleString('de-DE')}`;
  };

  // Sort neighborhoods by price from highest to lowest
  const sortedNeighborhoods = [...neighborhoodData].sort((a, b) => 
    b.avgPrice - a.avgPrice
  );
  
  // Sort neighborhoods by price per meter from highest to lowest
  const sortedByPricePerMeter = [...neighborhoodData].sort((a, b) => 
    b.pricePerMeter - a.pricePerMeter
  );
  
  // Calculate intensity based on price position in the range
  const getColorIntensity = (price: number, prices: number[]) => {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;
    
    // Calculate intensity (0 to 0.7 to avoid too dark colors)
    return range > 0 ? 0.2 + ((price - minPrice) / range) * 0.5 : 0.4;
  };
  
  // Get all price values for intensity calculation
  const allPrices = neighborhoodData.map(n => n.avgPrice);
  const allPricesPerMeter = neighborhoodData.map(n => n.pricePerMeter);
  
  return (
    <>
      {/* Property Price Table */}
      <Card className="p-6 mb-8 bg-[#0C1021] text-white border-none">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-white">{t("Neighborhood Property Price Analysis")}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-4 text-gray-400">{t("Neighborhood")}</th>
                <th className="text-right py-2 px-4 text-gray-400">{t("Min Price (€)")}</th>
                <th className="text-right py-2 px-4 text-gray-400">{t("Avg Price (€)")}</th>
                <th className="text-right py-2 px-4 text-gray-400">{t("Max Price (€)")}</th>
              </tr>
            </thead>
            <tbody>
              {sortedNeighborhoods.map((neighborhood, index) => {
                const intensity = getColorIntensity(neighborhood.avgPrice, allPrices);
                const bgColor = `${color}${Math.round(intensity * 30)}`;
                
                return (
                  <tr 
                    key={neighborhood.name} 
                    className="border-b border-gray-700/50 hover:bg-gray-800/30"
                    style={{ backgroundColor: bgColor }}
                  >
                    <td className="py-2 px-4 flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-white">{t(neighborhood.name)}</span>
                    </td>
                    <td className="text-right py-2 px-4 text-white">{formatPrice(neighborhood.minPrice)}</td>
                    <td className="text-right py-2 px-4 text-white font-medium">{formatPrice(neighborhood.avgPrice)}</td>
                    <td className="text-right py-2 px-4 text-white">{formatPrice(neighborhood.maxPrice)}</td>
                  </tr>
                );
              })}
              <tr 
                className="border-b border-gray-700/50"
                style={{ backgroundColor: `${color}20` }}
              >
                <td className="py-2 px-4 flex items-center gap-3 font-semibold">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: color
                    }}
                  />
                  <span className="text-white">{t("Region Average")}</span>
                </td>
                <td className="text-right py-2 px-4 font-semibold text-white">{formatPrice(regionAvg.minPrice)}</td>
                <td className="text-right py-2 px-4 font-semibold text-white">{formatPrice(regionAvg.price)}</td>
                <td className="text-right py-2 px-4 font-semibold text-white">{formatPrice(regionAvg.maxPrice)}</td>
              </tr>
              <tr 
                className="border-b border-gray-700/50"
                style={{ backgroundColor: '#1e40af40' }}
              >
                <td className="py-2 px-4 flex items-center gap-3 font-semibold">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: '#1e40af'
                    }}
                  />
                  <span className="text-white">{t("Athens Average")}</span>
                </td>
                <td className="text-right py-2 px-4 font-semibold text-white">{formatPrice(athensAvg.minPrice)}</td>
                <td className="text-right py-2 px-4 font-semibold text-white">{formatPrice(athensAvg.price)}</td>
                <td className="text-right py-2 px-4 font-semibold text-white">{formatPrice(athensAvg.maxPrice)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Color legend */}
        <div className="mt-6">
          <Separator className="mb-4" />
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400">{t("Lower price")}</div>
            <div className="h-2 w-64 bg-gradient-to-r rounded-sm" style={{
              backgroundImage: `linear-gradient(to right, ${color}10, ${color})`
            }}></div>
            <div className="text-xs text-gray-400">{t("Higher price")}</div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {t("The darker the color, the higher the price in the neighborhood")}
          </p>
        </div>
      </Card>

      {/* Price Per Square Meter Table */}
      <Card className="p-6 mb-8 bg-[#0C1021] text-white border-none">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-white">{t("Neighborhood Price per m² Analysis")}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-4 text-gray-400">{t("Neighborhood")}</th>
                <th className="text-right py-2 px-4 text-gray-400">{t("Min €/m²")}</th>
                <th className="text-right py-2 px-4 text-gray-400">{t("Avg €/m²")}</th>
                <th className="text-right py-2 px-4 text-gray-400">{t("Max €/m²")}</th>
              </tr>
            </thead>
            <tbody>
              {sortedByPricePerMeter.map((neighborhood, index) => {
                const intensity = getColorIntensity(neighborhood.pricePerMeter, allPricesPerMeter);
                const bgColor = `${color}${Math.round(intensity * 30)}`;
                
                return (
                  <tr 
                    key={`m2-${neighborhood.name}`} 
                    className="border-b border-gray-700/50 hover:bg-gray-800/30"
                    style={{ backgroundColor: bgColor }}
                  >
                    <td className="py-2 px-4 flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-white">{t(neighborhood.name)}</span>
                    </td>
                    <td className="text-right py-2 px-4 text-white">{formatPrice(neighborhood.minPricePerMeter)}</td>
                    <td className="text-right py-2 px-4 text-white font-medium">{formatPrice(neighborhood.pricePerMeter)}</td>
                    <td className="text-right py-2 px-4 text-white">{formatPrice(neighborhood.maxPricePerMeter)}</td>
                  </tr>
                );
              })}
              <tr 
                className="border-b border-gray-700/50"
                style={{ backgroundColor: `${color}20` }}
              >
                <td className="py-2 px-4 flex items-center gap-3 font-semibold">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: color
                    }}
                  />
                  <span className="text-white">{t("Region Average")}</span>
                </td>
                <td className="text-right py-2 px-4 font-semibold text-white">{formatPrice(regionAvg.minPricePerMeter)}</td>
                <td className="text-right py-2 px-4 font-semibold text-white">{formatPrice(regionAvg.pricePerMeter)}</td>
                <td className="text-right py-2 px-4 font-semibold text-white">{formatPrice(regionAvg.maxPricePerMeter)}</td>
              </tr>
              <tr 
                className="border-b border-gray-700/50"
                style={{ backgroundColor: '#1e40af40' }}
              >
                <td className="py-2 px-4 flex items-center gap-3 font-semibold">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: '#1e40af'
                    }}
                  />
                  <span className="text-white">{t("Athens Average")}</span>
                </td>
                <td className="text-right py-2 px-4 font-semibold text-white">{formatPrice(athensAvg.minPricePerMeter)}</td>
                <td className="text-right py-2 px-4 font-semibold text-white">{formatPrice(athensAvg.pricePerMeter)}</td>
                <td className="text-right py-2 px-4 font-semibold text-white">{formatPrice(athensAvg.maxPricePerMeter)}</td>
              </tr>
            </tbody>
          </table>
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
    </>
  );
};
