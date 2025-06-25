
interface NeighborhoodBounds {
  center: [number, number];
  radius: number; // in kilometers
}

interface RegionBounds {
  [key: string]: {
    [key: string]: NeighborhoodBounds;
  };
}

export const neighborhoodBounds: RegionBounds = {
  "Central Athens": {
    "Plaka": { center: [23.7275, 37.9738], radius: 0.5 },
    "Monastiraki": { center: [23.7250, 37.9760], radius: 0.4 },
    "Kolonaki": { center: [23.7389, 37.9776], radius: 0.6 },
    "Psiri": { center: [23.7225, 37.9786], radius: 0.4 },
    "Exarchia": { center: [23.7336, 37.9868], radius: 0.5 },
    "Omonia": { center: [23.7283, 37.9841], radius: 0.4 },
    "Thisio": { center: [23.7208, 37.9775], radius: 0.5 },
    "Pagrati": { center: [23.7486, 37.9673], radius: 0.7 },
    "Mets": { center: [23.7375, 37.9675], radius: 0.4 }
  },
  "Piraeus & Coast": {
    "Piraeus Center": { center: [23.6470, 37.9428], radius: 0.8 },
    "Kastella": { center: [23.6445, 37.9350], radius: 0.5 },
    "Pasalimani": { center: [23.6482, 37.9366], radius: 0.4 },
    "Mikrolimano": { center: [23.6466, 37.9341], radius: 0.3 },
    "Voula": { center: [23.7683, 37.8417], radius: 0.9 },
    "Glyfada": { center: [23.7545, 37.8686], radius: 1.0 }
  },
  // ... Add coordinates for other neighborhoods as needed
};

export const generateRandomCoordinates = (
  center: [number, number],
  radiusKm: number
): [number, number] => {
  // Convert radius from km to degrees (approximate)
  const radiusLng = radiusKm / 111.32;
  const radiusLat = radiusKm / (111.32 * Math.cos(center[1] * Math.PI / 180));

  // Generate random coordinates within the radius
  const randomLng = center[0] + (Math.random() - 0.5) * 2 * radiusLng;
  const randomLat = center[1] + (Math.random() - 0.5) * 2 * radiusLat;

  return [randomLng, randomLat];
};
