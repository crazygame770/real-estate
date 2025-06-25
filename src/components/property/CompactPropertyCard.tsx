
import { MapPin, BedDouble, Bath, Square } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "@/contexts/LanguageContext";

interface CompactPropertyCardProps {
  property: any;
}

const CompactPropertyCard = ({ property }: CompactPropertyCardProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('de-DE');
  };

  return (
    <div 
      key={property.id} 
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-lg relative"
      onClick={() => navigate(`/property/${property.id}`)}
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
    </div>
  );
};

export default CompactPropertyCard;
