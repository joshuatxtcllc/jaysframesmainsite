import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send } from "lucide-react";
import { Helmet } from "react-helmet";

const NotificationTest = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("Test Notification");
  const [description, setDescription] = useState("This is a test notification from Jay's Frames.");
  const [type, setType] = useState<string>("info");
  const [isActionable, setIsActionable] = useState(false);
  const [link, setLink] = useState("/products");
  const [isSending, setIsSending] = useState(false);

  const sendNotification = async () => {
    setIsSending(true);
    
    try {
      let success = false;
      
      // Try to use the unified notification system first if available
      if (window.jfNotifications && window.jfNotifications.connected) {
        success = await window.jfNotifications.sendNotification(
          title,
          description,
          type,
          {
            sourceId: "test-" + Date.now(),
            actionable: isActionable,
            link: isActionable ? link : "",
          }
        );
      }
      
      // Fall back to API if the unified system isn't available
      if (!success) {
        const response = await fetch('/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            description,
            source: 'notification-test',
            sourceId: "test-" + Date.now(),
            type,
            actionable: isActionable,
            link: isActionable ? link : "",
          })
        });
        
        if (response.ok) {
          success = true;
        }
      }
      
      if (success) {
        toast({
          title: "Notification Sent",
          description: "Your test notification has been sent successfully."
        });
      } else {
        toast({
          title: "Failed to Send",
          description: "There was a problem sending your notification.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "An error occurred while sending the notification.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-10">
      <Helmet>
        <title>Notification Test | Jay's Frames</title>
      </Helmet>
      
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-primary">Notification Test</h1>
        <p className="text-neutral-500 mt-2">
          Use this page to test the notification system. Notifications will appear in the bell icon in the header.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Send a Test Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); sendNotification(); }}>
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter notification title" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Notification Message</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Enter notification message" 
                rows={3} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Notification Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Information (Blue)</SelectItem>
                  <SelectItem value="success">Success (Green)</SelectItem>
                  <SelectItem value="warning">Warning (Yellow)</SelectItem>
                  <SelectItem value="error">Error (Red)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="actionable" 
                checked={isActionable} 
                onCheckedChange={setIsActionable} 
              />
              <Label htmlFor="actionable">Include Action Button</Label>
            </div>
            
            {isActionable && (
              <div className="space-y-2">
                <Label htmlFor="link">Action Link</Label>
                <Input 
                  id="link" 
                  value={link} 
                  onChange={(e) => setLink(e.target.value)} 
                  placeholder="Enter link URL (e.g., /products)" 
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSending} 
            >
              {isSending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationTest;