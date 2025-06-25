
import { RegionPropertyData } from "@/types/regionTypes";

interface YearlyAverages {
  sum: number;
  count: number;
  sumPerMeter: number;
  athensSum: number;
  athensCount: number;
  athensSumPerMeter: number;
}

export interface PriceYearData {
  year: number;
  value: number;
  athensAvg?: number;
}

export const calculateNeighborhoodPriceStats = (
  properties: RegionPropertyData[]
) => {
  const neighborhoodStats = properties.reduce(
    (
      acc: Record<
        string,
        {
          prices: number[];
          areas: number[];
        }
      >,
      property
    ) => {
      const neighborhood = property.neighborhood || "Unknown";
      if (!acc[neighborhood]) {
        acc[neighborhood] = { prices: [], areas: [] };
      }
      acc[neighborhood].prices.push(property.price);
      acc[neighborhood].areas.push(property.area);
      return acc;
    },
    {}
  );

  const neighborhoodPrices = Object.entries(neighborhoodStats).map(([name, stats]) => {
    const pricesPerMeter = stats.prices.map((price, i) => price / stats.areas[i]);
    return {
      name,
      avgPrice: stats.prices.reduce((a, b) => a + b, 0) / stats.prices.length,
      minPrice: Math.min(...stats.prices),
      maxPrice: Math.max(...stats.prices),
      pricePerMeter: pricesPerMeter.reduce((a, b) => a + b, 0) / pricesPerMeter.length,
      minPricePerMeter: Math.min(...pricesPerMeter),
      maxPricePerMeter: Math.max(...pricesPerMeter),
    };
  });

  return neighborhoodPrices;
};

export const calculateRegionPriceStats = (properties: RegionPropertyData[]) => {
  const regionPrices = properties.map((p) => p.price);
  const regionPricesPerMeter = properties.map((p) => p.price / p.area);

  return {
    price: regionPrices.reduce((a, b) => a + b, 0) / regionPrices.length,
    pricePerMeter:
      regionPricesPerMeter.reduce((a, b) => a + b, 0) / regionPricesPerMeter.length,
    minPrice: Math.min(...regionPrices),
    maxPrice: Math.max(...regionPrices),
    minPricePerMeter: Math.min(...regionPricesPerMeter),
    maxPricePerMeter: Math.max(...regionPricesPerMeter),
  };
};

export const calculateAthensPriceStats = (properties: RegionPropertyData[]) => {
  const athensPrices = properties.map((p) => p.price);
  const athensPricesPerMeter = properties.map((p) => p.price / p.area);

  return {
    price: athensPrices.reduce((a, b) => a + b, 0) / athensPrices.length,
    pricePerMeter:
      athensPricesPerMeter.reduce((a, b) => a + b, 0) / athensPricesPerMeter.length,
    minPrice: Math.min(...athensPrices),
    maxPrice: Math.max(...athensPrices),
    minPricePerMeter: Math.min(...athensPricesPerMeter),
    maxPricePerMeter: Math.max(...athensPricesPerMeter),
  };
};

export const calculateYearlyPriceData = (properties: RegionPropertyData[], regionName: string | undefined) => {
  const yearlyAverages = new Map<number, YearlyAverages>();

  properties.forEach((property) => {
    const prices = property.historical_prices as Array<{ year: number; price: number }>;
    const area = property.area || 100;

    prices?.forEach((price) => {
      if (!yearlyAverages.has(price.year)) {
        yearlyAverages.set(price.year, {
          sum: 0,
          count: 0,
          sumPerMeter: 0,
          athensSum: 0,
          athensCount: 0,
          athensSumPerMeter: 0,
        });
      }

      const yearData = yearlyAverages.get(price.year)!;

      // Always count towards Athens average (all properties)
      yearData.athensSum += price.price;
      yearData.athensSumPerMeter += price.price / area;
      yearData.athensCount += 1;

      // Only count region-specific properties for regional average
      if (property.region === regionName) {
        yearData.sum += price.price;
        yearData.sumPerMeter += price.price / area;
        yearData.count += 1;
      }
    });
  });

  const priceDataRaw = Array.from(yearlyAverages.entries())
    .map(([year, data]) => ({
      year,
      value: data.count > 0 ? Math.round(data.sum / data.count) : 0,
      athensAvg: Math.round(data.athensSum / data.athensCount),
    }))
    .sort((a, b) => a.year - b.year)
    .filter((item) => item.value > 0);

  const pricePerMeterDataRaw = Array.from(yearlyAverages.entries())
    .map(([year, data]) => ({
      year,
      value: data.count > 0 ? Math.round(data.sumPerMeter / data.count) : 0,
      athensAvg: Math.round(data.athensSumPerMeter / data.athensCount),
    }))
    .sort((a, b) => a.year - b.year)
    .filter((item) => item.value > 0);

  return { priceDataRaw, pricePerMeterDataRaw };
};
