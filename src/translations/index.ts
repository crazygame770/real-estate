
import enTranslations from './en';
import esTranslations from './es';

export type Language = 'en' | 'es';

export const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  es: esTranslations
};

export const defaultLanguage: Language = 'en';

// Function to translate a key
export const translateKey = (language: Language, key: string): string => {
  const currentTranslations = translations[language];
  return currentTranslations[key] || key; // Fall back to the key if translation is missing
};
