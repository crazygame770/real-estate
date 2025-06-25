
import PropertyList from "@/components/PropertyList";
import PropertyMap from "@/components/PropertyMap";
import { parseCoordinates } from "@/utils/propertyUtils";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Lasso } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFilter } from "@/contexts/FilterContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ViewAllButton from "@/components/property/ViewAllButton";

interface Property {
  id: number;
  title: string;
  price: number;
  coordinates: string;
  image_url: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  property_type?: string;
  neighborhood?: string;
  created_at?: string;
}

interface MainContentProps {
  properties: Property[];
}

const MainContent = ({ properties }: MainContentProps) => {
  const [propertiesInArea, setPropertiesInArea] = useState<number[]>([]);
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  const { t } = useLanguage();
  const { mainFilters } = useFilter();
  const navigate = useNavigate();

  const mapProperties = useMemo(
    () =>
      properties.map((property) => ({
        id: property.id,
        title: property.title,
        price: property.price,
        coordinates: parseCoordinates(property.coordinates),
        image: property.image_url,
      })),
    [properties]
  );

  const filteredProperties = properties.filter((property) => {
    if (propertiesInArea.length > 0 && !propertiesInArea.includes(property.id)) {
      return false;
    }
    const matchesNeighborhood =
      mainFilters.selectedRegions.length === 0 ||
      mainFilters.selectedRegions.some((region) => property.neighborhood === region.name);

    const isInPriceRange =
      property.price >= mainFilters.priceRange[0] && property.price <= mainFilters.priceRange[1];

    const isInAreaRange =
      !property.area ||
      (property.area >= mainFilters.areaRange[0] &&
        property.area <= mainFilters.areaRange[1]);

    const isInBedroomRange =
      !property.bedrooms ||
      (property.bedrooms >= mainFilters.bedroomRange[0] &&
        property.bedrooms <= mainFilters.bedroomRange[1]);

    const isInBathroomRange =
      !property.bathrooms ||
      (property.bathrooms >= mainFilters.bathroomRange[0] &&
        property.bathrooms <= mainFilters.bathroomRange[1]);

    const matchesPropertyType =
      !mainFilters.propertyType || property.property_type === mainFilters.propertyType;

    return (
      matchesNeighborhood &&
      isInPriceRange &&
      isInAreaRange &&
      isInBedroomRange &&
      isInBathroomRange &&
      matchesPropertyType
    );
  });

  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      switch (mainFilters.sortBy) {
        case "price-high-low":
          return b.price - a.price;
        case "price-low-high":
          return a.price - b.price;
        case "area-high-low":
          return (b.area || 0) - (a.area || 0);
        case "area-low-high":
          return (a.area || 0) - (b.area || 0);
        case "recent-listed":
          return (
            new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime()
          );
        case "oldest-listed":
          return (
            new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime()
          );
        default:
          return 0;
      }
    });
  }, [filteredProperties, mainFilters.sortBy]);

  const handleAreaDraw = (propertyIds: number[]) => {
    setPropertiesInArea(propertyIds);
    if (propertyIds.length > 0) {
      const filteredCount = properties
        .filter((p) => propertyIds.includes(p.id))
        .filter((p) => {
          const matchesNeighborhood =
            mainFilters.selectedRegions.length === 0 ||
            mainFilters.selectedRegions.some((region) => p.neighborhood === region.name);
          return matchesNeighborhood;
        }).length;
      toast({
        title: t(`${filteredCount} properties found in selected area`)
      });
    }
  };

  // Only display the first 4 filtered properties on the main page
  const featuredProperties = sortedProperties.slice(0, 4);
  
  // Create map properties from all filtered properties (not just the featured ones)
  const filteredMapProperties = sortedProperties.map(property => ({
    id: property.id,
    title: property.title,
    price: property.price,
    coordinates: parseCoordinates(property.coordinates),
    image: property.image_url,
  }));

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Property List */}
        <div className="space-y-6 pb-6 max-h-full overflow-y-auto">
          {propertiesInArea.length > 0 && (
            <div className="bg-muted p-3 rounded-md flex justify-between items-center">
              <p className="text-sm">
                {t("Showing")}&nbsp;
                <span className="font-semibold">{sortedProperties.length}</span>&nbsp;
                {t("properties in selected area")}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPropertiesInArea([])}
              >
                {t("Clear Selection")}
              </Button>
            </div>
          )}
          <PropertyList properties={featuredProperties} showAll={false} />
          <ViewAllButton
            show={sortedProperties.length > 4}
            isHomePage={true}
            onClick={() =>
              // Pass all filtered properties to the map view page
              navigate("/map", { 
                state: { 
                  properties: sortedProperties,
                  filterApplied: true
                } 
              })
            }
          />
        </div>
        
        {/* Right Column: Sticky Map */}
        <div className="hidden lg:block sticky top-0" style={{ height: "calc(100vh - 2rem)" }}>
          <div className="h-full rounded-lg overflow-hidden border border-border shadow-sm">
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant={drawingEnabled ? "default" : "outline"}
                onClick={() => {
                  setDrawingEnabled((prev) => !prev);
                  if (propertiesInArea.length > 0) {
                    setPropertiesInArea([]);
                  }
                }}
                className="gap-2"
              >
                <Lasso className="h-4 w-4" />
                {drawingEnabled ? t("Drawing Mode Active") : t("Draw Area to Filter")}
              </Button>
            </div>
            <PropertyMap
              properties={propertiesInArea.length > 0 ? mapProperties.filter(p => propertiesInArea.includes(p.id)) : filteredMapProperties}
              enableAreaDraw={drawingEnabled}
              onAreaDraw={handleAreaDraw}
              onPropertyClick={(id) => {
                const element = document.querySelector(`[data-property-id="${id}"]`);
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
