import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Bell, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Notifications() {
  const [notifications, setNotifications] = useState<JFNotification[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    // Initialize an empty notifications array
    const initNotifications: JFNotification[] = [
      // Example notification for demonstration purposes
      {
        id: "example-1",
        title: "Welcome to Notifications",
        description: "This page will display all your notifications from Jay's Frames.",
        type: "info",
        timestamp: new Date().toISOString(),
        source: "jaysframes-system",
        sourceId: "welcome",
        actionable: true,
        link: "/notification-test",
        smsEnabled: false,
        smsRecipient: ""
      }
    ];
    
    setNotifications(initNotifications);
    
    // Set up notification listener
    if (window.jfNotifications) {
      const unsubscribe = window.jfNotifications.onNotification((notification: JFNotification) => {
        setNotifications(prev => [notification, ...prev]);
      });
      
      // Clean up the listener on unmount
      return () => {
        unsubscribe();
      };
    }
  }, []);

  // Filter notifications based on the selected type
  const filteredNotifications = filter
    ? notifications.filter(notification => notification.type === filter)
    : notifications;

  return (
    <div className="container mx-auto px-4 py-10">
      <Helmet>
        <title>Notifications | Jay's Frames</title>
        <meta name="description" content="View all notifications from Jay's Frames" />
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your orders and Jay's Frames news
          </p>
        </div>
        
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <Filter className="h-4 w-4 mr-2" />
                {filter ? `Filter: ${filter.charAt(0).toUpperCase() + filter.slice(1)}` : "Filter"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter(null)}>
                All Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("info")}>
                Information
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("success")}>
                Success
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("warning")}>
                Warning
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("error")}>
                Error
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/notification-test">
            <Button size="sm" className="ml-2">
              Test Notifications
            </Button>
          </Link>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {filteredNotifications.length === 0 ? (
        <Card className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-10 pb-10 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-primary/70" />
            </div>
            <CardTitle className="text-xl font-semibold text-primary mb-2">No notifications found</CardTitle>
            <CardDescription>
              {filter ? `No ${filter} notifications to display.` : "You don't have any notifications yet."}
            </CardDescription>
            <Button variant="outline" className="mt-6" onClick={() => setFilter(null)}>
              Clear Filter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification, index) => (
            <Card key={notification.id || index} className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${notification.type === 'success' ? 'bg-green-100' : 
                        notification.type === 'warning' ? 'bg-amber-100' :
                        notification.type === 'error' ? 'bg-red-100' : 'bg-primary/10'}`}
                    >
                      <Bell className={`h-5 w-5 
                        ${notification.type === 'success' ? 'text-green-600' : 
                          notification.type === 'warning' ? 'text-amber-600' :
                          notification.type === 'error' ? 'text-red-600' : 'text-primary'}`} 
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">{notification.title}</CardTitle>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <span>{new Date(notification.timestamp).toLocaleString()}</span>
                        <span className="mx-2">•</span>
                        <Badge variant="outline" className="capitalize">
                          {notification.type || 'info'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {notification.description}
                </p>
                {notification.actionable && notification.link && (
                  <div className="flex justify-end">
                    <Link href={notification.link}>
                      <Button variant="secondary" size="sm" className="group">
                        <span>View Details</span>
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Want to receive notifications via text message?{" "}
          <Link href="/sms-settings">
            <span className="text-primary hover:underline">Set up SMS alerts</span>
          </Link>
        </p>
      </div>
    </div>
  );
}