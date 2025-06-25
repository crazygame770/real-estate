
import { useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";

export const useTheme = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();

  useEffect(() => {
    // Initial theme setup logic
    const documentElement = document.documentElement;
    const currentTheme = resolvedTheme || theme || systemTheme || "light";
    
    if (currentTheme === "dark") {
      documentElement.classList.add("dark");
      documentElement.classList.remove("light");
    } else {
      documentElement.classList.add("light");
      documentElement.classList.remove("dark");
    }
    
    // Force a redraw of markers after theme change with improved reliability
    setTimeout(() => {
      const markers = document.querySelectorAll('.mapboxgl-marker');
      markers.forEach(marker => {
        // Force reflow on each marker to ensure proper styling
        const element = marker as HTMLElement;
        if (element) {
          // Save current visibility
          const wasVisible = element.style.visibility;
          
          // Force a layout reflow
          element.style.visibility = 'hidden';
          void (element as HTMLElement).offsetHeight; // Trigger reflow with casting
          element.style.visibility = wasVisible;
          
          // Apply theme class explicitly
          if (currentTheme === "dark") {
            element.classList.add("dark");
            element.classList.remove("light");
          } else {
            element.classList.add("light");
            element.classList.remove("dark");
          }
          
          // Re-apply any custom marker styles
          const markerCircle = element.querySelector('.marker-circle');
          if (markerCircle) {
            void (markerCircle as HTMLElement).offsetHeight; // Trigger reflow with casting
          }
        }
      });
    }, 150); // Slightly longer timeout to ensure map style has loaded
  }, [theme, resolvedTheme, systemTheme]);

  return {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
    isDark: resolvedTheme === "dark",
    isLight: resolvedTheme === "light",
    isSystem: theme === "system",
  };
};
