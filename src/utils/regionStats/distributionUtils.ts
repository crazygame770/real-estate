
import { RegionPropertyData } from "@/types/regionTypes";

export const calculatePropertyTypeDistribution = (properties: RegionPropertyData[]) => {
  const propertyTypes = properties.reduce((acc: Record<string, number>, property) => {
    const type = property.property_type || "Unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(propertyTypes).map(([name, value]) => ({
    name: name === "house" ? "Houses" : "Apartments",
    value,
    percentage: ((value / properties.length) * 100).toFixed(1),
  }));
};

export const calculateNeighborhoodDistribution = (properties: RegionPropertyData[]) => {
  const neighborhoods = properties.reduce((acc: Record<string, number>, property) => {
    const neighborhood = property.neighborhood || "Unknown";
    acc[neighborhood] = (acc[neighborhood] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(neighborhoods).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / properties.length) * 100).toFixed(1),
  }));
};
