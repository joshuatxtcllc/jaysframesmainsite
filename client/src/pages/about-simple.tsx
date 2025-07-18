const AboutSimple = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-400 mb-4">About Jay's Frames</h1>
          <p className="text-lg text-white/70">
            Houston's trusted custom framing studio since 1999
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Our Story</h2>
            <p className="text-white/90 mb-4">
              Founded in 1999, Jay's Frames has been serving the Houston Heights community 
              and surrounding areas with professional custom framing services. We specialize 
              in museum-quality archival framing that preserves and enhances your most 
              treasured artwork and memorabilia.
            </p>
            <p className="text-white/90">
              Our commitment to excellence and attention to detail has made us Houston's 
              premier destination for custom framing, shadow boxes, and art conservation.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Our Mission</h2>
            <p className="text-white/90 mb-4">
              To provide Houston with the finest custom framing services using archival 
              materials and conservation techniques. We believe every piece of art deserves 
              to be preserved and displayed with the highest quality craftsmanship.
            </p>
            <p className="text-white/90">
              Whether it's a family heirloom, original artwork, or cherished photograph, 
              we treat each piece with the care and respect it deserves.
            </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-teal-400 mb-6 text-center">Why Choose Jay's Frames?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-teal-400 mb-2">Expert Craftsmanship</h3>
              <p className="text-white/70">
                Over 25 years of experience in custom framing and art conservation.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-teal-400 mb-2">Quality Materials</h3>
              <p className="text-white/70">
                We use only archival, acid-free materials to ensure long-lasting preservation.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-teal-400 mb-2">Local Service</h3>
              <p className="text-white/70">
                Proudly serving Houston Heights, Montrose, River Oaks, and beyond.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-teal-400 mb-4">Visit Our Studio</h2>
          <p className="text-white/90 mb-2">
            218 W 27th St, Houston Heights, TX 77008
          </p>
          <p className="text-white/70 mb-4">
            Monday - Friday: 9:00 AM - 5:00 PM<br />
            Saturday: 10:00 AM - 3:00 PM<br />
            Sunday: By appointment only
          </p>
          <p className="text-white/90">
            Call us at (832) 893-3794 for consultations and quotes
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutSimple;