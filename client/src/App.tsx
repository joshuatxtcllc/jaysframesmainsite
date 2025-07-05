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

function SimpleTest() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-teal-400 mb-4">Jay's Frames</h1>
        <p className="text-gray-300 mb-8">App is working! Testing basic functionality...</p>
        <div className="space-y-2">
          <p>✅ React rendering</p>
          <p>✅ CSS loading</p>
          <p>✅ Components working</p>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleTest} />
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

  // Remove loading state completely - let components render immediately
  const [isLoading, setIsLoading] = useState(false);

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
      <ErrorBoundary>
        <Router />
        <Toaster />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;