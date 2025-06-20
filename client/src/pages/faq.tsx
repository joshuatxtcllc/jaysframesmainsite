
import { useState } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Package } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      title: "Pricing & Costs",
      icon: DollarSign,
      questions: [
        {
          question: "How much does custom framing cost in Houston?",
          answer: "Custom framing in Houston typically ranges from $150-$800 depending on size, materials, and complexity. At Jay's Frames, basic 8x10 frames start at $89, while museum-quality preservation framing for larger pieces (24x36) ranges from $450-$650. We provide free estimates and offer various price points to fit every budget."
        },
        {
          question: "What factors affect custom framing prices?",
          answer: "Several factors influence pricing: frame material (wood vs metal), mat options (single vs double mat), glass type (regular, UV-protective, or museum glass), artwork size, and special mounting requirements. Our Houston location offers competitive pricing with transparent, upfront estimates."
        },
        {
          question: "Do you offer payment plans for expensive framing projects?",
          answer: "Yes! For projects over $300, we offer flexible payment plans. Many Houston customers appreciate our 50% deposit option with the balance due upon completion."
        }
      ]
    },
    {
      title: "Timeline & Process",
      icon: Clock,
      questions: [
        {
          question: "How long does custom framing take?",
          answer: "Most custom framing projects at our Houston Heights location are completed within 7-14 business days. Rush orders (2-3 days) are available for an additional fee. Complex conservation projects may take 2-3 weeks."
        },
        {
          question: "What's the custom framing process at Jay's Frames?",
          answer: "Our process includes: 1) Free consultation and design 2) Material selection with samples 3) Professional measurement and cutting 4) Expert assembly and quality check 5) Convenient pickup or delivery in the Houston area."
        },
        {
          question: "Can I see my frame before final assembly?",
          answer: "Absolutely! We encourage customers to review frame and mat combinations before final assembly. Our Houston showroom displays hundreds of samples for hands-on comparison."
        }
      ]
    },
    {
      title: "Services & Specialties",
      icon: Package,
      questions: [
        {
          question: "What's the difference between preservation and regular framing?",
          answer: "Preservation (conservation) framing uses acid-free materials, UV-protective glass, and archival mounting techniques to prevent deterioration over decades. Regular framing focuses on aesthetic appeal. Given Houston's humidity, we recommend preservation framing for valuable artwork, documents, and family heirlooms."
        },
        {
          question: "Do you frame unusual items like jerseys, medals, or 3D objects?",
          answer: "Yes! Our shadow box specialists excel at framing sports memorabilia, military items, wedding dresses, baby clothes, and collectibles. We're Houston's go-to shop for creative dimensional framing projects."
        },
        {
          question: "Can you frame very large artwork or posters?",
          answer: "We handle pieces up to 48x60 inches in our Houston workshop. For oversized artwork, we offer sectional framing or can recommend specialized large-format services."
        }
      ]
    },
    {
      title: "Location & Convenience",
      icon: MapPin,
      questions: [
        {
          question: "Where is Jay's Frames located in Houston?",
          answer: "We're located at 218 W 27th St in Houston Heights (77008), easily accessible from Downtown, Montrose, and The Woodlands. Free parking available, with Metro Rail nearby."
        },
        {
          question: "Do you offer pickup and delivery in Houston?",
          answer: "Yes! We provide free pickup and delivery within 10 miles of our Heights location. This includes areas like River Oaks, Montrose, Galleria, and Memorial. Delivery scheduling available for your convenience."
        },
        {
          question: "What are your hours for consultations?",
          answer: "Monday-Friday: 10AM-6PM, Saturday: 11AM-5PM, Sunday: Closed. We also offer after-hours consultations by appointment for busy professionals in the Houston area."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Custom Framing FAQ - Houston Heights
          </h1>
          <p className="text-xl text-muted-foreground">
            Get answers to the most common questions about professional picture framing in Houston
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">7-14 Day Turnaround</h3>
              <p className="text-sm text-muted-foreground">Most projects completed quickly</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Starting at $89</h3>
              <p className="text-sm text-muted-foreground">Affordable custom framing options</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Houston Heights</h3>
              <p className="text-sm text-muted-foreground">Convenient Heights location</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Categories */}
        {faqCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <category.icon className="h-6 w-6 text-primary" />
                {category.title}
                <Badge variant="outline">{category.questions.length} questions</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`${categoryIndex}-${index}`}
                  >
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}

        {/* CTA */}
        <Card className="mt-12 bg-primary/5">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Our Houston framing experts are here to help with personalized advice
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+18328933794" 
                className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                Call (832) 893-3794
              </a>
              <a 
                href="/contact" 
                className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/10 transition-colors"
              >
                Schedule Consultation
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
