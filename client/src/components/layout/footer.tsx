import { Link } from "wouter";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Github
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-heading font-bold mb-4">Jay's Frames</h3>
            <p className="text-neutral-300 mb-4">
              Custom framing reimagined with AI technology, exceptional craftsmanship, and a commitment to preservation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-300 hover:text-white transition duration-200" aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition duration-200" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition duration-200" aria-label="Github">
                <Github />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link href="/custom-framing"><a className="text-neutral-300 hover:text-white transition duration-200">Custom Framing</a></Link></li>
              <li><Link href="/products?category=shadowbox"><a className="text-neutral-300 hover:text-white transition duration-200">Shadowboxes</a></Link></li>
              <li><Link href="/products?category=moonmount"><a className="text-neutral-300 hover:text-white transition duration-200">Moonmount™ System</a></Link></li>
              <li><Link href="/products"><a className="text-neutral-300 hover:text-white transition duration-200">Ready-Made Frames</a></Link></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition duration-200">Gift Cards</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/order-status"><a className="text-neutral-300 hover:text-white transition duration-200">Track Your Order</a></Link></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition duration-200">Shipping & Returns</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition duration-200">Care Instructions</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition duration-200">FAQ</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition duration-200">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-neutral-300" />
                <span className="text-neutral-300">123 Frame St, Suite 101<br />Portland, OR 97205</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-neutral-300" />
                <span className="text-neutral-300">(503) 555-0123</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-neutral-300" />
                <span className="text-neutral-300">info@jaysframes.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-neutral-300" />
                <span className="text-neutral-300">Mon-Sat: 10am-6pm<br />Sunday: Closed</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Jay's Frames. All rights reserved. Moonmount™ is a registered trademark.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-neutral-400 hover:text-white transition duration-200 text-sm">Privacy Policy</a>
            <a href="#" className="text-neutral-400 hover:text-white transition duration-200 text-sm">Terms of Service</a>
            <a href="#" className="text-neutral-400 hover:text-white transition duration-200 text-sm">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
