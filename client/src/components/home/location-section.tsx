
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import SchedulingSystem from "@/components/ui/scheduling-system";
import { useState } from "react";

const LocationSection = () => {
  return (
    <section className="bg-slate-900 text-white py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Visit Our <span className="text-cyan-400">Houston Heights</span> Location
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Experience the future of custom framing in person. Walk-ins welcome, or schedule your consultation online.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-400">Address</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-cyan-400 mt-1" />
                  <div>
                    <p>218 W 27th St.</p>
                    <p>Houston, TX 77008</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-400">Hours</h3>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-cyan-400 mt-1" />
                  <div className="space-y-1">
                    <p>Monday - Friday: 10AM - 6PM</p>
                    <p>Saturday: 11AM - 5PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-400">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-cyan-400" />
                    <p>(832) 893-3794</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-cyan-400" />
                    <p>Frames@Jaysframes.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold">
                Schedule Consultation
              </Button>
              <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
                Get Directions
              </Button>
            </div>
          </div>

          {/* Right Content - Scheduling System */}
          <div className="bg-gray-800 rounded-xl p-6">
            <SchedulingSystem />
          </div>
        </div>
      </div>
    </section>
  );
};

const LocationSection = () => {
  const [showScheduling, setShowScheduling] = useState(false);

  const handleScheduleClick = () => {
    setShowScheduling(true);
    // Scroll to the scheduling system
    setTimeout(() => {
      const schedulingElement = document.querySelector('.scheduling-system');
      if (schedulingElement) {
        schedulingElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="py-20 px-4 bg-black">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Visit Our Houston Heights Location
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Experience our revolutionary framing process in person. Located in the heart of Houston Heights, 
            our redesigned studio combines traditional craftsmanship with cutting-edge technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Content - Location Information */}
          <div className="text-white space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">Address</h3>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-cyan-400 mt-1" />
                <div>
                  <p>218 W 27th St.</p>
                  <p>Houston, TX 77008</p>
                  <p className="text-sm text-gray-400 mt-1">Heights Area - Easy parking available</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">Hours</h3>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-cyan-400 mt-1" />
                <div className="space-y-1">
                  <p>Monday - Friday: 10AM - 6PM</p>
                  <p>Saturday: 11AM - 5PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-cyan-400" />
                  <a href="tel:+18328933794" className="hover:text-cyan-400 transition-colors">
                    (832) 893-3794
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  <a href="mailto:Frames@Jaysframes.com" className="hover:text-cyan-400 transition-colors">
                    Frames@Jaysframes.com
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleScheduleClick}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
              >
                Schedule Consultation
              </Button>
              <Button 
                variant="outline" 
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                onClick={() => window.open('https://maps.google.com/?q=218+W+27th+St,+Houston,+TX+77008', '_blank')}
              >
                Get Directions
              </Button>
            </div>
          </div>

          {/* Right Content - Scheduling System */}
          <div className="bg-gray-800 rounded-xl p-6 scheduling-system">
            <SchedulingSystem />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
