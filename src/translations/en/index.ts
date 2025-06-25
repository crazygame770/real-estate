
import navigation from './navigation';
import propertyRelated from './propertyRelated';
import generalUI from './generalUI';
import analytics from './analytics';
import regionDetails from './regionDetails';
import neighborhoodScores from './neighborhoodScores';
import regions from './regions';
import propertyDetails from './propertyDetails';
import propertyFeatures from './propertyFeatures';
import languages from './languages';
import loanCalculator from './loanCalculator';
import mainPage from './mainPage';
import sortOptions from './sortOptions';
import uploadProperty from './uploadProperty';
import settings from './settings';
import faq from './faq';
import termsOfUse from './termsOfUse';

// Combine all translations
const enTranslations: Record<string, string> = {
  ...navigation,
  ...propertyRelated,
  ...generalUI,
  ...analytics,
  ...regionDetails,
  ...neighborhoodScores,
  ...regions,
  ...propertyDetails,
  ...propertyFeatures,
  ...languages,
  ...loanCalculator,
  ...mainPage,
  ...sortOptions,
  ...uploadProperty,
  ...settings,
  ...faq,
  ...termsOfUse,
  
  // Add chatbot translations
  "Open Chat Assistant": "Open Chat Assistant",
  "Ask about properties...": "Ask about properties...",
  "Property Search Assistant": "Property Search Assistant",
};

export default enTranslations;
