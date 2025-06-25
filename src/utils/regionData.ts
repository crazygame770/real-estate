
import { centralAthensData as central } from './regions/centralAthens';
import { piraeusCoastData as piraeus } from './regions/piraeusCoast';
import { northAtticaData as north } from './regions/northAttica';
import { eastAtticaData as east } from './regions/eastAttica';
import { westAtticaData as west } from './regions/westAttica';
import { southAthensData as south } from './regions/southAthens';
import { northeastAthensData as northeast } from './regions/northeastAthens';

export const centralAthensData = central;
export const piraeusCoastData = piraeus;
export const northAtticaData = north;
export const eastAtticaData = east;
export const westAtticaData = west;
export const southAthensData = south;
export const northeastAthensData = northeast;

export { generatePriceHistory } from './priceCalculations';

export const getRegionData = (regionId: string) => {
  const regions = {
    "central-athens": centralAthensData,
    "piraeus-coast": piraeusCoastData,
    "north-attica": northAtticaData,
    "east-attica": eastAtticaData,
    "west-attica": westAtticaData,
    "south-athens": southAthensData,
    "northeast-athens": northeastAthensData
  };

  return regions[regionId as keyof typeof regions];
};
