/**
 * Jay's Frames Notification Server
 * A server-side implementation of the notification system
 * 
 * This file demonstrates how to implement the server-side component of the
 * Jay's Frames notification system. It includes:
 * - WebSocket server for real-time notifications
 * - REST API endpoints for notification management
 * - Utility functions for creating and broadcasting notifications
 * 
 * Note: This is a standalone implementation for demonstration purposes.
 * In a real application, this would be integrated with your existing server.
 */

// Required modules (in a real app, these would be actual require statements)
// const http = require('http');
// const WebSocket = require('ws');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { v4: uuidv4 } = require('uuid');

/**
 * WebSocket client interface
 * @typedef {Object} WebSocketClient
 * @property {string} id - Unique client ID
 * @property {string} appId - Application ID
 * @property {boolean} isAlive - Whether the client is alive (for ping/pong)
 */

/**
 * Notification object
 * @typedef {Object} Notification
 * @property {string} id - Unique notification ID
 * @property {string} title - Notification title
 * @property {string} description - Notification description
 * @property {string} source - Source application
 * @property {string} sourceId - Source-specific ID (e.g., order ID)
 * @property {string} type - Notification type (info, success, warning, error)
 * @property {string} timestamp - ISO timestamp
 * @property {boolean} actionable - Whether the notification has an action
 * @property {string} link - Action link
 * @property {boolean} [smsEnabled] - Whether to send an SMS notification
 * @property {string} [smsRecipient] - SMS recipient
 */

/**
 * WebSocket message
 * @typedef {Object} WebSocketMessage
 * @property {string} type - Message type
 * @property {string} [event] - Event name
 * @property {string} [source] - Source application
 * @property {string} [appId] - Application ID
 * @property {*} [payload] - Message payload
 */

/**
 * Notification system implementation
 */
class NotificationSystem {
  /**
   * Create a notification system
   * @param {Object} server - HTTP server
   */
  constructor(server) {
    this.clients = new Map();
    this.notifications = [];
    this.apiKeys = new Map(); // Map of API keys to permissions
    
    // Set up WebSocket server
    this.setupWebSocketServer(server);
    
    // Set up ping interval
    this.pingInterval = setInterval(() => {
      this.pingClients();
    }, 30000); // Ping every 30 seconds
    
    console.log('Notification system initialized');
  }
  
