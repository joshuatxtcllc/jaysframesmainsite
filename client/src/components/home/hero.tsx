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
                A-list voters choice for best local frame shop, Jay's Frames is your premier archival conservation custom art framing studio specializing in 
                <span className="text-cyan-400 font-medium"> museum-grade framing</span>, 
                using UV-filtering glass, acid free materials, decades of experience, centuries of methodologies, ever changing conservation techniques, and innovative, trend-setting designs for discerning collectors, locally in the Houston Heights area for the past 15 years.
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

          {/* Right side - Space for future content */}
          <div className="lg:w-2/5 relative">
            {/* Reserved space */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;