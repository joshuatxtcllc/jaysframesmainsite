import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Wand2, Award, ShieldCheck } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-primary py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')] opacity-15 bg-cover bg-center"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
          <div className="lg:w-3/5">
            <div className="inline-block px-4 py-1 bg-secondary/20 rounded-full mb-5">
              <p className="text-secondary text-sm font-medium">AI-Powered Custom Framing</p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Custom Framing <span className="text-secondary">Reimagined</span> with AI
            </h1>
            <p className="text-neutral-200 text-lg md:text-xl mb-8 leading-relaxed">
              Introducing a revolutionary approach to custom framing - powered by AI technology, designed for perfection, and crafted with care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/custom-framing">
                <Button size="lg" className="bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-8 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 text-center">
                  Start Framing
                </Button>
              </Link>
              <Link href="#process">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-3 px-8 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 text-center"
                >
                  Learn Our Process
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { icon: <Wand2 className="h-5 w-5" />, text: "AI-Powered Designs" },
                { icon: <Award className="h-5 w-5" />, text: "Handcrafted Quality" },
                { icon: <ShieldCheck className="h-5 w-5" />, text: "100% Satisfaction" }
              ].map((feature, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex-shrink-0 mr-2 bg-secondary/20 p-1.5 rounded-full text-secondary">
                    {feature.icon}
                  </div>
                  <p className="text-white text-sm">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-2/5 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl blur-md transform rotate-6"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg transform -rotate-3">
              <div className="bg-white/5 p-2 rounded-lg border border-white/10 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="bg-white/10 h-4 rounded-md w-32 ml-2"></div>
                </div>
                <div className="h-44 bg-white/5 rounded-md flex items-center justify-center">
                  <div className="text-white/50 text-sm">AI Frame Designer Preview</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded-full w-3/4"></div>
                <div className="h-3 bg-white/10 rounded-full w-1/2"></div>
                <div className="h-3 bg-white/10 rounded-full w-5/6"></div>
                <div className="h-3 bg-white/10 rounded-full w-2/3"></div>
                <div className="h-8 bg-secondary/30 rounded-md w-1/3 mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
