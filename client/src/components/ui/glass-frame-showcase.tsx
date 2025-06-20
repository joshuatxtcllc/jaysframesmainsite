
import React from 'react';
import { motion } from 'framer-motion';
import { Frame, Palette, Sparkles, Layers, Zap, Star } from 'lucide-react';

const GlassFrameShowcase = () => {
  const frameTypes = [
    { icon: Frame, label: "Classic", color: "from-purple-500 to-violet-600" },
    { icon: Palette, label: "Modern", color: "from-cyan-500 to-blue-600" },
    { icon: Sparkles, label: "Luxury", color: "from-pink-500 to-rose-600" },
    { icon: Layers, label: "Minimalist", color: "from-emerald-500 to-green-600" },
    { icon: Zap, label: "Digital", color: "from-orange-500 to-red-600" },
    { icon: Star, label: "Premium", color: "from-indigo-500 to-purple-600" }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      {/* Main 3D Glass Frame Display */}
      <div className="glass-frame-3d p-12 mb-12 text-center">
        <div className="isometric-frame mb-8">
          <div className="frame-face frame-front"></div>
          <div className="frame-face frame-back"></div>
          <div className="frame-face frame-right"></div>
          <div className="frame-face frame-left"></div>
          <div className="frame-face frame-top"></div>
          <div className="frame-face frame-bottom"></div>
        </div>
        <h3 className="text-3xl font-bold gradient-text mb-4 holographic">
          3D Frame Visualization
        </h3>
        <p className="text-gray-300 text-lg">Experience frames in stunning 3D perspective</p>
      </div>

      {/* Neon Frame Container */}
      <div className="neon-frame-container mb-12">
        <div className="neon-frame-inner">
          <h4 className="text-2xl font-bold gradient-text mb-6 text-center">
            Interactive Frame Gallery
          </h4>
          
          {/* Frame Showcase Grid */}
          <div className="frame-showcase-grid">
            {frameTypes.map((frame, index) => {
              const Icon = frame.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="frame-showcase-item group"
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${frame.color} flex items-center justify-center shadow-neon-cyan group-hover:shadow-neon-purple transition-all duration-500`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-lg font-semibold gradient-text">{frame.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Glowing Icon Buttons Row */}
      <div className="flex justify-center gap-6 mb-12">
        {[Frame, Palette, Sparkles, Layers].map((Icon, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glow-icon-button"
          >
            <Icon className="h-8 w-8 text-white" />
          </motion.div>
        ))}
      </div>

      {/* Geometric Accents */}
      <div className="flex justify-center gap-8">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{ 
              rotateY: [0, 360],
              rotateX: [0, 360]
            }}
            transition={{ 
              duration: 8 + index * 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="geometric-accent cube"
          >
            <div className="geo-face geo-front"></div>
            <div className="geo-face geo-back"></div>
            <div className="geo-face geo-right"></div>
            <div className="geo-face geo-left"></div>
            <div className="geo-face geo-top"></div>
            <div className="geo-face geo-bottom"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GlassFrameShowcase;
