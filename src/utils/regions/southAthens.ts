import { generatePriceHistory } from '../priceCalculations';

export const southAthensData = {
  id: "south-athens",
  name: "South Athens",
  color: "#FF8800",
  avgPrice: "€400,000",
  pricePerMeter: "€3,500",
  totalProperties: "300 Properties",
  scores: {
    walkability: 8,
    safety: 8,
    education: 8,
    greenSpaces: 7,
    entertainment: 8,
    retail: 8
  },
  priceHistory: generatePriceHistory(340000, 3000, 0.05),
  neighborhoods: [
    {
      name: "Kallithea",
      avgPrice: "€380,000",
      pricePerMeter: "€3,300",
      scores: {
        walkability: 8,
        safety: 8,
        education: 8,
        greenSpaces: 7,
        entertainment: 8,
        retail: 8
      },
      priceHistory: generatePriceHistory(320000, 2800, 0.05)
    },
    {
      name: "Nea Smyrni",
      avgPrice: "€420,000",
      pricePerMeter: "€3,600",
      scores: {
        walkability: 8,
        safety: 9,
        education: 9,
        greenSpaces: 8,
        entertainment: 8,
        retail: 8
      },
      priceHistory: generatePriceHistory(350000, 3100, 0.05)
    },
    {
      name: "Palaio Faliro",
      avgPrice: "€450,000",
      pricePerMeter: "€3,900",
      scores: {
        walkability: 9,
        safety: 8,
        education: 8,
        greenSpaces: 7,
        entertainment: 9,
        retail: 9
      },
      priceHistory: generatePriceHistory(380000, 3400, 0.05)
    },
    {
      name: "Alimos",
      avgPrice: "€400,000",
      pricePerMeter: "€3,400",
      scores: {
        walkability: 7,
        safety: 7,
        education: 7,
        greenSpaces: 7,
        entertainment: 7,
        retail: 7
      },
      priceHistory: generatePriceHistory(330000, 2900, 0.05)
    }
  ]
};
