
import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Switch } from './switch';
import { Label } from './label';
import { Alert, AlertDescription } from './alert';
import { Calendar, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CalendarIntegrationSetupProps {
  onConfigured?: () => void;
}

export const CalendarIntegrationSetup: React.FC<CalendarIntegrationSetupProps> = ({
  onConfigured
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnectGoogleCalendar = async () => {
    setIsConnecting(true);
    try {
      // Get authorization URL
      const response = await fetch('/api/calendar/auth-url');
      const { authUrl } = await response.json();
      
      // Open authorization in popup window
      const popup = window.open(
        authUrl,
        'google-calendar-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for authorization completion
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          // Check if authorization was successful
          checkConnectionStatus();
        }
      }, 1000);

    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Calendar. Please try again.",
        variant: "destructive"
      });
      setIsConnecting(false);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/calendar/status');
      const { connected, syncEnabled: currentSyncEnabled } = await response.json();
      
      setIsConnected(connected);
      setSyncEnabled(currentSyncEnabled);
      
      if (connected) {
        toast({
          title: "Calendar Connected",
          description: "Google Calendar integration is now active.",
        });
        onConfigured?.();
      }
    } catch (error) {
      console.error('Error checking calendar status:', error);
    }
  };

  const handleToggleSync = async () => {
    try {
      const response = await fetch('/api/calendar/toggle-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !syncEnabled })
      });

      if (response.ok) {
        setSyncEnabled(!syncEnabled);
        toast({
          title: syncEnabled ? "Sync Disabled" : "Sync Enabled",
          description: syncEnabled 
            ? "Calendar sync has been disabled." 
            : "New appointments will sync to your Google Calendar.",
        });
      }
    } catch (error) {
      console.error('Error toggling sync:', error);
      toast({
        title: "Error",
        description: "Failed to update sync settings.",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/calendar/disconnect', {
        method: 'POST'
      });

      if (response.ok) {
        setIsConnected(false);
        setSyncEnabled(false);
        toast({
          title: "Calendar Disconnected",
          description: "Google Calendar integration has been disabled.",
        });
      }
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect calendar.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Calendar Integration
        </CardTitle>
        <CardDescription>
          Sync your appointments with Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Connect your Google Calendar to automatically sync appointments and avoid double-booking.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={handleConnectGoogleCalendar}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? "Connecting..." : "Connect Google Calendar"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Google Calendar is connected and ready to sync.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between">
              <Label htmlFor="sync-toggle">Enable automatic sync</Label>
              <Switch
                id="sync-toggle"
                checked={syncEnabled}
                onCheckedChange={handleToggleSync}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              When enabled, new appointments will automatically appear in your Google Calendar.
            </div>

            <Button 
              variant="outline" 
              onClick={handleDisconnect}
              className="w-full"
            >
              Disconnect Calendar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
