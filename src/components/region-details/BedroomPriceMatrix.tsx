
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface BedroomPriceData {
  neighborhood: string;
  pricePerBedroom: number;
}

interface BedroomPriceMatrixProps {
  neighborhoodData: BedroomPriceData[];
  regionAvgPerBedroom: number;
  athensAvgPerBedroom: number;
  color: string;
}

export const BedroomPriceMatrix = ({ 
  neighborhoodData = [], 
  regionAvgPerBedroom,
  athensAvgPerBedroom,
  color 
}: BedroomPriceMatrixProps) => {
  const { t } = useLanguage();

  if (!neighborhoodData || neighborhoodData.length === 0) {
    return (
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">{t("Average Price per Bedroom")}</h3>
        <p className="text-muted-foreground">{t("No bedroom price data available")}</p>
      </Card>
    );
  }

  // Sort neighborhoods by price per bedroom (highest first)
  const sortedNeighborhoods = [...neighborhoodData].sort((a, b) => b.pricePerBedroom - a.pricePerBedroom);

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{t("Average Price per Bedroom")}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {t("Average price per bedroom in each neighborhood")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedNeighborhoods.map((neighborhood) => (
          <div
            key={neighborhood.neighborhood}
            className="relative p-4 rounded-lg border border-border transition-transform hover:shadow-md hover:-translate-y-1"
            style={{
              backgroundColor: `${color}10`,
              borderColor: color
            }}
          >
            <div className="space-y-2">
              <h4 className="font-medium text-foreground/90 text-sm">
                {t(neighborhood.neighborhood)}
              </h4>
              <p className="text-foreground text-lg font-bold">
                €{Math.round(neighborhood.pricePerBedroom).toLocaleString()}
              </p>
            </div>
          </div>
        ))}

        {/* Region Average */}
        <div
          className="relative p-4 rounded-lg border border-border transition-transform hover:shadow-md hover:-translate-y-1"
          style={{
            backgroundColor: `${color}30`,
            borderColor: color,
            borderWidth: "2px"
          }}
        >
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground/90 text-sm">
              {t("Region Avg")}
            </h4>
            <p className="text-foreground text-lg font-bold">
              €{Math.round(regionAvgPerBedroom).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Athens Average */}
        <div
          className="relative p-4 rounded-lg border border-border transition-transform hover:shadow-md hover:-translate-y-1"
          style={{
            backgroundColor: "#8E919630",
            borderColor: "#8E9196",
            borderWidth: "2px"
          }}
        >
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground/90 text-sm">
              {t("Athens Avg")}
            </h4>
            <p className="text-foreground text-lg font-bold">
              €{Math.round(athensAvgPerBedroom).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
