
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { SortOption } from "@/types/propertyTypes";

interface SortSelectorProps {
  currentSort: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

const SortSelector = ({ currentSort, onSortChange }: SortSelectorProps) => {
  const { t } = useLanguage();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="bg-[#1A1F2C] text-white px-4 py-2 rounded hover:bg-[#1A1F2C]/90 flex items-center gap-2"
        >
          {getSortByDisplayText(currentSort)}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background border border-border">
        {sortOptions.map((option) => (
          <DropdownMenuItem 
            key={option.value} 
            onClick={() => onSortChange(option.value)}
            className={currentSort === option.value ? "bg-accent" : ""}
          >
            {t(option.label)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortSelector;
