
import { LucideIcon } from "lucide-react";

export type UserRole = "admin" | "user";

export interface MenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
  adminOnly?: boolean;
  isLanguageSelector?: boolean;
}

export interface SidebarProps {
  activeItem?: string;
}
