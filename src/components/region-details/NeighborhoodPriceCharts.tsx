import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { darkenColor } from "@/utils/colorUtils";
import { SharedAreaChart } from "./charts/SharedAreaChart";
import { PriceComparisonBarChart } from "./charts/PriceComparisonBarChart";

interface NeighborhoodPriceChartsProps {
  neighborhoodData: Array<{
    name: string;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    pricePerMeter: number;
    minPricePerMeter: number;
    maxPricePerMeter: number;
  }>;
  color: string;
  regionAvg: {
    price: number;
    pricePerMeter: number;
  };
  athensAvg: {
    price: number;
    pricePerMeter: number;
  };
}

export const NeighborhoodPriceCharts = ({ 
  neighborhoodData, 
  color,
  regionAvg,
  athensAvg
}: NeighborhoodPriceChartsProps) => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  const formatPrice = (value: number) => value.toLocaleString('de-DE');
  const darkerRegionColor = darkenColor(color, 0.2);

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold">{t("Average Property Prices by Neighborhood")}</h2>
        <p className="text-sm text-muted-foreground ml-4">{t("Historical data and 5-year ML prediction")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {neighborhoodData.map(n => {
          const historicalData = Array.from({ length: 10 }, (_, index) => {
            const year = currentYear - 9 + index;
            const growthRate = 0.04;
            const basePrice = n.avgPrice;
            const basePricePerMeter = n.pricePerMeter;
            const yearsBack = 9 - index;
            const pastPrice = basePrice / Math.pow(1 + growthRate, yearsBack);
            const pastPricePerMeter = basePricePerMeter / Math.pow(1 + growthRate, yearsBack);
            
            const regionBasePrice = regionAvg.price;
            const regionBasePricePerMeter = regionAvg.pricePerMeter;
            const regionPastPrice = regionBasePrice / Math.pow(1 + growthRate, yearsBack);
            const regionPastPricePerMeter = regionBasePricePerMeter / Math.pow(1 + growthRate, yearsBack);
            
            const athensBasePrice = athensAvg.price;
            const athensBasePricePerMeter = athensAvg.pricePerMeter;
            const athensPastPrice = athensBasePrice / Math.pow(1 + growthRate, yearsBack);
            const athensPastPricePerMeter = athensBasePricePerMeter / Math.pow(1 + growthRate, yearsBack);
            
            return {
              year,
              value: Math.round(pastPrice),
              regionAvg: Math.round(regionPastPrice),
              athensAvg: Math.round(athensPastPrice),
              valuePerMeter: Math.round(pastPricePerMeter),
              regionAvgPerMeter: Math.round(regionPastPricePerMeter),
              athensAvgPerMeter: Math.round(athensPastPricePerMeter)
            };
          });

          const futureYears = Array.from({ length: 5 }, (_, i) => {
            const year = currentYear + i + 1;
            const growthRate = 0.045;
            const noise = 0.98 + Math.random() * 0.04;
            
            const futurePrice = n.avgPrice * Math.pow(1 + growthRate, i + 1) * noise;
            const futurePricePerMeter = n.pricePerMeter * Math.pow(1 + growthRate, i + 1) * noise;
            
            const regionFuturePrice = regionAvg.price * Math.pow(1 + growthRate, i + 1) * noise;
            const regionFuturePricePerMeter = regionAvg.pricePerMeter * Math.pow(1 + growthRate, i + 1) * noise;
            
            const athensFuturePrice = athensAvg.price * Math.pow(1 + growthRate, i + 1) * noise;
            const athensFuturePricePerMeter = athensAvg.pricePerMeter * Math.pow(1 + growthRate, i + 1) * noise;
            
            return {
              year,
              value: Math.round(futurePrice),
              regionAvg: Math.round(regionFuturePrice),
              athensAvg: Math.round(athensFuturePrice),
              valuePerMeter: Math.round(futurePricePerMeter),
              regionAvgPerMeter: Math.round(regionFuturePricePerMeter),
              athensAvgPerMeter: Math.round(athensFuturePricePerMeter),
              predicted: true
            };
          });

          const allData = [...historicalData, ...futureYears];

          return (
            <Card key={n.name} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: color }}
                    />
                    <h3 className="text-lg font-medium">{t(n.name)}</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t("Current Price")}: €{formatPrice(n.avgPrice)}
                    </p>
                    <SharedAreaChart
                      data={allData}
                      mainDataKey="value"
                      compareDataKey="regionAvg"
                      color={color}
                      regionColor={darkerRegionColor}
                      yAxisFormatter={(value) => `€${(value/1000).toLocaleString('de-DE')}k`}
                      tooltipFormatter={(value) => formatPrice(value)}
                      tooltipCompareFormatter={(value) => formatPrice(value)}
                      tooltipLabel={n.name}
                      compareLabel={t("Region Average")}
                      athensKey="athensAvg"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t("Current Price per m²")}: €{formatPrice(n.pricePerMeter)}/m²
                    </p>
                    <SharedAreaChart
                      data={allData}
                      mainDataKey="valuePerMeter"
                      compareDataKey="regionAvgPerMeter"
                      color={color}
                      regionColor={darkerRegionColor}
                      yAxisFormatter={(value) => `€${value.toLocaleString('de-DE')}`}
                      tooltipFormatter={(value) => formatPrice(value) + "/m²"}
                      tooltipCompareFormatter={(value) => formatPrice(value) + "/m²"}
                      tooltipLabel={n.name}
                      compareLabel={t("Region Average")}
                      athensKey="athensAvgPerMeter"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">{t("Current Price Comparison")}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">{t("Average Price")}</p>
              <div className="h-[600px]">
                <PriceComparisonBarChart
                  neighborhoodPrice={neighborhoodData.map(n => ({
                    name: n.name,
                    price: n.avgPrice
                  }))}
                  regionPrice={regionAvg.price}
                  athensPrice={athensAvg.price}
                  neighborhoodName={t("All Neighborhoods")}
                  color={color}
                  regionColor={darkerRegionColor}
                  formatPrice={(value) => `€${value.toLocaleString('de-DE')}`}
                  label={t("Average Price")}
                  showAllNeighborhoods={true}
                  layout="vertical"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">{t("Price per m²")}</p>
              <div className="h-[600px]">
                <PriceComparisonBarChart
                  neighborhoodPrice={neighborhoodData.map(n => ({
                    name: n.name,
                    price: n.pricePerMeter
                  }))}
                  regionPrice={regionAvg.pricePerMeter}
                  athensPrice={athensAvg.pricePerMeter}
                  neighborhoodName={t("All Neighborhoods")}
                  color={color}
                  regionColor={darkerRegionColor}
                  formatPrice={(value) => `€${value.toLocaleString('de-DE')}`}
                  label={t("Price per m²")}
                  showAllNeighborhoods={true}
                  layout="vertical"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
