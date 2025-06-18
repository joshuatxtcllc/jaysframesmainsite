import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Wand2, Award, ArrowRight, Sparkles, PackageSearch, Shield, Palette, MapPin } from "lucide-react";
import { Cpu, Clock } from "lucide-react";
import { useSectionContent } from "@/hooks/use-content";

const Hero = () => {
  const { getContent } = useSectionContent("home", "hero");

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-20 overflow-hidden">
      {/* Dark aggressive background patterns */}
      <div className="absolute inset-0">
        {/* Deep dark overlay with teal accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-gray-900/80 z-10"></div>
        
        {/* Menacing geometric background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-secondary/10 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-black to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.8),transparent_50%)]"></div>
        </div>
      </div>

      {/* Aggressive floating elements with teal glow */}
      <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-r from-secondary/20 to-black rounded-full blur-3xl shadow-neon animate-pulse z-20"></div>
      <div className="absolute bottom-32 left-16 w-96 h-96 bg-gradient-to-r from-black to-secondary/15 rounded-full blur-3xl shadow-brutal animate-pulse z-20" style={{ animationDelay: "3s" }}></div>
      <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-gradient-to-r from-secondary/10 to-black rounded-full blur-3xl animate-pulse z-20" style={{ animationDelay: "6s" }}></div>

      {/* Deep dark overlay for maximum contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-30"></div>

      <div className="container mx-auto px-4 relative z-40">
        <div className="flex flex-col lg:flex-row items-center gap-20 max-w-7xl mx-auto min-h-screen">
          <div className="lg:w-3/5 fade-in space-y-12" style={{ animationDelay: "0.2s" }}>
            {/* Premium status badge */}
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-black to-secondary/20 rounded-2xl backdrop-blur-lg border border-secondary/50">
              <Award className="h-5 w-5 text-secondary mr-3" />
              <p className="text-white font-semibold tracking-wide text-base">MUSEUM-QUALITY ARCHIVAL FRAMING</p>
            </div>

            {/* Professional elegant typography */}
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                <span className="block bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-2xl">
                  CUSTOM FRAMING
                </span>
                <span className="block bg-gradient-to-r from-secondary to-white bg-clip-text text-transparent drop-shadow-2xl">
                  HOUSTON
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl font-medium">
                Houston's premier 
                <span className="text-secondary font-bold"> archival museum-grade custom framing studio </span>
                specializing in conservation materials, UV-filtering glass, and innovative designs for discerning collectors and art enthusiasts.
              </p>
            </div>

            {/* Professional CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-8 mb-16">
              <Link href="/custom-framing">
                <Button size="lg" className="bg-gradient-to-r from-black via-secondary to-black hover:from-black hover:via-secondary/80 hover:to-black text-white font-bold py-6 px-12 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden border border-secondary/50">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Wand2 className="mr-4 h-6 w-6 relative z-10" />
                  <span className="relative z-10">Design My Frame</span>
                  <ArrowRight className="ml-4 h-6 w-6 transition-transform duration-300 group-hover:translate-x-2 relative z-10" />
                </Button>
              </Link>
              <Link href="/custom-framing">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-black/80 backdrop-blur-xl border-2 border-secondary text-secondary hover:bg-secondary/10 hover:text-white font-bold py-6 px-12 text-lg rounded-xl transition-all duration-300 flex items-center gap-4 hover:scale-105 shadow-xl"
                >
                  <Clock className="h-6 w-6" />
                  Get Free Quote
                </Button>
              </Link>
            </div>

            {/* Premium services showcase */}
            <div className="grid grid-cols-2 gap-6 mt-16">
              {[
                { icon: <Award className="h-7 w-7" />, text: "Museum-Grade Materials", color: "from-black to-secondary" },
                { icon: <Sparkles className="h-7 w-7" />, text: "UV Conservation Glass", color: "from-secondary to-black" },
                { icon: <Wand2 className="h-7 w-7" />, text: "Expert Design Consultation", color: "from-black to-secondary" },
                { icon: <Clock className="h-7 w-7" />, text: "Local Houston Service", color: "from-secondary to-black" }
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className="group text-center space-y-4 p-6 bg-gradient-to-br from-black/80 to-gray-900/60 backdrop-blur-xl rounded-xl border border-secondary/30 hover:border-secondary/60 hover:shadow-lg shadow-secondary/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ animationDelay: `${0.4 + (i * 0.1)}s` }}
                >
                  <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-xl mx-auto w-fit shadow-lg group-hover:shadow-secondary/30 transition-all duration-300 border border-secondary/20`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <p className="text-white font-semibold text-sm">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-2/5 relative mt-16 lg:mt-0 fade-in" style={{ animationDelay: "0.6s" }}>
            {/* Premium floating effects with teal glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-secondary/15 to-black rounded-2xl blur-2xl transform rotate-2 scale-110"></div>
            <div className="absolute inset-4 bg-gradient-to-tl from-secondary/8 to-black rounded-2xl blur-xl transform -rotate-1"></div>

            {/* Premium interface showcase */}
            <div className="relative bg-gradient-to-br from-black/95 to-gray-900/90 backdrop-blur-xl p-8 rounded-2xl border border-secondary/50 shadow-2xl transform hover:scale-105 transition-all duration-500">
              {/* Professional interface header */}
              <div className="bg-gradient-to-r from-black to-gray-900 p-4 rounded-xl border border-secondary/30 mb-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }}></div>
                  <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" style={{ animationDelay: "0.6s" }}></div>
                  <div className="bg-gradient-to-r from-black to-secondary h-6 rounded-lg w-56 ml-4 flex items-center justify-center border border-secondary/30">
                    <div className="flex items-center gap-2 text-white font-semibold text-xs">
                      <Award className="h-3 w-3" />
                      ARCHIVAL DESIGN ASSISTANT
                    </div>
                  </div>
                </div>

                {/* Brutal AI domination interface */}
                <div className="relative h-64 bg-gradient-to-br from-black to-gray-900 rounded-none flex items-center justify-center overflow-hidden border-2 border-secondary/50">
                  {/* AI scanning effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-secondary/20 to-black animate-pulse"></div>
                  
                  {/* Brutal frame preview */}
                  <div className="relative w-40 h-32 bg-white rounded-none shadow-brutal transform rotate-2 hover:rotate-0 transition-transform duration-300 border-2 border-secondary/30">
                    <div className="absolute inset-2 bg-gradient-to-br from-black/10 to-secondary/10 rounded-none"></div>
                    <div className="absolute inset-4 bg-secondary/10 rounded-none flex items-center justify-center">
                      <div className="text-xs text-black font-black tracking-wider">TARGET</div>
                    </div>
                  </div>
                  
                  {/* AI domination overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-black to-secondary/80 backdrop-blur-lg p-3 rounded-none border-2 border-secondary shadow-neon">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-secondary animate-spin" />
                        <span className="text-white font-black text-sm tracking-wider">PROCESSING TARGET...</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-secondary rounded-none animate-pulse"></div>
                        <div className="w-2 h-2 bg-secondary rounded-none animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-secondary rounded-none animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brutal services domination */}
              <div className="space-y-6 mb-8">
                <h3 className="text-xl font-black text-white bg-gradient-to-r from-secondary to-white bg-clip-text text-transparent tracking-wider">TOTAL FRAMING SUPREMACY</h3>
                <div className="space-y-4">
                  {[
                    { icon: <Wand2 className="h-4 w-4" />, text: "CUSTOM FRAME OBLITERATION", color: "from-black to-secondary" },
                    { icon: <Award className="h-4 w-4" />, text: "MUSEUM-GRADE DEVASTATION", color: "from-secondary to-black" },
                    { icon: <PackageSearch className="h-4 w-4" />, text: "3D SHADOW BOX ANNIHILATION", color: "from-black to-secondary" },
                    { icon: <Cpu className="h-4 w-4" />, text: "AI-ASSISTED DOMINATION", color: "from-secondary to-black" }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gradient-to-r from-black/80 to-gray-900/60 rounded-none border border-secondary/30 hover:border-secondary hover:shadow-neon transition-all duration-300">
                      <div className={`p-2 bg-gradient-to-r ${service.color} rounded-none border border-secondary/20`}>
                        <div className="text-white">{service.icon}</div>
                      </div>
                      <p className="text-sm font-black text-white tracking-wide">{service.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brutal action buttons */}
              <div className="flex gap-4 justify-start">
                <Link href="/custom-framing">
                  <div className="bg-gradient-to-r from-black to-secondary hover:from-black hover:to-secondary/80 rounded-none px-8 py-4 flex items-center justify-center text-white text-sm font-black shadow-brutal transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-secondary/50 hover:border-secondary">
                    EXECUTE ORDER
                  </div>
                </Link>
                <Link href="/contact">
                  <div className="border-2 border-secondary hover:border-white rounded-none px-8 py-4 flex items-center justify-center text-secondary hover:text-white text-sm font-black transition-all duration-300 hover:scale-105 cursor-pointer bg-black/90 hover:bg-secondary/20 hover:shadow-neon">
                    SUBMIT
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