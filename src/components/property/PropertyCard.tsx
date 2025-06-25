
import { Home, MapPin, BedDouble, Bath, Square, Heart } from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from "../ui/button";
import { useFilter } from "@/contexts/FilterContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyCardProps {
  property: any;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { favorites, toggleFavorite } = useFilter();
  const { t } = useLanguage();

  const formatPrice = (price: number) => {
    return price.toLocaleString('de-DE');
  };

  return (
    <div 
      key={property.id}
      data-property-id={property.id}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-lg relative"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(property.id);
        }}
      >
        <Heart className={`h-5 w-5 ${favorites.includes(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
      </Button>
      <Link 
        to={`/property/${property.id}`}
        className="block"
      >
        <div className="aspect-w-16 aspect-h-9 overflow-hidden">
          <img 
            src={property.image_url} 
            alt={property.title}
            className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <span className="text-primary font-semibold">€{formatPrice(property.price)}</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.address}</span>
          </div>
          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors mb-4 leading-relaxed">
            {property.description}
          </p>
          <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <BedDouble className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.bedrooms} {t("beds")}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.bathrooms} {t("baths")}</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.area} m²</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
