
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PropertyDistributionChartProps {
  apartments: number;
  houses: number;
  color: string;
}

const PropertyDistributionChart = ({
  apartments,
  houses,
  color
}: PropertyDistributionChartProps) => {
  const data = [
    { name: 'Apartments', value: apartments },
    { name: 'Houses', value: houses }
  ];

  return (
    <div className="h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={40}
            paddingAngle={2}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill={`${color}80`} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export { PropertyDistributionChart };
