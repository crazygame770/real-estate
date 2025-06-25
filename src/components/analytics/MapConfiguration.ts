
import mapboxgl from 'mapbox-gl';
import { HeatmapLayerProps, CircleLayerProps } from './types/mapTypes';

export const getHeatmapLayerConfig = (isDark: boolean): HeatmapLayerProps => {
  return {
    id: 'property-heatmap',
    type: 'heatmap',
    source: 'property-prices',
    maxzoom: 15,
    paint: {
      // Increase weight based on price per meter
      'heatmap-weight': [
        'interpolate', ['linear'], ['get', 'intensity'],
        0, 0,
        3000, 0.3,
        5000, 0.6,
        8000, 0.8,
        10000, 1
      ],
      // Increase intensity as zoom level increases
      'heatmap-intensity': [
        'interpolate', ['linear'], ['zoom'],
        8, 0.5,
        12, 1.2
      ],
      // Assign color values based on property price per meter
      'heatmap-color': [
        'interpolate', ['linear'], ['heatmap-density'],
        0, 'rgba(33,102,172,0)',
        0.2, 'rgb(103,169,207)',
        0.4, 'rgb(209,229,240)',
        0.6, 'rgb(253,219,199)',
        0.8, 'rgb(239,138,98)',
        0.9, 'rgb(255,80,50)',
        1, 'rgb(178,24,43)'
      ],
      // Adjust radius based on zoom level
      'heatmap-radius': [
        'interpolate', ['linear'], ['zoom'],
        8, 10,
        12, 25,
        15, 30
      ],
      // Decrease opacity based on zoom level
      'heatmap-opacity': [
        'interpolate', ['linear'], ['zoom'],
        8, 1,
        15, 0.8
      ],
    }
  };
};

export const getCircleLayerConfig = (isDark: boolean): CircleLayerProps => {
  return {
    id: 'property-point',
    type: 'circle',
    source: 'property-prices',
    minzoom: 14,
    paint: {
      'circle-radius': [
        'interpolate', ['linear'], ['zoom'],
        14, 4,
        17, 12
      ],
      'circle-color': [
        'interpolate', ['linear'], ['get', 'pricePerMeter'],
        1000, '#3182bd',
        3000, '#ffffbf',
        5000, '#fd8d3c',
        8000, '#e31a1c',
        10000, '#bd0026'
      ],
      'circle-stroke-color': isDark ? 'white' : 'black',
      'circle-stroke-width': 1,
      'circle-opacity': [
        'interpolate', ['linear'], ['zoom'],
        14, 0,
        15, 1
      ]
    }
  };
};

export const initializeMapConfig = (isDark: boolean) => {
  return {
    style: isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
    center: [23.7275, 37.9838] as [number, number], // Athens center with explicit tuple type
    zoom: 11
  };
};
