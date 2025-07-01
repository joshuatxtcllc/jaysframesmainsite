import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderTimeline from "./order-timeline";
import FrameProductionStages from "./frame-production-stages";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";

interface OrderStatusProps {
  queryClient: QueryClient;
}

const OrderStatus = ({ queryClient }: OrderStatusProps) => {
  const [orderNumber, setOrderNumber] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<string | null>(null);

  const { data: order, isLoading, error } = useQuery({
    queryKey: [`/api/orders/${searchedOrder}`],
    queryFn: async ({ queryKey }) => {
      console.log('Fetching order data from:', queryKey[0]);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await fetch(queryKey[0], {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        clearTimeout(timeoutId);
        console.log('Order fetch response status:', response.status);
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
          }
          
          console.error('Order fetch error:', errorData);
          
          if (response.status === 404) {
            throw new Error('Order not found');
          }
          throw new Error(errorData.message || `Failed to fetch order (${response.status})`);
        }
        
        const orderData = await response.json();
        console.log('Order data received:', {
          orderId: orderData.id,
          status: orderData.status,
          kanbanStatus: orderData.kanbanStatus?.status
        });
        
        return orderData;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error('Order fetch failed:', fetchError);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw fetchError;
      }
    },
    enabled: !!searchedOrder && searchedOrder.trim() !== '',
    staleTime: 30000, // 30 seconds
    retry: (failureCount, error) => {
      // Don't retry on 404 or timeout errors
      if (error.message.includes('Order not found') || error.message.includes('timed out')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000)
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedOrderNumber = orderNumber.trim();
    if (trimmedOrderNumber && trimmedOrderNumber !== searchedOrder) {
      console.log('Searching for order:', trimmedOrderNumber);
      setSearchedOrder(trimmedOrderNumber);
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
      
      {isLoading && searchedOrder && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          <p className="mt-2 text-neutral-500">Loading order #{searchedOrder}...</p>
          <p className="mt-1 text-sm text-neutral-400">This may take a few seconds</p>
        </div>
      )}
      
      {error && (
        <Card className="border-destructive mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-destructive mb-2">
              {error.message === 'Order not found' ? 'Order Not Found' : 'Error Loading Order'}
            </h3>
            <p className="text-neutral-500 mb-4">
              {error.message === 'Order not found' 
                ? "We couldn't find an order with that number. Please check your order number and try again."
                : "There was an error loading your order information. Please try again."}
            </p>
            {error.message !== 'Order not found' && (
              <div className="text-sm text-neutral-400">
                <p>Error details: {error.message}</p>
                <p className="mt-2">
                  If this problem persists, please contact support at (832) 893-3794 or email info@jaysframes.com
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {order && (
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-heading font-bold text-primary">Order #{order.id}</h3>
              {order.kanbanStatus && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </div>
              )}
              {order.kanbanError && (
                <div className="flex items-center gap-1 text-xs text-yellow-600">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Local Data</span>
                </div>
              )}
            </div>
            <Badge className={`${getStatusColor(order.kanbanStatus?.status || order.status)} text-white text-sm py-1 px-3`}>
              {formatStatus(order.kanbanStatus?.status || order.status)}
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
                    
                    {/* Real-time Kanban Status */}
                    {order.kanbanStatus && (
                      <div className="pt-2 border-t border-neutral-200 mt-2">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Production Status:</span>
                          <Badge className={`${getStatusColor(order.kanbanStatus.status)} text-white text-xs`}>
                            {formatStatus(order.kanbanStatus.stage)}
                          </Badge>
                        </div>
                        {order.kanbanStatus.estimatedCompletion && (
                          <div className="flex justify-between mt-1">
                            <span className="text-neutral-500">Estimated Completion:</span>
                            <span className="font-medium">{formatDate(order.kanbanStatus.estimatedCompletion)}</span>
                          </div>
                        )}
                        {order.kanbanStatus.notes && (
                          <div className="mt-2">
                            <span className="block text-neutral-500 text-sm">Production Notes:</span>
                            <span className="block text-sm">{order.kanbanStatus.notes}</span>
                          </div>
                        )}
                        <div className="flex justify-between mt-1">
                          <span className="text-neutral-500 text-xs">Last Updated:</span>
                          <span className="text-xs">{formatDate(order.kanbanStatus.lastUpdated)}</span>
                        </div>
                      </div>
                    )}
                    
                    {order.notes && (
                      <div className="pt-2 border-t border-neutral-200 mt-2">
                        <span className="block text-neutral-500">Order Notes:</span>
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
              <OrderTimeline 
                currentStage={order.kanbanStatus?.stage || order.currentStage} 
                estimatedCompletion={order.kanbanStatus?.estimatedCompletion || order.estimatedCompletionDate}
                stageStartedAt={order.stageStartedAt}
                notes={order.kanbanStatus?.notes ? [order.kanbanStatus.notes] : (order.notes ? [order.notes] : [])}
                isDelayed={order.kanbanStatus?.status === "delayed" || order.status === "delayed"}
              />
              
              {/* Show detailed production stages for custom framing orders */}
              {order.items && order.items.some(item => 
                item.details && 
                (item.details.width || item.details.frameId || item.details.matId)
              ) && (
                <FrameProductionStages 
                  currentStage={order.currentStage}
                  frameDetails={{
                    // Get details from the first framing item
                    frameType: order.items.find(item => item.details?.frameId)?.name,
                    dimensions: order.items.find(item => item.details?.width)?.details?.width && 
                               order.items.find(item => item.details?.height)?.details?.height 
                      ? `${order.items.find(item => item.details?.width)?.details?.width}" × ${order.items.find(item => item.details?.height)?.details?.height}"`
                      : undefined,
                    matColor: order.items.find(item => item.details?.matColor)?.details?.matColor,
                    glassType: order.items.find(item => item.details?.glassType)?.details?.glassType
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
