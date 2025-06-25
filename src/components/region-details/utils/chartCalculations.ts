
export const calculateAverages = (data: Array<{ price: number; athensAvg: number }>) => {
  const regionAvg = Math.round(
    data.reduce((acc, curr) => acc + curr.price, 0) / data.length
  );
  const athensAvg = Math.round(
    data.reduce((acc, curr) => acc + curr.athensAvg, 0) / data.length
  );

  return { regionAvg, athensAvg };
};

export const calculateYoYGrowth = (data: Array<{ price: number }>) => {
  const lastYear = data[data.length - 1];
  const previousYear = data[data.length - 2];
  return previousYear
    ? ((lastYear.price - previousYear.price) / previousYear.price * 100).toFixed(1)
    : "0";
};

export const transformPriceData = (data: Array<{ year: number; price: number; athensAvg: number }>) => {
  return data.map(yearData => ({
    ...yearData,
    pricePerMeter: Math.round(yearData.price / 100),
    athensAvgPerMeter: Math.round(yearData.athensAvg / 100)
  }));
};
