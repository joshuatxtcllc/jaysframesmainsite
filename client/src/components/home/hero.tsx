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
      {/* Showroom backdrop with dark accent wall and wood flooring */}
      <div className="absolute inset-0 showroom-backdrop-navy">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-full blur-2xl"
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
          {/* Main heading with 3D text effect */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none">
            <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent font-heading luxury-text-3d">
              The Future of
            </span>
            <span className="block text-4xl md:text-6xl lg:text-7xl mt-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-heading glow-effect-purple">
              Custom Framing
            </span>
          </h1>

          {/* Subtitle with enhanced typography */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto font-light"
          >
            Where traditional craftsmanship meets cutting-edge technology.
            <span className="block mt-2 text-lg md:text-xl text-cyan-400 font-medium">
              Houston's premier destination for luxury custom framing.
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
              { number: "10k+", label: "Frames Created" },
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