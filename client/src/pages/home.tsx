import Hero from "@/components/home/hero";
import LocationSection from "@/components/home/location-section";
import PrintingSection from "@/components/home/printing-section";
import AboutSection from "@/components/home/about-section";
import CustomizationSection from "@/components/home/customization-section";
import ArchivalScienceSection from "@/components/home/archival-science-section";
import Process from "@/components/home/process";
import Testimonials from "@/components/home/testimonials";
import Chatbot from "@/components/ui/chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Lightbulb, MessageSquare, Wand2, ShieldCheck } from "lucide-react";
import FrameDesigner from "@/components/product/frame-designer";
import { SeoHead } from "@/components/seo";

const Home = () => {
  // Fetch featured products
  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  // Get one product from each category for showcase
  const getProductsByCategory = (category: string) => {
    return products.find((product) => product.category === category);
  };

  const customFrame = getProductsByCategory("frame");
  const shadowbox = getProductsByCategory("shadowbox");
  const moonmount = getProductsByCategory("moonmount");

  return (
    <>
      <SeoHead 
        title="Houston Custom Framing | Jay's Frames Studio"
        description="Houston's premier custom framing studio. Museum-quality picture framing, art preservation & design consultation in Houston Heights. 25+ years experience."
        keywords="custom framing Houston, picture framing Houston Heights, museum quality framing, art preservation Houston, frame shop near me, professional framing services"
        canonical="https://jaysframes.com/"
      />

      <Hero />
      <LocationSection />
      <PrintingSection />
      <AboutSection />
      <CustomizationSection />
      <ArchivalScienceSection />
      <Process />
      <Testimonials />

      {/* AI Frame Designer Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Luxury interior background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury interior background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-secondary/20 mb-4">
              <Wand2 className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">AI-Powered Frame Designer</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Try our revolutionary Houston-based design assistant that mimics Jay's 15+ years of framing expertise to help you create the perfect custom frame for your artwork in minutes, with museum-quality recommendations and eco-friendly options.
            </p>
          </div>

          <div className="bg-neutral-50 p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-primary mb-4">Design Your Perfect Frame</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="bg-secondary rounded-full p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Get AI recommendations for your specific artwork</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary rounded-full p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Visualize frame and mat combinations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary rounded-full p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Get instant pricing for your custom frame</span>
                  </li>
                </ul>
                <Link href="/custom-framing">
                  <Button className="bg-secondary hover:bg-secondary/80 text-white w-full md:w-auto font-medium">
                    Start Designing Now
                  </Button>
                </Link>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md bg-white p-4">
                <div className="aspect-video bg-neutral-100 rounded flex items-center justify-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Frame Design Preview" 
                    className="max-h-full rounded"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-neutral-100 rounded aspect-square"></div>
                  <div className="bg-neutral-100 rounded aspect-square"></div>
                  <div className="bg-neutral-100 rounded aspect-square"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ask Frame Assistant Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Luxury interior background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury interior background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-secondary/20 mb-4">
              <MessageSquare className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Ask Our Frame Design Assistant</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Get expert Houston framing advice from our AI assistant, trained to perfectly mimic Jay's 15+ years of expertise across thousands of professional framing projects, providing instant recommendations for eco-friendly, museum-quality framing.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="p-6 bg-primary text-white md:col-span-2">
                <h3 className="text-xl font-bold mb-4">How Can Our Assistant Help You?</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="bg-secondary rounded-full p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Frame recommendations for any artwork</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary rounded-full p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Preservation advice for different materials</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary rounded-full p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Mat color combinations that work with your art</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary rounded-full p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>Answers to any framing question you have</span>
                  </li>
                </ul>
                <Link href="/frame-assistant-test">
                  <Button className="bg-secondary hover:bg-secondary/80 text-white w-full font-medium">
                    Try Frame Assistant
                  </Button>
                </Link>
              </div>
              <div className="p-6 md:col-span-3">
                <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                  <p className="font-medium">What frame would work best for a watercolor painting?</p>
                </div>
                <div className="bg-secondary/10 rounded-lg p-4 mb-4">
                  <p className="text-sm">
                    For watercolor paintings, I'd recommend a light wood frame like maple or a thin metal frame in silver or gold. 
                    These complement the delicate nature of watercolors without overwhelming them. Consider adding a double mat 
                    with a neutral outer mat and a colored inner mat that picks up a hue from your painting.
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                  <p className="font-medium">What's the difference between conservation and museum glass?</p>
                </div>
                <div className="bg-secondary/10 rounded-lg p-4">
                  <p className="text-sm">
                    Both conservation and museum glass provide UV protection to prevent artwork fading. 
                    The key difference is that museum glass has an anti-reflective coating that makes it virtually invisible, 
                    providing the clearest view of your artwork, while conservation glass may have some reflection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="relative py-16 overflow-hidden">
        {/* Luxury interior background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury interior background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-secondary/20 mb-4">
              <Lightbulb className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Our Framing Solutions</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Discover our range of custom framing options, from readymade frames to museum-quality conservation framing and eco-friendly solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Custom Frame Card */}
            <Card className="overflow-hidden shadow-lg">
              <div className="aspect-video bg-neutral-100 relative">
                {customFrame && customFrame.imageUrl ? (
                  <img 
                    src={customFrame.imageUrl} 
                    alt={customFrame.name} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1579541591970-e5dea16942e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                    alt="Custom Frame Example" 
                    className="object-cover w-full h-full"
                  />
                )}
                <div className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
                  Bestseller
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Custom Frames</h3>
                <p className="text-neutral-500 text-sm mb-4">
                  Tailored framing solutions with a 62% faster turnaround time using our revolutionary hybrid production model and AI design assistant.
                </p>
                <Link href="/custom-framing">
                  <Button variant="outline" className="w-full">View Custom Options</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Shadowbox Card */}
            <Card className="overflow-hidden shadow-lg">
              <div className="aspect-video bg-neutral-100">
                {shadowbox && shadowbox.imageUrl ? (
                  <img 
                    src={shadowbox.imageUrl} 
                    alt={shadowbox.name} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1552610470-98f65b5df6cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                    alt="Shadowbox Example" 
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Shadowboxes</h3>
                <p className="text-neutral-500 text-sm mb-4">
                  Preserve and display your memorabilia, medals, sports jerseys, or 3D objects with our custom-designed shadowboxes.
                </p>
                <Link href="/products/category/shadowbox">
                  <Button variant="outline" className="w-full">Explore Shadowboxes</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Float Mount Card */}
            <Card className="overflow-hidden shadow-lg">
              <div className="aspect-video bg-neutral-100">
                {moonmount && moonmount.imageUrl ? (
                  <img 
                    src={moonmount.imageUrl} 
                    alt={moonmount.name} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                    alt="Float Mount Example" 
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Float Mounts</h3>
                <p className="text-neutral-500 text-sm mb-4">
                  Showcase your artwork with our float mounting option that creates the illusion of the art floating within the frame.
                </p>
                <Link href="/products/category/floatmount">
                  <Button variant="outline" className="w-full">View Float Mounts</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Art Installation Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Luxury interior background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury interior background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="mb-6">
                  <div className="inline-block p-3 rounded-full bg-secondary/20 mb-4">
                    <ShieldCheck className="h-8 w-8 text-secondary" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Professional Art Installation</h2>
                  <p className="text-gray-300">
                    Our Houston-based installation team ensures your art is displayed perfectly in your home or office, 
                    with expert precision and care to enhance your space's aesthetic.
                  </p>
                </div>

                <ul className="space-y-6">
                  <li className="flex items-start">
                    <div className="bg-secondary rounded-full p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium">Expert Positioning</span>
                      <p className="text-sm text-neutral-500 mt-1">
                        Our installers determine the optimal height and arrangement for visual impact and accessibility.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary rounded-full p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium">Secure Mounting Hardware</span>
                      <p className="text-sm text-neutral-500 mt-1">
                        We use appropriate anchors and hardware based on wall type and artwork weight for long-term stability.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary rounded-full p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium">Gallery-Style Arrangements</span>
                      <p className="text-sm text-neutral-500 mt-1">
                        Create professional-looking gallery walls with our expert arrangement and installation services.
                      </p>
                    </div>
                  </li>
                </ul>

                <Link href="/custom-framing">
                  <Button className="bg-primary hover:bg-primary/90 text-white w-full md:w-auto font-medium mt-6">
                    Learn More About Our Services
                  </Button>
                </Link>
              </div>

              <div className="relative h-80 md:h-full">
                <img 
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Art Installation" 
                  className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot />
      </div>
    </>
  );
};

export default Home;