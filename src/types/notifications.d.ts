// Type definitions for Jay's Frames Unified Notification System

interface JFNotificationOptions {
  sourceId?: string;
  actionable?: boolean;
  link?: string;
  smsEnabled?: boolean;
  smsRecipient?: string;
  dashboardUrl?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

interface JFNotification {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  actionable: boolean;
  link: string;
  smsEnabled: boolean;
  smsRecipient: string;
}

interface JFNotificationHandler {
  (notification: JFNotification): void;
}

interface JFNotificationSystem {
  appId: string | null;
  websocket: WebSocket | null;
  connected: boolean;
  handlers: JFNotificationHandler[];
  
  init(appId: string, options?: JFNotificationOptions): JFNotificationSystem;
  sendMessage(message: any): boolean;
  sendNotification(title: string, description: string, type: string, options?: JFNotificationOptions): Promise<any>;
  onNotification(handler: JFNotificationHandler): () => void;
}

interface Window {
  jfNotifications: JFNotificationSystem;
  showToast?: (options: { title: string; description: string; variant?: string; duration?: number }) => void;
}