import "./index.css";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "@/components/ui/toaster";
import { isFeatureEnabled } from "@/lib/feature-flags";

// Import all page components
import Home from "@/pages/home";
import Products from "@/pages/products";
import CustomFraming from "@/pages/custom-framing";
import OrderStatus from "@/pages/order-status";
import FrameAssistantTest from "@/pages/frame-assistant-test";
import AdminDashboard from "@/pages/admin/dashboard";
import NotFound from "@/pages/not-found";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Gallery from "@/pages/gallery";
import Blog from "@/pages/blog/blog";
import BlogPost from "@/pages/blog/blog-post";
import HoustonArtFraming from "@/pages/houston-art-framing";
import HoustonNeighborhoods from "@/pages/houston-neighborhoods";
import FAQ from "@/pages/faq";
import OrderConfirmation from "@/pages/order-confirmation";
import Checkout from "@/pages/checkout";
import Shadowboxes from "@/pages/shadowboxes";
import Reinvented from "@/pages/reinvented";

// Layout component
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/custom-framing" component={CustomFraming} />
        <Route path="/order-status" component={OrderStatus} />
        <Route path="/frame-assistant-test" component={FrameAssistantTest} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/houston-art-framing" component={HoustonArtFraming} />
        <Route path="/houston-neighborhoods" component={HoustonNeighborhoods} />
        <Route path="/faq" component={FAQ} />
        <Route path="/order-confirmation" component={OrderConfirmation} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/shadowboxes" component={Shadowboxes} />
        <Route path="/reinvented" component={Reinvented} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}