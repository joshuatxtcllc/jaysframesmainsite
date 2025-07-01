import { Card, CardContent } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";

const testimonials = [
  {
    id: 1,
    rating: 5,
    text: "The AI designer helped me choose the perfect frame for my wedding photos. The suggestions were spot on, and the finished product exceeded my expectations!",
    name: "Sarah Johnson",
    role: "Custom Frame Customer",
    image: "https://randomuser.me/api/portraits/women/42.jpg"
  },
  {
    id: 2,
    rating: 5,
    text: "As a professional photographer, I need consistent, high-quality framing for my exhibitions. Jay's Frames delivers every time, and their order tracking system keeps me informed throughout the process.",
    name: "Michael Torres",
    role: "Professional Photographer",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    rating: 5,
    text: "I needed a shadowbox for my son's military medals, and the Moonmount system Jay's uses is incredible. Their chat assistant helped me choose the right options, and the finished product is museum quality.",
    name: "Lisa Chen",
    role: "Shadowbox Customer",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const Testimonials = () => {
  return (
    <section className="relative py-20 bg-black text-white overflow-hidden">
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">What Our Customers Say</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Don't just take our word for it - hear from customers who have experienced our AI-powered framing service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm mb-4">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full overflow-hidden">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-primary">{testimonial.name}</p>
                    <p className="text-xs text-neutral-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;