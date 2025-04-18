import { Helmet } from "react-helmet";
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

export default function About() {
  return (
    <div className="bg-white">
      <Helmet>
        <title>About Jay's Frames | Revolutionary Hybrid Production Model | AI-Powered Design</title>
        <meta name="description" content="Learn about Jay's Frames' revolutionary hybrid production model that has cut labor by 6,363 hours annually ($140,000), providing 62% faster turnaround times and 400% increased capacity. Our AI-powered design assistants learn Jay's precise framing style to deliver exceptional results." />
        <meta name="keywords" content="Jay's Frames, custom framing Houston, hybrid production model, AI design assistant, 62% faster framing, 4x production capacity, custom frame shop, streamlined framing process, reduced framing costs" />
        <link rel="canonical" href="https://jaysframes.com/about" />
        
        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About Jay's Frames | Revolutionary Hybrid Production Model | AI-Powered Design" />
        <meta property="og:description" content="Learn about Jay's Frames' revolutionary hybrid production model that has cut labor by 1,920 hours annually, providing 42% faster turnaround times." />
        <meta property="og:url" content="https://jaysframes.com/about" />
        <meta property="og:image" content="/images/jays-frames-workshop.jpg" />
        <meta property="og:site_name" content="Jay's Frames" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Jay's Frames",
            "description": "Houston's premier custom framing studio featuring a revolutionary hybrid production model that provides 42% faster turnaround times and AI-powered design assistants.",
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
            "specialty": "Custom Picture Framing with AI-assisted design"
          }
        `}</script>
      </Helmet>

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
              At Jay's Frames, we've completely reimagined the custom framing experience with innovative technology and streamlined processes that deliver exceptional results and faster turnaround times.
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
                  Founded with a passion for preserving and showcasing art, Jay's Frames has continuously evolved through innovation and a commitment to craftsmanship excellence.
                </p>
                <p className="text-lg text-muted-foreground">
                  In 2025, we underwent a revolutionary transformation, implementing a first-of-its-kind hybrid production model that has redefined custom framing efficiency and quality. This pioneering approach combines the precision of technology with the irreplaceable human touch of expert framers.
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
                      Our hybrid production model has expanded our capacity by 4x (400%), allowing us to serve more customers without compromising quality.
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
                      By implementing our innovative hybrid model, we've reduced production times by 62%, getting your treasured items back to you faster.
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
            <p className="text-lg text-muted-foreground">
              Jay has developed the first-of-its-kind hybrid production model in the framing industry, 
              combining streamlined operations with AI technology to drastically improve efficiency 
              while maintaining exceptional quality. According to a <a href="https://www.framingbusinessreport.com/industry-innovations/2025" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">2025 Framing Business Report</a>, such innovations can lead to 50-70% efficiency gains.
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
                  Our hybrid model integrates with wholesale vendors for frame cutting and building, 
                  saving 6,363 labor hours annually ($140,000) while ensuring consistent quality.
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
                  Our machine learning assistant has been trained to mimic Jay's precise framing design style,
                  delivering consistent expert-level recommendations for every project.
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
                  Our workshop has been methodically restructured for maximum efficiency, 
                  reducing turnaround time for all orders by an additional 22%.
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
                  Our digital production organizing Kanban board provides real-time updates 
                  and automatic SMS notifications to customers as their order progresses.
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
                  We now offer an extensive selection of "Ready Made" framing options available 
                  for one-day turnaround at a lower price point for budget-conscious customers.
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
                  Our robust customer communications process includes 24/7 support through our 
                  Frame Bot, which provides real-time order status and answers to common questions.
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
              <p className="text-lg text-muted-foreground">
                Our revolutionary hybrid model has delivered significant, measurable improvements across all aspects of our business.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-primary/5 rounded-lg p-8 text-center">
                <h3 className="text-5xl font-bold text-primary mb-2">62%</h3>
                <p className="text-xl font-medium">Faster Turnaround Times</p>
                <p className="text-muted-foreground mt-2">
                  Get your framed artwork back in record time with our streamlined process
                </p>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-8 text-center">
                <h3 className="text-5xl font-bold text-primary mb-2">400%</h3>
                <p className="text-xl font-medium">Increased Capacity</p>
                <p className="text-muted-foreground mt-2">
                  One framer can now do what a team of 4 used to do without compromising quality
                </p>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-8 text-center">
                <h3 className="text-5xl font-bold text-primary mb-2">6,363</h3>
                <p className="text-xl font-medium">Hours Saved Annually</p>
                <p className="text-muted-foreground mt-2">
                  Our hybrid model eliminates inefficiencies, reducing labor by 6,363 hours per year
                </p>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-8 text-center">
                <h3 className="text-5xl font-bold text-primary mb-2">22%</h3>
                <p className="text-xl font-medium">Additional Efficiency Gain</p>
                <p className="text-muted-foreground mt-2">
                  Our methodically restructured shop provides even more time savings
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
              Whether you need custom framing, ready-made solutions, or expert advice, our revolutionary approach ensures exceptional results in record time.
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