
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChangeUsernameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  setUsername: (username: string) => void;
  onSubmit: (type: string) => void;
  currentUsername: string;
  loading: boolean;
}

export function ChangeUsernameDialog({
  open,
  onOpenChange,
  username,
  setUsername,
  onSubmit,
  currentUsername,
  loading,
}: ChangeUsernameDialogProps) {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Change Username")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="text-sm text-muted-foreground">
            {t("Current Username")}: {currentUsername}
          </div>
          <Input
            placeholder={t("New Username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>{t("Cancel")}</Button>
            <Button 
              onClick={() => onSubmit(t("Username"))}
              disabled={!username || username === currentUsername || loading}
            >
              {loading ? t("Updating...") : t("Save Changes")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
