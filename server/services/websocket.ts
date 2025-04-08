import { Server } from 'http';
import WebSocket from 'ws';
import { log } from '../vite';

interface WebSocketClient extends WebSocket {
  id: string;
  appId: string;
  isAlive: boolean;
}

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

type WebSocketMessage = {
  type: string;
  event?: string;
  source?: string;
  appId?: string;
  payload?: any;
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