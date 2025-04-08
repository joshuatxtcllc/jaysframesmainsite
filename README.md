# Jay's Frames Notification System

This repository contains a standalone notification system for Jay's Frames e-commerce platform. The system provides real-time notifications for various events such as order updates, stock alerts, and system messages.

## Standalone HTML Demos

This notification system has been designed to work independently of server components, allowing you to test and use the functionality without requiring a full server setup.

### Available Demos:

1. **Main Demo Page**: Open `index.html` to see the available demo options
2. **Standalone Demo**: Open `notification-standalone.html` to see a full demo with no server dependencies
3. **Embed Demo**: Open `jf-notification-demo.html` to see how to embed the notification system in other applications
4. **Simple Demo**: Open `demo.html` to see a minimal implementation of the notification system

## Components

The notification system consists of several components:

### 1. Client Library (`jf-notification-client.js`)

A JavaScript library that provides the client-side functionality for the notification system. It includes:

- Real-time notification reception
- Notification display with badge counters
- Toast notifications
- Notification history
- Mark as read functionality

### 2. Server Implementation (`jf-notification-server.js`)

A reference server implementation that can be used to send notifications to connected clients. It includes:

- WebSocket server for real-time communication
- RESTful API for notification management
- Persistence of notification history
- User targeting and filtering

### Usage

To use the notification system in your own applications, include the `jf-notification-client.js` script and initialize it:

```javascript
// Initialize the notification client
const client = new JFNotificationClient({
  apiKey: 'your-api-key',        // Your API key for authentication (if required)
  autoConnect: true,             // Automatically connect on initialization (default: true)
  serverUrl: 'wss://example.com' // WebSocket server URL (default: auto-detect)
});

// Create a notification bell in a specific element
client.createNotificationBell(document.getElementById('notification-placeholder'));

// Listen for notifications
client.onNotification(function(notification) {
  console.log('New notification:', notification);
});
```

## Contact Information

For more information about Jay's Frames, visit our store or contact us:

- **Address**: 1440 1/2 Yale St. Houston TX 77008
- **Phone**: (832) 893-3794