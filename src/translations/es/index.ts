
import navigation from './navigation';
import propertyRelated from './propertyRelated';
import generalUI from './generalUI';
import analytics from './analytics';
import neighborhoodScores from './neighborhoodScores';
import regions from './regions';
import propertyDetails from './propertyDetails';
import propertyFeatures from './propertyFeatures';
import languages from './languages';
import loanCalculator from './loanCalculator';
import mainPage from './mainPage';
import sortOptions from './sortOptions';
import uploadProperty from './uploadProperty';
import regionDetails from './regionDetails';
import settings from './settings';
import faq from './faq';
import termsOfUse from './termsOfUse';

// Combine all translation categories into a single object
const esTranslations = {
  ...navigation,
  ...propertyRelated,
  ...generalUI,
  ...analytics,
  ...neighborhoodScores,
  ...regions,
  ...propertyDetails,
  ...propertyFeatures,
  ...languages,
  ...loanCalculator,
  ...mainPage,
  ...sortOptions,
  ...uploadProperty,
  ...regionDetails,
  ...settings,
  ...faq,
  ...termsOfUse,
  
  // Add chatbot translations
  "Open Chat Assistant": "Abrir Asistente de Chat",
  "Ask about properties...": "Preguntar sobre propiedades...",
  "Property Search Assistant": "Asistente de Búsqueda de Propiedades",
};

export default esTranslations;
