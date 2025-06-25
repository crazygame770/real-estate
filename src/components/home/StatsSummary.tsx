
import { Target, Home, Calendar, Square } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StatsSummaryProps {
  averagePrice: number;
  propertiesCount: number;
  averageDaysListed: number;
  averagePricePerMeter: number;
  formatPrice: (price: number) => string;
}

const StatsSummary = ({
  averagePrice,
  propertiesCount,
  averageDaysListed,
  averagePricePerMeter,
  formatPrice
}: StatsSummaryProps) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border border-border shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-primary/70">{t("Average Price")}</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">€{formatPrice(averagePrice)}</h3>
          </div>
          <div className="bg-primary/10 p-2 rounded-lg">
            <Target className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border border-border shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-primary/70">{t("Total Listings")}</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">{formatPrice(propertiesCount)}</h3>
          </div>
          <div className="bg-primary/10 p-2 rounded-lg">
            <Home className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border border-border shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-primary/70">{t("Avg. Days Listed")}</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">{formatPrice(averageDaysListed)} {t("days")}</h3>
          </div>
          <div className="bg-primary/10 p-2 rounded-lg">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border border-border shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-primary/70">{t("Price per m²")}</p>
            <h3 className="text-2xl font-bold mt-1 text-foreground">€{formatPrice(averagePricePerMeter)}</h3>
          </div>
          <div className="bg-primary/10 p-2 rounded-lg">
            <Square className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
