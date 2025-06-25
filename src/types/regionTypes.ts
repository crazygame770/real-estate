
export interface RegionPropertyData {
  historical_prices: Array<{ year: number; price: number }>;
  region: string;
  area: number;
  property_type: string;
  neighborhood: string;
  price: number;
  bedrooms: number;
}

export interface RegionPriceStats {
  price: number;
  pricePerMeter: number;
  minPrice: number;
  maxPrice: number;
  minPricePerMeter: number;
  maxPricePerMeter: number;
}

export interface NeighborhoodPriceData {
  name: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  pricePerMeter: number;
  minPricePerMeter: number;
  maxPricePerMeter: number;
}

export interface BedroomPriceData {
  neighborhood: string;
  pricePerBedroom: number;
}

export interface DistributionData {
  name: string;
  value: number;
  percentage: string;
}
