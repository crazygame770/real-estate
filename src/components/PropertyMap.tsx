import { useEffect, useRef, memo, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as turf from '@turf/turf';
import { useTheme } from "@/hooks/use-theme";

interface Property {
  id: number;
  title: string;
  price: number;
  coordinates: [number, number];
  image?: string;
}

interface PropertyMapProps {
  properties: Property[];
  onPropertyClick?: (id: number) => void;
  fullScreen?: boolean;
  onAreaDraw?: (propertiesInArea: number[]) => void;
  enableAreaDraw?: boolean;
}

const formatPrice = (price: number) => {
  return price.toLocaleString('de-DE');
};

const PropertyMap = memo(({ 
  properties, 
  onPropertyClick, 
  fullScreen = false,
  onAreaDraw,
  enableAreaDraw = false
}: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const navigate = useNavigate();
  const activePopup = useRef<mapboxgl.Popup | null>(null);
  const activeMarker = useRef<HTMLElement | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [drawnArea, setDrawnArea] = useState<any>(null);
  const { isDark } = useTheme();
  const [themeModeChanged, setThemeModeChanged] = useState(false);
  
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiZXRzaW1waWRpcyIsImEiOiJjbTdiMWs3cXgwYWswMmpzajBsMWVkc2NsIn0.olbj-NVEl2ySOOALVPok_Q';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
      center: [23.7275, 37.9838],
      zoom: 12,
      renderWorldCopies: false
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    if (enableAreaDraw) {
      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        },
        defaultMode: 'draw_polygon'
      });
      
      map.current.addControl(draw.current, 'top-left');
      
      map.current.on('draw.create', updateArea);
      map.current.on('draw.update', updateArea);
      map.current.on('draw.delete', () => {
        setDrawnArea(null);
        if (onAreaDraw) {
          onAreaDraw([]);
        }
      });
    }

    function updateArea() {
      if (!draw.current || !map.current) return;
      
      const data = draw.current.getAll();
      if (data.features.length > 0) {
        const polygon = data.features[0];
        setDrawnArea(polygon);
        
        const propertiesInArea = properties
          .filter(property => {
            const point = turf.point(property.coordinates);
            return turf.booleanPointInPolygon(point, polygon);
          })
          .map(property => property.id);
        
        if (onAreaDraw) {
          onAreaDraw(propertiesInArea);
        }
      }
    }

    return () => {
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
      }
      
      if (map.current) {
        if (enableAreaDraw) {
          map.current.off('draw.create', updateArea);
          map.current.off('draw.update', updateArea);
          map.current.off('draw.delete', () => {
            setDrawnArea(null);
            if (onAreaDraw) {
              onAreaDraw([]);
            }
          });
        }
        
        map.current.remove();
        map.current = null;
      }
    };
  }, [enableAreaDraw, isDark]);

  const isPointInDrawnArea = (coordinates: [number, number]) => {
    if (!drawnArea) return true;
    const point = turf.point(coordinates);
    return turf.booleanPointInPolygon(point, drawnArea);
  };

  const createMarkers = () => {
    if (!map.current) return;
    
    if (markersRef.current) {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    }
    
    if (activePopup.current) {
      activePopup.current.remove();
      activePopup.current = null;
    }
    
    if (properties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      properties.forEach(property => {
        bounds.extend(property.coordinates);
      });

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }

    const showPropertyPopup = (property: Property, marker: HTMLElement) => {
      if (activePopup.current) {
        activePopup.current.remove();
      }
      if (activeMarker.current) {
        activeMarker.current.classList.remove('active');
      }

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
        className: 'property-popup'
      })
        .setLngLat(property.coordinates)
        .setHTML(`
          <div class="p-3 max-w-[240px]">
            <div class="w-full h-32 mb-2 rounded-lg overflow-hidden">
              <img src="${property.image}" alt="${property.title}" class="w-full h-full object-cover" />
            </div>
            <h3 class="font-semibold text-sm mb-1">${property.title}</h3>
            <p class="text-primary font-semibold mb-3">€${formatPrice(property.price)}</p>
            <button 
              class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              onclick="window.location.href='/property/${property.id}'"
            >
              View Property
            </button>
          </div>
        `)
        .addTo(map.current!);

      marker.classList.add('active');
      activeMarker.current = marker;
      activePopup.current = popup;
    };

    const newMarkers: mapboxgl.Marker[] = [];

    properties.forEach((property) => {
      const el = document.createElement('div');
      el.className = 'property-marker';

      const isDarkTheme = isDark;
      const MARKER_BG = isDarkTheme ? '#fff' : '#ea384c';
      const HOUSE_STROKE = isDarkTheme ? '#ea384c' : '#222';

      el.innerHTML = `
        <div class="marker-container">
          <div class="marker-image" style="background-image: url('${property.image}')"></div>
          <div
            class="marker-circle ${isDarkTheme ? 'dark' : 'light'}"
            style="
              width: 32px !important;
              height: 32px !important;
              border-radius: 50% !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              background-color: ${MARKER_BG} !important;
              color: ${HOUSE_STROKE} !important;
              border: 2px solid ${isDarkTheme ? '#ea384c' : '#fff'} !important;
              transition: all 0.3s ease-in-out !important;
              visibility: visible !important;
              opacity: 1 !important;
            ">
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="16" height="16"
                 viewBox="0 0 24 24" fill="none"
                 stroke="${HOUSE_STROKE}"
                 stroke-width="2"
                 stroke-linecap="round"
                 stroke-linejoin="round"
                 style="visibility: visible !important; opacity: 1 !important;">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        </div>
      `;

      el.addEventListener('mouseenter', () => {
        showPropertyPopup(property, el);
      });

      el.addEventListener('click', () => {
        if (onPropertyClick) {
          onPropertyClick(property.id);
        } else {
          navigate(`/property/${property.id}`);
        }
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat(property.coordinates)
        .addTo(map.current!);
        
      newMarkers.push(marker);
    });

    markersRef.current = newMarkers;
  };

  useEffect(() => {
    if (!map.current) return;
    
    if (themeModeChanged) {
      map.current.once('style.load', () => {
        createMarkers();
        setThemeModeChanged(false);
      });
    } else {
      createMarkers();
    }
  }, [properties, onPropertyClick, navigate, drawnArea, themeModeChanged]);

  useEffect(() => {
    if (!drawnArea || !onAreaDraw) return;
    
    const propertiesInArea = properties
      .filter(property => {
        const point = turf.point(property.coordinates);
        return turf.booleanPointInPolygon(point, drawnArea);
      })
      .map(property => property.id);
    
    onAreaDraw(propertiesInArea);
  }, [drawnArea, properties, onAreaDraw]);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11');
      setThemeModeChanged(true);
    }
  }, [isDark]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
      <style>
        {`
          .property-marker {
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .marker-container {
            position: relative;
            width: 40px;
            height: 40px;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .marker-image {
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
          }
          .dark .marker-circle {
            background-color: transparent !important;
            color: white !important;
            border: 2px solid hsl(var(--primary)) !important;
          }
          .light .marker-circle {
            background-color: hsl(var(--primary)) !important;
            color: white !important;
            border: 2px solid white !important;
          }
          .property-marker.active .marker-circle {
            background: #ef4444 !important;
            border-color: #ef4444 !important;
            color: white !important;
          }
          .property-popup .mapboxgl-popup-content {
            border-radius: 0.5rem;
            padding: 0;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          }
          .mapbox-gl-draw_polygon {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 5 3 19 14 19 14 5 3 5"></polygon><path d="M14 2v17M3 5h11M3 19h11"></path></svg>');
          }
          .mapboxgl-marker {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
          }
        `}
      </style>
    </div>
  );
});

PropertyMap.displayName = 'PropertyMap';

export default PropertyMap;
