
import { useState } from "react";

interface Property {
  id: number;
  price: number;
  area: number;
  created_at: string;
  historical_prices?: Array<{
    year: number;
    price: number;
  }>;
}

export const usePropertyCalculations = (properties: Property[]) => {
  const calculateAveragePrice = () => {
    const validPrices = properties.flatMap(property => {
      const history = property.historical_prices as Array<{
        year: number;
        price: number;
      }>;
      if (!Array.isArray(history)) return [property.price];
      const price2025 = history.find(h => h.year === 2025)?.price;
      return price2025 ? [price2025] : [property.price];
    });
    return validPrices.length > 0 ? Math.round(validPrices.reduce((acc, price) => acc + price, 0) / validPrices.length) : 0;
  };

  const calculateAveragePricePerMeter = () => {
    const validPrices = properties.flatMap(property => {
      if (!property.area) return [];
      const history = property.historical_prices as Array<{
        year: number;
        price: number;
      }>;
      if (!Array.isArray(history)) return [property.price / property.area];
      const price2025 = history.find(h => h.year === 2025)?.price;
      return price2025 ? [price2025 / property.area] : [property.price / property.area];
    });
    return validPrices.length > 0 ? Math.round(validPrices.reduce((acc, price) => acc + price, 0) / validPrices.length) : 0;
  };

  const calculateAverageDaysListed = () => {
    return properties.length > 0 ? Math.round(properties.reduce((sum, property) => {
      const createdDate = new Date(property.created_at);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - createdDate.getTime());
      return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, 0) / properties.length) : 0;
  };

  return {
    calculateAveragePrice,
    calculateAveragePricePerMeter,
    calculateAverageDaysListed
  };
};
