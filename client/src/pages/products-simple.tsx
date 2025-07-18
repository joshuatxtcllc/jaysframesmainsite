import { isFeatureEnabled } from "@/lib/feature-flags";

const ProductsSimple = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-teal-400 mb-4">Our Products</h1>
        <p className="text-lg text-white/70">
          Professional framing solutions for all your artwork and memorabilia
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-teal-400 mb-3">Custom Picture Frames</h3>
          <p className="text-white/70 mb-4">
            Wood and metal frames in various styles and finishes. Perfect for artwork, 
            photographs, and prints.
          </p>
          <ul className="text-white/60 text-sm space-y-1">
            <li>• Wood frames: Oak, Maple, Cherry, Walnut</li>
            <li>• Metal frames: Aluminum, Steel, Brass</li>
            <li>• Custom sizes available</li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-teal-400 mb-3">Shadow Boxes</h3>
          <p className="text-white/70 mb-4">
            Deep frames for displaying three-dimensional objects, memorabilia, 
            and collectibles.
          </p>
          <ul className="text-white/60 text-sm space-y-1">
            <li>• Various depths available</li>
            <li>• Custom fabric backing</li>
            <li>• Museum-quality materials</li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-teal-400 mb-3">Matting Options</h3>
          <p className="text-white/70 mb-4">
            Acid-free matting in hundreds of colors to complement your artwork.
          </p>
          <ul className="text-white/60 text-sm space-y-1">
            <li>• Acid-free preservation matting</li>
            <li>• Single and double mats</li>
            <li>• Custom cut to size</li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-teal-400 mb-3">Conservation Glass</h3>
          <p className="text-white/70 mb-4">
            UV-protective glass to preserve your artwork from fading and damage.
          </p>
          <ul className="text-white/60 text-sm space-y-1">
            <li>• UV-filtering glass</li>
            <li>• Anti-reflective options</li>
            <li>• Museum-grade protection</li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-teal-400 mb-3">Installation Services</h3>
          <p className="text-white/70 mb-4">
            Professional installation and hanging services for your framed pieces.
          </p>
          <ul className="text-white/60 text-sm space-y-1">
            <li>• Wall mounting and hanging</li>
            <li>• Gallery lighting consultation</li>
            <li>• Secure mounting hardware</li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-xl font-semibold text-teal-400 mb-3">Restoration Services</h3>
          <p className="text-white/70 mb-4">
            Art restoration and conservation services for damaged or aging pieces.
          </p>
          <ul className="text-white/60 text-sm space-y-1">
            <li>• Artwork cleaning and repair</li>
            <li>• Color restoration</li>
            <li>• Preservation consultation</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-12">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-teal-400 mb-4">Get a Quote</h2>
          <p className="text-white/70 mb-4">
            Bring your artwork to our studio for a personalized consultation and quote.
          </p>
          <p className="text-white/90">
            Call us at (832) 893-3794 or visit us at 218 W 27th St, Houston Heights
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductsSimple;