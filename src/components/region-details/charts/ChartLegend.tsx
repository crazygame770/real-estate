
import { ChartLegendItem } from "../types/neighborhood-types";

interface ChartLegendProps {
  items: ChartLegendItem[];
}

export const ChartLegend = ({ items = [] }: ChartLegendProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 space-y-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span>{item.label}:</span>
          </span>
          <span className="font-semibold">{item.value}</span>
        </div>
      ))}
    </div>
  );
};
