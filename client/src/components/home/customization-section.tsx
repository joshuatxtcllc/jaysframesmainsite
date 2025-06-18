
import { Palette, Layers, Sparkles } from "lucide-react";

const CustomizationSection = () => {
  return (
    <section className="bg-black text-white py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Endless <span className="text-cyan-400">Customization</span> Options
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose from hundreds of frame styles, mat colors, and picture options to create the perfect display for your artwork.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl aspect-[4/3] flex items-center justify-center">
            <Palette className="h-16 w-16 text-white" />
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl aspect-[4/3] flex items-center justify-center">
            <Layers className="h-16 w-16 text-white" />
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl aspect-[4/3] flex items-center justify-center">
            <Sparkles className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">500+</div>
            <div className="text-lg font-semibold mb-2">Frame Styles</div>
            <div className="text-gray-400">From classic to contemporary</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">100+</div>
            <div className="text-lg font-semibold mb-2">Mat Colors</div>
            <div className="text-gray-400">Perfect color matching</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">25+</div>
            <div className="text-lg font-semibold mb-2">Glass Options</div>
            <div className="text-gray-400">Museum-grade protection</div>
          </div>
        </div>

        {/* Meet Jay Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4">
            Meet <span className="text-cyan-400">Jay</span> & Our Story
          </h3>
          <p className="text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Located in the heart of Houston Heights, Jay's Frames has been the premier destination for custom framing for over two decades. What started as a small local business has grown into a comprehensive conservation studio, pioneering museum-grade archival framing.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CustomizationSection;
