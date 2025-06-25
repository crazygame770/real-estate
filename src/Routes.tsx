
import { Routes as RouterRoutes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Create an error boundary component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Loading component for route transitions
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse h-8 w-8 rounded-full bg-primary/50"></div>
  </div>
);

// Implement code splitting with lazy loading for ALL routes including Analytics
const Index = lazy(() => import("./pages/Index"));
const MapView = lazy(() => import("./pages/MapView"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const Search = lazy(() => import("./pages/Search"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Auth = lazy(() => import("./pages/Auth"));
const Upload = lazy(() => import("./pages/Upload"));
const RegionDetails = lazy(() => import("./pages/RegionDetails"));
const Settings = lazy(() => import("./pages/Settings"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Favorites = lazy(() => import("./pages/Favorites"));
const NeighborhoodManagement = lazy(() => import("./pages/NeighborhoodManagement"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <Index />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/map" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <MapView />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/property/:id" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <PropertyDetails />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/search" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <Search />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/search-results" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <SearchResults />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/analytics" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <Analytics />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/auth" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <Auth />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/upload" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <Upload />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/region/:id" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <RegionDetails />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/settings" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <Settings />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/notifications" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <Notifications />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/favorites" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <Favorites />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/neighborhood-management" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <NeighborhoodManagement />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/faq" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <FAQ />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/contact" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <Contact />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/terms" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <TermsOfUse />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="/privacy" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <PrivacyPolicy />
          </ErrorBoundary>
        </Suspense>
      } />
      <Route path="*" element={
        <Suspense fallback={<PageLoader />}>
          <ErrorBoundary>
            <NotFound />
          </ErrorBoundary>
        </Suspense>
      } />
    </RouterRoutes>
  );
};

export default Routes;
