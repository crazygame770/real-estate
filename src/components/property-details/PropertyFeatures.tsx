
import { Car, Home, Zap, Euro } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyStats } from "../PropertyStats";
import { format, differenceInDays } from "date-fns";
import { Property } from "@/types/propertyTypes";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyFeaturesProps {
  property: Property;
}

export function PropertyFeatures({ property }: PropertyFeaturesProps) {
  const { t } = useLanguage();
  const createdDate = new Date(property.created_at);
  const today = new Date();
  const daysListed = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{t("Property Details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t("PROPERTY TYPE")}</p>
                </div>
                <p className="font-medium ml-6">
                  {property.property_type === 'apartment' ? 
                    `${t("Apartments")} (${t("Floor Number")} ${property.floor})` : 
                    t('Houses')}
                </p>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t("PRICE")}</p>
                </div>
                <p className="font-medium ml-6">€{property.price.toLocaleString()}</p>
              </div>

              {property.property_type === 'apartment' && (
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{t("HEATING TYPE")}</p>
                  </div>
                  <p className="font-medium ml-6">{t(property.heating_type) || 'N/A'}</p>
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t("PARKING SPACE")}</p>
                </div>
                <p className="font-medium ml-6">{property.parking ? t('Yes') : t('No')}</p>
              </div>
            </div>
            <PropertyStats 
              yearBuilt={property.year_built}
              energyClass={property.energy_class}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
              listedOn={format(createdDate, 'MMMM d, yyyy')}
              daysListed={daysListed}
              solarWaterHeater={property.solar_water_heater}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{t("About this property")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {property.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
