
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { House, Building2 } from "lucide-react";
import { PropertyType } from "@/types/propertyTypes";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyTypeSelectorProps {
  propertyType: PropertyType;
  onPropertyTypeChange: (type: PropertyType) => void;
}

export const PropertyTypeSelector = ({
  propertyType,
  onPropertyTypeChange,
}: PropertyTypeSelectorProps) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <Label>{t("Property Type")}</Label>
      <div className="flex gap-4 mt-2">
        <Button
          variant={propertyType === 'house' ? 'default' : 'outline'}
          onClick={() => onPropertyTypeChange('house')}
          className="flex-1"
        >
          <House className="mr-2 h-4 w-4" />
          {t("Houses")}
        </Button>
        <Button
          variant={propertyType === 'apartment' ? 'default' : 'outline'}
          onClick={() => onPropertyTypeChange('apartment')}
          className="flex-1"
        >
          <Building2 className="mr-2 h-4 w-4" />
          {t("Apartments")}
        </Button>
      </div>
    </div>
  );
};
