import { generatePriceHistory } from '../priceCalculations';

export const centralAthensData = {
  id: "central-athens",
  name: "Central Athens",
  color: "#ff4444",
  avgPrice: "€520,000",
  pricePerMeter: "€4,500",
  totalProperties: "330 Properties",
  scores: {
    walkability: 9,
    safety: 8,
    education: 8,
    greenSpaces: 7,
    entertainment: 9,
    retail: 9
  },
  priceHistory: generatePriceHistory(420000, 3800, 0.062),
  neighborhoods: [
    {
      name: "Plaka",
      avgPrice: "€550,000",
      pricePerMeter: "€4,800",
      scores: {
        walkability: 9,
        safety: 8,
        education: 8,
        greenSpaces: 7,
        entertainment: 9,
        retail: 9
      },
      priceHistory: generatePriceHistory(450000, 4000, 0.05)
    },
    {
      name: "Monastiraki",
      avgPrice: "€490,000",
      pricePerMeter: "€4,300",
      scores: {
        walkability: 9,
        safety: 7,
        education: 7,
        greenSpaces: 6,
        entertainment: 9,
        retail: 9
      },
      priceHistory: generatePriceHistory(400000, 3600, 0.05)
    },
    {
      name: "Kolonaki",
      avgPrice: "€580,000",
      pricePerMeter: "€5,000",
      scores: {
        walkability: 9,
        safety: 9,
        education: 9,
        greenSpaces: 8,
        entertainment: 9,
        retail: 9
      },
      priceHistory: generatePriceHistory(480000, 4300, 0.05)
    },
    {
      name: "Psiri",
      avgPrice: "€440,000",
      pricePerMeter: "€3,900",
      scores: {
        walkability: 9,
        safety: 7,
        education: 7,
        greenSpaces: 6,
        entertainment: 9,
        retail: 9
      },
      priceHistory: generatePriceHistory(370000, 3400, 0.05)
    },
    {
      name: "Exarchia",
      avgPrice: "€420,000",
      pricePerMeter: "€3,800",
      scores: {
        walkability: 8,
        safety: 6,
        education: 7,
        greenSpaces: 5,
        entertainment: 9,
        retail: 8
      },
      priceHistory: generatePriceHistory(350000, 3200, 0.05)
    },
    {
      name: "Omonia",
      avgPrice: "€380,000",
      pricePerMeter: "€3,400",
      scores: {
        walkability: 9,
        safety: 5,
        education: 6,
        greenSpaces: 4,
        entertainment: 9,
        retail: 9
      },
      priceHistory: generatePriceHistory(320000, 2900, 0.05)
    },
    {
      name: "Thiseio",
      avgPrice: "€510,000",
      pricePerMeter: "€4,400",
      scores: {
        walkability: 9,
        safety: 8,
        education: 8,
        greenSpaces: 7,
        entertainment: 9,
        retail: 9
      },
      priceHistory: generatePriceHistory(430000, 3800, 0.05)
    },
    {
      name: "Pagrati",
      avgPrice: "€480,000",
      pricePerMeter: "€4,200",
      scores: {
        walkability: 9,
        safety: 7,
        education: 8,
        greenSpaces: 7,
        entertainment: 9,
        retail: 9
      },
      priceHistory: generatePriceHistory(400000, 3600, 0.05)
    },
    {
      name: "Mets",
      avgPrice: "€470,000",
      pricePerMeter: "€4,100",
      scores: {
        walkability: 9,
        safety: 8,
        education: 8,
        greenSpaces: 7,
        entertainment: 9,
        retail: 9
      },
      priceHistory: generatePriceHistory(390000, 3500, 0.05)
    }
  ]
};
