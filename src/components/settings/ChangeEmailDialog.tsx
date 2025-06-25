
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (type: string) => void;
  loading: boolean;
}

export function ChangeEmailDialog({
  open,
  onOpenChange,
  currentEmail,
  email,
  setEmail,
  onSubmit,
  loading,
}: ChangeEmailDialogProps) {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Change Email")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="text-sm text-muted-foreground">
            {t("Current Email")}: {currentEmail}
          </div>
          <Input
            type="email"
            placeholder={t("New Email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>{t("Cancel")}</Button>
            <Button 
              onClick={() => onSubmit(t("Email"))}
              disabled={!email || !email.includes('@') || email === currentEmail || loading}
            >
              {loading ? t("Updating...") : t("Save Changes")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
