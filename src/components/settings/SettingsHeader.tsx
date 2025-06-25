
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface SettingsHeaderProps {
  username: string;
  userRole: string;
}

export function SettingsHeader({ username, userRole }: SettingsHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>{t("Settings")}</CardTitle>
          <div className="flex items-center mt-2 space-x-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t("Current Role")}:</span>
            <Badge variant={userRole === "admin" ? "default" : "secondary"}>
              {userRole === "admin" ? t("Administrator") : t("User")}
            </Badge>
          </div>
        </div>
      </div>
    </CardHeader>
  );
}
