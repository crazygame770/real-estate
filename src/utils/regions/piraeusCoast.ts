import { generatePriceHistory } from '../priceCalculations';

export const piraeusCoastData = {
  id: "piraeus-coast",
  name: "Piraeus & Coast",
  color: "#9933CC",
  avgPrice: "€380,000",
  pricePerMeter: "€3,300",
  totalProperties: "300 Properties",
  scores: {
    walkability: 8,
    safety: 7,
    education: 7,
    greenSpaces: 8,
    entertainment: 8,
    retail: 8
  },
  priceHistory: generatePriceHistory(320000, 2800, 0.048),
  neighborhoods: [
    {
      name: "Piraeus Center",
      avgPrice: "€360,000",
      pricePerMeter: "€3,200",
      scores: {
        walkability: 8,
        safety: 7,
        education: 7,
        greenSpaces: 7,
        entertainment: 8,
        retail: 8
      },
      priceHistory: generatePriceHistory(300000, 2700, 0.05)
    },
    {
      name: "Kastella",
      avgPrice: "€420,000",
      pricePerMeter: "€3,600",
      scores: {
        walkability: 9,
        safety: 8,
        education: 8,
        greenSpaces: 8,
        entertainment: 9,
        retail: 8
      },
      priceHistory: generatePriceHistory(350000, 3100, 0.05)
    },
    {
      name: "Pasalimani",
      avgPrice: "€400,000",
      pricePerMeter: "€3,400",
      scores: {
        walkability: 8,
        safety: 7,
        education: 7,
        greenSpaces: 7,
        entertainment: 8,
        retail: 8
      },
      priceHistory: generatePriceHistory(330000, 2900, 0.05)
    },
    {
      name: "Mikrolimano",
      avgPrice: "€430,000",
      pricePerMeter: "€3,700",
      scores: {
        walkability: 8,
        safety: 8,
        education: 7,
        greenSpaces: 8,
        entertainment: 9,
        retail: 8
      },
      priceHistory: generatePriceHistory(360000, 3200, 0.05)
    },
    {
      name: "Voula",
      avgPrice: "€480,000",
      pricePerMeter: "€4,100",
      scores: {
        walkability: 7,
        safety: 9,
        education: 9,
        greenSpaces: 8,
        entertainment: 8,
        retail: 8
      },
      priceHistory: generatePriceHistory(400000, 3600, 0.05)
    },
    {
      name: "Glyfada",
      avgPrice: "€520,000",
      pricePerMeter: "€4,400",
      scores: {
        walkability: 7,
        safety: 9,
        education: 9,
        greenSpaces: 8,
        entertainment: 9,
        retail: 9
      },
      priceHistory: generatePriceHistory(440000, 3900, 0.05)
    }
  ]
};
