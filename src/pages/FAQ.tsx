
import Sidebar from "@/components/Sidebar";
import { HelpCircle, Plus, Minus, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQItem {
  questionKey: string;
  answerKey: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const faqItems: FAQItem[] = [
    {
      questionKey: "What kind of properties can I find on this platform?",
      answerKey: "Our platform offers a wide range of residential and commercial properties across Athens and the surrounding regions. This includes apartments, houses, villas, office spaces, and retail properties. Each listing provides detailed information about the property, including price, location, size, and features."
    },
    {
      questionKey: "How can I filter properties by neighborhood?",
      answerKey: "You can use the Athens Regions selector on the home page to choose specific neighborhoods you're interested in. Simply click on the neighborhoods you want to explore, and the property listings will be filtered accordingly. You can select multiple neighborhoods to broaden your search. Additionally, you can visit the Analytics page for more detailed information and comparison between different neighborhoods."
    },
    {
      questionKey: "How accurate are the property prices?",
      answerKey: "All property prices listed on our platform are provided directly by property owners or real estate agencies. We also provide historical price data and price forecasts based on market trends to help you make informed decisions. However, final prices may be subject to negotiation between buyers and sellers."
    },
    {
      questionKey: "How do I contact a property owner?",
      answerKey: "To contact a property owner, you would need to reach out to the administrator through the 'Contact Support' button at the bottom of this page. The administrator will help facilitate communication with the property owner for the specific property that interests you."
    },
    {
      questionKey: "What do the neighborhood scores mean?",
      answerKey: "Neighborhood scores are ratings from 1-10 that evaluate various aspects of each area, including walkability, safety, education, green spaces, entertainment, and retail options. These scores are calculated based on data from multiple sources and user feedback to give you a comprehensive understanding of each neighborhood's qualities."
    },
    {
      questionKey: "Can I save properties to view later?",
      answerKey: "Yes, you can save properties to your favorites list by clicking the heart icon on any property card. To access your saved properties later, simply go to the 'Favorites' section in the sidebar menu. You'll need to be logged in to use this feature."
    },
    {
      questionKey: "How can I upload my own property for sale?",
      answerKey: "To list a property for sale, you would need to contact the administrator through the 'Contact Support' button at the bottom of this page. Our team will guide you through the process of submitting your property details and ensure it meets our quality standards before listing it on the platform."
    },
    {
      questionKey: "What is the Loan Calculator used for?",
      answerKey: "The Loan Calculator helps you estimate monthly mortgage payments based on property price, down payment, interest rate, and loan term. It's a useful tool for understanding the financial commitment required for properties you're interested in. You can access it by clicking 'Loan Calculator' in the sidebar."
    },
    {
      questionKey: "How can I compare different neighborhoods?",
      answerKey: "Our platform offers detailed analytics on different regions and neighborhoods. You can compare price trends, property types, and neighborhood scores by visiting the 'Analytics' section. You can also view specific region details by clicking on any region name throughout the platform."
    },
    {
      questionKey: "Is there a mobile version of this platform?",
      answerKey: "Currently, there is not a mobile version of our platform, but it is being developed. In the meantime, you can access our website through your mobile browser, though some complex analytics visualizations may display better on larger screens."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar activeItem="FAQ" />
        <main className="flex-1 p-6 ml-60 overflow-x-hidden">
          <div className="max-w-4xl mx-auto space-y-6">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("Back to Main Menu")}
            </Button>
            
            <div className="flex items-center space-x-2 mb-8">
              <HelpCircle className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">{t("Frequently Asked Questions")}</h1>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-border shadow-md">
              {faqItems.map((item, index) => (
                <div key={index} className={cn(
                  "border-b border-border last:border-0",
                  openIndex === index ? "bg-primary/5" : ""
                )}>
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex justify-between items-center w-full p-5 text-left font-medium"
                  >
                    <span className="text-lg">{t(item.questionKey)}</span>
                    {openIndex === index ? (
                      <Minus className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                      <Plus className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  <div className={cn(
                    "px-5 overflow-hidden transition-all duration-300",
                    openIndex === index ? "pb-5 max-h-96" : "max-h-0"
                  )}>
                    <p className="text-muted-foreground">{t(item.answerKey)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-6 mt-8 shadow-md">
              <h2 className="text-xl font-medium mb-4">{t("Still have questions?")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("If you couldn't find the answer to your question in our FAQ, please feel free to contact our support team. We're here to help you with any inquiries related to properties, neighborhoods, or using our platform.")}
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => navigate('/contact')}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  {t("Contact Support")}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQ;
