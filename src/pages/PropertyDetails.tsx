
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createNotificationsForAllUsers } from "@/utils/notifications";
import { useState, useEffect } from "react";
import { PropertyContent } from "@/components/property-details/PropertyContent";
import { usePropertyData } from "@/components/property-details/usePropertyData";
import { useLanguage } from "@/contexts/LanguageContext";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);

  const { property, isLoading, refetch, neighborhoodScores } = usePropertyData(id!);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profile?.role === 'admin');
      }
    };

    checkAdmin();
  }, []);

  const handleDelete = async () => {
    if (!property) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);

      if (error) throw error;

      await createNotificationsForAllUsers({
        title: t("Property Deleted"),
        message: t("The property") + ` "${property.title}" ` + t("has been removed from the listings"),
        type: "property_deleted",
        propertyTitle: property.title
      });

      toast({
        title: t("Success"),
        description: t("Property has been deleted successfully."),
      });

      navigate('/');
    } catch (error: any) {
      console.error('Error deleting property:', error);
      toast({
        title: t("Error"),
        description: error.message || t("Failed to delete property"),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>{t("Loading...")}</div>;
  }

  if (!property) {
    return <div>{t("Property not found")}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <PropertyContent 
            property={property}
            isAdmin={isAdmin}
            neighborhoodScores={neighborhoodScores}
            onPropertyUpdated={refetch}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  );
};

export default PropertyDetails;
