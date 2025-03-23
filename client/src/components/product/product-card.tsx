import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      details: product.details
    });
  };

  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl">
      {product.imageUrl && (
        <div className="w-full h-64 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-6">
        <h3 className="text-xl font-heading font-bold mb-2 text-primary">{product.name}</h3>
        <p className="text-neutral-500 mb-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-lg">{formatPrice(product.price)}</span>
          {product.category === "frame" ? (
            <Link href="/custom-framing">
              <Button className="bg-secondary hover:bg-secondary-light text-white">
                Start Designing
              </Button>
            </Link>
          ) : (
            <Button 
              className="bg-secondary hover:bg-secondary-light text-white"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
