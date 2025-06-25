
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyTypeSelector } from "@/components/upload/PropertyTypeSelector";
import { EnergyClassSelector } from "@/components/upload/EnergyClassSelector";
import { FloorSelector } from "@/components/upload/FloorSelector";
import { PropertyType, EnergyClass } from "@/types/propertyTypes";

interface EditPropertyDialogProps {
  property: any;
  onPropertyUpdated: () => void;
}

export const EditPropertyDialog = ({ property, onPropertyUpdated }: EditPropertyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(property.title);
  const [description, setDescription] = useState(property.description || "");
  const [price, setPrice] = useState(property.price);
  const [propertyType, setPropertyType] = useState<PropertyType>(property.property_type);
  const [floor, setFloor] = useState<number | null>(property.floor);
  const [energyClass, setEnergyClass] = useState<EnergyClass>(property.energy_class);
  const [yearBuilt, setYearBuilt] = useState(property.year_built);
  const [area, setArea] = useState(property.area);
  const [bedrooms, setBedrooms] = useState(property.bedrooms);
  const [bathrooms, setBathrooms] = useState(property.bathrooms);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title,
          description,
          price,
          property_type: propertyType,
          floor,
          energy_class: energyClass,
          year_built: yearBuilt,
          area,
          bedrooms,
          bathrooms,
          updated_at: new Date().toISOString()
        })
        .eq('id', property.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property updated successfully",
      });

      onPropertyUpdated();
      setOpen(false);
    } catch (error: any) {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update property",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="price">Price (€)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>

            <PropertyTypeSelector
              propertyType={propertyType}
              onPropertyTypeChange={setPropertyType}
            />

            {propertyType === 'apartment' && (
              <FloorSelector
                floor={floor}
                onFloorChange={setFloor}
              />
            )}

            <EnergyClassSelector
              energyClass={energyClass}
              onEnergyClassChange={setEnergyClass}
            />

            <div>
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                type="number"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <Label htmlFor="area">Area (m²)</Label>
              <Input
                id="area"
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
