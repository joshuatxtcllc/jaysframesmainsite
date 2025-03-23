import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative bg-primary py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')] opacity-20 bg-cover bg-center"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
            Custom Framing <span className="text-secondary">Reimagined</span> with AI
          </h1>
          <p className="text-neutral-200 text-lg md:text-xl mb-8 leading-relaxed">
            Introducing a revolutionary approach to custom framing - powered by AI technology, designed for perfection, and crafted with care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/custom-framing">
              <Button size="lg" className="bg-secondary hover:bg-secondary-light text-white font-bold py-3 px-8 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 text-center">
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
