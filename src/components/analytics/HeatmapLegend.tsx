
import { useLanguage } from '@/contexts/LanguageContext';

const HeatmapLegend = () => {
  const { t } = useLanguage();

  return (
    <div className="mt-4 flex justify-center">
      <div className="flex items-center gap-1 text-xs">
        <span className="text-muted-foreground">{t("Price per m²")}:</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[#3182bd] rounded-sm"></div>
          <span>€1,000</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[#ffffbf] rounded-sm"></div>
          <span>€3,000</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[#fd8d3c] rounded-sm"></div>
          <span>€5,000</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[#e31a1c] rounded-sm"></div>
          <span>€8,000</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[#bd0026] rounded-sm"></div>
          <span>€10,000+</span>
        </div>
      </div>
    </div>
  );
};

export default HeatmapLegend;
