
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Euro } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HistoricalPrice {
  year: number;
  price: number;
}

interface HistoricalPricesInputProps {
  currentPrice: number;
  historicalPrices: HistoricalPrice[];
  onHistoricalPricesChange: (prices: HistoricalPrice[]) => void;
}

export const HistoricalPricesInput = ({
  currentPrice,
  historicalPrices,
  onHistoricalPricesChange,
}: HistoricalPricesInputProps) => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 9 + i);

  const handlePriceChange = (year: number, price: string) => {
    const numericPrice = parseInt(price.replace(/[^0-9]/g, '')) || 0;
    const updatedPrices = historicalPrices.map(p => 
      p.year === year ? { ...p, price: numericPrice } : p
    );
    onHistoricalPricesChange(updatedPrices);
  };

  const generateEstimates = () => {
    // Use actual historical data to generate estimates
    // On average, Athens property prices have grown ~3-5% annually in recent years
    const growth = 0.04; // 4% annual growth
    const basePrice = currentPrice;
    
    const estimates = years.map(year => ({
      year,
      price: Math.round(basePrice * (1 - (growth * (currentYear - year))))
    }));
    
    onHistoricalPricesChange(estimates);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">{t("Historical Prices")}</Label>
        <button
          type="button"
          onClick={generateEstimates}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          {t("Generate Estimates")}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {years.map((year) => {
          const priceForYear = historicalPrices.find(p => p.year === year)?.price || 0;
          return (
            <div key={year} className="space-y-2">
              <Label className="flex items-center gap-2">
                <Euro className="w-4 h-4" />
                {t("Price in")} {year}
              </Label>
              <Input
                type="text"
                value={priceForYear.toLocaleString()}
                onChange={(e) => handlePriceChange(year, e.target.value)}
                placeholder={`${t("Enter price for")} ${year}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
