
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import AnalyticsSummaryCards from "@/components/analytics/AnalyticsSummaryCards";
import PriceEvolutionCharts from "@/components/analytics/PriceEvolutionCharts";
import PropertyTypeDistribution from "@/components/analytics/PropertyTypeDistribution";
import PropertiesByRegion from "@/components/analytics/PropertiesByRegion";
import RegionsOverview from "@/components/analytics/RegionsOverview";
import RegionPriceMatrix from "@/components/analytics/RegionPriceMatrix";
import RegionScoreMatrix from "@/components/analytics/RegionScoreMatrix";
import { PriceHeatmapCard } from "@/components/analytics/charts/PriceHeatmapCard";
import PriceHeatMap from "@/components/analytics/PriceHeatMap";
import PricePerSquareMeterMatrix from "@/components/analytics/PricePerSquareMeterMatrix";
import PriceByRegion from "@/components/analytics/PriceByRegion";
import PricePerSquareMeterByRegion from "@/components/analytics/PricePerSquareMeterByRegion";

const Analytics = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="max-w-screen-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-6 ml-8 mt-8 text-foreground hover:text-foreground/80"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t("Back to Main Menu")}
            </Button>

            <div className="px-8 pb-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2 text-foreground">{t("Athens Real Estate Market Overview")}</h1>
                <p className="text-muted-foreground">
                  {t("Comprehensive analysis of property trends")}
                </p>
              </div>

              <AnalyticsSummaryCards />
              <PriceHeatMap />
              <PriceEvolutionCharts />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <PropertyTypeDistribution />
                <PropertiesByRegion />
              </div>
              
              <PriceByRegion />
              <PricePerSquareMeterByRegion />
              <PriceHeatmapCard />
              <RegionPriceMatrix />
              <PricePerSquareMeterMatrix />
              <RegionScoreMatrix />
              <RegionsOverview />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
