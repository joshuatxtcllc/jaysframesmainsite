import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";

// Import types from the existing type definitions
import type { JFNotification } from "@/types/index.d";

import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Phone,
  ChevronRight,
  Bell,
  MapPin,
  LayoutGrid,
  MessageCircle,
  Box,
  Home,
  FileText,
  Info,
  Mail,
  Image,
  Radio,
  ChevronDown,
  Wand2,
  User,
  LogOut
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
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { cartItems } = useCart();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();

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
    const handleNotification = (event: any) => {
      const newNotification = event.detail;
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10
      setHasUnread(true);

      // Show toast for new notifications
      toast({
        title: newNotification.title,
        description: newNotification.description,
        variant: newNotification.type === 'error' ? 'destructive' : 'default',
      });
    };

    // Register global event listener
    window.addEventListener('jf-notification' as any, handleNotification);

    // Register with the notification system if available
    if (window.jfNotifications) {
      window.jfNotifications.onNotification((notification: any) => {
        setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
        setHasUnread(true);
      });
    }

    return () => {
      window.removeEventListener('jf-notification' as any, handleNotification);
    };
  }, [toast]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleCart = () => {
    console.log('Cart toggle clicked, current state:', cartOpen);
    setCartOpen(!cartOpen);
  };

  const closeCart = () => {
    console.log('Closing cart');
    setCartOpen(false);
  };

  // Define submenu items for Custom Framing
  const customFramingSubMenu = [
    { href: "/custom-framing", label: "Start Framing", icon: <Wand2 className="mr-2 h-4 w-4" />, highlight: true },
    { href: "/ljdesigner", label: "Virtual Design Studio", icon: <LayoutGrid className="mr-2 h-4 w-4" /> },
    { href: "/products", label: "Products", icon: <LayoutGrid className="mr-2 h-4 w-4" /> },
    { href: "/frame-fitting-assistant", label: "Frame Fitting AI", icon: <MessageCircle className="mr-2 h-4 w-4" /> },
    { href: "/voice-frame-assistant", label: "Frame Assistant", icon: <MessageCircle className="mr-2 h-4 w-4" /> },
    { href: "/order-status", label: "Order Status", icon: <Box className="mr-2 h-4 w-4" /> },
    { href: "/virtual-room-visualizer", label: "Virtual Room Visualizer", icon: <Image className="mr-2 h-4 w-4" /> }
  ];

  // Main navigation links - remove the items that will be in submenu
  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="mr-2 h-4 w-4" /> },
    { href: "/reinvented", label: "Reinvented", icon: <FileText className="mr-2 h-4 w-4" /> },
    { href: "/blog", label: "Blog", icon: <FileText className="mr-2 h-4 w-4" /> },
    { href: "/about", label: "About Us", icon: <Info className="mr-2 h-4 w-4" /> },
    { href: "/contact", label: "Contact", icon: <Mail className="mr-2 h-4 w-4" /> }
  ];

  return (
    <>
      {/* Cart Component */}
      <Cart isOpen={cartOpen} onClose={closeCart} />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* Top info bar */}
      <div className="bg-black border-b border-white/10 py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-white/80 text-sm">
            <div className="flex items-center">
              <div className="flex items-center mr-6">
                <Phone className="h-3.5 w-3.5 mr-2 text-cyan-400" />
                <span>(832) 893-3794</span>
              </div>
              <div className="flex items-center mr-6">
                <MapPin className="h-3.5 w-3.5 mr-2 text-cyan-400" />
                <span>218 W 27th St, Houston Heights, TX 77008</span>
              </div>
              <span className="text-white/60">Mon-Sat: 10am-6pm · Sunday: Closed</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/order-status">
                <span className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors cursor-pointer bg-cyan-400/10 px-2 py-1 rounded-md border border-cyan-400/20">Track Order</span>
              </Link>
              <Link href="#">
                <span className="hover:text-cyan-400 transition-colors cursor-pointer">FAQ</span>
              </Link>
              <Link href="/contact">
                <span className="hover:text-cyan-400 transition-colors cursor-pointer">Contact</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`bg-black/95 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-2xl border-b border-white/10 py-2 md:py-3' : 'py-3 md:py-4'}`}>
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex justify-between items-center min-h-[44px] md:min-h-[52px]">
            <div className="flex items-center flex-shrink-0">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <span className="text-lg md:text-2xl font-bold text-white font-serif tracking-wide">
                    Jay's <span className="text-cyan-400">Frames</span>
                  </span>
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {/* Regular nav links */}
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className={`${location === link.href ? 'text-cyan-400 font-medium' : 'text-white/80'} hover:text-cyan-400 py-2 transition-colors duration-200 cursor-pointer relative group`}>
                    {link.label}
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 ${location === link.href ? 'w-full' : 'group-hover:w-full'}`}></span>
                  </div>
                </Link>
              ))}

              {/* Custom Framing dropdown using Popover instead of NavigationMenu */}
              <Popover>
                <PopoverTrigger asChild>
                  <div 
                    className={`flex items-center ${
                      location.startsWith('/custom-framing') ? 'text-cyan-400 font-medium' : 'text-white/80'
                    } hover:text-cyan-400 py-2 transition-colors duration-200 cursor-pointer relative group`}
                  >
                    <span>Custom Framing</span>
                    <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 ${
                      location.startsWith('/custom-framing') ? 'w-full' : 'group-hover:w-full'
                    }`}></span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-2 bg-black/95 backdrop-blur-xl border border-white/20" align="center">
                  <div className="grid gap-1">
                    {customFramingSubMenu.map((item) => (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        className={cn(
                          "flex items-center p-2 rounded-md hover:bg-cyan-400/10 hover:text-cyan-400 transition-colors",
                          item.highlight ? "bg-cyan-400 text-black font-semibold" : 
                          location === item.href ? "bg-white/10 text-cyan-400" : "text-white/80"
                        )}
                      >
                        <div className="flex items-center text-sm font-medium">
                          {item.icon}
                          {item.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </nav>

            <div className="flex items-center space-x-3 md:space-x-5">
              {/* Search - Hidden on mobile */}
              <button className="hidden md:block text-white/80 hover:text-cyan-400 transition-colors" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications Bell - Hidden on mobile */}
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="hidden md:block text-white/80 hover:text-cyan-400 transition-colors relative" 
                    aria-label="Notifications"
                    onClick={() => setHasUnread(false)}
                  >
                    <Bell className="h-5 w-5" />
                    {hasUnread && (
                      <span className="absolute -top-1.5 -right-1.5 bg-cyan-400 text-black text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-sm animate-pulse"></span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 bg-black/95 backdrop-blur-xl border border-white/20" align="end">
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

              {/* Cart button - Always visible */}
              <button 
                className="text-white/80 hover:text-cyan-400 transition-colors relative" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Cart button clicked!');
                  toggleCart();
                }}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-cyan-400 text-black text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center shadow-sm text-[10px] md:text-xs">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* User Authentication - Simplified for mobile */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-1 md:space-x-2 text-white/80 hover:text-cyan-400 bg-transparent hover:bg-white/5 p-1 md:p-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs md:text-sm">{user.firstName || user.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="flex items-center">
                          <LayoutGrid className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-primary hover:text-secondary p-1 md:p-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1 md:ml-2 text-xs md:text-sm">Sign In</span>
                </Button>
              )}

              {/* Contact button - Hidden on mobile */}
              <Button asChild className="hidden lg:inline-flex">
                <a href="/contact">Contact</a>
              </Button>

              {/* Mobile-first click-to-call - Smaller on mobile */}
              <Button asChild className="md:hidden bg-primary hover:bg-primary/90 text-xs px-2 py-1">
                <a href="tel:+18328933794" className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Call
                </a>
              </Button>

              {/* Start Framing button - Hidden on mobile */}
              <Link href="/custom-framing" className="hidden lg:block">
                <Button className="bg-secondary hover:bg-secondary/80 text-white text-sm">
                  Start Framing
                </Button>
              </Link>

              {/* Hamburger menu - Properly positioned */}
              <button 
                className="md:hidden text-white/80 hover:text-cyan-400 transition-colors p-1 ml-2" 
                onClick={toggleMobileMenu}
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-5 pb-3 border-t border-white/20 mt-3 bg-black/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div 
                      className={`${location === link.href ? 'text-cyan-400' : 'text-white/80'} hover:text-cyan-400 flex items-center justify-between font-medium transition-colors duration-200 cursor-pointer py-3 px-2 rounded-md hover:bg-white/5`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        {link.icon}
                        <span className="ml-2">{link.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}

                {/* Custom Framing section in mobile menu */}
                <div className="pt-2 border-t border-white/20">
                  <div className="font-medium text-white mb-3 px-2 py-2">Custom Framing</div>
                  {customFramingSubMenu.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div 
                        className={`${
                          item.highlight ? 'bg-cyan-400 text-black rounded-md font-semibold' :
                          location === item.href ? 'text-cyan-400 bg-white/10' : 'text-white/80'
                        } hover:text-cyan-400 hover:bg-white/5 flex items-center font-medium transition-colors duration-200 cursor-pointer pl-4 pr-2 py-3 mx-2 rounded-md text-sm`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="px-2 pt-4">
                  <Link href="/custom-framing">
                    <Button 
                      className="bg-cyan-400 hover:bg-cyan-300 text-black w-full text-sm font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Start Framing
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
</header>
    </>
  );
};

export default Header;