import { useCart } from "@/context/cart-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Minus, ShoppingCart, ArrowRight, Trash2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  console.log('Cart component rendered with isOpen:', isOpen);
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleQuantityChange = (id: string, change: number, currentQuantity: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  // Default image for items without an image
  const defaultImage = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

  // Add safety check to prevent hook errors
  if (!isOpen) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l border-neutral-100 p-0">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 bg-primary text-white">
            <SheetHeader className="mb-0">
              <div className="flex justify-between items-center">
                <SheetTitle className="text-white flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Your Cart ({cartItems.length})
                </SheetTitle>
                <SheetClose className="text-white/80 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </SheetClose>
              </div>
            </SheetHeader>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <ShoppingCart className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-2 text-primary">Your cart is empty</h3>
                <p className="text-neutral-500 mb-6 max-w-xs">Looks like you haven't added any items to your cart yet.</p>
                <SheetClose asChild>
                  <Link href="/products">
                    <Button className="btn-secondary">
                      Browse Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-neutral-500">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral-500 hover:text-red-500 text-xs h-7 px-2"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Clear All
                  </Button>
                </div>

                <div className="space-y-5">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex rounded-lg overflow-hidden bg-white shadow-elegant hover:shadow-highlight transition-shadow">
                      <div className="w-24 h-24 bg-neutral-100 flex-shrink-0 overflow-hidden">
                        <img
                          src={item.imageUrl || defaultImage}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 flex-grow">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-primary line-clamp-1">{item.name}</h4>
                          <button 
                            className="text-neutral-400 hover:text-red-500 transition-colors"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {item.details && (
                          <p className="text-xs text-neutral-500 mt-1 mb-2">
                            {item.details.width && item.details.height 
                              ? `${item.details.width}" × ${item.details.height}"`
                              : ''
                            }
                            {item.details.dimensions && ` ${item.details.dimensions}`}
                            {item.details.glassType && ` with ${item.details.glassType}`}
                          </p>
                        )}
                        
                        <div className="flex justify-between items-center mt-auto">
                          <div className="flex items-center border border-neutral-200 rounded-md">
                            <button
                              className="px-2 py-1 text-neutral-500 hover:text-primary transition-colors"
                              onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              className="px-2 py-1 text-neutral-500 hover:text-primary transition-colors"
                              onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="font-bold text-secondary">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-neutral-100 p-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="text-neutral-500">Calculated at checkout</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary">{formatPrice(getCartTotal())}</span>
                </div>
              </div>

              <div className="space-y-3">
                <SheetClose asChild>
                  <Link href="/checkout">
                    <Button className="btn-secondary w-full py-3">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full border-neutral-200 text-primary hover:bg-primary hover:text-white py-3"
                  >
                    Continue Shopping
                  </Button>
                </SheetClose>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
