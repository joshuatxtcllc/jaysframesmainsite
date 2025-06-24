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
import { CreditCard, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { SeoHead } from "@/components/seo";
import { CartItem } from "@/types";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with your publishable key
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) : null;

interface CheckoutFormData {
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

// Card Element styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      backgroundColor: 'white',
      padding: '12px',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

// Payment form component with Stripe Elements
function PaymentForm({ 
  formData, 
  onFormDataChange, 
  onPaymentSuccess 
}: {
  formData: CheckoutFormData;
  onFormDataChange: (field: keyof CheckoutFormData, value: string) => void;
  onPaymentSuccess: (paymentIntent: any) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, getCartTotal } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");

  const total = getCartTotal();

  // Create payment intent when component mounts
  useEffect(() => {
    if (total > 0) {
      createPaymentIntent();
    }
  }, [total]);

  const createPaymentIntent = async () => {
    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: total,
        metadata: {
          items: JSON.stringify(cartItems.map((item: CartItem) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))),
          customerEmail: formData.email,
          customerName: formData.name
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create payment intent");
      }

      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast({
        title: "Payment setup failed",
        description: "Unable to initialize payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      toast({
        title: "Payment not ready",
        description: "Please wait for payment to initialize.",
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

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
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
        console.error("Payment failed:", error);
        toast({
          title: "Payment failed",
          description: error.message || "Something went wrong during payment.",
          variant: "destructive"
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "Something went wrong during payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  return (
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
              onChange={(e) => onFormDataChange("email", e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormDataChange("name", e.target.value)}
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
              onChange={(e) => onFormDataChange("phone", e.target.value)}
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
              onChange={(e) => onFormDataChange("address", e.target.value)}
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
                onChange={(e) => onFormDataChange("city", e.target.value)}
                placeholder="Houston"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => onFormDataChange("state", e.target.value)}
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
              onChange={(e) => onFormDataChange("zipCode", e.target.value)}
              placeholder="77008"
              required
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Payment Information */}
      <div>
        <h3 className="font-medium mb-4 flex items-center">
          <CreditCard className="mr-2 h-4 w-4" />
          Payment Information
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="card-element">Credit Card *</Label>
            <div className="border rounded-md p-3 bg-white">
              <CardElement 
                id="card-element"
                options={cardElementOptions}
              />
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Your payment information is secured with industry-standard encryption.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-white"
        disabled={isProcessing || !stripe || !clientSecret}
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
    </form>
  );
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cartItems, getCartTotal, clearCart } = useCart();
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

  const items = cartItems;
  const total = getCartTotal();

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

  const handleFormDataChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Create order after successful payment
      const orderResponse = await apiRequest("POST", "/api/orders", {
        items: items.map((item: CartItem) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          details: item.details
        })),
        totalAmount: total,
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        customerInfo: {
          email: formData.email,
          phone: formData.phone
        },
        paymentIntentId: paymentIntent.id
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const order = await orderResponse.json();

      // Confirm payment on server
      await apiRequest("POST", "/api/confirm-payment", {
        paymentIntentId: paymentIntent.id,
        orderId: order.id
      });

      // Clear cart and show success
      clearCart();
      
      toast({
        title: "Payment successful!",
        description: `Order #${order.id} has been placed. You'll receive a confirmation email shortly.`,
      });

      // Redirect to order confirmation or home
      setLocation("/");
      
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast({
        title: "Order creation failed",
        description: "Payment was successful but order creation failed. Please contact support.",
        variant: "destructive"
      });
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Payment Unavailable</h2>
                <p className="text-neutral-600">Payment processing is currently unavailable. Please contact support.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
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
                  <PaymentForm 
                    formData={formData}
                    onFormDataChange={handleFormDataChange}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
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
    </Elements>
  );
}