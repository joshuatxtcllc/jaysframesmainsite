/**
 * Jay's Frames Notification System Types
 */

interface JFNotification {
  id?: string;
  title: string;
  description: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  source?: string;
  sourceId?: string;
  actionable?: boolean;
  link?: string;
  [key: string]: any;
}

interface JFNotificationClient {
  connected: boolean;
  init: () => void;
  sendNotification: (
    title: string, 
    description: string, 
    type?: 'info' | 'success' | 'warning' | 'error', 
    options?: Partial<JFNotification>
  ) => Promise<boolean>;
  onNotification: (callback: (notification: JFNotification) => void) => () => void;
}

declare global {
  interface Window {
    jfNotifications: JFNotificationClient;
  }
}