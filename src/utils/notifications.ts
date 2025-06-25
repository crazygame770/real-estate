
import { supabase } from "@/integrations/supabase/client";

interface NotificationData {
  title: string;
  message: string;
  type: "property_added" | "property_deleted";
  propertyTitle: string;
}

export const createNotificationsForAllUsers = async (notificationData: NotificationData) => {
  try {
    // Get all users except the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id')
      .neq('id', user?.id);

    if (usersError) throw usersError;

    if (!users) return;

    // Create notifications for each user
    const notifications = users.map(u => ({
      user_id: u.id,
      ...notificationData
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) throw error;
  } catch (error) {
    console.error('Error creating notifications:', error);
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const getUnreadNotificationsCount = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    return 0;
  }
};
