
export interface PriceData {
  year: string;
  price: number;
  marketAvg: number;
  neighborhoodAvg: number;
  regionAvg: number;
  athensAvg: number;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: PriceData;
    dataKey: string;
  }>;
  label?: string;
}
