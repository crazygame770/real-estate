
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { useLanguage } from '@/contexts/LanguageContext';
import usePropertyHeatmap from './hooks/usePropertyHeatmap';
import HeatmapLegend from './HeatmapLegend';
import { getHeatmapLayerConfig, getCircleLayerConfig, initializeMapConfig } from './MapConfiguration';
import { setupMapEventHandlers } from './MapEventHandlers';

const PriceHeatMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { properties, isLoading, getHeatmapData, themeModeChanged, setThemeModeChanged } = usePropertyHeatmap();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || isLoading || !properties) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiZXRzaW1waWRpcyIsImEiOiJjbTdiMWs3cXgwYWswMmpzajBsMWVkc2NsIn0.olbj-NVEl2ySOOALVPok_Q';
    
    const mapConfig = initializeMapConfig(isDark);
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      ...mapConfig
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      const heatmapData = getHeatmapData();
      
      if (map.current) {
        // Add heatmap data source
        map.current.addSource('property-prices', {
          type: 'geojson',
          data: heatmapData
        });

        // Add heatmap layer
        const heatmapLayer = getHeatmapLayerConfig(isDark);
        map.current.addLayer(heatmapLayer as any);

        // Add circle layer for individual points when zoomed in
        const circleLayer = getCircleLayerConfig(isDark);
        map.current.addLayer(circleLayer as any);

        // Setup event handlers
        setupMapEventHandlers(map.current, t);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [properties, isLoading, isDark, t]);

  // Handle theme changes
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11');
      setThemeModeChanged(true);
    }
  }, [isDark, setThemeModeChanged]);

  // Update sources after theme change
  useEffect(() => {
    if (themeModeChanged && map.current) {
      const resetSource = () => {
        if (map.current?.isStyleLoaded() && properties) {
          if (map.current.getSource('property-prices')) {
            map.current.removeLayer('property-point');
            map.current.removeLayer('property-heatmap');
            map.current.removeSource('property-prices');

            const heatmapData = getHeatmapData();
            
            map.current.addSource('property-prices', {
              type: 'geojson',
              data: heatmapData
            });

            // Re-add heatmap layer
            const heatmapLayer = getHeatmapLayerConfig(isDark);
            map.current.addLayer(heatmapLayer as any);

            // Re-add circle layer
            const circleLayer = getCircleLayerConfig(isDark);
            map.current.addLayer(circleLayer as any);

            setThemeModeChanged(false);
          }
        }
      };

      map.current.once('styledata', resetSource);
    }
  }, [themeModeChanged, properties, isDark, getHeatmapData, setThemeModeChanged]);

  return (
    <Card className="p-6 mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{t("Property Price Heatmap")}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t("Visualization of property prices per square meter across Athens")}
        </p>
      </div>
      <div className="h-[500px] rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center bg-muted/20">
            <div className="animate-pulse h-8 w-8 rounded-full bg-primary/50"></div>
          </div>
        ) : (
          <div ref={mapContainer} className="h-full w-full" />
        )}
      </div>
      <HeatmapLegend />
    </Card>
  );
};

export default PriceHeatMap;
