
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { House, Building2, MapPin, ArrowUp, Euro, Gauge } from "lucide-react";
import RegionSelector from "../RegionSelector";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { PropertyFilters, PropertyType } from "@/types/propertyTypes";

interface PropertyTypeSectionProps {
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
}

const formatPrice = (price: number, isMax: boolean = false) => {
  if (isMax && price >= 1000000) {
    return "1.000.000+";
  }
  return price.toLocaleString('de-DE');
};

const parseNumericInput = (value: string) => {
  const parsed = parseInt(value.replace(/[^0-9]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

const PropertyTypeSection = ({
  filters,
  setFilters,
}: PropertyTypeSectionProps) => {
  const energyClassOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const handlePropertyTypeClick = (type: PropertyType) => {
    setFilters({
      ...filters,
      propertyType: filters.propertyType === type ? null : type
    });
  };

  const handlePriceRangeChange = (values: number[]) => {
    const [min, max] = values;
    setFilters({
      ...filters,
      priceRange: [min, max]
    });
  };

  const handleRegionsChange = (selectedRegions: { name: string; region: string; color: string; }[]) => {
    setFilters({
      ...filters,
      selectedRegions: selectedRegions
    });
  };

  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
      <h3 className="text-lg font-semibold dark:text-white">Property Type</h3>
      
      <div className="mt-4">
        <Label className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4" />
          Location
        </Label>
        <RegionSelector 
          selectedRegions={filters.selectedRegions}
          onRegionsChange={handleRegionsChange}
        />
      </div>

      <div className="flex gap-4">
        <Button
          variant={filters.propertyType === 'house' ? 'default' : 'outline'}
          onClick={() => handlePropertyTypeClick('house')}
          className="flex-1"
        >
          <House className="mr-2 h-4 w-4" />
          House
        </Button>
        <Button
          variant={filters.propertyType === 'apartment' ? 'default' : 'outline'}
          onClick={() => handlePropertyTypeClick('apartment')}
          className="flex-1"
        >
          <Building2 className="mr-2 h-4 w-4" />
          Apartment
        </Button>
      </div>

      {filters.propertyType === 'apartment' && (
        <div className="mt-4">
          <Label className="flex items-center gap-2">
            <ArrowUp className="w-4 h-4" />
            Floor Number
          </Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            <Button
              variant={filters.floorNumbers.includes(0) ? 'default' : 'outline'}
              onClick={() => {
                setFilters({
                  ...filters,
                  floorNumbers: filters.floorNumbers.includes(0)
                    ? filters.floorNumbers.filter(f => f !== 0)
                    : [...filters.floorNumbers, 0]
                });
              }}
              className="w-full"
            >
              Ground
            </Button>
            {[1, 2, 3, 4, 5, 6].map((floor) => (
              <Button
                key={floor}
                variant={filters.floorNumbers.includes(floor) ? 'default' : 'outline'}
                onClick={() => {
                  setFilters({
                    ...filters,
                    floorNumbers: filters.floorNumbers.includes(floor)
                      ? filters.floorNumbers.filter(f => f !== floor)
                      : [...filters.floorNumbers, floor]
                  });
                }}
                className="w-full"
              >
                {floor}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <Label className="flex items-center gap-2">
          <Euro className="w-4 h-4" />
          Price Range (€)
        </Label>
        <div className="flex gap-4 mt-2">
          <Input 
            type="text"
            value={formatPrice(filters.priceRange[0])}
            onChange={(e) => {
              const value = parseNumericInput(e.target.value);
              if (value <= filters.priceRange[1]) {
                handlePriceRangeChange([value, filters.priceRange[1]]);
              }
            }}
            placeholder="€0" 
          />
          <Input 
            type="text"
            value={formatPrice(filters.priceRange[1], true)}
            onChange={(e) => {
              const value = parseNumericInput(e.target.value);
              if (value >= filters.priceRange[0]) {
                handlePriceRangeChange([filters.priceRange[0], value]);
              }
            }}
            placeholder="€1.000.000+" 
          />
        </div>
        <Slider
          value={filters.priceRange}
          onValueChange={handlePriceRangeChange}
          min={0}
          max={1000000}
          step={10000}
          className="mt-2"
        />
      </div>

      <div className="mt-4">
        <Label className="flex items-center gap-2">
          <Gauge className="w-4 h-4" />
          Energy Class
        </Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {energyClassOptions.map((class_) => (
            <Button
              key={class_}
              variant={filters.energyClasses.includes(class_ as any) ? 'default' : 'outline'}
              onClick={() => {
                setFilters({
                  ...filters,
                  energyClasses: filters.energyClasses.includes(class_ as any)
                    ? filters.energyClasses.filter(c => c !== class_)
                    : [...filters.energyClasses, class_ as any]
                });
              }}
              className="w-full"
            >
              Class {class_}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyTypeSection;
