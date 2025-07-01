
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, CheckCircle2, Globe, Database, Webhook, MessageSquare, Bell } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function IntegrationGuidePage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    if (id.includes('endpoint')) {
      setCopiedEndpoint(id);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } else {
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  return (
    <div className="container max-w-6xl py-10">
      <h1 className="text-3xl font-bold mb-2">Integration Guide</h1>
      <p className="text-muted-foreground mb-8">
        Learn how to integrate your application with Jay's Frames systems.
      </p>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="client">Integration Client</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="sync">Data Sync</TabsTrigger>
          <TabsTrigger value="websocket">WebSocket API</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-8">
            <Alert>
              <Globe className="h-5 w-5" />
              <AlertTitle>Integration Overview</AlertTitle>
              <AlertDescription>
                Jay's Frames offers several integration options to connect your application with our systems.
                These include notifications, data synchronization, and real-time communication via WebSockets.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-all">
                <CardHeader>
                  <Bell className="h-5 w-5 mb-2 text-blue-500" />
                  <CardTitle>Notification System</CardTitle>
                  <CardDescription>
                    Send and receive notifications across applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Our unified notification system allows your application to send and receive 
                    notifications for orders, updates, and user interactions.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader>
                  <Database className="h-5 w-5 mb-2 text-green-500" />
                  <CardTitle>Data Synchronization</CardTitle>
                  <CardDescription>
                    Keep your data in sync with Jay's Frames
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Synchronize product information, frame options, orders, and more between
                    your application and Jay's Frames.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader>
                  <MessageSquare className="h-5 w-5 mb-2 text-purple-500" />
                  <CardTitle>Real-time Communication</CardTitle>
                  <CardDescription>
                    WebSocket API for live updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Connect to our WebSocket server to receive real-time updates about
                    orders, inventory changes, and system events.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-bold mb-4">Getting Started</h2>
              <ol className="space-y-4 list-decimal pl-5">
                <li>
                  <strong>Register your application</strong> to receive an API key
                </li>
                <li>
                  <strong>Include our integration client</strong> in your application
                </li>
                <li>
                  <strong>Initialize the client</strong> with your API key and app ID
                </li>
                <li>
                  <strong>Start using the integration features</strong> like notifications and data sync
                </li>
              </ol>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="client">
          <div className="grid gap-8">
            <Alert className="bg-blue-50 border-blue-200">
              <Globe className="h-5 w-5 text-blue-500" />
              <AlertTitle className="text-blue-700">Integration Client</AlertTitle>
              <AlertDescription className="text-blue-600">
                The Integration Client is a JavaScript library that simplifies connecting your application
                with Jay's Frames systems for notifications and data synchronization.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle>Installation</CardTitle>
                <CardDescription>
                  Include the integration client in your HTML
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-md font-mono text-xs relative overflow-auto">
                    <pre>{`<script src="${window.location.origin}/js/integration-client.js"></script>`}</pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => copyToClipboard(`<script src="${window.location.origin}/js/integration-client.js"></script>`, 'script-tag')}
                    >
                      {copiedCode === 'script-tag' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <h3 className="font-semibold">Initialization</h3>
                  <div className="bg-slate-50 p-4 rounded-md font-mono text-xs relative overflow-auto">
                    <pre>{`<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the integration client
    window.jfIntegration.init({
      apiKey: 'YOUR_API_KEY',
      appId: 'your-app-id',
      baseUrl: '${window.location.origin}', // Optional, defaults to current origin
      enableRealtime: true // Optional, enables WebSocket connection
    });
    
    // Listen for notifications
    window.jfIntegration.on('notification', function(notification) {
      console.log('Received notification:', notification);
      // Handle notification here
    });
  });
</script>`}</pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => copyToClipboard(`<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the integration client
    window.jfIntegration.init({
      apiKey: 'YOUR_API_KEY',
      appId: 'your-app-id',
      baseUrl: '${window.location.origin}', // Optional, defaults to current origin
      enableRealtime: true // Optional, enables WebSocket connection
    });
    
    // Listen for notifications
    window.jfIntegration.on('notification', function(notification) {
      console.log('Received notification:', notification);
      // Handle notification here
    });
  });
</script>`, 'init-code')}
                    >
                      {copiedCode === 'init-code' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>
                  Available methods and event listeners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-slate-50 p-4 font-medium">
                      <span>init(config)</span>
                      <span className="text-sm text-muted-foreground">Initialize the integration client</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-slate-50 p-4 rounded-md mt-1 text-sm">
                      <p className="mb-2">Initializes the integration client with your API key and app ID.</p>
                      <h4 className="font-semibold mt-2">Parameters:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><code className="text-xs bg-slate-100 p-1 rounded">apiKey</code> - Your API key</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">appId</code> - Your application ID</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">baseUrl</code> - (Optional) Base URL for API requests</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">enableRealtime</code> - (Optional) Enable WebSocket connection</li>
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-slate-50 p-4 font-medium">
                      <span>on(event, callback)</span>
                      <span className="text-sm text-muted-foreground">Register event listener</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-slate-50 p-4 rounded-md mt-1 text-sm">
                      <p className="mb-2">Registers a callback function for a specific event.</p>
                      <h4 className="font-semibold mt-2">Events:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><code className="text-xs bg-slate-100 p-1 rounded">connected</code> - WebSocket connection established</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">disconnected</code> - WebSocket connection closed</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">notification</code> - New notification received</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">message</code> - Any WebSocket message received</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">error</code> - Error occurred</li>
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-slate-50 p-4 font-medium">
                      <span>syncData(resource, options)</span>
                      <span className="text-sm text-muted-foreground">Synchronize data</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-slate-50 p-4 rounded-md mt-1 text-sm">
                      <p className="mb-2">Synchronizes data from Jay's Frames to your application.</p>
                      <h4 className="font-semibold mt-2">Resources:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><code className="text-xs bg-slate-100 p-1 rounded">products</code> - Products data</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">orders</code> - Orders data</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">frame-options</code> - Frame options data</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">mat-options</code> - Mat options data</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">glass-options</code> - Glass options data</li>
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-slate-50 p-4 font-medium">
                      <span>sendNotification(title, description, type, options)</span>
                      <span className="text-sm text-muted-foreground">Send notification</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-slate-50 p-4 rounded-md mt-1 text-sm">
                      <p className="mb-2">Sends a notification to Jay's Frames notification system.</p>
                      <h4 className="font-semibold mt-2">Notification Types:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><code className="text-xs bg-slate-100 p-1 rounded">info</code> - Informational notification</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">success</code> - Success notification</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">warning</code> - Warning notification</li>
                        <li><code className="text-xs bg-slate-100 p-1 rounded">error</code> - Error notification</li>
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <div className="grid gap-8">
            <Alert className="bg-amber-50 border-amber-200">
              <Bell className="h-5 w-5 text-amber-500" />
              <AlertTitle className="text-amber-700">Notification System</AlertTitle>
              <AlertDescription className="text-amber-600">
                Send and receive notifications across applications with our unified
                notification system. Great for order updates, system alerts, and user interactions.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle>Sending Notifications</CardTitle>
                <CardDescription>
                  Send notifications from your application to Jay's Frames
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold mb-2">Using the Integration Client</h3>
                  <div className="bg-slate-50 p-4 rounded-md font-mono text-xs relative overflow-auto">
                    <pre>{`// Send a notification
window.jfIntegration.sendNotification(
  'New Order Received', 
  'A new order has been placed from your external app',
  'success', // notification type: info, success, warning, error
  {
    actionable: true,
    link: '/orders/123',
    sourceId: 'order-123'
  }
).then(result => {
  console.log('Notification sent:', result);
})
.catch(error => {
  console.error('Error sending notification:', error);
});`}</pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => copyToClipboard(`// Send a notification
window.jfIntegration.sendNotification(
  'New Order Received', 
  'A new order has been placed from your external app',
  'success', // notification type: info, success, warning, error
  {
    actionable: true,
    link: '/orders/123',
    sourceId: 'order-123'
  }
).then(result => {
  console.log('Notification sent:', result);
})
.catch(error => {
  console.error('Error sending notification:', error);
});`, 'send-notification')}
                    >
                      {copiedCode === 'send-notification' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <h3 className="font-semibold mb-2">Using the REST API Directly</h3>
                  <div className="bg-slate-50 p-4 rounded-md font-mono text-xs relative overflow-auto">
                    <pre>{`fetch('${window.location.origin}/api/notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    title: 'New Order Received',
    description: 'A new order has been placed from your external app',
    source: 'your-app-id',
    sourceId: 'order-123',
    type: 'success',
    actionable: true,
    link: '/orders/123',
    smsEnabled: false,
    smsRecipient: ''
  })
})
.then(response => response.json())
.then(data => console.log('Notification sent:', data))
.catch(error => console.error('Error sending notification:', error));`}</pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => copyToClipboard(`fetch('${window.location.origin}/api/notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    title: 'New Order Received',
    description: 'A new order has been placed from your external app',
    source: 'your-app-id',
    sourceId: 'order-123',
    type: 'success',
    actionable: true,
    link: '/orders/123',
    smsEnabled: false,
    smsRecipient: ''
  })
})
.then(response => response.json())
.then(data => console.log('Notification sent:', data))
.catch(error => console.error('Error sending notification:', error));`, 'send-api-notification')}
                    >
                      {copiedCode === 'send-api-notification' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Receiving Notifications</CardTitle>
                <CardDescription>
                  Listen for notifications from Jay's Frames
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold mb-2">Using the Integration Client</h3>
                  <div className="bg-slate-50 p-4 rounded-md font-mono text-xs relative overflow-auto">
                    <pre>{`// Listen for notifications
window.jfIntegration.on('notification', function(notification) {
  console.log('Received notification:', notification);
  
  // Example: Display the notification to the user
  if (notification.type === 'success') {
    showSuccessToast(notification.title, notification.description);
  } else if (notification.type === 'error') {
    showErrorToast(notification.title, notification.description);
  } else {
    showInfoToast(notification.title, notification.description);
  }
  
  // Example: Navigate to related content if actionable
  if (notification.actionable && notification.link) {
    // Add a button or link to navigate
    addActionButton(notification.title, notification.link);
  }
});`}</pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => copyToClipboard(`// Listen for notifications
window.jfIntegration.on('notification', function(notification) {
  console.log('Received notification:', notification);
  
  // Example: Display the notification to the user
  if (notification.type === 'success') {
    showSuccessToast(notification.title, notification.description);
  } else if (notification.type === 'error') {
    showErrorToast(notification.title, notification.description);
  } else {
    showInfoToast(notification.title, notification.description);
  }
  
  // Example: Navigate to related content if actionable
  if (notification.actionable && notification.link) {
    // Add a button or link to navigate
    addActionButton(notification.title, notification.link);
  }
});`, 'receive-notification')}
                    >
                      {copiedCode === 'receive-notification' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <h3 className="font-semibold mb-2">Using the WebSocket API Directly</h3>
                  <div className="bg-slate-50 p-4 rounded-md font-mono text-xs relative overflow-auto">
                    <pre>{`// Connect to the WebSocket server
const ws = new WebSocket('${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/ws');

ws.onopen = function() {
  console.log('WebSocket connection established');
  
  // Register your app with the WebSocket server
  ws.send(JSON.stringify({
    type: 'register',
    appId: 'your-app-id',
    apiKey: 'YOUR_API_KEY'
  }));
};

ws.onmessage = function(event) {
  try {
    const data = JSON.parse(event.data);
    
    // Handle notification events
    if (data.type === 'notification' || 
        (data.type === 'event' && data.event === 'new_notification')) {
      const notification = data.payload || data;
      console.log('Received notification:', notification);
      
      // Handle the notification...
    }
  } catch (err) {
    console.error('Error processing WebSocket message:', err);
  }
};

ws.onclose = function() {
  console.log('WebSocket connection closed');
  // Implement reconnection logic here
};

ws.onerror = function(error) {
  console.error('WebSocket error:', error);
};`}</pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => copyToClipboard(`// Connect to the WebSocket server
const ws = new WebSocket('${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/ws');

ws.onopen = function() {
  console.log('WebSocket connection established');
  
  // Register your app with the WebSocket server
  ws.send(JSON.stringify({
    type: 'register',
    appId: 'your-app-id',
    apiKey: 'YOUR_API_KEY'
  }));
};

ws.onmessage = function(event) {
  try {
    const data = JSON.parse(event.data);
    
    // Handle notification events
    if (data.type === 'notification' || 
        (data.type === 'event' && data.event === 'new_notification')) {
      const notification = data.payload || data;
      console.log('Received notification:', notification);
      
      // Handle the notification...
    }
  } catch (err) {
    console.error('Error processing WebSocket message:', err);
  }
};

ws.onclose = function() {
  console.log('WebSocket connection closed');
  // Implement reconnection logic here
};

ws.onerror = function(error) {
  console.error('WebSocket error:', error);
};`, 'receive-ws-notification')}
                    >
                      {copiedCode === 'receive-ws-notification' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sync">
          <div className="grid gap-8">
            <Alert className="bg-green-50 border-green-200">
              <Database className="h-5 w-5 text-green-500" />
              <AlertTitle className="text-green-700">Data Synchronization</AlertTitle>
              <AlertDescription className="text-green-600">
                Keep your application in sync with Jay's Frames data. Retrieve products, 
                orders, frame options, and more for use in your application.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle>Synchronizing Data</CardTitle>
                <CardDescription>
                  Retrieve data from Jay's Frames
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold mb-2">Using the Integration Client</h3>
                  <div className="bg-slate-50 p-4 rounded-md font-mono text-xs relative overflow-auto">
                    <pre>{`// Synchronize products data
window.jfIntegration.syncData('products', {
  since: '2023-01-01', // Optional: Only get products created/updated since this date
  limit: 100, // Optional: Limit the number of records
  format: 'json' // Optional: 'json' or 'csv'
})
.then(result => {
  if (result && result.success) {
    console.log('Products synchronized:', result.data);
    
    // Process the data in your application
    processProducts(result.data);
  } else {
    console.error('Failed to synchronize products');
  }
})
.catch(error => {
  console.error('Error synchronizing products:', error);
});`}</pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => copyToClipboard(`// Synchronize products data
window.jfIntegration.syncData('products', {
  since: '2023-01-01', // Optional: Only get products created/updated since this date
  limit: 100, // Optional: Limit the number of records
  format: 'json' // Optional: 'json' or 'csv'
})
.then(result => {
  if (result && result.success) {
    console.log('Products synchronized:', result.data);
    
    // Process the data in your application
    processProducts(result.data);
  } else {
    console.error('Failed to synchronize products');
  }
})
.catch(error => {
  console.error('Error synchronizing products:', error);
});`, 'sync-data')}
                    >
                      {copiedCode === 'sync-data' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <h3 className="font-semibold mb-2">Using the REST API Directly</h3>
                  <div className="bg-slate-50 p-4 rounded-md font-mono text-xs relative overflow-auto">
                    <pre>{`fetch('${window.location.origin}/api/integration/sync/frame-options?limit=50', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => {
  if (data && data.success) {
    console.log('Frame options synchronized:', data.data);
    
    // Process the data in your application
    processFrameOptions(data.data);
  } else {
    console.error('Failed to synchronize frame options');
  }
})
.catch(error => console.error('Error synchronizing frame options:', error));`}</pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => copyToClipboard(`fetch('${window.location.origin}/api/integration/sync/frame-options?limit=50', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => {
  if (data && data.success) {
    console.log('Frame options synchronized:', data.data);
    
    // Process the data in your application
    processFrameOptions(data.data);
  } else {
    console.error('Failed to synchronize frame options');
  }
})
.catch(error => console.error('Error synchronizing frame options:', error));`, 'api-sync-data')}
                    >
                      {copiedCode === 'api-sync-data' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Resources</CardTitle>
                <CardDescription>
                  Data resources available for synchronization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-50 p-3 rounded-md">
                    <h3 className="font-semibold">products</h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      Product catalog including ready-made frames, custom framing options, and accessories.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <h3 className="font-semibold">orders</h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      Customer orders including status, items, and delivery information.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <h3 className="font-semibold">frame-options</h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      Available frame styles, colors, materials, and sizes.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <h3 className="font-semibold">mat-options</h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      Available mat colors, materials, and sizes.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <h3 className="font-semibold">glass-options</h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      Available glass types, including UV protection and anti-glare options.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="websocket">
          <div className="grid gap-8">
            <Alert className="bg-purple-50 border-purple-200">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <AlertTitle className="text-purple-700">WebSocket API</AlertTitle>
              <AlertDescription className="text-purple-600">
                Connect to our WebSocket server for real-time updates. Get instant notifications
                about orders, inventory changes, and system events.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle>Connecting to the WebSocket Server</CardTitle>
                <CardDescription>
                  Establish a real-time connection with Jay's Frames
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold mb-2">Basic Connection</h3>
                  <div className="bg-slate-50 p-4 rounded-md font-mono text-xs relative overflow-auto">
                    <pre>{`// Connect to the WebSocket server
const ws = new WebSocket('${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/ws');

ws.onopen = function() {
  console.log('WebSocket connection established');
  
  // Register your app with the WebSocket server
  ws.send(JSON.stringify({
    type: 'register',
    appId: 'your-app-id',
    apiKey: 'YOUR_API_KEY'
  }));
};

ws.onmessage = function(event) {
  try {
    const data = JSON.parse(event.data);
    console.log('Received message:', data);
    
    // Handle different message types
    switch (data.type) {
      case 'connection_established':
        console.log('Connection confirmed by server');
        break;
      case 'notification':
        handleNotification(data.payload || data);
        break;
      case 'order_update':
        handleOrderUpdate(data.payload);
        break;
      case 'ping':
        // Send pong response to keep connection alive
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  } catch (err) {
    console.error('Error processing WebSocket message:', err);
  }
};

ws.onclose = function() {
  console.log('WebSocket connection closed');
  
  // Implement reconnection logic
  setTimeout(function() {
    console.log('Attempting to reconnect...');
    // Reconnect logic here
  }, 5000);
};

ws.onerror = function(error) {
  console.error('WebSocket error:', error);
};`}</pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => copyToClipboard(`// Connect to the WebSocket server
const ws = new WebSocket('${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/ws');

ws.onopen = function() {
  console.log('WebSocket connection established');
  
  // Register your app with the WebSocket server
  ws.send(JSON.stringify({
    type: 'register',
    appId: 'your-app-id',
    apiKey: 'YOUR_API_KEY'
  }));
};

ws.onmessage = function(event) {
  try {
    const data = JSON.parse(event.data);
    console.log('Received message:', data);
    
    // Handle different message types
    switch (data.type) {
      case 'connection_established':
        console.log('Connection confirmed by server');
        break;
      case 'notification':
        handleNotification(data.payload || data);
        break;
      case 'order_update':
        handleOrderUpdate(data.payload);
        break;
      case 'ping':
        // Send pong response to keep connection alive
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  } catch (err) {
    console.error('Error processing WebSocket message:', err);
  }
};

ws.onclose = function() {
  console.log('WebSocket connection closed');
  
  // Implement reconnection logic
  setTimeout(function() {
    console.log('Attempting to reconnect...');
    // Reconnect logic here
  }, 5000);
};

ws.onerror = function(error) {
  console.error('WebSocket error:', error);
};`, 'websocket-connection')}
                    >
                      {copiedCode === 'websocket-connection' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sending Messages</CardTitle>
                <CardDescription>
                  Send messages to the WebSocket server
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold mb-2">Message Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded-md">
                      <h4 className="font-semibold">register</h4>
                      <p className="text-muted-foreground text-xs mt-1">
                        Register your application with the WebSocket server.
                      </p>
                      <div className="mt-2 font-mono text-xs">
                        <pre>{`{
  "type": "register",
  "appId": "your-app-id",
  "apiKey": "YOUR_API_KEY"
}`}</pre>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <h4 className="font-semibold">ping</h4>
                      <p className="text-muted-foreground text-xs mt-1">
                        Keep the connection alive.
                      </p>
                      <div className="mt-2 font-mono text-xs">
                        <pre>{`{
  "type": "ping"
}`}</pre>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <h4 className="font-semibold">notification</h4>
                      <p className="text-muted-foreground text-xs mt-1">
                        Send a notification to Jay's Frames.
                      </p>
                      <div className="mt-2 font-mono text-xs">
                        <pre>{`{
  "type": "notification",
  "appId": "your-app-id",
  "title": "New Order",
  "description": "Order #123 received",
  "sourceId": "order-123",
  "notificationType": "success"
}`}</pre>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <h4 className="font-semibold">order_status</h4>
                      <p className="text-muted-foreground text-xs mt-1">
                        Request information about an order.
                      </p>
                      <div className="mt-2 font-mono text-xs">
                        <pre>{`{
  "type": "order_status",
  "orderNumber": "123"
}`}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="examples">
          <div className="grid gap-8">
            <Alert>
              <AlertTitle>Code Examples</AlertTitle>
              <AlertDescription>
                Here are some complete examples of integrating with Jay's Frames systems.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Status Tracker</CardTitle>
                <CardDescription>
                  Track order status in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-md font-mono text-xs relative overflow-auto">
                  <pre>{`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jay's Frames Order Tracker</title>
  <script src="${window.location.origin}/js/integration-client.js"></script>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .order { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    .status-badge { display: inline-block; padding: 5px 10px; border-radius: 3px; font-size: 12px; }
    .status-pending { background-color: #ffe082; color: #000; }
    .status-processing { background-color: #90caf9; color: #000; }
    .status-completed { background-color: #a5d6a7; color: #000; }
    .notification { padding: 10px; margin: 10px 0; border-radius: 3px; }
    .notification-info { background-color: #e3f2fd; }
    .notification-success { background-color: #e8f5e9; }
    .notification-warning { background-color: #fff8e1; }
    .notification-error { background-color: #ffebee; }
  </style>
</head>
<body>
  <h1>Jay's Frames Order Tracker</h1>
  
  <div id="order-search">
    <h2>Track Your Order</h2>
    <div>
      <input type="text" id="order-number" placeholder="Enter your order number">
      <button id="search-button">Track</button>
    </div>
  </div>
  
  <div id="order-details" style="display: none;">
    <h2>Order <span id="order-id"></span></h2>
    <div id="order-info"></div>
  </div>
  
  <div id="notification-area">
    <h2>Notifications</h2>
    <div id="notifications"></div>
  </div>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Initialize the integration client
      window.jfIntegration.init({
        apiKey: 'YOUR_API_KEY',
        appId: 'order-tracker-app',
        baseUrl: '${window.location.origin}',
        enableRealtime: true
      });
      
      // DOM elements
      const orderNumberInput = document.getElementById('order-number');
      const searchButton = document.getElementById('search-button');
      const orderDetails = document.getElementById('order-details');
      const orderId = document.getElementById('order-id');
      const orderInfo = document.getElementById('order-info');
      const notifications = document.getElementById('notifications');
      
      // Listen for notifications
      window.jfIntegration.on('notification', function(notification) {
        console.log('Received notification:', notification);
        
        // Add notification to the list
        const notificationElement = document.createElement('div');
        notificationElement.className = \`notification notification-\${notification.type || 'info'}\`;
        notificationElement.innerHTML = \`
          <h3>\${notification.title}</h3>
          <p>\${notification.description}</p>
          <small>\${new Date().toLocaleString()}</small>
        \`;
        
        // Add to the top of the list
        if (notifications.firstChild) {
          notifications.insertBefore(notificationElement, notifications.firstChild);
        } else {
          notifications.appendChild(notificationElement);
        }
        
        // If this is an order update notification and we're viewing that order,
        // refresh the order details
        if (notification.sourceId && notification.source === 'order-system') {
          const currentOrderId = orderId.textContent;
          if (currentOrderId === notification.sourceId) {
            fetchOrderDetails(notification.sourceId);
          }
        }
      });
      
      // Search for an order
      searchButton.addEventListener('click', function() {
        const orderNumber = orderNumberInput.value.trim();
        if (!orderNumber) {
          alert('Please enter an order number');
          return;
        }
        
        fetchOrderDetails(orderNumber);
      });
      
      // Fetch order details
      function fetchOrderDetails(orderNumber) {
        // Show loading indicator
        orderInfo.innerHTML = '<p>Loading order details...</p>';
        orderDetails.style.display = 'block';
        
        // Fetch order details from API
        fetch(\`${window.location.origin}/api/orders/\${orderNumber}\`, {
          headers: {
            'X-API-Key': 'YOUR_API_KEY'
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Order not found');
          }
          return response.json();
        })
        .then(order => {
          console.log('Order details:', order);
          
          // Update order ID
          orderId.textContent = order.id;
          
          // Render order details
          orderInfo.innerHTML = \`
            <div class="order">
              <div>
                <strong>Status:</strong> 
                <span class="status-badge status-\${order.status.toLowerCase()}">\${order.status}</span>
              </div>
              <div><strong>Customer:</strong> \${order.customerName}</div>
              <div><strong>Date:</strong> \${new Date(order.createdAt).toLocaleString()}</div>
              <div><strong>Total:</strong> $\${order.totalAmount?.toFixed(2) || '0.00'}</div>
              
              <h3>Items</h3>
              <ul>
                \${order.items.map(item => \`
                  <li>
                    \${item.name || 'Custom Frame'} - $\${item.price?.toFixed(2) || '0.00'}
                    \${item.details ? \`<br><small>\${item.details}</small>\` : ''}
                  </li>
                \`).join('')}
              </ul>
            </div>
          \`;
        })
        .catch(error => {
          console.error('Error fetching order:', error);
          orderInfo.innerHTML = \`<p class="error">Error: \${error.message}</p>\`;
        });
      }
      
      // Also listen for order status via WebSocket for real-time updates
      window.jfIntegration.on('connected', function() {
        console.log('WebSocket connected');
      });
    });
  </script>
</body>
</html>`}</pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={() => copyToClipboard(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jay's Frames Order Tracker</title>
  <script src="${window.location.origin}/js/integration-client.js"></script>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .order { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    .status-badge { display: inline-block; padding: 5px 10px; border-radius: 3px; font-size: 12px; }
    .status-pending { background-color: #ffe082; color: #000; }
    .status-processing { background-color: #90caf9; color: #000; }
    .status-completed { background-color: #a5d6a7; color: #000; }
    .notification { padding: 10px; margin: 10px 0; border-radius: 3px; }
    .notification-info { background-color: #e3f2fd; }
    .notification-success { background-color: #e8f5e9; }
    .notification-warning { background-color: #fff8e1; }
    .notification-error { background-color: #ffebee; }
  </style>
</head>
<body>
  <h1>Jay's Frames Order Tracker</h1>
  
  <div id="order-search">
    <h2>Track Your Order</h2>
    <div>
      <input type="text" id="order-number" placeholder="Enter your order number">
      <button id="search-button">Track</button>
    </div>
  </div>
  
  <div id="order-details" style="display: none;">
    <h2>Order <span id="order-id"></span></h2>
    <div id="order-info"></div>
  </div>
  
  <div id="notification-area">
    <h2>Notifications</h2>
    <div id="notifications"></div>
  </div>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Initialize the integration client
      window.jfIntegration.init({
        apiKey: 'YOUR_API_KEY',
        appId: 'order-tracker-app',
        baseUrl: '${window.location.origin}',
        enableRealtime: true
      });
      
      // DOM elements
      const orderNumberInput = document.getElementById('order-number');
      const searchButton = document.getElementById('search-button');
      const orderDetails = document.getElementById('order-details');
      const orderId = document.getElementById('order-id');
      const orderInfo = document.getElementById('order-info');
      const notifications = document.getElementById('notifications');
      
      // Listen for notifications
      window.jfIntegration.on('notification', function(notification) {
        console.log('Received notification:', notification);
        
        // Add notification to the list
        const notificationElement = document.createElement('div');
        notificationElement.className = \`notification notification-\${notification.type || 'info'}\`;
        notificationElement.innerHTML = \`
          <h3>\${notification.title}</h3>
          <p>\${notification.description}</p>
          <small>\${new Date().toLocaleString()}</small>
        \`;
        
        // Add to the top of the list
        if (notifications.firstChild) {
          notifications.insertBefore(notificationElement, notifications.firstChild);
        } else {
          notifications.appendChild(notificationElement);
        }
        
        // If this is an order update notification and we're viewing that order,
        // refresh the order details
        if (notification.sourceId && notification.source === 'order-system') {
          const currentOrderId = orderId.textContent;
          if (currentOrderId === notification.sourceId) {
            fetchOrderDetails(notification.sourceId);
          }
        }
      });
      
      // Search for an order
      searchButton.addEventListener('click', function() {
        const orderNumber = orderNumberInput.value.trim();
        if (!orderNumber) {
          alert('Please enter an order number');
          return;
        }
        
        fetchOrderDetails(orderNumber);
      });
      
      // Fetch order details
      function fetchOrderDetails(orderNumber) {
        // Show loading indicator
        orderInfo.innerHTML = '<p>Loading order details...</p>';
        orderDetails.style.display = 'block';
        
        // Fetch order details from API
        fetch(\`${window.location.origin}/api/orders/\${orderNumber}\`, {
          headers: {
            'X-API-Key': 'YOUR_API_KEY'
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Order not found');
          }
          return response.json();
        })
        .then(order => {
          console.log('Order details:', order);
          
          // Update order ID
          orderId.textContent = order.id;
          
          // Render order details
          orderInfo.innerHTML = \`
            <div class="order">
              <div>
                <strong>Status:</strong> 
                <span class="status-badge status-\${order.status.toLowerCase()}">\${order.status}</span>
              </div>
              <div><strong>Customer:</strong> \${order.customerName}</div>
              <div><strong>Date:</strong> \${new Date(order.createdAt).toLocaleString()}</div>
              <div><strong>Total:</strong> $\${order.totalAmount?.toFixed(2) || '0.00'}</div>
              
              <h3>Items</h3>
              <ul>
                \${order.items.map(item => \`
                  <li>
                    \${item.name || 'Custom Frame'} - $\${item.price?.toFixed(2) || '0.00'}
                    \${item.details ? \`<br><small>\${item.details}</small>\` : ''}
                  </li>
                \`).join('')}
              </ul>
            </div>
          \`;
        })
        .catch(error => {
          console.error('Error fetching order:', error);
          orderInfo.innerHTML = \`<p class="error">Error: \${error.message}</p>\`;
        });
      }
      
      // Also listen for order status via WebSocket for real-time updates
      window.jfIntegration.on('connected', function() {
        console.log('WebSocket connected');
      });
    });
  </script>
</body>
</html>`, 'order-tracker-example')}
                  >
                    {copiedCode === 'order-tracker-example' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
