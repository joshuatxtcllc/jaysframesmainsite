import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  Shield, 
  DollarSign, 
  Lightbulb, 
  ArrowRight, 
  Users, 
  Scissors, 
  Frame, 
  ShieldCheck, 
  Rocket, 
  Zap,
  Bot,
  TimerReset,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const processSteps = [
  {
    step: 1,
    icon: <Bot className="h-8 w-8 text-white" />,
    title: "AI-Powered Design Consultation",
    description: "Our machine learning assistant, trained to mimic Jay's precise framing style, provides expert design recommendations tailored to your specific artwork.",
    color: "from-secondary/90 to-orange-500"
  },
  {
    step: 2,
    icon: <LayoutGrid className="h-8 w-8 text-white" />,
    title: "Revolutionary Hybrid Production",
    description: "Our unique hybrid mutant model integrates with wholesale vendors for frame cutting and building, saving 1,920 labor hours annually while maintaining quality.",
    color: "from-primary to-blue-600"
  },
  {
    step: 3,
    icon: <ShieldCheck className="h-8 w-8 text-white" />,
    title: "42% Faster Turnaround Times",
    description: "Our methodically structured shop and streamlined process reduces turnaround times by 42%, allowing you to enjoy your beautifully framed artwork sooner.",
    color: "from-accent to-teal-500"
  }
];

const benefits = [
  {
    icon: <TimerReset className="h-12 w-12 text-secondary" />,
    title: "Ready-Made One-Day Options",
    description: "Choose from our extensive selection of Ready-Made frames with one-day turnaround at a lower price point."
  },
  {
    icon: <Bot className="h-12 w-12 text-secondary" />,
    title: "AI Design Assistant",
    description: "Our AI assistant mimics Jay's precise framing style to deliver consistent expert-level recommendations for every project."
  },
  {
    icon: <Rocket className="h-12 w-12 text-secondary" />,
    title: "24/7 Order Tracking",
    description: "Real-time updates via our digital Kanban system with automatic SMS notifications as your order progresses."
  },
  {
    icon: <Zap className="h-12 w-12 text-secondary" />,
    title: "32% Increased Capacity",
    description: "Our hybrid production model has expanded our capacity by 32% while reducing costs and maintaining superior quality."
  }
];

const Process = () => {
  return (
    <section id="process" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 bg-secondary/10 rounded-full mb-4">
            <p className="text-secondary text-sm font-medium">REVOLUTIONARY HYBRID MUTANT MODEL</p>
          </div>
          <h2 className="heading-lg text-primary mb-6">42% Faster Turnaround Times</h2>
          <p className="body-lg text-neutral-600 max-w-3xl mx-auto">
            Jay has developed the industry's first hybrid mutant model, saving 1,920 labor hours annually ($40,000) 
            through wholesale partnerships, AI design assistance, and a methodically restructured workshop 
            that delivers superior quality with a 42% faster turnaround.
          </p>
          <Link href="/about" className="mt-4 inline-block">
            <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
              Learn About Our Process <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
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
          <h3 className="heading-md mb-6 text-primary">The Hybrid Mutant Model Advantages</h3>
          <p className="text-neutral-600 max-w-3xl mx-auto mb-16">
            Jay's revolutionary approach has completely transformed our production workflow, cutting turnaround times
            by 42% while increasing capacity by 32% and reducing annual labor costs by $40,000 - savings we pass on to you.
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
