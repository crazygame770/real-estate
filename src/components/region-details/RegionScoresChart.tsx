
import { ScoresBarChart } from './charts/ScoresBarChart';
import { darkenColor } from '@/utils/colorUtils';
import { useLanguage } from "@/contexts/LanguageContext";

const ATHENS_AVERAGES = {
  walkability: 7,
  safety: 7,
  education: 7.5,
  greenSpaces: 6.5,
  entertainment: 8,
  retail: 7.5
};

interface RegionScoresChartProps {
  scores: {
    walkability: number;
    safety: number;
    education: number;
    greenSpaces: number;
    entertainment: number;
    retail: number;
  };
  color: string;
  isNeighborhood?: boolean;
  regionScores?: typeof ATHENS_AVERAGES;
}

export const RegionScoresChart = ({ scores, color, isNeighborhood, regionScores }: RegionScoresChartProps) => {
  const { t } = useLanguage();
  const darkerRegionColor = darkenColor(color, 0.2);

  const data = Object.entries(scores).map(([key, score]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    score,
    athensScore: ATHENS_AVERAGES[key as keyof typeof ATHENS_AVERAGES],
    ...(isNeighborhood && regionScores ? { regionScore: regionScores[key as keyof typeof regionScores] } : {})
  }));

  return (
    <ScoresBarChart
      title={isNeighborhood ? t("Neighborhood Scores") : t("Region Scores")}
      description={t("Comparison with Athens averages")}
      data={data}
      color={color}
      regionColor={isNeighborhood ? darkerRegionColor : undefined}
      scoreLabel={isNeighborhood ? t("Neighborhood Score") : t("Region Score")}
    />
  );
};
