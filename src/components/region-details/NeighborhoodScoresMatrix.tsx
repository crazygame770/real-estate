
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { scoreLabels, scoreIcons } from "@/components/neighborhood/constants";
import { regionColors } from "@/components/neighborhood/constants";
import { useLanguage } from "@/contexts/LanguageContext";

interface NeighborhoodScore {
  name: string;
  walkability: number;
  safety: number;
  education: number;
  green_spaces: number;
  entertainment: number;
  retail: number;
}

interface NeighborhoodScoresMatrixProps {
  regionId: string;
  color: string;
}

export const NeighborhoodScoresMatrix = ({ regionId, color }: NeighborhoodScoresMatrixProps) => {
  const { t } = useLanguage();
  
  const { data: neighborhoodScores, isLoading } = useQuery({
    queryKey: ['neighborhood-scores', regionId],
    queryFn: async () => {
      const { data: neighborhoodData, error } = await supabase
        .from('neighborhoods')
        .select(`
          name,
          walkability,
          safety,
          education,
          green_spaces,
          entertainment,
          retail
        `)
        .eq('region_id', regionId)
        .order('name');

      if (error) throw error;

      // Calculate region averages
      const regionAvg = neighborhoodData.reduce((acc, curr) => {
        return {
          walkability: (acc.walkability || 0) + (curr.walkability || 0),
          safety: (acc.safety || 0) + (curr.safety || 0),
          education: (acc.education || 0) + (curr.education || 0),
          green_spaces: (acc.green_spaces || 0) + (curr.green_spaces || 0),
          entertainment: (acc.entertainment || 0) + (curr.entertainment || 0),
          retail: (acc.retail || 0) + (curr.retail || 0),
        };
      }, {} as Omit<NeighborhoodScore, 'name'>);

      const count = neighborhoodData.length;
      Object.keys(regionAvg).forEach(key => {
        regionAvg[key as keyof typeof regionAvg] = regionAvg[key as keyof typeof regionAvg] / count;
      });

      // Get Athens averages
      const { data: athensData, error: athensError } = await supabase
        .from('neighborhoods')
        .select(`
          walkability,
          safety,
          education,
          green_spaces,
          entertainment,
          retail
        `);

      if (athensError) throw athensError;

      const athensAvg = athensData.reduce((acc, curr) => {
        return {
          walkability: (acc.walkability || 0) + (curr.walkability || 0),
          safety: (acc.safety || 0) + (curr.safety || 0),
          education: (acc.education || 0) + (curr.education || 0),
          green_spaces: (acc.green_spaces || 0) + (curr.green_spaces || 0),
          entertainment: (acc.entertainment || 0) + (curr.entertainment || 0),
          retail: (acc.retail || 0) + (curr.retail || 0),
        };
      }, {} as Omit<NeighborhoodScore, 'name'>);

      const athensCount = athensData.length;
      Object.keys(athensAvg).forEach(key => {
        athensAvg[key as keyof typeof athensAvg] = athensAvg[key as keyof typeof athensAvg] / athensCount;
      });

      return { 
        neighborhoods: neighborhoodData,
        regionAvg,
        athensAvg
      };
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6 mb-8 bg-[#1A1F2C] text-white border-none">
        <h3 className="text-lg font-semibold mb-4 text-white">{t("Neighborhood Scores Analysis")}</h3>
        <p className="text-gray-400">{t("Loading neighborhood data...")}</p>
      </Card>
    );
  }

  if (!neighborhoodScores) return null;

  const getColor = (index: number) => {
    const colors = Object.values(regionColors);
    return colors[index % colors.length];
  };

  const translateScoreKey = (key: string) => {
    const scoreKeyMap: Record<string, string> = {
      'walkability': 'Walkability',
      'safety': 'Safety',
      'education': 'Education',
      'green_spaces': 'Green Spaces',
      'entertainment': 'Entertainment',
      'retail': 'Retail'
    };
    
    return t(scoreKeyMap[key] || key);
  };

  return (
    <Card className="p-6 mb-8 bg-[#1A1F2C] text-white border-none">
      <h3 className="text-lg font-semibold mb-4 text-white">{t("Neighborhood Scores Analysis")}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2 px-4 text-gray-400">{t("Neighborhood")}</th>
              {Object.entries(scoreLabels).map(([key, label]) => {
                const Icon = scoreIcons[key as keyof typeof scoreIcons];
                return (
                  <th key={key} className="text-right py-2 px-4 text-gray-400">
                    <div className="flex items-center justify-end gap-2">
                      <Icon className="w-4 h-4" />
                      {t(label)}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {neighborhoodScores.neighborhoods.map((neighborhood, index) => (
              <tr 
                key={neighborhood.name} 
                className="border-b border-gray-700/50 hover:bg-gray-800/30"
              >
                <td className="py-2 px-4 flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getColor(index) }}
                  />
                  <span className="text-white">{t(neighborhood.name)}</span>
                </td>
                <td className="text-right py-2 px-4 text-white">{neighborhood.walkability?.toFixed(1)}</td>
                <td className="text-right py-2 px-4 text-white">{neighborhood.safety?.toFixed(1)}</td>
                <td className="text-right py-2 px-4 text-white">{neighborhood.education?.toFixed(1)}</td>
                <td className="text-right py-2 px-4 text-white">{neighborhood.green_spaces?.toFixed(1)}</td>
                <td className="text-right py-2 px-4 text-white">{neighborhood.entertainment?.toFixed(1)}</td>
                <td className="text-right py-2 px-4 text-white">{neighborhood.retail?.toFixed(1)}</td>
              </tr>
            ))}
            <tr 
              className="border-b border-gray-700/50"
              style={{ backgroundColor: `${color}20` }}
            >
              <td className="py-2 px-4 flex items-center gap-3 font-semibold">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: color
                  }}
                />
                <span className="text-white">{t("Region")}</span>
              </td>
              <td className="text-right py-2 px-4 font-semibold text-white">{neighborhoodScores.regionAvg.walkability.toFixed(1)}</td>
              <td className="text-right py-2 px-4 font-semibold text-white">{neighborhoodScores.regionAvg.safety.toFixed(1)}</td>
              <td className="text-right py-2 px-4 font-semibold text-white">{neighborhoodScores.regionAvg.education.toFixed(1)}</td>
              <td className="text-right py-2 px-4 font-semibold text-white">{neighborhoodScores.regionAvg.green_spaces.toFixed(1)}</td>
              <td className="text-right py-2 px-4 font-semibold text-white">{neighborhoodScores.regionAvg.entertainment.toFixed(1)}</td>
              <td className="text-right py-2 px-4 font-semibold text-white">{neighborhoodScores.regionAvg.retail.toFixed(1)}</td>
            </tr>
            <tr 
              className="border-b border-gray-700/50"
              style={{ backgroundColor: '#8E919620' }}
            >
              <td className="py-2 px-4 flex items-center gap-3 font-semibold">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: '#8E9196'
                  }}
                />
                <span className="text-white">{t("Athens")}</span>
              </td>
              <td className="text-right py-2 px-4 font-semibold text-white">{neighborhoodScores.athensAvg.walkability.toFixed(1)}</td>
              <td className="text-right py-2 px-4 font-semibold text-white">{neighborhoodScores.athensAvg.safety.toFixed(1)}</td>
              <td className="text-right py-2 px-4 font-semibold text-white">{neighborhoodScores.athensAvg.education.toFixed(1)}</td>
              <td className="text-right py-2 px-4 font-semibold text-white">{neighborhoodScores.athensAvg.green_spaces.toFixed(1)}</td>
              <td className="text-right py-2 px-4 font-semibold text-white">{neighborhoodScores.athensAvg.entertainment.toFixed(1)}</td>
              <td className="text-right py-2 px-4 font-semibold text-white">{neighborhoodScores.athensAvg.retail.toFixed(1)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};
