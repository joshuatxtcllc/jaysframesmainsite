import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet";
import { Code, Copy, CheckCircle2, Server, Webhook, Database, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ApiDocsPage = () => {
  const { toast } = useToast();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Check for admin session in localStorage
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      setIsAuthenticated(true);
    }
    
    // If authenticated, fetch API documentation data
    if (isAuthenticated) {
      fetch('/api/docs')
        .then(response => response.json())
        .then(data => {
          setApiData(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching API documentation:', error);
          setIsLoading(false);
        });
    }
  }, [isAuthenticated]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would make an API call to validate credentials
    // For demo purposes, we're using hardcoded admin credentials
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem('admin_session', 'true');
      toast({
        title: "Login successful",
        description: "Welcome to the API documentation",
      });
    } else {
      toast({
        title: "Authentication failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedEndpoint(endpoint);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    });
  };

  const codeSnippet = (method: string, endpoint: string, params?: any) => {
    const baseUrl = window.location.origin;
    let snippet = '';
    
    if (method === 'GET') {
      snippet = `fetch('${baseUrl}${endpoint}', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;
    } else {
      snippet = `fetch('${baseUrl}${endpoint}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify(${JSON.stringify(params || {}, null, 2)})
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;
    }
    
    return snippet;
  };

  // Logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_session');
    setApiData(null);
    toast({
      title: "Logged out",
      description: "You have been logged out of the API documentation",
    });
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="py-16 px-4 bg-gradient-to-r from-gray-50 to-white min-h-screen">
        <Helmet>
          <title>Admin Login | API Documentation</title>
          <meta name="description" content="Admin login for Jay's Frames API documentation" />
        </Helmet>
        
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Admin Access Required</CardTitle>
                <CardDescription>
                  Please enter your administrator credentials to access the API documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      type="text" 
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full" asChild>
                  <a href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return to Home
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 bg-gradient-to-r from-gray-50 to-white">
      <Helmet>
        <title>API Documentation | Jay's Frames</title>
        <meta name="description" content="API documentation for integrating with Jay's Frames services and features." />
      </Helmet>
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-4xl font-bold mb-3">Jay's Frames API Documentation</h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Integrate with our platform to access our frame recommendations, order management, and more.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            Logout <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <Tabs defaultValue="endpoints" className="mb-16">
          <div className="mb-6">
            <div className="flex justify-center mb-3">
              <TabsList>
                <TabsTrigger value="endpoints" className="flex items-center gap-2">
                  <Server className="h-4 w-4" /> API Endpoints
                </TabsTrigger>
                <TabsTrigger value="webhooks" className="flex items-center gap-2">
                  <Webhook className="h-4 w-4" /> Webhooks
                </TabsTrigger>
                <TabsTrigger value="sync" className="flex items-center gap-2">
                  <Database className="h-4 w-4" /> Data Sync
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 py-2 px-3 rounded-md">
              <Lock className="h-4 w-4" />
              <span>For admin use only. This documentation is restricted and requires authentication.</span>
            </div>
          </div>
          
          <TabsContent value="endpoints">
            <div className="grid gap-8">
              <Alert className="bg-blue-50 border-blue-200">
                <Server className="h-5 w-5 text-blue-500" />
                <AlertTitle className="text-blue-700">API Endpoint Documentation</AlertTitle>
                <AlertDescription className="text-blue-600">
                  Our REST API allows you to interact with Jay's Frames services programmatically. 
                  All API requests require an API key that you can request from our team.
                </AlertDescription>
              </Alert>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-4 text-gray-600">Loading API documentation...</p>
                </div>
              ) : apiData ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Base URL</CardTitle>
                      <CardDescription>
                        All API requests should be made to this base URL
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative bg-slate-50 rounded-md p-4 font-mono text-sm mb-4">
                        {apiData.baseUrl || window.location.origin + '/api'}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-2 h-8 w-8 rounded-full"
                          onClick={() => copyToClipboard(apiData.baseUrl || window.location.origin + '/api', 'baseUrl')}
                        >
                          {copiedEndpoint === 'baseUrl' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">Authentication</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {apiData.authentication || "API Key (add 'X-API-Key' header to requests)"}
                        </p>
                        <div className="bg-slate-50 p-4 rounded-md font-mono text-xs">
                          <pre>
                            {`
// Example request with authentication
fetch('${window.location.origin}/api/products', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  }
})`}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <h2 className="text-2xl font-bold mt-12 mb-6">Available Endpoints</h2>
                  
                  {apiData.endpoints ? (
                    <div className="grid gap-6">
                      {apiData.endpoints.map((endpoint: any, index: number) => (
                        <Card key={index}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                                    endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' : 
                                    endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                                    endpoint.method === 'PATCH' ? 'bg-yellow-100 text-yellow-700' :
                                    endpoint.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {endpoint.method}
                                  </span>
                                  <span>{endpoint.path}</span>
                                </CardTitle>
                                <CardDescription className="mt-2">
                                  {endpoint.description}
                                </CardDescription>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1"
                                onClick={() => copyToClipboard(codeSnippet(endpoint.method, endpoint.path), endpoint.path)}
                              >
                                {copiedEndpoint === endpoint.path ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {Object.keys(endpoint.parameters).length > 0 && (
                              <div className="mb-6">
                                <h3 className="font-semibold text-sm mb-2">Parameters</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  {Object.entries(endpoint.parameters).map(([name, type]: [string, any]) => (
                                    <div key={name} className="bg-slate-50 p-3 rounded-md">
                                      <span className="font-mono text-gray-700">{name}</span>
                                      <span className="text-xs text-gray-500 block">{type}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <h3 className="font-semibold text-sm mb-2">Example Request</h3>
                              <div className="bg-slate-50 p-4 rounded-md font-mono text-xs overflow-auto max-h-60">
                                <pre>{codeSnippet(endpoint.method, endpoint.path)}</pre>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No endpoint data available</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">Failed to load API documentation. Please try again later.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="webhooks">
            <div className="grid gap-8">
              <Alert className="bg-purple-50 border-purple-200">
                <Webhook className="h-5 w-5 text-purple-500" />
                <AlertTitle className="text-purple-700">Webhook Integration</AlertTitle>
                <AlertDescription className="text-purple-600">
                  Webhooks allow your application to receive real-time notifications about events in Jay's Frames.
                  Register a webhook URL to receive event data when something happens in our system.
                </AlertDescription>
              </Alert>
              
              <Card>
                <CardHeader>
                  <CardTitle>Webhook Registration</CardTitle>
                  <CardDescription>
                    Register a webhook to receive notifications for specific events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint</h3>
                      <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-md mb-4">
                        <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-700">POST</span>
                        <span className="font-mono text-sm">/api/integration/webhooks</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-auto h-8 w-8 rounded-full"
                          onClick={() => copyToClipboard('/api/integration/webhooks', 'webhook-register')}
                        >
                          {copiedEndpoint === 'webhook-register' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Request Parameters</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">url</span>
                          <span className="text-xs text-gray-500 block">The URL that will receive webhook events</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">events</span>
                          <span className="text-xs text-gray-500 block">Array of event types to subscribe to</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">description</span>
                          <span className="text-xs text-gray-500 block">Optional description for this webhook</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">apiKey</span>
                          <span className="text-xs text-gray-500 block">Your API key for authentication</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Available Events</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">order.created</span>
                          <span className="text-xs text-gray-500 block">Triggered when a new order is created</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">order.updated</span>
                          <span className="text-xs text-gray-500 block">Triggered when an order status changes</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">product.created</span>
                          <span className="text-xs text-gray-500 block">Triggered when a new product is added</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">product.updated</span>
                          <span className="text-xs text-gray-500 block">Triggered when a product is updated</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Example Request</h3>
                      <div className="bg-slate-50 p-4 rounded-md font-mono text-xs overflow-auto max-h-60">
                        <pre>{`fetch('${window.location.origin}/api/integration/webhooks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    url: 'https://your-app.com/webhooks/jaysframes',
    events: ['order.created', 'order.updated'],
    description: 'Order notification webhook for our integration'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}</pre>
                      </div>
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
                  The Data Sync API allows you to retrieve bulk data from Jay's Frames for 
                  synchronization with your own systems. You can filter by date and limit the results.
                </AlertDescription>
              </Alert>
              
              <Card>
                <CardHeader>
                  <CardTitle>Data Sync Endpoint</CardTitle>
                  <CardDescription>
                    Retrieve bulk data for synchronization with your systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint</h3>
                      <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-md mb-4">
                        <span className="px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-700">GET</span>
                        <span className="font-mono text-sm">/api/integration/sync/:resource</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-auto h-8 w-8 rounded-full"
                          onClick={() => copyToClipboard('/api/integration/sync/:resource', 'sync-endpoint')}
                        >
                          {copiedEndpoint === 'sync-endpoint' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Resource Types</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">products</span>
                          <span className="text-xs text-gray-500 block">All products and their details</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">orders</span>
                          <span className="text-xs text-gray-500 block">All orders and their statuses</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">frame-options</span>
                          <span className="text-xs text-gray-500 block">All available frame options</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">mat-options</span>
                          <span className="text-xs text-gray-500 block">All available mat options</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">glass-options</span>
                          <span className="text-xs text-gray-500 block">All available glass options</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Query Parameters</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">since</span>
                          <span className="text-xs text-gray-500 block">ISO date to filter by creation date</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">limit</span>
                          <span className="text-xs text-gray-500 block">Maximum number of records to return</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md">
                          <span className="font-mono text-gray-700">format</span>
                          <span className="text-xs text-gray-500 block">Response format (json or csv)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Example Request</h3>
                      <div className="bg-slate-50 p-4 rounded-md font-mono text-xs overflow-auto max-h-60">
                        <pre>{`fetch('${window.location.origin}/api/integration/sync/products?since=2023-01-01&limit=100&format=json', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApiDocsPage;