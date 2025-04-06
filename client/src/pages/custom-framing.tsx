import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import FrameDesigner from "@/components/product/frame-designer";
import Chatbot from "@/components/ui/chatbot";
import { RecommendationCarousel } from "@/components/product/recommendation-carousel";
import { MessageSquare, Wand2, PaintBucket } from "lucide-react";
import { Button } from "@/components/ui/button";

const CustomFraming = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="bg-white">
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-secondary/20 mb-4">
              <Wand2 className="h-8 w-8 text-secondary" />
            </div>
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
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-secondary/20 p-2 rounded-full mr-3">
                    <svg className="h-6 w-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-primary">Our Custom Framing Process</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <div className="flex items-start mb-2">
                      <div className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                        <span className="text-sm font-medium">1</span>
                      </div>
                      <h3 className="font-bold text-lg">Design Online</h3>
                    </div>
                    <p className="text-neutral-500 mb-6 ml-8">
                      Use our AI-powered frame designer to find the perfect combination of frame, mat, and glass for your artwork. Our system analyzes your artwork description to recommend the most complementary options.
                    </p>

                    <div className="flex items-start mb-2">
                      <div className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                        <span className="text-sm font-medium">2</span>
                      </div>
                      <h3 className="font-bold text-lg">We Create Your Frame</h3>
                    </div>
                    <p className="text-neutral-500 mb-4 ml-8">
                      Once you place your order, our skilled craftspeople will carefully cut and assemble your custom frame by hand, ensuring precision and quality at every step.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-start mb-2">
                      <div className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                        <span className="text-sm font-medium">3</span>
                      </div>
                      <h3 className="font-bold text-lg">Museum-Quality Mounting</h3>
                    </div>
                    <p className="text-neutral-500 mb-6 ml-8">
                      Your artwork is mounted using our proprietary Moonmount™ method, which ensures archival preservation while providing a perfect presentation.
                    </p>

                    <div className="flex items-start mb-2">
                      <div className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                        <span className="text-sm font-medium">4</span>
                      </div>
                      <h3 className="font-bold text-lg">Track Your Order</h3>
                    </div>
                    <p className="text-neutral-500 mb-4 ml-8">
                      Follow the progress of your custom frame in real-time through our order tracking system. You'll know exactly when your frame will be ready for pickup or delivery.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-secondary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      <h3 className="font-bold text-lg">Our Quality Guarantee</h3>
                    </div>
                    <p className="text-neutral-600">
                      We stand behind every custom frame we create. If you're not completely satisfied with your frame, we'll work with you to make it right. That's our promise to you.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-block p-3 rounded-full bg-primary/20 mb-4">
              <PaintBucket className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
              AI-Powered Frame Recommendations
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Describe your artwork and our AI will suggest the perfect frames and mats to complement it.
            </p>
          </div>
          
          <RecommendationCarousel />
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-t-4 border-secondary">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-secondary/20 p-2 rounded-full mr-3">
                    <MessageSquare className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-primary">Need Professional Help?</h2>
                </div>
                <p className="text-neutral-500 mb-6">
                  If you're unsure about which framing options would work best for your artwork, our AI assistant can provide expert recommendations based on your specific needs.
                </p>
                <div className="p-4 bg-neutral-100 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-4">Our assistant can help with:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Frame style recommendations",
                      "Mat color combinations",
                      "Conservation advice",
                      "Glass and mounting options"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-secondary rounded-full p-1 mr-2 mt-1">
                          <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <span className="text-neutral-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button 
                    className="bg-secondary hover:bg-secondary/80 text-white font-medium px-8 py-2"
                    onClick={toggleChatbot}
                  >
                    Ask Our AI Assistant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot initialIsOpen={isChatbotOpen} setIsOpen={setIsChatbotOpen} />
      </div>
    </div>
  );
};

export default CustomFraming;
