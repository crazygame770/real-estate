
import { TableCell, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { RegionPriceData } from "@/types/regionPriceTypes";
import { getRegionColor, formatPrice, getRegionDisplayName } from "@/utils/regionUtils";
import { useState } from "react";
import { regionOrder } from "@/components/neighborhood/constants";

interface RegionPriceRowProps {
  item: RegionPriceData;
}

export const RegionPriceRow = ({ item }: RegionPriceRowProps) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  
  // Convert region-id to the format used in regionColors
  const getRegionId = (region: string): string => {
    if (region === 'athens-average') return region;
    
    // Convert from "Central Athens" format to "central-athens" format if needed
    return region.toLowerCase().replace(/ /g, '-');
  };
  
  const regionId = getRegionId(item.region);
  const color = item.region === 'athens-average' ? '#888888' : getRegionColor(regionId);
  
  return (
    <TableRow 
      className={`border-border transition-colors ${
        item.region === 'athens-average' ? 'bg-blue-500/10' : ''
      }`}
      style={{
        backgroundColor: isHovered && item.region !== 'athens-average' 
          ? `${color}10` 
          : item.region === 'athens-average'
            ? 'rgba(59, 130, 246, 0.1)'
            : 'transparent'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TableCell className="py-2 px-4 flex items-center gap-3">
        <div 
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: color,
            opacity: isHovered ? '0.8' : '0.6'
          }}
        />
        <span className="text-foreground">
          {getRegionDisplayName(item.region, t)}
        </span>
      </TableCell>
      <TableCell className="text-right py-2 px-4 text-foreground">{formatPrice(item.minPrice)}</TableCell>
      <TableCell className="text-right py-2 px-4 font-medium text-foreground">{formatPrice(item.avgPrice)}</TableCell>
      <TableCell className="text-right py-2 px-4 text-foreground">{formatPrice(item.maxPrice)}</TableCell>
      <TableCell className="text-right py-2 px-4 text-foreground">{item.count}</TableCell>
    </TableRow>
  );
};