  /**
   * Set up WebSocket server
   * @param {Object} server - HTTP server
   * @private
   */
  setupWebSocketServer(server) {
    // In a real app, this would be:
    // this.wss = new WebSocket.Server({ server });
    
    // Mock WebSocket server for demonstration
    this.wss = {
      on: (event, callback) => {
        console.log(`WebSocket server listening for ${event} events`);
        
        if (event === 'connection') {
          // Simulate a connection for demonstration
          const mockWs = {
            id: this.generateId(),
            appId: '',
            isAlive: true,
            send: (data) => console.log(`Would send to client: ${data}`),
            on: (event, callback) => console.log(`Client listening for ${event} events`),
            ping: () => console.log('Ping client'),
            terminate: () => console.log('Terminate client')
          };
          
          // Call the connection callback with our mock
          // In a real app, this would be called by the WebSocket.Server
          // callback(mockWs);
        }
      }
    };
    
    this.wss.on('connection', (ws) => {
      // Generate a unique ID for this connection
      ws.id = this.generateId();
      ws.appId = '';
      ws.isAlive = true;
      
      console.log(`Client connected: ${ws.id}`);
      
      // Add to clients map
      this.clients.set(ws.id, ws);
      
      // Set up message handler
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleClientMessage(ws, data);
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      });
      
      // Set up close handler
      ws.on('close', () => {
        console.log(`Client disconnected: ${ws.id}`);
        this.clients.delete(ws.id);
      });
      
      // Set up pong handler
      ws.on('pong', () => {
        ws.isAlive = true;
      });
    });
  }
  
  /**
   * Handle a message from a client
   * @param {WebSocketClient} client - Client that sent the message
   * @param {WebSocketMessage} data - Message data
   * @private
   */
  handleClientMessage(client, data) {
    if (!data || !data.type) {
      return;
    }
    
    switch (data.type) {
      case 'register':
        this.registerClient(client, data);
        break;
      
      case 'pong':
        client.isAlive = true;
        break;
      
      default:
        console.log(`Unknown message type: ${data.type}`);
    }
  }
  
  /**
   * Register a client
   * @param {WebSocketClient} client - Client to register
   * @param {WebSocketMessage} data - Registration data
   * @private
   */
  registerClient(client, data) {
    if (!data.appId) {
      console.error('Missing appId in registration');
      return;
    }
    
    // In a real app, validate the API key
    if (data.apiKey) {
      // Check if API key is valid
      const isValid = this.validateApiKey(data.apiKey);
      if (!isValid) {
        console.error(`Invalid API key: ${data.apiKey}`);
        client.terminate();
        return;
      }
    }
    
    client.appId = data.appId;
    console.log(`Client registered: ${client.id} (${client.appId})`);
    
    // Send confirmation
    this.sendToClient(client, {
      type: 'registered'
    });
    
    // Send any existing notifications
    // In a real app, you might filter these by appId or other criteria
    this.notifications.forEach(notification => {
      this.sendToClient(client, {
        type: 'notification',
        payload: notification
      });
    });
  }
  
  /**
   * Ping all clients to check if they're still alive
   * @private
   */
  pingClients() {
    console.log('Pinging clients...');
    
    this.clients.forEach((client, id) => {
      if (client.isAlive === false) {
        console.log(`Client not responding, terminating: ${id}`);
        client.terminate();
        this.clients.delete(id);
        return;
      }
      
      client.isAlive = false;
      client.ping();
      
      // Also send a ping message for clients that don't support ping frames
      this.sendToClient(client, {
        type: 'ping'
      });
    });
  }
  
  /**
   * Send a message to a client
   * @param {WebSocketClient} client - Client to send to
   * @param {WebSocketMessage} message - Message to send
   * @private
   */
  sendToClient(client, message) {
    try {
      client.send(JSON.stringify(message));
    } catch (err) {
      console.error(`Error sending to client ${client.id}:`, err);
    }
  }
  
  /**
   * Broadcast a notification to all clients
   * @param {Notification} notification - Notification to broadcast
   * @public
   */
  broadcastNotification(notification) {
    // Add to notifications list
    this.notifications.unshift(notification);
    
    // Trim notifications list if it gets too long
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }
    
    console.log(`Broadcasting notification: ${notification.id} (${notification.title})`);
    
    // Send to all clients
    this.clients.forEach(client => {
      // In a real app, you might filter by appId or other criteria
      this.sendToClient(client, {
        type: 'notification',
        payload: notification
      });
    });
    
    // Handle SMS if enabled
    if (notification.smsEnabled && notification.smsRecipient) {
      this.sendSmsNotification(notification);
    }
  }
  
  /**
   * Send an SMS notification
   * @param {Notification} notification - Notification to send
   * @private
   */
  sendSmsNotification(notification) {
    // In a real app, this would use a service like Twilio
    console.log(`Would send SMS to ${notification.smsRecipient}: ${notification.title}`);
  }
  
  /**
   * Validate an API key
   * @param {string} apiKey - API key to validate
   * @returns {boolean} Whether the API key is valid
   * @private
   */
  validateApiKey(apiKey) {
    // In a real app, check against a database or other storage
    return this.apiKeys.has(apiKey);
  }
  
  /**
   * Register an API key
   * @param {string} apiKey - API key to register
   * @param {Object} permissions - Permissions for this API key
   * @public
   */
  registerApiKey(apiKey, permissions = {}) {
    this.apiKeys.set(apiKey, permissions);
    console.log(`API key registered: ${apiKey}`);
  }
  
  /**
   * Generate a unique ID
   * @returns {string} Unique ID
   * @private
   */
  generateId() {
    // In a real app, this would use a proper UUID library
    return 'id-' + Math.random().toString(36).substring(2, 15);
  }
  
  /**
   * Get the number of connected clients
   * @returns {number} Number of connected clients
   * @public
   */
  getClientsCount() {
    return this.clients.size;
  }
  
  /**
   * Clean up resources
   * @public
   */
  cleanup() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    this.clients.forEach(client => {
      client.terminate();
    });
    
    this.clients.clear();
    console.log('Notification system cleaned up');
  }
}

