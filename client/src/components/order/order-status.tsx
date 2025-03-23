import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderTimeline from "./order-timeline";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";

interface OrderStatusProps {
  queryClient: QueryClient;
}

const OrderStatus = ({ queryClient }: OrderStatusProps) => {
  const [orderNumber, setOrderNumber] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<string | null>(null);

  const { data: order, isLoading, error } = useQuery({
    queryKey: [searchedOrder ? `/api/orders/${searchedOrder}` : null],
    enabled: !!searchedOrder,
    staleTime: 30000 // 30 seconds
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber) {
      setSearchedOrder(orderNumber);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "in_progress":
        return "bg-accent";
      case "completed":
        return "bg-success";
      case "delayed":
        return "bg-destructive";
      default:
        return "bg-neutral-500";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="mb-6">
          <label className="block text-sm font-bold mb-2" htmlFor="order-number">Order Number</label>
          <div className="flex">
            <Input
              type="text"
              id="order-number"
              className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Enter your order number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
            <Button 
              type="submit" 
              className="bg-accent hover:bg-accent-light text-white font-bold py-2 px-6 rounded-r transition duration-300"
            >
              Track
            </Button>
          </div>
        </form>
      </div>
      
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          <p className="mt-2 text-neutral-500">Loading order information...</p>
        </div>
      )}
      
      {error && (
        <Card className="border-destructive mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-destructive mb-2">Order Not Found</h3>
            <p className="text-neutral-500">
              We couldn't find an order with that number. Please check your order number and try again.
            </p>
          </CardContent>
        </Card>
      )}
      
      {order && (
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-heading font-bold text-primary">Order #{order.id}</h3>
            <Badge className={`${getStatusColor(order.status)} text-white text-sm py-1 px-3`}>
              {formatStatus(order.status)}
            </Badge>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-bold mb-2">Order Information</h4>
              <Card className="border border-neutral-200">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Customer:</span>
                      <span className="font-medium">{order.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Email:</span>
                      <span className="font-medium">{order.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Order Date:</span>
                      <span className="font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Total Amount:</span>
                      <span className="font-medium">{formatPrice(order.totalAmount)}</span>
                    </div>
                    {order.notes && (
                      <div className="pt-2 border-t border-neutral-200 mt-2">
                        <span className="block text-neutral-500">Notes:</span>
                        <span className="block">{order.notes}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h4 className="font-bold mb-2">Ordered Items</h4>
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center p-4 border-b border-neutral-200 last:border-b-0">
                    <div className="w-16 h-16 bg-neutral-200 rounded flex-shrink-0 mr-4 overflow-hidden">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-bold">{item.name}</p>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Order Progress</h4>
              <OrderTimeline currentStage={order.currentStage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
