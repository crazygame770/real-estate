
import { PriceChart } from "./charts/PriceChart";
import { PricePerMeterChart } from "./charts/PricePerMeterChart";
import { calculateAverages, calculateYoYGrowth, transformPriceData } from "./utils/chartCalculations";
import { darkenColor } from "@/utils/colorUtils";

interface PriceEvolutionChartProps {
  data: Array<{
    year: number;
    price: number;
    athensAvg: number;
  }>;
  color: string;
}

export const PriceEvolutionChart = ({ data, color }: PriceEvolutionChartProps) => {
  const { regionAvg, athensAvg } = calculateAverages(data);
  const yoyGrowth = calculateYoYGrowth(data);
  const transformedData = transformPriceData(data);

  // Get darker shade of the region color for region average
  const darkerRegionColor = darkenColor(color, 0.2);

  const priceLegendItems = [
    { color: color, label: "Region Average", value: `€${regionAvg.toLocaleString()}` },
    { color: "#8E9196", label: "Athens Average", value: `€${athensAvg.toLocaleString()}` }
  ];

  const pricePerMeterLegendItems = [
    { color: color, label: "Region Average", value: `€${Math.round(regionAvg/100).toLocaleString()}/m²` },
    { color: "#8E9196", label: "Athens Average", value: `€${Math.round(athensAvg/100).toLocaleString()}/m²` }
  ];

  return (
    <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PriceChart
        title="Price Evolution"
        data={data}
        mainDataKey="price"
        compareDataKey="athensAvg"
        color={color}
        regionColor={darkerRegionColor}
        legendItems={priceLegendItems}
        yAxisFormatter={(value) => `€${value/1000}k`}
        tooltipFormatter={(value) => `€${value.toLocaleString()}`}
        tooltipCompareFormatter={(value) => `€${value.toLocaleString()}`}
        tooltipLabel="Region"
        compareLabel="Athens Average"
        description="Property price evolution over time"
        yoyGrowth={yoyGrowth}
      />
      
      <PriceChart
        title="Price per m²"
        data={transformedData}
        mainDataKey="pricePerMeter"
        compareDataKey="athensAvgPerMeter"
        color={color}
        regionColor={darkerRegionColor}
        legendItems={pricePerMeterLegendItems}
        yAxisFormatter={(value) => `€${value}`}
        tooltipFormatter={(value) => `€${value}/m²`}
        tooltipCompareFormatter={(value) => `€${value}/m²`}
        tooltipLabel="Region"
        compareLabel="Athens Average"
        description="Price per square meter evolution over time"
        yoyGrowth={yoyGrowth}
      />
    </div>
  );
};
