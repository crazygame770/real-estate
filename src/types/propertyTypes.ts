
export type PropertyType = 'apartment' | 'house' | null;
export type EnergyClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type HeatingType = 'central' | 'independent' | null;
export type SortOption = 'price-high-low' | 'price-low-high' | 'area-high-low' | 'area-low-high' | 'recent-listed' | 'oldest-listed' | '';

export interface FilterState {
  priceRange: [number, number];
  areaRange: [number, number];
  bedroomRange: [number, number];
  bathroomRange: [number, number];
  selectedRegions: { name: string; region: string; color: string; }[];
  sortBy: SortOption;
  propertyType: PropertyType;
}

export interface PropertyFilters extends FilterState {
  propertyType: PropertyType | null;
  floorNumbers: number[];
  yearBuilt: [number, number];
  energyClasses: EnergyClass[];
  regions: { name: string; neighborhood: string[] }[];
  hasParking: boolean | null;
  heatingType: HeatingType | null;
  hasSolarWaterHeater: boolean | null;
  walkabilityScore: [number, number];
  safetyScore: [number, number];
  educationScore: [number, number];
  entertainmentScore: [number, number];
  retailScore: [number, number];
  greenSpacesScore: [number, number];
}

export interface Property {
  id: string;
  title: string;
  price: number;
  property_type: PropertyType;
  floor?: number | null;
  heating_type?: HeatingType | null;
  parking?: boolean | null;
  solar_water_heater: boolean;
  year_built: number;
  energy_class: EnergyClass;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description?: string;
  image_url?: string;
  coordinates: [number, number];
  created_at: string;
  updated_at: string;
  user_id: string;
}
