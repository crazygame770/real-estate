
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FloorSelectorProps {
  floor: number | null;
  onFloorChange: (floor: number) => void;
}

export const FloorSelector = ({
  floor,
  onFloorChange,
}: FloorSelectorProps) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <Label className="flex items-center gap-2">
        <ArrowUp className="w-4 h-4" />
        {t("Floor Number")}
      </Label>
      <div className="grid grid-cols-4 gap-2 mt-2">
        <Button
          variant={floor === 0 ? 'default' : 'outline'}
          onClick={() => onFloorChange(0)}
          className="w-full"
        >
          {t("Ground")}
        </Button>
        {[1, 2, 3, 4, 5, 6].map((f) => (
          <Button
            key={f}
            variant={floor === f ? 'default' : 'outline'}
            onClick={() => onFloorChange(f)}
            className="w-full"
          >
            {f}
          </Button>
        ))}
      </div>
    </div>
  );
};
