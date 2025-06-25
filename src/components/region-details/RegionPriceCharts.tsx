
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RegionPriceChartsProps {
  priceHistory: {
    year: number;
    price: number;
    pricePerMeter: number;
    athensAvg: number;
    athensAvgPerMeter: number;
  }[];
  regionColor: string;
}

export const RegionPriceCharts = ({ priceHistory, regionColor }: RegionPriceChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Historical Price Evolution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `€${value/1000}k`} />
              <Tooltip 
                formatter={(value: number) => `€${value.toLocaleString()}`}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                name="Region Price"
                stroke={regionColor} 
                fill={regionColor}
                fillOpacity={0.2} 
              />
              <Area
                type="monotone"
                dataKey="athensAvg"
                name="Athens Average"
                stroke="#666"
                strokeDasharray="3 3"
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Price per m² Evolution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `€${value}/m²`}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="pricePerMeter"
                name="Region Price/m²"
                stroke={regionColor} 
                fill={regionColor}
                fillOpacity={0.2} 
              />
              <Area
                type="monotone"
                dataKey="athensAvgPerMeter"
                name="Athens Average/m²"
                stroke="#666"
                strokeDasharray="3 3"
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
