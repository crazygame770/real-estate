
import { usePriceEvolutionData } from "./hooks/usePriceEvolutionData";
import { PriceEvolutionCard } from "./charts/PriceEvolutionCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

const PriceEvolutionCharts = () => {
  const { data: chartData, isLoading } = usePriceEvolutionData();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">{t("Loading price evolution data...")}</p>
        </div>
      </Card>
    );
  }

  const formatNumber = (value: number) => value.toLocaleString('de-DE');
  
  // Get the processed data with predictions already applied
  const priceData = chartData?.priceData || [];
  const pricePerMeterData = chartData?.pricePerMeterData || [];

  return (
    <div className="space-y-6 my-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceEvolutionCard
          title={t("Average Property Price Evolution")}
          description={t("Historical data and 5-year ML prediction")}
          data={priceData}
          color="#ff4444"
          tooltipLabel={t("Price")}
          formatNumber={formatNumber}
          showAthensAverage={false}
        />
        <PriceEvolutionCard
          title={t("Average Price per m² Evolution")}
          description={t("Price per square meter with future predictions")}
          data={pricePerMeterData}
          color="#3366ff"
          tooltipLabel={t("Price per m²")}
          formatNumber={formatNumber}
          showAthensAverage={false}
        />
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

export default PriceEvolutionCharts;
