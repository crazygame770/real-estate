
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { useState } from "react";

interface NeighborhoodPriceMatrixProps {
  neighborhoodData: Array<{
    name: string;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    pricePerMeter: number;
    minPricePerMeter: number;
    maxPricePerMeter: number;
  }>;
  regionAvg: {
    price: number;
    pricePerMeter: number;
    minPrice: number;
    maxPrice: number;
    minPricePerMeter: number;
    maxPricePerMeter: number;
  };
  athensAvg: {
    price: number;
    pricePerMeter: number;
    minPrice: number;
    maxPrice: number;
    minPricePerMeter: number;
    maxPricePerMeter: number;
  };
  color: string;
}

export const NeighborhoodPriceMatrix = ({ 
  neighborhoodData = [],
  regionAvg,
  athensAvg,
  color
}: NeighborhoodPriceMatrixProps) => {
  const { t } = useLanguage();
  
  if (!neighborhoodData || neighborhoodData.length === 0 || !regionAvg || !athensAvg) {
    return (
      <Card className="p-6 mb-8 bg-[#1A1F2C] text-white border-none">
        <h3 className="text-lg font-semibold mb-4 text-white">{t("Neighborhood Price Analysis")}</h3>
        <div className="text-gray-400">
          <p>{t("No neighborhood data available")}</p>
        </div>
      </Card>
    );
  }

  // Format price to display
  const formatPrice = (price: number) => {
    if (isNaN(price) || !isFinite(price)) return '-';
    return `€${Math.round(price).toLocaleString('de-DE')}`;
  };

  // Sort neighborhoods alphabetically
  const sortedNeighborhoods = [...neighborhoodData].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  // Group all table-based matrices together first
  
  // 1. Price Table Matrix
  const PriceTableMatrix = () => {
    // Track hovered rows
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    return (
      <Card className="p-6 mb-8 bg-[#1A1F2C] text-white border-none">
        <h3 className="text-lg font-semibold mb-4 text-white">{t("Neighborhood Price Matrix")}</h3>
        <p className="text-sm text-gray-400 mb-6">
          {t("Average property prices in each neighborhood")}
        </p>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="w-[180px] text-gray-400">{t("Neighborhood")}</TableHead>
                <TableHead className="text-right text-gray-400">{t("Min Price (€)")}</TableHead>
                <TableHead className="text-right text-gray-400">{t("Average Price (€)")}</TableHead>
                <TableHead className="text-right text-gray-400">{t("Max Price (€)")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedNeighborhoods.map((item) => (
                <TableRow 
                  key={`price-${item.name}`}
                  className="border-gray-700/50 hover:bg-gray-800/30"
                  style={{
                    backgroundColor: hoveredRow === item.name ? `${color}20` : 'transparent'
                  }}
                  onMouseEnter={() => setHoveredRow(item.name)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell className="py-2 px-4 flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: color
                      }}
                    />
                    <span className="text-white">
                      {t(item.name)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-2 px-4 text-white">{formatPrice(item.minPrice)}</TableCell>
                  <TableCell className="text-right py-2 px-4 font-medium text-white">{formatPrice(item.avgPrice)}</TableCell>
                  <TableCell className="text-right py-2 px-4 text-white">{formatPrice(item.maxPrice)}</TableCell>
                </TableRow>
              ))}
              {/* Region Average Row */}
              <TableRow 
                className="border-gray-700/50"
                style={{
                  backgroundColor: hoveredRow === "region-avg" ? `${color}30` : `${color}20`
                }}
                onMouseEnter={() => setHoveredRow("region-avg")}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="py-2 px-4 flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: color
                    }}
                  />
                  <span className="text-white font-medium">
                    {t("Region Avg")}
                  </span>
                </TableCell>
                <TableCell className="text-right py-2 px-4 text-white">{formatPrice(regionAvg.minPrice)}</TableCell>
                <TableCell className="text-right py-2 px-4 font-medium text-white">{formatPrice(regionAvg.price)}</TableCell>
                <TableCell className="text-right py-2 px-4 text-white">{formatPrice(regionAvg.maxPrice)}</TableCell>
              </TableRow>
              {/* Athens Average Row */}
              <TableRow 
                className="border-gray-700/50"
                style={{
                  backgroundColor: hoveredRow === "athens-avg" ? '#88888830' : '#88888820'
                }}
                onMouseEnter={() => setHoveredRow("athens-avg")}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="py-2 px-4 flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: "#888888"
                    }}
                  />
                  <span className="text-white font-medium">
                    {t("Athens Avg")}
                  </span>
                </TableCell>
                <TableCell className="text-right py-2 px-4 text-white">{formatPrice(athensAvg.minPrice)}</TableCell>
                <TableCell className="text-right py-2 px-4 font-medium text-white">{formatPrice(athensAvg.price)}</TableCell>
                <TableCell className="text-right py-2 px-4 text-white">{formatPrice(athensAvg.maxPrice)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  };

  // 2. Price Per Meter Table Matrix
  const PricePerMeterTableMatrix = () => {
    // Track hovered rows
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);

    return (
      <Card className="p-6 mb-8 bg-[#1A1F2C] text-white border-none">
        <h3 className="text-lg font-semibold mb-4 text-white">{t("Price per m² Matrix")}</h3>
        <p className="text-sm text-gray-400 mb-6">
          {t("Average price per square meter in each neighborhood")}
        </p>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="w-[180px] text-gray-400">{t("Neighborhood")}</TableHead>
                <TableHead className="text-right text-gray-400">{t("Min €/m²")}</TableHead>
                <TableHead className="text-right text-gray-400">{t("Average €/m²")}</TableHead>
                <TableHead className="text-right text-gray-400">{t("Max €/m²")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedNeighborhoods.map((item) => (
                <TableRow 
                  key={`ppm-${item.name}`}
                  className="border-gray-700/50 hover:bg-gray-800/30"
                  style={{
                    backgroundColor: hoveredRow === item.name ? `${color}20` : 'transparent'
                  }}
                  onMouseEnter={() => setHoveredRow(item.name)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell className="py-2 px-4 flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: color
                      }}
                    />
                    <span className="text-white">
                      {t(item.name)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-2 px-4 text-white">{formatPrice(item.minPricePerMeter)}</TableCell>
                  <TableCell className="text-right py-2 px-4 font-medium text-white">{formatPrice(item.pricePerMeter)}</TableCell>
                  <TableCell className="text-right py-2 px-4 text-white">{formatPrice(item.maxPricePerMeter)}</TableCell>
                </TableRow>
              ))}
              {/* Region Average Row */}
              <TableRow 
                className="border-gray-700/50"
                style={{
                  backgroundColor: hoveredRow === "region-avg-ppm" ? `${color}30` : `${color}20`
                }}
                onMouseEnter={() => setHoveredRow("region-avg-ppm")}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="py-2 px-4 flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: color
                    }}
                  />
                  <span className="text-white font-medium">
                    {t("Region Avg")}
                  </span>
                </TableCell>
                <TableCell className="text-right py-2 px-4 text-white">{formatPrice(regionAvg.minPricePerMeter)}</TableCell>
                <TableCell className="text-right py-2 px-4 font-medium text-white">{formatPrice(regionAvg.pricePerMeter)}</TableCell>
                <TableCell className="text-right py-2 px-4 text-white">{formatPrice(regionAvg.maxPricePerMeter)}</TableCell>
              </TableRow>
              {/* Athens Average Row */}
              <TableRow 
                className="border-gray-700/50"
                style={{
                  backgroundColor: hoveredRow === "athens-avg-ppm" ? '#88888830' : '#88888820'
                }}
                onMouseEnter={() => setHoveredRow("athens-avg-ppm")}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell className="py-2 px-4 flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: "#888888"
                    }}
                  />
                  <span className="text-white font-medium">
                    {t("Athens Avg")}
                  </span>
                </TableCell>
                <TableCell className="text-right py-2 px-4 text-white">{formatPrice(athensAvg.minPricePerMeter)}</TableCell>
                <TableCell className="text-right py-2 px-4 font-medium text-white">{formatPrice(athensAvg.pricePerMeter)}</TableCell>
                <TableCell className="text-right py-2 px-4 text-white">{formatPrice(athensAvg.maxPricePerMeter)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  };

  // 3. Price Grid Matrix
  const PriceGridMatrix = () => {
    return (
      <Card className="p-6 mb-8 bg-[#1A1F2C] text-white border-none">
        <h3 className="text-lg font-semibold mb-4 text-white">{t("Average Property Price")}</h3>
        <p className="text-sm text-gray-400 mb-4">
          {t("Average price in each neighborhood")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedNeighborhoods.map((neighborhood) => (
            <div
              key={neighborhood.name}
              className="relative p-4 rounded-lg border border-red-500/30 transition-transform hover:shadow-md hover:-translate-y-1 bg-[#1A1F2C]"
            >
              <div className="space-y-2">
                <h4 className="font-medium text-gray-300 text-sm">
                  {t(neighborhood.name)}
                </h4>
                <p className="text-white text-lg font-bold">
                  {formatPrice(neighborhood.avgPrice)}
                </p>
              </div>
            </div>
          ))}

          {/* Region Average */}
          <div
            className="relative p-4 rounded-lg border transition-transform hover:shadow-md hover:-translate-y-1 bg-[#1A1F2C]"
            style={{
              borderColor: color,
              borderWidth: "2px"
            }}
          >
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-300 text-sm">
                {t("Region Avg")}
              </h4>
              <p className="text-white text-lg font-bold">
                {formatPrice(regionAvg.price)}
              </p>
            </div>
          </div>

          {/* Athens Average */}
          <div
            className="relative p-4 rounded-lg border transition-transform hover:shadow-md hover:-translate-y-1 bg-[#1A1F2C]"
            style={{
              borderColor: "#8E9196",
              borderWidth: "2px"
            }}
          >
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-300 text-sm">
                {t("Athens Avg")}
              </h4>
              <p className="text-white text-lg font-bold">
                {formatPrice(athensAvg.price)}
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  };
  
  // 4. Price Per Meter Grid Matrix
  const PricePerMeterGridMatrix = () => {
    return (
      <Card className="p-6 mb-8 bg-[#1A1F2C] text-white border-none">
        <h3 className="text-lg font-semibold mb-4 text-white">{t("Average Price per m²")}</h3>
        <p className="text-sm text-gray-400 mb-4">
          {t("Average price per square meter in each neighborhood")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedNeighborhoods.map((neighborhood) => (
            <div
              key={`ppm-${neighborhood.name}`}
              className="relative p-4 rounded-lg border border-red-500/30 transition-transform hover:shadow-md hover:-translate-y-1 bg-[#1A1F2C]"
            >
              <div className="space-y-2">
                <h4 className="font-medium text-gray-300 text-sm">
                  {t(neighborhood.name)}
                </h4>
                <p className="text-white text-lg font-bold">
                  {formatPrice(neighborhood.pricePerMeter)}/m²
                </p>
              </div>
            </div>
          ))}

          {/* Region Average */}
          <div
            className="relative p-4 rounded-lg border transition-transform hover:shadow-md hover:-translate-y-1 bg-[#1A1F2C]"
            style={{
              borderColor: color,
              borderWidth: "2px"
            }}
          >
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-300 text-sm">
                {t("Region Avg")}
              </h4>
              <p className="text-white text-lg font-bold">
                {formatPrice(regionAvg.pricePerMeter)}/m²
              </p>
            </div>
          </div>

          {/* Athens Average */}
          <div
            className="relative p-4 rounded-lg border transition-transform hover:shadow-md hover:-translate-y-1 bg-[#1A1F2C]"
            style={{
              borderColor: "#8E9196",
              borderWidth: "2px"
            }}
          >
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-300 text-sm">
                {t("Athens Avg")}
              </h4>
              <p className="text-white text-lg font-bold">
                {formatPrice(athensAvg.pricePerMeter)}/m²
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // First render all tables, then all grid views
  return (
    <>
      <PriceTableMatrix />
      <PricePerMeterTableMatrix />
      <PriceGridMatrix />
      <PricePerMeterGridMatrix />
    </>
  );
};
