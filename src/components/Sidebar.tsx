
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import LoanCalculator from "./LoanCalculator";
import SidebarHeader from "./sidebar/SidebarHeader";
import Navigation from "./sidebar/Navigation";
import { getMenuItems } from "./sidebar/menuItems";
import { SidebarProps } from "./sidebar/types";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";

const defaultMapProperties = [
  {
    id: 1,
    title: "Luxury Villa in Peristeri",
    price: 350000,
    coordinates: [23.7275, 37.9838] as [number, number],
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Modern Apartment in Aigaleo",
    price: 280000,
    coordinates: [23.6868, 37.9934] as [number, number],
    image: "/placeholder.svg"
  }
];

const Sidebar = ({ activeItem }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [currentActiveItem, setCurrentActiveItem] = useState(activeItem || "Map View");
  const [showLoanCalculator, setShowLoanCalculator] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return theme === "dark";
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = getMenuItems();
  const isMainPage = location.pathname === "/";

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMainPage) {
        if (e.clientX <= 10) {
          setIsHovered(true);
          // Remove the mouseY tracking since we want a static sidebar
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isMainPage]);

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const handleMouseLeave = () => {
    if (!isMainPage) {
      const timeout = setTimeout(() => {
        setIsHovered(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  };

  useEffect(() => {
    if (activeItem) {
      setCurrentActiveItem(activeItem);
    } else {
      const currentPath = location.pathname;
      const matchingItem = menuItems.find(item => item.href === currentPath);
      if (matchingItem) {
        setCurrentActiveItem(matchingItem.label);
      }
    }
  }, [location, activeItem, menuItems]);

  useEffect(() => {
    setIsCollapsed(location.pathname !== "/");
  }, [location.pathname]);

  const sidebarClasses = cn(
    "border-r bg-background border-border transition-all duration-300 z-50",
    isMainPage 
      ? "w-60 fixed top-0 left-0 h-screen" 
      : cn("fixed left-0 h-screen", isCollapsed ? (isHovered ? "w-60" : "w-1") : "w-60")
  );

  const contentClasses = cn(
    "transition-opacity duration-300 h-full",
    !isMainPage && isCollapsed && !isHovered ? "opacity-0 invisible" : "opacity-100 visible"
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const calculatorWrapper = document.querySelector('.calculator-wrapper');
      if (calculatorWrapper && !calculatorWrapper.contains(event.target as Node)) {
        setShowLoanCalculator(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <aside 
      className={sidebarClasses}
      style={{ top: 0 }} // Set a fixed top position
      onMouseLeave={handleMouseLeave}
    >
      <div className={contentClasses}>
        <SidebarHeader />
        <Navigation 
          menuItems={menuItems}
          currentActiveItem={currentActiveItem}
          setCurrentActiveItem={setCurrentActiveItem}
          setShowLoanCalculator={setShowLoanCalculator}
          showLoanCalculator={showLoanCalculator}
          mapProperties={defaultMapProperties}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
        <div className="p-4 mt-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-start hover:bg-muted hover:text-[#ea384c] group" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4 group-hover:text-[#ea384c]" />
            {t("Logout")}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
