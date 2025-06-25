
import { useLanguage } from "@/contexts/LanguageContext";

interface RegionStatsProps {
  avgPrice: string;
  pricePerMeter: string;
  yoyGrowth: string | null;
  avgYearlyGrowth: string | null;
  apartments: number;
  houses: number;
  apartmentsPercent: string;
  housesPercent: string;
}

const RegionStats = ({
  avgPrice,
  pricePerMeter,
  yoyGrowth,
  avgYearlyGrowth,
  apartments,
  houses,
  apartmentsPercent,
  housesPercent
}: RegionStatsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="col-span-4 grid grid-cols-4 gap-8">
      <div>
        <p className="text-sm text-gray-400">{t("Average Price")}</p>
        <p className="text-xl font-medium text-white mt-1">{avgPrice}</p>
        {yoyGrowth && (
          <p className={`text-sm ${parseFloat(yoyGrowth) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {yoyGrowth}% {t("last year")}
          </p>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-400">{t("Price per m²")}</p>
        <p className="text-xl font-medium text-white mt-1">{pricePerMeter}</p>
        {avgYearlyGrowth && (
          <p className={`text-sm ${parseFloat(avgYearlyGrowth) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {avgYearlyGrowth}% {t("yearly avg")}
          </p>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-400">{t("Apartments")}</p>
        <p className="text-xl font-medium text-white mt-1">{apartments}</p>
        <p className="text-sm text-gray-400">{apartmentsPercent} {t("of total")}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">{t("Houses")}</p>
        <p className="text-xl font-medium text-white mt-1">{houses}</p>
        <p className="text-sm text-gray-400">{housesPercent} {t("of total")}</p>
      </div>
    </div>
  );
};

export default RegionStats;
