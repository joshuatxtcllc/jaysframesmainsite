
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                    <p>123 Heights Blvd</p>
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
                    <p>Saturday: 9AM - 5PM</p>
                    <p>Sunday: 12PM - 4PM</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-400">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-cyan-400" />
                    <p>(713) 555-FRAME</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-cyan-400" />
                    <p>hello@jaysframes.com</p>
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

          {/* Right Content - Map placeholder */}
          <div className="bg-gray-800 rounded-xl p-8 flex items-center justify-center h-96">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
              <p className="text-gray-400">Interactive Map Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
