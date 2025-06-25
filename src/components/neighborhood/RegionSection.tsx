
import { NeighborhoodCard } from "./NeighborhoodCard";
import { RegionData, Neighborhood } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

interface RegionSectionProps {
  region: RegionData;
  regionColor: string;
  updatedValues: Record<string, any>;
  onInputChange: (neighborhoodId: string, field: string, value: number) => void;
  onSave: (neighborhood: Neighborhood) => void;
}

export const RegionSection = ({
  region,
  regionColor,
  updatedValues,
  onInputChange,
  onSave
}: RegionSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-8">
      <h2 
        className="text-2xl font-semibold mb-4 px-4 py-2 rounded-lg inline-block transition-all duration-300"
        style={{ 
          color: regionColor,
          opacity: '0.6'
        }}
        data-region-id={region.id}
      >
        {region.name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {region.neighborhoods.map((neighborhood) => (
          <NeighborhoodCard
            key={neighborhood.id}
            neighborhood={neighborhood}
            regionId={region.id}
            regionColor={regionColor}
            updatedValues={updatedValues}
            onInputChange={onInputChange}
            onSave={onSave}
            onMouseEnter={() => {
              const regionHeader = document.querySelector(`[data-region-id="${region.id}"]`);
              if (regionHeader) {
                (regionHeader as HTMLElement).style.opacity = '1';
              }
            }}
            onMouseLeave={() => {
              const regionHeader = document.querySelector(`[data-region-id="${region.id}"]`);
              if (regionHeader) {
                (regionHeader as HTMLElement).style.opacity = '0.6';
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};
