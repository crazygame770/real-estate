import { generatePriceHistory } from '../priceCalculations';

export const eastAtticaData = {
  id: "east-attica",
  name: "East Attica",
  color: "#33b5e5",  // Updated to match main menu
  avgPrice: "€420,000",
  pricePerMeter: "€3,600",
  totalProperties: "300 Properties",
  scores: {
    walkability: 6,
    safety: 8,
    education: 8,
    greenSpaces: 9,
    entertainment: 6,
    retail: 7
  },
  priceHistory: generatePriceHistory(350000, 3100, 0.051),
  neighborhoods: [
    {
      name: "Pallini",
      avgPrice: "€400,000",
      pricePerMeter: "€3,500",
      scores: {
        walkability: 6,
        safety: 8,
        education: 8,
        greenSpaces: 9,
        entertainment: 6,
        retail: 7
      },
      priceHistory: generatePriceHistory(340000, 3000, 0.05)
    },
    {
      name: "Gerakas",
      avgPrice: "€380,000",
      pricePerMeter: "€3,300",
      scores: {
        walkability: 6,
        safety: 8,
        education: 8,
        greenSpaces: 9,
        entertainment: 6,
        retail: 7
      },
      priceHistory: generatePriceHistory(320000, 2800, 0.05)
    },
    {
      name: "Glyka Nera",
      avgPrice: "€420,000",
      pricePerMeter: "€3,600",
      scores: {
        walkability: 6,
        safety: 8,
        education: 8,
        greenSpaces: 9,
        entertainment: 6,
        retail: 7
      },
      priceHistory: generatePriceHistory(360000, 3200, 0.05)
    },
    {
      name: "Spata",
      avgPrice: "€390,000",
      pricePerMeter: "€3,400",
      scores: {
        walkability: 6,
        safety: 8,
        education: 8,
        greenSpaces: 9,
        entertainment: 6,
        retail: 7
      },
      priceHistory: generatePriceHistory(330000, 2900, 0.05)
    }
  ]
};
