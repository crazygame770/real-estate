
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Region {
  name: string;
  region: string;
  color: string;
}

interface UploadRegionSelectorProps {
  selectedRegion: Region | null;
  onRegionChange: (region: Region | null) => void;
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

const UploadRegionSelector = ({ selectedRegion, onRegionChange }: UploadRegionSelectorProps) => {
  const { t } = useLanguage();
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredArea, setHoveredArea] = useState<{ area: string; region: string } | null>(null);

  const selectArea = (area: string, region: string, color: string) => {
    onRegionChange({ name: area, region, color });
  };

  const isAreaSelected = (area: string, region: string) => {
    return selectedRegion?.name === area && selectedRegion?.region === region;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">{t("Select Neighborhood")}</h2>
      <div className="space-y-2">
        {regions.map((region) => (
          <div key={region.name} className="space-y-1">
            <button
              type="button"
              onClick={() => setExpandedRegion(expandedRegion === region.name ? null : region.name)}
              onMouseEnter={() => setHoveredRegion(region.name)}
              onMouseLeave={() => setHoveredRegion(null)}
              className="w-full flex items-center justify-between p-3 rounded-lg transition-colors group"
              style={{
                backgroundColor: expandedRegion === region.name || hoveredRegion === region.name 
                  ? `${region.color}10` 
                  : 'transparent'
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: region.color }} />
                <span className="text-sm font-medium dark:text-white">{t(region.name)}</span>
              </div>
              {expandedRegion === region.name ? (
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
              )}
            </button>
            {expandedRegion === region.name && region.areas.length > 0 && (
              <div className="ml-5 pl-4 border-l border-gray-200 dark:border-gray-700 space-y-1">
                {region.areas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => selectArea(area, region.name, region.color)}
                    onMouseEnter={() => setHoveredArea({ area, region: region.name })}
                    onMouseLeave={() => setHoveredArea(null)}
                    className="w-full text-left p-2 text-sm rounded-md transition-colors"
                    style={{
                      backgroundColor: isAreaSelected(area, region.name) 
                        ? `${region.color}20` 
                        : hoveredArea?.area === area && hoveredArea?.region === region.name 
                          ? `${region.color}10` 
                          : 'transparent',
                      color: isAreaSelected(area, region.name) ? region.color : 'inherit'
                    }}
                  >
                    {area}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedRegion && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <h3 className="text-sm font-medium mb-2 dark:text-white">{t("Selected Area:")}</h3>
          <div className="inline-block px-3 py-1 rounded-full text-sm text-white"
               style={{ backgroundColor: selectedRegion.color }}>
            {selectedRegion.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadRegionSelector;
