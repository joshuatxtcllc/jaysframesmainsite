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
      {/* Luxury room background with dark panels and wood flooring */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Luxury interior room with sophisticated design"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Darkened overlay to enhance text contrast while keeping the luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/60" />
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
          {/* Main heading with enhanced metallic sheen and high contrast */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none">
            <span className="block font-heading relative">
              {/* Multiple shadow layers for depth */}
              <span className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent blur-lg opacity-40"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white bg-clip-text text-transparent blur-md opacity-60"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white bg-clip-text text-transparent blur-sm opacity-80"></span>
              {/* Main text with metallic sheen gradient */}
              <span className="relative bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent" 
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.9)) drop-shadow(0 0 40px rgba(255,255,255,0.4))',
                      textShadow: '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4), 0 4px 8px rgba(0,0,0,0.9)'
                    }}>
                The Future of
              </span>
            </span>
            <span className="block text-4xl md:text-6xl lg:text-7xl mt-4 font-heading relative">
              {/* Neon glow layers */}
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent blur-xl opacity-30"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-blue-300 to-purple-400 bg-clip-text text-transparent blur-lg opacity-50"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-blue-300 to-purple-400 bg-clip-text text-transparent blur-md opacity-70"></span>
              {/* Main neon text with enhanced glow */}
              <span className="relative bg-gradient-to-r from-cyan-100 via-blue-200 to-purple-300 bg-clip-text text-transparent"
                    style={{
                      filter: 'drop-shadow(0 0 25px rgba(6,182,212,0.9)) drop-shadow(0 0 50px rgba(139,92,246,0.6)) drop-shadow(0 4px 12px rgba(0,0,0,0.8)) drop-shadow(0 0 75px rgba(6,182,212,0.3))',
                      textShadow: '0 0 20px rgba(6,182,212,1), 0 0 40px rgba(139,92,246,0.8), 0 0 60px rgba(6,182,212,0.6), 0 4px 12px rgba(0,0,0,0.9)'
                    }}>
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
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              to="/custom-framing"
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl transition-all duration-500 hover:scale-105 shadow-neon-cyan hover:shadow-neon-purple transform hover:-translate-y-2"
            >
              <span className="relative z-10">Start Your Design</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>

            <a 
              href="https://calendly.com/frames-jaysframes/30min?month=2025-06"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-bold text-lg rounded-2xl transition-all duration-500 hover:scale-105 shadow-neon-cyan hover:shadow-neon-purple transform hover:-translate-y-2"
            >
              <span className="relative z-10">Schedule Appointment</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>

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