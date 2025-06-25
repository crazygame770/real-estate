
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot, ReferenceLine } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface PriceEvolutionCardProps {
  title: string;
  description: string;
  data: Array<{ year: number; value: number; athensAvg?: number; predicted?: boolean }>;
  color: string;
  tooltipLabel: string;
  formatNumber: (value: number) => string;
  showAthensAverage?: boolean;
}

export const PriceEvolutionCard = ({ 
  data, 
  color, 
  tooltipLabel, 
  formatNumber, 
  title, 
  description,
  showAthensAverage = false 
}: PriceEvolutionCardProps) => {
  const { t } = useLanguage();
  
  // Hard-code the prediction year to 2025
  const predictionYear = 2025;

  const renderDot = (props: any) => {
    const { cx, cy, payload } = props;
    // Render dots for both historical and predicted data points
    return <Dot cx={cx} cy={cy} r={4} fill={payload.predicted ? 'transparent' : color} stroke={color} strokeWidth={2} />;
  };

  // Render a special dot for predicted data points
  const renderPredictionDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload.predicted) return null;
    return <Dot cx={cx} cy={cy} r={4} fill="transparent" stroke={color} strokeWidth={2} strokeDasharray="2 2" />;
  };

  // Custom tooltip formatter to prevent duplicate values
  const customTooltipFormatter = (value: number, name: string, props: { payload: any }) => {
    if (name === 'value') {
      const isPredicted = props.payload.predicted;
      const label = isPredicted ? `${tooltipLabel} (${t('Predicted')})` : tooltipLabel;
      return [`€${formatNumber(value)}`, label];
    }
    
    if (name === 'athensAvg' && showAthensAverage) {
      return [`€${formatNumber(value)}`, t('Athens Average')];
    }
    
    return null;
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
            <defs>
              <linearGradient id={`color${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id={`colorPrediction${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
              {showAthensAverage && (
                <linearGradient id="colorAthens" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#666666" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#666666" stopOpacity={0}/>
                </linearGradient>
              )}
              <pattern id="prediction-pattern" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke={color} strokeWidth="1" opacity="0.5" />
              </pattern>
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
              formatter={customTooltipFormatter}
              labelFormatter={(label) => `${t('Year')} ${label}`}
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
            
            {/* Main data area */}
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#color${color})`}
              dot={renderDot}
              activeDot={{ r: 6, fill: color, stroke: "white", strokeWidth: 2 }}
              isAnimationActive={true}
              connectNulls={true}
            />
            
            {/* Athens Average line if needed */}
            {showAthensAverage && (
              <Area 
                type="monotone" 
                dataKey="athensAvg" 
                stroke="#666666" 
                fillOpacity={0.3} 
                fill="url(#colorAthens)"
                dot={{ r: 4, fill: "#666666", stroke: "white", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#666666", stroke: "white", strokeWidth: 2 }}
              />
            )}
            
            {/* Add a reference line to separate actual and predicted data - fixed at 2025 */}
            <ReferenceLine 
              x={predictionYear} 
              stroke="#888" 
              strokeDasharray="3 3" 
              label={{ 
                value: t('Prediction'), 
                position: 'insideTopRight', 
                fill: '#888',
                fontSize: 12 
              }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
