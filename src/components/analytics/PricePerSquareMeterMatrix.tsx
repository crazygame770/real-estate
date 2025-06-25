
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRegionPricePerMeterData } from "@/hooks/useRegionPricePerMeterData";
import { LoadingMatrix } from "@/components/analytics/matrix/LoadingMatrix";
import { ErrorMatrix } from "@/components/analytics/matrix/ErrorMatrix";
import { RegionPricePerMeterRow } from "@/components/analytics/matrix/RegionPricePerMeterRow";
import { ensureArray } from "@/utils/regionUtils";
import { Card } from "@/components/ui/card";
import { regionOrder } from "@/components/neighborhood/constants";

const PricePerSquareMeterMatrix = () => {
  const { t } = useLanguage();
  const { data, isLoading, error, refetch } = useRegionPricePerMeterData();

  if (isLoading) {
    return <LoadingMatrix title={t("Price per Square Meter Matrix")} />;
  }

  if (error || !data || !Array.isArray(data) || data.length === 0) {
    return (
      <ErrorMatrix 
        title={t("Price per Square Meter Matrix")} 
        error={error} 
        onRetry={() => refetch()}
      />
    );
  }

  const safeData = ensureArray(data);
  
  // Separate athens-average from the rest of the data
  const athensAverage = safeData.find(item => item.region === 'athens-average');
  const regionData = safeData.filter(item => item.region !== 'athens-average');
  
  // Order regions according to the same order used in Regional Scores Analysis
  const orderedRegionData = [...regionData].sort((a, b) => {
    const aId = a.region.toLowerCase().replace(/ /g, '-');
    const bId = b.region.toLowerCase().replace(/ /g, '-');
    
    const aIndex = regionOrder.indexOf(aId);
    const bIndex = regionOrder.indexOf(bId);
    
    // If both regions are in the regionOrder array, sort by their order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only one region is in the regionOrder array, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // If neither region is in the regionOrder array, sort alphabetically
    return a.region.localeCompare(b.region);
  });
  
  // Create the final data array with ordered regions and Athens average at the end
  const sortedData = [...orderedRegionData];
  if (athensAverage) {
    sortedData.push(athensAverage);
  }

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{t("Price per Square Meter Matrix")}</h3>
      <p className="text-sm text-muted-foreground mb-6">
        {t("Average price per square meter in each region")}
      </p>
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="w-[180px] text-muted-foreground">{t("Region")}</TableHead>
              <TableHead className="text-right text-muted-foreground">{t("Min Price/m²")}</TableHead>
              <TableHead className="text-right text-muted-foreground">{t("Average Price/m²")}</TableHead>
              <TableHead className="text-right text-muted-foreground">{t("Max Price/m²")}</TableHead>
              <TableHead className="text-right text-muted-foreground">{t("Properties")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <RegionPricePerMeterRow key={item.region} item={item} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default PricePerSquareMeterMatrix;
