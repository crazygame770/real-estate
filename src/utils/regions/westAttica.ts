
import { generatePriceHistory } from '../priceCalculations';

export const westAtticaData = {
  id: "west-attica",
  name: "West Attica",
  color: "#00C851",
  avgPrice: "€350,000",
  pricePerMeter: "€3,000",
  totalProperties: "300 Properties",
  scores: {
    walkability: 7,
    safety: 7,
    education: 7,
    greenSpaces: 6,
    entertainment: 7,
    retail: 8
  },
  priceHistory: generatePriceHistory(300000, 2600, 0.045),
  neighborhoods: [
    {
      name: "Peristeri",
      avgPrice: "€320,000",
      pricePerMeter: "€2,800",
      scores: {
        walkability: 7,
        safety: 7,
        education: 7,
        greenSpaces: 6,
        entertainment: 7,
        retail: 8
      },
      priceHistory: generatePriceHistory(270000, 2400, 0.05)
    },
    {
      name: "Aigaleo",
      avgPrice: "€300,000",
      pricePerMeter: "€2,600",
      scores: {
        walkability: 7,
        safety: 7,
        education: 7,
        greenSpaces: 6,
        entertainment: 7,
        retail: 8
      },
      priceHistory: generatePriceHistory(250000, 2200, 0.05)
    },
    {
      name: "Petroupoli",
      avgPrice: "€330,000",
      pricePerMeter: "€2,900",
      scores: {
        walkability: 7,
        safety: 7,
        education: 7,
        greenSpaces: 6,
        entertainment: 7,
        retail: 8
      },
      priceHistory: generatePriceHistory(280000, 2500, 0.05)
    },
    {
      name: "Chaidari",
      avgPrice: "€340,000",
      pricePerMeter: "€3,000",
      scores: {
        walkability: 7,
        safety: 7,
        education: 7,
        greenSpaces: 6,
        entertainment: 7,
        retail: 8
      },
      priceHistory: generatePriceHistory(290000, 2600, 0.05)
    }
  ]
};
