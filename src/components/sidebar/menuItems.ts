
import { Home, Map, Calculator, Heart, Settings, Upload, LineChart, Search, HelpCircle, FileText, Edit, Globe } from "lucide-react";
import { MenuItem } from "./types";

export const getMenuItems = (): MenuItem[] => {
  return [
    {
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      label: "Map View",
      icon: Map,
      href: "/map",
    },
    {
      label: "Loan Calculator",
      icon: Calculator,
      href: "#",
    },
    {
      label: "Favorites",
      icon: Heart,
      href: "/favorites",
    },
    {
      label: "Upload Property",
      icon: Upload,
      href: "/upload",
      adminOnly: true,
    },
    {
      label: "Analytics",
      icon: LineChart,
      href: "/analytics",
    },
    {
      label: "Advanced Search",
      icon: Search,
      href: "/search",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
    },
    {
      label: "Edit Neighborhood",
      icon: Edit,
      href: "/neighborhood-management",
      adminOnly: true,
    },
    {
      label: "FAQ",
      icon: HelpCircle,
      href: "/faq",
    },
    {
      label: "Terms of Use",
      icon: FileText,
      href: "/terms",
    },
    {
      label: "Language",
      icon: Globe,
      href: "#",
      isLanguageSelector: true,
    }
  ];
};
