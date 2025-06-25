
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "./types";

interface ProfileData {
  username: string;
  profile_picture_url: string | null;
  role: UserRole;
}

const UserProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, profile_picture_url, role')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
          {profile.profile_picture_url ? (
            <img 
              src={profile.profile_picture_url} 
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          {profile.role !== "admin" && (
            <div className="text-sm font-medium text-foreground">
              {profile.username}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-muted-foreground" />
            <Badge variant={profile.role === "admin" ? "default" : "secondary"} className="text-xs">
              {profile.role === "admin" ? "Administrator" : "User"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
