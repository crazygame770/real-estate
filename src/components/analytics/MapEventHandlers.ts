
import mapboxgl from 'mapbox-gl';
import { useLanguage } from '@/contexts/LanguageContext';
import { PropertyGeoJSON } from './types/mapTypes';

export const setupMapEventHandlers = (map: mapboxgl.Map, t: (key: string) => string) => {
  // Fix the popup click handler
  map.on('click', 'property-point', (e) => {
    if (!e.features || e.features.length === 0 || !map) return;
    
    const feature = e.features[0];
    // Type assertion to ensure we get Point geometry with coordinates
    const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
    
    const price = feature.properties?.price;
    const pricePerMeter = feature.properties?.pricePerMeter;
    const title = feature.properties?.title;
    
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`
        <div class="p-2">
          <strong>${title || 'Property'}</strong><br/>
          <span>${t("Price")}: €${price.toLocaleString()}</span><br/>
          <span>${t("Price per m²")}: €${Math.round(pricePerMeter).toLocaleString()}</span>
        </div>
      `)
      .addTo(map);
  });

  // Change cursor to pointer when hovering over a point
  map.on('mouseenter', 'property-point', () => {
    if (map) map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', 'property-point', () => {
    if (map) map.getCanvas().style.cursor = '';
  });
};

export const setupGlobeSpinning = (map: mapboxgl.Map) => {
  // No globe spinning for this map - static implementation
};
