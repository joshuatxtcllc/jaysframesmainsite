import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Phone,
  ChevronRight,
  Bell,
  MapPin
} from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Cart from "@/components/ui/cart";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { cartItems } = useCart();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<JFNotification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  // Handle scrolling effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Setup notification listeners
  useEffect(() => {
    // Listen for notification events from the unified system
    const handleNotification = (event: CustomEvent<JFNotification>) => {
      const newNotification = event.detail;
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10
      setHasUnread(true);
      
      // Show toast for new notifications
      toast({
        title: newNotification.title,
        description: newNotification.description,
        variant: newNotification.type as any || 'default',
      });
    };
    
    // Register global event listener
    window.addEventListener('jf-notification' as any, handleNotification as any);
    
    // Register with the notification system if available
    if (window.jfNotifications) {
      window.jfNotifications.onNotification((notification: JFNotification) => {
        setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
        setHasUnread(true);
      });
    }
    
    return () => {
      window.removeEventListener('jf-notification' as any, handleNotification as any);
    };
  }, [toast]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const closeCart = () => {
    setCartOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/custom-framing", label: "Custom Framing" },
    { href: "/voice-frame-assistant", label: "Voice Assistant" },
    { href: "/reinvented", label: "Reinvented" },
    { href: "/blog", label: "Blog" },
    { href: "/order-status", label: "Order Status" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <>
      {/* Top info bar */}
      <div className="bg-primary py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-white/90 text-sm">
            <div className="flex items-center">
              <div className="flex items-center mr-6">
                <Phone className="h-3.5 w-3.5 mr-2 text-secondary" />
                <span>(832) 893-3794</span>
              </div>
              <div className="flex items-center mr-6">
                <MapPin className="h-3.5 w-3.5 mr-2 text-secondary" />
                <span>1440 Yale St, Houston</span>
              </div>
              <span className="text-white/70">Mon-Sat: 10am-6pm · Sunday: Closed</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/order-status">
                <span className="hover:text-secondary transition-colors cursor-pointer">Track Order</span>
              </Link>
              <Link href="#">
                <span className="hover:text-secondary transition-colors cursor-pointer">FAQ</span>
              </Link>
              <Link href="/contact">
                <span className="hover:text-secondary transition-colors cursor-pointer">Contact</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    
      {/* Main header */}
      <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-elegant py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <span className="text-2xl font-bold text-primary font-serif tracking-wide">
                    Jay's <span className="text-secondary">Frames</span>
                  </span>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-10 items-center">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className={`${location === link.href ? 'text-secondary font-medium' : 'text-primary'} hover:text-secondary transition-colors duration-200 cursor-pointer relative group`}>
                    {link.label}
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 ${location === link.href ? 'w-full' : 'group-hover:w-full'}`}></span>
                  </div>
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center space-x-5">
              <button className="text-primary hover:text-secondary transition-colors" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
              
              {/* Notifications Bell */}
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="text-primary hover:text-secondary transition-colors relative" 
                    aria-label="Notifications"
                    onClick={() => setHasUnread(false)}
                  >
                    <Bell className="h-5 w-5" />
                    {hasUnread && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-sm animate-pulse"></span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b border-neutral-100">
                    <h3 className="font-bold text-primary">Notifications</h3>
                    <p className="text-xs text-neutral-500">Stay updated with order status and news</p>
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <div className="mx-auto w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                        <Bell className="h-5 w-5 text-neutral-400" />
                      </div>
                      <p className="text-sm text-neutral-500">No notifications yet</p>
                      <p className="text-xs text-neutral-400 mt-1">We'll notify you about order updates and promotions</p>
                    </div>
                  ) : (
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.map((notification, index) => (
                        <div 
                          key={notification.id || index} 
                          className="p-3 border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                        >
                          <div className="flex items-start">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0
                              ${notification.type === 'success' ? 'bg-green-100' : 
                                notification.type === 'warning' ? 'bg-amber-100' :
                                notification.type === 'error' ? 'bg-red-100' : 'bg-primary/10'}`}
                            >
                              <Bell className={`h-4 w-4 
                                ${notification.type === 'success' ? 'text-green-600' : 
                                  notification.type === 'warning' ? 'text-amber-600' :
                                  notification.type === 'error' ? 'text-red-600' : 'text-primary'}`} 
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{notification.title}</p>
                              <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{notification.description}</p>
                              <p className="text-xs text-neutral-400 mt-1">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                              {notification.actionable && notification.link && (
                                <Link href={notification.link}>
                                  <Badge className="mt-2 text-xs bg-secondary hover:bg-secondary/80" variant="secondary">
                                    View Details
                                  </Badge>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="p-3 bg-neutral-50 border-t border-neutral-100">
                    <Link href="/notifications" className="text-xs text-secondary font-medium hover:underline">
                      View all notifications
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
              
              <button 
                className="text-primary hover:text-secondary transition-colors relative" 
                onClick={toggleCart}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    {cartItems.length}
                  </span>
                )}
              </button>
              
              <Link href="/custom-framing" className="hidden md:block">
                <Button className="bg-secondary hover:bg-secondary/80 text-white text-sm">
                  Start Framing
                </Button>
              </Link>
              
              <button 
                className="md:hidden text-primary hover:text-secondary transition-colors" 
                onClick={toggleMobileMenu}
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-5 pb-3 border-t border-gray-100 mt-3 fade-in">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div 
                      className={`${location === link.href ? 'text-secondary' : 'text-primary'} hover:text-secondary flex justify-between items-center font-medium transition-colors duration-200 cursor-pointer`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
                <Link href="/custom-framing">
                  <Button className="bg-secondary hover:bg-secondary/80 text-white w-full mt-2 text-sm">
                    Start Framing
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        {cartOpen && <Cart isOpen={cartOpen} onClose={closeCart} />}
      </header>
    </>
  );
};

export default Header;
