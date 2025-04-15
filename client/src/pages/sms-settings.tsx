import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bell, CheckCircle, AlertCircle, Send, Info } from 'lucide-react';
import { Link } from 'wouter';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from '@/components/ui/alert';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Schema for SMS settings form
const smsFormSchema = z.object({
  enableSMS: z.boolean().default(false),
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: 'Please enter a valid phone number in international format (e.g., +12345678901)',
    })
    .optional()
    .refine(val => val === undefined || val.startsWith('+'), {
      message: 'Phone number must include country code starting with +'
    }),
  notificationTypes: z.object({
    orderConfirmation: z.boolean().default(true),
    orderStatus: z.boolean().default(true),
    marketing: z.boolean().default(false),
    promotions: z.boolean().default(false)
  })
});

type FormData = z.infer<typeof smsFormSchema>;

export default function SMSSettingsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testSent, setTestSent] = useState(false);
  
  // Initialize form with default values
  const form = useForm<FormData>({
    resolver: zodResolver(smsFormSchema),
    defaultValues: {
      enableSMS: false,
      phoneNumber: '',
      notificationTypes: {
        orderConfirmation: true,
        orderStatus: true,
        marketing: false,
        promotions: false
      }
    }
  });
  
  // Watch enableSMS to conditionally render phone number field
  const enableSMS = form.watch('enableSMS');
  
  // Function to handle form submission
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // In a real app, you would save these settings to the backend
      console.log('Saving SMS settings:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Your SMS notification preferences have been updated.",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to save SMS settings:', error);
      toast({
        title: "Error",
        description: "Failed to save your SMS settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to send a test SMS message
  const handleSendTestMessage = async () => {
    const phoneNumber = form.getValues('phoneNumber');
    
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number to send a test message.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Send test notification via API
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Notification',
          description: 'This is a test SMS notification from Jay\'s Frames.',
          source: 'sms-settings',
          type: 'info',
          smsEnabled: true,
          smsRecipient: phoneNumber
        })
      });
      
      if (response.ok) {
        setTestSent(true);
        toast({
          title: "Test Message Sent",
          description: `A test message has been sent to ${phoneNumber}.`,
          variant: "default"
        });
      } else {
        throw new Error('Failed to send test message');
      }
    } catch (error) {
      console.error('Failed to send test SMS:', error);
      toast({
        title: "Error",
        description: "Failed to send test message. Please check your phone number and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset testSent state when phone number changes
  useEffect(() => {
    setTestSent(false);
  }, [form.watch('phoneNumber')]);
  
  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">SMS Notification Settings</h1>
        <p className="text-muted-foreground">
          Manage your SMS notification preferences for order updates and more.
        </p>
      </div>
      
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="info">About SMS Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                SMS Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure when and how you receive SMS notifications from Jay's Frames.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="enableSMS"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable SMS Notifications</FormLabel>
                          <FormDescription>
                            Receive order updates and important notifications via text message.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {enableSMS && (
                    <>
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Phone Number</FormLabel>
                            <FormDescription>
                              Enter your mobile phone number in international format (e.g., +12345678901).
                            </FormDescription>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Types</h3>
                        <FormField
                          control={form.control}
                          name="notificationTypes.orderConfirmation"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Order Confirmations</FormLabel>
                                <FormDescription>
                                  Receive a text when your order is placed successfully.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="notificationTypes.orderStatus"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Order Status Updates</FormLabel>
                                <FormDescription>
                                  Receive texts when your order status changes (preparing, shipped, etc.).
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="notificationTypes.marketing"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Marketing Messages</FormLabel>
                                <FormDescription>
                                  Receive texts about new products, services and features.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="notificationTypes.promotions"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Promotions & Discounts</FormLabel>
                                <FormDescription>
                                  Receive texts about special offers, discounts and seasonal promotions.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {form.getValues('phoneNumber') && !testSent && (
                        <div className="flex justify-center">
                          <Button 
                            type="button" 
                            variant="outline" 
                            disabled={isSubmitting}
                            onClick={handleSendTestMessage}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Send Test Message
                          </Button>
                        </div>
                      )}
                      
                      {testSent && (
                        <Alert variant="default" className="bg-muted border-primary">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <AlertTitle>Test message sent!</AlertTitle>
                          <AlertDescription>
                            A test message has been sent to your phone. Please check to make sure you received it.
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline" asChild>
                      <Link href="/notifications">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="info" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary" />
                About SMS Notifications
              </CardTitle>
              <CardDescription>
                Information about our SMS notification service and how it works.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">What are SMS notifications?</h3>
                <p className="text-sm text-muted-foreground">
                  SMS notifications are text messages sent to your mobile phone to keep you updated about your orders, 
                  special offers, and other important information from Jay's Frames.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Message & Data Rates</h3>
                <p className="text-sm text-muted-foreground">
                  Standard message and data rates may apply based on your mobile carrier's messaging plan. 
                  Jay's Frames does not charge for SMS notifications, but your carrier might.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Frequency</h3>
                <p className="text-sm text-muted-foreground">
                  The frequency of messages depends on your selected preferences and your order activity.
                  Order confirmations and status updates are sent only when relevant events occur.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Opting Out</h3>
                <p className="text-sm text-muted-foreground">
                  You can opt out at any time by disabling SMS notifications in your settings or by replying STOP to any message.
                  To re-enable messages after replying STOP, you will need to update your settings again.
                </p>
              </div>
              
              <div className="mt-6">
                <Alert className="border-primary/20 bg-primary/5">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertTitle>Need Help?</AlertTitle>
                  <AlertDescription>
                    If you have any questions about SMS notifications or if you're not receiving messages,
                    please contact our customer support at (832) 893-3794 or info@jaysframes.com.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}