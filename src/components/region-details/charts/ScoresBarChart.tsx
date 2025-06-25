
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Footprints, ShieldCheck, School, Trees, Music, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SCORE_ICONS = {
  Walkability: Footprints,
  Safety: ShieldCheck,
  Education: School,
  "Green Spaces": Trees,
  Entertainment: Music,
  Retail: ShoppingBag
};

interface ScoreData {
  name: string;
  score: number;
  athensScore: number;
  regionScore?: number;
}

interface ScoresBarChartProps {
  title: string;
  description?: string;
  data: ScoreData[];
  color: string;
  regionColor?: string;
  scoreLabel?: string;
}

export const ScoresBarChart = ({ title, description, data, color, regionColor, scoreLabel }: ScoresBarChartProps) => {
  const { t } = useLanguage();
  
  // Define score descriptions with untranslated keys (will be translated when displayed)
  const SCORE_DESCRIPTIONS: Record<string, string> = {
    "Walkability": "Access to public transport and pedestrian-friendly areas",
    "Safety": "Crime rates and overall security in the area",
    "Education": "Proximity to schools and educational facilities",
    "Green Spaces": "Parks, gardens, and outdoor recreational areas",
    "Entertainment": "Restaurants, cafes, and cultural venues",
    "Retail": "Shopping centers and local markets"
  };
  
  const translatedData = data.map(item => ({
    ...item,
    name: t(item.name),
    originalName: item.name // Keep original name for icon lookup
  }));

  // Use the provided scoreLabel or fallback to a default based on title
  const actualScoreLabel = scoreLabel || (title.includes(t("Neighborhood")) ? t("Neighborhood Score") : t("Region Score"));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(title)}</CardTitle>
        {description && <CardDescription>{t(description)}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[400px] mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={translatedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.3} />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
                stroke="currentColor"
                strokeOpacity={0.7}
                className="text-sm font-medium"
                dy={16}
              />
              <YAxis
                domain={[0, 10]}
                stroke="currentColor"
                strokeOpacity={0.7}
                className="text-sm font-medium"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    // Find the original untranslated key for icon lookup
                    const originalItem = translatedData.find(item => item.name === label);
                    const iconKey = originalItem?.originalName || label;
                    const Icon = SCORE_ICONS[iconKey as keyof typeof SCORE_ICONS];
                    
                    return (
                      <div className="bg-card p-4 border rounded-lg shadow-lg">
                        <p className="text-base font-semibold mb-2 flex items-center gap-2">
                          {Icon && <Icon className="w-4 h-4" />}
                          {label}
                        </p>
                        <p className="text-sm font-medium mb-1" style={{ color }}>
                          {actualScoreLabel}: {payload[0].value}/10
                        </p>
                        {regionColor && payload[2] && (
                          <p className="text-sm font-medium mb-1" style={{ color: regionColor }}>
                            {t("Region Average")}: {payload[2].value}/10
                          </p>
                        )}
                        <p className="text-sm font-medium" style={{ color: "#8E9196" }}>
                          {t("Athens Average")}: {payload[1].value}/10
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                verticalAlign="bottom"
                align="center"
                formatter={(value) => {
                  if (value === "score") return actualScoreLabel;
                  if (value === "regionScore") return t("Region Average");
                  if (value === "athensScore") return t("Athens Average");
                  return t(value);
                }}
              />
              <Bar dataKey="score" name="score" fill={color} />
              <Bar dataKey="athensScore" name="athensScore" fill="#8E9196" />
              {regionColor && <Bar dataKey="regionScore" name="regionScore" fill={regionColor} />}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {data.map((item) => {
            const Icon = SCORE_ICONS[item.name as keyof typeof SCORE_ICONS];
            return (
              <div key={item.name} className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                  <h4 className="font-medium text-sm">{t(item.name)}</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t(SCORE_DESCRIPTIONS[item.name])}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
