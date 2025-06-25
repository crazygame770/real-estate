
import { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatbotDialog from "./ChatbotDialog";
import { useLanguage } from "@/contexts/LanguageContext";

const FloatingChatbotButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <Button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="lg"
      >
        <Bot className="h-6 w-6" />
        <span className="sr-only">{t("Open Chat Assistant")}</span>
      </Button>

      <ChatbotDialog 
        open={isChatOpen} 
        onOpenChange={setIsChatOpen}
      />
    </>
  );
};

export default FloatingChatbotButton;
