import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";
import { Product } from "@/types";
import { ShoppingCart, ArrowRight, Heart, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Extract size options from product details
  const getSizeOptions = () => {
    if (product.category === "shadowbox" || product.category === "moonmount") {
      // For shadowboxes, get dimensions from details
      return product.details?.dimensions ? [product.details.dimensions] : [];
    } else if (product.category === "frame" && product.details?.sizes) {
      // For frames, get sizes array
      return product.details.sizes;
    }
    return [];
  };

  const sizeOptions = getSizeOptions();
  const hasSizeOptions = Array.isArray(sizeOptions) && sizeOptions.length > 0;

  // Auto-select the first size option if available
  useEffect(() => {
    if (hasSizeOptions && !selectedSize) {
      setSelectedSize(sizeOptions[0]);
    }
  }, [hasSizeOptions, selectedSize, sizeOptions]);

  const handleAddToCart = () => {
    // Include selected size in the details if applicable
    const details = { 
      ...product.details,
      ...(selectedSize && { selectedSize }) 
    };

    addToCart({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      details
    });
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Get displayable product name (removing size if it's in the name)
  const getDisplayName = () => {
    if (product.category === "shadowbox" || product.category === "moonmount") {
      // For products with size in the name, show the base name
      const nameParts = product.name.split("(");
      if (nameParts.length > 1) {
        return nameParts[0].trim();
      }
    }
    return product.name;
  };

  // Use a default image if none is provided
  const imageUrl = product.imageUrl || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

  return (
    <Card 
      className="bg-white rounded-xl overflow-hidden shadow-elegant hover-lift h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Category tag */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/80 backdrop-blur-sm text-primary text-xs font-medium py-1 px-3 rounded-full">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </div>
        </div>
        
        {/* Favorite button */}
        <button 
          onClick={toggleFavorite}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          aria-label="Add to favorites"
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-500'}`} 
          />
        </button>
        
        {/* Image with overlay and zoom effect - Using img tag with proper alt for SEO */}
        <div className="w-full h-72 overflow-hidden relative">
          {/* Hidden image with proper alt text for SEO */}
          <img 
            src={imageUrl} 
            alt={`${product.name} - ${product.category} by Jay's Frames`} 
            className="sr-only"
            loading="lazy"
          />
          {/* Visual display with zoom effect */}
          <div 
            className={`w-full h-full bg-cover bg-center transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            style={{ backgroundImage: `url(${imageUrl})` }}
            role="img"
            aria-label={`${product.name} - ${product.category} by Jay's Frames`}
          >
            <div className="w-full h-full bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-xl font-serif font-bold mb-3 text-primary">{getDisplayName()}</h3>
          <p className="text-neutral-600 mb-4 line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-xl text-primary">{formatPrice(product.price)}</span>
            {product.category !== "frame" && (
              <div className="flex items-center text-xs text-neutral-500">
                <span className="mr-1">In Stock</span>
                <div className="w-2 h-2 rounded-full bg-accent"></div>
              </div>
            )}
          </div>
          
          {hasSizeOptions && product.category !== "frame" && (
            <div className="mb-4">
              <Select 
                value={selectedSize || undefined} 
                onValueChange={setSelectedSize}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((size, index) => (
                    <SelectItem key={index} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {product.category === "frame" ? (
            <Link href="/custom-framing" className="block w-full">
              <Button className="btn-secondary w-full py-2.5 group">
                Start Designing
                <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          ) : (
            <Button 
              className="btn-secondary w-full py-2.5 group"
              onClick={handleAddToCart}
              disabled={hasSizeOptions && !selectedSize}
            >
              <ShoppingCart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
