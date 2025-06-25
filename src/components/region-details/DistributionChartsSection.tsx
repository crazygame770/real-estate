
import { PropertyDistributionChart } from "./PropertyDistributionChart";
import { useLanguage } from "@/contexts/LanguageContext";

interface DistributionChartsSectionProps {
  propertyTypeData: Array<{ name: string; value: number; percentage: string }>;
  neighborhoodData: Array<{ name: string; value: number; percentage: string }>;
}

const PROPERTY_TYPE_COLORS = ['#ff4444', '#3366ff'];
const NEIGHBORHOOD_COLORS = [
  '#FF4444', '#3366FF', '#22C55E', '#FF6B6B',
  '#4F46E5', '#10B981', '#F59E0B', '#6366F1', '#EC4899'
];

export const DistributionChartsSection = ({
  propertyTypeData,
  neighborhoodData
}: DistributionChartsSectionProps) => {
  const { t } = useLanguage();
  
  // Translate property type names
  const translatedPropertyTypeData = propertyTypeData.map(item => ({
    ...item,
    name: t(item.name)
  }));
  
  // Translate neighborhood names
  const translatedNeighborhoodData = neighborhoodData.map(item => ({
    ...item,
    name: t(item.name)
  }));
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <PropertyDistributionChart
        title={t("Property Type Distribution")}
        data={translatedPropertyTypeData}
        colors={PROPERTY_TYPE_COLORS}
      />
      <PropertyDistributionChart
        title={t("Properties by Neighborhood")}
        data={translatedNeighborhoodData}
        colors={NEIGHBORHOOD_COLORS}
      />
    </div>
  );
};
