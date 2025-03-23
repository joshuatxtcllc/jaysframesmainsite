import { Card, CardContent } from "@/components/ui/card";
import { Clock, Shield, DollarSign, Lightbulb } from "lucide-react";

const processSteps = [
  {
    step: 1,
    title: "Design Consultation",
    description: "Our AI-powered design assistant helps you find the perfect frame and mat combination for your artwork."
  },
  {
    step: 2,
    title: "Precise Production",
    description: "Our skilled craftspeople cut and assemble your custom frame with precision tools and techniques."
  },
  {
    step: 3,
    title: "Museum Mounting",
    description: "Your artwork is mounted using our proprietary Moonmount™ method, ensuring preservation and perfect presentation."
  }
];

const benefits = [
  {
    icon: <Clock className="h-10 w-10 mx-auto text-primary stroke-[1.5]" />,
    title: "Faster Turnaround",
    description: "Cut your waiting time in half with our streamlined production process."
  },
  {
    icon: <Shield className="h-10 w-10 mx-auto text-primary stroke-[1.5]" />,
    title: "Museum Quality",
    description: "Archival materials and techniques protect your art for generations."
  },
  {
    icon: <DollarSign className="h-10 w-10 mx-auto text-primary stroke-[1.5]" />,
    title: "Transparent Pricing",
    description: "Clear, upfront pricing with no hidden fees or surprises."
  },
  {
    icon: <Lightbulb className="h-10 w-10 mx-auto text-primary stroke-[1.5]" />,
    title: "Expert Design",
    description: "Our AI assistant has been trained on thousands of professional framing projects."
  }
];

const Process = () => {
  return (
    <section id="process" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Our AI-Powered Framing Process</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            We've revolutionized custom framing by combining expert craftsmanship with cutting-edge AI technology, reducing turnaround times while ensuring museum-quality results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {processSteps.map((step) => (
            <Card key={step.step} className="bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-white text-3xl font-bold">{step.step}</span>
                </div>
                <h3 className="text-xl font-heading font-bold mb-2 text-primary">{step.title}</h3>
                <p className="text-neutral-500">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-heading font-bold mb-4 text-primary">Why Choose Our AI-Assisted Custom Framing?</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md border border-primary/20 hover:shadow-lg transition-shadow">
                <div className="mb-3">
                  {benefit.icon}
                </div>
                <h4 className="font-bold text-lg mb-2 text-primary">{benefit.title}</h4>
                <p className="text-sm text-neutral-500">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
