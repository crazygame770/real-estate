
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from "@/contexts/LanguageContext";

const PropertyTypeDistribution = () => {
  const { t } = useLanguage();
  const { data: propertyTypeData, isLoading } = useQuery({
    queryKey: ['property-type-distribution'],
    queryFn: async () => {
      const { data: properties, error } = await supabase
        .from('properties')
        .select('property_type');

      if (error) throw error;

      // Count properties by type
      const typeCount = properties.reduce((acc: Record<string, number>, property) => {
        const type = property.property_type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const total = properties.length;

      // Create array with specific order: apartments first, then houses
      const orderedTypes = ['apartment', 'house'];
      return orderedTypes.map(type => ({
        name: type === 'house' ? 'Houses' : 'Apartments',
        value: typeCount[type] || 0,
        percentage: ((typeCount[type] || 0) / total * 100).toFixed(1)
      }));
    }
  });

  const COLORS = ['#ff4444', '#3366ff', '#22c55e'];

  if (isLoading) {
    return (
      <div className="bg-card p-6 rounded-lg border border-border h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">{t("Loading property type distribution...")}</p>
      </div>
    );
  }

  if (!propertyTypeData || propertyTypeData.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg border border-border h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">{t("No property type data available")}</p>
      </div>
    );
  }

  // Translate property type names for display
  const translatedData = propertyTypeData.map(item => ({
    ...item,
    name: t(item.name)
  }));

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{t("Property Type Distribution")}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={translatedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
            >
              {translatedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                `${value} (${props.payload.percentage}%)`,
                name
              ]}
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

export default PropertyTypeDistribution;
