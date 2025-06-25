
export const parseCoordinates = (coordinates: string | any): [number, number] => {
  if (!coordinates) return [23.7275, 37.9838]; // Default to Athens center
  
  if (typeof coordinates === 'string') {
    // Handle string format like "(23.7275,37.9838)"
    return coordinates.replace(/[()]/g, '').split(',').map(Number) as [number, number];
  } else if (coordinates.x !== undefined && coordinates.y !== undefined) {
    // Handle object format with x, y properties
    return [coordinates.x, coordinates.y];
  }
  
  return [23.7275, 37.9838]; // Default to Athens center
};

export const formatPrice = (price: number) => {
  return price.toLocaleString('de-DE');
};

// Function to ensure consistent calculation of Athens average price
export const calculateAthensAverage = (properties: any[]) => {
  const validPrices = properties
    .filter(p => p.price && p.price > 0)
    .map(p => p.price);
    
  return validPrices.length > 0
    ? validPrices.reduce((a, b) => a + b, 0) / validPrices.length
    : 0;
};

// Function for consistent price per meter calculation
export const calculateAthensAveragePricePerMeter = (properties: any[]) => {
  const validPricesPerMeter = properties
    .filter(p => p.price && p.price > 0 && p.area && p.area > 0)
    .map(p => p.price / p.area);
    
  return validPricesPerMeter.length > 0
    ? validPricesPerMeter.reduce((a, b) => a + b, 0) / validPricesPerMeter.length
    : 0;
};

// Function for consistent price per bedroom calculation
export const calculateAthensAveragePricePerBedroom = (properties: any[]) => {
  const validPricesPerBedroom = properties
    .filter(p => p.price && p.price > 0 && p.bedrooms && p.bedrooms > 0)
    .map(p => p.price / p.bedrooms);
    
  return validPricesPerBedroom.length > 0
    ? validPricesPerBedroom.reduce((a, b) => a + b, 0) / validPricesPerBedroom.length
    : 0;
};

// Function for consistent calculation of region average price
export const calculateRegionAverage = (properties: any[], regionId: string) => {
  const regionProperties = properties.filter(p => p.region === regionId && p.price && p.price > 0);
  
  return regionProperties.length > 0
    ? regionProperties.reduce((sum, p) => sum + p.price, 0) / regionProperties.length
    : 0;
};

// Function for consistent calculation of region price per meter
export const calculateRegionAveragePricePerMeter = (properties: any[], regionId: string) => {
  const regionProperties = properties.filter(
    p => p.region === regionId && 
    p.price && p.price > 0 && 
    p.area && p.area > 0
  );
  
  const pricesPerMeter = regionProperties.map(p => p.price / p.area);
  
  return pricesPerMeter.length > 0
    ? pricesPerMeter.reduce((sum, price) => sum + price, 0) / pricesPerMeter.length
    : 0;
};
