
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { Language, defaultLanguage, translateKey } from '@/translations';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || defaultLanguage;
  });

  // Function to translate a key
  const t = (key: string): string => {
    return translateKey(language, key);
  };

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    console.log("Language changed to:", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
