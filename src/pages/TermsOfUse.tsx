
import Sidebar from "@/components/Sidebar";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const TermsOfUse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromAuth = location.search.includes('from=auth');
  const { t } = useLanguage();

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
        {!fromAuth && <Sidebar activeItem="Terms of Use" />}
        <main className={`flex-1 p-6 ${!fromAuth ? 'ml-60' : ''} overflow-x-hidden`}>
          <div className="max-w-4xl mx-auto space-y-6">
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {fromAuth ? t('Back to Sign Up') : t('Back to Main Menu')}
            </Button>
            
            <div className="flex items-center space-x-2 mb-8">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">{t('Terms of Use')}</h1>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-border shadow-md p-8">
              <h2 className="text-xl font-semibold mb-6">{t('Agreement to Terms')}</h2>
              
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  {t('By accessing or using the Athens Housing Platform, you agree to be bound by these Terms of Use. If you disagree with any part of these terms, you may not access the service.')}
                </p>
                
                <h3 className="text-lg font-medium mt-6">{t('1. Usage License')}</h3>
                <p className="text-muted-foreground">
                  {t('We grant you a limited, non-exclusive, non-transferable license to use the Athens Housing Platform for personal or commercial purposes related to real estate transactions in the Athens area.')}
                </p>
                
                <h3 className="text-lg font-medium mt-6">{t('2. User Accounts')}</h3>
                <p className="text-muted-foreground">
                  {t('To access certain features of the platform, you must register for an account. You agree to provide accurate information and to keep this information updated. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.')}
                </p>
                
                <h3 className="text-lg font-medium mt-6">{t('3. Property Listings')}</h3>
                <p className="text-muted-foreground">
                  {t('All property listings on the platform are provided for informational purposes only. We do not guarantee the accuracy, completeness, or availability of any listings. Property details, prices, and availability are subject to change without notice.')}
                </p>
                
                <h3 className="text-lg font-medium mt-6">{t('4. Analytics and Market Data')}</h3>
                <p className="text-muted-foreground">
                  {t('The analytics, market trends, and neighborhood scores provided on our platform are based on historical data and statistical models. These are intended as general guidance and should not be the sole basis for real estate investment decisions.')}
                </p>
                
                <h3 className="text-lg font-medium mt-6">{t('5. Limitation of Liability')}</h3>
                <p className="text-muted-foreground">
                  {t('The Athens Housing Platform and its administrators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the service or any content provided on or through the service.')}
                </p>
                
                <h3 className="text-lg font-medium mt-6">{t('6. Governing Law')}</h3>
                <p className="text-muted-foreground">
                  {t('These Terms shall be governed by and construed in accordance with the laws of Greece, without regard to its conflict of law provisions. All operations of the Athens Housing Platform are fully GDPR approved and compliant with European Union data protection regulations.')}
                </p>
                
                <h3 className="text-lg font-medium mt-6">{t('7. Changes to Terms')}</h3>
                <p className="text-muted-foreground">
                  {t('We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes. Your continued use of the platform following the posting of any changes constitutes acceptance of those changes.')}
                </p>
                
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-muted-foreground">
                    {t('Last updated: July 2023')}
                  </p>
                  <p className="text-muted-foreground mt-4">
                    {t('For any questions regarding these Terms of Use, please contact the platform administrator through the')} <a href="/contact" className="text-primary hover:underline">{t('Contact Support')}</a> {t('page')}.
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

export default TermsOfUse;
