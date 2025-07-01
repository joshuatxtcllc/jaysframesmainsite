
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Lock, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { SeoHead } from "@/components/seo";
import { CartItem } from "@/types";
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';

// Initialize Stripe - Replace with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

interface CheckoutFormData {
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const items = cartItems;
  const total = getCartTotal();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: ""
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      setLocation("/");
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checking out.",
        variant: "destructive"
      });
    }
  }, [items, setLocation, toast]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (event: any) => {
    setCardError(event.error ? event.error.message : null);
    setCardComplete(event.complete);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      toast({
        title: "Payment system loading",
        description: "Please wait for the payment system to load and try again.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email || !formData.name || !formData.address) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!cardComplete) {
      toast({
        title: "Payment information required",
        description: "Please enter your complete credit card information.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent on the server
      const paymentIntentResponse = await apiRequest("POST", "/api/create-payment-intent", {
        amount: total,
        metadata: {
          items: JSON.stringify(items.map((item: CartItem) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))),
          customerEmail: formData.email,
          customerName: formData.name
        }
      });

      if (!paymentIntentResponse.ok) {
        const errorData = await paymentIntentResponse.json();
        throw new Error(errorData.message || "Failed to create payment intent");
      }

      const { clientSecret, paymentIntentId } = await paymentIntentResponse.json();

      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zipCode,
            },
          },
        },
      });

      if (error) {
        console.error('Payment confirmation error:', error);
        throw new Error(error.message || "Payment failed");
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Create order after successful payment
        const orderResponse = await apiRequest("POST", "/api/orders", {
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          items: items.map((item: CartItem) => ({
            productId: item.productId || 1,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            details: item.details
          })),
          totalAmount: total,
          status: "paid",
          shippingAddress: {
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          },
          notes: `Payment processed via Stripe. Payment Intent: ${paymentIntentId}`
        });

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          throw new Error(errorData.message || "Failed to create order");
        }

        const order = await orderResponse.json();

        // Clear cart and redirect to success
        clearCart();
        
        toast({
          title: "Payment successful!",
          description: `Order #${order.id} has been created. You'll receive a confirmation email shortly.`,
        });

        // Redirect to order confirmation
        setLocation(`/order-confirmation/${order.id}`);
      } else {
        throw new Error("Payment was not completed successfully");
      }
      
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Payment failed",
        description: error.message || "Something went wrong during checkout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <SeoHead 
        title="Checkout - Jay's Frames"
        description="Complete your custom framing order with secure payment processing."
        keywords="checkout, payment, custom framing order, Jay's Frames"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/cart")}
          className="mb-6 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Checkout Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-medium mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-medium mb-4">Shipping Address</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="123 Main Street"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            placeholder="Houston"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            placeholder="TX"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          placeholder="77008"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Section */}
                  <div>
                    <h3 className="font-medium mb-4 flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Payment Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Credit Card Details</Label>
                        <div className="border border-neutral-300 rounded-md p-3 bg-white">
                          <CardElement
                            options={CARD_ELEMENT_OPTIONS}
                            onChange={handleCardChange}
                          />
                        </div>
                        {cardError && (
                          <div className="flex items-center space-x-2 mt-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <p className="text-sm text-red-600">{cardError}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-3">
                          <Lock className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-neutral-600">
                            Your payment information is secured with industry-standard encryption.
                          </span>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90 text-white"
                          disabled={isProcessing || !cardComplete || !stripe}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing Payment...
                            </>
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              Complete Order - {formatPrice(total)}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-primary">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item: CartItem) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                        {item.details && (
                          <p className="text-xs text-neutral-500">
                            {item.details.width}" × {item.details.height}"
                          </p>
                        )}
                      </div>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Shipping</span>
                    <span className="text-sm">FREE</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
