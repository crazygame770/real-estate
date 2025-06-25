
import { Footprints, ShieldCheck, School, Trees, Music, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SCORE_ICONS = {
  walkability: Footprints,
  safety: ShieldCheck,
  education: School,
  greenSpaces: Trees,
  entertainment: Music,
  retail: ShoppingBag
};

interface RegionScoresProps {
  scores: {
    walkability: number;
    safety: number;
    education: number;
    greenSpaces: number;
    entertainment: number;
    retail: number;
  };
}

export const RegionScores = ({ scores }: RegionScoresProps) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">Region Scores</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(scores).map(([key, value]) => {
          const Icon = SCORE_ICONS[key as keyof typeof SCORE_ICONS];
          return (
            <Card key={key}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium capitalize">{key}</h4>
                </div>
                <p className="text-2xl font-bold">{value}/10</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
