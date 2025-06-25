
export const getRegionDbId = (regionId: string) => {
  const mapping: { [key: string]: string } = {
    'central-athens': 'Central Athens',
    'piraeus-coast': 'Piraeus & Coast',
    'north-attica': 'North Attica',
    'east-attica': 'East Attica',
    'west-attica': 'West Attica',
    'south-athens': 'South Athens',
    'northeast-athens': 'Northeast Athens'
  };
  return mapping[regionId];
};
