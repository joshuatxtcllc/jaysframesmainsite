import { Card, CardContent } from "@/components/ui/card";
import { Clock, Shield, DollarSign, Lightbulb, ArrowRight, Cpu, Scissors, Frame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const processSteps = [
  {
    step: 1,
    icon: <Cpu className="h-8 w-8 text-white" />,
    title: "Design Consultation",
    description: "Our AI-powered design assistant analyzes your artwork and helps you find the perfect frame and mat combination to complement your piece.",
    color: "from-secondary/90 to-orange-500"
  },
  {
    step: 2,
    icon: <Scissors className="h-8 w-8 text-white" />,
    title: "Precise Production",
    description: "Our skilled craftspeople cut and assemble your custom frame with precision tools and techniques for a perfect fit and finish.",
    color: "from-primary to-blue-600"
  },
  {
    step: 3,
    icon: <Frame className="h-8 w-8 text-white" />,
    title: "Museum Mounting",
    description: "Your artwork is mounted using our proprietary Moonmount™ method, ensuring preservation and perfect presentation for generations.",
    color: "from-accent to-teal-500"
  }
];

const benefits = [
  {
    icon: <Clock className="h-12 w-12 text-secondary" />,
    title: "Faster Turnaround",
    description: "Cut your waiting time in half with our streamlined AI-assisted production process."
  },
  {
    icon: <Shield className="h-12 w-12 text-secondary" />,
    title: "Museum Quality",
    description: "Archival materials and techniques protect your art for generations to come."
  },
  {
    icon: <DollarSign className="h-12 w-12 text-secondary" />,
    title: "Transparent Pricing",
    description: "Clear, upfront pricing with no hidden fees or surprises at checkout."
  },
  {
    icon: <Lightbulb className="h-12 w-12 text-secondary" />,
    title: "Expert Design",
    description: "Our AI assistant has been trained on thousands of professional framing projects."
  }
];

const Process = () => {
  return (
    <section id="process" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 bg-secondary/10 rounded-full mb-4">
            <p className="text-secondary text-sm font-medium">SIMPLE 3-STEP PROCESS</p>
          </div>
          <h2 className="heading-lg text-primary mb-6">Our AI-Powered Framing Process</h2>
          <p className="body-lg text-neutral-600 max-w-3xl mx-auto">
            We've revolutionized custom framing by combining expert craftsmanship with cutting-edge AI technology,
            reducing turnaround times while ensuring museum-quality results.
          </p>
        </div>
        
        {/* Timeline process with numbers */}
        <div className="relative max-w-5xl mx-auto mb-24">
          {/* Connecting line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden md:block"></div>
          
          <div className="space-y-12 md:space-y-0">
            {processSteps.map((step, index) => (
              <div key={step.step} className={`md:flex items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'} fade-in`} style={{ animationDelay: `${0.2 * index}s` }}>
                {/* Step number for mobile */}
                <div className="flex justify-center mb-6 md:hidden">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-highlight`}>
                    <span className="text-white text-2xl font-bold">{step.step}</span>
                  </div>
                </div>
                
                {/* Content card */}
                <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <Card className="card-gradient border-none shadow-elegant hover-lift overflow-hidden">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-serif font-bold mb-3 text-primary">{step.title}</h3>
                      <p className="text-neutral-600 mb-4">
                        {step.description}
                      </p>
                      {index === 0 && (
                        <Link href="/custom-framing">
                          <div className="inline-flex items-center text-secondary font-medium cursor-pointer hover:underline">
                            Try it now <ArrowRight className="h-4 w-4 ml-2" />
                          </div>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Step icon for desktop */}
                <div className="hidden md:flex justify-center md:w-2/12">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-highlight z-10`}>
                    {step.icon}
                  </div>
                </div>
                
                {/* Empty space for alternating layout */}
                <div className="hidden md:block md:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Benefits section */}
        <div className="mt-20 text-center">
          <h3 className="heading-md mb-6 text-primary">Why Choose Our AI-Assisted Custom Framing?</h3>
          <p className="text-neutral-600 max-w-3xl mx-auto mb-16">
            Our unique blend of artificial intelligence and expert craftsmanship offers benefits that traditional
            framing services simply can't match.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="group hover-lift fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                <div className="bg-white rounded-xl p-8 h-full border border-gray-100 shadow-elegant">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h4 className="font-serif font-bold text-xl mb-3 text-primary">{benefit.title}</h4>
                  <p className="text-neutral-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16">
            <Link href="/custom-framing">
              <Button className="btn-secondary px-8 py-6 text-base">
                Start Your Project Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
