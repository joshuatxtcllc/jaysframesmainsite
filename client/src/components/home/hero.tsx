import { Link } from "wouter";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import GlassFrameShowcase from "@/components/ui/glass-frame-showcase";

export default function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Futuristic dark luxury panel background */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('data:image/svg+xml,${encodeURIComponent(`
              <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="panelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:%23141b2d;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:%231a2332;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:%23243447;stop-opacity:1" />
                  </linearGradient>
                  <linearGradient id="floorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:%232a2a2a;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:%231a1a1a;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <!-- Main wall panels -->
                <rect x="0" y="0" width="250" height="400" fill="url(%23panelGrad)" stroke="%23334155" stroke-width="2"/>
                <rect x="260" y="0" width="280" height="400" fill="url(%23panelGrad)" stroke="%23334155" stroke-width="2"/>
                <rect x="550" y="0" width="250" height="400" fill="url(%23panelGrad)" stroke="%23334155" stroke-width="2"/>
                <!-- Floor -->
                <rect x="0" y="400" width="800" height="200" fill="url(%23floorGrad)"/>
                <!-- Floor planks -->
                <line x1="0" y1="450" x2="800" y2="450" stroke="%23404040" stroke-width="1"/>
                <line x1="0" y1="500" x2="800" y2="500" stroke="%23404040" stroke-width="1"/>
                <line x1="0" y1="550" x2="800" y2="550" stroke="%23404040" stroke-width="1"/>
                <!-- Panel details -->
                <rect x="20" y="50" width="210" height="120" fill="none" stroke="%23475569" stroke-width="1"/>
                <rect x="20" y="200" width="210" height="120" fill="none" stroke="%23475569" stroke-width="1"/>
                <rect x="280" y="50" width="240" height="120" fill="none" stroke="%23475569" stroke-width="1"/>
                <rect x="280" y="200" width="240" height="120" fill="none" stroke="%23475569" stroke-width="1"/>
                <rect x="570" y="50" width="210" height="120" fill="none" stroke="%23475569" stroke-width="1"/>
                <rect x="570" y="200" width="210" height="120" fill="none" stroke="%23475569" stroke-width="1"/>
              </svg>
            `)}`
          }}
        />
      </div>

      {/* Futuristic ambient lighting */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.25, 0.1],
            x: [0, -25, 0],
            y: [0, 25, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/15 to-cyan-400/15 rounded-full blur-2xl"
        />
      </div>

      <div className="container mx-auto px-6 text-center z-10 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          {/* Main heading with enhanced contrast */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none">
            <span className="block font-heading relative">
              <span className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent blur-sm opacity-50"></span>
              <span className="relative bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                The Future of
              </span>
            </span>
            <span className="block text-4xl md:text-6xl lg:text-7xl mt-4 font-heading relative">
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent blur-sm opacity-60"></span>
              <span className="relative bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl glow-effect-purple">
                Custom Framing
              </span>
            </span>
          </h1>

          {/* SEO-focused subtitle with Houston keywords */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl lg:text-3xl text-white mb-12 leading-relaxed max-w-4xl mx-auto font-light drop-shadow-lg"
          >
            <span className="text-white font-medium">Houston's Best Custom Frame Shop</span> where traditional craftsmanship meets cutting-edge technology.
            <span className="block mt-2 text-lg md:text-xl text-cyan-300 font-medium drop-shadow-md">
              Luxury custom framing in Houston with museum-quality preservation.
            </span>
          </motion.p>

          {/* CTA Buttons with 3D effects */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link 
              to="/custom-framing"
              className="group relative px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl transition-all duration-500 hover:scale-105 shadow-neon-cyan hover:shadow-neon-purple transform hover:-translate-y-2"
            >
              <span className="relative z-10">Start Your Design</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>

            <Link 
              to="/about"
              className="minimal-button-3d group text-lg font-semibold"
            >
              Discover Our Story
            </Link>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { number: "25+", label: "Years of Excellence" },
              { number: "50k+", label: "Frames Created" },
              { number: "100%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <div key={index} className="glass-card p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
}