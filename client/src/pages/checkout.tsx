import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Check, CreditCard, Lock, ShieldCheck, Truck } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { OrderItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    shippingNotes: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  if (cartItems.length === 0) {
    navigate("/products");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreditCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format credit card number with spaces every 4 digits
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    // Add spaces every 4 digits
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.slice(i, i + 4));
    }
    const formattedValue = parts.join(' ');
    setFormData({ ...formData, cardNumber: formattedValue });
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiry date as MM/YY
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setFormData({ ...formData, expiryDate: value });
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit CVV to 3 or 4 digits
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setFormData({ ...formData, cvv: value });
  };

  const validateForm = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'
    ];

    for (const field of requiredFields) {
      if (formData[field as keyof typeof formData].trim() === '') {
        toast({
          title: "Missing information",
          description: `Please fill in all required fields`,
          variant: "destructive"
        });
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    // Validate payment fields if credit card is selected
    if (paymentMethod === "credit-card") {
      if (
        formData.cardNumber.replace(/\s/g, '').length < 16 ||
        formData.cardName.trim() === '' ||
        formData.expiryDate.trim() === '' ||
        formData.cvv.trim() === ''
      ) {
        toast({
          title: "Payment information incomplete",
          description: "Please fill in all payment fields",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState({ code: "", percentage: 0, amount: 0 });
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);

  const validateDiscountCode = async () => {
    if (!discountCode.trim()) return;

    setIsValidatingDiscount(true);
    try {
      const response = await apiRequest("POST", "/api/validate-discount", {
        code: discountCode,
        orderTotal: getCartTotal()
      });

      if (response.ok) {
        const discountData = await response.json();
        const discountAmount = Math.round(getCartTotal() * (discountData.percentage / 100));
        setAppliedDiscount({
          code: discountCode,
          percentage: discountData.percentage,
          amount: discountAmount
        });
        toast({
          title: "Discount Applied!",
          description: `${discountData.percentage}% discount applied`,
        });
      } else {
        toast({
          title: "Invalid Discount Code",
          description: "Please check your discount code and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate discount code",
        variant: "destructive",
      });
    } finally {
      setIsValidatingDiscount(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount({ code: "", percentage: 0, amount: 0 });
    setDiscountCode("");
  };

  const calculateFinalTotal = () => {
    const subtotal = getCartTotal();
    const shipping = subtotal > 10000 ? 0 : 1500;
    const tax = Math.round(subtotal * 0.0825);
    const discount = appliedDiscount.amount;
    return subtotal + shipping + tax - discount;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Create order items from cart items
      const orderItems: OrderItem[] = cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        details: item.details || {}
      }));

      // Create the order
      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        totalAmount: calculateFinalTotal(),
        items: orderItems,
        notes: formData.shippingNotes || `Shipping Address: ${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
        couponCode: appliedDiscount.code,
        discount: appliedDiscount.amount
      };

      // Submit order to API
      const response = await apiRequest('POST', '/api/orders', orderData);

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // Simulate payment processing
      await simulatePaymentProcess();

      // Process bank deposit (in a real application, this would connect to a payment gateway)
      await simulateBankDeposit(order.id, calculateFinalTotal());

      // Send confirmation email (in a real application, this would connect to an email service)
      await sendOrderConfirmationEmail(order.id, formData.email);

      // Clear cart and redirect to confirmation
      clearCart();

      // Navigate to order confirmation page
      navigate(`/order-confirmation/${order.id}`);

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate payment processing delay
  const simulatePaymentProcess = () => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  };

  // Simulate bank deposit
  const simulateBankDeposit = async (orderId: number, amount: number) => {
    console.log(`Processing deposit for order #${orderId}: ${formatPrice(amount)}`);
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  // Send confirmation email
  const sendOrderConfirmationEmail = async (orderId: number, email: string) => {
    console.log(`Sending confirmation email for order #${orderId} to ${email}`);
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <Button 
        variant="ghost" 
        className="mb-8 flex items-center text-primary"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Button>

      <h1 className="text-3xl font-serif font-bold text-primary mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmitOrder}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Truck className="mr-2 h-5 w-5 text-secondary" />
                  Shipping Information
                </CardTitle>
                <CardDescription>
                  Enter your shipping details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name*</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address*</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City*</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State*</Label>
                    <Input 
                      id="state" 
                      name="state" 
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code*</Label>
                    <Input 
                      id="zipCode" 
                      name="zipCode" 
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country*</Label>
                  <Input 
                    id="country" 
                    name="country" 
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingNotes">Shipping Notes (Optional)</Label>
                  <Textarea
                    id="shippingNotes"
                    name="shippingNotes"
                    placeholder="Special delivery instructions, best times to deliver, etc."
                    value={formData.shippingNotes}
                    onChange={handleInputChange}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <CreditCard className="mr-2 h-5 w-5 text-secondary" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  All transactions are secure and encrypted
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs 
                  defaultValue="credit-card" 
                  className="w-full"
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
                    <TabsTrigger value="bank-transfer">Bank Transfer</TabsTrigger>
                  </TabsList>

                  <TabsContent value="credit-card" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number*</Label>
                      <Input 
                        id="cardNumber" 
                        name="cardNumber" 
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleCreditCardNumberChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card*</Label>
                      <Input 
                        id="cardName" 
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date*</Label>
                        <Input 
                          id="expiryDate" 
                          name="expiryDate" 
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleExpiryDateChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV*</Label>
                        <Input 
                          id="cvv" 
                          name="cvv" 
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleCVVChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center mt-2 p-3 bg-secondary/10 rounded-md text-sm">
                      <Lock className="h-4 w-4 mr-2 text-secondary" />
                      Your payment information is encrypted and secure
                    </div>
                  </TabsContent>

                  <TabsContent value="bank-transfer" className="space-y-4">
                    <div className="p-4 bg-secondary/10 rounded-md space-y-3">
                      <h3 className="font-medium text-primary">Bank Transfer Details</h3>
                      <p className="text-sm text-neutral-600">
                        Please use the following details to make a bank transfer:
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Bank Name:</span>
                          <span>First National Bank</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Account Name:</span>
                          <span>Jay's Frames Inc.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Account Number:</span>
                          <span>1234567890</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Routing Number:</span>
                          <span>087654321</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Reference:</span>
                          <span>Your Order ID (will be provided)</span>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 mt-3">
                        Once you complete your order, we will send you an email with payment instructions and your Order ID for reference.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full btn-secondary py-6 text-base"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>Processing Order...</>
              ) : (
                <>Complete Order</>
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                      {item.details && (
                        <p className="text-xs text-neutral-500 mt-1">
                          {item.details.width && item.details.height 
                            ? `${item.details.width}" × ${item.details.height}"`
                            : ''
                          }
                          {item.details.dimensions && ` ${item.details.dimensions}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="font-medium text-secondary">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}

              <Separator className="my-4" />

              {/* Discount Code Section */}
              <div className="space-y-3">
                <Label htmlFor="discount-code">Discount Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="discount-code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter discount code"
                    disabled={appliedDiscount.code !== ""}
                  />
                  {appliedDiscount.code ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={removeDiscount}
                      className="whitespace-nowrap"
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={validateDiscountCode}
                      disabled={!discountCode.trim() || isValidatingDiscount}
                      className="whitespace-nowrap"
                    >
                      {isValidatingDiscount ? "Validating..." : "Apply"}
                    </Button>
                  )}
                </div>
                {appliedDiscount.code && (
                  <div className="text-sm text-green-600 font-medium">
                    ✓ Discount "{appliedDiscount.code}" applied ({appliedDiscount.percentage}% off)
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping</span>
                  <span>{getCartTotal() > 10000 ? 'Free' : formatPrice(1500)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tax</span>
                  <span>{formatPrice(getCartTotal() * 0.0825)}</span>
                </div>
                {appliedDiscount.amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedDiscount.percentage}%)</span>
                    <span>-{formatPrice(appliedDiscount.amount)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(calculateFinalTotal())}
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex-col space-y-4">
              <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-md text-sm w-full">
                <ShieldCheck className="h-4 w-4 mr-2" />
                All custom frames include a 30-day satisfaction guarantee
              </div>

              <div className="w-full space-y-2">
                <div className="flex items-center text-sm font-medium">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Free shipping on orders over $100
                </div>
                <div className="flex items-center text-sm font-medium">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Secure payment processing
                </div>
                <div className="flex items-center text-sm font-medium">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  Dedicated customer support
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;