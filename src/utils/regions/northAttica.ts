import { generatePriceHistory } from '../priceCalculations';

export const northAtticaData = {
  id: "north-attica",
  name: "North Attica",
  color: "#3366ff",
  avgPrice: "€450,000",
  pricePerMeter: "€3,900",
  totalProperties: "300 Properties",
  scores: {
    walkability: 7,
    safety: 9,
    education: 9,
    greenSpaces: 9,
    entertainment: 7,
    retail: 8
  },
  priceHistory: generatePriceHistory(380000, 3300, 0.055),
  neighborhoods: [
    {
      name: "Kifisia",
      avgPrice: "€580,000",
      pricePerMeter: "€4,800",
      scores: {
        walkability: 7,
        safety: 9,
        education: 9,
        greenSpaces: 9,
        entertainment: 8,
        retail: 8
      },
      priceHistory: generatePriceHistory(480000, 4100, 0.05)
    },
    {
      name: "Marousi",
      avgPrice: "€480,000",
      pricePerMeter: "€4,200",
      scores: {
        walkability: 7,
        safety: 9,
        education: 9,
        greenSpaces: 8,
        entertainment: 7,
        retail: 8
      },
      priceHistory: generatePriceHistory(400000, 3600, 0.05)
    },
    {
      name: "Chalandri",
      avgPrice: "€450,000",
      pricePerMeter: "€3,900",
      scores: {
        walkability: 7,
        safety: 9,
        education: 9,
        greenSpaces: 8,
        entertainment: 7,
        retail: 8
      },
      priceHistory: generatePriceHistory(380000, 3400, 0.05)
    },
    {
      name: "Agia Paraskevi",
      avgPrice: "€420,000",
      pricePerMeter: "€3,600",
      scores: {
        walkability: 7,
        safety: 9,
        education: 9,
        greenSpaces: 8,
        entertainment: 7,
        retail: 8
      },
      priceHistory: generatePriceHistory(350000, 3100, 0.05)
    }
  ]
};
