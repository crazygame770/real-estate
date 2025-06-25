
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { House, ShieldCheck, School, Trees, Music, ShoppingBag } from "lucide-react";
import { PropertyFilters } from "@/types/propertyTypes";
import { useLanguage } from "@/contexts/LanguageContext";

interface NeighborhoodScoresSectionProps {
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
}

const formatScore = (score: number) => {
  return Math.min(Math.max(score, 0), 10);
};

const NeighborhoodScoresSection = ({
  filters,
  setFilters,
}: NeighborhoodScoresSectionProps) => {
  const { t } = useLanguage();
  
  const scoreItems = [
    { 
      label: 'Walkability', 
      icon: House, 
      key: 'walkabilityScore' as const,
      value: filters.walkabilityScore
    },
    { 
      label: 'Safety Index', 
      icon: ShieldCheck, 
      key: 'safetyScore' as const,
      value: filters.safetyScore
    },
    { 
      label: 'Education Quality', 
      icon: School, 
      key: 'educationScore' as const,
      value: filters.educationScore
    },
    { 
      label: 'Green Spaces', 
      icon: Trees, 
      key: 'greenSpacesScore' as const,
      value: filters.greenSpacesScore
    },
    { 
      label: 'Entertainment', 
      icon: Music, 
      key: 'entertainmentScore' as const,
      value: filters.entertainmentScore
    },
    { 
      label: 'Retail Access', 
      icon: ShoppingBag, 
      key: 'retailScore' as const,
      value: filters.retailScore
    }
  ];

  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
      <h3 className="text-lg font-semibold dark:text-white">{t("Neighborhood Scores")}</h3>
      
      {scoreItems.map((score) => (
        <div key={score.label} className="mt-4">
          <Label className="flex items-center gap-2">
            <score.icon className="w-4 h-4" />
            {t(score.label)}
          </Label>
          <div className="flex gap-4 mt-2">
            <Input 
              type="number"
              value={formatScore(score.value[0])}
              onChange={(e) => setFilters({
                ...filters,
                [score.key]: [formatScore(Number(e.target.value)), score.value[1]]
              })}
              min="0"
              max="10"
            />
            <Input 
              type="number"
              value={formatScore(score.value[1])}
              onChange={(e) => setFilters({
                ...filters,
                [score.key]: [score.value[0], formatScore(Number(e.target.value))]
              })}
              min="0"
              max="10"
            />
          </div>
          <Slider
            className="mt-2"
            value={[formatScore(score.value[0]), formatScore(score.value[1])]}
            onValueChange={(value) => setFilters({
              ...filters,
              [score.key]: value as [number, number]
            })}
            min={0}
            max={10}
            step={1}
          />
        </div>
      ))}
    </div>
  );
};

export default NeighborhoodScoresSection;
