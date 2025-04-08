import { Server } from 'http';
import WebSocket from 'ws';
import { log } from '../vite';

interface WebSocketClient extends WebSocket {
  id: string;
  appId: string;
  isAlive: boolean;
}

type WebSocketMessage = {
  type: string;
  event?: string;
  source?: string;
  appId?: string;
  payload?: any;
};

type Notification = {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceId: string;
  type: string;
  timestamp: string;
  actionable: boolean;
  link: string;
  smsEnabled?: boolean;
  smsRecipient?: string;
};

let wss: WebSocketServer | null = null;

class WebSocketServer {
  private server: WebSocket.Server;
  private clients: Map<string, WebSocketClient> = new Map();
  private pingInterval: NodeJS.Timeout;

  constructor(httpServer: Server) {
    this.server = new WebSocket.Server({ server: httpServer });
    log('WebSocket server initialized', 'websocket');

    this.server.on('connection', (ws: WebSocketClient) => {
      ws.id = Math.random().toString(36).substring(2, 15);
      ws.isAlive = true;
      ws.appId = '';
      
      this.clients.set(ws.id, ws);
      log(`Client connected: ${ws.id}`, 'websocket');

      ws.on('message', (message: string) => {
        try {
          const data: WebSocketMessage = JSON.parse(message);
          
          // Handle registration
          if (data.type === 'register' && data.appId) {
            ws.appId = data.appId;
            log(`Client ${ws.id} registered with appId: ${data.appId}`, 'websocket');
            
            // Send confirmation
            ws.send(JSON.stringify({
              type: 'registered',
              appId: data.appId
            }));
          }
        } catch (error) {
          log(`Error processing message: ${error}`, 'websocket');
        }
      });

      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('close', () => {
        this.clients.delete(ws.id);
        log(`Client disconnected: ${ws.id}`, 'websocket');
      });
    });

    // Set up ping interval to keep connections alive
    this.pingInterval = setInterval(() => {
      this.clients.forEach((client) => {
        if (client.isAlive === false) {
          this.clients.delete(client.id);
          return client.terminate();
        }
        
        client.isAlive = false;
        client.ping();
      });
    }, 30000);

    this.server.on('close', () => {
      clearInterval(this.pingInterval);
    });
  }

  public broadcastNotification(notification: Notification): void {
    const message = JSON.stringify({
      type: 'notification',
      payload: notification
    });

    log(`Broadcasting notification: ${notification.title}`, 'websocket');
    
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  public getClientsCount(): number {
    return this.clients.size;
  }
}

export function getWebSocketServer(httpServer?: Server): WebSocketServer {
  if (!wss && httpServer) {
    wss = new WebSocketServer(httpServer);
  } else if (!wss) {
    throw new Error('WebSocket server not initialized');
  }
  
  return wss;
}

interface NotificationPayload {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  actionable: boolean;
  link: string;
  smsEnabled?: boolean;
  smsRecipient?: string;
}

type WebSocketMessage = {
  type: string;
  event?: string;
  source?: string;
  appId?: string;
  payload?: any;
};

/**
 * Initializes the WebSocket server for the notification system
 */
export function initWebSocketServer(server: Server) {
  const wss = new WebSocket.Server({ server, path: '/ws' });
  
  log('WebSocket server initialized at /ws');
  
  // Connected clients
  const clients = new Map<string, WebSocketClient>();
  
  // Handle heartbeats to detect disconnected clients
  const heartbeatInterval = setInterval(() => {
    Array.from(clients.values()).forEach(client => {
      if (!client.isAlive) {
        client.terminate();
        clients.delete(client.id);
        return;
      }
      
      client.isAlive = false;
      client.ping();
    });
  }, 30000);
  
  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });
  
  // Handle new connections
  wss.on('connection', (ws: WebSocket) => {
    const client = ws as WebSocketClient;
    client.id = Date.now().toString();
    client.appId = 'unknown';
    client.isAlive = true;
    
    log(`WebSocket client connected, assigned ID: ${client.id}`);
    
    // Handle pong messages to keep connection alive
    client.on('pong', () => {
      client.isAlive = true;
    });
    
    // Handle incoming messages
    client.on('message', (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString()) as WebSocketMessage;
        
        // Handle client registration
        if (message.type === 'register' && message.appId) {
          client.appId = message.appId;
          clients.set(client.id, client);
          log(`Client ${client.id} registered as app: ${client.appId}`);
        }
        
        // Handle pings
        if (message.type === 'ping') {
          client.isAlive = true;
          client.send(JSON.stringify({ type: 'pong' }));
        }
        
        // Handle notifications
        if (message.type === 'event' && message.event === 'new_notification') {
          // Create a notification with the payload
          const source = message.source || client.appId;
          const payload = message.payload;
          
          if (payload) {
            const notification: NotificationPayload = {
              id: Date.now().toString(),
              title: payload.title || 'Notification',
              description: payload.description || '',
              source: source,
              sourceId: payload.sourceId || '',
              type: payload.type || 'info',
              timestamp: new Date().toISOString(),
              actionable: payload.actionable || false,
              link: payload.link || '',
              smsEnabled: payload.smsEnabled || false,
              smsRecipient: payload.smsRecipient || ''
            };
            
            // Broadcast notification to all connected clients
            broadcastNotification(notification);
            
            // Log notification
            log(`Notification broadcast: ${notification.title}`);
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Handle client disconnect
    client.on('close', () => {
      clients.delete(client.id);
      log(`WebSocket client disconnected: ${client.id}`);
    });
    
    // Send welcome message
    client.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to Jay\'s Frames notification system'
    }));
  });
  
  /**
   * Broadcast a notification to all connected clients
   */
  function broadcastNotification(notification: NotificationPayload) {
    const message = JSON.stringify({
      type: 'event',
      event: 'new_notification',
      payload: notification
    });
    
    // Send to all connected clients
    Array.from(clients.values()).forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  /**
   * Send a notification from the server
   */
  function sendNotification(title: string, description: string, options: Partial<NotificationPayload> = {}) {
    const notification: NotificationPayload = {
      id: Date.now().toString(),
      title,
      description,
      source: options.source || 'jaysframes-server',
      sourceId: options.sourceId || '',
      type: options.type || 'info',
      timestamp: new Date().toISOString(),
      actionable: options.actionable || false,
      link: options.link || '',
      smsEnabled: options.smsEnabled || false,
      smsRecipient: options.smsRecipient || ''
    };
    
    broadcastNotification(notification);
    return notification;
  }
  
  return {
    wss,
    sendNotification,
    broadcastNotification
  };
}

let websocketServer: ReturnType<typeof initWebSocketServer> | null = null;

/**
 * Get the WebSocket server instance
 */
export function getWebSocketServer(server: Server) {
  if (!websocketServer) {
    websocketServer = initWebSocketServer(server);
  }
  return websocketServer;
}