# Jay's Frames Notification System Documentation

## Overview

The Jay's Frames Notification System provides a unified notification framework for all applications within the Jay's Frames ecosystem. It enables real-time notifications across different applications through WebSocket connections and offers fallback to REST API when WebSockets are not available.

## Key Features

- **Real-time notifications** via WebSocket connections
- **Fallback to REST API** when WebSockets are not available
- **Multiple notification types**: info, success, warning, error
- **Actionable notifications** with custom links
- **Badge counter** for unread notifications
- **Toast notifications** for immediate visibility
- **Embeddable client** for third-party applications
- **SMS notification support** (optional)

## Architecture

The notification system consists of two main components:

1. **Client-side library** (`jf-notification-client.js`): Manages WebSocket connections, sends and receives notifications, and provides an API for applications to interact with the notification system.

2. **Server-side component** (`server/services/websocket.ts`): Handles WebSocket connections, broadcasts notifications to connected clients, and provides REST API endpoints for creating and retrieving notifications.

## Implementation Guide

### Client-Side Integration

#### Step 1: Include the Client Script
```html
<script src="path/to/jf-notification-client.js"></script>
```

#### Step 2: Initialize the Client
```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the notification system
    window.jfNotifications.init('your-app-id', {
      onConnect: function() {
        console.log('Connected to notification system');
      },
      onDisconnect: function() {
        console.log('Disconnected from notification system');
      }
    });
    
    // Register notification handler
    window.jfNotifications.onNotification(function(notification) {
      console.log('Received notification:', notification);
      // Handle notification here
    });
  });
</script>
```

#### Step 3: Send a Notification
```javascript
// Send a notification
window.jfNotifications.sendNotification(
  'New Order Received',             // Title
  'Customer ordered a custom frame', // Description
  'success',                        // Type: info, success, warning, error
  {
    sourceId: 'ORDER-123',          // Optional: ID from source system
    actionable: true,               // Optional: Is this actionable?
    link: '/orders/123'             // Optional: Link for actionable notifications
  }
);
```

#### Step 4: Listen for Notifications
```javascript
// Method 1: Using the onNotification handler
const unsubscribe = window.jfNotifications.onNotification(function(notification) {
  console.log('Received:', notification);
  // Do something with the notification
});

// Method 2: Using event listeners
window.addEventListener('jf-notification', function(event) {
  const notification = event.detail;
  console.log('Event received:', notification);
  // Do something with the notification
});
```

### Embedded Integration

For third-party applications that want to integrate with the Jay's Frames notification system, an embed script is available.

#### Step 1: Include the Embed Script
```html
<script id="jf-notification-script" src="https://jaysframes.com/js/notification-embed.js"></script>
```

#### Step 2: Configure Options (optional)
```html
<script>
  var jfNotificationOptions = {
    apiKey: 'your-api-key',        // Your API key for authentication
    autoConnect: true,             // Automatically connect on page load (default: true)
    target: '#notification-bell',  // CSS selector for notification bell element
    styles: true                   // Include default styles (default: true)
  };
</script>
```

#### Step 3: Listen for Notifications
```html
<script>
  document.getElementById('jf-notification-script').onClientLoaded = function(client) {
    client.onNotification(function(notification) {
      console.log('New notification:', notification);
    });
  };
</script>
```

## Server-Side Integration

### Express Route Integration

The notification system is integrated with the Express application through the `registerRoutes` function in `server/routes.ts`.

```javascript
app.post("/api/notifications", async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      source, 
      sourceId, 
      type, 
      actionable, 
      link, 
      smsEnabled, 
      smsRecipient 
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // Validate notification type
    const validTypes = ['info', 'success', 'warning', 'error'];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid notification type" });
    }

    // Create the notification object
    const notification = {
      id: Date.now().toString(),
      title,
      description,
      source: source || 'jaysframes-api',
      sourceId: sourceId || '',
      type: type || 'info',
      timestamp: new Date().toISOString(),
      actionable: actionable || false,
      link: link || '',
      smsEnabled: smsEnabled || false,
      smsRecipient: smsRecipient || ''
    };

    // Return a success response
    res.status(201).json({ 
      success: true, 
      notification
    });
    
    // Import WebSocket service dynamically to avoid circular imports
    const { getWebSocketServer } = await import('./services/websocket');
    
    // Broadcast notification to all connected WebSocket clients
    try {
      const wsServer = getWebSocketServer();
      if (wsServer) {
        wsServer.broadcastNotification(notification);
      } else {
        console.warn("WebSocket server not initialized yet");
      }
    } catch (wsError) {
      console.error("Error broadcasting notification:", wsError);
    }
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({ message: "Failed to process notification" });
  }
});
```

### WebSocket Server Initialization

The WebSocket server is initialized in the Express application's setup:

```javascript
// Initialize WebSocket server
try {
  const { getWebSocketServer } = await import('./services/websocket');
  getWebSocketServer(server);
  log('WebSocket notification system initialized');
} catch (err) {
  log('Failed to initialize WebSocket server: ' + err, 'error');
}
```

## Notification Data Structure

```typescript
interface Notification {
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
```

