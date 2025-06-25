
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from "@/contexts/LanguageContext";

const REGION_COLORS = {
  "Central Athens": "#ff4444",
  "Piraeus & Coast": "#9933CC",
  "North Attica": "#3366ff",
  "East Attica": "#33b5e5",
  "West Attica": "#00C851",
  "South Athens": "#FF8800",
  "Northeast Athens": "#2BBBAD"
};

const PropertiesByRegion = () => {
  const { t } = useLanguage();
  const { data: propertiesByRegion, isLoading } = useQuery({
    queryKey: ['properties-by-region'],
    queryFn: async () => {
      const { data: properties, error } = await supabase
        .from('properties')
        .select('region');

      if (error) throw error;

      const regionCounts = properties.reduce((acc: Record<string, number>, property) => {
        const region = property.region || 'Unknown';
        acc[region] = (acc[region] || 0) + 1;
        return acc;
      }, {});

      const total = properties.length;

      return Object.entries(regionCounts).map(([name, value]) => ({
        name,
        value,
        color: REGION_COLORS[name as keyof typeof REGION_COLORS] || "#999999",
        percentage: ((value / total) * 100).toFixed(0)
      }));
    }
  });

  if (isLoading) {
    return <div>{t("Loading properties by region...")}</div>;
  }

  // Translate region names for display
  const translatedData = propertiesByRegion?.map(item => ({
    ...item,
    name: t(item.name),
    originalName: item.name // Keep the original name for color mapping
  }));

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{t("Properties by Region")}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={translatedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              label={({ name, percentage }) => `${name} (${percentage}%)`}
            >
              {translatedData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [`${value} ${t("properties")} (${props.payload.percentage}%)`, name]}
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '8px 12px'
              }}
              itemStyle={{
                color: '#fff'
              }}
              labelStyle={{
                color: '#fff',
                marginBottom: '4px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PropertiesByRegion;
