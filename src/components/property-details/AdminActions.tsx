
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditPropertyDialog } from "./EditPropertyDialog";

interface AdminActionsProps {
  property: any;
  onPropertyUpdated: () => void;
  onDelete: () => void;
}

export const AdminActions = ({ property, onPropertyUpdated, onDelete }: AdminActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <EditPropertyDialog 
        property={property}
        onPropertyUpdated={onPropertyUpdated}
      />
      <Button
        variant="destructive"
        size="icon"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
