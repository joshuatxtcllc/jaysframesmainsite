import { Card, CardContent } from "@/components/ui/card";
import FrameDesigner from "@/components/product/frame-designer";
import Chatbot from "@/components/ui/chatbot";

const CustomFraming = () => {
  return (
    <div className="bg-white">
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Design Your Custom Frame</h1>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Our AI-powered design assistant will help you create the perfect frame for your artwork.
            </p>
          </div>
          
          <FrameDesigner />
        </div>
      </section>
      
      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">Our Custom Framing Process</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="font-bold text-lg mb-2">1. Design Online</h3>
                    <p className="text-neutral-500 mb-4">
                      Use our AI-powered frame designer to find the perfect combination of frame, mat, and glass for your artwork. Our system analyzes your artwork description to recommend the most complementary options.
                    </p>
                    
                    <h3 className="font-bold text-lg mb-2">2. We Create Your Frame</h3>
                    <p className="text-neutral-500 mb-4">
                      Once you place your order, our skilled craftspeople will carefully cut and assemble your custom frame by hand, ensuring precision and quality at every step.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">3. Museum-Quality Mounting</h3>
                    <p className="text-neutral-500 mb-4">
                      Your artwork is mounted using our proprietary Moonmount™ method, which ensures archival preservation while providing a perfect presentation.
                    </p>
                    
                    <h3 className="font-bold text-lg mb-2">4. Track Your Order</h3>
                    <p className="text-neutral-500 mb-4">
                      Follow the progress of your custom frame in real-time through our order tracking system. You'll know exactly when your frame will be ready for pickup or delivery.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h3 className="font-bold text-lg mb-2">Our Quality Guarantee</h3>
                  <p className="text-neutral-500">
                    We stand behind every custom frame we create. If you're not completely satisfied with your frame, we'll work with you to make it right. That's our promise to you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default CustomFraming;
