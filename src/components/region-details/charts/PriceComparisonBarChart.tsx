
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';

interface PriceComparisonBarChartProps {
  neighborhoodPrice: number | Array<{ name: string; price: number }>;
  regionPrice: number;
  athensPrice: number;
  neighborhoodName: string;
  color: string;
  regionColor: string;
  formatPrice: (value: number) => string;
  label: string;
  showAllNeighborhoods?: boolean;
  layout?: "vertical" | "horizontal";
}

export const PriceComparisonBarChart = ({
  neighborhoodPrice,
  regionPrice,
  athensPrice,
  neighborhoodName,
  color,
  regionColor,
  formatPrice,
  label,
  showAllNeighborhoods = false,
  layout = "horizontal"
}: PriceComparisonBarChartProps) => {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = resolvedTheme === 'dark';

  const data = showAllNeighborhoods
    ? [
        ...(neighborhoodPrice as Array<{ name: string; price: number }>).map(n => ({
          name: t(n.name),
          value: n.price,
          color: color
        }))
      ]
    : [
        {
          name: t(neighborhoodName),
          value: neighborhoodPrice as number,
          color: color
        }
      ];

  const CustomBar = (props: any) => {
    const { x, y, width, height, fill } = props;
    const radius = 6;
    const isAboveRegion = props.value > regionPrice;
    const isAboveAthens = props.value > athensPrice;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill || color}
          rx={radius}
          ry={radius}
          className={`transition-all duration-300 hover:opacity-80 hover:filter hover:brightness-110 ${
            isAboveRegion ? 'stroke-2 stroke-purple-500' : ''
          } ${isAboveAthens ? 'stroke-2 stroke-blue-500' : ''}`}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const isAboveRegion = value > regionPrice;
      const isAboveAthens = value > athensPrice;

      return (
        <Card className="px-4 py-3 shadow-xl border-2 animate-in fade-in zoom-in duration-200 bg-background/95 backdrop-blur">
          <p className="text-sm font-medium mb-2">{payload[0].payload.name}</p>
          <p className="text-sm font-bold" style={{ color }}>
            {label}: {formatPrice(value)}
          </p>
          {isAboveRegion && (
            <p className="text-xs text-purple-500 mt-1">
              ↑ {t("Above region average")}
            </p>
          )}
          {isAboveAthens && (
            <p className="text-xs text-blue-500 mt-1">
              ↑ {t("Above Athens average")}
            </p>
          )}
        </Card>
      );
    }
    return null;
  };

  const chartHeight = showAllNeighborhoods ? 
    Math.max(400, data.length * 40) : 
    400;

  return (
    <div className="w-full transition-all" style={{ height: `${chartHeight}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="horizontal"
          margin={{
            top: 20,
            right: 30,
            left: 40,
            bottom: 60
          }}
          barSize={32}
          className="[&_.recharts-cartesian-grid-horizontal_line]:stroke-muted [&_.recharts-cartesian-grid-vertical_line]:stroke-muted"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={true}
            horizontal={true}
            opacity={0.3}
            className="stroke-muted"
          />
          <XAxis
            dataKey="name"
            stroke={isDark ? "#4B5563" : "#9CA3AF"}
            strokeOpacity={0.5}
            fontSize={12}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
            axisLine={{ stroke: isDark ? '#2D3548' : '#e5e7eb' }}
          />
          <YAxis
            type="number"
            stroke={isDark ? "#4B5563" : "#9CA3AF"}
            strokeOpacity={0.5}
            fontSize={12}
            tickLine={false}
            tickFormatter={formatPrice}
            axisLine={{ stroke: isDark ? '#2D3548' : '#e5e7eb' }}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ 
              fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              radius: 6
            }}
          />
          <ReferenceLine
            y={regionPrice}
            stroke="#a855f7"
            strokeDasharray="5 5"
            label={{
              value: t("Region Average"),
              position: "right",
              fill: "#a855f7",
              fontSize: 12
            }}
          />
          <ReferenceLine
            y={athensPrice}
            stroke="#0ea5e9"
            strokeDasharray="5 5"
            label={{
              value: t("Athens Average"),
              position: "right",
              fill: "#0ea5e9",
              fontSize: 12
            }}
          />
          <Bar
            dataKey="value"
            shape={<CustomBar />}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

