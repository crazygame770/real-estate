import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SharedAreaChart } from './SharedAreaChart';
import { ChartLegend } from './ChartLegend';
import { ChartLegendItem } from "../types/neighborhood-types";

interface PriceChartProps {
  title: string;
  data: any[];
  mainDataKey: string;
  compareDataKey: string;
  color: string;
  regionColor: string;
  legendItems: ChartLegendItem[];
  yAxisFormatter: (value: number) => string;
  tooltipFormatter: (value: number) => string;
  tooltipCompareFormatter: (value: number) => string;
  tooltipLabel: string;
  compareLabel: string;
  description?: string;
  yoyGrowth?: string;
  athensKey?: string;
}

export const PriceChart = ({
  title,
  data,
  mainDataKey,
  compareDataKey,
  color,
  regionColor,
  legendItems,
  yAxisFormatter,
  tooltipFormatter,
  tooltipCompareFormatter,
  tooltipLabel,
  compareLabel,
  description,
  yoyGrowth,
  athensKey
}: PriceChartProps) => {
  // Get 2025 data
  const data2025 = data.find(d => d.year === 2025);
  
  const formatNumber = (value: number) => value.toLocaleString('de-DE');
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {yoyGrowth && <div className="text-sm text-green-500">+{yoyGrowth}% YoY</div>}
        </div>
      </CardHeader>
      <CardContent>
        {data2025 && (
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                <span>{tooltipLabel} (2025):</span>
              </span>
              <span className="font-semibold">
                €{formatNumber(data2025[mainDataKey])}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: regionColor }}></div>
                <span>{compareLabel} (2025):</span>
              </span>
              <span className="font-semibold">
                €{formatNumber(data2025[compareDataKey])}
              </span>
            </div>
            {athensKey && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span>Athens Average (2025):</span>
                </span>
                <span className="font-semibold">
                  €{formatNumber(data2025[athensKey])}
                </span>
              </div>
            )}
          </div>
        )}
        <SharedAreaChart
          data={data}
          mainDataKey={mainDataKey}
          compareDataKey={compareDataKey}
          color={color}
          regionColor={regionColor}
          yAxisFormatter={(value) => `€${formatNumber(value)}`}
          tooltipFormatter={(value) => `€${formatNumber(value)}`}
          tooltipCompareFormatter={(value) => `€${formatNumber(value)}`}
          tooltipLabel={tooltipLabel}
          compareLabel={compareLabel}
          athensKey={athensKey}
        />
      </CardContent>
    </Card>
  );
};
