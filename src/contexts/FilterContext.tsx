
import { createContext, useContext, useState, ReactNode } from 'react';
import { SortOption, FilterState, PropertyType } from '@/types/propertyTypes';

interface FilterContextType {
  // Main menu filters
  mainFilters: FilterState;
  setMainPriceRange: (range: [number, number]) => void;
  setMainAreaRange: (range: [number, number]) => void;
  setMainBedroomRange: (range: [number, number]) => void;
  setMainBathroomRange: (range: [number, number]) => void;
  setMainSelectedRegions: (regions: { name: string; region: string; color: string; }[]) => void;
  setMainSortBy: (sortBy: SortOption) => void;
  setMainPropertyType: (propertyType: PropertyType) => void;

  // Advanced search filters
  advancedFilters: FilterState;
  setAdvancedPriceRange: (range: [number, number]) => void;
  setAdvancedAreaRange: (range: [number, number]) => void;
  setAdvancedBedroomRange: (range: [number, number]) => void;
  setAdvancedBathroomRange: (range: [number, number]) => void;
  setAdvancedSelectedRegions: (regions: { name: string; region: string; color: string; }[]) => void;
  setAdvancedSortBy: (sortBy: SortOption) => void;
  setAdvancedPropertyType: (propertyType: PropertyType) => void;

  // Favorites
  favorites: number[];
  toggleFavorite: (propertyId: number) => void;
}

const defaultFilterState: FilterState = {
  priceRange: [0, 1000000],
  areaRange: [0, 500],
  bedroomRange: [0, 6],
  bathroomRange: [0, 4],
  selectedRegions: [],
  sortBy: '',
  propertyType: null
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  // Main menu filters
  const [mainPriceRange, setMainPriceRange] = useState<[number, number]>(defaultFilterState.priceRange);
  const [mainAreaRange, setMainAreaRange] = useState<[number, number]>(defaultFilterState.areaRange);
  const [mainBedroomRange, setMainBedroomRange] = useState<[number, number]>(defaultFilterState.bedroomRange);
  const [mainBathroomRange, setMainBathroomRange] = useState<[number, number]>(defaultFilterState.bathroomRange);
  const [mainSelectedRegions, setMainSelectedRegions] = useState<{ name: string; region: string; color: string; }[]>(defaultFilterState.selectedRegions);
  const [mainSortBy, setMainSortBy] = useState<SortOption>(defaultFilterState.sortBy);
  const [mainPropertyType, setMainPropertyType] = useState<PropertyType>(defaultFilterState.propertyType);

  // Advanced search filters
  const [advancedPriceRange, setAdvancedPriceRange] = useState<[number, number]>(defaultFilterState.priceRange);
  const [advancedAreaRange, setAdvancedAreaRange] = useState<[number, number]>(defaultFilterState.areaRange);
  const [advancedBedroomRange, setAdvancedBedroomRange] = useState<[number, number]>(defaultFilterState.bedroomRange);
  const [advancedBathroomRange, setAdvancedBathroomRange] = useState<[number, number]>(defaultFilterState.bathroomRange);
  const [advancedSelectedRegions, setAdvancedSelectedRegions] = useState<{ name: string; region: string; color: string; }[]>(defaultFilterState.selectedRegions);
  const [advancedSortBy, setAdvancedSortBy] = useState<SortOption>(defaultFilterState.sortBy);
  const [advancedPropertyType, setAdvancedPropertyType] = useState<PropertyType>(defaultFilterState.propertyType);

  // Favorites
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (propertyId: number) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const mainFilters: FilterState = {
    priceRange: mainPriceRange,
    areaRange: mainAreaRange,
    bedroomRange: mainBedroomRange,
    bathroomRange: mainBathroomRange,
    selectedRegions: mainSelectedRegions,
    sortBy: mainSortBy,
    propertyType: mainPropertyType
  };

  const advancedFilters: FilterState = {
    priceRange: advancedPriceRange,
    areaRange: advancedAreaRange,
    bedroomRange: advancedBedroomRange,
    bathroomRange: advancedBathroomRange,
    selectedRegions: advancedSelectedRegions,
    sortBy: advancedSortBy,
    propertyType: advancedPropertyType
  };

  return (
    <FilterContext.Provider value={{
      mainFilters,
      setMainPriceRange,
      setMainAreaRange,
      setMainBedroomRange,
      setMainBathroomRange,
      setMainSelectedRegions,
      setMainSortBy,
      setMainPropertyType,
      advancedFilters,
      setAdvancedPriceRange,
      setAdvancedAreaRange,
      setAdvancedBedroomRange,
      setAdvancedBathroomRange,
      setAdvancedSelectedRegions,
      setAdvancedSortBy,
      setAdvancedPropertyType,
      favorites,
      toggleFavorite,
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
