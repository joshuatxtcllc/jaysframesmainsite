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
  LayoutGrid,
  PackageSearch,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const processSteps = [
  {
    step: 1,
    icon: <Bot className="h-8 w-8 text-white" />,
    title: "AI-Powered Design Consultation",
    description: "Our exclusive machine learning assistant trained on Jay's 15+ years of framing expertise perfectly mimics his precise framing style for Houston's most discerning art collectors. Get expert design recommendations tailored to your specific artwork.",
    color: "from-secondary/90 to-orange-500"
  },
  {
    step: 2,
    icon: <LayoutGrid className="h-8 w-8 text-white" />,
    title: "Revolutionary Hybrid Production",
    description: "Our eco-friendly hybrid production model partners with local Houston frame suppliers for sustainable production, saving thousands of labor hours annually while maintaining museum-quality craftsmanship and reducing environmental impact.",
    color: "from-primary to-blue-600"
  },
  {
    step: 3,
    icon: <ShieldCheck className="h-8 w-8 text-white" />,
    title: "Museum-Quality Craftsmanship",
    description: "Our methodically restructured Houston Heights workshop delivers significantly faster turnaround times with 4x production capacity. One framer now accomplishes what previously required a team of four, while ensuring perfect craftsmanship for every project.",
    color: "from-accent to-teal-500"
  }
];

const benefits = [
  {
    icon: <TimerReset className="h-12 w-12 text-secondary" />,
    title: "Ready-Made One-Day Options",
    description: "Choose from Houston's largest selection of Ready-Made frames with guaranteed one-day turnaround at economical price points - perfect for budget-conscious customers who need quick framing solutions."
  },
  {
    icon: <Bot className="h-12 w-12 text-secondary" />,
    title: "AI Design Assistant",
    description: "Our exclusive AI assistant trained on Jay's 15+ years of framing expertise perfectly mimics his precise framing style, delivering consistent museum-quality recommendations for every Houston framing project."
  },
  {
    icon: <Rocket className="h-12 w-12 text-secondary" />,
    title: "24/7 Customer Service",
    description: "Our enhanced communications system provides real-time updates via our digital Kanban system with automatic SMS notifications, plus 24/7 support through our innovative Frame Bot assistant for Houston customers."
  },
  {
    icon: <Zap className="h-12 w-12 text-secondary" />,
    title: "Eco-Friendly Framing",
    description: "We've expanded capacity by 400% while reducing environmental impact through locally-sourced materials, sustainable partnerships, and eco-friendly framing practices unique in the Houston Heights custom framing market."
  }
];

const Process = () => {
  return (
    <section id="process" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 bg-secondary/10 rounded-full mb-4">
            <p className="text-secondary text-sm font-medium">REVOLUTIONARY HYBRID PRODUCTION MODEL</p>
          </div>
          <h2 className="heading-lg text-primary mb-6">Four Times Production Capacity</h2>
          <p className="body-lg text-neutral-600 max-w-3xl mx-auto">
            Jay has developed Houston's first eco-friendly hybrid production model, saving thousands of labor hours annually
            through local sustainable partnerships, AI design assistance, and a methodically restructured Houston Heights workshop 
            that delivers museum-quality framing with faster turnaround, one-day "Ready Made" options, and 4x production capacity.
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
        <div id="savings" className="mt-20 text-center">
          <h3 className="heading-md mb-6 text-primary">Revolutionary Framing Innovation</h3>
          <p className="text-neutral-600 max-w-3xl mx-auto mb-4">
            Our proprietary system has quadrupled production capacity while significantly reducing turnaround times, all while maintaining the artisanal quality that defines our brand.
          </p>
          <p className="text-neutral-600 max-w-3xl mx-auto mb-4">
            Jay's revolutionary approach enables one framer to accomplish what previously required a team of four, 
            while maintaining the museum-quality craftsmanship that has made Jay's Frames Houston's premier custom framing destination.
          </p>
          <p className="text-sm text-neutral-500 max-w-3xl mx-auto mb-8">
            According to <a href="https://www.framersalliance.com/industry-reports/efficiency-studies" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">the Framers Business Alliance</a>, optimized production workflows can reduce operational costs by up to 40% in custom framing businesses.
          </p>
          
          <div className="max-w-3xl mx-auto mb-16 bg-white rounded-xl p-8 border border-gray-100 shadow-elegant">
            <h4 className="font-serif font-bold text-xl mb-6 text-primary">Innovative Features at Jay's Frames</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start">
                <ShieldCheck className="h-5 w-5 text-secondary mt-1 mr-3" />
                <p className="text-neutral-600"><span className="font-medium">24/7 Frame Chat Support:</span> Stay updated on your order status anytime.</p>
              </div>
              <div className="flex items-start">
                <Frame className="h-5 w-5 text-secondary mt-1 mr-3" />
                <p className="text-neutral-600"><span className="font-medium">Virtual Frame Designer:</span> Visualize your artwork with various framing options.</p>
              </div>
              <div className="flex items-start">
                <Bot className="h-5 w-5 text-secondary mt-1 mr-3" />
                <p className="text-neutral-600"><span className="font-medium">AI Design Assistant:</span> Receive personalized frame suggestions.</p>
              </div>
              <div className="flex items-start">
                <DollarSign className="h-5 w-5 text-secondary mt-1 mr-3" />
                <p className="text-neutral-600"><span className="font-medium">Automated Material Ordering:</span> Our POS system ensures timely procurement.</p>
              </div>
              <div className="flex items-start">
                <Scissors className="h-5 w-5 text-secondary mt-1 mr-3" />
                <p className="text-neutral-600"><span className="font-medium">Precision Measurement Tools:</span> Accurate measurements eliminate double-checking.</p>
              </div>
              <div className="flex items-start">
                <LayoutGrid className="h-5 w-5 text-secondary mt-1 mr-3" />
                <p className="text-neutral-600"><span className="font-medium">Smart Kanban Workflow:</span> Real-time order tracking with notifications.</p>
              </div>
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-secondary mt-1 mr-3" />
                <p className="text-neutral-600"><span className="font-medium">Efficient Art Storage System:</span> Organized and secure storage for artwork.</p>
              </div>
              <div className="flex items-start">
                <TimerReset className="h-5 w-5 text-secondary mt-1 mr-3" />
                <p className="text-neutral-600"><span className="font-medium">Ready-Made Frame Options:</span> Streamlined production with standardized sizes.</p>
              </div>
              <div className="flex items-start">
                <Users className="h-5 w-5 text-secondary mt-1 mr-3" />
                <p className="text-neutral-600"><span className="font-medium">Outsourced Frame Construction:</span> Partnerships for high-quality frame building.</p>
              </div>
              <div className="flex items-start">
                <Zap className="h-5 w-5 text-secondary mt-1 mr-3" />
                <p className="text-neutral-600"><span className="font-medium">AI Business Analyzer:</span> Predicts job durations and adjusts turnaround times.</p>
              </div>
            </div>
          </div>
          
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
          
          <div className="mt-16 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/custom-framing">
              <Button className="bg-secondary hover:bg-secondary/90 px-8 py-6 text-base text-white w-full sm:w-auto">
                Start Your Project Now
              </Button>
            </Link>
            <Link href="/custom-framing">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-base w-full sm:w-auto flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Let AI Design!
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
