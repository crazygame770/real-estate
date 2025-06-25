
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { getRegionData } from "@/utils/regionData";
import Sidebar from "@/components/Sidebar";
import { RegionStatsCards } from "@/components/region-details/RegionStatsCards";
import { PriceEvolutionSection } from "@/components/region-details/PriceEvolutionSection";
import { DistributionChartsSection } from "@/components/region-details/DistributionChartsSection";
import { NeighborhoodScoresMatrix } from "@/components/region-details/NeighborhoodScoresMatrix";
import { NeighborhoodPriceCharts } from "@/components/region-details/NeighborhoodPriceCharts";
import { useRegionStats } from "@/hooks/useRegionStats";
import { useLanguage } from "@/contexts/LanguageContext";
import { AveragePropertyPriceGrid } from "@/components/region-details/AveragePropertyPriceGrid";
import { PricePerMeterGrid } from "@/components/region-details/PricePerMeterGrid";
import { AveragePricePerBedroomGrid } from "@/components/region-details/AveragePricePerBedroomGrid";
import { NeighborhoodPriceTables } from "@/components/region-details/NeighborhoodPriceTables";
import { NeighborhoodPriceMatrix } from "@/components/region-details/NeighborhoodPriceMatrix";

const RegionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const regionData = getRegionData(id || '');

  const formatNumber = (value: number) => value.toLocaleString('de-DE');
  const { data: stats } = useRegionStats(regionData?.name);

  if (!regionData) {
    return <div className="text-foreground">{t("Region not found")}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0C1021] flex">
      <Sidebar />
      <div className="flex-1 ml-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/analytics")}
            className="mb-6 text-white hover:text-white/80"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("Back to Analytics")}
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t(regionData.name)}</h1>
            <p className="text-gray-400">
              {t("Comprehensive analysis of property market statistics and trends")}
            </p>
          </div>

          {stats && (
            <>
              <RegionStatsCards
                avgPrice={`€${Math.round(stats.avgPrice).toLocaleString()}`}
                pricePerMeter={`€${Math.round(stats.pricePerMeter).toLocaleString()}`}
                totalProperties={`${stats.totalProperties} ${t("Properties")}`}
                priceHistory={stats.priceData}
              />
              
              <PriceEvolutionSection
                priceData={stats.priceData.map(item => ({
                  ...item,
                  athensAvg: item.athensAvg || 0 // Ensure athensAvg is always present
                }))}
                pricePerMeterData={stats.pricePerMeterData.map(item => ({
                  ...item,
                  athensAvg: item.athensAvg || 0 // Ensure athensAvg is always present
                }))}
                color={regionData.color}
                formatNumber={formatNumber}
              />
              
              {/* Distribution charts */}
              <DistributionChartsSection
                propertyTypeData={stats.propertyTypeData}
                neighborhoodData={stats.neighborhoodData}
              />

              {/* Price grid components */}
              <AveragePropertyPriceGrid 
                neighborhoodPrices={stats.neighborhoodPrices}
                regionAvg={stats.regionAvg}
                athensAvg={stats.athensAvg}
                color={regionData.color}
              />
              
              <PricePerMeterGrid 
                neighborhoodPrices={stats.neighborhoodPrices}
                regionAvg={stats.regionAvg}
                athensAvg={stats.athensAvg}
                color={regionData.color}
              />
              
              <AveragePricePerBedroomGrid 
                neighborhoodData={stats.bedroomPricesByNeighborhood}
                regionAvgPerBedroom={stats.regionAvgPerBedroom}
                athensAvgPerBedroom={stats.athensAvgPerBedroom}
                color={regionData.color}
              />

              {/* Neighborhood scores matrix */}
              <NeighborhoodScoresMatrix
                regionId={id || ''}
                color={regionData.color}
              />
              
              {/* New neighborhood price tables with similar design to scores matrix */}
              <NeighborhoodPriceTables
                neighborhoodData={stats.neighborhoodPrices}
                regionAvg={stats.regionAvg}
                athensAvg={stats.athensAvg}
                color={regionData.color}
              />
              
              {/* Neighborhood price charts */}
              <NeighborhoodPriceCharts
                neighborhoodData={stats.neighborhoodPrices}
                color={regionData.color}
                regionAvg={stats.regionAvg}
                athensAvg={stats.athensAvg}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionDetails;
