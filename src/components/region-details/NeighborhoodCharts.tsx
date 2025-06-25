
import { PriceChart } from './charts/PriceChart';
import { RegionScoresChart } from './RegionScoresChart';
import { NeighborhoodData, PriceData } from './types/neighborhood-types';
import { darkenColor } from '@/utils/colorUtils';

interface NeighborhoodChartsProps {
  neighborhood: NeighborhoodData;
  regionPrice: PriceData[];
  color: string;
  regionScores: {
    walkability: number;
    safety: number;
    education: number;
    greenSpaces: number;
    entertainment: number;
    retail: number;
  };
}

export const NeighborhoodCharts = ({ 
  neighborhood, 
  regionPrice, 
  color,
  regionScores 
}: NeighborhoodChartsProps) => {
  // Get 2025 data
  const data2025 = neighborhood.priceHistory.find(d => d.year === 2025);
  const regionData2025 = regionPrice.find(d => d.year === 2025);
  
  // Get darker shade of the region color for region average
  const darkerRegionColor = darkenColor(color, 0.2);

  // Transform data to include price per meter and region prices
  const transformedData = neighborhood.priceHistory.map((item) => {
    const matchingRegionData = regionPrice.find(r => r.year === item.year);
    return {
      ...item,
      pricePerMeter: item.price ? Math.round(item.price / 100) : 0,
      regionPrice: matchingRegionData?.price || 0,
      regionPricePerMeter: matchingRegionData?.price ? Math.round(matchingRegionData.price / 100) : 0,
      athensAvgPerMeter: item.athensAvg ? Math.round(item.athensAvg / 100) : 0
    };
  });

  const formatPrice = (value: number) => `€${value.toLocaleString('de-DE')}`;
  const formatPricePerMeter = (value: number) => `€${value.toLocaleString('de-DE')}/m²`;

  const priceLegendItems = [
    { 
      color: color, 
      label: `${neighborhood.name} (2025)`, 
      value: formatPrice(data2025?.price || 0)
    },
    { 
      color: darkerRegionColor, 
      label: "Region Average (2025)", 
      value: formatPrice(regionData2025?.price || 0)
    },
    { 
      color: "#8E9196", 
      label: "Athens Average (2025)", 
      value: formatPrice(data2025?.athensAvg || 0)
    }
  ];

  const pricePerMeterLegendItems = [
    { 
      color: color, 
      label: `${neighborhood.name} (2025)`, 
      value: formatPricePerMeter(data2025?.price ? Math.round(data2025.price / 100) : 0)
    },
    { 
      color: darkerRegionColor, 
      label: "Region Average (2025)", 
      value: formatPricePerMeter(regionData2025?.price ? Math.round(regionData2025.price / 100) : 0)
    },
    { 
      color: "#8E9196", 
      label: "Athens Average (2025)", 
      value: formatPricePerMeter(data2025?.athensAvg ? Math.round(data2025.athensAvg / 100) : 0)
    }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold mb-4">{neighborhood.name}</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PriceChart
          title="Price Evolution"
          data={transformedData}
          mainDataKey="price"
          compareDataKey="regionPrice"
          color={color}
          regionColor={darkerRegionColor}
          legendItems={priceLegendItems}
          yAxisFormatter={(value) => `€${(value/1000).toLocaleString('de-DE')}k`}
          tooltipFormatter={(value) => formatPrice(value)}
          tooltipCompareFormatter={(value) => formatPrice(value)}
          tooltipLabel={neighborhood.name}
          compareLabel="Region Average"
          description="Comparison of property prices"
          athensKey="athensAvg"
        />
        
        <PriceChart
          title="Price per m²"
          data={transformedData}
          mainDataKey="pricePerMeter"
          compareDataKey="regionPricePerMeter"
          color={color}
          regionColor={darkerRegionColor}
          legendItems={pricePerMeterLegendItems}
          yAxisFormatter={(value) => `€${value.toLocaleString('de-DE')}`}
          tooltipFormatter={(value) => formatPricePerMeter(value)}
          tooltipCompareFormatter={(value) => formatPricePerMeter(value)}
          tooltipLabel={neighborhood.name}
          compareLabel="Region Average"
          description="Price per square meter comparison"
          athensKey="athensAvgPerMeter"
        />
      </div>
      
      <RegionScoresChart
        scores={neighborhood.scores}
        color={color}
        isNeighborhood={true}
        regionScores={regionScores}
      />
    </div>
  );
};
