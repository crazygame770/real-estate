
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts';

interface PriceAreaChartProps {
  data: Array<{ year: number; value: number }>;
  color: string;
  tooltipLabel: string;
  formatNumber: (value: number) => string;
}

export const PriceAreaChart = ({ data, color, tooltipLabel, formatNumber }: PriceAreaChartProps) => {
  const renderDot = (props: any) => {
    const { cx, cy } = props;
    return <Dot cx={cx} cy={cy} r={4} fill={color} stroke="white" strokeWidth={2} />;
  };

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
          <defs>
            <linearGradient id={`color${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis 
            dataKey="year" 
            className="text-muted-foreground text-xs"
            interval={0}
            padding={{ left: 30, right: 30 }}
            angle={-25}
            tickMargin={10}
          />
          <YAxis 
            tickFormatter={(value) => `€${formatNumber(value)}`}
            className="text-muted-foreground text-xs"
            width={80}
            tickCount={6}
          />
          <Tooltip 
            formatter={(value: number) => [`€${formatNumber(value)}`, tooltipLabel]}
            labelFormatter={(label) => `Year ${label}`}
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '8px 12px'
            }}
            itemStyle={{
              color: '#fff'
            }}
            labelStyle={{
              color: '#fff',
              marginBottom: '4px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fillOpacity={1} 
            fill={`url(#color${color})`}
            dot={renderDot}
            activeDot={{ r: 6, fill: color, stroke: "white", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
