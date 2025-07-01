import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import OrderStatusComponent from "@/components/order/order-status";
import { queryClient } from "@/lib/queryClient";
import Chatbot from "@/components/ui/chatbot";

const OrderStatusPage = () => {
  return (
    <div className="bg-neutral-100 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Track Your Order</h1>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Check the real-time status of your custom framing order at any time.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white rounded-lg shadow-md">
            <CardContent className="p-6 md:p-8">
              <OrderStatusComponent queryClient={queryClient} />
            </CardContent>
          </Card>
          
          <div className="mt-12 bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-xl font-heading font-bold text-primary mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg">How long does custom framing take?</h3>
                <p className="text-neutral-500 mt-1">
                  Our typical turnaround time is 7-10 business days, but this can vary depending on the complexity of your project and our current order volume. You can always check the status of your order here.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-lg">What are the different production stages?</h3>
                <p className="text-neutral-500 mt-1">
                  Your frame goes through several stages: order received, materials ordered, materials arrived, frame cutting, mat cutting, assembly, and finally, ready for pickup.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-lg">Will I be notified when my frame is ready?</h3>
                <p className="text-neutral-500 mt-1">
                  Yes! We'll send you an email when your frame is ready for pickup or when it ships. You can also check the status here anytime.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-lg">What if I have questions about my order?</h3>
                <p className="text-neutral-500 mt-1">
                  You can use our AI chat assistant for quick answers, or contact our customer service team at (503) 555-0123 or info@jaysframes.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default OrderStatusPage;
