
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface ErrorMatrixProps {
  title: string;
  error: unknown;
  onRetry?: () => void;
}

export const ErrorMatrix = ({ title, error, onRetry }: ErrorMatrixProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-red-500 mb-4">
        {t("Error loading data. Please try again.")}
      </p>
      {error && <p className="text-sm text-red-400 mb-4">{String(error)}</p>}
      {onRetry && (
        <Button 
          onClick={onRetry} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          {t("Try again")}
        </Button>
      )}
    </Card>
  );
};
