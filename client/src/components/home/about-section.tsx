import { TrendingUp, Users, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Full-page gradient background - Matching user's aesthetic */}
      <div className="absolute inset-0 aurora-gradient-2">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Animated background elements with 3D geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-2xl"
        />

        {/* Floating 3D Geometric Elements */}
        <div className="absolute top-1/3 left-1/4 geometric-accent cube">
          <div className="geo-face geo-front"></div>
          <div className="geo-face geo-back"></div>
          <div className="geo-face geo-right"></div>
          <div className="geo-face geo-left"></div>
          <div className="geo-face geo-top"></div>
          <div className="geo-face geo-bottom"></div>
        </div>

        <div className="absolute bottom-1/3 right-1/4 geometric-accent cube" style={{ animationDelay: '-3s' }}>
          <div className="geo-face geo-front"></div>
          <div className="geo-face geo-back"></div>
          <div className="geo-face geo-right"></div>
          <div className="geo-face geo-left"></div>
          <div className="geo-face geo-top"></div>
          <div className="geo-face geo-bottom"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent font-heading luxury-text-3d">
              25+ Years of
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-600 bg-clip-text text-transparent glow-effect-purple">
              Excellence
            </span>
          </h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-16"
          >
            Founded in Houston, Jay's Frames has been setting the standard for custom framing excellence 
            for over two decades. Our commitment to quality craftsmanship and innovative solutions 
            has made us the trusted choice for art lovers, collectors, and businesses alike.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-10"
          >
            <div className="glass-frame-3d wood-accent-streak p-8 hover:shadow-luxury transition-all duration-500">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 glow-icon-button bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold gradient-text mb-3">Award-Winning Craftsmanship</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Recognized by the Professional Picture Framers Association for our innovative 
                    techniques and exceptional quality standards.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-frame-3d wood-accent-streak p-8 hover:shadow-luxury transition-all duration-500">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 glow-icon-button bg-gradient-to-br from-purple-500 to-violet-600">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold gradient-text mb-3">Expert Team</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our certified master framers bring decades of combined experience to every project, 
                    ensuring your artwork receives the care it deserves.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-frame-3d wood-accent-streak p-8 hover:shadow-luxury transition-all duration-500">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 glow-icon-button bg-gradient-to-br from-pink-500 to-rose-600">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold gradient-text mb-3">Passion for Preservation</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We understand the emotional and monetary value of your artwork. Every frame 
                    we create is designed to protect and showcase your pieces for generations.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Jay's Frames Workshop"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <div className="text-6xl font-bold gradient-text mb-2">25</div>
                <div className="text-xl font-medium">Years of Excellence</div>
              </div>
            </div>

            {/* Floating Stats with 3D effect */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-8 -right-8 glass-card p-8 shadow-elegant"
            >
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">50,000+</div>
                <div className="text-gray-300 font-medium">Frames Created</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-8 -left-8 glass-card p-8 shadow-elegant"
            >
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">100%</div>
                <div className="text-gray-300 font-medium">Satisfaction Rate</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center mt-24"
        >
          <p className="text-xl text-gray-300 mb-12 font-light">
            Ready to experience the difference that true craftsmanship makes?
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/custom-framing"
              className="btn-secondary hover:shadow-highlight transform hover:scale-105"
            >
              Start Your Project
            </Link>
            <Link
              to="/contact"
              className="btn-outline"
            >
              Visit Our Studio
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}