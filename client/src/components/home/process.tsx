import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  Shield, 
  DollarSign, 
  Lightbulb, 
  ArrowRight, 
  Users, 
  Scissors, 
  Frame, 
  ShieldCheck, 
  Rocket, 
  Zap,
  Bot,
  TimerReset,
  LayoutGrid,
  PackageSearch,
  Wand2,
  MessageSquare,
  Palette,
  Hammer,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Process() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      number: "01",
      title: "Consultation & Design",
      description: "We begin with a detailed consultation to understand your vision, artwork requirements, and design preferences.",
      icon: MessageSquare,
      color: "from-cyan-500 to-blue-600"
    },
    {
      number: "02", 
      title: "Material Selection",
      description: "Choose from our extensive collection of premium frames, mats, and conservation materials.",
      icon: Palette,
      color: "from-purple-500 to-violet-600"
    },
    {
      number: "03",
      title: "Expert Craftsmanship", 
      description: "Our master framers meticulously craft your piece using time-tested techniques and modern precision.",
      icon: Hammer,
      color: "from-orange-500 to-pink-600"
    },
    {
      number: "04",
      title: "Quality Assurance",
      description: "Every frame undergoes rigorous quality checks to ensure it meets our exacting standards.",
      icon: CheckCircle2,
      color: "from-emerald-500 to-green-600"
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Gallery showroom with forest accent wall and warm wood flooring */}
      <div className="absolute inset-0 showroom-backdrop-forest">
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
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
              Our Proven
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-effect-purple">
              Process
            </span>
          </h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            From initial consultation to final delivery, every step is designed to ensure 
            your artwork receives the perfect frame it deserves.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="glass-frame-3d p-8 text-center h-full group-hover:shadow-luxury">
                  <div className={`w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-neon-cyan group-hover:shadow-neon-purple transition-all duration-500 glow-icon-button`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>

                  <div className="text-5xl font-bold holographic mb-6">{step.number}</div>
                  <h3 className="text-2xl font-bold gradient-text mb-6">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">{step.description}</p>
                </div>

                {/* Enhanced Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-1 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-transparent transform -translate-y-1/2 z-10 rounded-full">
                    <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-xl text-gray-300 mb-12 font-light">
            Ready to start your custom framing project?
          </p>
          <Link
            to="/custom-framing"
            className="btn-secondary group inline-flex items-center text-lg font-semibold"
          >
            Begin Your Project
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}