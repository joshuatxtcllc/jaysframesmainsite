import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Wand2, Award, ArrowRight, Sparkles, PackageSearch } from "lucide-react";
import { Cpu, Clock } from "lucide-react";
import { useSectionContent } from "@/hooks/use-content";

const Hero = () => {
  const { getContent } = useSectionContent("home", "hero");

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 py-20 overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 z-10"></div>
        
        {/* Modern geometric background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-secondary/20 to-transparent"></div>
        </div>
      </div>

      {/* Modern floating elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-primary to-secondary rounded-full blur-3xl opacity-30 animate-pulse z-20"></div>
      <div className="absolute bottom-32 left-16 w-96 h-96 bg-gradient-to-r from-secondary to-accent rounded-full blur-3xl opacity-25 animate-pulse z-20" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse z-20" style={{ animationDelay: "4s" }}></div>

      {/* Adjusted semi-transparent overlay for improved text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-transparent z-30"></div>

      <div className="container mx-auto px-4 relative z-40">
        <div className="flex flex-col lg:flex-row items-center gap-20 max-w-7xl mx-auto min-h-screen">
          <div className="lg:w-3/5 fade-in space-y-12" style={{ animationDelay: "0.2s" }}>
            {/* Modern status badge */}
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent/30 to-primary/30 rounded-2xl backdrop-blur-lg border border-white/20">
              <Sparkles className="h-5 w-5 text-accent mr-3" />
              <p className="text-white font-bold tracking-wide text-base">AI-POWERED FRAMING REVOLUTION</p>
            </div>

            {/* Revolutionary typography */}
            <div className="space-y-8">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter">
                <span className="block bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                  FRAME
                </span>
                <span className="block bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent drop-shadow-2xl">
                  THE FUTURE
                </span>
              </h1>

              <p className="text-2xl md:text-3xl text-white/85 leading-relaxed max-w-3xl font-light">
                Houston's most innovative custom framing studio where 
                <span className="text-accent font-bold"> cutting-edge AI technology </span>
                meets artisan craftsmanship to create extraordinary visual experiences.
              </p>
            </div>

            {/* Revolutionary CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-8 mb-16">
              <Link href="/custom-framing">
                <Button size="lg" className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-white font-black py-6 px-12 text-xl rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Cpu className="mr-4 h-7 w-7 relative z-10" />
                  <span className="relative z-10">START AI DESIGN</span>
                  <ArrowRight className="ml-4 h-7 w-7 transition-transform duration-500 group-hover:translate-x-3 relative z-10" />
                </Button>
              </Link>
              <Link href="/custom-framing">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-xl border-3 border-white/40 text-white hover:bg-white/25 font-bold py-6 px-12 text-xl rounded-3xl transition-all duration-500 flex items-center gap-4 hover:scale-110 shadow-xl"
                >
                  <Clock className="h-7 w-7" />
                  INSTANT QUOTE
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
              {[
                { icon: <Wand2 className="h-5 w-5" />, text: "AI-Powered Design Assistant" },
                { icon: <Cpu className="h-5 w-5" />, text: "4x Production Capacity" },
                { icon: <Clock className="h-5 w-5" />, text: "62% Faster Turnaround" },
                { icon: <Sparkles className="h-5 w-5" />, text: "Houston's Premier Frame Shop" }
              ].map((feature, i) => (
                <div key={i} className="flex items-center fade-in hover-lift" style={{ animationDelay: `${0.4 + (i * 0.1)}s` }}>
                  <div className="flex-shrink-0 mr-3 bg-secondary/40 p-2.5 rounded-full text-white shadow-md">
                    {feature.icon}
                  </div>
                  <p className="text-white text-sm font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>{feature.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-2/5 relative mt-16 lg:mt-0 fade-in" style={{ animationDelay: "0.6s" }}>
            {/* Enhanced card effects with better contrast */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-accent/30 to-primary/20 rounded-2xl blur-xl transform rotate-6"></div>
            <div className="absolute inset-2 bg-white/40 rounded-2xl blur-md transform -rotate-3"></div>

            {/* Main card with improved contrast */}
            <div className="relative bg-white p-8 rounded-2xl border border-neutral-200 shadow-elegant transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* Window-like header with improved styling */}
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 mb-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="bg-neutral-100 h-5 rounded-md w-40 ml-3 flex items-center justify-center">
                    <div className="w-5 h-5 bg-secondary/30 rounded-full flex items-center justify-center">
                      <Wand2 className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Enhanced designer preview with better image contrast */}
                <div className="relative h-56 bg-primary/5 rounded-md flex items-center justify-center overflow-hidden shadow-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Frame Design Preview" 
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'contrast(1.1) brightness(0.9)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-primary/10 to-transparent"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white/80 backdrop-blur-md p-4 rounded-lg border border-white/70 shadow-lg">
                    <div className="text-secondary font-bold mb-2 text-lg">AI Frame Designer</div>
                    <div className="text-sm text-primary font-medium">Analyzing your artwork...</div>
                    {/* Loading indicator */}
                    <div className="mt-2 flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured services information */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-primary">Our Expert Framing Services</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    <p className="text-sm text-gray-700">Custom framing for artwork, photographs & memorabilia</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    <p className="text-sm text-gray-700">Museum-quality conservation & archival framing</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    <p className="text-sm text-gray-700">Shadow boxes for 3D objects & keepsakes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    <p className="text-sm text-gray-700">AI-assisted design consultations</p>
                  </div>
                </div>
              </div>

              {/* Enhanced buttons with better contrast */}
              <div className="flex gap-4 justify-start">
                <Link href="/custom-framing">
                  <div className="h-10 bg-secondary rounded-md w-auto px-6 flex items-center justify-center text-white text-sm font-medium shadow-highlight transition-all duration-300 hover:bg-secondary/90 hover:scale-105 cursor-pointer">
                    Explore Services
                  </div>
                </Link>
                <Link href="/contact">
                  <div className="h-10 border border-secondary rounded-md w-auto px-6 flex items-center justify-center text-secondary text-sm font-medium transition-all duration-300 hover:bg-secondary/10 hover:scale-105 cursor-pointer">
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