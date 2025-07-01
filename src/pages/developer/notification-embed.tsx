import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { ArrowLeft, Copy, CheckCircle, Code, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function NotificationEmbed() {
  const { toast } = useToast();
  const [dashboardUrl, setDashboardUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [appId, setAppId] = useState("jaysframes-app");
  
  // Generate current date for example
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  
  // Base script from the embedded script file
  const baseScriptUrl = "/js/notification-embed.js";
  
  // Generate embed code snippets
  const embedScript = `<script id="jf-notification-script" src="${window.location.origin}${baseScriptUrl}"></script>`;
  
  const configScript = `<script>
  // Configuration for Jay's Frames Notification System
  var jfNotificationOptions = {
    apiKey: "YOUR_API_KEY", // Optional: Your API key for authentication
    autoConnect: true,      // Optional: Automatically connect on page load
    target: "#notification-bell", // Optional: CSS selector for notification container
    styles: true            // Optional: Include default styles
  };
</script>`;
  
  const listenerScript = `<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Access notification client when it's loaded
    document.getElementById('jf-notification-script').onClientLoaded = function(client) {
      console.log('Connected to Jay\\'s Frames notification system');
      
      // Listen for notifications
      client.onNotification(function(notification) {
        console.log('Received notification:', notification);
        // Handle the notification in your application
      });
    };
  });
</script>`;
  
  const sendExampleScript = `<script>
  function sendExampleNotification() {
    if (window.jfNotifications) {
      window.jfNotifications.sendNotification(
        "Order Status Update", 
        "Your custom frame order has shipped! Expected delivery: ${currentDate}",
        "success",
        {
          sourceId: "order-12345",
          actionable: true,
          link: "/orders/12345"
        }
      );
    }
  }
</script>`;

  const exampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jay's Frames Notification Example</title>
  
  <!-- 1. Configure notification options (optional) -->
  ${configScript}
  
  <!-- 2. Load the notification script -->
  ${embedScript}
  
  <!-- 3. Set up notification listener -->
  ${listenerScript}
  
  <!-- 4. Example function to send a notification -->
  ${sendExampleScript}
  
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .notification-container {
      position: relative;
    }
    .button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Notification Example</h1>
    
    <!-- Notification bell will be inserted here -->
    <div id="notification-bell" class="notification-container"></div>
  </div>
  
  <div>
    <button class="button" onclick="sendExampleNotification()">
      Send Test Notification
    </button>
  </div>
</body>
</html>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`
      });
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      toast({
        title: "Copy failed",
        description: "Failed to copy text: " + err,
        variant: "destructive"
      });
    });
  };
  
  const resetUrl = () => {
    setDashboardUrl("");
  };
  
  return (
    <div className="container mx-auto px-4 py-10">
      <Helmet>
        <title>Notification Embed Script | Jay's Frames Developer</title>
        <meta name="description" content="Documentation and embed script for integrating with Jay's Frames notification system" />
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Notification Embed Script</h1>
            <p className="text-muted-foreground mt-1">
              Add Jay's Frames notification system to any application
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <a href={baseScriptUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>View Script</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
            
            <Button variant="secondary" size="sm" 
              onClick={() => copyToClipboard(embedScript, "Embed script")}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Embed Code</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Step 1</CardTitle>
            <CardDescription>Add the embed script to your application</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Include this script tag in the <code>&lt;head&gt;</code> section of your HTML.
            </p>
            
            <div className="relative">
              <pre className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-md text-xs overflow-x-auto">
                {embedScript}
              </pre>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => copyToClipboard(embedScript, "Embed script")}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 2</CardTitle>
            <CardDescription>Configure notification options</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Add this script before the embed script to configure your options.
            </p>
            
            <div className="relative">
              <pre className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-md text-xs overflow-x-auto">
                {configScript}
              </pre>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => copyToClipboard(configScript, "Configuration script")}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 3</CardTitle>
            <CardDescription>Listen for notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Add code to handle incoming notifications in your application.
            </p>
            
            <div className="relative">
              <pre className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-md text-xs overflow-x-auto">
                {listenerScript}
              </pre>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => copyToClipboard(listenerScript, "Listener script")}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="example">
        <TabsList className="mb-4">
          <TabsTrigger value="example">Complete Example</TabsTrigger>
          <TabsTrigger value="sending">Sending Notifications</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
        </TabsList>
        
        <TabsContent value="example">
          <Card>
            <CardHeader>
              <CardTitle>Complete Example</CardTitle>
              <CardDescription>A full HTML example implementing the notification system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <pre className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-md text-xs overflow-x-auto">
                  {exampleHtml}
                </pre>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => copyToClipboard(exampleHtml, "Example HTML")}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sending">
          <Card>
            <CardHeader>
              <CardTitle>Sending Notifications</CardTitle>
              <CardDescription>How to send notifications from your application</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You can send notifications from your application using the JavaScript API:
              </p>
              
              <div className="relative mb-6">
                <pre className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-md text-xs overflow-x-auto">
                  {sendExampleScript}
                </pre>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => copyToClipboard(sendExampleScript, "Send example script")}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Notification Parameters</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Parameter</th>
                      <th className="text-left py-2 font-medium">Type</th>
                      <th className="text-left py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">title</td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2">Title of the notification</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">description</td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2">Content of the notification</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">type</td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2">One of: 'info', 'success', 'warning', 'error'</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">options</td>
                      <td className="py-2 pr-4">object</td>
                      <td className="py-2">Additional options (see below)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">Options Object</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Option</th>
                      <th className="text-left py-2 font-medium">Type</th>
                      <th className="text-left py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">sourceId</td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2">ID that identifies the source of this notification</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">actionable</td>
                      <td className="py-2 pr-4">boolean</td>
                      <td className="py-2">Whether the notification has an action</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">link</td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2">URL to navigate to when clicked</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">smsEnabled</td>
                      <td className="py-2 pr-4">boolean</td>
                      <td className="py-2">Whether to send an SMS notification</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">smsRecipient</td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2">Phone number to send the SMS to</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>Full documentation of the notification client API</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Methods</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Method</th>
                      <th className="text-left py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">sendNotification(title, description, type, options)</td>
                      <td className="py-2">Send a notification to the notification system</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">onNotification(callback)</td>
                      <td className="py-2">Register a callback function that is triggered when a notification is received</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">Properties</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Property</th>
                      <th className="text-left py-2 font-medium">Type</th>
                      <th className="text-left py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">connected</td>
                      <td className="py-2 pr-4">boolean</td>
                      <td className="py-2">Whether the client is connected to the notification service</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">Configuration Options</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Option</th>
                      <th className="text-left py-2 font-medium">Type</th>
                      <th className="text-left py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">apiKey</td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2">API key for authentication</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">autoConnect</td>
                      <td className="py-2 pr-4">boolean</td>
                      <td className="py-2">Whether to connect automatically on page load</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">target</td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2">CSS selector for the notification bell container</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4 font-mono text-xs">styles</td>
                      <td className="py-2 pr-4">boolean</td>
                      <td className="py-2">Whether to include default styles</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Configuration</CardTitle>
            <CardDescription>Optionally connect to a specific dashboard URL</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                placeholder="Enter dashboard URL (optional)"
                value={dashboardUrl}
                onChange={(e) => setDashboardUrl(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={resetUrl}>Reset</Button>
            <p className="text-xs text-muted-foreground mt-2 md:mt-0 md:self-center">
              Defaults to the current origin if not specified
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}