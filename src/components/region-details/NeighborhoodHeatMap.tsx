
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from "@/components/ui/card";
import type { Feature, Point, GeoJSON } from 'geojson';
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/use-theme";

interface NeighborhoodHeatMapProps {
  neighborhoodData: Array<{
    name: string;
    avgPrice: number;
    coordinates?: [number, number];
  }>;
  color: string;
}

const getNeighborhoodCoordinates = (neighborhood: string): [number, number] => {
  // Central Athens neighborhood coordinates
  const coordinates: Record<string, [number, number]> = {
    'Plaka': [23.7275, 37.9697],
    'Monastiraki': [23.7253, 37.9761],
    'Kolonaki': [23.7389, 37.9769],
    'Psiri': [23.7225, 37.9781],
    'Exarchia': [23.7336, 37.9868],
    'Omonia': [23.7283, 37.9838],
    'Thiseio': [23.7203, 37.9775],
    'Pagrati': [23.7486, 37.9697],
    'Mets': [23.7353, 37.9686]
  };
  return coordinates[neighborhood] || [23.7275, 37.9838]; // Default to central Athens
};

export const NeighborhoodHeatMap = ({ neighborhoodData, color }: NeighborhoodHeatMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { t } = useLanguage();
  const { isDark } = useTheme();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXRzaW1waWRpcyIsImEiOiJjTddiMWs3cXgwYWswMmpzajBsMWVkc2NsIn0.olbj-NVEl2ySOOALVPok_Q';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
      center: [23.7275, 37.9838],
      zoom: 13
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add heat map when style is loaded
    map.current.on('load', () => {
      if (!map.current) return;

      // Prepare data points for the heat map
      const points: Feature<Point>[] = neighborhoodData.map(n => ({
        type: 'Feature',
        properties: {
          price: n.avgPrice,
          name: n.name
        },
        geometry: {
          type: 'Point',
          coordinates: getNeighborhoodCoordinates(n.name)
        }
      }));

      // Add the data source
      map.current.addSource('neighborhoods', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: points
        } as GeoJSON
      });

      // Add a heatmap layer
      map.current.addLayer({
        id: 'neighborhood-heat',
        type: 'heatmap',
        source: 'neighborhoods',
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'price'],
            300000, 0,
            600000, 1
          ],
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 255, 0)',
            0.2, 'royalblue',
            0.4, 'cyan',
            0.6, 'lime',
            0.8, 'yellow',
            1, 'red'
          ],
          'heatmap-radius': 30,
          'heatmap-opacity': 0.8
        }
      });

      // Add markers with price information
      neighborhoodData.forEach(neighborhood => {
        const coordinates = getNeighborhoodCoordinates(neighborhood.name);
        
        const el = document.createElement('div');
        el.className = 'price-marker';
        
        // Use theme-dependent styling
        const bgColor = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(59, 130, 246, 0.9)';
        const textColor = isDark ? '#111827' : 'white';
        const borderColor = isDark ? '#3b82f6' : 'white';
        
        el.innerHTML = `
          <div style="
            background: ${bgColor};
            color: ${textColor};
            border: 1px solid ${borderColor};
            backdrop-filter: blur(4px);
            padding: 0.5rem;
            border-radius: 0.375rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">
            <div style="font-size: 0.75rem; font-weight: 500;">${neighborhood.name}</div>
            <div style="font-size: 0.75rem; color: ${isDark ? '#3b82f6' : '#ffffff'};">€${neighborhood.avgPrice.toLocaleString()}</div>
          </div>
        `;

        new mapboxgl.Marker({
          element: el,
          anchor: 'bottom'
        })
          .setLngLat(coordinates)
          .addTo(map.current);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [neighborhoodData, color, isDark]);

  // Update map style when theme changes
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11');
      
      // Re-add the data after style change
      map.current.once('style.load', () => {
        if (!map.current || !map.current.getSource('neighborhoods')) return;
        
        // The source/layer might be lost after style change, so we re-add them
        try {
          // Prepare data points for the heat map
          const points: Feature<Point>[] = neighborhoodData.map(n => ({
            type: 'Feature',
            properties: {
              price: n.avgPrice,
              name: n.name
            },
            geometry: {
              type: 'Point',
              coordinates: getNeighborhoodCoordinates(n.name)
            }
          }));

          // Add/update the data source
          if (!map.current.getSource('neighborhoods')) {
            map.current.addSource('neighborhoods', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: points
              } as GeoJSON
            });

            // Re-add the heatmap layer
            map.current.addLayer({
              id: 'neighborhood-heat',
              type: 'heatmap',
              source: 'neighborhoods',
              paint: {
                'heatmap-weight': [
                  'interpolate',
                  ['linear'],
                  ['get', 'price'],
                  300000, 0,
                  600000, 1
                ],
                'heatmap-intensity': 1,
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(0, 0, 255, 0)',
                  0.2, 'royalblue',
                  0.4, 'cyan',
                  0.6, 'lime',
                  0.8, 'yellow',
                  1, 'red'
                ],
                'heatmap-radius': 30,
                'heatmap-opacity': 0.8
              }
            });
          }
          
          // Re-add the markers with proper theme styling after style change
          neighborhoodData.forEach(neighborhood => {
            const coordinates = getNeighborhoodCoordinates(neighborhood.name);
            
            const el = document.createElement('div');
            el.className = 'price-marker';
            
            // Use theme-dependent styling
            const bgColor = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(59, 130, 246, 0.9)';
            const textColor = isDark ? '#111827' : 'white';
            const borderColor = isDark ? '#3b82f6' : 'white';
            
            el.innerHTML = `
              <div style="
                background: ${bgColor};
                color: ${textColor};
                border: 1px solid ${borderColor};
                backdrop-filter: blur(4px);
                padding: 0.5rem;
                border-radius: 0.375rem;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              ">
                <div style="font-size: 0.75rem; font-weight: 500;">${neighborhood.name}</div>
                <div style="font-size: 0.75rem; color: ${isDark ? '#3b82f6' : '#ffffff'};">€${neighborhood.avgPrice.toLocaleString()}</div>
              </div>
            `;

            new mapboxgl.Marker({
              element: el,
              anchor: 'bottom'
            })
              .setLngLat(coordinates)
              .addTo(map.current!);
          });
        } catch (error) {
          console.error("Error re-adding heatmap after style change:", error);
        }
      });
    }
  }, [isDark, neighborhoodData]);

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{t("Neighborhood Price Heat Map")}</h3>
      <div className="h-[400px] w-full">
        <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
      </div>
      <style>
        {`
          .price-marker {
            cursor: pointer;
          }
          .mapboxgl-popup-content {
            background: ${isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
            color: ${isDark ? 'white' : '#111827'};
            border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            border-radius: 6px;
            padding: 8px 12px;
          }
        `}
      </style>
    </Card>
  );
};
