
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import PropertyList from "@/components/PropertyList";
import { useLanguage } from "@/contexts/LanguageContext";

const Favorites = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-screen-2xl mx-auto space-y-6">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("Back to Main Menu")}
            </button>

            <div>
              <h1 className="text-2xl font-bold mb-2 text-foreground">{t("Favorite Properties")}</h1>
              <p className="text-muted-foreground">{t("View and manage your favorite properties")}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PropertyList showFavorites={true} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Favorites;
