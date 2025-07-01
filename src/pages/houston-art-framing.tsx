import { Link } from "wouter";

export default function HoustonArtFramingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* SEO-Optimized Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Houston Art & Gallery
            <span className="text-teal-400"> Picture Framing</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional art framing for Houston galleries, collectors, and artists. Museum-quality 
            conservation framing in Houston Heights with specialized services for fine art, photographs, 
            and valuable collectibles.
          </p>
        </div>

        {/* Houston Art Districts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Serving Houston's Premier Art Districts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                district: "Museum District",
                specialties: ["Gallery exhibitions", "Museum reproductions", "Fine art photography"],
                description: "Professional framing for Houston's cultural heart"
              },
              {
                district: "Montrose Arts",
                specialties: ["Contemporary art", "Mixed media", "Local artist works"],
                description: "Creative framing for Houston's artistic community"
              },
              {
                district: "Downtown Galleries",
                specialties: ["Corporate art", "Commercial displays", "Public installations"],
                description: "Business-focused framing solutions"
              },
              {
                district: "Heights Studios",
                specialties: ["Artist studios", "Emerging artists", "Local commissions"],
                description: "Supporting Houston Heights creative scene"
              }
            ].map((area) => (
              <div key={area.district} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold text-teal-400 mb-3">{area.district}</h3>
                <p className="text-gray-300 text-sm mb-4">{area.description}</p>
                <ul className="space-y-1">
                  {area.specialties.map((specialty) => (
                    <li key={specialty} className="text-gray-400 text-sm">• {specialty}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Conservation Services */}
        <div className="bg-gray-900 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Museum-Quality Conservation Framing in Houston
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-teal-400 mb-4">Climate Protection</h3>
              <p className="text-gray-300">
                Houston's humidity requires specialized conservation techniques. Our climate-controlled 
                mounting and UV-filtering glass protect your artwork from Houston's challenging environment.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-teal-400 mb-4">Archival Materials</h3>
              <p className="text-gray-300">
                100% acid-free mats, conservation mounting boards, and museum-quality glazing ensure 
                your Houston art collection maintains its value and beauty for generations.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-teal-400 mb-4">Expert Installation</h3>
              <p className="text-gray-300">
                Professional installation services throughout Houston with specialized hanging systems 
                for galleries, offices, and residential collections.
              </p>
            </div>
          </div>
        </div>

        {/* Houston Artist Partnerships */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Partnering with Houston Artists & Galleries
          </h2>
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-teal-400 mb-4">Artist Programs</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• Bulk framing discounts for Houston artists</li>
                  <li>• Exhibition preparation services</li>
                  <li>• Portfolio presentation framing</li>
                  <li>• Artist studio pickup and delivery</li>
                  <li>• Flexible payment terms for emerging artists</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-teal-400 mb-4">Gallery Services</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• Exhibition framing coordination</li>
                  <li>• Standardized framing for gallery walls</li>
                  <li>• Quick turnaround for gallery shows</li>
                  <li>• Wholesale pricing for Houston galleries</li>
                  <li>• Installation and hanging services</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Local SEO Keywords Section */}
        <div className="bg-teal-900/20 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Choose Jay's Frames for Houston Art Framing?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-teal-400 mb-4">Local Houston Expertise</h3>
              <p className="text-gray-300 mb-4">
                Located in Houston Heights, we understand the unique challenges of framing in Houston's 
                climate. Our conservation techniques are specifically adapted for Houston's humidity and 
                temperature variations.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Houston Heights custom framing studio</li>
                <li>• 15+ years serving Houston art community</li>
                <li>• Climate-specialized conservation techniques</li>
                <li>• Local pickup and delivery throughout Houston</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-teal-400 mb-4">Professional Art Services</h3>
              <p className="text-gray-300 mb-4">
                From museum reproductions to original Houston artist works, we provide specialized 
                framing services that preserve and enhance your valuable art collection.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Museum-quality conservation framing</li>
                <li>• UV-protective glazing options</li>
                <li>• Acid-free archival materials exclusively</li>
                <li>• Professional photography mounting</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Frame Your Houston Art Collection?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact Jay's Frames for expert consultation on your art framing needs in Houston Heights and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Schedule Art Consultation
            </Link>
            <Link href="/gallery" className="border border-teal-600 text-teal-400 hover:bg-teal-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              View Houston Art Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}