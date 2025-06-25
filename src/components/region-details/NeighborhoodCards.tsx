
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Neighborhood {
  name: string;
  avgPrice: string;
  pricePerMeter: string;
  priceHistory: Array<{
    year: number;
    price: number;
  }>;
}

interface NeighborhoodCardsProps {
  neighborhoods: Neighborhood[];
  regionColor: string;
}

export const NeighborhoodCards = ({ neighborhoods, regionColor }: NeighborhoodCardsProps) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">Neighborhoods Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {neighborhoods.map((neighborhood) => (
          <Card key={neighborhood.name}>
            <CardHeader>
              <CardTitle>{neighborhood.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Average Price</p>
                  <p className="text-lg font-semibold">{neighborhood.avgPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price per m²</p>
                  <p className="text-lg font-semibold">{neighborhood.pricePerMeter}</p>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={neighborhood.priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `€${value/1000}k`} />
                      <Tooltip 
                        formatter={(value: number) => [`€${value.toLocaleString()}`, "Price"]}
                        labelFormatter={(label) => `Year: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke={regionColor} 
                        fill={regionColor}
                        fillOpacity={0.2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
