
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScoreBar } from "./ScoreBar";
import { scoreIcons, scoreLabels } from "./constants";
import { Neighborhood } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
  regionId: string;
  regionColor: string;
  updatedValues: Record<string, any>;
  onInputChange: (neighborhoodId: string, field: string, value: number) => void;
  onSave: (neighborhood: Neighborhood) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const NeighborhoodCard = ({
  neighborhood,
  regionId,
  regionColor,
  updatedValues,
  onInputChange,
  onSave,
  onMouseEnter,
  onMouseLeave
}: NeighborhoodCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Card 
      className="group border transition-all duration-300 hover:shadow-lg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span 
            className="opacity-60 group-hover:opacity-100 transition-all duration-300"
            style={{ color: regionColor }}
          >
            {t(neighborhood.name)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label className="opacity-60 group-hover:opacity-100 transition-all duration-300">
            {t("Neighborhood Scores")}
          </Label>
          {Object.entries(scoreLabels).map(([key, label]) => {
            const Icon = scoreIcons[key as keyof typeof scoreIcons];
            const currentValue = neighborhood[key as keyof Neighborhood] as number;
            const updatedValue = updatedValues[neighborhood.id]?.[key];

            return (
              <div key={key} className="space-y-1 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon 
                      size={16}
                      className="opacity-60 group-hover:opacity-100 transition-all duration-300"
                      style={{ color: regionColor }}
                    />
                    <Label 
                      htmlFor={`${neighborhood.id}-${key}`}
                      className="text-sm opacity-60 group-hover:opacity-100 transition-all duration-300"
                      style={{ color: regionColor }}
                    >
                      {t(label)}
                    </Label>
                  </div>
                  <Input 
                    id={`${neighborhood.id}-${key}`}
                    type="number"
                    min="0"
                    max="10"
                    defaultValue={currentValue}
                    className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none opacity-60 group-hover:opacity-100 transition-all duration-300"
                    style={{ color: regionColor }}
                    onChange={(e) => onInputChange(neighborhood.id, key, parseInt(e.target.value))}
                  />
                </div>
                <ScoreBar 
                  value={currentValue}
                  updatedValue={updatedValue}
                  color={regionColor}
                />
              </div>
            );
          })}
        </div>
        <Button 
          className="w-full opacity-60 hover:opacity-100 transition-all duration-300"
          onClick={() => onSave(neighborhood)}
          disabled={!updatedValues[neighborhood.id]}
          style={{
            backgroundColor: regionColor,
            color: 'white'
          }}
        >
          {t("Save Changes")}
        </Button>
      </CardContent>
    </Card>
  );
};
