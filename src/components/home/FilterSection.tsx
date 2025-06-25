
import PropertyFilter from "@/components/PropertyFilter";
import RegionSelector from "@/components/RegionSelector";
import { useFilter } from "@/contexts/FilterContext";

const FilterSection = () => {
  const { mainFilters, setMainSelectedRegions } = useFilter();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-border shadow-sm p-6 mb-6 transition-all duration-300 hover:shadow-md">
          <PropertyFilter />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-border shadow-sm p-6 transition-all duration-300 hover:shadow-md">
        <RegionSelector 
          selectedRegions={mainFilters.selectedRegions} 
          onRegionsChange={setMainSelectedRegions} 
        />
      </div>
    </div>
  );
};

export default FilterSection;
