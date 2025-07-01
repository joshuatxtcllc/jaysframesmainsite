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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
      {/* Luxury room background with dark panels and wood flooring */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Luxury interior room with sophisticated design"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Stronger dark overlay for cohesive design */}
        <div className="absolute inset-0 bg-black/75" />
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

      <div className="container mx-auto px-6 pt-8 md:pt-0 text-center z-10 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          {/* Main heading with Houston keywords */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none">
            <span className="block font-heading text-white drop-shadow-lg">
              Houston Heights
            </span>
            <span className="block text-4xl md:text-6xl lg:text-7xl mt-4 font-heading text-cyan-400 drop-shadow-lg">
              Custom Framing
            </span>
          </h1>

          {/* SEO-focused subtitle with Houston keywords */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl lg:text-3xl text-white mb-12 leading-relaxed max-w-4xl mx-auto font-light drop-shadow-lg"
          >
            <span className="text-white font-medium">Houston's #1 Picture Framing Studio</span> - Museum-quality archival framing in the Heights.
            <span className="block mt-2 text-lg md:text-xl text-cyan-300 font-medium drop-shadow-md">
              Expert custom framing Houston Heights • Same-day service • 218 W 27th St
            </span>
          </motion.p>

          {/* CTA Buttons with clean, minimal styling */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              to="/custom-framing"
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg rounded-lg transition-all duration-300 hover:scale-105"
            >
              Start Your Design
            </Link>

            <a 
              href="https://calendly.com/frames-jaysframes/30min?month=2025-06"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg rounded-lg transition-all duration-300 hover:scale-105"
            >
              Schedule Appointment
            </a>

            <Link 
              to="/about"
              className="px-8 py-4 border border-white/20 text-white hover:bg-white/10 font-semibold text-lg rounded-lg transition-all duration-300"
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