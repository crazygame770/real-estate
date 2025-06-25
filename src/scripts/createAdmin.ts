
import { supabase } from "@/integrations/supabase/client";

export const createAdminUser = async () => {
  try {
    // First check if admin already exists
    const { data: existingUsers, error: searchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', 'Efthymios-User')
      .single();

    if (searchError && searchError.code !== 'PGRST116') {
      console.error('Error checking existing admin:', searchError);
      throw searchError;
    }

    if (existingUsers) {
      console.log('Admin user already exists');
      return;
    }

    // Create new admin user
    const { data, error } = await supabase.auth.signUp({
      email: 'efthym_tsimp@yahoo.com',
      password: '358989765',
      options: {
        data: {
          username: 'Efthymios-User',
          phone: '6944752491',
          role: 'admin'
        }
      }
    });

    if (error) {
      console.error('Error creating admin:', error);
      throw error;
    }

    console.log('Admin user created successfully');
    return data;
  } catch (error) {
    console.error('Error in createAdminUser:', error);
    throw error;
  }
};
