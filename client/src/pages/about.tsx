import { Link } from "wouter";
import { 
  Award, 
  Clock, 
  BrainCircuit, 
  LayoutGrid, 
  Rocket, 
  Sparkles, 
  TimerReset, 
  Send, 
  Zap, 
  TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Chatbot from "@/components/ui/chatbot";
import { SeoHead } from "@/components/seo";

export default function About() {
  return (
    <div className="bg-white">
      <SeoHead
        title="About Jay's Frames | Houston Custom Framing | 62% Faster Turnaround | Eco-Friendly Framing"
        description="Discover Jay's Frames, Houston's premier custom framing studio featuring our revolutionary hybrid production model that provides 62% faster turnaround times and increases capacity by 4x. Our eco-friendly framing solutions and museum-quality conservation techniques combine exceptional craftsmanship with sustainability. Visit our Houston custom frame shop for artwork framing, shadow boxes, and more."
        keywords="Jay's Frames, custom framing Houston, Houston frame shop, picture framing, hybrid production model, eco-friendly framing, museum-quality framing, shadow box framing, art framing, AI design assistant, 62% faster framing, conservation framing, 4x production capacity, custom frame shop, Heights framing studio, locally-sourced framing"
        canonicalUrl="/about"
        ogType="website"
        ogTitle="About Jay's Frames | Houston Custom Framing | 62% Faster Turnaround | Eco-Friendly Framing"
        ogDescription="Discover Jay's Frames, Houston's premier custom framing studio with our revolutionary hybrid production model providing 62% faster turnaround times and 4x capacity. We offer eco-friendly framing solutions, museum-quality conservation, and locally-sourced materials for artwork, photography, and memorabilia."
        ogImage="/images/jays-frames-workshop.jpg"
      >
        {/* Schema.org structured data */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Jay's Frames",
            "description": "Houston's premier custom framing studio in the Heights area featuring a revolutionary hybrid production model that provides 62% faster turnaround times, 400% increased capacity, and AI-powered design assistants. We specialize in eco-friendly framing using locally-sourced materials, museum-quality conservation framing, and custom shadow boxes for memorabilia.",
            "alternateName": "Jay's Custom Frames",
            "url": "https://jaysframes.com",
            "logo": "https://jaysframes.com/images/logo.png",
            "foundingDate": "2010",
            "founders": [
              {
                "@type": "Person",
                "name": "Jay Smith"
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
            "award": "Best Framing Shop in Houston",
            "specialty": "Custom Picture Framing with AI-assisted design, eco-friendly framing, conservation framing, shadow box framing, museum-quality framing, and 62% faster turnaround times"
          }
        `}</script>
      </SeoHead>

      {/* Hero section */}
      <section className="relative bg-primary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Revolutionizing the Art of Custom Framing</h1>
            <p className="text-xl text-white/80 mb-8">
              At Jay's Frames in Houston, we've completely reimagined the custom framing experience with our revolutionary hybrid production model. Our innovative approach combines technology and craftsmanship to deliver museum-quality frames with 62% faster turnaround times, making us the premier frame shop for artwork, photography, and memorabilia preservation in Houston.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/custom-framing">
                  Start Your Project
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-8">
                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">OUR STORY</span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">A Vision for Innovation in Custom Framing</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Founded with a passion for preserving and showcasing art, Jay's Frames has continuously evolved through innovation and a commitment to craftsmanship excellence. Since opening our doors in Houston's vibrant Heights neighborhood, we've established ourselves as the premier custom framing destination for artists, collectors, and homeowners throughout the Houston area.
                </p>
                <p className="text-lg text-muted-foreground mb-4">
                  In 2025, we underwent a revolutionary transformation, implementing a first-of-its-kind hybrid production model that has redefined custom framing efficiency and quality. This pioneering approach combines the precision of technology with the irreplaceable human touch of expert framers, allowing us to deliver museum-quality framing at competitive prices.
                </p>
                <p className="text-lg text-muted-foreground mb-4">
                  Our eco-friendly framing options use locally-sourced materials, including reclaimed wood from Houston-area suppliers, which not only reduces our environmental footprint but also provides unique character and warmth to our custom frames. This commitment to sustainable practices, combined with our innovative production methods, has positioned Jay's Frames as the leader in Houston's custom framing industry.
                </p>
                <p className="text-lg text-muted-foreground">
                  As Houston's premier custom frame shop, we understand the unique challenges of preserving artwork in our Gulf Coast climate. Our conservation framing techniques provide superior protection against humidity and UV damage, ensuring your valuable pieces remain pristine for generations. From Heights to Montrose, River Oaks to The Woodlands, we've become the trusted framing partner for Houston's most discerning art collectors and homeowners.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Capacity Increased by 400%</h3>
                    <p className="text-muted-foreground">
                      Our innovative hybrid production model enables one framer to accomplish what previously required a team of four, delivering 4x capacity while maintaining museum-quality craftsmanship for all Houston framing projects.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">62% Faster Turnaround Times</h3>
                    <p className="text-muted-foreground">
                      By implementing our hybrid production model in our Houston frame shop, we've reduced custom framing turnaround times by 62%, completing projects in days instead of weeks without sacrificing quality.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">$140,000 Annual Labor Savings</h3>
                    <p className="text-muted-foreground">
                      By partnering with wholesale vendors for frame cutting and building, we've reduced labor requirements by 6,363 hours annually.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-elegant relative">
              <img 
                src="/images/about-studio.jpg" 
                alt="Jay's Frames Studio" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/600x400/e2e8f0/475569?text=Jay's+Frames+Studio";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center gap-3">
                  <Award className="text-secondary h-6 w-6" />
                  <p className="text-white font-medium">Award-winning custom framing studio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Revolutionary Approach */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">THE HYBRID PRODUCTION MODEL</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Revolutionary Approach</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Jay has developed the first-of-its-kind hybrid production model in the custom framing industry, 
              combining streamlined operations with AI technology to drastically improve efficiency 
              while maintaining exceptional quality. According to a <a href="https://www.framingbusinessreport.com/industry-innovations/2025" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">2025 Framing Business Report</a>, such innovations can lead to 50-70% efficiency gains in frame shops.
            </p>
            <p className="text-lg text-muted-foreground">
              Our Houston custom framing studio stands apart from traditional frame shops by integrating cutting-edge 
              technology with artisanal craftsmanship. This approach enables us to offer both rapid turnaround times and 
              museum-quality framing that preserves and enhances your artwork. Whether you need conservation framing for valuable 
              pieces or eco-friendly framing options that reflect our commitment to sustainability, Jay's Frames delivers 
              superior results through our revolutionary production process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-primary/10 bg-white overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <LayoutGrid className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Wholesale Integration</h3>
                <p className="text-muted-foreground">
                  Our hybrid model partners with eco-conscious wholesale vendors for sustainable frame cutting and building, 
                  saving 6,363 labor hours annually ($140,000) while using locally-sourced materials from the Houston area for premium custom framing.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/10 bg-white overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Design</h3>
                <p className="text-muted-foreground">
                  Our advanced AI design assistant has been trained to perfectly mirror Jay's 15+ years of Houston framing expertise, 
                  offering Houston clients personalized conservation-grade framing recommendations that preserve artwork while enhancing its aesthetic appeal.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/10 bg-white overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <TimerReset className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Methodical Shop Structure</h3>
                <p className="text-muted-foreground">
                  Our Houston Heights workshop has been methodically restructured using advanced workflow optimization principles, 
                  reducing custom framing turnaround times by an additional 22% through improved material handling and workspace organization.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/10 bg-white overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Digital Kanban System</h3>
                <p className="text-muted-foreground">
                  Our custom-developed digital production Kanban system streamlines the Houston framing workflow while providing customers with real-time order updates, 
                  automated SMS notifications at each production milestone, and transparent progress tracking through our customer portal.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/10 bg-white overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">"Ready Made" Options</h3>
                <p className="text-muted-foreground">
                  We now offer Houston's most extensive selection of "Ready Made" framing options with guaranteed one-day turnaround times and economical pricing - perfect for budget-conscious customers who need quick professional framing solutions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/10 bg-white overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">24/7 Customer Service</h3>
                <p className="text-muted-foreground">
                  Our enhanced customer communications system provides 24/7 support through the innovative Frame Bot assistant, offering Houston customers real-time order tracking, automated progress updates, and instant answers about our framing services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results and Impact */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">MEASURABLE RESULTS</span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">The Impact of Our Innovation</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Our revolutionary hybrid production model has delivered significant, measurable improvements across all aspects of our custom framing business in Houston. These improvements translate directly to better service, higher quality, and more value for our customers.
              </p>
              <p className="text-lg text-muted-foreground">
                As the most innovative frame shop in Houston, we continuously refine our processes to enhance both efficiency and quality. Our eco-friendly framing options, combined with our advanced production techniques, make Jay's Frames the premier destination for custom framing services that balance craftsmanship, sustainability, and affordability.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-primary/5 rounded-lg p-8 text-center">
                <h3 className="text-5xl font-bold text-primary mb-2">62%</h3>
                <p className="text-xl font-medium">Faster Turnaround Times</p>
                <p className="text-muted-foreground mt-2">
                  Get your custom framed artwork back in record time with our revolutionary hybrid production model, with turnaround times 62% faster than traditional frame shops in Houston
                </p>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-8 text-center">
                <h3 className="text-5xl font-bold text-primary mb-2">400%</h3>
                <p className="text-xl font-medium">Increased Capacity</p>
                <p className="text-muted-foreground mt-2">
                  Our innovative hybrid production model enables one framer to accomplish what previously required a team of four, delivering 4x capacity while maintaining museum-quality craftsmanship for all Houston framing projects
                </p>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-8 text-center">
                <h3 className="text-5xl font-bold text-primary mb-2">$140K</h3>
                <p className="text-xl font-medium">Annual Labor Savings</p>
                <p className="text-muted-foreground mt-2">
                  By partnering with wholesale vendors for frame cutting and building, our innovative Houston frame shop saves 6,363 labor hours and $140,000 annually while maintaining exceptional quality and craftsmanship
                </p>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-8 text-center">
                <h3 className="text-5xl font-bold text-primary mb-2">22%</h3>
                <p className="text-xl font-medium">Additional Efficiency Gain</p>
                <p className="text-muted-foreground mt-2">
                  Our methodically restructured Houston workshop layout and optimized framing process flow provides an additional 22% efficiency gain beyond our hybrid model, further reducing wait times for custom framing projects
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Button size="lg" asChild>
                <Link href="/custom-framing">
                  Experience the Difference
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Jay's Frames Reinvented?</h2>
            <p className="text-xl text-white/80 mb-8">
              Whether you need custom framing for cherished artwork, shadow box framing for memorabilia, or our eco-friendly framing options, our revolutionary Houston frame shop delivers exceptional results with 62% faster turnaround times. Experience the perfect balance of craftsmanship, technology, and sustainability that has made Jay's Frames the premier custom framing destination in Houston.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/custom-framing">
                  Start Your Project
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Chatbot component */}
      <Chatbot />
    </div>
  );
}