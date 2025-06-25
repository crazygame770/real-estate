
import { ChartTooltipProps } from "../types/price-types";

export const PriceChartTooltip = ({ active, payload }: ChartTooltipProps) => {
  const formatNumber = (value: number) => value.toLocaleString('de-DE');

  if (active && payload && payload.length > 0 && payload[0]?.payload) {
    const { year } = payload[0].payload;
    
    return (
      <div className="bg-card p-3 border rounded-lg shadow-lg">
        <p className="text-sm font-medium mb-2">{year}</p>
        {payload.map((entry, index) => {
          if (entry && entry.value !== undefined) {
            let color;
            let label;
            
            switch (index) {
              case 0:
                color = "#ea384c";
                label = "Property";
                break;
              case 1:
                color = "#0ea5e9";
                label = "Neighborhood";
                break;
              case 2:
                color = "#a855f7";
                label = "Region";
                break;
              case 3:
                color = "#64748b";
                label = "Athens";
                break;
              default:
                color = "#000000";
                label = "Unknown";
            }
            
            return (
              <p 
                key={`${label}-${index}`} 
                className="text-sm" 
                style={{ color }}
              >
                {label}: €{formatNumber(entry.value)}
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  }
  return null;
};
