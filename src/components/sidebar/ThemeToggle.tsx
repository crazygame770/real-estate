
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useRef } from "react";

const ThemeToggle = () => {
  const { isDark, setTheme } = useTheme();
  const { t } = useLanguage();
  const prevThemeRef = useRef(isDark);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
    
    // Force a reflow on marker elements to ensure they update properly
    setTimeout(() => {
      const markers = document.querySelectorAll('.mapboxgl-marker');
      markers.forEach(marker => {
        // Force reflow on each marker
        const element = marker as HTMLElement;
        if (element) {
          void element.offsetHeight; // Trigger reflow
        }
      });
    }, 100);
  };

  // Update prevTheme when theme changes
  useEffect(() => {
    prevThemeRef.current = isDark;
  }, [isDark]);

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors group"
    >
      {isDark ? (
        <Sun className="w-5 h-5 group-hover:text-primary transition-colors" />
      ) : (
        <Moon className="w-5 h-5 group-hover:text-primary transition-colors" />
      )}
      <span className="text-sm font-medium">
        {isDark ? t("Light Mode") : t("Dark Mode")}
      </span>
    </button>
  );
};

export default ThemeToggle;
