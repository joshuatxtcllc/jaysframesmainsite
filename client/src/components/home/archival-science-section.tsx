
import { Shield, Layers, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const ArchivalScienceSection = () => {
  return (
    <section className="bg-slate-900 text-white py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                The Science of <span className="text-cyan-400">Archival Framing</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Each frame in our museum-grade framing system is engineered for maximum preservation, protecting your artwork for generations.
              </p>
            </div>

            <div className="space-y-6">
              {/* Museum Glass Protection */}
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500 rounded-full p-3 mt-1">
                  <Shield className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Museum Glass Protection</h3>
                  <p className="text-gray-300">
                    99% UV filtering with anti-reflective coating and optimal light preservation.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 border-cyan-400 text-cyan-400">
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Acid-Free Matting */}
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500 rounded-full p-3 mt-1">
                  <Layers className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Acid-Free Matting</h3>
                  <p className="text-gray-300">
                    Premium cotton fiber matboard and migration-resistant barriers.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 border-cyan-400 text-cyan-400">
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Conservation Mounting */}
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500 rounded-full p-3 mt-1">
                  <Zap className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Conservation Mounting</h3>
                  <p className="text-gray-300">
                    Reversible adhesives and proper support systems to preserve integrity.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 border-cyan-400 text-cyan-400">
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Archival Backing System */}
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500 rounded-full p-3 mt-1">
                  <Award className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Archival Backing System</h3>
                  <p className="text-gray-300">
                    Moisture barriers and sealed environment protection.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 border-cyan-400 text-cyan-400">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Artistic Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-orange-500 via-red-500 to-purple-500 rounded-xl aspect-square flex items-center justify-center relative overflow-hidden">
              {/* Abstract art representation */}
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative text-center text-white">
                <Award className="h-24 w-24 mx-auto mb-4" />
                <p className="text-lg font-semibold">Museum-Grade Protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchivalScienceSection;
