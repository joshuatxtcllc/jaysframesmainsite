import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Wand2, Award, ArrowRight, Sparkles } from "lucide-react";
import { useSectionContent } from "@/hooks/use-content";

const Hero = () => {
  const { getContent } = useSectionContent("home", "hero");

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Modern geometric background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-br from-cyan-400/8 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(14,165,233,0.3) 1px, transparent 0)`,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20 max-w-7xl mx-auto min-h-screen pt-20">
          {/* Left content */}
          <div className="lg:w-3/5 space-y-12">
            {/* Status badge */}
            <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-white/80 text-sm font-medium tracking-wide">Museum-Quality Archival Framing</span>
            </div>

            {/* Main heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="block text-white mb-2">
                  Conservation Framing
                </span>
                <span className="block bg-gradient-to-r from-cyan-400 via-cyan-300 to-white bg-clip-text text-transparent">
                  Houston
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-2xl font-light">
                Houston's premier archival conservation framing studio specializing in 
                <span className="text-cyan-400 font-medium"> museum-grade custom framing</span>, 
                UV-filtering glass, and innovative designs for discerning collectors.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/custom-framing">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-semibold py-4 px-8 text-lg rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Wand2 className="mr-3 h-5 w-5" />
                  Design My Frame
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 font-semibold py-4 px-8 text-lg rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Get Free Quote
                </Button>
              </Link>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              {[
                { icon: <Award className="h-6 w-6" />, text: "Museum-Grade Materials" },
                { icon: <Sparkles className="h-6 w-6" />, text: "UV Conservation Glass" },
                { icon: <Wand2 className="h-6 w-6" />, text: "Expert Design Service" },
                { icon: <Award className="h-6 w-6" />, text: "Local Houston Studio" }
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-cyan-400/20 rounded-lg border border-cyan-400/20">
                    <div className="text-cyan-400">{feature.icon}</div>
                  </div>
                  <span className="text-white/80 font-medium text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Interactive preview */}
          <div className="lg:w-2/5 relative">
            {/* Floating card effect */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="bg-black/50 px-4 py-1 rounded-lg">
                  <span className="text-cyan-400 text-xs font-mono">Archival Design Assistant</span>
                </div>
              </div>

              {/* Preview area */}
              <div className="relative h-64 bg-gradient-to-br from-black/80 to-gray-900/80 rounded-xl flex items-center justify-center overflow-hidden border border-white/10">
                {/* Artwork placeholder */}
                <div className="relative w-40 h-32 bg-white rounded-lg shadow-xl">
                  <div className="absolute inset-2 bg-gradient-to-br from-gray-100 to-gray-50 rounded-md"></div>
                  <div className="absolute inset-4 bg-gray-100 rounded-sm flex items-center justify-center">
                    <span className="text-gray-500 text-xs font-medium">Your Artwork</span>
                  </div>
                </div>

                {/* Analysis overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-lg p-3 rounded-lg border border-cyan-400/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-cyan-400" />
                      <span className="text-white text-sm font-medium">Analyzing for conservation quality...</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services list */}
              <div className="space-y-3 mt-6">
                <h3 className="text-white font-semibold text-lg mb-4">Houston's Premier Custom Framing</h3>
                {[
                  "Custom Framing Houston",
                  "Museum-Grade Conservation",
                  "Canvas Stretching Houston", 
                  "Archival UV-Filtering Glass"
                ].map((service, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-white/80 text-sm font-medium">{service}</span>
                  </div>
                ))}
              </div>

              {/* Bottom CTAs */}
              <div className="flex gap-3 mt-6">
                <Link href="/custom-framing">
                  <div className="bg-cyan-500 hover:bg-cyan-400 px-6 py-2 rounded-lg text-black font-semibold text-sm transition-colors cursor-pointer">
                    Start Project
                  </div>
                </Link>
                <Link href="/contact">
                  <div className="border border-cyan-400 hover:bg-cyan-400/10 px-6 py-2 rounded-lg text-cyan-400 font-semibold text-sm transition-colors cursor-pointer">
                    Get Quote
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;