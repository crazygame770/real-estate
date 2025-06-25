
import { createRoot } from 'react-dom/client'
import { LanguageProvider } from './contexts/LanguageContext'
import App from './App.tsx'
import './index.css'

// Error handling for modules loading
const handleError = (event: ErrorEvent) => {
  console.error('Global error caught:', event.error);
  
  // Check if it's a module loading error
  if (event.error && event.error.message && 
      event.error.message.includes('Failed to fetch dynamically imported module')) {
    console.log('Module loading error detected, trying to recover...');
    
    // After a short delay, try refreshing if it was a module loading error
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

window.addEventListener('error', handleError);

// Create root and render app
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
} else {
  console.error("Root element not found");
}
