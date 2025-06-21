import { Link } from "wouter";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
  Heart,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      {/* Newsletter section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 text-center md:text-left">
              <h3 className="font-serif text-2xl font-bold mb-2 gradient-text">Stay Connected</h3>
              <p className="text-white/70 max-w-md">
                Subscribe for exclusive offers, conservation tips, and archival framing inspiration for your collection.
              </p>
            </div>
            <div className="w-full md:w-1/2 max-w-md">
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-l-xl rounded-r-none focus:ring-0 focus:border-cyan-400"
                />
                <Button className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-l-none rounded-r-xl">
                  <Send className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-4">
            <Link href="/">
              <div className="font-serif text-2xl font-bold mb-5 cursor-pointer">
                Jay's <span className="text-secondary">Frames</span>
              </div>
            </Link>
            <p className="text-neutral-300 mb-6 leading-relaxed">
              Houston's premier custom framing studio featuring a revolutionary hybrid production model that provides 62% faster turnaround times with 4x capacity increase. Our AI-powered design assistants learn Jay's precise framing style to deliver exceptional results.
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com/jaysframes" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-white transition-all duration-300" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/jaysframes" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-white transition-all duration-300" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/jaysframes" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-white transition-all duration-300" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-bold mb-5 pb-2 border-b border-white/10">Products</h3>
            <ul className="space-y-3">
              <FooterLink href="/custom-framing" label="Custom Framing" />
              <FooterLink href="/products?category=readymade" label="Ready-Made Frames" />
              <FooterLink href="/products?category=shadowbox" label="Shadowboxes" />
              <FooterLink href="/products?category=moonmount" label="Moonmount™ System" />
              <FooterLink href="/products" label="All Products" />
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-bold mb-5 pb-2 border-b border-white/10">Company</h3>
            <ul className="space-y-3">
              <FooterLink href="/about" label="About Our Process" />
              <FooterLink href="/reinvented" label="Jay's Frames Reinvented" />
              <FooterLink href="/blog" label="Framing Blog" />
              <FooterLink href="/contact" label="Contact Us" />
              <FooterLink href="/order-status" label="Track Your Order" />
              <FooterLink href="/api-docs" label="API Documentation" />
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-lg font-bold mb-5 pb-2 border-b border-white/10">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-cyan-400" />
                <span className="text-white/70">218 W 27th St.<br />Houston, TX 77008</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-cyan-400" />
                <span className="text-white/70">(832) 893-3794</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-cyan-400" />
                <span className="text-white/70">Frames@Jaysframes.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-cyan-400" />
                <span className="text-white/70">Mon-Fri: 10am-6pm<br />Sat: 11am-5pm<br />Sunday: Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="h-4 w-4 text-secondary mr-2" />
            <p className="text-neutral-400 text-sm">
              &copy; {new Date().getFullYear()} Jay's Frames. All rights reserved. Moonmount™ is a registered trademark.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="/faq" className="text-neutral-400 hover:text-secondary transition-colors duration-200 text-sm">FAQ</a>
            <a href="/contact" className="text-neutral-400 hover:text-secondary transition-colors duration-200 text-sm">Contact Us</a>
            <a href="#" className="text-neutral-400 hover:text-secondary transition-colors duration-200 text-sm">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, label }: { href: string; label: string }) => (
  <li>
    <Link href={href}>
      <div className="group flex items-center text-white/70 hover:text-cyan-400 transition-colors duration-200 cursor-pointer">
        <span>{label}</span>
        <ArrowRight className="h-3.5 w-3.5 ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </div>
    </Link>
  </li>
);

export default Footer;