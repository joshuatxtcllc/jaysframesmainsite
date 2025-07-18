import "./index.css";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { isFeatureEnabled } from "@/lib/feature-flags";

// Core page components - using simplified versions
import Home from "@/pages/home-simple";
import Products from "@/pages/products-simple";
import About from "@/pages/about-simple";
import Contact from "@/pages/contact-simple";
import NotFound from "@/pages/not-found";

// Conditionally import advanced components
const AuthProvider = isFeatureEnabled('AUTH_SYSTEM') 
  ? require("@/context/auth-context").AuthProvider 
  : ({ children }: { children: React.ReactNode }) => <>{children}</>;

const CartProvider = isFeatureEnabled('CART_SYSTEM') 
  ? require("@/context/cart-context").CartProvider 
  : ({ children }: { children: React.ReactNode }) => <>{children}</>;

const Toaster = isFeatureEnabled('NOTIFICATIONS') 
  ? require("@/components/ui/toaster").Toaster 
  : () => null;

// Simple layout for now
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-teal-400">Jay's Frames</h1>
            <div className="flex space-x-6">
              <a href="/" className="text-white hover:text-teal-400">Home</a>
              <a href="/products" className="text-white hover:text-teal-400">Products</a>
              <a href="/about" className="text-white hover:text-teal-400">About</a>
              <a href="/contact" className="text-white hover:text-teal-400">Contact</a>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-white/70">
          <p>&copy; 2025 Jay's Frames. Houston's Premier Custom Framing Studio.</p>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
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