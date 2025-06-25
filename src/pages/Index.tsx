
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePropertyCalculations } from "@/hooks/usePropertyCalculations";
import LoadingView from "@/components/home/LoadingView";
import StatsSummary from "@/components/home/StatsSummary";
import FilterSection from "@/components/home/FilterSection";
import MainContent from "@/components/home/MainContent";
import FloatingChatbotButton from "@/components/chatbot/FloatingChatbotButton";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  const formatPrice = (price: number) => {
    return price.toLocaleString('de-DE');
  };

  const {
    data: properties = [],
    isLoading: isQueryLoading
  } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const {
        data: properties,
        error
      } = await supabase.from('properties').select('*');
      if (error) {
        throw error;
      }
      console.log('Main page properties:', {
        totalCount: properties?.length,
        sampleProperty: properties?.[0]
      });
      // Set loading state to false when data is successfully fetched
      setIsLoading(false);
      return properties || [];
    },
    // Improve caching to prevent unnecessary loading states when returning to this page
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  const { 
    calculateAveragePrice, 
    calculateAveragePricePerMeter, 
    calculateAverageDaysListed 
  } = usePropertyCalculations(properties);

  console.log('Main page calculations:', {
    averagePrice: calculateAveragePrice(),
    averagePricePerMeter: calculateAveragePricePerMeter(),
    averageDaysListed: calculateAverageDaysListed(),
    totalProperties: properties.length
  });

  // Update loading state based on query loading state as well
  if (isLoading && isQueryLoading) {
    return <LoadingView />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-60 overflow-x-hidden">
          <div className="max-w-screen-2xl mx-auto space-y-6">
            <StatsSummary 
              averagePrice={calculateAveragePrice()}
              propertiesCount={properties.length}
              averageDaysListed={calculateAverageDaysListed()}
              averagePricePerMeter={calculateAveragePricePerMeter()}
              formatPrice={formatPrice}
            />
            
            <FilterSection />
            
            <MainContent properties={properties} />
          </div>
        </main>
      </div>
      
      {/* Add the floating chatbot button */}
      <FloatingChatbotButton />
    </div>
  );
};

export default Index;
