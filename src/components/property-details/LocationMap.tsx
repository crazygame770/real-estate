
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/use-theme";

interface LocationMapProps {
  coordinates: [number, number];
  neighborhood?: string;
  imageUrl?: string;
  price?: number;
}

export const LocationMap = ({ coordinates, neighborhood, imageUrl, price }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [themeModeChanged, setThemeModeChanged] = useState(false);

  const createOrUpdateMarker = () => {
    if (!map.current) return;
    
    // Remove existing marker and popup
    if (marker.current) {
      marker.current.remove();
    }
    if (popup.current) {
      popup.current.remove();
    }

    // Create marker element with custom styling
    const markerEl = document.createElement('div');
    markerEl.className = 'custom-marker';
    
    // Apply marker styling with explicitly defined styles to ensure visibility
    const fillColor = isDark ? 'white' : 'currentColor';
    const bgColor = isDark ? 'transparent' : 'hsl(var(--primary))';
    const borderColor = isDark ? 'hsl(var(--primary))' : 'white';
    
    markerEl.innerHTML = `
      <div class="marker-circle ${isDark ? 'dark' : 'light'}" style="
        width: 32px !important;
        height: 32px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background-color: ${bgColor} !important;
        color: ${fillColor} !important;
        border: 2px solid ${borderColor} !important;
        transition: all 0.3s ease-in-out !important;
        visibility: visible !important;
        opacity: 1 !important;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="visibility: visible !important; opacity: 1 !important;">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
    `;

    // Add new marker
    marker.current = new mapboxgl.Marker({ element: markerEl })
      .setLngLat(coordinates)
      .addTo(map.current);

    // Add new popup
    if (neighborhood) {
      const popupContent = `
        <div class="p-2 max-w-[200px]">
          ${imageUrl ? `
            <div class="mb-2 rounded-md overflow-hidden">
              <img 
                src="${imageUrl}" 
                alt="${neighborhood}"
                class="w-full h-32 object-cover"
              />
            </div>
          ` : ''}
          <p class="text-sm font-medium mb-1">${neighborhood}</p>
          ${price ? `
            <p class="text-sm font-bold text-primary">€${price.toLocaleString()}</p>
          ` : ''}
        </div>
      `;

      popup.current = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        maxWidth: '300px',
        className: 'bg-background'
      })
        .setLngLat(coordinates)
        .setHTML(popupContent)
        .addTo(map.current);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !coordinates || coordinates.length !== 2) return;

    // Initialize map only if it hasn't been initialized
    if (!map.current) {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXRzaW1waWRpcyIsImEiOiJjbTdiMWs3cXgwYWswMmpzajBsMWVkc2NsIn0.olbj-NVEl2ySOOALVPok_Q';
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
        center: coordinates,
        zoom: 15
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Wait for map to load
      map.current.on('load', () => {
        createOrUpdateMarker();
      });
    } else {
      // If map exists, just update the center
      map.current.setCenter(coordinates);
      
      // If theme changed, recreate marker after style loads
      if (themeModeChanged) {
        map.current.once('style.load', () => {
          createOrUpdateMarker();
          setThemeModeChanged(false);
        });
      } else {
        createOrUpdateMarker();
      }
    }

    // Ensure the map updates when coordinates change
    map.current.flyTo({
      center: coordinates,
      zoom: 15,
      essential: true
    });

    // Cleanup function
    return () => {
      // Only remove markers and popups, keep the map instance
      if (marker.current) {
        marker.current.remove();
      }
      if (popup.current) {
        popup.current.remove();
      }
    };
  }, [coordinates, neighborhood, imageUrl, price, themeModeChanged]);

  // Update map style when theme changes
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11');
      setThemeModeChanged(true);
    }
  }, [isDark]);

  // Final cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{t("Location")}</CardTitle>
        <CardDescription>
          {neighborhood ? `${t("Located in")} ${neighborhood}` : t('Property location on map')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] rounded-lg overflow-hidden">
          <div ref={mapContainer} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
};
