
export const generatePriceHistory = (basePrice: number, basePerMeter: number, growth: number) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, index) => ({
    year: currentYear - 9 + index,
    price: Math.round(basePrice * (1 - (growth * (9 - index)))),
    pricePerMeter: Math.round(basePerMeter * (1 - (growth * (9 - index)))),
    athensAvg: Math.round(380000 * (1 + (0.05 * index)))
  }));
};
