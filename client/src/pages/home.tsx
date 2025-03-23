import Hero from "@/components/home/hero";
import Process from "@/components/home/process";
import Testimonials from "@/components/home/testimonials";
import Chatbot from "@/components/ui/chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

const Home = () => {
  // Fetch featured products
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  // Get one product from each category for showcase
  const getProductsByCategory = (category: string) => {
    return products.find((product: any) => product.category === category);
  };

  const customFrame = getProductsByCategory("frame");
  const shadowbox = getProductsByCategory("shadowbox");
  const moonmount = getProductsByCategory("moonmount");

  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* Framing Process */}
      <Process />
      
      {/* Product Showcase */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Our Framing Solutions</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              From custom frames to ready-made options, we offer solutions for every artwork and budget.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Custom Framing Card */}
            {customFrame && (
              <Card className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl">
                <div className="w-full h-64 overflow-hidden">
                  <img 
                    src={customFrame.imageUrl} 
                    alt="Custom Framing" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-2 text-primary">Custom Framing</h3>
                  <p className="text-neutral-500 mb-4">
                    Tailor-made frames designed for your specific artwork with expert guidance from our AI assistant.
                  </p>
                  <Link href="/custom-framing">
                    <Button className="bg-secondary hover:bg-secondary-light text-white">
                      Start Designing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
            
            {/* Shadowboxes Card */}
            {shadowbox && (
              <Card className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl">
                <div className="w-full h-64 overflow-hidden">
                  <img 
                    src={shadowbox.imageUrl} 
                    alt="Shadowboxes" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-2 text-primary">Shadowboxes</h3>
                  <p className="text-neutral-500 mb-4">
                    Showcase memorabilia, 3D objects, and keepsakes in our custom or ready-made shadowbox frames.
                  </p>
                  <Link href="/products?category=shadowbox">
                    <Button className="bg-secondary hover:bg-secondary-light text-white">
                      Explore Options
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
            
            {/* Moonmounts Card */}
            {moonmount && (
              <Card className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl">
                <div className="w-full h-64 overflow-hidden">
                  <img 
                    src={moonmount.imageUrl} 
                    alt="Moonmounts" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-2 text-primary">Moonmounts™</h3>
                  <p className="text-neutral-500 mb-4">
                    Our proprietary, patented museum mounting method that preserves your artwork for generations.
                  </p>
                  <Link href="/products?category=moonmount">
                    <Button className="bg-secondary hover:bg-secondary-light text-white">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Chatbot */}
      <Chatbot />
    </>
  );
};

export default Home;
