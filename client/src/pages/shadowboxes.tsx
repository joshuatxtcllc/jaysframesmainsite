
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Star, Truck, Shield, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Chatbot from "@/components/ui/chatbot";
import { SEOHead } from "@/components/seo";

const Shadowboxes = () => {
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<{[key: string]: string}>({
    black: "8x10",
    white: "8x10", 
    natural: "8x10"
  });

  // Standard shadowbox sizes with pricing
  const sizes = [
    { size: "8x10", price: 4500, depth: "2" },
    { size: "11x14", price: 6500, depth: "2" },
    { size: "16x20", price: 9500, depth: "2" },
    { size: "18x24", price: 12500, depth: "2" },
    { size: "20x24", price: 14500, depth: "2" },
    { size: "24x30", price: 18500, depth: "2" }
  ];

  // Shadowbox products with color options
  const shadowboxes = [
    {
      id: "shadowbox-black",
      name: "Premium Black Shadowbox",
      color: "Black",
      colorHex: "#1a1a1a",
      description: "Elegant black shadowbox frame perfect for displaying memorabilia, medals, and collectibles with museum-quality preservation.",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "shadowbox-white", 
      name: "Classic White Shadowbox",
      color: "White",
      colorHex: "#ffffff",
      description: "Clean white shadowbox frame that complements any decor while showcasing your precious items with professional presentation.",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "shadowbox-natural",
      name: "Natural Tan Shadowbox", 
      color: "Natural Tan",
      colorHex: "#d2b48c",
      description: "Warm natural tan shadowbox frame offering a sophisticated, earthy tone perfect for vintage and rustic displays.",
      imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const handleAddToCart = (shadowbox: typeof shadowboxes[0]) => {
    const selectedSize = selectedSizes[shadowbox.color.toLowerCase().replace(' ', '')];
    const sizeData = sizes.find(s => s.size === selectedSize);
    
    if (!sizeData) return;

    addToCart({
      id: `${shadowbox.id}-${selectedSize}-${Date.now()}`,
      productId: shadowbox.id,
      name: `${shadowbox.name} (${selectedSize}")`,
      price: sizeData.price,
      quantity: 1,
      imageUrl: shadowbox.imageUrl,
      details: {
        color: shadowbox.color,
        size: selectedSize,
        depth: sizeData.depth,
        category: "shadowbox"
      }
    });
  };

  const getSizePrice = (colorKey: string) => {
    const selectedSize = selectedSizes[colorKey];
    const sizeData = sizes.find(s => s.size === selectedSize);
    return sizeData ? sizeData.price : sizes[0].price;
  };

  return (
    <>
      <SEOHead 
        title="Premium Shadowboxes - Custom Display Cases | Jay's Frames"
        description="Shop premium shadowboxes in black, white, and natural tan. Perfect for displaying memorabilia, medals, and collectibles with museum-quality preservation."
        keywords="shadowbox, display case, memorabilia frame, collectibles display, custom shadowbox, Houston framing"
        canonicalUrl="/shadowboxes"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                Premium Shadowboxes
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                Display your treasured memorabilia, medals, and collectibles with museum-quality preservation and professional presentation.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  UV Protection
                </div>
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                  <Truck className="h-4 w-4 mr-2" />
                  Free Local Delivery
                </div>
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                  <Star className="h-4 w-4 mr-2" />
                  Handcrafted Quality
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                Choose Your Perfect Shadowbox
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Available in three classic colors with multiple size options to fit your display needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {shadowboxes.map((shadowbox) => {
                const colorKey = shadowbox.color.toLowerCase().replace(' ', '');
                const currentPrice = getSizePrice(colorKey);
                
                return (
                  <Card key={shadowbox.id} className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
                        <img 
                          src={shadowbox.imageUrl}
                          alt={shadowbox.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <Badge 
                        className="absolute top-4 left-4 text-white border-0"
                        style={{ backgroundColor: shadowbox.colorHex === "#ffffff" ? "#333" : shadowbox.colorHex }}
                      >
                        {shadowbox.color}
                      </Badge>
                    </div>

                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-serif text-primary">
                        {shadowbox.name}
                      </CardTitle>
                      <p className="text-neutral-600 text-sm leading-relaxed">
                        {shadowbox.description}
                      </p>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Size Selection */}
                        <div>
                          <label className="text-sm font-medium text-neutral-700 mb-2 block">
                            Select Size (inches)
                          </label>
                          <Select 
                            value={selectedSizes[colorKey]} 
                            onValueChange={(value) => 
                              setSelectedSizes(prev => ({ ...prev, [colorKey]: value }))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {sizes.map((size) => (
                                <SelectItem key={size.size} value={size.size}>
                                  {size.size}" - {formatPrice(size.price)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Features */}
                        <div className="text-xs text-neutral-500 space-y-1">
                          <div className="flex justify-between">
                            <span>Depth:</span>
                            <span>2 inches</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Material:</span>
                            <span>Premium Wood</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Glass:</span>
                            <span>UV Protection</span>
                          </div>
                        </div>

                        {/* Price and Add to Cart */}
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-primary">
                              {formatPrice(currentPrice)}
                            </span>
                            <span className="text-xs text-neutral-500">
                              Size: {selectedSizes[colorKey]}"
                            </span>
                          </div>
                          
                          <Button 
                            className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 group"
                            onClick={() => handleAddToCart(shadowbox)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Features Section */}
            <div className="mt-16 bg-neutral-50 rounded-2xl p-8">
              <h3 className="text-2xl font-heading font-bold text-center text-primary mb-8">
                Why Choose Our Shadowboxes?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Shield className="h-8 w-8 text-secondary" />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">Museum Quality</h4>
                  <p className="text-sm text-neutral-600">UV-protective glass and acid-free materials ensure long-term preservation.</p>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Star className="h-8 w-8 text-secondary" />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">Handcrafted</h4>
                  <p className="text-sm text-neutral-600">Expert craftsmanship with attention to every detail and finish.</p>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Truck className="h-8 w-8 text-secondary" />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">Local Delivery</h4>
                  <p className="text-sm text-neutral-600">Free delivery within Houston area, nationwide shipping available.</p>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <ShoppingCart className="h-8 w-8 text-secondary" />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">Easy Ordering</h4>
                  <p className="text-sm text-neutral-600">Simple online ordering with expert consultation available.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Chatbot />
    </>
  );
};

export default Shadowboxes;
