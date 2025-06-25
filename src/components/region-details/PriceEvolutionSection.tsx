
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SharedAreaChart } from './charts/SharedAreaChart';
import { useLanguage } from "@/contexts/LanguageContext";

interface PriceEvolutionSectionProps {
  priceData: Array<{
    year: number;
    value: number;
    athensAvg: number;
    predicted?: boolean;
  }>;
  pricePerMeterData: Array<{
    year: number;
    value: number;
    athensAvg: number;
    predicted?: boolean;
  }>;
  color: string;
  formatNumber: (value: number) => string;
}

export const PriceEvolutionSection = ({ 
  priceData, 
  pricePerMeterData, 
  color,
  formatNumber 
}: PriceEvolutionSectionProps) => {
  const { t } = useLanguage();
  
  const processData = (data: any[]) => {
    return data.map(item => ({
      ...item,
      predicted: item.year >= 2025
    }));
  };

  const processedPriceData = processData(priceData);
  const processedPricePerMeterData = processData(pricePerMeterData);

  return (
    <div className="space-y-6 my-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{t("Average Property Price Evolution")}</CardTitle>
              <CardDescription>{t("Historical data and 5-year ML prediction")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SharedAreaChart
              data={processedPriceData}
              mainDataKey="value"
              compareDataKey="athensAvg"
              color={color}
              regionColor="#888888"
              yAxisFormatter={(value) => `€${(value/1000).toLocaleString('de-DE')}k`}
              tooltipFormatter={(value) => `€${formatNumber(value)}`}
              tooltipCompareFormatter={(value) => `€${formatNumber(value)}`}
              tooltipLabel="Region"
              compareLabel="Athens"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>{t("Average Price per m² Evolution")}</CardTitle>
              <CardDescription>{t("Price per square meter with future predictions")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SharedAreaChart
              data={processedPricePerMeterData}
              mainDataKey="value"
              compareDataKey="athensAvg"
              color={color}
              regionColor="#888888"
              yAxisFormatter={(value) => `€${value.toLocaleString('de-DE')}`}
              tooltipFormatter={(value) => `€${value}/m²`}
              tooltipCompareFormatter={(value) => `€${value}/m²`}
              tooltipLabel="Region"
              compareLabel="Athens"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-card p-4 rounded-lg border border-border">
        <h3 className="text-md font-semibold mb-2">{t("About our prediction model")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("Our machine learning model uses exponential smoothing and historical price trends to forecast future property values. The model analyzes past price patterns, market growth rates, and seasonal variations to generate predictions for the next 5 years. These predictions should be used as general guidance and not as financial advice.")}
        </p>
      </div>
    </div>
  );
};
