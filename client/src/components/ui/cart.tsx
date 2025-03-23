import { useCart } from "@/context/cart-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Minus } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const handleQuantityChange = (id: string, change: number, currentQuantity: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex justify-between items-center">
            <SheetTitle>Your Cart ({cartItems.length})</SheetTitle>
            <SheetClose className="text-neutral-500 hover:text-primary">
              <X className="h-6 w-6" />
            </SheetClose>
          </div>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-neutral-500 mb-4">Your cart is empty</p>
            <SheetClose asChild>
              <Button variant="default">Continue Shopping</Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex border-b border-neutral-200 pb-4">
                  <div className="w-20 h-20 bg-neutral-200 rounded flex-shrink-0 overflow-hidden">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="font-bold text-primary">{formatPrice(item.price)}</p>
                    </div>
                    
                    {item.details && (
                      <p className="text-sm text-neutral-500">
                        {item.details.width && item.details.height 
                          ? `${item.details.width}" × ${item.details.height}"`
                          : ''
                        }
                        {item.details.dimensions && ` ${item.details.dimensions}`}
                        {item.details.glassType && ` with ${item.details.glassType}`}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 p-0"
                          onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 p-0"
                          onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive text-sm h-7"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span className="font-bold">{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-secondary hover:bg-secondary-light">
                Proceed to Checkout
              </Button>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Continue Shopping
                </Button>
              </SheetClose>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
