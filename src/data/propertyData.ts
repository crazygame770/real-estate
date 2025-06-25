
import { 
  ShoppingBag, School, Shield, 
  Trees, PartyPopper, Footprints,
  Car, Zap, Home
} from "lucide-react";

export const property = {
  id: 1,
  title: "Beautiful Family House",
  price: "€450,000",
  address: "123 Syntagma Square",
  propertyType: "house",
  totalFloors: 2,
  yearBuilt: 1995,
  energyClass: "B",
  bedrooms: 3,
  bathrooms: 2,
  area: 120,
  listedOn: "2024-01-15",
  parking: "Available",
  daysListed: 400,
  description: "This beautiful property in 123 Syntagma Square offers 3 bedrooms and 2 bathrooms across 120m² of thoughtfully designed living space.",
  image: "/lovable-uploads/d6196adb-a4cf-462e-a0fd-2776b19aafef.png",
  pricePerMeter: 3750,
  neighborhoodPricePerMeter: 3542,
  marketPosition: "+6%",
  tenYearGrowth: "+18%",
  floor: null,
  heatingType: null,
  solarWaterHeater: true,
  features: [
    { icon: Car, label: "Parking", value: "Available" },
    { icon: Zap, label: "Solar Water Heater", value: "Yes" },
    { icon: Home, label: "Property Type", value: "Single Family House" }
  ],
  neighborhoodPosition: "+3%",
  coordinates: [23.7383, 37.9838] as [number, number]
};

export const priceHistoryData = [
  { year: '2015', price: 350000, marketAvg: 340000, neighborhoodAvg: 345000, regionAvg: 342000, athensAvg: 338000 },
  { year: '2016', price: 355000, marketAvg: 345000, neighborhoodAvg: 350000, regionAvg: 347000, athensAvg: 343000 },
  { year: '2017', price: 360000, marketAvg: 350000, neighborhoodAvg: 355000, regionAvg: 352000, athensAvg: 348000 },
  { year: '2018', price: 365000, marketAvg: 355000, neighborhoodAvg: 360000, regionAvg: 357000, athensAvg: 353000 },
  { year: '2019', price: 370000, marketAvg: 360000, neighborhoodAvg: 365000, regionAvg: 362000, athensAvg: 358000 },
  { year: '2020', price: 385000, marketAvg: 375000, neighborhoodAvg: 380000, regionAvg: 377000, athensAvg: 373000 },
  { year: '2021', price: 400000, marketAvg: 390000, neighborhoodAvg: 395000, regionAvg: 392000, athensAvg: 388000 },
  { year: '2022', price: 425000, marketAvg: 405000, neighborhoodAvg: 415000, regionAvg: 410000, athensAvg: 400000 },
  { year: '2023', price: 440000, marketAvg: 415000, neighborhoodAvg: 425000, regionAvg: 420000, athensAvg: 410000 },
  { year: '2024', price: 450000, marketAvg: 425000, neighborhoodAvg: 435000, regionAvg: 430000, athensAvg: 420000 },
];

export const pricePerMeterData = [
  { year: '2015', price: 2900, marketAvg: 2850, neighborhoodAvg: 2875, regionAvg: 2860, athensAvg: 2830 },
  { year: '2016', price: 2950, marketAvg: 2900, neighborhoodAvg: 2925, regionAvg: 2910, athensAvg: 2880 },
  { year: '2017', price: 3000, marketAvg: 2950, neighborhoodAvg: 2975, regionAvg: 2960, athensAvg: 2930 },
  { year: '2018', price: 3050, marketAvg: 3000, neighborhoodAvg: 3025, regionAvg: 3010, athensAvg: 2980 },
  { year: '2019', price: 3100, marketAvg: 3050, neighborhoodAvg: 3075, regionAvg: 3060, athensAvg: 3030 },
  { year: '2020', price: 3200, marketAvg: 3150, neighborhoodAvg: 3175, regionAvg: 3160, athensAvg: 3130 },
  { year: '2021', price: 3350, marketAvg: 3250, neighborhoodAvg: 3300, regionAvg: 3280, athensAvg: 3230 },
  { year: '2022', price: 3500, marketAvg: 3400, neighborhoodAvg: 3450, regionAvg: 3430, athensAvg: 3380 },
  { year: '2023', price: 3650, marketAvg: 3500, neighborhoodAvg: 3575, regionAvg: 3550, athensAvg: 3480 },
  { year: '2024', price: 3750, marketAvg: 3542, neighborhoodAvg: 3650, regionAvg: 3600, athensAvg: 3520 },
];

export const neighborhoodScores = [
  { 
    category: "Walkability",
    score: 9,
    icon: Footprints,
    description: "Walking distance to essential amenities and public transport"
  },
  { 
    category: "Safety",
    score: 8,
    icon: Shield,
    description: "Crime rates and overall security in the area"
  },
  { 
    category: "Education",
    score: 7,
    icon: School,
    description: "Quality of public schools and educational facilities"
  },
  { 
    category: "Green Spaces",
    score: 6,
    icon: Trees,
    description: "Access to parks, playgrounds, and green spaces"
  },
  { 
    category: "Entertainment",
    score: 8,
    icon: PartyPopper,
    description: "Proximity to restaurants, bars, and entertainment"
  },
  { 
    category: "Retail Access",
    score: 8,
    icon: ShoppingBag,
    description: "Access to retail stores and shopping centers"
  },
];
