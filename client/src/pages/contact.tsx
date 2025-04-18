import { useState } from "react";
import { Helmet } from "react-helmet";
import { Phone, Mail, MapPin, MessageSquare, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Chatbot from "@/components/ui/chatbot";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll respond within 24 hours.",
      });
      form.reset();
    }, 1500);
  }

  return (
    <div className="bg-white">
      <Helmet>
        <title>Contact Jay's Frames | Custom Framing Studio in Houston, TX</title>
        <meta name="description" content="Contact Jay's Frames for custom framing services, inquiries, or to discuss your framing project. With our revolutionary hybrid production model and AI-powered design assistants, we provide 62% faster turnarounds and exceptional service." />
        <meta name="keywords" content="contact Jay's Frames, custom framing Houston, frame shop contact, framing consultation, Houston frame studio, framing turnaround time, AI framing design" />
        <link rel="canonical" href="https://jaysframes.com/contact" />
        
        {/* Schema.org LocalBusiness structured data */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Jay's Frames",
            "description": "Houston's premier custom framing studio featuring a revolutionary hybrid production model that provides 62% faster turnaround times and AI-powered design assistants.",
            "url": "https://jaysframes.com",
            "telephone": "+18328933794",
            "email": "info@jaysframes.com",
            "logo": "https://jaysframes.com/images/logo.png",
            "image": "https://jaysframes.com/images/storefront.jpg",
            "currenciesAccepted": "USD",
            "paymentAccepted": "Cash, Credit Card",
            "priceRange": "$$",
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
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "10:00",
                "closes": "18:00"
              }
            ],
            "sameAs": [
              "https://facebook.com/jaysframes",
              "https://instagram.com/jaysframes",
              "https://twitter.com/jaysframes"
            ]
          }
        `}</script>
      </Helmet>

      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            We're here to help with your framing needs. Our 24/7 customer service assistance ensures you always have access to the support you need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact information */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="overflow-hidden border-primary/10">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-primary mb-6">Get In Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-base">Phone</h3>
                      <a href="tel:+18328933794" className="text-muted-foreground hover:text-primary transition-colors">(832) 893-3794</a>
                      <p className="text-sm text-muted-foreground mt-1">Call us directly for immediate assistance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-base">Email</h3>
                      <a href="mailto:info@jaysframes.com" className="text-muted-foreground hover:text-primary transition-colors">info@jaysframes.com</a>
                      <p className="text-sm text-muted-foreground mt-1">We typically respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-base">Location</h3>
                      <a href="https://maps.google.com/?q=1440+Yale+St,+Houston,+TX+77008" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-primary transition-colors">
                        1440 Yale St.<br/>
                        Houston, TX 77008
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">Visit our newly redesigned shop</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-base">Hours</h3>
                      <p className="text-muted-foreground">Monday - Saturday: 10am - 6pm</p>
                      <p className="text-muted-foreground">Sunday: Closed</p>
                      <p className="text-sm text-muted-foreground mt-1">Customer service available 24/7 via chat</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-base">Chat Support</h3>
                      <p className="text-muted-foreground">24/7 Frame Bot Assistant</p>
                      <p className="text-sm text-muted-foreground mt-1">Our AI-powered Frame Bot is available anytime to answer questions and check order status</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact form */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-primary/10">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-primary mb-6">Send Us a Message</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your framing project or question..." 
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Sending Message...</>
                      ) : (
                        <>
                          Send Message <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Map section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <Card className="overflow-hidden border-primary/10">
            <div className="h-2 bg-primary"></div>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-primary mb-6">Visit Our Location</h2>
              <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3462.4862416112985!2d-95.40095842426697!3d29.79041457471424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c70c21347549%3A0x4a0e03f129303b15!2s1440%20Yale%20St%2C%20Houston%2C%20TX%2077008!5e0!3m2!1sen!2sus!4v1713920392064!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Jay's Frames Location"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}