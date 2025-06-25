
import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "../ui/button";

interface ViewAllButtonProps {
  show: boolean;
  isHomePage: boolean;
  onClick?: () => void;
}

const ViewAllButton = ({ show, isHomePage, onClick }: ViewAllButtonProps) => {
  const { t } = useLanguage();

  if (!show || !isHomePage) return null;

  return (
    <div className="mt-8 text-center">
      <Button 
        onClick={onClick}
        size="lg"
        className="animate-fade-in"
      >
        {t("View All Properties")}
        <MapPin className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewAllButton;
