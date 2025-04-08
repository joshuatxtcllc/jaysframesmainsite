/**
 * Jay's Frames Notification Server
 * 
 * This is a simplified implementation of the notification WebSocket server
 * for demonstration purposes. In production, this would be integrated with
 * the main Express server.
 */

// Import required modules
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import express from 'express';

// Create an Express app
const app = express();
app.use(express.json());

// Create HTTP server
const server = createServer(app);

// Create a WebSocket server
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Map();

// Set up WebSocket server
wss.on('connection', (ws) => {
  // Generate a unique client ID
  const clientId = Math.random().toString(36).substring(2, 15);
  
  // Set up client properties
  ws.id = clientId;
  ws.isAlive = true;
  ws.appId = '';
  
  // Add client to the map
  clients.set(clientId, ws);
  console.log(`Client connected: ${clientId}`);
  
  // Handle messages from the client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`Received message: ${message}`);
      
      // Handle client registration
      if (data.type === 'register' && data.appId) {
        ws.appId = data.appId;
        console.log(`Client ${clientId} registered with appId: ${data.appId}`);
        
        // Send confirmation
        ws.send(JSON.stringify({
          type: 'registered',
          appId: data.appId
        }));
      }
      
      // Handle ping messages to keep the connection alive
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
      
      // Handle new notification events
      if (data.type === 'event' && data.event === 'new_notification') {
        const notification = data.payload;
        if (notification) {
          // Add ID and timestamp if not present
          if (!notification.id) {
            notification.id = Date.now().toString();
          }
          if (!notification.timestamp) {
            notification.timestamp = new Date().toISOString();
          }
          
          // Broadcast to all clients
          broadcastNotification(notification);
          
          // Log the notification
          console.log(`Notification broadcasted: ${notification.title}`);
        }
      }
    } catch (error) {
      console.error(`Error processing message: ${error}`);
    }
  });
  
  // Handle ping/pong for keeping connection alive
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    clients.delete(clientId);
    console.log(`Client disconnected: ${clientId}`);
  });
});

// Set up ping interval to keep connections alive
const pingInterval = setInterval(() => {
  clients.forEach((client) => {
    if (client.isAlive === false) {
      clients.delete(client.id);
      return client.terminate();
    }
    
    client.isAlive = false;
    client.ping();
  });
}, 30000);

// Clean up interval on server close
server.on('close', () => {
  clearInterval(pingInterval);
});

// Broadcast notification to all connected clients
function broadcastNotification(notification) {
  const message = JSON.stringify({
    type: 'notification',
    payload: notification
  });
  
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// API endpoint for creating notifications
app.post('/api/notifications', (req, res) => {
  try {
    const { title, description, source, sourceId, type, actionable, link, smsEnabled, smsRecipient } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    // Validate notification type
    const validTypes = ['info', 'success', 'warning', 'error'];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid notification type' });
    }
    
    // Create notification object
    const notification = {
      id: Date.now().toString(),
      title,
      description,
      source: source || 'api',
      sourceId: sourceId || '',
      type: type || 'info',
      timestamp: new Date().toISOString(),
      actionable: actionable || false,
      link: link || '',
      smsEnabled: smsEnabled || false,
      smsRecipient: smsRecipient || ''
    };
    
    // Broadcast notification to all connected clients
    broadcastNotification(notification);
    
    // Return success response
    res.status(201).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error(`Error creating notification: ${error}`);
    res.status(500).json({ message: 'Failed to process notification' });
  }
});

// API endpoint for retrieving notifications
app.get('/api/notifications', (req, res) => {
  // In a real implementation, this would fetch notifications from a database
  // For demo purposes, we'll just return a few sample notifications
  const notifications = [
    {
      id: '1',
      title: 'New Order Received',
      description: 'A new custom frame order has been placed for 8x10 standard frame.',
      source: 'orders-app',
      sourceId: '12345',
      type: 'success',
      timestamp: new Date().toISOString(),
      actionable: true,
      link: '/orders/12345'
    },
    {
      id: '2',
      title: 'Low Inventory Alert',
      description: 'Black metal frame (16x20) is running low. Current stock: 5 units',
      source: 'inventory-app',
      sourceId: 'INV-987',
      type: 'warning',
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      actionable: true,
      link: '/inventory/restock'
    },
    {
      id: '3',
      title: 'Customer Support Request',
      description: 'John Smith has a question about order #33456',
      source: 'support-app',
      sourceId: 'SR-2345',
      type: 'info',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      actionable: true,
      link: '/support/tickets/2345'
    }
  ];
  
  res.json({ notifications });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Notification server running on port ${PORT}`);
  console.log(`WebSocket server available at ws://localhost:${PORT}/ws`);
  console.log(`API endpoints:`);
  console.log(`  POST /api/notifications - Create a new notification`);
  console.log(`  GET /api/notifications - Get all notifications`);
});