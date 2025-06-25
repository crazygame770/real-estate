
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RegionSection } from "@/components/neighborhood/RegionSection";
import { regionOrder, regionColors, regionNames } from "@/components/neighborhood/constants";
import type { RegionData, Neighborhood } from "@/components/neighborhood/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { getRegionData } from "@/utils/regionData";

const NeighborhoodManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedValues, setUpdatedValues] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  const fetchNeighborhoods = async () => {
    try {
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
        .order('name');

      if (error) throw error;

      const groupedData = data.reduce((acc: RegionData[], neighborhood) => {
        const regionId = neighborhood.region_id;
        const regionIndex = acc.findIndex(r => r.id === regionId);

        if (regionIndex === -1) {
          acc.push({
            id: regionId,
            name: t(regionNames[regionId]),
            neighborhoods: [neighborhood]
          });
        } else {
          acc[regionIndex].neighborhoods.push(neighborhood);
        }

        return acc;
      }, []);

      const sortedRegions = regionOrder.map(regionId => 
        groupedData.find(r => r.id === regionId)
      ).filter((r): r is RegionData => r !== undefined);

      sortedRegions.forEach(region => {
        region.neighborhoods.sort((a, b) => a.name.localeCompare(b.name));
      });

      setRegions(sortedRegions);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching neighborhoods:', error);
      toast({
        title: t("Error"),
        description: t("Failed to load neighborhoods"),
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (neighborhoodId: string, field: string, value: number) => {
    setUpdatedValues(prev => ({
      ...prev,
      [neighborhoodId]: {
        ...prev[neighborhoodId],
        [field]: value
      }
    }));
  };

  const handleSave = async (neighborhood: Neighborhood) => {
    if (!updatedValues[neighborhood.id]) {
      toast({
        description: t("No changes to save"),
      });
      return;
    }

    try {
      // Update the neighborhoods table
      const { error } = await supabase
        .from('neighborhoods')
        .update({
          walkability: updatedValues[neighborhood.id].walkability,
          safety: updatedValues[neighborhood.id].safety,
          education: updatedValues[neighborhood.id].education,
          green_spaces: updatedValues[neighborhood.id].green_spaces,
          entertainment: updatedValues[neighborhood.id].entertainment,
          retail: updatedValues[neighborhood.id].retail
        })
        .eq('name', neighborhood.name);

      if (error) throw error;

      // Update local dataset
      const regionId = regions.find(r => 
        r.neighborhoods.some(n => n.id === neighborhood.id)
      )?.id;

      if (regionId) {
        const regionData = getRegionData(regionId);
        if (regionData && regionData.neighborhoods) {
          const neighborhoodToUpdate = regionData.neighborhoods.find(n => n.name === neighborhood.name);
          if (neighborhoodToUpdate) {
            Object.assign(neighborhoodToUpdate, updatedValues[neighborhood.id]);
          }
        }
      }

      toast({
        title: t("Success"),
        description: t("Updated") + " " + neighborhood.name,
      });

      // Clear the updated values for this neighborhood
      setUpdatedValues(prev => {
        const newValues = { ...prev };
        delete newValues[neighborhood.id];
        return newValues;
      });

      // Refresh the neighborhoods data
      fetchNeighborhoods();
    } catch (error: any) {
      console.error('Error updating neighborhood:', error);
      toast({
        title: t("Error"),
        description: t("Failed to update neighborhood"),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>{t("Loading...")}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar activeItem="Edit Neighborhood" />
      <div className="flex-1 p-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("Back to Main Menu")}
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">{t("Edit Neighborhoods")}</h1>

        {regions.map((region) => (
          <RegionSection
            key={region.id}
            region={region}
            regionColor={regionColors[region.id]}
            updatedValues={updatedValues}
            onInputChange={handleInputChange}
            onSave={handleSave}
          />
        ))}
      </div>
    </div>
  );
};

export default NeighborhoodManagement;
