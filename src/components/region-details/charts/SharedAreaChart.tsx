
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Dot } from 'recharts';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';

interface SharedAreaChartProps {
  data: any[];
  mainDataKey: string;
  compareDataKey: string;
  color: string;
  regionColor: string;
  yAxisFormatter: (value: number) => string;
  tooltipFormatter: (value: number, predicted?: boolean) => string;
  tooltipCompareFormatter: (value: number) => string;
  tooltipLabel: string;
  compareLabel: string;
  athensKey?: string;
}

export const SharedAreaChart = ({
  data,
  mainDataKey,
  compareDataKey,
  color,
  regionColor,
  yAxisFormatter,
  tooltipFormatter,
  tooltipCompareFormatter,
  tooltipLabel,
  compareLabel,
  athensKey
}: SharedAreaChartProps) => {
  const { theme, resolvedTheme } = useTheme();
  const { t } = useLanguage();
  // Fixed prediction year to 2025
  const predictionYear = 2025;
  const isDark = resolvedTheme === 'dark';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const mainValue = payload[0].value;
      const compareValue = payload[1].value;
      const athensValue = payload[2]?.value;
      // Remove referencing the predicted status
      
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium mb-1">{label}</p>
          <p className="text-sm" style={{ color }}>
            {tooltipLabel}: {tooltipFormatter(mainValue)}
          </p>
          <p className="text-sm" style={{ color: regionColor }}>
            {compareLabel}: {tooltipCompareFormatter(compareValue)}
          </p>
          {athensKey && (
            <p className="text-sm text-[#8E9196]">
              {t("Athens Average")}: {tooltipCompareFormatter(athensValue)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    const isPredicted = payload.year >= predictionYear;
    
    const dotColor = dataKey === mainDataKey 
      ? color 
      : dataKey === compareDataKey 
      ? regionColor 
      : "#8E9196";

    return (
      <g>
        <circle 
          cx={cx} 
          cy={cy} 
          r={4} 
          fill={isPredicted ? "transparent" : dotColor}
          stroke={dotColor}
          strokeWidth={1}
        />
      </g>
    );
  };

  return (
    <div className={`h-[400px] w-full rounded-lg ${isDark ? 'bg-[#0B1120]' : 'bg-card'} p-6 border border-border`}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id={`colorGradient-${mainDataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.02}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDark ? "#2D3548" : "#e5e7eb"}
            opacity={0.3}
            vertical={false}
          />
          <XAxis
            dataKey="year"
            stroke={isDark ? "#4B5563" : "#9CA3AF"}
            strokeOpacity={0.5}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: isDark ? '#2D3548' : '#e5e7eb' }}
            interval={0}
            angle={-25}
            tickMargin={10}
          />
          <YAxis
            tickFormatter={yAxisFormatter}
            stroke={isDark ? "#4B5563" : "#9CA3AF"}
            strokeOpacity={0.5}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: isDark ? '#2D3548' : '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <ReferenceLine
            x={predictionYear}
            stroke={isDark ? "#2D3548" : "#e5e7eb"}
            strokeDasharray="3 3"
            label={{
              value: t("Prediction"),
              position: "top",
              fill: isDark ? "#4B5563" : "#9CA3AF",
              fontSize: 12
            }}
          />

          <Area
            type="monotone"
            dataKey={mainDataKey}
            stroke={color}
            fill={`url(#colorGradient-${mainDataKey})`}
            strokeWidth={2}
            dot={renderDot}
            activeDot={{ r: 6, fill: color, stroke: "white", strokeWidth: 2 }}
          />
          
          <Area
            type="monotone"
            dataKey={compareDataKey}
            stroke={regionColor}
            fill="none"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={renderDot}
            activeDot={{ r: 6, fill: regionColor, stroke: "white", strokeWidth: 2 }}
          />
          
          {athensKey && (
            <Area
              type="monotone"
              dataKey={athensKey}
              stroke="#8E9196"
              fill="none"
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={renderDot}
              activeDot={{ r: 6, fill: "#8E9196", stroke: "white", strokeWidth: 2 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
