import React, { useState, useEffect, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Products from "@/pages/products";
import CustomFraming from "@/pages/custom-framing";
import OrderStatus from "@/pages/order-status";
import Checkout from "@/pages/checkout";
import OrderConfirmation from "@/pages/order-confirmation";
import AdminDashboard from "@/pages/admin/dashboard";
import FrameAssistantTest from "@/pages/frame-assistant-test";
import VoiceFrameAssistant from "@/pages/voice-frame-assistant";
import FrameFittingAssistant from "@/pages/frame-fitting-assistant";
import Notifications from "@/pages/notifications";
import NotificationTest from "@/pages/notification-test";
import NotificationEmbed from "@/pages/developer/notification-embed";
import ARFrameAssistant from "@/pages/ar-frame-assistant";
import SMSSettings from "@/pages/sms-settings";
import Reinvented from "@/pages/reinvented";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import ApiDocs from "@/pages/api-docs";
import VirtualRoomVisualizer from "@/pages/virtual-room-visualizer";
// Blog Pages
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog/[slug]";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "./context/auth-context";
import CatalogManagement from './pages/admin/catalog-management';
import BlogManager from './pages/admin/blog-manager';
import './lib/seo-monitor';
import ErrorBoundary from "@/components/ui/error-boundary";
import PerformanceOptimizer from "@/components/seo/performance-optimizer";
import PerformanceMonitor from "@/components/performance-monitor";
import FAQ from "@/pages/faq";
import { loadCriticalCSS } from "./lib/critical-css";
import Gallery from "./pages/gallery";
import HoustonCustomFramingGuide from "./pages/blog/houston-custom-framing-guide";
import HoustonNeighborhoodsPage from "./pages/houston-neighborhoods";
import HoustonArtFramingPage from "./pages/houston-art-framing";
import LJDesigner from "./pages/ljdesigner";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/custom-framing" component={CustomFraming} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation/:orderId" component={OrderConfirmation} />
      <Route path="/order-status" component={OrderStatus} />
      <Route path="/admin/dashboard" component={lazy(() => import('./pages/admin/dashboard'))} />
      <Route path="/admin/catalog-management" component={lazy(() => import('./pages/admin/catalog-management'))} />
      <Route path="/admin/blog-manager" component={BlogManager} />
      <Route path="/frame-assistant-test" component={FrameAssistantTest} />
      <Route path="/voice-frame-assistant" component={VoiceFrameAssistant} />
      <Route path="/frame-fitting-assistant" component={FrameFittingAssistant} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/notification-test" component={NotificationTest} />
      <Route path="/sms-settings" component={SMSSettings} />
      <Route path="/developer/notification-embed" component={NotificationEmbed} />
      <Route path="/ar-frame-assistant" component={ARFrameAssistant} />
      <Route path="/reinvented" component={Reinvented} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/api-docs" component={ApiDocs} />
      {/* Blog Routes */}
      <Route path="/blog" component={Blog} />
      <Route path="/blog/houston-custom-framing-guide" component={HoustonCustomFramingGuide} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/virtual-room-visualizer" component={VirtualRoomVisualizer} /> {/* Added route */}
      <Route path="/faq" component={FAQ} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/houston-neighborhoods" component={HoustonNeighborhoodsPage} />
      <Route path="/houston-art-framing" component={HoustonArtFramingPage} />
      <Route path="/ljdesigner" component={LJDesigner} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Load critical CSS for faster initial paint
    loadCriticalCSS();

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault(); // Prevent the default browser behavior
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Add fallback loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize app immediately - no artificial delays
    const initializeApp = () => {
      try {
        loadCriticalCSS();
      } catch (error) {
        console.warn('Critical CSS loading failed:', error);
      }
      setIsLoading(false);
    };

    // Initialize immediately
    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl font-bold mb-4">Jay's Frames</div>
          <div className="text-teal-400 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ErrorBoundary>
          <PerformanceOptimizer>
            <PerformanceMonitor />
            <AuthProvider>
              <CartProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    <Router />
                  </main>
                  <Footer />
                </div>
              </CartProvider>
            </AuthProvider>
          </PerformanceOptimizer>
        </ErrorBoundary>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;