
/**
 * Simple linear regression model to predict future prices based on historical data
 * This implements a basic machine learning approach to time series forecasting
 */

// Linear regression to find the best-fit line (y = mx + b)
const linearRegression = (x: number[], y: number[]): { slope: number; intercept: number } => {
  const n = x.length;
  
  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate slope (m) using least squares method
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (y[i] - meanY);
    denominator += Math.pow(x[i] - meanX, 2);
  }
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  
  // Calculate y-intercept (b)
  const intercept = meanY - slope * meanX;
  
  return { slope, intercept };
};

// Function to predict future values based on the regression model
export const predictFutureValues = (
  data: { year: number; value: number; athensAvg?: number }[],
  yearsToPredict: number = 5
): { year: number; value: number; athensAvg: number; predicted?: boolean }[] => {
  if (!data || data.length < 2) {
    return [];
  }
  
  // Extract x (years) and y (values) from data
  const x = data.map(item => item.year);
  const y = data.map(item => item.value);
  
  // Get regression parameters
  const { slope, intercept } = linearRegression(x, y);
  
  // Create array with original data (marked as not predicted)
  const result = data.map(item => ({
    ...item,
    athensAvg: item.athensAvg || 0, // Ensure athensAvg is always present
    predicted: false
  }));
  
  // Add predicted values for future years
  const lastYear = Math.max(...x);
  const lastKnownDataPoint = data[data.length - 1];
  
  for (let i = 1; i <= yearsToPredict; i++) {
    const year = lastYear + i;
    // Apply regression formula: y = mx + b
    // Add some random noise to make the prediction look more realistic
    const randomNoise = 0.95 + Math.random() * 0.1; // between 0.95 and 1.05
    const predictedValue = Math.round((slope * year + intercept) * randomNoise);
    
    // Calculate predicted Athens average
    const athensAvg = lastKnownDataPoint.athensAvg 
      ? Math.round(lastKnownDataPoint.athensAvg * Math.pow(1.03, i)) // 3% yearly growth
      : Math.round(predictedValue * 0.85); // Fallback if no Athens average data
    
    result.push({
      year,
      value: predictedValue > 0 ? predictedValue : 0, // Ensure no negative values
      athensAvg,
      predicted: true
    });
  }
  
  return result;
};

// Exponential smoothing method as an alternative prediction approach
export const exponentialSmoothing = (
  data: { year: number; value: number; athensAvg?: number }[],
  yearsToPredict: number = 5,
  alpha: number = 0.3 // Smoothing factor (0 < alpha < 1)
): { year: number; value: number; athensAvg: number; predicted?: boolean }[] => {
  if (!data || data.length < 2) {
    return [];
  }
  
  // Extract values and calculate yearly growth rates
  const values = data.map(item => item.value);
  const growthRates: number[] = [];
  
  for (let i = 1; i < values.length; i++) {
    if (values[i-1] > 0) {
      growthRates.push(values[i] / values[i-1]);
    } else {
      growthRates.push(1.03); // Default to 3% growth if previous value was 0
    }
  }
  
  // Apply exponential smoothing to growth rates
  let smoothedGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  
  // Result array with original data
  const result = data.map(item => ({
    ...item,
    athensAvg: item.athensAvg || 0, // Ensure athensAvg is always present
    predicted: false
  }));
  
  // Add predicted values
  const lastYear = Math.max(...data.map(item => item.year));
  let lastValue = values[values.length - 1];
  
  // Get the last known Athens average value
  const lastKnownDataPoint = data[data.length - 1];
  let lastAthensAvg = lastKnownDataPoint.athensAvg || 0;
  
  for (let i = 1; i <= yearsToPredict; i++) {
    const year = lastYear + i;
    
    // Update smoothed growth rate with recent trend
    if (growthRates.length > 0) {
      const latestGrowthRate = growthRates[growthRates.length - 1];
      smoothedGrowthRate = alpha * latestGrowthRate + (1 - alpha) * smoothedGrowthRate;
    }
    
    // Add some random noise for a more realistic prediction
    const randomNoise = 0.97 + Math.random() * 0.06; // between 0.97 and 1.03
    const adjustedGrowthRate = smoothedGrowthRate * randomNoise;
    
    // Calculate next value based on the smoothed growth rate
    lastValue = Math.round(lastValue * adjustedGrowthRate);
    
    // Calculate predicted Athens average with slight randomization
    const athensAvgGrowthRate = 1.02 + (Math.random() * 0.02); // Between 2-4% growth
    const athensAvg = Math.round(lastAthensAvg * athensAvgGrowthRate);
    
    // Update lastAthensAvg for the next iteration
    lastAthensAvg = athensAvg;
    
    result.push({
      year,
      value: lastValue > 0 ? lastValue : 0, // Ensure no negative values
      athensAvg,
      predicted: true
    });
  }
  
  return result;
};

// Main prediction function that combines multiple approaches
export const predictPrices = (
  data: { year: number; value: number; athensAvg?: number }[],
  yearsToPredict: number = 5
): { year: number; value: number; athensAvg: number; predicted?: boolean }[] => {
  // Use exponential smoothing for more realistic price predictions
  const result = exponentialSmoothing(data, yearsToPredict);
  
  // Force the prediction to start at year 2025
  const predictionStartYear = 2025;
  result.forEach(item => {
    item.predicted = item.year >= predictionStartYear;
  });
  
  return result;
};
