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
  ChevronRight
} from "lucide-react";
import Cart from "@/components/ui/cart";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { cartItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { href: "/order-status", label: "Order Status" },
    { href: "#about", label: "About Us" }
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
                <span>(503) 555-0123</span>
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
              <Link href="#">
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
                <Button className="btn-secondary text-sm">
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
                  <Button className="btn-secondary w-full mt-2 text-sm">
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
