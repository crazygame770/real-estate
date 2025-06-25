
export interface NeighborhoodData {
  name: string;
  avgPrice: string;
  pricePerMeter: string;
  scores: {
    walkability: number;
    safety: number;
    education: number;
    greenSpaces: number;
    entertainment: number;
    retail: number;
  };
  priceHistory: Array<{
    year: number;
    price: number;
    pricePerMeter: number;
    athensAvg: number;
  }>;
}

export interface PriceData {
  year: number;
  price: number;
  athensAvg: number;
}

export interface ChartLegendItem {
  color: string;
  label: string;
  value: string;
}
