
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Gauge } from "lucide-react";
import { EnergyClass } from "@/types/propertyTypes";
import { useLanguage } from "@/contexts/LanguageContext";

interface EnergyClassSelectorProps {
  energyClass: EnergyClass | null;
  onEnergyClassChange: (energyClass: EnergyClass) => void;
}

export const EnergyClassSelector = ({
  energyClass,
  onEnergyClassChange,
}: EnergyClassSelectorProps) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <Label className="flex items-center gap-2">
        <Gauge className="w-4 h-4" />
        {t("Energy Class")}
      </Label>
      <div className="grid grid-cols-6 gap-2 mt-2">
        {['A', 'B', 'C', 'D', 'E', 'F'].map((class_) => (
          <Button
            key={class_}
            variant={energyClass === class_ ? 'default' : 'outline'}
            onClick={() => onEnergyClassChange(class_ as EnergyClass)}
            className="w-full"
          >
            {class_}
          </Button>
        ))}
      </div>
    </div>
  );
};
