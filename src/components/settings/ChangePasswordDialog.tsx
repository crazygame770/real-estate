
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  oldPassword: string;
  password: string;
  confirmPassword: string;
  setOldPassword: (password: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  onSubmit: (type: string) => void;
  loading: boolean;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  oldPassword,
  password,
  confirmPassword,
  setOldPassword,
  setPassword,
  setConfirmPassword,
  onSubmit,
  loading,
}: ChangePasswordDialogProps) {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Change Password")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            type="password"
            placeholder={t("Current Password")}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder={t("New Password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder={t("Confirm New Password")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>{t("Cancel")}</Button>
            <Button 
              onClick={() => onSubmit(t("Password"))}
              disabled={!oldPassword || !password || password !== confirmPassword || loading}
            >
              {loading ? t("Updating...") : t("Save Changes")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
