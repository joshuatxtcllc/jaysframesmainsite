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
import { formatPrice, cn } from "@/lib/utils";
import { 
  Package, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Timer,
  RefreshCw,
  Settings,
  Box,
  TrendingUp,
  Truck,
  RotateCw,
  Play,
  Pause,
  Cog,
  Archive,
  Zap,
  ClipboardList,
  CalendarClock,
  ShieldCheck,
  Info,
  FileText
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  ResizablePanelGroup,
  ResizablePanel
} from "@/components/ui/resizable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from 'next/link';

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

  // Automation system status and controls
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(true);
  const [automationInterval, setAutomationInterval] = useState(30);
  const [automationBatchSize, setAutomationBatchSize] = useState(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedStats, setProcessedStats] = useState({
    lastRun: null as Date | null,
    processedCount: 0,
    successCount: 0,
    errorCount: 0,
    nextRunTime: null as Date | null
  });

  // Fetch automation status when page loads
  useEffect(() => {
    const fetchAutomationStatus = async () => {
      try {
        const response = await apiRequest("GET", "/api/automation/status");
        const data = await response.json();

        setIsAutomationEnabled(data.enabled || true);
        setAutomationInterval(data.intervalMinutes || 30);
        setAutomationBatchSize(data.batchSize || 20);

        if (data.lastRun) {
          setProcessedStats({
            lastRun: new Date(data.lastRun),
            processedCount: data.processedCount || 0,
            successCount: data.successCount || 0,
            errorCount: data.errorCount || 0,
            nextRunTime: data.nextRunTime ? new Date(data.nextRunTime) : null
          });
        }
      } catch (error) {
        console.error("Failed to fetch automation status:", error);
        // Set some defaults if the endpoint isn't implemented yet
        const nextRun = new Date();
        nextRun.setMinutes(nextRun.getMinutes() + 30);

        setProcessedStats(prev => ({
          ...prev,
          nextRunTime: nextRun
        }));
      }
    };

    fetchAutomationStatus();
  }, []);

  // Mutation for running auto-processing manually
  const runAutoProcessing = useMutation({
    mutationFn: async () => {
      setIsProcessing(true);
      const res = await apiRequest("POST", "/api/orders/auto-process", { 
        batchSize: automationBatchSize 
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setIsProcessing(false);

      // Update stats
      setProcessedStats({
        lastRun: new Date(),
        processedCount: data.processed || 0,
        successCount: data.succeeded || 0,
        errorCount: data.failed || 0,
        nextRunTime: processedStats.nextRunTime
      });

      toast({
        title: "Auto-processing complete",
        description: `Processed ${data.processed} orders successfully.`,
      });
    },
    onError: () => {
      setIsProcessing(false);
      toast({
        title: "Auto-processing failed",
        description: "There was an error running the automated processing.",
        variant: "destructive",
      });
    }
  });

  // Handle manual auto-processing
  const handleRunAutoProcessing = () => {
    runAutoProcessing.mutate();
  };

  // Mutation for updating automation settings
  const updateAutomationSettings = useMutation({
    mutationFn: async (settings: { 
      enabled: boolean, 
      intervalMinutes: number, 
      batchSize: number 
    }) => {
      const res = await apiRequest("POST", "/api/automation/settings", settings);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Settings updated",
        description: "Automation settings have been saved successfully.",
      });

      // Update next run time
      if (data.nextRunTime) {
        setProcessedStats(prev => ({
          ...prev,
          nextRunTime: new Date(data.nextRunTime)
        }));
      }
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "There was an error updating automation settings.",
        variant: "destructive",
      });
    }
  });

  // Handle settings update
  const handleSaveSettings = () => {
    updateAutomationSettings.mutate({
      enabled: isAutomationEnabled,
      intervalMinutes: automationInterval,
      batchSize: automationBatchSize
    });
  };

  // Format Next Run Time
  const formatNextRunTime = () => {
    if (!processedStats.nextRunTime) return "N/A";

    return processedStats.nextRunTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

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

        {/* Automation Control Panel */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Automation Control Center</CardTitle>
                <CardDescription>
                  Monitor and control the automated order processing system
                </CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                      isAutomationEnabled 
                        ? "bg-green-100 text-green-800" 
                        : "bg-neutral-100 text-neutral-600"
                    )}>
                      {isAutomationEnabled 
                        ? <><Zap className="w-3 h-3" /> Active</>
                        : <><Pause className="w-3 h-3" /> Paused</>
                      }
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isAutomationEnabled 
                      ? "Automated processing is enabled and running on schedule"
                      : "Automated processing is currently paused"
                    }
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Status */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-500 flex items-center gap-2">
                  <Info className="h-4 w-4" /> System Status
                </h3>

                <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Status</span>
                    <Badge variant={isAutomationEnabled ? "default" : "outline"}>
                      {isAutomationEnabled ? "Active" : "Paused"}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Next Run</span>
                    <span className="text-sm font-medium">{formatNextRunTime()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Run Interval</span>
                    <span className="text-sm font-medium">{automationInterval} minutes</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Batch Size</span>
                    <span className="text-sm font-medium">{automationBatchSize} orders</span>
                  </div>

                  {processedStats.lastRun && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Last Run</span>
                      <span className="text-sm font-medium">
                        {processedStats.lastRun.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-neutral-50 rounded-lg p-4">
                  <Button 
                    onClick={handleRunAutoProcessing}
                    disabled={isProcessing || !isAutomationEnabled}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Run Now
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Middle column - Configuration */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-500 flex items-center gap-2">
                  <Cog className="h-4 w-4" /> Configuration
                </h3>

                <div className="bg-neutral-50 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="automation-toggle">Enabled</Label>
                      <p className="text-xs text-neutral-500">
                        Toggle automatic order processing
                      </p>
                    </div>
                    <Switch
                      id="automation-toggle"
                      checked={isAutomationEnabled}
                      onCheckedChange={setIsAutomationEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interval">Interval (minutes)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="interval"
                        type="number"
                        min={5}
                        max={120}
                        value={automationInterval}
                        onChange={(e) => setAutomationInterval(parseInt(e.target.value) || 30)}
                        className="w-full"
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-neutral-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>How often orders will be automatically processed in minutes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batch-size">Batch Size</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="batch-size"
                        type="number"
                        min={1}
                        max={100}
                        value={automationBatchSize}
                        onChange={(e) => setAutomationBatchSize(parseInt(e.target.value) || 20)}
                        className="w-full"
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-neutral-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Maximum number of orders to process in a single run</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSaveSettings}
                    disabled={updateAutomationSettings.isPending}
                    className="w-full"
                    variant="outline"
                  >
                    {updateAutomationSettings.isPending ? (
                      <>
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Settings className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Right column - Statistics */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-500 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> Processing Statistics
                </h3>

                <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
                  <div className="text-center p-2 border border-neutral-200 rounded-md">
                    <div className="text-3xl font-bold text-primary">
                      {processedStats.processedCount}
                    </div>
                    <div className="text-xs text-neutral-500">
                      Orders Processed
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 border border-green-100 bg-green-50 rounded-md">
                      <div className="text-xl font-bold text-green-600">
                        {processedStats.successCount}
                      </div>
                      <div className="text-xs text-green-700">
                        Successful
                      </div>
                    </div>

                    <div className="text-center p-2 border border-red-100 bg-red-50 rounded-md">
                      <div className="text-xl font-bold text-red-600">
                        {processedStats.errorCount}
                      </div>
                      <div className="text-xs text-red-700">
                        Failed
                      </div>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="automations">
                      <AccordionTrigger className="text-sm py-2">
                        Active Automations
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm p-2 bg-green-50 border border-green-100 rounded">
                            <div className="flex items-center">
                              <Timer className="h-4 w-4 mr-2 text-green-600" />
                              <span>Order Processing</span>
                            </div>
                            <Badge variant="outline" className="text-green-600 bg-white">Active</Badge>
                          </div>

                          <div className="flex items-center justify-between text-sm p-2 bg-neutral-50 border border-neutral-200 rounded">
                            <div className="flex items-center">
                              <Archive className="h-4 w-4 mr-2 text-neutral-600" />
                              <span>Inventory Management</span>
                            </div>
                            <Badge variant="outline" className="text-neutral-600">Coming Soon</Badge>
                          </div>

                          <div className="flex items-center justify-between text-sm p-2 bg-neutral-50 border border-neutral-200 rounded">
                            <div className="flex items-center">
                              <CalendarClock className="h-4 w-4 mr-2 text-neutral-600" />
                              <span>Appointment Reminders</span>
                            </div>
                            <Badge variant="outline" className="text-neutral-600">Coming Soon</Badge>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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