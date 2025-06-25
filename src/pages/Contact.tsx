
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AdminContact {
  email: string;
  phone: string;
}

const Contact = () => {
  const navigate = useNavigate();
  const [adminContact, setAdminContact] = useState<AdminContact>({
    email: "efthym_tsimp@yahoo.com", // Default value
    phone: "+30 6944752491", // Default value
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminContact = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, phone')
          .eq('role', 'admin')
          .single();

        if (error) {
          console.error('Error fetching admin data:', error);
        } else if (data) {
          // If admin data is found, update state
          setAdminContact({
            email: "efthym_tsimp@yahoo.com", // We keep the default email for now
            phone: data.phone || "+30 6944752491", // Use fetched phone or default
          });
        }
      } catch (error) {
        console.error('Error in admin data fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminContact();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar activeItem="Contact" />
        <main className="flex-1 p-6 ml-60 overflow-x-hidden">
          <div className="max-w-4xl mx-auto space-y-6">
            <Button 
              onClick={() => navigate('/faq')}
              variant="outline"
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to FAQ
            </Button>
            
            <div className="flex items-center space-x-2 mb-8">
              <Mail className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Contact Support</h1>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-border shadow-md p-8">
              <h2 className="text-xl font-semibold mb-6">Administrator Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <a 
                      href={`mailto:${adminContact.email}`} 
                      className="text-primary hover:underline"
                    >
                      {adminContact.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <a 
                      href={`tel:${adminContact.phone.replace(/\s/g, '')}`} 
                      className="text-primary hover:underline"
                    >
                      {adminContact.phone}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-muted-foreground">
                  For any questions about properties, platform features, or technical assistance, 
                  please reach out using the contact information above. If you would like to upload 
                  your own property for sale, please contact the administrator directly. Our administrator will 
                  get back to you as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Contact;
