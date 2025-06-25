
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { regionColors, regionNames } from "@/components/neighborhood/constants";
import { scoreLabels, scoreIcons } from "@/components/neighborhood/constants";
import { useLanguage } from "@/contexts/LanguageContext";

interface RegionScores {
  region: string;
  walkability: number;
  safety: number;
  education: number;
  green_spaces: number;
  entertainment: number;
  retail: number;
}

const RegionScoreMatrix = () => {
  const { t } = useLanguage();
  const { data: regionScores, isLoading } = useQuery({
    queryKey: ['region-scores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('neighborhoods')
        .select(`
          region_id,
          walkability,
          safety,
          education,
          green_spaces,
          entertainment,
          retail
        `);

      if (error) throw error;

      // Calculate average scores for each region
      const regionData = data.reduce((acc: { [key: string]: { 
        count: number,
        walkability: number,
        safety: number,
        education: number,
        green_spaces: number,
        entertainment: number,
        retail: number
      }}, neighborhood) => {
        const region = neighborhood.region_id;
        
        if (!acc[region]) {
          acc[region] = {
            count: 0,
            walkability: 0,
            safety: 0,
            education: 0,
            green_spaces: 0,
            entertainment: 0,
            retail: 0
          };
        }
        
        acc[region].count += 1;
        acc[region].walkability += Number(neighborhood.walkability) || 0;
        acc[region].safety += Number(neighborhood.safety) || 0;
        acc[region].education += Number(neighborhood.education) || 0;
        acc[region].green_spaces += Number(neighborhood.green_spaces) || 0;
        acc[region].entertainment += Number(neighborhood.entertainment) || 0;
        acc[region].retail += Number(neighborhood.retail) || 0;
        
        return acc;
      }, {});

      // Calculate Athens averages
      const allScores = data.reduce((acc, neighborhood) => {
        acc.walkability.push(Number(neighborhood.walkability) || 0);
        acc.safety.push(Number(neighborhood.safety) || 0);
        acc.education.push(Number(neighborhood.education) || 0);
        acc.green_spaces.push(Number(neighborhood.green_spaces) || 0);
        acc.entertainment.push(Number(neighborhood.entertainment) || 0);
        acc.retail.push(Number(neighborhood.retail) || 0);
        return acc;
      }, {
        walkability: [] as number[],
        safety: [] as number[],
        education: [] as number[],
        green_spaces: [] as number[],
        entertainment: [] as number[],
        retail: [] as number[]
      });

      const athensStats = {
        region: 'athens-average',
        walkability: allScores.walkability.reduce((a, b) => a + b, 0) / allScores.walkability.length,
        safety: allScores.safety.reduce((a, b) => a + b, 0) / allScores.safety.length,
        education: allScores.education.reduce((a, b) => a + b, 0) / allScores.education.length,
        green_spaces: allScores.green_spaces.reduce((a, b) => a + b, 0) / allScores.green_spaces.length,
        entertainment: allScores.entertainment.reduce((a, b) => a + b, 0) / allScores.entertainment.length,
        retail: allScores.retail.reduce((a, b) => a + b, 0) / allScores.retail.length
      };

      const regionStats = Object.entries(regionData).map(([region, scores]): RegionScores => ({
        region,
        walkability: Math.round((scores.walkability / scores.count) * 10) / 10,
        safety: Math.round((scores.safety / scores.count) * 10) / 10,
        education: Math.round((scores.education / scores.count) * 10) / 10,
        green_spaces: Math.round((scores.green_spaces / scores.count) * 10) / 10,
        entertainment: Math.round((scores.entertainment / scores.count) * 10) / 10,
        retail: Math.round((scores.retail / scores.count) * 10) / 10
      }));

      return [...regionStats, athensStats];
    }
  });

  const getRegionColor = (regionName: string) => {
    return regionColors[regionName] || '#888888';
  };

  const formatScore = (score: number) => {
    return score.toFixed(1);
  };

  if (isLoading) {
    return (
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">{t("Regional Scores Analysis")}</h3>
        <p className="text-muted-foreground">{t("Loading region data...")}</p>
      </Card>
    );
  }

  // Get all score types except 'region'
  const scoreTypes = Object.keys(scoreLabels);

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{t("Regional Scores Analysis")}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-4 text-muted-foreground">{t("Region")}</th>
              {scoreTypes.map(scoreType => {
                const Icon = scoreIcons[scoreType as keyof typeof scoreIcons];
                return (
                  <th key={scoreType} className="text-right py-2 px-4 text-muted-foreground">
                    <div className="flex items-center justify-end gap-2">
                      <Icon className="w-4 h-4" />
                      {t(scoreLabels[scoreType as keyof typeof scoreLabels])}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {regionScores?.map((region) => (
              <tr 
                key={region.region} 
                className={`border-b border-border transition-colors ${
                  region.region === 'athens-average' ? 'bg-blue-500/10' : ''
                }`}
                style={{
                  '--region-color': getRegionColor(region.region),
                  backgroundColor: region.region === 'athens-average' ? undefined : 'transparent',
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  if (region.region !== 'athens-average') {
                    e.currentTarget.style.backgroundColor = `${getRegionColor(region.region)}26`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (region.region !== 'athens-average') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <td className="py-2 px-4 flex items-center gap-3 text-foreground">
                  <div 
                    className="w-3 h-3 rounded-full transition-colors duration-200"
                    style={{
                      backgroundColor: region.region === 'athens-average' ? '#888888' : getRegionColor(region.region),
                      opacity: '0.3'
                    }}
                  />
                  {region.region === 'athens-average' ? t('Athens Average') : t(regionNames[region.region] || region.region)}
                </td>
                {scoreTypes.map(scoreType => (
                  <td key={scoreType} className="text-right py-2 px-4 text-foreground">
                    {formatScore(Number(region[scoreType as keyof RegionScores]))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RegionScoreMatrix;
