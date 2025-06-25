
import { PropertyDistributionChart } from "../charts/PropertyDistributionChart";
import { RegionMetrics } from "../metrics/RegionMetrics";
import { NeighborhoodsList } from "../neighborhoods/NeighborhoodsList";
import { Button } from "@/components/ui/button";

interface RegionCardProps {
  region: {
    id: string;
    name: string;
    color: string;
    avgPrice: string;
    pricePerMeter: string;
    apartments: number;
    houses: number;
    neighborhoods: string[];
    apartmentsPercent: string;
    housesPercent: string;
  };
  onRegionClick: (regionId: string) => void;
}

export const RegionCard = ({ region, onRegionClick }: RegionCardProps) => {
  return (
    <div className="bg-[#131B2C] rounded-lg border border-gray-800 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: region.color }} 
          />
          <div>
            <h3 className="text-lg font-medium text-white">{region.name}</h3>
            <p className="text-sm text-gray-400">{region.neighborhoods.length} neighborhoods</p>
          </div>
        </div>
        <Button 
          onClick={() => onRegionClick(region.id)}
          variant="ghost"
          className="text-white hover:text-white/80 font-medium px-4 py-2 rounded-md transition-all duration-300"
          style={{ backgroundColor: region.color }}
        >
          VIEW DETAILS
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-6">
        <div className="md:col-span-1">
          <PropertyDistributionChart 
            apartments={region.apartments}
            houses={region.houses}
            color={region.color}
          />
        </div>
        <RegionMetrics 
          avgPrice={region.avgPrice}
          pricePerMeter={region.pricePerMeter}
          apartments={region.apartments.toString()}
          houses={region.houses.toString()}
          apartmentsPercent={region.apartmentsPercent}
          housesPercent={region.housesPercent}
          growth="+6.2%"
        />
      </div>

      <NeighborhoodsList 
        neighborhoods={region.neighborhoods}
        color={region.color}
      />
    </div>
  );
};
