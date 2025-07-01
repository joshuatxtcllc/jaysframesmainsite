import { CheckCircle, Palette, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrintingSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Luxury interior background */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Luxury interior background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
                Fine Art & <span className="text-cyan-400">Limited Edition Printing</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Transform your digital artwork into museum-quality prints with our state-of-the-art giclée printing technology.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Museum-Quality Giclée Printing</h3>
              <p className="text-gray-300 mb-6">
                Our advanced printing process delivers exceptional color accuracy and longevity, using archival inks and papers that meet museum exhibition standards.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm">Archival Printing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm">Color-True Fast</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm">Canvas, Fine Art Papers, Metal, and Acrylic Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm">Wide Format Capabilities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm">Limited Edition Numbering and Certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm">Professional Color Correcting and Retouching Services</span>
                </div>
              </div>
            </div>

            <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold">
              Learn More About Printing
            </Button>
          </div>

          {/* Right Content - Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl aspect-square flex items-center justify-center">
                <Palette className="h-12 w-12 text-white" />
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl aspect-[4/3] flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl aspect-[4/3] flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl aspect-square flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrintingSection;