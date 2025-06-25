
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import { getUnreadNotificationsCount } from "@/utils/notifications";
import { supabase } from "@/integrations/supabase/client";

const SidebarHeader = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    };

    fetchUnreadCount();

    // Subscribe to notification changes
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-6 border-b border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xl font-bold">
          AH
        </div>
        <div className="flex-1 flex items-center justify-between">
          <span className="font-semibold text-lg text-foreground">Athens Housing</span>
          <div className="relative">
            <Bell 
              className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" 
              onClick={() => navigate('/notifications')}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
      <UserProfile />
    </div>
  );
};

export default SidebarHeader;
