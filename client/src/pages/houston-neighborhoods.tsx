import { Link } from "wouter";

export default function HoustonNeighborhoodsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Custom Framing Across
            <span className="text-teal-400"> Houston Neighborhoods</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional picture framing services serving Houston Heights, Montrose, River Oaks, 
            Memorial, Galleria, Midtown, and surrounding areas with museum-quality results.
          </p>
        </div>

        {/* Neighborhoods Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              name: "Houston Heights",
              description: "Our home base! Premier custom framing in the heart of Houston Heights with same-day consultation available.",
              keywords: "houston heights framing, heights picture framing, custom frames heights"
            },
            {
              name: "Montrose",
              description: "Art-focused framing for Montrose galleries, collectors, and creative professionals. Specializing in contemporary and avant-garde pieces.",
              keywords: "montrose picture framing, art framing montrose, contemporary frames"
            },
            {
              name: "River Oaks",
              description: "Luxury custom framing for Houston's most prestigious neighborhood. Museum-grade conservation for valuable artwork.",
              keywords: "river oaks custom framing, luxury picture framing houston, museum quality frames"
            },
            {
              name: "Memorial",
              description: "Family portrait and sports memorabilia framing for Memorial area families. Professional photography mounting and preservation.",
              keywords: "memorial houston framing, family portrait framing, sports memorabilia houston"
            },
            {
              name: "Galleria",
              description: "Corporate and commercial framing services for Galleria businesses. Professional presentation and office artwork framing.",
              keywords: "galleria houston framing, corporate picture framing, business art framing"
            },
            {
              name: "Midtown",
              description: "Modern framing solutions for Midtown professionals and residents. Contemporary styles and quick turnaround options.",
              keywords: "midtown houston framing, contemporary picture frames, professional framing midtown"
            }
          ].map((neighborhood) => (
            <div key={neighborhood.name} className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-teal-400 transition-colors">
              <h3 className="text-2xl font-bold text-teal-400 mb-3">{neighborhood.name}</h3>
              <p className="text-gray-300 mb-4">{neighborhood.description}</p>
              <div className="text-sm text-gray-500">
                <span className="font-semibold">Search terms: </span>
                {neighborhood.keywords}
              </div>
            </div>
          ))}
        </div>

        {/* Service Areas Map */}
        <div className="bg-gray-900 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Houston Service Areas</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-teal-400 mb-4">Primary Service Areas</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Houston Heights (Our Location)</li>
                <li>• Montrose</li>
                <li>• River Oaks</li>
                <li>• Memorial</li>
                <li>• Galleria</li>
                <li>• Midtown</li>
                <li>• Museum District</li>
                <li>• Upper Kirby</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-teal-400 mb-4">Extended Service Areas</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• West University</li>
                <li>• Bellaire</li>
                <li>• Tanglewood</li>
                <li>• Afton Oaks</li>
                <li>• Highland Village</li>
                <li>• Neartown</li>
                <li>• Fourth Ward</li>
                <li>• Greater Houston Area</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Local SEO Content */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose Jay's Frames for Houston Custom Framing?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-teal-400 mb-3">Local Houston Expertise</h3>
              <p className="text-gray-300">
                Based in Houston Heights, we understand the local art scene, humidity challenges, 
                and style preferences of Houston residents.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-teal-400 mb-3">Museum-Quality Materials</h3>
              <p className="text-gray-300">
                Acid-free mats, conservation glass, and archival mounting boards perfect for 
                Houston's climate and your valuable artwork.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-teal-400 mb-3">Fast Local Service</h3>
              <p className="text-gray-300">
                Same-day consultations in Houston Heights, with pickup and delivery available 
                throughout the Greater Houston area.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/contact" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            Get Your Houston Framing Quote Today
          </Link>
        </div>
      </div>
    </div>
  );
}