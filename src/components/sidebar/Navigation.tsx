
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { MenuItem } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import LoanCalculator from "../LoanCalculator";
import { LanguageSelector } from "../LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavigationProps {
  menuItems: MenuItem[];
  currentActiveItem: string;
  setCurrentActiveItem: (item: string) => void;
  setShowLoanCalculator: (show: boolean) => void;
  showLoanCalculator: boolean;
  mapProperties: any[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Navigation = ({
  menuItems,
  currentActiveItem,
  setCurrentActiveItem,
  setShowLoanCalculator,
  showLoanCalculator,
  isDarkMode,
  onToggleTheme,
}: NavigationProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profiles?.role === 'admin');
      }
    };

    checkAdminStatus();
  }, []);

  const handleMenuItemClick = (menuItem: MenuItem) => {
    if (menuItem.adminOnly && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "This feature is only available to administrators.",
        variant: "destructive",
      });
      return;
    }

    if (menuItem.isLanguageSelector) {
      // Do nothing for language selector, it's handled by the LanguageSelector component
      setCurrentActiveItem(menuItem.label);
      return;
    }

    if (menuItem.label === "Loan Calculator") {
      setShowLoanCalculator(!showLoanCalculator);
      setCurrentActiveItem(menuItem.label);
    } else {
      setCurrentActiveItem(menuItem.label);
      setShowLoanCalculator(false);
      navigate(menuItem.href);
    }
  };

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <div className="px-3 py-2">
      <nav className="space-y-1">
        {filteredMenuItems.map((menuItem, index) => {
          const Icon = menuItem.icon;
          const isLoanCalculator = menuItem.label === "Loan Calculator";
          const isLanguageSelector = menuItem.isLanguageSelector;
          const nextItemIsFavorites = filteredMenuItems[index + 1]?.label === "Favorites";

          return (
            <div key={menuItem.label}>
              {isLanguageSelector ? (
                <div className="mt-1">
                  <LanguageSelector />
                </div>
              ) : (
                <button
                  className={cn(
                    "flex items-center w-full space-x-3 px-3 py-2 text-sm rounded-md transition-colors",
                    currentActiveItem === menuItem.label
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => handleMenuItemClick(menuItem)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{t(menuItem.label)}</span>
                </button>
              )}
              {isLoanCalculator && showLoanCalculator && nextItemIsFavorites && (
                <div className="mt-2 mb-2 px-3">
                  <LoanCalculator isOpen={showLoanCalculator} />
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <Separator className="my-4" />
      <Button
        variant="ghost"
        className="w-full justify-start hover:bg-muted"
        onClick={() => {
          const newTheme = theme === "dark" ? "light" : "dark";
          setTheme(newTheme);
          onToggleTheme();
        }}
      >
        {theme === "dark" ? (
          <>
            <Sun className="mr-2 h-4 w-4" />
            <span className="whitespace-nowrap">{t("Light")}</span>
          </>
        ) : (
          <>
            <Moon className="mr-2 h-4 w-4" />
            <span className="whitespace-nowrap">{t("Dark")}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default Navigation;
