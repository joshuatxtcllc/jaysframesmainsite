import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2, Settings, TestTube } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ConnectionStatus {
  connected: boolean;
  message: string;
}

interface ExternalAPIStatus {
  kanban: ConnectionStatus;
  pos: ConnectionStatus;
}

const ExternalAPIConfig = () => {
  const { toast } = useToast();
  const [kanbanUrl, setKanbanUrl] = useState("");
  const [kanbanKey, setKanbanKey] = useState("");
  const [posUrl, setPosUrl] = useState("");
  const [posKey, setPosKey] = useState("");

  // Fetch current API status
  const { data: apiStatus, isLoading: statusLoading, refetch: refetchStatus } = useQuery<ExternalAPIStatus>({
    queryKey: ['/api/external/status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Update configuration mutation
  const updateConfigMutation = useMutation({
    mutationFn: async (config: any) => {
      const response = await fetch('/api/external/config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to update configuration');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuration Updated",
        description: "External API settings have been saved successfully.",
      });
      refetchStatus();
    },
    onError: (error: any) => {
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to update configuration",
        variant: "destructive",
      });
    },
  });

  // Test connections mutation
  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/external/status');
      if (!response.ok) throw new Error('Failed to test connections');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Connection Test Complete",
        description: "Check the status indicators below for results.",
      });
      refetchStatus();
    },
    onError: (error: any) => {
      toast({
        title: "Test Failed",
        description: error.message || "Failed to test connections",
        variant: "destructive",
      });
    },
  });

  const handleSaveConfig = () => {
    const config: any = {};
    
    if (kanbanUrl) config.kanbanApiUrl = kanbanUrl;
    if (kanbanKey) config.kanbanApiKey = kanbanKey;
    if (posUrl) config.posApiUrl = posUrl;
    if (posKey) config.posApiKey = posKey;

    updateConfigMutation.mutate(config);
  };

  const handleTestConnections = () => {
    testConnectionMutation.mutate();
  };

  const StatusIndicator = ({ status }: { status: ConnectionStatus }) => {
    if (status.connected) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Connected</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <XCircle className="h-4 w-4" />
          <span className="text-sm">Disconnected</span>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">External API Configuration</h1>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Connection Status
            <Button
              onClick={handleTestConnections}
              disabled={testConnectionMutation.isPending || statusLoading}
              variant="outline"
              size="sm"
            >
              {testConnectionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Test Connections
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {statusLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Checking connection status...</span>
            </div>
          ) : apiStatus ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Kanban App</h3>
                  <StatusIndicator status={apiStatus.kanban} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {apiStatus.kanban.message}
                </p>
                <Badge variant={apiStatus.kanban.connected ? "default" : "destructive"}>
                  Order Status Retrieval
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">POS System</h3>
                  <StatusIndicator status={apiStatus.pos} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {apiStatus.pos.message}
                </p>
                <Badge variant={apiStatus.pos.connected ? "default" : "destructive"}>
                  Order Push & Pricing
                </Badge>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Unable to load connection status</p>
          )}
        </CardContent>
      </Card>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure your external systems to enable real-time order status and POS integration.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Kanban Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Kanban App Settings</h3>
            <p className="text-sm text-muted-foreground">
              Connect to your Kanban app to retrieve real-time order status and production stages.
            </p>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="kanban-url">Kanban API URL</Label>
                <Input
                  id="kanban-url"
                  placeholder="https://your-kanban-app.com/api"
                  value={kanbanUrl}
                  onChange={(e) => setKanbanUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kanban-key">Kanban API Key</Label>
                <Input
                  id="kanban-key"
                  type="password"
                  placeholder="Your API key"
                  value={kanbanKey}
                  onChange={(e) => setKanbanKey(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* POS Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">POS System Settings</h3>
            <p className="text-sm text-muted-foreground">
              Connect to your POS system to automatically push orders for record keeping and pricing.
            </p>
            
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="pos-url">POS API URL</Label>
                <Input
                  id="pos-url"
                  placeholder="https://your-pos-system.com/api"
                  value={posUrl}
                  onChange={(e) => setPosUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pos-key">POS API Key</Label>
                <Input
                  id="pos-key"
                  type="password"
                  placeholder="Your API key"
                  value={posKey}
                  onChange={(e) => setPosKey(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSaveConfig}
              disabled={updateConfigMutation.isPending}
            >
              {updateConfigMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Kanban App Integration</h4>
            <p className="text-sm text-muted-foreground">
              Your Kanban app should have these endpoints:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li><code>GET /health</code> - Health check endpoint</li>
              <li><code>GET /orders/{`{orderId}`}</code> - Get order status by ID</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">POS System Integration</h4>
            <p className="text-sm text-muted-foreground">
              Your POS system should have these endpoints:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li><code>GET /health</code> - Health check endpoint</li>
              <li><code>POST /orders</code> - Receive new orders from the website</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900">How It Works</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
              <li>When customers place orders, they're automatically sent to your POS system</li>
              <li>When customers check order status, real-time data comes from your Kanban app</li>
              <li>If external systems are offline, the website continues working with local data</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExternalAPIConfig;