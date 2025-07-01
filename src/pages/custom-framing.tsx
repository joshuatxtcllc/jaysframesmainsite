import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import FrameDesigner from "@/components/product/frame-designer";
import Chatbot from "@/components/ui/chatbot";
import { RecommendationCarousel } from "@/components/product/recommendation-carousel";
import { MessageSquare, Wand2, PaintBucket, Camera, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { DesignProgressProvider } from "@/contexts/design-progress-context";

const CustomFraming = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="bg-white">
      <Helmet>
        <title>Custom Framing in Houston, TX | Expert Frame Design & Preservation | Jay's Frames</title>
        <meta name="description" content="Experience the art of custom framing in Houston with Jay's Frames. We collaborate with you throughout the entire framing process using museum-quality materials and preservation techniques to ensure your artwork lasts for generations." />
        <meta name="keywords" content="custom framing Houston, picture frame preservation, museum-quality framing, art preservation techniques, Houston custom frame design, collaborative framing process" />
        <link rel="canonical" href="https://jaysframes.com/custom-framing" />
        
        {/* Open Graph tags for better social sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Custom Framing in Houston, TX | Expert Frame Design & Preservation" />
        <meta property="og:description" content="Experience the art of custom framing in Houston with Jay's Frames. We collaborate with you throughout the entire framing process using museum-quality materials and preservation techniques." />
        <meta property="og:url" content="https://jaysframes.com/custom-framing" />
        <meta property="og:image" content="/images/custom-framing-og.jpg" />
        <meta property="og:site_name" content="Jay's Frames" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Custom Framing in Houston, TX | Expert Frame Design & Preservation" />
        <meta name="twitter:description" content="Experience the art of custom framing in Houston with Jay's Frames. We collaborate with you throughout the entire framing process using museum-quality materials." />
        <meta name="twitter:image" content="/images/custom-framing-og.jpg" />
        
        {/* Structured data for local business with custom framing services */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Jay's Frames",
            "description": "Award-winning custom framing shop in Houston Heights, specializing in museum-quality preservation and collaborative framing process.",
            "image": "/images/og-image.jpg",
            "telephone": "+18328933794",
            "email": "info@jaysframes.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1440 Yale St.",
              "addressLocality": "Houston",
              "addressRegion": "TX",
              "postalCode": "77008",
              "addressCountry": "US"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "29.7904",
              "longitude": "-95.3988"
            },
            "url": "https://jaysframes.com/custom-framing",
            "priceRange": "$$",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Custom Framing Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Custom Picture Framing",
                    "description": "Expert custom framing with museum-quality materials and preservation techniques"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Art Installation Services",
                    "description": "Professional art installation ensuring correct and safe display to enhance presentation"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Art Preservation",
                    "description": "Museum-quality preservation techniques for long-term protection of your valuable artwork"
                  }
                }
              ]
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://jaysframes.com/custom-framing"
            }
          }
        `}</script>
      </Helmet>
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

          <DesignProgressProvider designId={`design-${Date.now()}`}>
            <FrameDesigner />
          </DesignProgressProvider>
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
                      <h3 className="font-bold text-lg">Museum-Quality Preservation</h3>
                    </div>
                    <p className="text-neutral-500 mb-6 ml-8">
                      Your artwork is mounted using our proprietary Moonmount™ method with acid-free materials and UV-protective glass. We use museum-quality preservation techniques to ensure your valuable art is protected from environmental damage and will last for generations to come.
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
      
      {/* AR Frame Fitting Assistant Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block p-3 rounded-full bg-primary/20 mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Try Our AR Frame Fitting Assistant</h2>
              <p className="text-neutral-600 mb-6">
                See how your artwork will look framed on your wall in real-time with our 
                augmented reality tool. Try different frame styles and colors directly through 
                your camera to find the perfect match for your space.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-primary mb-2">Visualize on Your Wall</h3>
                  <p className="text-sm text-neutral-500">
                    Point your camera at your wall and see frames in real-time
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-primary mb-2">Try Different Styles</h3>
                  <p className="text-sm text-neutral-500">
                    Switch between frame styles, colors, and sizes instantly
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-primary mb-2">Capture & Share</h3>
                  <p className="text-sm text-neutral-500">
                    Save screenshots of your favorite combinations
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-primary mb-2">Scale Accurately</h3>
                  <p className="text-sm text-neutral-500">
                    See true-to-size frame dimensions in your space
                  </p>
                </div>
              </div>
              
              <Button asChild className="w-full md:w-auto text-white" size="lg">
                <Link href="/ar-frame-assistant">
                  Try AR Frame Assistant
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/images/ar-frame-preview.jpg" 
                  alt="AR Frame Preview" 
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute top-4 right-4 bg-primary text-white text-xs px-2 py-1 rounded">
                  NEW FEATURE
                </div>
              </div>
            </div>
          </div>
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
