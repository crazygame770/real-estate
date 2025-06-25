
import { useState } from "react";
import { X, MapPin } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface Region {
  name: string;
  region: string;
  color: string;
}

interface RegionSelectorProps {
  selectedRegions?: Region[];
  onRegionsChange?: (regions: Region[]) => void;
}

const regions = [
  {
    name: "Central Athens",
    color: "#ff4444",
    areas: ["Plaka", "Monastiraki", "Kolonaki", "Psiri", "Exarchia", "Omonia", "Thisio", "Pagrati", "Mets"],
  },
  { 
    name: "Piraeus & Coast", 
    color: "#9933CC", 
    areas: ["Piraeus Center", "Kastella", "Pasalimani", "Mikrolimano", "Voula", "Glyfada"] 
  },
  { 
    name: "North Attica", 
    color: "#3366ff", 
    areas: ["Kifisia", "Marousi", "Chalandri", "Agia Paraskevi"] 
  },
  { 
    name: "East Attica", 
    color: "#33b5e5", 
    areas: ["Pallini", "Gerakas", "Glyka Nera", "Spata"] 
  },
  { 
    name: "West Attica", 
    color: "#00C851", 
    areas: ["Peristeri", "Aigaleo", "Petroupoli", "Chaidari"] 
  },
  { 
    name: "South Athens", 
    color: "#FF8800", 
    areas: ["Kallithea", "Nea Smyrni", "Palaio Faliro", "Alimos"] 
  },
  { 
    name: "Northeast Athens", 
    color: "#2BBBAD", 
    areas: ["Neo Psychiko", "Cholargos", "Papagou", "Filothei"] 
  },
];

const RegionSelector = ({ selectedRegions = [], onRegionsChange }: RegionSelectorProps) => {
  const location = useLocation();
  const [hoveredArea, setHoveredArea] = useState<{ area: string; region: string } | null>(null);
  const { t } = useLanguage();

  const toggleArea = (area: string, region: string, color: string) => {
    const newSelectedRegions = selectedRegions.some(
      (selected) => selected.name === area && selected.region === region
    )
      ? selectedRegions.filter(
          (selected) => !(selected.name === area && selected.region === region)
        )
      : [...selectedRegions, { name: area, region, color }];
    
    onRegionsChange?.(newSelectedRegions);
  };

  const removeArea = (area: string, region: string) => {
    const newSelectedRegions = selectedRegions.filter(
      (selected) => !(selected.name === area && selected.region === region)
    );
    onRegionsChange?.(newSelectedRegions);
  };

  const isAreaSelected = (area: string, region: string) => {
    return selectedRegions.some(
      (selected) => selected.name === area && selected.region === region
    );
  };

  // Group selected regions by region for display
  const selectedByRegion = regions.map(region => ({
    ...region,
    selectedAreas: selectedRegions.filter(item => item.region === region.name)
  }));

  return (
    <div className="w-full">
      <div className="flex items-center mb-3">
        <MapPin className="w-5 h-5 mr-2 text-primary" />
        <span className="text-base font-medium">{t("Athens Regions")}</span>
      </div>
      
      <div className="mt-2">
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {regions.map((region) => (
            <div key={region.name} className="space-y-2">
              <div className="w-full flex items-center p-1 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: region.color }} />
                  <span className="text-sm font-medium">{t(region.name)}</span>
                </div>
              </div>
              
              <div className="ml-4 pl-2 border-l border-muted space-y-1">
                <div className="grid grid-cols-2 gap-1">
                  {region.areas.map((area) => (
                    <button
                      key={area}
                      onClick={() => toggleArea(area, region.name, region.color)}
                      onMouseEnter={() => setHoveredArea({ area, region: region.name })}
                      onMouseLeave={() => setHoveredArea(null)}
                      className="w-full text-left p-1.5 text-xs rounded-md transition-colors"
                      style={{
                        backgroundColor: isAreaSelected(area, region.name) 
                          ? `${region.color}20` 
                          : hoveredArea?.area === area && hoveredArea?.region === region.name 
                            ? `${region.color}10` 
                            : 'transparent',
                        color: isAreaSelected(area, region.name) ? region.color : 'inherit',
                        fontWeight: isAreaSelected(area, region.name) ? '600' : '400'
                      }}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedRegions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-muted">
            <h3 className="text-xs font-medium mb-2">{t("Selected Areas:")}</h3>
            <div className="flex flex-wrap gap-1">
              {selectedRegions.map((area) => (
                <button
                  key={`${area.region}-${area.name}`}
                  onClick={() => removeArea(area.name, area.region)}
                  className="group px-2 py-0.5 rounded-full text-xs text-white flex items-center gap-1 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: area.color }}
                >
                  {area.name}
                  <X className="w-2.5 h-2.5 opacity-75 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionSelector;
