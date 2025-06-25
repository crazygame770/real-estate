
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SharedAreaChart } from "./SharedAreaChart";
import { darkenColor } from "@/utils/colorUtils";

interface PricePerMeterChartProps {
  data: Array<{
    year: number;
    pricePerMeter: number;
    athensAvgPerMeter: number;
  }>;
  color: string;
  regionAvg: number;
  athensAvg: number;
  yoyGrowth: string;
}

export const PricePerMeterChart = ({ data, color, regionAvg, athensAvg, yoyGrowth }: PricePerMeterChartProps) => {
  // Get darker shade of the region color for region average
  const darkerRegionColor = darkenColor(color, 0.2);

  // Get 2025 data
  const data2025 = data.find(d => d.year === 2025);
  const pricePerMeter2025 = data2025 ? data2025.pricePerMeter : 0;
  const athensAvgPerMeter2025 = data2025 ? data2025.athensAvgPerMeter : 0;

  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Price per m²</CardTitle>
            <CardDescription>Price per square meter evolution over time</CardDescription>
          </div>
          <div className="text-sm text-green-500">+{yoyGrowth}% YoY</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span>Region (2025):</span>
            </span>
            <span className="font-semibold">€{pricePerMeter2025.toLocaleString()}/m²</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Athens (2025):</span>
            </span>
            <span className="font-semibold">€{athensAvgPerMeter2025.toLocaleString()}/m²</span>
          </div>
        </div>
        <SharedAreaChart
          data={data}
          mainDataKey="pricePerMeter"
          compareDataKey="athensAvgPerMeter"
          color={color}
          regionColor={darkerRegionColor}
          yAxisFormatter={(value) => `€${value}`}
          tooltipFormatter={(value) => `€${value}/m²`}
          tooltipCompareFormatter={(value) => `€${value}/m²`}
          tooltipLabel="Region"
          compareLabel="Athens"
        />
      </CardContent>
    </Card>
  );
};
