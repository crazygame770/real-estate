import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Lock, Mail, Phone, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import { ChangeUsernameDialog } from "@/components/settings/ChangeUsernameDialog";
import { ChangePasswordDialog } from "@/components/settings/ChangePasswordDialog";
import { ChangeEmailDialog } from "@/components/settings/ChangeEmailDialog";
import { ChangePhoneDialog } from "@/components/settings/ChangePhoneDialog";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  
  // User data state
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    username: "",
    role: "user",
    email: "",
    phone: "",
    profilePicture: "/placeholder.svg",
  });
  
  const [username, setUsername] = useState(userData.username);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        
        // Get user email from auth
        const { data: authData } = await supabase.auth.getUser();
        
        // Get profile data
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('username, profile_picture_url, role, phone')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Failed to load user profile",
            variant: "destructive",
          });
          return;
        }
        
        if (profileData && authData.user) {
          setUserData({
            username: profileData.username || "",
            role: profileData.role || "user",
            email: authData.user.email || "",
            phone: profileData.phone || "",
            profilePicture: profileData.profile_picture_url || "/placeholder.svg",
          });
          
          setUsername(profileData.username || "");
          setEmail(authData.user.email || "");
          setPhone(profileData.phone || "");
        }
      } else {
        // No user logged in, redirect to auth page
        navigate("/auth");
      }
    };
    
    fetchUserData();
  }, [navigate, toast]);

  const handleSubmit = async (type: string) => {
    setLoading(true);
    
    try {
      if (!userId) {
        throw new Error(t("User not authenticated"));
      }
      
      if (type === t("Password")) {
        if (!oldPassword) {
          throw new Error(t("Please enter your current password"));
        }
        if (password !== confirmPassword) {
          throw new Error(t("Passwords do not match"));
        }
        
        // Verify old password by attempting to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: oldPassword,
        });
        
        if (signInError) {
          throw new Error(t("Current password is incorrect"));
        }
        
        // Update password
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
      }

      if (type === t("Username")) {
        // Update username in profiles table
        const { error } = await supabase
          .from('profiles')
          .update({ username })
          .eq('id', userId);
          
        if (error) throw error;
        
        // Update local state
        setUserData(prev => ({ ...prev, username }));
      }

      if (type === t("Email") && email) {
        if (!email.includes("@")) {
          throw new Error(t("Please enter a valid email address"));
        }
        
        // Update email in auth
        const { error } = await supabase.auth.updateUser({ email });
        if (error) throw error;
        
        // Update local state
        setUserData(prev => ({ ...prev, email }));
      }

      if (type === t("Phone number") && phone) {
        // Update phone in profiles table
        const { error } = await supabase
          .from('profiles')
          .update({ phone })
          .eq('id', userId);
          
        if (error) throw error;
        
        // Update local state
        setUserData(prev => ({ ...prev, phone }));
      }

      toast({
        title: t("Success"),
        description: t(`${type} updated successfully!`),
      });
      
      setActiveDialog(null);
      
      // Reset form fields
      if (type === t("Password")) {
        setOldPassword("");
        setPassword("");
        setConfirmPassword("");
      }
      
    } catch (error: any) {
      toast({
        title: t("Error"),
        description: error.message || t(`Failed to update ${type.toLowerCase()}`),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const settingsButtons = [
    {
      icon: <User className="mr-2 h-4 w-4" />,
      label: t("Change Username"),
      dialog: "username"
    },
    {
      icon: <Lock className="mr-2 h-4 w-4" />,
      label: t("Change Password"),
      dialog: "password"
    },
    {
      icon: <Mail className="mr-2 h-4 w-4" />,
      label: t("Change Email"),
      dialog: "email"
    },
    {
      icon: <Phone className="mr-2 h-4 w-4" />,
      label: t("Change Phone Number"),
      dialog: "phone"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-6"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t("Back to Main Menu")}
            </Button>

            <Card>
              <SettingsHeader username={userData.username} userRole={userData.role} />
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  {t("Logged in as")} {userData.username}
                </div>

                {settingsButtons.map((button) => (
                  <Button
                    key={button.dialog}
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => setActiveDialog(button.dialog)}
                  >
                    {button.icon}
                    {button.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <ChangeUsernameDialog
              open={activeDialog === "username"}
              onOpenChange={() => setActiveDialog(null)}
              username={username}
              setUsername={setUsername}
              onSubmit={handleSubmit}
              currentUsername={userData.username}
              loading={loading}
            />

            <ChangePasswordDialog
              open={activeDialog === "password"}
              onOpenChange={() => setActiveDialog(null)}
              oldPassword={oldPassword}
              password={password}
              confirmPassword={confirmPassword}
              setOldPassword={setOldPassword}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              onSubmit={handleSubmit}
              loading={loading}
            />

            <ChangeEmailDialog
              open={activeDialog === "email"}
              onOpenChange={() => setActiveDialog(null)}
              currentEmail={userData.email}
              email={email}
              setEmail={setEmail}
              onSubmit={handleSubmit}
              loading={loading}
            />

            <ChangePhoneDialog
              open={activeDialog === "phone"}
              onOpenChange={() => setActiveDialog(null)}
              currentPhone={userData.phone}
              phone={phone}
              setPhone={setPhone}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
