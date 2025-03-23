import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Search,
  Menu,
  X
} from "lucide-react";
import Cart from "@/components/ui/cart";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [location] = useLocation();
  const { cartItems } = useCart();

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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <span className="text-2xl font-bold text-primary font-heading tracking-wide">Jay's Frames</span>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className={`${location === link.href ? 'text-secondary' : 'text-primary'} hover:text-secondary font-medium transition duration-200 cursor-pointer`}>
                  {link.label}
                </div>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="text-primary hover:text-secondary" aria-label="Search">
              <Search className="h-6 w-6" />
            </button>
            
            <button 
              className="text-primary hover:text-secondary relative" 
              onClick={toggleCart}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            
            <button 
              className="md:hidden text-primary hover:text-secondary" 
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
          <div className="md:hidden pt-4 pb-2">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div 
                    className={`${location === link.href ? 'text-secondary' : 'text-primary'} hover:text-secondary font-medium transition duration-200 cursor-pointer`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {cartOpen && <Cart isOpen={cartOpen} onClose={closeCart} />}
    </header>
  );
};

export default Header;
