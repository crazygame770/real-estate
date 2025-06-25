
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Euro } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PriceInputProps {
  price: number;
  onPriceChange: (price: number) => void;
}

export const PriceInput = ({
  price,
  onPriceChange,
}: PriceInputProps) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <Label className="flex items-center gap-2">
        <Euro className="w-4 h-4" />
        {t("Price")}
      </Label>
      <Input
        type="text"
        value={price.toLocaleString()}
        onChange={(e) => {
          const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
          onPriceChange(value);
        }}
        className="mt-2 mb-2"
      />
      <Slider
        value={[price]}
        onValueChange={(value) => onPriceChange(value[0])}
        max={1000000}
        step={1000}
        className="mt-2"
      />
    </div>
  );
};
