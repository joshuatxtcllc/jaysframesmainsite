import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { 
  Package, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  
  // Authentication check - in a real app, this would check for admin privileges
  // For now, we'll just assume the user is an admin
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Fetch all orders
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["/api/orders"],
  });
  
  // Mutation for updating order status
  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status, stage }: { id: number, status: string, stage: string }) => {
      const res = await apiRequest("PATCH", `/api/orders/${id}/status`, { status, stage });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order updated",
        description: "The order status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "There was an error updating the order. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleStatusUpdate = (id: number, status: string, stage: string) => {
    updateOrderStatus.mutate({ id, status, stage });
  };
  
  // Filter orders by status
  const pendingOrders = orders.filter((order: any) => order.status === "pending");
  const inProgressOrders = orders.filter((order: any) => order.status === "in_progress");
  const completedOrders = orders.filter((order: any) => order.status === "completed");
  
  // Calculate some stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-100">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              You need admin privileges to access this dashboard.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" asChild>
              <a href="/">Return to Home</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="bg-neutral-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">Admin Dashboard</h1>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Total Orders</p>
                  <p className="text-3xl font-bold">{totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Pending Orders</p>
                  <p className="text-3xl font-bold">{pendingOrders.length}</p>
                </div>
                <Clock className="h-8 w-8 text-secondary opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Total Revenue</p>
                  <p className="text-3xl font-bold">{formatPrice(totalRevenue)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-accent opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Avg. Order Value</p>
                  <p className="text-3xl font-bold">{formatPrice(averageOrderValue)}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-success opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Orders tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <OrdersTable 
              orders={orders} 
              isLoading={isLoading} 
              onStatusUpdate={handleStatusUpdate} 
              isPending={updateOrderStatus.isPending}
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <OrdersTable 
              orders={pendingOrders} 
              isLoading={isLoading} 
              onStatusUpdate={handleStatusUpdate} 
              isPending={updateOrderStatus.isPending}
            />
          </TabsContent>
          
          <TabsContent value="in_progress">
            <OrdersTable 
              orders={inProgressOrders} 
              isLoading={isLoading} 
              onStatusUpdate={handleStatusUpdate} 
              isPending={updateOrderStatus.isPending}
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <OrdersTable 
              orders={completedOrders} 
              isLoading={isLoading} 
              onStatusUpdate={handleStatusUpdate} 
              isPending={updateOrderStatus.isPending}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface OrdersTableProps {
  orders: any[];
  isLoading: boolean;
  onStatusUpdate: (id: number, status: string, stage: string) => void;
  isPending: boolean;
}

const OrdersTable = ({ orders, isLoading, onStatusUpdate, isPending }: OrdersTableProps) => {
  const orderStages = [
    { value: "order_received", label: "Order Received" },
    { value: "materials_ordered", label: "Materials Ordered" },
    { value: "materials_arrived", label: "Materials Arrived" },
    { value: "frame_cutting", label: "Frame Cutting" },
    { value: "mat_cutting", label: "Mat Cutting" },
    { value: "assembly", label: "Assembly" },
    { value: "completed", label: "Ready for Pickup" },
    { value: "delayed", label: "Delayed" }
  ];
  
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
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-neutral-500">Loading orders...</p>
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-primary mb-2">No Orders Found</h2>
        <p className="text-neutral-500">There are no orders in this category.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Current Stage</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-neutral-50">
                <td className="px-4 py-4">#{order.id}</td>
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-neutral-500">{order.customerEmail}</p>
                  </div>
                </td>
                <td className="px-4 py-4">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-4 font-medium">{formatPrice(order.totalAmount)}</td>
                <td className="px-4 py-4">
                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                    {formatStatus(order.status)}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <Select 
                    defaultValue={order.currentStage}
                    onValueChange={(value) => onStatusUpdate(
                      order.id, 
                      value === "completed" ? "completed" : "in_progress",
                      value
                    )}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStages.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-4 text-right">
                  <Button variant="outline" size="sm" className="mr-2">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
