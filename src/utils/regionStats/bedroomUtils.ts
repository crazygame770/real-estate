
import { RegionPropertyData } from "@/types/regionTypes";

export const calculateBedroomStats = (properties: RegionPropertyData[]) => {
  const bedroomStats = properties.reduce(
    (
      acc: Record<
        string,
        {
          totalPrice: number;
          totalBedrooms: number;
          count: number;
        }
      >,
      property
    ) => {
      if (!property.bedrooms || property.bedrooms <= 0) return acc;

      const neighborhood = property.neighborhood || "Unknown";
      if (!acc[neighborhood]) {
        acc[neighborhood] = {
          totalPrice: 0,
          totalBedrooms: 0,
          count: 0,
        };
      }

      acc[neighborhood].totalPrice += property.price;
      acc[neighborhood].totalBedrooms += property.bedrooms;
      acc[neighborhood].count += 1;

      return acc;
    },
    {}
  );

  // Calculate region average per bedroom
  const regionTotalPrice = properties.reduce((sum, prop) => sum + (prop.price || 0), 0);
  const regionTotalBedrooms = properties.reduce(
    (sum, prop) => sum + (prop.bedrooms || 0),
    0
  );
  const regionAvgPerBedroom =
    regionTotalBedrooms > 0 ? regionTotalPrice / regionTotalBedrooms : 0;

  const bedroomPricesByNeighborhood = Object.entries(bedroomStats).map(
    ([neighborhood, stats]) => ({
      neighborhood,
      pricePerBedroom:
        stats.totalBedrooms > 0 ? stats.totalPrice / stats.totalBedrooms : 0,
    })
  );

  return {
    bedroomPricesByNeighborhood,
    regionAvgPerBedroom,
  };
};

export const calculateAthensBedroomStats = (properties: RegionPropertyData[]) => {
  // Calculate Athens average per bedroom
  const athensTotalPrice = properties.reduce((sum, prop) => sum + (prop.price || 0), 0);
  const athensTotalBedrooms = properties.reduce(
    (sum, prop) => sum + (prop.bedrooms || 0),
    0
  );
  const athensAvgPerBedroom =
    athensTotalBedrooms > 0 ? athensTotalPrice / athensTotalBedrooms : 0;

  return { athensAvgPerBedroom };
};
