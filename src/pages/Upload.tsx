
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { House, ShieldAlert, ArrowLeft } from "lucide-react";
import { UploadForm } from "@/components/upload/UploadForm";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/components/sidebar/types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Upload = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user role:', error);
            toast({
              title: "Error",
              description: "Could not verify user permissions",
              variant: "destructive",
            });
            return;
          }

          if (data) {
            setUserRole(data.role as UserRole);
          }
        }
      } catch (error) {
        console.error('Error in checkUserRole:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [toast]);

  if (loading) {
    return null;
  }

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">{t("Access Denied")}</h1>
          <p className="text-muted-foreground">{t("Only administrators can access this page.")}</p>
          <Button onClick={() => navigate("/")} variant="default">
            <House className="mr-2 h-4 w-4" />
            {t("Return to Home")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="flex items-center text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("Back to Main Menu")}
              </Button>
              <h1 className="text-2xl font-bold text-foreground">{t("Upload Property")}</h1>
            </div>
            <UploadForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Upload;
