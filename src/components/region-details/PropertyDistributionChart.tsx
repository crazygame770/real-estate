
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyDistributionChartProps {
  title: string;
  data: Array<{ name: string; value: number; percentage: string }>;
  colors: string[];
}

export const PropertyDistributionChart = ({ title, data, colors }: PropertyDistributionChartProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
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
