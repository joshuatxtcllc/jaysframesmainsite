import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Package, Copy, ArrowRight, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types";

const OrderConfirmation = () => {
  const [, params] = useRoute('/order-confirmation/:orderId');
  const { toast } = useToast();
  const orderId = params?.orderId ? parseInt(params.orderId) : undefined;
  const [emailSent, setEmailSent] = useState(true);
  const [depositProcessed, setDepositProcessed] = useState(true);
  
  // Query order details
  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ['/api/orders', orderId],
    enabled: !!orderId
  });

  useEffect(() => {
    // Simulate async operations completion
    const timer1 = setTimeout(() => setEmailSent(true), 3000);
    const timer2 = setTimeout(() => setDepositProcessed(true), 5000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleCopyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId.toString());
      toast({
        title: "Order ID copied",
        description: "Order ID has been copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-neutral-200 max-w-md mx-auto rounded mb-4"></div>
          <div className="h-4 bg-neutral-200 max-w-sm mx-auto rounded mb-8"></div>
          <div className="h-32 bg-white border border-neutral-200 rounded-lg shadow-sm max-w-md mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Order Information Not Found</h1>
        <p className="text-neutral-600 mb-8">We couldn't find the order information you're looking for.</p>
        <Link href="/products">
          <Button className="btn-secondary">
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Order Confirmed!</h1>
        <p className="text-lg text-neutral-600">
          Thank you for your order. We've received your payment and are processing your order.
        </p>
      </div>
      
      <Card className="mb-8 overflow-hidden border-neutral-200">
        <div className="bg-primary/5 p-6 border-b border-neutral-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-bold text-primary flex items-center">
                <Package className="mr-2 h-5 w-5 text-secondary" />
                Order #{order.id}
              </h2>
              <p className="text-sm text-neutral-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center" 
              onClick={handleCopyOrderId}
            >
              <Copy className="mr-2 h-3.5 w-3.5" />
              Copy Order ID
            </Button>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Order Details</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-dashed border-neutral-200 last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-neutral-500">
                        Qty: {item.quantity}
                        {item.details && item.details.dimensions && ` • ${item.details.dimensions}`}
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between pt-3 border-t border-neutral-200">
              <span className="font-bold">Total</span>
              <span className="font-bold text-primary">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="border-neutral-200">
          <CardContent className="p-6">
            <h3 className="font-medium mb-3">Customer Information</h3>
            <p className="text-neutral-800 font-medium">{order.customerName}</p>
            <p className="text-neutral-600">{order.customerEmail}</p>
          </CardContent>
        </Card>
        
        <Card className="border-neutral-200">
          <CardContent className="p-6">
            <h3 className="font-medium mb-3">Shipping Information</h3>
            <p className="text-neutral-600">
              {order.notes || "Standard shipping • Estimated delivery in 5-7 business days"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8 border-neutral-200">
        <CardContent className="p-6">
          <h3 className="font-medium mb-3">Order Status</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Order Confirmed</p>
                <p className="text-sm text-neutral-500">Your order has been received and confirmed.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full ${emailSent ? 'bg-green-100' : 'bg-neutral-100'} flex items-center justify-center mr-3 flex-shrink-0`}>
                {emailSent ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-neutral-500" />
                )}
              </div>
              <div>
                <p className="font-medium">Confirmation Email Sent</p>
                <p className="text-sm text-neutral-500">
                  {emailSent 
                    ? `A confirmation email has been sent to ${order.customerEmail}.` 
                    : 'Your confirmation email is being prepared...'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full ${depositProcessed ? 'bg-green-100' : 'bg-neutral-100'} flex items-center justify-center mr-3 flex-shrink-0`}>
                {depositProcessed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-neutral-500" />
                )}
              </div>
              <div>
                <p className="font-medium">Payment Processed</p>
                <p className="text-sm text-neutral-500">
                  {depositProcessed 
                    ? 'Your payment has been processed successfully.' 
                    : 'Your payment is being processed...'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-3 flex-shrink-0">
                <Clock className="h-4 w-4 text-neutral-500" />
              </div>
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-sm text-neutral-500">Your order is now being processed by our team.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Link href="/products">
          <Button variant="outline" className="w-full md:w-auto">
            Continue Shopping
          </Button>
        </Link>
        <Link href={`/order-status?orderId=${order.id}`}>
          <Button className="btn-secondary w-full md:w-auto">
            Track Your Order
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;