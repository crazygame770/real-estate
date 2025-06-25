
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Home, Euro, Map } from "lucide-react";
import { predictPrices } from "@/utils/pricePrediction";
import { useLanguage } from "@/contexts/LanguageContext";

interface RegionStatsCardsProps {
  avgPrice: string;
  pricePerMeter: string;
  totalProperties: string;
  priceHistory: Array<{
    year: number;
    value: number;
  }>;
}

export const RegionStatsCards = ({ avgPrice, pricePerMeter, totalProperties, priceHistory }: RegionStatsCardsProps) => {
  const { t } = useLanguage();
  
  // Get prediction for 2025 price
  const predictedData = predictPrices(priceHistory, 5);
  const currentYear = new Date().getFullYear();
  const nextYearPrediction = predictedData.find(item => item.year === currentYear + 1);
  
  // Calculate YoY growth
  const currentYearData = predictedData.find(item => item.year === currentYear);
  const growthRate = currentYearData && nextYearPrediction 
    ? ((nextYearPrediction.value - currentYearData.value) / currentYearData.value) * 100
    : 0;
    
  const formattedGrowthRate = growthRate.toFixed(1);
  const isPositiveGrowth = growthRate >= 0;
  
  const cards = [
    {
      title: t("Average Price"),
      value: avgPrice,
      icon: Euro,
      prediction: nextYearPrediction ? `€${Math.round(nextYearPrediction.value).toLocaleString()}` : "",
      predictionYear: currentYear + 1,
      growth: formattedGrowthRate,
      isPositive: isPositiveGrowth
    },
    {
      title: t("Price per m²"),
      value: pricePerMeter,
      icon: Map,
      prediction: "",
      predictionYear: 0,
      growth: "",
      isPositive: true
    },
    {
      title: t("Properties"),
      value: totalProperties,
      icon: Home,
      prediction: "",
      predictionYear: 0,
      growth: "",
      isPositive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm text-muted-foreground">{card.title}</h3>
                <p className="text-2xl font-semibold">{card.value}</p>
              </div>
              <div className="p-2 bg-secondary/20 rounded-full">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            
            {card.prediction && (
              <div className="pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">{t("AVERAGE PROPERTY PRICE")} ({card.predictionYear})</span>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium mr-2">{card.prediction}</span>
                  {card.growth && (
                    <span className={`text-xs flex items-center ${card.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {card.isPositive ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
                      {card.growth}%
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
