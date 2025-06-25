
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Bed, Bath, Square, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilter } from "@/contexts/FilterContext";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SortOption } from "@/types/propertyTypes";

const formatPrice = (price: number, isMax: boolean = false) => {
  if (isMax && price >= 1000000) {
    return "1.000.000+";
  }
  return price.toLocaleString('de-DE');
};

const formatNumber = (num: number, max: number, isMax: boolean = false) => {
  if (isMax && num >= max) {
    return `${max.toLocaleString('de-DE')}+`;
  }
  return num.toLocaleString('de-DE');
};

const parseNumericInput = (value: string) => {
  const parsed = parseInt(value.replace(/[^0-9]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

const PropertyFilter = () => {
  const location = useLocation();
  const isAdvancedSearch = location.pathname === '/search';
  const { t, language } = useLanguage();
  const {
    mainFilters,
    setMainPriceRange,
    setMainAreaRange,
    setMainBedroomRange,
    setMainBathroomRange,
    setMainSortBy,
    advancedFilters,
    setAdvancedPriceRange,
    setAdvancedAreaRange,
    setAdvancedBedroomRange,
    setAdvancedBathroomRange,
    setAdvancedSortBy,
  } = useFilter();

  const filters = isAdvancedSearch ? advancedFilters : mainFilters;
  const setPriceRange = isAdvancedSearch ? setAdvancedPriceRange : setMainPriceRange;
  const setAreaRange = isAdvancedSearch ? setAdvancedAreaRange : setMainAreaRange;
  const setBedroomRange = isAdvancedSearch ? setAdvancedBedroomRange : setMainBedroomRange;
  const setBathroomRange = isAdvancedSearch ? setAdvancedBathroomRange : setMainBathroomRange;
  const setSortBy = isAdvancedSearch ? setAdvancedSortBy : setMainSortBy;

  useEffect(() => {
    if (filters.priceRange[0] === 0 && filters.priceRange[1] === 1000) {
      setPriceRange([0, 1000000]);
    }
  }, [filters.priceRange, setPriceRange]);

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    console.log("Price range changed to:", values);
  };

  const getSortByDisplayText = (sortBy: string) => {
    switch (sortBy) {
      case '':
        return t("Sort by");
      case 'recent-listed':
        return t("Most Recent");
      case 'oldest-listed':
        return t("Oldest First");
      case 'price-high-low':
        return t("Price: High to Low");
      case 'price-low-high':
        return t("Price: Low to High");
      case 'area-high-low':
        return t("Area: High to Low");
      case 'area-low-high':
        return t("Area: Low to High");
      default:
        return t("Sort by");
    }
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: '', label: 'Sort by' },
    { value: 'recent-listed', label: 'Most Recent' },
    { value: 'oldest-listed', label: 'Oldest First' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'area-high-low', label: 'Area: High to Low' },
    { value: 'area-low-high', label: 'Area: Low to High' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Filter className="w-5 h-5 mr-2 text-primary" />
          {t("Filter Properties")}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="flex items-center gap-2 mb-4">{t("Price Range (€)")}</Label>
          <div className="flex gap-4 mb-2">
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

        <div>
          <Label className="flex items-center gap-2 mb-4">
            <Square className="w-4 h-4" />
            {t("Area")} (m²)
          </Label>
          <div className="flex gap-4 mb-2">
            <Input 
              type="text"
              value={formatNumber(filters.areaRange[0], 500)}
              onChange={(e) => {
                const value = parseNumericInput(e.target.value);
                setAreaRange([value, filters.areaRange[1]]);
              }}
              placeholder="0" 
            />
            <Input 
              type="text"
              value={formatNumber(filters.areaRange[1], 500, true)}
              onChange={(e) => {
                const value = parseNumericInput(e.target.value);
                setAreaRange([filters.areaRange[0], value]);
              }}
              placeholder="500+" 
            />
          </div>
          <Slider
            value={filters.areaRange}
            onValueChange={(value) => setAreaRange(value as [number, number])}
            min={0}
            max={500}
            step={10}
          />
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-4">
            <Bed className="w-4 h-4" />
            {t("Bedrooms")}
          </Label>
          <div className="flex gap-4 mb-2">
            <Input 
              type="text"
              value={formatNumber(filters.bedroomRange[0], 6)}
              onChange={(e) => {
                const value = parseNumericInput(e.target.value);
                setBedroomRange([value, filters.bedroomRange[1]]);
              }}
              placeholder="0" 
            />
            <Input 
              type="text"
              value={formatNumber(filters.bedroomRange[1], 6, true)}
              onChange={(e) => {
                const value = parseNumericInput(e.target.value);
                setBedroomRange([filters.bedroomRange[0], value]);
              }}
              placeholder="6+" 
            />
          </div>
          <Slider
            value={filters.bedroomRange}
            onValueChange={(value) => setBedroomRange(value as [number, number])}
            min={0}
            max={6}
            step={1}
          />
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-4">
            <Bath className="w-4 h-4" />
            {t("Bathrooms")}
          </Label>
          <div className="flex gap-4 mb-2">
            <Input 
              type="text"
              value={formatNumber(filters.bathroomRange[0], 4)}
              onChange={(e) => {
                const value = parseNumericInput(e.target.value);
                setBathroomRange([value, filters.bathroomRange[1]]);
              }}
              placeholder="0" 
            />
            <Input 
              type="text"
              value={formatNumber(filters.bathroomRange[1], 4, true)}
              onChange={(e) => {
                const value = parseNumericInput(e.target.value);
                setBathroomRange([filters.bathroomRange[0], value]);
              }}
              placeholder="4+" 
            />
          </div>
          <Slider
            value={filters.bathroomRange}
            onValueChange={(value) => setBathroomRange(value as [number, number])}
            min={0}
            max={4}
            step={1}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[200px]">
              {getSortByDisplayText(filters.sortBy)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background border border-border">
            {sortOptions.map((option) => (
              <DropdownMenuItem 
                key={option.value} 
                onClick={() => setSortBy(option.value)}
                className={filters.sortBy === option.value ? "bg-accent" : ""}
              >
                {t(option.label)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PropertyFilter;
