
import { TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section className="bg-slate-900 text-white py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Meet <span className="text-cyan-400">Jay</span> & Our Story
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                Located in the heart of Houston Heights, Jay's Frames has been the premier destination for custom framing for over two decades. What started as a small local business has grown into a comprehensive conservation studio, pioneering museum-grade archival framing.
              </p>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                Jay has recently revolutionized our entire business model, integrating cutting-edge AI assistants and automated systems to streamline every aspect of our operations. This technological transformation has allowed us to offer faster turnaround times while maintaining our uncompromising standards for quality, precision, and efficiency.
              </p>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                Our AI virtual frame design tool puts the power of professional framing in your hands, while our physical showroom in Houston Heights remains open for those who prefer the traditional hands-on experience. With decades of expertise now enhanced with modern technology, we remain unmatched for generations.
              </p>
              
              <p className="text-gray-300 leading-relaxed">
                Whether you're preserving family heirlooms, showcasing contemporary art, or protecting valuable documents, our commitment to excellence has made us the go-to choice for discerning collectors, artists, and institutions throughout Houston.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-cyan-500 rounded-xl p-6 text-center text-black">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm font-medium">Years Experience</div>
              </div>
              <div className="bg-cyan-500 rounded-xl p-6 text-center text-black">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm font-medium">Frames Created</div>
              </div>
            </div>
          </div>

          {/* Right Content - Analytics Dashboard Mockup */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-cyan-400">Studio Analytics</h3>
              <span className="text-sm text-gray-400">Live</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">17.6K</div>
                <div className="text-xs text-gray-400">Orders</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">1.3%</div>
                <div className="text-xs text-gray-400">Growth</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">25.2</div>
                <div className="text-xs text-gray-400">Avg Rating</div>
              </div>
            </div>
            
            {/* Chart placeholder */}
            <div className="bg-gray-700 rounded-lg h-32 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
