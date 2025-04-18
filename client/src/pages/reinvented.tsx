import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { ArrowRight, Award, Bot, Clock, Cpu, MailIcon, MessageCircle, Phone, Rocket, ShoppingCart, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Chatbot from "@/components/ui/chatbot";

export default function ReinventedPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Jay's Frames Reinvented | Revolutionary Hybrid Model | 62% Faster Turnaround</title>
        <meta name="description" content="Experience Jay's revolutionary hybrid production model that saves 6,363 labor hours annually ($140,000), increases capacity by 4x, and provides 62% faster turnaround times. Our AI design assistant learns Jay's precise framing style." />
        <meta name="keywords" content="Jay's Frames, custom framing Houston, hybrid production model, AI design assistant, 62% faster turnaround, custom frame shop, 24/7 customer service, ready made frames, one day framing, eco-friendly framing" />
        <link rel="canonical" href="https://jaysframes.com/reinvented" />
        
        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Jay's Frames Reinvented | Revolutionary Hybrid Model | 62% Faster Turnaround" />
        <meta property="og:description" content="Jay's revolutionary hybrid production model saves 6,363 labor hours annually ($140,000), increases capacity by 4x, and provides 62% faster turnaround times. AI design assistance and 24/7 customer service." />
        <meta property="og:url" content="https://jaysframes.com/reinvented" />
        <meta property="og:image" content="/images/jays-frames-reinvented.jpg" />
        <meta property="og:site_name" content="Jay's Frames" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Jay's Frames Reinvented",
            "description": "Jay's revolutionary hybrid production model increases capacity by 4x and provides 62% faster turnaround times through innovative process improvements and AI technology.",
            "url": "https://jaysframes.com/reinvented",
            "isPartOf": {
              "@type": "WebSite",
              "name": "Jay's Frames",
              "url": "https://jaysframes.com"
            },
            "mainEntity": {
              "@type": "LocalBusiness",
              "name": "Jay's Frames",
              "description": "Houston's premier custom framing studio featuring a revolutionary hybrid production model that provides 62% faster turnaround times and uses eco-friendly, locally-sourced materials.",
              "telephone": "+18328933794",
              "email": "info@jaysframes.com",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  "opens": "10:00",
                  "closes": "18:00"
                }
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "1440 Yale St.",
                "addressLocality": "Houston",
                "addressRegion": "TX",
                "postalCode": "77008",
                "addressCountry": "US"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Framing Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Custom Framing",
                      "description": "Expert custom framing with 62% faster turnaround times"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Ready Made Framing",
                      "description": "One-day turnaround framing options at a lower price point"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Eco-Friendly Framing",
                      "description": "Sustainable framing using locally sourced wood from reclaimed materials"
                    }
                  }
                ]
              }
            }
          }
        `}</script>
      </Helmet>
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px',
            }} />
          </div>
          
          <div className="container px-4 py-20 md:py-32 mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Jay's Frames <span className="text-secondary font-serif inline-block">Reinvented</span>
              </h1>
              <div className="inline-block px-4 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary mb-8">
                Grand Reopening 2025
              </div>
              <p className="text-xl md:text-2xl mb-10 text-white/80 max-w-3xl mx-auto">
                We've transformed custom framing with AI-powered design assistance, 
                streamlined workflows, and enhanced craftsmanship — all to serve you better.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/custom-framing">
                    Start Framing <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10" asChild>
                  <Link href="#benefits">
                    See What's New
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
        </section>
        
        {/* Promotional Announcement */}
        <section className="py-12 bg-secondary text-white">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-3/4">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  The Future of Custom Framing is Here – And It Saves You Time and Money!
                </h2>
                <p className="text-lg font-medium mb-0">
                  <span className="underline decoration-4 decoration-white/30 underline-offset-4">BREAKING NEWS:</span> Jay's Frames Reinvented has revolutionized the framing industry! Our game-changing automation and AI integration slashes production time by 50% and eliminates common framing mistakes. With our wholesale partnerships, streamlined workflow, and digital assistants, we've reduced overhead costs while delivering superior quality. Visit our <Link href="/reinvented" className="text-white font-bold hover:underline">Jay's Frames Reinvented</Link> page to discover how our technological transformation translates to faster turnaround times, exceptional craftsmanship, and unbeatable value for your cherished artwork. Don't miss out on the framing revolution – experience it today!
                </p>
              </div>
              <div className="md:w-1/4 flex justify-center">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 font-medium" asChild>
                  <a href="#savings">
                    See the Savings <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits section */}
        <section id="benefits" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How We've Reinvented Framing</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                With our modernized approach, we've streamlined every aspect of the custom framing process, 
                focusing on efficiency, quality, and customer satisfaction.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1 */}
              <Card className="border-primary/10 bg-primary/5 overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="h-2 bg-primary"></div>
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">AI-Powered Design Assistant</h3>
                  <p className="text-muted-foreground mb-4">
                    Our cutting-edge Frame Design Assistant offers personalized recommendations for your artwork, 
                    suggesting the perfect frame styles, mat combinations, and design options.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Personalized frame & mat recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Expert-level guidance 24/7</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Real-time pricing aligned with in-store options</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Card 2 */}
              <Card className="border-primary/10 bg-primary/5 overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="h-2 bg-primary"></div>
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <Cpu className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Streamlined Workflow</h3>
                  <p className="text-muted-foreground mb-4">
                    We've reinvented our production process from start to finish, implementing 
                    automation and digital tracking for faster, more reliable service.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>62% reduction in production time</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Real-time order tracking & updates</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Automated quality control checks</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Card 3 */}
              <Card className="border-primary/10 bg-primary/5 overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="h-2 bg-primary"></div>
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Enhanced Communications</h3>
                  <p className="text-muted-foreground mb-4">
                    Stay informed at every step with our multi-channel notification system 
                    and AI-powered customer support.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Automated email & SMS notifications</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>24/7 AI chat support</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Transparent process updates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Card 4 - Eco-Friendly Materials */}
              <Card className="border-primary/10 bg-primary/5 overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="h-2 bg-primary"></div>
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Eco-Friendly Materials</h3>
                  <p className="text-muted-foreground mb-4">
                    Our innovative upcycling process creates beautiful, high-quality frames from locally-sourced materials 
                    that would otherwise go to waste.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Locally-sourced reclaimed wood end pieces</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Custom-milled in favorite profiles</span>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Lower cost, faster turnaround time</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Feature highlight */}
        <section className="py-20 bg-gradient-to-r from-secondary/5 to-transparent border-y border-secondary/10">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Faster Turnaround Times</h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Our reinvented workflow automation and streamlined production processes have 
                  dramatically reduced wait times without compromising on quality.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="rounded-full bg-green-100 p-1 mr-4 mt-1">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Standard Framing</h3>
                      <p className="text-muted-foreground">Now 7-10 days (previously 14-21 days)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="rounded-full bg-green-100 p-1 mr-4 mt-1">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Rush Orders</h3>
                      <p className="text-muted-foreground">Now 3-5 days (previously 7-10 days)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="rounded-full bg-green-100 p-1 mr-4 mt-1">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Museum-Quality Conservation</h3>
                      <p className="text-muted-foreground">Now 10-14 days (previously 21-28 days)</p>
                    </div>
                  </div>
                </div>
                
                <Button size="lg" asChild>
                  <Link href="/custom-framing">
                    Get Started Today
                  </Link>
                </Button>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow-xl">
                <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100 relative flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="10" height="10">
                        <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                      </pattern>
                    </defs>
                    
                    {/* Background */}
                    <rect width="800" height="800" fill="#f8f8f8" />
                    
                    {/* Frame background */}
                    <rect x="100" y="100" width="600" height="600" fill="white" stroke="#e0e0e0" strokeWidth="2" />
                    
                    {/* Frame outer border */}
                    <rect x="50" y="50" width="700" height="700" fill="none" stroke="#333" strokeWidth="20" />
                    
                    {/* Frame inner border */}
                    <rect x="100" y="100" width="600" height="600" fill="none" stroke="#444" strokeWidth="10" />
                    
                    {/* Mat */}
                    <rect x="150" y="150" width="500" height="500" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="1" />
                    
                    {/* Picture */}
                    <rect x="200" y="200" width="400" height="400" fill="url(#diagonalHatch)" />
                    
                    {/* Text */}
                    <text x="400" y="400" fontFamily="sans-serif" fontSize="32" textAnchor="middle" fill="#333">FASTER</text>
                    <text x="400" y="440" fontFamily="sans-serif" fontSize="32" textAnchor="middle" fill="#333">TURNAROUND</text>
                    
                    {/* Decorative elements */}
                    <circle cx="400" cy="300" r="50" fill="none" stroke="#999" strokeWidth="2" />
                    <rect x="350" y="500" width="100" height="20" fill="#999" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Savings section */}
        <section id="savings" className="py-20 px-4 bg-primary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Significant Cost Savings</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our technological transformation hasn't just improved the custom framing experience — it's revolutionized our business model, 
                allowing us to pass on substantial savings while delivering superior quality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-primary">The Numbers Don't Lie</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h4 className="font-medium text-lg">Outsourced Frame Production</h4>
                      <p className="text-muted-foreground text-sm">Professional partners with quality guarantees</p>
                    </div>
                    <div className="bg-green-100 text-green-800 font-bold px-4 py-2 rounded-full">
                      $50,000/year savings
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h4 className="font-medium text-lg">AI Design & Order Assistant</h4>
                      <p className="text-muted-foreground text-sm">Automated consultations & inventory management</p>
                    </div>
                    <div className="bg-green-100 text-green-800 font-bold px-4 py-2 rounded-full">
                      $50,000/year savings
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h4 className="font-medium text-lg">Automated Notifications</h4>
                      <p className="text-muted-foreground text-sm">Email & SMS updates with zero staff effort</p>
                    </div>
                    <div className="bg-green-100 text-green-800 font-bold px-4 py-2 rounded-full">
                      200+ hours saved annually
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-lg">Digital Kanban Workflow</h4>
                      <p className="text-muted-foreground text-sm">Streamlined production management</p>
                    </div>
                    <div className="bg-green-100 text-green-800 font-bold px-4 py-2 rounded-full">
                      50% less production time
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg border border-primary/10 shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-primary">Streamlined Operational Flow</h3>
                  <ol className="space-y-3 relative border-l border-primary/20 pl-6">
                    <li className="mb-5">
                      <div className="absolute w-4 h-4 bg-primary rounded-full -left-2"></div>
                      <h4 className="font-bold">Customer Arrival</h4>
                      <p className="text-muted-foreground">AI design assistant begins consultation immediately</p>
                    </li>
                    <li className="mb-5">
                      <div className="absolute w-4 h-4 bg-primary/60 rounded-full -left-2"></div>
                      <h4 className="font-bold">Design Approval</h4>
                      <p className="text-muted-foreground">Quick staff approval of AI recommendations</p>
                    </li>
                    <li className="mb-5">
                      <div className="absolute w-4 h-4 bg-primary/60 rounded-full -left-2"></div>
                      <h4 className="font-bold">Automated Ordering</h4>
                      <p className="text-muted-foreground">Materials auto-ordered after customer checkout</p>
                    </li>
                    <li className="mb-5">
                      <div className="absolute w-4 h-4 bg-primary/60 rounded-full -left-2"></div>
                      <h4 className="font-bold">Professional Assembly</h4>
                      <p className="text-muted-foreground">Expert assembly with direct flow between stations</p>
                    </li>
                    <li>
                      <div className="absolute w-4 h-4 bg-primary rounded-full -left-2"></div>
                      <h4 className="font-bold">Automated Notifications</h4>
                      <p className="text-muted-foreground">Customer alerted when order is ready for pickup</p>
                    </li>
                  </ol>
                </div>
                
                <div className="bg-secondary/10 p-6 rounded-lg">
                  <blockquote className="italic text-lg relative px-8">
                    <div className="absolute top-0 left-0 text-6xl text-secondary/20">"</div>
                    By outsourcing frame cutting and joining to wholesale specialists, we've eliminated mistakes, reduced labor costs, and streamlined our entire production flow. The result? Higher quality, faster turnaround, and more satisfied customers.
                    <div className="absolute bottom-0 right-4 text-6xl text-secondary/20">"</div>
                  </blockquote>
                  <div className="mt-4 font-medium text-right">— Jay, Founder</div>
                  <p className="text-sm mt-4 text-muted-foreground">According to <a href="https://www.ppfa.com/industry-research/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PPFA industry research</a>, businesses implementing hybrid production models have seen an average of 40% increase in operational efficiency.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Design Assistant section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our AI Design Assistant</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Expert framing advice at your fingertips 24/7. Our AI assistant helps you find the perfect frame 
                design for your artwork by analyzing your preferences and needs.
              </p>
            </div>
            
            <Tabs defaultValue="design" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design">Design Consultation</TabsTrigger>
                <TabsTrigger value="recommend">Frame Recommendations</TabsTrigger>
                <TabsTrigger value="pricing">Pricing Estimates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="design" className="p-6 border rounded-lg mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Personalized Design Consultation</h3>
                    <p className="mb-4 text-muted-foreground">
                      Our AI assistant guides you through the design process with expert knowledge of frame styles, 
                      mat combinations, and design principles.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span>Trained on thousands of successful frame designs</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span>Considers artwork style, colors, and display environment</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span>Available anytime, anywhere on your device</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-neutral-100 rounded-lg p-6">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <div className="flex items-start mb-4">
                        <div className="bg-primary/10 rounded-full p-2 mr-3">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div className="bg-primary/5 rounded-lg p-3 text-sm">
                          <p>Welcome to Jay's Frames Design Assistant! Tell me about the artwork you'd like to frame, and I'll help you create the perfect custom frame design.</p>
                        </div>
                      </div>
                      <div className="flex items-start mb-4">
                        <div className="bg-neutral-100 rounded-full p-2 mr-3">
                          <MessageCircle className="h-5 w-5 text-neutral-600" />
                        </div>
                        <div className="bg-neutral-100 rounded-lg p-3 text-sm">
                          <p>I have a watercolor painting of a coastal scene, about 12×16 inches. I want something that complements the blues and grays but doesn't overwhelm the subtle colors.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-primary/10 rounded-full p-2 mr-3">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div className="bg-primary/5 rounded-lg p-3 text-sm">
                          <p>For your coastal watercolor, I'd recommend a thin silver or light driftwood frame that echoes the natural beachy feel. A pale blue-gray double mat with a slightly darker inner mat would create depth without overwhelming the delicate colors...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recommend" className="p-6 border rounded-lg mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Intelligent Frame Recommendations</h3>
                    <p className="mb-4 text-muted-foreground">
                      Leveraging our extensive catalog and design knowledge, our AI provides specific 
                      product recommendations tailored to your artwork and preferences.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span>Recommends from our premium Larson-Juhl frame catalog</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span>Suggests complementary mat colors from Crescent</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span>Offers multiple options across different price points</span>
                      </li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="h-36 bg-neutral-200"></div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm">Driftwood Silver</h4>
                        <p className="text-xs text-muted-foreground">Distressed finish with silver accents</p>
                        <div className="mt-1 text-xs font-medium text-primary">Recommended</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="h-36 bg-neutral-200"></div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm">Coastal Blue</h4>
                        <p className="text-xs text-muted-foreground">Weathered blue with natural grain</p>
                        <div className="mt-1 text-xs font-medium text-primary">Recommended</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="h-36 bg-neutral-200"></div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm">Whisper White</h4>
                        <p className="text-xs text-muted-foreground">Clean white with subtle texture</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="h-36 bg-neutral-200"></div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm">Metal Silver</h4>
                        <p className="text-xs text-muted-foreground">Contemporary brushed finish</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="pricing" className="p-6 border rounded-lg mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Instant Pricing Estimates</h3>
                    <p className="mb-4 text-muted-foreground">
                      Get transparent price estimates in real-time as you explore different framing options, 
                      with no surprises at checkout.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span>Real-time pricing updates as you customize</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span>Transparent breakdown of material costs</span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span>Options across budget ranges with clear value comparison</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 border-b">
                      <h4 className="font-bold text-lg">Price Estimate</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">12×16 Frame (Driftwood Silver)</span>
                        <span>$85.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Double Mat (Blue-Gray)</span>
                        <span>$45.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Conservation Glass</span>
                        <span>$35.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mounting</span>
                        <span>$15.00</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-bold">
                        <span>Total Estimate</span>
                        <span>$180.00</span>
                      </div>
                      <div className="text-sm text-muted-foreground italic">
                        Final price may vary based on exact dimensions and services.
                      </div>
                      <Button className="w-full">
                        <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Notification system */}
        <section className="py-20 px-4 bg-gradient-to-r from-secondary/5 to-transparent border-y border-secondary/10">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Real-Time Order Updates</h2>
                <p className="text-lg mb-6 text-muted-foreground">
                  Our enhanced notification system keeps you informed at every step of your order's journey, 
                  with updates delivered through your preferred communication channels.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="rounded-full bg-primary/10 p-1 mr-4 mt-1">
                      <MailIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Email Notifications</h3>
                      <p className="text-muted-foreground">Detailed updates with order information</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="rounded-full bg-primary/10 p-1 mr-4 mt-1">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">SMS Alerts</h3>
                      <p className="text-muted-foreground">Quick text messages for important status changes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="rounded-full bg-primary/10 p-1 mr-4 mt-1">
                      <Rocket className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Order Timeline</h3>
                      <p className="text-muted-foreground">Visual progress tracker in your account dashboard</p>
                    </div>
                  </div>
                </div>
                
                <Button size="lg" asChild>
                  <Link href="/order-status">
                    Track Your Order
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-md p-4 transform transition-transform hover:translate-y-[-4px]">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-green-100 rounded-full p-1">
                      <Rocket className="h-4 w-4 text-green-600" />
                    </div>
                    <h4 className="font-bold">Order Confirmation</h4>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Thank you for your order #12345! We've received your custom framing request and will begin processing it right away.
                  </p>
                  <div className="text-xs text-neutral-400 mt-2">Today, 2:15 PM</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 transform transition-transform hover:translate-y-[-4px]">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-blue-100 rounded-full p-1">
                      <Rocket className="h-4 w-4 text-blue-600" />
                    </div>
                    <h4 className="font-bold">Materials Ordered</h4>
                  </div>
                  <p className="text-sm text-neutral-600">
                    We've ordered the materials for your custom frame. Once they arrive, we'll begin crafting your piece within 24-48 hours.
                  </p>
                  <div className="text-xs text-neutral-400 mt-2">Today, 4:30 PM</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4 transform transition-transform hover:translate-y-[-4px]">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-purple-100 rounded-full p-1">
                      <MessageCircle className="h-4 w-4 text-purple-600" />
                    </div>
                    <h4 className="font-bold">Chat Message</h4>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Hello! Just wanted to let you know we've received some special blue-gray matting that will perfectly complement your watercolor. Would you like to see a preview?
                  </p>
                  <div className="text-xs text-neutral-400 mt-2">Today, 5:45 PM</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Automated Review System */}
        <section className="py-20 px-4 bg-gradient-to-b from-white to-primary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Automated Review & Feedback System</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our new automated review system completes the perfect customer journey, ensuring satisfaction 
                and helping us maintain our reputation for excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-white p-6 rounded-lg shadow-xl border border-primary/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-400">
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="currentColor"/>
                        <path d="M12 13C7.58172 13 4 16.5817 4 21H20C20 16.5817 16.4183 13 12 13Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Client Follow-up</h3>
                      <p className="text-sm text-muted-foreground">Automated, yet personal</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="flex items-center mb-2">
                        <MailIcon className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-medium">Automated Email</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "Thank you for choosing Jay's Frames Reinvented! We hope you love your new custom frame. 
                        Would you mind taking a moment to share your experience?"
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center mb-2">
                        <MessageCircle className="h-5 w-5 text-blue-600 mr-2" />
                        <h4 className="font-medium">SMS Reminder</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "Jay's Frames: How are you enjoying your new frame? Reply with your satisfaction level (1-5) 
                        or tap here to leave a review."
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-red-500 mr-2">
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                        <span className="font-medium">Google Review</span>
                      </div>
                      <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-yellow-400">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-yellow-400">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-yellow-400">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-yellow-400">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-yellow-400">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      "Jay's Frames Reinvented completely transformed my framing experience! The AI assistant helped me select the perfect frame for my watercolor, and my order was ready in just a week. The quality is impeccable - I couldn't be happier!"
                    </p>
                    <div className="text-sm text-muted-foreground italic">
                      Sarah T. • 2 days ago
                    </div>
                    <div className="mt-3 p-2 border border-green-100 rounded bg-green-50 text-xs text-green-700 flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      <span>Posted to Google with one-click</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-bold mb-6">Complete Customer Journey</h3>
                <p className="text-lg mb-6 text-muted-foreground">
                  Our automated review system closes the loop on the customer experience, ensuring satisfaction 
                  while building our reputation.
                </p>

                <div className="space-y-6 mb-8">
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-primary/10">
                    <h4 className="font-bold text-lg flex items-center">
                      <div className="bg-primary/10 p-1.5 rounded-full mr-3">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                      Order Completion
                    </h4>
                    <p className="mt-2 text-muted-foreground pl-11">
                      When a customer's order is ready for pickup, our system automatically sends a notification via their preferred channel.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm border border-secondary/10">
                    <h4 className="font-bold text-lg flex items-center">
                      <div className="bg-secondary/10 p-1.5 rounded-full mr-3">
                        <MessageCircle className="h-5 w-5 text-secondary" />
                      </div>
                      Satisfaction Check
                    </h4>
                    <p className="mt-2 text-muted-foreground pl-11">
                      Three days after pickup, customers receive an automated follow-up asking about their satisfaction level.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm border border-primary/10">
                    <h4 className="font-bold text-lg flex items-center">
                      <div className="bg-primary/10 p-1.5 rounded-full mr-3">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      Review Generation
                    </h4>
                    <p className="mt-2 text-muted-foreground pl-11">
                      Satisfied customers are invited to share their experience with a one-click posting to Google Reviews, enhancing our reputation.
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-medium text-green-800 mb-2">Business Impact:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                        <Sparkles className="h-4 w-4 text-green-600" />
                      </div>
                      <span>40% increase in online reviews</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                        <Sparkles className="h-4 w-4 text-green-600" />
                      </div>
                      <span>Faster issue resolution through early feedback</span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-green-100 p-1 mr-3 mt-0.5">
                        <Sparkles className="h-4 w-4 text-green-600" />
                      </div>
                      <span>Zero manual follow-up effort required</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-primary-900 text-white rounded-xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-repeat opacity-10" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px',
              }} />
              
              <div className="relative z-10 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Jay's Frames Reinvented</h2>
                <p className="text-lg mb-8 text-white/80">
                  Join us for our grand reopening and see how we've transformed the custom framing experience.
                  Faster service, expert AI assistance, and the same exceptional quality you've come to expect.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/custom-framing">
                      Start Your Project
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10" asChild>
                    <Link href="/contact">
                      Visit Our Studio
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Chatbot component */}
      <Chatbot />
    </div>
  );
}