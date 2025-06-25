
import { 
  Footprints, Shield, GraduationCap, 
  Leaf, Gamepad2, ShoppingCart 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScoresBarChart } from "@/components/region-details/charts/ScoresBarChart";
import { useLanguage } from "@/contexts/LanguageContext";

interface Score {
  walkability: number;
  safety: number;
  education: number;
  green_spaces: number;
  entertainment: number;
  retail: number;
}

interface NeighborhoodOverviewProps {
  scores: Score;
  neighborhoodName?: string;
  regionId?: string;
  regionScores?: Score;
  color?: string;
}

export const NeighborhoodOverview = ({ 
  scores, 
  neighborhoodName,
  regionScores,
  color = "#8B5CF6" 
}: NeighborhoodOverviewProps) => {
  const { t } = useLanguage();

  // Transform scores into the format expected by ScoresBarChart with rounded values
  const chartData = [
    { 
      name: 'Walkability', 
      score: Number(scores.walkability.toFixed(2)),
      regionScore: Number(regionScores?.walkability.toFixed(2)) || 0,
      athensScore: 7.50 // Athens average
    },
    { 
      name: 'Safety', 
      score: Number(scores.safety.toFixed(2)),
      regionScore: Number(regionScores?.safety.toFixed(2)) || 0,
      athensScore: 7.20
    },
    { 
      name: 'Education', 
      score: Number(scores.education.toFixed(2)),
      regionScore: Number(regionScores?.education.toFixed(2)) || 0,
      athensScore: 7.80
    },
    { 
      name: 'Green Spaces', 
      score: Number(scores.green_spaces.toFixed(2)),
      regionScore: Number(regionScores?.green_spaces.toFixed(2)) || 0,
      athensScore: 6.50
    },
    { 
      name: 'Entertainment', 
      score: Number(scores.entertainment.toFixed(2)),
      regionScore: Number(regionScores?.entertainment.toFixed(2)) || 0,
      athensScore: 8.00
    },
    { 
      name: 'Retail', 
      score: Number(scores.retail.toFixed(2)),
      regionScore: Number(regionScores?.retail.toFixed(2)) || 0,
      athensScore: 7.50
    }
  ];

  if (!scores) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{t("Neighborhood Overview")}</CardTitle>
        <CardDescription>
          {neighborhoodName 
            ? t("Comprehensive analysis of") + ` ${neighborhoodName}'s ` + t("characteristics and amenities")
            : t("Comprehensive analysis of the area's key characteristics and amenities")
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScoresBarChart
          title={`${neighborhoodName || t('Neighborhood')} ${t('Scores')}`}
          description={t("Comparison with region and Athens averages")}
          data={chartData}
          color={color}
          regionColor={`${color}80`}
          scoreLabel={t("Neighborhood Score")}
        />
      </CardContent>
    </Card>
  );
};
