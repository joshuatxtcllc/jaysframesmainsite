import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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
import VirtualRoomVisualizer from "@/pages/virtual-room-visualizer"; // Added import
// Blog Pages
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog/[slug]";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import GlobalVoiceAssistant from "@/components/ui/global-voice-assistant";
import { CartProvider } from "@/context/cart-context";
import { lazy } from 'react';
import CatalogManagement from './pages/admin/catalog-management';
import BlogManager from './pages/admin/blog-manager';
import { DesignProgressProvider } from '@/contexts/design-progress-context';

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
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/virtual-room-visualizer" component={VirtualRoomVisualizer} /> {/* Added route */}
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <DesignProgressProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
          <GlobalVoiceAssistant triggerPhrase="hey echo" />
        </DesignProgressProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;