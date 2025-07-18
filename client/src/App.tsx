import "./index.css";

// Ultra-minimal version to debug loading issues
export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-teal-400">Jay's Frames</h1>
            <div className="flex space-x-6">
              <a href="/" className="text-white hover:text-teal-400">Home</a>
              <a href="/products" className="text-white hover:text-teal-400">Products</a>
              <a href="/about" className="text-white hover:text-teal-400">About</a>
              <a href="/contact" className="text-white hover:text-teal-400">Contact</a>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-teal-400 mb-6">
            Jay's Frames
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Houston's Premier Custom Framing Studio
          </p>
          <p className="text-lg text-white/70 mb-12">
            Located in Houston Heights at 218 W 27th St, we specialize in museum-quality 
            archival picture framing, shadow boxes, and art conservation.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-teal-400 mb-3">Custom Framing</h3>
              <p className="text-white/70">
                Professional frame design and installation for artwork, photographs, and memorabilia.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-teal-400 mb-3">Museum Quality</h3>
              <p className="text-white/70">
                Archival materials and conservation techniques to preserve your valuable pieces.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-teal-400 mb-3">Local Expertise</h3>
              <p className="text-white/70">
                Serving Houston Heights, Montrose, River Oaks, and surrounding areas since 1999.
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-3xl font-bold text-teal-400 mb-4">Visit Our Studio</h2>
            <p className="text-white/90 mb-4">
              218 W 27th St, Houston Heights, TX 77008
            </p>
            <p className="text-white/70">
              Mon-Fri: 9am-5pm | Sat: 10am-3pm | Sun: By appointment
            </p>
            <p className="text-white/70 mt-2">
              Call: (832) 893-3794
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-white/70">
          <p>&copy; 2025 Jay's Frames. Houston's Premier Custom Framing Studio.</p>
        </div>
      </footer>
    </div>
  );
}