
import { 
  Calendar, Zap, 
  BedDouble, Bath, Square,
  Clock
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyStatsProps {
  yearBuilt: number;
  energyClass: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  listedOn: string;
  daysListed: number;
  solarWaterHeater: boolean;
}

export function PropertyStats({
  yearBuilt,
  energyClass,
  bedrooms,
  bathrooms,
  area,
  listedOn,
  daysListed,
  solarWaterHeater
}: PropertyStatsProps) {
  const { t } = useLanguage();
  
  // Function to get the color classes based on energy class
  const getEnergyClassColor = (energyClass: string) => {
    const colors: { [key: string]: string } = {
      'A': 'bg-[#4caf50]/10 text-[#4caf50]',
      'B': 'bg-[#8bc34a]/10 text-[#8bc34a]',
      'C': 'bg-[#cddc39]/10 text-[#cddc39]',
      'D': 'bg-[#ffeb3b]/10 text-[#ffeb3b]',
      'E': 'bg-[#ffc107]/10 text-[#ffc107]',
      'F': 'bg-[#ff9800]/10 text-[#ff9800]',
      'G': 'bg-[#f44336]/10 text-[#f44336]'
    };
    return colors[energyClass] || 'bg-[#eab308]/10 text-[#eab308]';
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">{t("YEAR BUILT")}</div>
            <div className="font-medium">{yearBuilt}</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <BedDouble className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">{t("BEDROOMS")}</div>
            <div className="font-medium">{bedrooms} {t("beds")}</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">{t("LISTED ON")}</div>
            <div className="font-medium">{listedOn}</div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Zap className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">{t("ENERGY CLASS")}</div>
            <div>
              <span className={`px-2 py-1 text-sm font-medium rounded-full ${getEnergyClassColor(energyClass)}`}>
                {energyClass}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Bath className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">{t("BATHROOMS")}</div>
            <div className="font-medium">{bathrooms} {t("baths")}</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">{t("DAYS LISTED")}</div>
            <div className="font-medium">{daysListed} {t("days")}</div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Zap className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">{t("SOLAR WATER HEATER")}</div>
            <div className="font-medium">{solarWaterHeater ? t('Yes') : t('No')}</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Square className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">{t("TOTAL AREA")}</div>
            <div className="font-medium flex items-baseline">
              {area}<span className="text-xs ml-1">m²</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
