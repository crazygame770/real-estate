
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Heater, Sun, Bed, Bath, Square, Car } from "lucide-react";
import { PropertyFilters } from "@/types/propertyTypes";

interface PropertyFeaturesSectionProps {
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
}

const formatNumber = (num: number, max: number, isMax: boolean = false) => {
  if (isMax && num >= max) {
    return `${max.toLocaleString()}+`;
  }
  return num.toLocaleString();
};

const PropertyFeaturesSection = ({
  filters,
  setFilters,
}: PropertyFeaturesSectionProps) => {
  return (
    <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
      <h3 className="text-lg font-semibold text-foreground">Property Features</h3>
      
      {filters.propertyType === 'apartment' && (
        <div className="mt-4">
          <Label className="flex items-center gap-2">
            <Heater className="w-4 h-4" />
            Heating Type
          </Label>
          <div className="flex gap-4 mt-2">
            <Button
              variant={filters.heatingType === 'central' ? 'default' : 'outline'}
              onClick={() => setFilters({
                ...filters,
                heatingType: filters.heatingType === 'central' ? null : 'central'
              })}
              className="flex-1"
            >
              Central
            </Button>
            <Button
              variant={filters.heatingType === 'independent' ? 'default' : 'outline'}
              onClick={() => setFilters({
                ...filters,
                heatingType: filters.heatingType === 'independent' ? null : 'independent'
              })}
              className="flex-1"
            >
              Independent
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Label className="flex items-center gap-2">
          <Sun className="w-4 h-4" />
          Solar Water Heater
        </Label>
        <div className="flex gap-4 mt-2">
          <Button
            variant={filters.hasSolarWaterHeater === true ? 'default' : 'outline'}
            onClick={() => setFilters({
              ...filters,
              hasSolarWaterHeater: filters.hasSolarWaterHeater === true ? null : true
            })}
            className="flex-1"
          >
            Yes
          </Button>
          <Button
            variant={filters.hasSolarWaterHeater === false ? 'default' : 'outline'}
            onClick={() => setFilters({
              ...filters,
              hasSolarWaterHeater: filters.hasSolarWaterHeater === false ? null : false
            })}
            className="flex-1"
          >
            No
          </Button>
        </div>
      </div>

      <div>
        <Label className="flex items-center gap-2">
          <Bed className="w-4 h-4" />
          Bedrooms
        </Label>
        <div className="flex gap-4 mt-2">
          <Input 
            type="text"
            value={formatNumber(filters.bedroomRange[0], 6)}
            onChange={(e) => {
              const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
              setFilters({
                ...filters,
                bedroomRange: [value, filters.bedroomRange[1]]
              });
            }}
            placeholder="0" 
          />
          <Input 
            type="text"
            value={formatNumber(filters.bedroomRange[1], 6, true)}
            onChange={(e) => {
              const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
              setFilters({
                ...filters,
                bedroomRange: [filters.bedroomRange[0], value]
              });
            }}
            placeholder="6+" 
          />
        </div>
        <Slider
          className="mt-2"
          value={filters.bedroomRange}
          onValueChange={(value) => setFilters({
            ...filters,
            bedroomRange: value as [number, number]
          })}
          min={0}
          max={6}
          step={1}
        />
      </div>

      <div className="mt-4">
        <Label className="flex items-center gap-2">
          <Bath className="w-4 h-4" />
          Bathrooms
        </Label>
        <div className="flex gap-4 mt-2">
          <Input 
            type="text"
            value={formatNumber(filters.bathroomRange[0], 4)}
            onChange={(e) => {
              const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
              setFilters({
                ...filters,
                bathroomRange: [value, filters.bathroomRange[1]]
              });
            }}
            placeholder="0" 
          />
          <Input 
            type="text"
            value={formatNumber(filters.bathroomRange[1], 4, true)}
            onChange={(e) => {
              const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
              setFilters({
                ...filters,
                bathroomRange: [filters.bathroomRange[0], value]
              });
            }}
            placeholder="4+" 
          />
        </div>
        <Slider
          className="mt-2"
          value={filters.bathroomRange}
          onValueChange={(value) => setFilters({
            ...filters,
            bathroomRange: value as [number, number]
          })}
          min={0}
          max={4}
          step={1}
        />
      </div>

      <div className="mt-4">
        <Label className="flex items-center gap-2">
          <Square className="w-4 h-4" />
          Total Area (m²)
        </Label>
        <div className="flex gap-4 mt-2">
          <Input 
            type="text"
            value={formatNumber(filters.areaRange[0], 500)}
            onChange={(e) => {
              const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
              setFilters({
                ...filters,
                areaRange: [value, filters.areaRange[1]]
              });
            }}
            placeholder="0" 
          />
          <Input 
            type="text"
            value={formatNumber(filters.areaRange[1], 500, true)}
            onChange={(e) => {
              const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
              setFilters({
                ...filters,
                areaRange: [filters.areaRange[0], value]
              });
            }}
            placeholder="500+" 
          />
        </div>
        <Slider
          className="mt-2"
          value={filters.areaRange}
          onValueChange={(value) => setFilters({
            ...filters,
            areaRange: value as [number, number]
          })}
          min={0}
          max={500}
          step={10}
        />
      </div>

      <div className="mt-4">
        <Label className="flex items-center gap-2">
          <Car className="w-4 h-4" />
          Parking Space
        </Label>
        <div className="flex gap-4 mt-2">
          <Button
            variant={filters.hasParking === true ? 'default' : 'outline'}
            onClick={() => setFilters({
              ...filters,
              hasParking: filters.hasParking === true ? null : true
            })}
            className="flex-1"
          >
            Available
          </Button>
          <Button
            variant={filters.hasParking === false ? 'default' : 'outline'}
            onClick={() => setFilters({
              ...filters,
              hasParking: filters.hasParking === false ? null : false
            })}
            className="flex-1"
          >
            Not Available
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFeaturesSection;
