
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "./ui/button";
import PropertyMap from "./PropertyMap";
import { useEffect, useState } from "react";
import { PropertyFilters } from "@/types/propertyTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePropertyFiltering } from "@/hooks/usePropertyFiltering";
import { parseCoordinates } from "@/utils/propertyUtils";
import PropertyCard from "./property/PropertyCard";
import CompactPropertyCard from "./property/CompactPropertyCard";
import ViewAllButton from "./property/ViewAllButton";

interface PropertyListProps {
  showMap?: boolean;
  advancedFilters?: PropertyFilters;
  showFavorites?: boolean;
  showAll?: boolean;
  properties?: any[]; // Add the properties prop to the interface
}

const PropertyList = ({ 
  showMap = false, 
  advancedFilters, 
  showFavorites = false, 
  showAll = false,
  properties: customProperties // Accept custom properties
}: PropertyListProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const {
    sortedProperties,
    isLoading,
    showViewAllButton
  } = usePropertyFiltering(showFavorites, advancedFilters);

  // Determine which properties to display - use custom properties if provided
  const displayedProperties = customProperties || (showAll ? sortedProperties : 
    (location.pathname === '/' ? sortedProperties.slice(0, 6) : sortedProperties));

  if (isLoading && !customProperties) {
    return <div>{t("Loading properties...")}</div>;
  }

  // Map view layout
  if (showMap) {
    return (
      <div className="flex h-screen">
        <div className="w-1/2 h-full overflow-y-auto p-6 border-r">
          <Button 
            onClick={() => navigate('/')}
            variant="secondary"
            className="mb-6"
          >
            {t("Back to Home")}
          </Button>
          <div className="grid grid-cols-1 gap-6">
            {displayedProperties.map((property) => (
              <CompactPropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
        <div className="w-1/2 h-full">
          <PropertyMap 
            properties={displayedProperties.map(p => ({
              id: p.id,
              title: p.title,
              price: p.price,
              coordinates: parseCoordinates(p.coordinates),
              image: p.image_url
            }))}
            onPropertyClick={(id) => {
              navigate(`/property/${id}`);
            }}
            fullScreen
          />
        </div>
      </div>
    );
  }

  // Standard view layout
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayedProperties.map((property, index) => (
          <div key={property.id} data-property-index={index} data-property-id={property.id}>
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
      <ViewAllButton 
        show={showViewAllButton} 
        isHomePage={location.pathname === '/'}
      />
    </>
  );
};

export default PropertyList;
