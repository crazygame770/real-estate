
import { FeatureCollection, Feature, Point } from 'geojson';

export interface PropertyFeature {
  type: "Feature";
  properties: {
    intensity: number;
    price: number;
    pricePerMeter: number;
    title: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface PropertyGeoJSON {
  type: "FeatureCollection";
  features: PropertyFeature[];
}

export interface HeatmapLayerProps {
  id: string;
  type: string; // Added the type property
  source: string;
  maxzoom: number;
  paint: {
    'heatmap-weight': any[];
    'heatmap-intensity': any[];
    'heatmap-color': any[];
    'heatmap-radius': any[];
    'heatmap-opacity': any[];
  };
}

export interface CircleLayerProps {
  id: string;
  type: string; // Added the type property
  source: string;
  minzoom: number;
  paint: {
    'circle-radius': any[];
    'circle-color': any[];
    'circle-stroke-color': string;
    'circle-stroke-width': number;
    'circle-opacity': any[];
  };
}
