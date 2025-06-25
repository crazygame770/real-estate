
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingMatrixProps {
  title: string;
}

export const LoadingMatrix = ({ title }: LoadingMatrixProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <p className="text-muted-foreground">{t("Loading data...")}</p>
      </div>
    </Card>
  );
};
