
import Sidebar from "@/components/Sidebar";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromAuth = location.search.includes('from=auth');

  const handleGoBack = () => {
    if (fromAuth) {
      navigate('/auth');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {!fromAuth && <Sidebar activeItem="Privacy Policy" />}
        <main className={`flex-1 p-6 ${!fromAuth ? 'ml-60' : ''} overflow-x-hidden`}>
          <div className="max-w-4xl mx-auto space-y-6">
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {fromAuth ? 'Back to Sign Up' : 'Back to Main Menu'}
            </Button>
            
            <div className="flex items-center space-x-2 mb-8">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-border shadow-md p-8">
              <h2 className="text-xl font-semibold mb-6">Your Privacy Matters</h2>
              
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Athens Housing Platform is committed to protecting your privacy and ensuring the security of your personal data.
                  This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
                </p>
                
                <h3 className="text-lg font-medium mt-6">1. Information We Collect</h3>
                <p className="text-muted-foreground">
                  We collect personal information that you voluntarily provide to us when registering for an account,
                  including your name, email address, phone number, and profile picture. We also collect data about your
                  property searches, favorites, and interactions with listings.
                </p>
                
                <h3 className="text-lg font-medium mt-6">2. How We Use Your Information</h3>
                <p className="text-muted-foreground">
                  We use your information to provide and improve our services, process transactions, send notifications about
                  your account or properties you may be interested in, and analyze usage patterns to enhance user experience.
                </p>
                
                <h3 className="text-lg font-medium mt-6">3. Data Security</h3>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your personal data against
                  unauthorized access, alteration, disclosure, or destruction. All data is encrypted during transmission
                  and at rest.
                </p>
                
                <h3 className="text-lg font-medium mt-6">4. Sharing Your Information</h3>
                <p className="text-muted-foreground">
                  We do not sell or rent your personal information to third parties. We may share your information with
                  property owners or agents only when you express interest in a specific property, and only with your
                  explicit consent.
                </p>
                
                <h3 className="text-lg font-medium mt-6">5. Your Rights Under GDPR</h3>
                <p className="text-muted-foreground">
                  As a user based in the European Union, you have the right to access, rectify, delete, or port your personal
                  data. You can exercise these rights at any time by contacting our privacy team or using the relevant settings
                  in your account.
                </p>
                
                <h3 className="text-lg font-medium mt-6">6. Cookies and Tracking</h3>
                <p className="text-muted-foreground">
                  We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and
                  personalize content. You can manage your cookie preferences through your browser settings.
                </p>
                
                <h3 className="text-lg font-medium mt-6">7. Changes to This Policy</h3>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy periodically to reflect changes in our practices or for legal reasons.
                  We will notify you of any material changes and obtain your consent when required by applicable law.
                </p>
                
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-muted-foreground">
                    Last updated: July 2023
                  </p>
                  <p className="text-muted-foreground mt-4">
                    For any questions regarding our privacy practices, please contact the platform administrator 
                    through the <a href="/contact" className="text-primary hover:underline">Contact Support</a> page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
