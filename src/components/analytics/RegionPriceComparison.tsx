
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const regionPriceData = [
  { name: "Central Athens", price: 520000, color: "#ff4444" },
  { name: "South Athens", price: 480000, color: "#9933CC" },
  { name: "North Attica", price: 450000, color: "#3366ff" },
  { name: "East Attica", price: 420000, color: "#33b5e5" },
  { name: "Piraeus & Coast", price: 380000, color: "#00C851" },
  { name: "West Attica", price: 350000, color: "#FF8800" },
  { name: "Northeast Athens", price: 460000, color: "#2BBBAD" }
];

const getOpacity = (price: number) => {
  const maxPrice = Math.max(...regionPriceData.map(r => r.price));
  return 0.2 + (0.8 * (price / maxPrice));
};

const RegionPriceComparison = () => {
  const formatNumber = (value: number) => value.toLocaleString('de-DE');

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Average Price by Region</h3>
      <div className="grid grid-cols-1 gap-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionPriceData} layout="vertical" margin={{ left: 120 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                type="number"
                tickFormatter={(value) => `€${formatNumber(value/1000)}k`}
                className="text-muted-foreground"
              />
              <YAxis 
                type="category"
                dataKey="name" 
                className="text-muted-foreground"
              />
              <Tooltip 
                formatter={(value: number) => [`€${formatNumber(value)}`, 'Average Price']}
              />
              <Bar dataKey="price">
                {regionPriceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {regionPriceData.map((region) => (
            <div 
              key={region.name}
              className="p-4 rounded-lg transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: `rgba(220, 38, 38, ${getOpacity(region.price)})`
              }}
            >
              <p className="font-semibold text-foreground">{region.name}</p>
              <p className="text-lg font-bold text-foreground">
                €{formatNumber(region.price)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionPriceComparison;