/**
 * API routes for the notification system
 * @param {Object} app - Express app
 * @param {NotificationSystem} notificationSystem - Notification system
 */
function setupNotificationRoutes(app, notificationSystem) {
  // In a real app, these would be actual routes
  
  // GET /api/notifications
  // Get all notifications (with optional filtering)
  /*
  app.get('/api/notifications', (req, res) => {
    // In a real app, you might filter by user, app, or other criteria
    res.json(notificationSystem.notifications);
  });
  */
  
  // POST /api/notifications
  // Create a new notification
  /*
  app.post('/api/notifications', (req, res) => {
    // Validate request
    if (!req.body.title || !req.body.description || !req.body.type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create notification
    const notification = {
      id: uuidv4(),
      title: req.body.title,
      description: req.body.description,
      source: req.body.source || 'api',
      sourceId: req.body.sourceId || '',
      type: req.body.type,
      timestamp: new Date().toISOString(),
      actionable: !!req.body.actionable,
      link: req.body.link || null,
      smsEnabled: !!req.body.smsEnabled,
      smsRecipient: req.body.smsRecipient || null
    };
    
    // Broadcast notification
    notificationSystem.broadcastNotification(notification);
    
    res.status(201).json(notification);
  });
  */
  
  // POST /api/notifications/mark-all-read
  // Mark all notifications as read
  /*
  app.post('/api/notifications/mark-all-read', (req, res) => {
    // In a real app, this would update a database
    res.status(200).json({ message: 'All notifications marked as read' });
  });
  */
  
  // POST /api/notifications/:id/read
  // Mark a notification as read
  /*
  app.post('/api/notifications/:id/read', (req, res) => {
    const id = req.params.id;
    
    // In a real app, this would update a database
    res.status(200).json({ message: `Notification ${id} marked as read` });
  });
  */
  
  console.log('Notification routes set up');
}

/**
 * Create a notification
 * @param {Object} data - Notification data
 * @returns {Notification} Created notification
 */
function createNotification(data) {
  if (!data.title || !data.description || !data.type) {
    throw new Error('Missing required fields');
  }
  
  return {
    id: generateId(),
    title: data.title,
    description: data.description,
    source: data.source || 'api',
    sourceId: data.sourceId || '',
    type: data.type,
    timestamp: new Date().toISOString(),
    actionable: !!data.actionable,
    link: data.link || null,
    smsEnabled: !!data.smsEnabled,
    smsRecipient: data.smsRecipient || null
  };
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
function generateId() {
  // In a real app, this would use a proper UUID library
  return 'id-' + Math.random().toString(36).substring(2, 15);
}

/**
 * Example usage
 */
function exampleUsage() {
  console.log('==== Example Usage ====');
  
  // In a real app, this would be your actual HTTP server
  const mockServer = {};
  
  // Create notification system
  const notificationSystem = new NotificationSystem(mockServer);
  
  // Register an API key
  notificationSystem.registerApiKey('example-api-key', {
    canCreate: true,
    canRead: true
  });
  
  // Create an Express app (in a real app)
  // const app = express();
  // app.use(bodyParser.json());
  // app.use(cors());
  
  // Set up notification routes
  // setupNotificationRoutes(app, notificationSystem);
  
  // Example: Create and broadcast a notification
  const notification = createNotification({
    title: 'New Order Received',
    description: 'A new custom frame order has been placed for 8x10 standard frame.',
    source: 'orders-app',
    sourceId: '12345',
    type: 'success',
    actionable: true,
    link: '/orders/12345'
  });
  
  notificationSystem.broadcastNotification(notification);
  
  // Example: Clean up when shutting down
  // notificationSystem.cleanup();
  
  console.log('==== End Example ====');
}

// Run example
// exampleUsage();

// Export (in a real app, this would be module.exports)
const exports = {
  NotificationSystem,
  setupNotificationRoutes,
  createNotification
};