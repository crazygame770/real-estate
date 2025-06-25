
import React, { Component, Suspense, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { FilterProvider } from "./contexts/FilterContext";
import ScrollToTop from "./components/ScrollToTop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { LanguageProvider } from "./contexts/LanguageContext";
import Routes from "./Routes";

// Create a new QueryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: "always",
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

// Page loader component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse h-8 w-8 rounded-full bg-primary/50"></div>
  </div>
);

// Error handler component with retry functionality
const ErrorHandler = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Reset error state on route change
  useEffect(() => {
    const handleRouteChange = () => setHasError(false);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Auto retry loading on error
  useEffect(() => {
    if (hasError && retryCount < 2) {
      const timer = setTimeout(() => {
        setHasError(false);
        setRetryCount(prev => prev + 1);
      }, 2000); // Wait 2 seconds before retry
      
      return () => clearTimeout(timer);
    }
  }, [hasError, retryCount]);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-6 text-muted-foreground">
          {retryCount < 2 
            ? "Attempting to recover automatically..." 
            : "We've encountered an error loading this page. Please try refreshing."}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary onError={() => setHasError(true)}>
      {children}
    </ErrorBoundary>
  );
};

// Simple error boundary component
class ErrorBoundary extends Component<{
  children: React.ReactNode;
  onError: () => void;
}, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by error boundary:", error, errorInfo);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null; // Parent ErrorHandler will show the error UI
    }

    return this.props.children;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="light" storageKey="ui-theme">
          <LanguageProvider>
            <FilterProvider>
              <ScrollToTop />
              <ErrorHandler>
                <Suspense fallback={<PageLoader />}>
                  <Routes />
                </Suspense>
              </ErrorHandler>
              <Toaster />
            </FilterProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
