
import { PropertyHeader } from "./PropertyHeader";
import { PropertyFeatures } from "./PropertyFeatures";
import { PriceCharts } from "./PriceCharts";
import { LocationMap } from "./LocationMap";
import { NeighborhoodOverview } from "./NeighborhoodOverview";
import { AdminActions } from "./AdminActions";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { regionColors } from "@/components/neighborhood/constants";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyContentProps {
  property: any;
  isAdmin: boolean;
  neighborhoodScores: any;
  onPropertyUpdated: () => void;
  onDelete: () => void;
}

interface Score {
  walkability: number;
  safety: number;
  education: number;
  green_spaces: number;
  entertainment: number;
  retail: number;
}

export const PropertyContent = ({ 
  property, 
  isAdmin, 
  neighborhoodScores,
  onPropertyUpdated,
  onDelete
}: PropertyContentProps) => {
  const { t } = useLanguage();
  const [regionScores, setRegionScores] = useState<Score | null>(null);
  const [regionId, setRegionId] = useState<string>('central-athens');
  
  useEffect(() => {
    const fetchRegionScores = async () => {
      if (property?.neighborhood) {
        const { data: neighborhood } = await supabase
          .from('neighborhoods')
          .select('region_id, walkability, safety, education, green_spaces, entertainment, retail')
          .eq('name', property.neighborhood)
          .single();

        if (neighborhood?.region_id) {
          setRegionId(neighborhood.region_id);
          const { data: regionNeighborhoods } = await supabase
            .from('neighborhoods')
            .select('walkability, safety, education, green_spaces, entertainment, retail')
            .eq('region_id', neighborhood.region_id);

          if (regionNeighborhoods && regionNeighborhoods.length > 0) {
            const regionAverages = regionNeighborhoods.reduce((acc, curr) => {
              Object.keys(curr).forEach(key => {
                if (key !== 'region_id') {
                  acc[key] = (acc[key] || 0) + curr[key];
                }
              });
              return acc;
            }, {});

            Object.keys(regionAverages).forEach(key => {
              regionAverages[key] = Number((regionAverages[key] / regionNeighborhoods.length).toFixed(2));
            });

            setRegionScores(regionAverages as Score);
          }
        }
      }
    };

    fetchRegionScores();
  }, [property?.neighborhood]);

  const parseCoordinates = (coordinates: string): [number, number] => {
    try {
      console.log("Raw coordinates:", coordinates);
      
      const coordsStr = coordinates.replace(/[()]/g, '').trim();
      console.log("Cleaned coordinates string:", coordsStr);
      
      const [x, y] = coordsStr.split(',').map(num => parseFloat(num.trim()));
      console.log("Split coordinates:", { x, y });
      
      if (isNaN(x) || isNaN(y)) {
        console.error('Invalid coordinates format:', coordinates);
        return [23.7275, 37.9838]; // Default to Athens center
      }
      
      return [x, y];
      
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return [23.7275, 37.9838]; // Default to Athens center
    }
  };

  console.log("Property coordinates:", property?.coordinates);
  const parsedCoordinates = parseCoordinates(property?.coordinates || '');
  console.log("Final coordinates for Mapbox:", parsedCoordinates);

  const defaultScores: Score = {
    walkability: 0,
    safety: 0,
    education: 0,
    green_spaces: 0,
    entertainment: 0,
    retail: 0
  };

  const roundedNeighborhoodScores: Score = neighborhoodScores ? 
    Object.entries(neighborhoodScores).reduce((acc: Score, [key, value]) => ({
      ...acc,
      [key]: Number(Number(value).toFixed(2))
    }), defaultScores) : defaultScores;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <PropertyHeader 
          image={property.image_url}
          price={`€${property.price.toLocaleString()}`}
          title={property.title}
        />
        {isAdmin && (
          <AdminActions 
            property={property}
            onPropertyUpdated={onPropertyUpdated}
            onDelete={onDelete}
          />
        )}
      </div>

      <PropertyFeatures property={property} />

      <PriceCharts 
        propertyId={property.id}
        area={property.area}
        regionId={regionId}
      />

      <LocationMap 
        coordinates={parsedCoordinates}
        neighborhood={t(property.neighborhood)}
        imageUrl={property.image_url}
        price={property.price}
      />

      <NeighborhoodOverview 
        scores={roundedNeighborhoodScores} 
        neighborhoodName={t(property.neighborhood)}
        regionScores={regionScores}
        color={regionColors[regionId]}
      />
    </div>
  );
};
