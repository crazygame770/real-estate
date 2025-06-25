import { generatePriceHistory } from '../priceCalculations';

export const northeastAthensData = {
  id: "northeast-athens",
  name: "Northeast Athens",
  color: "#2BBBAD",
  avgPrice: "€460,000",
  pricePerMeter: "€4,000",
  totalProperties: "300 Properties",
  scores: {
    walkability: 8,
    safety: 9,
    education: 9,
    greenSpaces: 8,
    entertainment: 7,
    retail: 8
  },
  priceHistory: generatePriceHistory(390000, 3400, 0.056),
  neighborhoods: [
    {
      name: "Neo Psychiko",
      avgPrice: "€480,000",
      pricePerMeter: "€4,200",
      scores: {
        walkability: 8,
        safety: 9,
        education: 9,
        greenSpaces: 8,
        entertainment: 7,
        retail: 8
      },
      priceHistory: generatePriceHistory(410000, 3700, 0.05)
    },
    {
      name: "Cholargos",
      avgPrice: "€440,000",
      pricePerMeter: "€3,800",
      scores: {
        walkability: 8,
        safety: 9,
        education: 9,
        greenSpaces: 8,
        entertainment: 7,
        retail: 8
      },
      priceHistory: generatePriceHistory(370000, 3300, 0.05)
    },
    {
      name: "Papagou",
      avgPrice: "€460,000",
      pricePerMeter: "€4,000",
      scores: {
        walkability: 8,
        safety: 9,
        education: 9,
        greenSpaces: 8,
        entertainment: 7,
        retail: 8
      },
      priceHistory: generatePriceHistory(390000, 3500, 0.05)
    },
    {
      name: "Filothei",
      avgPrice: "€550,000",
      pricePerMeter: "€4,800",
      scores: {
        walkability: 8,
        safety: 9,
        education: 9,
        greenSpaces: 9,
        entertainment: 8,
        retail: 9
      },
      priceHistory: generatePriceHistory(470000, 4200, 0.05)
    }
  ]
};
