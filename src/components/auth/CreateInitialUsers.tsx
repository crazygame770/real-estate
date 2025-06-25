
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CreateInitialUsers = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createUsers = async () => {
    setLoading(true);
    try {
      // Create regular user
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: 'efthym_tsimp@yahoo.com',
        password: '358989765',
        options: {
          data: {
            username: 'Efthymios-User',
            phone: '6944752491',
            role: 'user'
          }
        }
      });

      if (userError) throw userError;

      // Create admin user
      const { data: adminData, error: adminError } = await supabase.auth.signUp({
        email: 'etsimpidis@gmail.com',
        password: '358989765',
        options: {
          data: {
            username: 'Efthymios-Admin',
            phone: '6940613319',
            role: 'admin'
          }
        }
      });

      if (adminError) throw adminError;

      // Due to our trigger on auth.users, profiles will be automatically created

      toast({
        title: "Success",
        description: "Users created successfully. Check your emails to confirm the accounts.",
      });

      console.log('Created user:', userData);
      console.log('Created admin:', adminData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      console.error('Error creating users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <Button 
        onClick={createUsers} 
        disabled={loading}
        className="bg-primary"
      >
        {loading ? "Creating Users..." : "Create Initial Users"}
      </Button>
    </div>
  );
};
