
import { PieChart, Pie, Cell } from 'recharts';

interface RegionPropertyDistributionProps {
  houses: number;
  apartments: number;
  color: string;
}

const RegionPropertyDistribution = ({ houses, apartments, color }: RegionPropertyDistributionProps) => {
  const data = [
    { name: 'Houses', value: houses },
    { name: 'Apartments', value: apartments }
  ];

  return (
    <div className="w-24 h-24">
      <PieChart width={96} height={96}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={45}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          label={false}
          labelLine={false}
        >
          <Cell fill={color} />
          <Cell fill={`${color}80`} />
        </Pie>
      </PieChart>
    </div>
  );
};

export default RegionPropertyDistribution;
