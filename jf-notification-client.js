/**
 * Jay's Frames Notification Client
 * A unified notification system for Jay's Frames applications
 */

(function() {
  // Define utility functions
  const jfNotifications = {
    appId: null,
    websocket: null,
    connected: false,
    
    // Initialize the connection
    init: function(appId, options = {}) {
      this.appId = appId;
      
      // Setup WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = options.dashboardUrl || window.location.host;
      const wsUrl = `${protocol}//${host}/ws`;
      
      console.log('[JF Notifications] Connecting to WebSocket:', wsUrl);
      
      try {
        this.websocket = new WebSocket(wsUrl);
        
        this.websocket.onopen = () => {
          console.log('[JF Notifications] Connected to ' + wsUrl);
          this.connected = true;
          
          // Register this app with the notification system
          this.sendMessage({
            type: 'register',
            appId: this.appId
          });
          
          // Setup ping to keep connection alive
          this.pingInterval = setInterval(() => {
            if (this.websocket && this.websocket.readyState === 1) { // OPEN
              this.sendMessage({ type: 'ping' });
            }
          }, 30000);
          
          if (options.onConnect) options.onConnect();
        };
        
        this.websocket.onclose = () => {
          console.log('[JF Notifications] Connection closed');
          this.connected = false;
          
          // Clean up ping interval
          if (this.pingInterval) {
            clearInterval(this.pingInterval);
          }
          
          // Setup reconnection
          setTimeout(() => {
            console.log('[JF Notifications] Attempting to reconnect...');
            this.init(this.appId, options);
          }, 5000);
          
          if (options.onDisconnect) options.onDisconnect();
        };
        
        this.websocket.onerror = (error) => {
          console.error('[JF Notifications] WebSocket error:', error);
          
          // If the WebSocket connection fails and we're using a fallback mode, switch to API-only
          if (options.fallbackMode && !this.connected) {
            console.log('[JF Notifications] Switching to API-only mode');
            if (options.onFallback) options.onFallback();
          }
        };
        
        this.websocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Handle received notifications
            if (data.type === 'notification' || 
                (data.type === 'event' && data.event === 'new_notification')) {
              
              const notification = data.payload;
              if (notification) {
                // Dispatch custom event that apps can listen for
                const notificationEvent = new CustomEvent('jf-notification', { 
                  detail: notification 
                });
                window.dispatchEvent(notificationEvent);
                
                // Call any registered handlers
                if (this.handlers.length > 0) {
                  this.handlers.forEach(handler => handler(notification));
                }
              }
            }
          } catch (error) {
            console.error('[JF Notifications] Error processing message:', error);
          }
        };
      } catch (error) {
        console.error('[JF Notifications] Error setting up WebSocket:', error);
        
        // If WebSocket initialization fails, switch to API-only mode
        if (options.fallbackMode) {
          console.log('[JF Notifications] Switching to API-only mode due to initialization error');
          if (options.onFallback) options.onFallback();
        }
      }
      
      return this;
    },
    
    // Send a message to the WebSocket
    sendMessage: function(message) {
      if (this.websocket && this.websocket.readyState === 1) { // OPEN
        this.websocket.send(JSON.stringify(message));
        return true;
      }
      return false;
    },
    
    // Send a notification to the unified system
    sendNotification: async function(title, description, type, options = {}) {
      if (!this.appId) {
        console.error('[JF Notifications] App not initialized. Call init first.');
        return null;
      }
      
      // Types: info, success, warning, error
      const validTypes = ['info', 'success', 'warning', 'error'];
      const notificationType = validTypes.includes(type) ? type : 'info';
      
      // Create notification object
      const notification = {
        id: Date.now().toString(),
        title,
        description,
        source: this.appId,
        sourceId: options.sourceId || '',
        type: notificationType,
        timestamp: new Date().toISOString(),
        actionable: options.actionable || false,
        link: options.link || '',
        smsEnabled: options.smsEnabled || false,
        smsRecipient: options.smsRecipient || ''
      };
      
      // Try WebSocket first
      const sent = this.sendMessage({
        type: 'event',
        event: 'new_notification',
        source: this.appId,
        payload: notification
      });
      
      // If WebSocket isn't available, fall back to API
      if (!sent) {
        try {
          const apiUrl = options.apiUrl || '/api/notifications';
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(notification)
          });
          
          if (response.ok) {
            const data = await response.json();
            return data.notification || notification;
          }
        } catch (error) {
          console.error('[JF Notifications] Error sending notification:', error);
        }
      }
      
      // If we're in demo mode, just return the notification object
      if (options.demoMode) {
        // Simulate a successful notification dispatch
        return notification;
      }
      
      return sent ? notification : null;
    },
    
    // Get all notifications
    getNotifications: async function(options = {}) {
      try {
        const apiUrl = options.apiUrl || '/api/notifications';
        const response = await fetch(apiUrl);
        
        if (response.ok) {
          const data = await response.json();
          return data.notifications || [];
        }
      } catch (error) {
        console.error('[JF Notifications] Error fetching notifications:', error);
        
        // If in demo mode, return demo notifications
        if (options.demoMode) {
          return this.getDemoNotifications();
        }
      }
      return [];
    },
    
    // Generate demo notifications (for demo mode)
    getDemoNotifications: function() {
      const now = new Date().toISOString();
      const fiveMinAgo = new Date(Date.now() - 5 * 60000).toISOString();
      const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
      const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
      
      return [
        {
          id: '1',
          title: 'New Order Received',
          description: 'A new custom frame order has been placed for 8x10 standard frame.',
          source: 'orders-app',
          sourceId: '12345',
          type: 'success',
          timestamp: now,
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
          timestamp: fiveMinAgo,
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
          timestamp: oneHourAgo,
          actionable: true,
          link: '/support/tickets/2345'
        },
        {
          id: '4',
          title: 'Payment Processing Failed',
          description: 'Unable to process payment for Order #55432. Please contact customer.',
          source: 'payment-app',
          sourceId: 'PAY-8765',
          type: 'error',
          timestamp: oneDayAgo,
          actionable: true,
          link: '/payments/failed/8765'
        }
      ];
    },
    
    // Handler functions for notifications
    handlers: [],
    
    // Register a handler for notifications
    onNotification: function(handler) {
      if (typeof handler === 'function') {
        this.handlers.push(handler);
        
        // Return a function to unregister this handler
        return () => {
          this.handlers = this.handlers.filter(h => h !== handler);
        };
      }
    }
  };
  
  // Make available globally
  window.jfNotifications = jfNotifications;
  
  // Auto-initialize if configuration is provided
  if (window.jfNotificationOptions) {
    document.addEventListener('DOMContentLoaded', function() {
      const options = window.jfNotificationOptions;
      if (options.autoConnect !== false && options.apiKey) {
        jfNotifications.init(options.apiKey, options);
      }
    });
  }
})();