## API Reference

### Client API

#### `init(appId, options)`
Initializes the notification system with the specified application ID.

**Parameters:**
- `appId` (string): The unique identifier for the application.
- `options` (object): Configuration options:
  - `dashboardUrl` (string, optional): Dashboard URL. Default: current domain.
  - `onConnect` (function, optional): Callback when connected.
  - `onDisconnect` (function, optional): Callback when disconnected.
  - `fallbackMode` (boolean, optional): Use fallback mode if WebSocket fails.
  - `onFallback` (function, optional): Callback when switched to fallback mode.

#### `sendNotification(title, description, type, options)`
Sends a notification to the unified system.

**Parameters:**
- `title` (string): The notification title.
- `description` (string): The notification description.
- `type` (string): The notification type ('info', 'success', 'warning', 'error').
- `options` (object): Additional options:
  - `sourceId` (string, optional): Source-specific ID.
  - `actionable` (boolean, optional): Is this notification actionable?
  - `link` (string, optional): Link for actionable notifications.
  - `smsEnabled` (boolean, optional): Enable SMS notification.
  - `smsRecipient` (string, optional): SMS recipient number.

**Returns:** Promise resolving to the created notification object.

#### `onNotification(handler)`
Registers a handler function that will be called when a new notification is received.

**Parameters:**
- `handler` (function): The callback function to handle notifications.

**Returns:** Function to unsubscribe the handler.

### Server API

#### `POST /api/notifications`
Creates a new notification and broadcasts it to all connected clients.

**Request Body:**
```json
{
  "title": "Notification Title",
  "description": "Notification Description",
  "source": "app-name",
  "sourceId": "ID-123",
  "type": "info",
  "actionable": true,
  "link": "/path/to/action",
  "smsEnabled": false,
  "smsRecipient": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "notification": {
    "id": "1681234567890",
    "title": "Notification Title",
    "description": "Notification Description",
    "source": "app-name",
    "sourceId": "ID-123",
    "type": "info",
    "timestamp": "2023-04-11T12:34:56.789Z",
    "actionable": true,
    "link": "/path/to/action",
    "smsEnabled": false,
    "smsRecipient": "+1234567890"
  }
}
```

## Common Use Cases

### Order Status Updates

When an order status changes, send a notification to inform the customer:

```javascript
// When an order status changes
app.patch("/api/orders/:id/status", async (req: Request, res: Response) => {
  // ... Update order status logic ...

  // Send a notification about the order status update
  if (order.customerEmail) {
    // Get a user-friendly status message based on the stage
    let statusMessage = "Your order status has been updated.";
    let statusType = "info";

    if (stage) {
      switch (stage) {
        case "ready_for_pickup":
          statusMessage = "Your order is ready for pickup!";
          statusType = "success";
          break;
        case "shipped":
          statusMessage = "Your order has been shipped!";
          statusType = "success";
          break;
        // ... Other status cases ...
      }
    }

    // Send notification via WebSocket
    try {
      const { getWebSocketServer } = await import('./services/websocket');
      const wsServer = getWebSocketServer();
      if (wsServer) {
        wsServer.broadcastNotification({
          id: Date.now().toString(),
          title: `Order #${order.id} Update`,
          description: statusMessage,
          source: 'jaysframes-api',
          sourceId: order.id.toString(),
          type: statusType,
          timestamp: new Date().toISOString(),
          actionable: true,
          link: `/order-status?orderId=${order.id}`
        });
      }
    } catch (wsError) {
      console.error("Error broadcasting notification:", wsError);
    }
  }

  res.json(order);
});
```

### Inventory Alerts

When inventory levels drop below a threshold, send a notification to admin users:

```javascript
// Example inventory check logic
function checkInventory() {
  const lowStockItems = inventory.filter(item => item.quantity < item.threshold);
  
  if (lowStockItems.length > 0) {
    lowStockItems.forEach(item => {
      jfNotifications.sendNotification(
        'Low Inventory Alert',
        `${item.name} is running low. Current stock: ${item.quantity} units`,
        'warning',
        {
          source: 'inventory-app',
          sourceId: item.id,
          actionable: true,
          link: `/inventory/restock?itemId=${item.id}`
        }
      );
    });
  }
}
```

## Troubleshooting

### Common Issues

#### WebSocket Connection Failing

If WebSocket connections are failing, check the following:

1. Ensure the WebSocket server is initialized properly in `server/index.ts`.
2. Check that the WebSocket URL is correct in the client initialization.
3. Verify that no firewalls or proxy configurations are blocking WebSocket connections.

#### Notifications Not Being Received

If notifications are being sent but not received:

1. Check that the client is properly initialized and connected.
2. Verify that notification handlers are registered properly.
3. Check for any errors in the browser console.
4. Ensure the notification object structure matches the expected format.

#### Circular Dependencies

The notification system uses dynamic imports to avoid circular dependencies:

```javascript
// Import WebSocket service dynamically to avoid circular imports
const { getWebSocketServer } = await import('./services/websocket');
```

If you encounter circular dependency issues, ensure you are using dynamic imports for the WebSocket service.