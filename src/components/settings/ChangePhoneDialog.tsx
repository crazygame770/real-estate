
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChangePhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhone: string;
  phone: string;
  setPhone: (phone: string) => void;
  onSubmit: (type: string) => void;
  loading: boolean;
}

export function ChangePhoneDialog({
  open,
  onOpenChange,
  currentPhone,
  phone,
  setPhone,
  onSubmit,
  loading,
}: ChangePhoneDialogProps) {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Change Phone Number")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="text-sm text-muted-foreground">
            {t("Current Phone Number")}: {currentPhone}
          </div>
          <Input
            type="tel"
            placeholder={t("New Phone Number")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>{t("Cancel")}</Button>
            <Button 
              onClick={() => onSubmit(t("Phone number"))}
              disabled={!phone || phone === currentPhone || loading}
            >
              {loading ? t("Updating...") : t("Save Changes")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
