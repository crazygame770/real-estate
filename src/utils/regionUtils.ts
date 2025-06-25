
import { regionColors, regionNames } from "@/components/neighborhood/constants";

export const getRegionColor = (regionName: string): string => {
  // Handle the case where regionName might be in a different format
  const normalizedName = regionName.toLowerCase().replace(/ /g, '-');
  
  // Direct match
  if (regionColors[regionName]) {
    return regionColors[regionName];
  } 
  // Normalized match
  else if (regionColors[normalizedName]) {
    return regionColors[normalizedName];
  }
  // Handle special case for athens-average
  else if (regionName === 'athens-average') {
    return '#888888';
  }
  // Default fallback color
  else {
    return '#888888';
  }
};

export const formatPrice = (price: number): string => {
  return `€${Math.round(price).toLocaleString()}`;
};

export const getRegionDisplayName = (regionId: string, t: (key: string) => string): string => {
  return regionId === 'athens-average' ? t('Athens Average') : t(regionNames[regionId] || regionId);
};

// Improved error handling for data transformation
export const ensureArray = <T>(data: T[] | null | undefined): T[] => {
  if (!data) return [];
  if (!Array.isArray(data)) return [];
  return data;
};
