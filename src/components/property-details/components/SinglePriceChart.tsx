
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Dot } from 'recharts';
import { Card } from "@/components/ui/card";
import { darkenColor } from "@/utils/colorUtils";
import { regionColors } from "@/components/neighborhood/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from 'next-themes';

interface SinglePriceChartProps {
  data: Array<{
    year: number;
    price: number;
    neighborhoodAvg: number;
    regionAvg: number;
    athensAvg: number;
    predicted?: boolean;
  }>;
  yAxisFormatter: (value: number) => string;
  regionId?: string;
}

export const SinglePriceChart = ({ data, yAxisFormatter, regionId = "central-athens" }: SinglePriceChartProps) => {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  if (!data || data.length === 0) {
    return <div>{t("No data available")}</div>;
  }

  // Use the exact region color from the constants
  const regionColor = regionId ? regionColors[regionId] : "#8B5CF6";
  const neighborhoodColor = darkenColor(regionColor, 0.2); // Slightly darker
  const regionAvgColor = darkenColor(regionColor, 0.4); // Even darker
  const athensColor = "#8E9196"; // Consistent grey

  // Ensure all years are displayed (no gaps)
  const sortedData = [...data].sort((a, b) => a.year - b.year);
  const minYear = Math.min(...sortedData.map(item => item.year));
  const maxYear = Math.max(...sortedData.map(item => item.year));
  
  // Create a complete years array to ensure all years are shown
  const allYears = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );

  // Check for missing years in the data and fill them in
  const completeData = [...data];
  allYears.forEach(year => {
    if (!completeData.some(item => item.year === year)) {
      // Find the nearest available data point to interpolate from
      const nearestItem = completeData.reduce((nearest, item) => {
        return Math.abs(item.year - year) < Math.abs(nearest.year - year) ? item : nearest;
      }, completeData[0]);
      
      // Add the missing year with interpolated data
      completeData.push({
        year,
        price: nearestItem.price,
        neighborhoodAvg: nearestItem.neighborhoodAvg,
        regionAvg: nearestItem.regionAvg,
        athensAvg: nearestItem.athensAvg,
        predicted: year >= 2025 // Mark as predicted if year is 2025 or later
      });
    }
  });

  // Sort the complete data by year to ensure chronological order
  const finalData = completeData.sort((a, b) => a.year - b.year);
  
  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    const isPredicted = payload.predicted;
    
    const dotColor = dataKey === 'price' 
      ? regionColor 
      : dataKey === 'neighborhoodAvg' 
      ? neighborhoodColor 
      : dataKey === 'regionAvg'
      ? regionAvgColor
      : athensColor;

    return (
      <g>
        <circle 
          cx={cx} 
          cy={cy} 
          r={4} 
          fill={isPredicted ? "transparent" : dotColor}
          stroke={dotColor}
          strokeWidth={2}
          className="transition-all duration-300 hover:r-6"
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isPredicted = payload[0].payload.predicted;
      return (
        <Card className="px-4 py-3 shadow-xl border-2 animate-in fade-in zoom-in duration-200 bg-background/95 backdrop-blur">
          <p className="text-sm font-medium mb-2">
            {t("Year")} {label} {isPredicted && <span className="text-muted-foreground">({t("Predicted")})</span>}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.stroke }}>
              {entry.name}: {yAxisFormatter(entry.value)}
            </p>
          ))}
        </Card>
      );
    }
    return null;
  };

  const hasPredictedData = data.some(item => item.predicted);
  const predictionStartYear = hasPredictedData ? 
    Math.min(...data.filter(item => item.predicted).map(item => item.year)) : 
    2025;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={finalData}
          margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={regionColor} stopOpacity={0.1}/>
              <stop offset="95%" stopColor={regionColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="year"
            stroke="currentColor"
            strokeOpacity={0.5}
            fontSize={12}
            tickFormatter={(value) => value.toString()}
            type="number"
            domain={[minYear, maxYear]}
            ticks={allYears} // Force display of all years
            allowDecimals={false}
            tickMargin={8}
            interval={0} // Important: This ensures ALL ticks are shown
          />
          <YAxis
            stroke="currentColor"
            strokeOpacity={0.5}
            tickFormatter={yAxisFormatter}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Add reference line for prediction start if we have predicted data */}
          {hasPredictedData && (
            <ReferenceLine
              x={predictionStartYear}
              stroke={isDark ? "#2D3548" : "#e5e7eb"}
              strokeDasharray="3 3"
              label={{
                value: t("Prediction"),
                position: "top",
                fill: isDark ? "#4B5563" : "#9CA3AF",
                fontSize: 12
              }}
            />
          )}

          <Area
            type="monotone"
            dataKey="price"
            stroke={regionColor}
            fill="url(#colorPrice)"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: regionColor }}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="neighborhoodAvg"
            stroke={neighborhoodColor}
            fill="none"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: neighborhoodColor }}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="regionAvg"
            stroke={regionAvgColor}
            fill="none"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: regionAvgColor }}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="athensAvg"
            stroke={athensColor}
            fill="none"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: athensColor }}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
