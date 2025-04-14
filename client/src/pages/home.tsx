import Hero from "@/components/home/hero";
import Process from "@/components/home/process";
import Testimonials from "@/components/home/testimonials";
import Chatbot from "@/components/ui/chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Lightbulb, MessageSquare, Wand2, ShieldCheck } from "lucide-react";
import FrameDesigner from "@/components/product/frame-designer";
import { Helmet } from "react-helmet";

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
      <Helmet>
        <title>Jay's Frames - Best Custom Picture Framing in Houston | Museum-Quality Preservation</title>
        <meta name="description" content="Award-winning custom framing in Houston's Heights. We collaborate closely with you throughout the entire framing process using museum-quality materials and preservation techniques to ensure your artwork lasts for generations." />
        <meta name="keywords" content="custom framing Houston, picture frames Houston Heights, art preservation techniques, museum-quality framing, Houston A-List best frame shop, collaborative framing process, Houston custom framing, art installation services, frame preservation" />
        <link rel="canonical" href="https://jaysframes.com" />
        
        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Jay's Frames - Best Custom Picture Framing in Houston | Museum-Quality Preservation" />
        <meta property="og:description" content="Award-winning custom framing in Houston's Heights. We collaborate closely with you throughout the entire framing process using museum-quality materials and preservation techniques." />
        <meta property="og:url" content="https://jaysframes.com" />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:site_name" content="Jay's Frames" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Jay's Frames - Best Custom Picture Framing in Houston | Museum-Quality Preservation" />
        <meta name="twitter:description" content="Award-winning custom framing in Houston's Heights. We collaborate closely with you throughout the entire framing process using museum-quality materials and preservation techniques." />
        <meta name="twitter:image" content="/images/og-image.jpg" />
        
        {/* Structured data */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Jay's Frames",
            "description": "Award-winning custom framing shop in Houston Heights offering museum-quality preservation and a collaborative framing process. We provide expert art installation services and use preservation techniques to protect your valuable artwork.",
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
            "url": "https://jaysframes.com",
            "priceRange": "$$",
            "areaServed": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "29.7604",
                "longitude": "-95.3698"
              },
              "geoRadius": "30000"
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "10:00",
                "closes": "16:00"
              }
            ],
            "sameAs": [
              "https://www.facebook.com/jaysframes",
              "https://www.instagram.com/jaysframes"
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Custom Framing Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Custom Picture Framing",
                    "description": "Expert custom framing with collaborative consultation process"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Museum-Quality Art Preservation",
                    "description": "Long-term protection for your artwork using acid-free materials and UV-protective glass"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Art Installation Services",
                    "description": "Professional installation ensuring correct and safe display to enhance presentation"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Shadowbox Framing",
                    "description": "Custom shadowboxes for memorabilia and 3D objects with museum-quality preservation"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI-Powered Frame Design",
                    "description": "Intelligent frame recommendations using advanced AI technology"
                  }
                }
              ]
            },
            "award": "Voted 'Best Frame Shop in Houston' by The Houston A-List"
          }
        `}</script>
      </Helmet>
      
      {/* Hero Section */}
      <Hero />
      
      {/* Framing Process */}
      <Process />
      
      {/* AI Frame Designer Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-secondary/20 mb-4">
              <Wand2 className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">AI-Powered Frame Designer</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Try our revolutionary design assistant that helps you create the perfect frame for your artwork in minutes.
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
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-secondary/20 mb-4">
              <MessageSquare className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Ask Our Frame Design Assistant</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Get expert framing advice from our AI assistant, trained on thousands of professional framing projects.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="p-6 bg-primary text-white md:col-span-2">
                <h3 className="text-xl font-bold mb-4">How Can Our Assistant Help You?</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="bg-secondary rounded-full p-1 mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-secondary/20 mb-4">
              <Lightbulb className="h-8 w-8 text-secondary" />
            </div>
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
                  <Link href="/products?category=frame">
                    <Button className="bg-secondary hover:bg-secondary/80 text-white font-medium">
                      View Frame Options
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
                    Available in black, white, and brown finishes across multiple sizes to showcase your memorabilia perfectly.
                  </p>
                  <Link href="/products?category=shadowbox">
                    <Button className="bg-secondary hover:bg-secondary/80 text-white font-medium">
                      Browse Shadowboxes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
            
            {/* Moonmounts Card */}
            {moonmount && (
              <Card className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl">
                <div className="w-full h-64 overflow-hidden relative">
                  <img 
                    src={moonmount.imageUrl} 
                    alt="Moonmounts" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg p-2 shadow-lg">
                    <img 
                      src="/attached_assets/IMG_7665.png" 
                      alt="Moonmount Magnets" 
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-2 text-primary">Moonmounts™</h3>
                  <p className="text-neutral-500 mb-4">
                    Our proprietary, patented museum mounting method using disk-shaped magnets that preserves your artwork for generations.
                  </p>
                  <Link href="/products?category=moonmount">
                    <Button className="bg-secondary hover:bg-secondary/80 text-white font-medium">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
      
      {/* Art Preservation & Installation Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-primary/20 mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Museum-Quality Preservation & Installation</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              We provide comprehensive art care solutions to ensure your valuable pieces are protected and beautifully displayed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-6">Art Preservation Techniques</h3>
              <p className="text-neutral-600 mb-6">
                At Jay's Frames, we take pride in the picture frames we produce. We use museum-quality materials and preservation 
                techniques to ensure our custom frames last for many years to come while protecting your valuable artwork.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="bg-secondary rounded-full p-1 mr-3 mt-1">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Acid-Free Materials</span>
                    <p className="text-sm text-neutral-500 mt-1">
                      All our matting materials, backing boards, and mounting elements are acid-free to prevent deterioration.
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
                    <span className="font-medium">UV-Protective Glass</span>
                    <p className="text-sm text-neutral-500 mt-1">
                      Our conservation and museum glass blocks up to 99% of harmful UV rays that cause fading and deterioration.
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
                    <span className="font-medium">Archival Mounting Methods</span>
                    <p className="text-sm text-neutral-500 mt-1">
                      Our proprietary Moonmount™ system secures artwork without damaging it, allowing for reversible mounting.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-primary mb-6">Professional Art Installation</h3>
              <p className="text-neutral-600 mb-6">
                Our art installation services ensure your framed pieces are displayed safely and beautifully in your home or office. 
                We respond to our customers' needs by providing comprehensive hanging and positioning services.
              </p>
              
              <ul className="space-y-4 mb-8">
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
                <Button className="bg-primary hover:bg-primary/90 text-white w-full md:w-auto font-medium">
                  Learn More About Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot />
      </div>
    </>
  );
};

export default Home;
