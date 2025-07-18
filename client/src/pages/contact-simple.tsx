const ContactSimple = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-400 mb-4">Contact Us</h1>
          <p className="text-lg text-white/70">
            Get in touch for consultations, quotes, and appointments
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-teal-400 mb-6">Get In Touch</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-teal-400 mb-2">Phone</h3>
                <p className="text-white/90">(832) 893-3794</p>
                <p className="text-white/60 text-sm">Call for quotes and consultations</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-teal-400 mb-2">Email</h3>
                <p className="text-white/90">frames@jaysframes.com</p>
                <p className="text-white/60 text-sm">Send us your project details</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-teal-400 mb-2">Address</h3>
                <p className="text-white/90">
                  218 W 27th St<br />
                  Houston Heights, TX 77008
                </p>
                <p className="text-white/60 text-sm">Visit our studio showroom</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-teal-400 mb-6">Studio Hours</h2>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/90">Monday - Friday</span>
                  <span className="text-teal-400">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/90">Saturday</span>
                  <span className="text-teal-400">10:00 AM - 3:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/90">Sunday</span>
                  <span className="text-teal-400">By appointment</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-teal-400 mb-4">Services</h3>
              <ul className="text-white/70 space-y-2">
                <li>• Custom picture framing</li>
                <li>• Shadow box creation</li>
                <li>• Art restoration and conservation</li>
                <li>• Museum-quality matting</li>
                <li>• UV-protective glass installation</li>
                <li>• Professional mounting and hanging</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Schedule a Consultation</h2>
            <p className="text-white/90 mb-4">
              Bring your artwork to our studio for a personalized consultation. 
              We'll discuss your project needs and provide a detailed quote.
            </p>
            <p className="text-white/70">
              Call (832) 893-3794 or visit us during business hours. 
              No appointment necessary for consultations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSimple;