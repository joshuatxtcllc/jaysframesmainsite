import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Wand2, Award, ShieldCheck, Heart, ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-neutral-50 via-neutral-100 to-white py-32 overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')] opacity-25 bg-cover bg-center mix-blend-overlay"></div>
      
      {/* Enhanced decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/3 left-1/4 w-56 h-56 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
          <div className="lg:w-3/5 fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="inline-flex items-center px-6 py-2 bg-secondary/20 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-secondary mr-2" />
              <p className="text-secondary text-sm font-semibold tracking-wider">AI-POWERED CUSTOM FRAMING</p>
            </div>
            
            <h1 className="heading-xl text-primary mb-8 leading-tight">
              Custom Framing <span className="text-secondary italic relative">
                Reimagined
                <span className="absolute -bottom-3 left-0 w-full h-1 bg-secondary/30 rounded-full"></span>
              </span> with AI
            </h1>
            
            <p className="body-lg text-neutral-600 mb-10 max-w-xl">
              Introducing a revolutionary approach to custom framing — powered by cutting-edge AI technology, 
              designed for precision and perfection, and crafted with care by expert artisans.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <Link href="/custom-framing">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 px-8 text-base shadow-highlight group">
                  Start Framing
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#process">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-2 border-primary/40 text-primary hover:bg-primary/5 font-medium py-3 px-8 text-base rounded-md transition-all duration-300"
                >
                  Learn Our Process
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
              {[
                { icon: <Wand2 className="h-5 w-5" />, text: "AI-Powered Designs" },
                { icon: <Award className="h-5 w-5" />, text: "Handcrafted Quality" },
                { icon: <ShieldCheck className="h-5 w-5" />, text: "100% Satisfaction" },
                { icon: <Heart className="h-5 w-5" />, text: "Made with Love" }
              ].map((feature, i) => (
                <div key={i} className="flex items-center fade-in hover-lift" style={{ animationDelay: `${0.4 + (i * 0.1)}s` }}>
                  <div className="flex-shrink-0 mr-3 bg-secondary/10 p-2.5 rounded-full text-secondary shadow-sm">
                    {feature.icon}
                  </div>
                  <p className="text-primary text-sm font-medium">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-2/5 relative mt-16 lg:mt-0 fade-in" style={{ animationDelay: "0.6s" }}>
            {/* Enhanced card effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-accent/20 to-primary/10 rounded-2xl blur-xl transform rotate-6"></div>
            <div className="absolute inset-2 bg-white/30 rounded-2xl blur-md transform -rotate-3"></div>
            
            {/* Main card */}
            <div className="relative bg-white p-8 rounded-2xl border border-neutral-100 shadow-elegant transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* Window-like header with improved styling */}
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100 mb-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="bg-neutral-100 h-5 rounded-md w-40 ml-3 flex items-center justify-center">
                    <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Wand2 className="h-3 w-3 text-secondary" />
                    </div>
                  </div>
                </div>
                
                {/* Enhanced designer preview */}
                <div className="relative h-56 bg-white rounded-md flex items-center justify-center overflow-hidden shadow-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Frame Design Preview" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-medium text-center bg-white/60 backdrop-blur-md p-4 rounded-lg border border-white/50 shadow-lg">
                    <div className="text-secondary font-bold mb-2">AI Frame Designer</div>
                    <div className="text-sm text-primary">Analyzing your artwork...</div>
                    {/* Loading indicator */}
                    <div className="mt-2 flex justify-center space-x-1">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced text lines with varying widths for more realism */}
              <div className="space-y-3 mb-6">
                <div className="h-3 bg-neutral-100 rounded-full w-full"></div>
                <div className="h-3 bg-neutral-100 rounded-full w-5/6"></div>
                <div className="h-3 bg-neutral-100 rounded-full w-4/5"></div>
                <div className="h-3 bg-neutral-100 rounded-full w-5/6"></div>
                <div className="h-3 bg-neutral-100 rounded-full w-3/5"></div>
              </div>
              
              {/* Enhanced button */}
              <div className="flex justify-start">
                <div className="h-10 bg-secondary rounded-md w-2/5 flex items-center justify-center text-white text-sm font-medium shadow-highlight transition-all duration-300 hover:bg-secondary/90 hover:scale-105 cursor-pointer">
                  View Results
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
