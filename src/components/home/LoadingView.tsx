
import { Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LoadingView = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <Target className="w-16 h-16 text-primary/40 animate-spin" />
        </div>
        <p className="text-lg text-muted-foreground">{t("Loading properties...")}</p>
      </div>
    </div>
  );
};

export default LoadingView;
