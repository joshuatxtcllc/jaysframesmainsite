/**
 * Jay's Frames Notification Client
 * A unified notification system for Jay's Frames applications
 * 
 * This client library provides a simple API for sending and receiving notifications
 * in Jay's Frames applications. It supports WebSocket connections for real-time
 * notifications and falls back to polling via REST API if WebSockets are not available.
 * 
 * Usage:
 * 1. Initialize the client:
 *    const client = new JFNotificationClient({
 *      apiKey: 'your-api-key',        // Your API key for authentication (if required)
 *      autoConnect: true,             // Automatically connect on initialization (default: true)
 *      serverUrl: 'wss://example.com' // WebSocket server URL (default: auto-detect)
 *    });
 * 
 * 2. Listen for notifications:
 *    client.onNotification(function(notification) {
 *      console.log('New notification:', notification);
 *    });
 * 
 * 3. Get unread count:
 *    const count = client.getUnreadCount();
 * 
 * 4. Mark notifications as read:
 *    client.markAllAsRead();
 *    - or -
 *    client.markAsRead(notificationId);
 */

(function(global) {
  'use strict';
  
  /**
   * Jay's Frames Notification Client
   * @class
   */
  class JFNotificationClient {
    /**
     * Create a notification client
     * @param {Object} options - Configuration options
     * @param {string} [options.apiKey] - API key for authentication
     * @param {boolean} [options.autoConnect=true] - Automatically connect on initialization
     * @param {string} [options.serverUrl] - WebSocket server URL (default: auto-detect)
     * @param {boolean} [options.demoMode=false] - Run in demo mode without server connection
     */
    constructor(options = {}) {
      this.options = Object.assign({
        apiKey: null,
        autoConnect: true,
        serverUrl: null,
        demoMode: false
      }, options);
      
      this.connected = false;
      this.connecting = false;
      this.socket = null;
      this.notifications = [];
      this.listeners = [];
      this.connectionAttempts = 0;
      this.maxConnectionAttempts = 5;
      this.reconnectTimeout = null;
      this.pollingInterval = null;
      this.appId = this._generateAppId();
      
      // In demo mode, load sample notifications
      if (this.options.demoMode) {
        this._loadSampleNotifications();
      }
      
      // Auto-connect if enabled
      if (this.options.autoConnect) {
        this.connect();
      }
    }
    
    /**
     * Connect to the notification server
     * @returns {Promise} Resolves when connected, rejects on failure
     */
    connect() {
      if (this.connected || this.connecting) {
        return Promise.resolve();
      }
      
      this.connecting = true;
      
      // In demo mode, simulate connection
      if (this.options.demoMode) {
        return new Promise(resolve => {
          setTimeout(() => {
            this.connected = true;
            this.connecting = false;
            this._log('Connected in demo mode');
            this._triggerEvent('connected');
            resolve();
          }, 500);
        });
      }
      
      return new Promise((resolve, reject) => {
        try {
          // Determine server URL
          const serverUrl = this.options.serverUrl || this._getDefaultServerUrl();
          
          this._log(`Connecting to ${serverUrl}`);
          
          // Create WebSocket connection
          this.socket = new WebSocket(serverUrl);
          
          // Setup event handlers
          this.socket.onopen = () => {
            this._log('WebSocket connection established');
            this.connected = true;
            this.connecting = false;
            this.connectionAttempts = 0;
            
            // Register client
            this._sendMessage({
              type: 'register',
              appId: this.appId,
              apiKey: this.options.apiKey
            });
            
            this._triggerEvent('connected');
            resolve();
          };
          
          this.socket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              this._handleServerMessage(data);
            } catch (err) {
              this._log('Error parsing message:', err);
            }
          };
          
          this.socket.onclose = () => {
            this._log('WebSocket connection closed');
            this.connected = false;
            this._triggerEvent('disconnected');
            
            // Try to reconnect
            this._reconnect();
          };
          
          this.socket.onerror = (error) => {
            this._log('WebSocket error:', error);
            this.connecting = false;
            
            // Fall back to polling if WebSockets not supported
            if (this.connectionAttempts >= this.maxConnectionAttempts) {
              this._log('Max connection attempts reached, falling back to polling');
              this._startPolling();
              reject(new Error('WebSocket connection failed, falling back to polling'));
            }
          };
        } catch (err) {
          this._log('Error connecting:', err);
          this.connecting = false;
          
          // Fall back to polling
          this._startPolling();
          reject(err);
        }
      });
    }
    
    /**
     * Disconnect from the notification server
     */
    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
      
      this.connected = false;
      this._log('Disconnected');
      this._triggerEvent('disconnected');
    }
    
    /**
     * Register a callback for notifications
     * @param {Function} callback - Function to call when a notification is received
     * @returns {number} Listener ID
     */
    onNotification(callback) {
      if (typeof callback !== 'function') {
        throw new Error('Callback must be a function');
      }
      
      const id = Date.now();
      this.listeners.push({ id, callback });
      return id;
    }
    
    /**
     * Remove a notification listener
     * @param {number} id - Listener ID returned from onNotification
     */
    offNotification(id) {
      this.listeners = this.listeners.filter(listener => listener.id !== id);
    }
    
    /**
     * Get all notifications
     * @returns {Array} Array of notifications
     */
    getNotifications() {
      return [...this.notifications];
    }
    
    /**
     * Get unread notification count
     * @returns {number} Number of unread notifications
     */
    getUnreadCount() {
      return this.notifications.filter(n => !n.read).length;
    }
    
    /**
     * Mark all notifications as read
     * @returns {Promise} Resolves when complete
     */
    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.read = true;
      });
      
      // In demo mode, just update local state
      if (this.options.demoMode) {
        this._triggerEvent('notificationsRead');
        return Promise.resolve();
      }
      
      // Otherwise, send to server
      return this._makeApiRequest('/api/notifications/mark-all-read', {
        method: 'POST',
        body: JSON.stringify({
          appId: this.appId
        })
      }).then(() => {
        this._triggerEvent('notificationsRead');
      });
    }
    
    /**
     * Mark a specific notification as read
     * @param {string} id - Notification ID
     * @returns {Promise} Resolves when complete
     */
    markAsRead(id) {
      const notification = this.notifications.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
      
      // In demo mode, just update local state
      if (this.options.demoMode) {
        this._triggerEvent('notificationRead', { id });
        return Promise.resolve();
      }
      
      // Otherwise, send to server
      return this._makeApiRequest(`/api/notifications/${id}/read`, {
        method: 'POST',
        body: JSON.stringify({
          appId: this.appId
        })
      }).then(() => {
        this._triggerEvent('notificationRead', { id });
      });
    }
    
    /**
     * Create a new notification (for testing only)
     * Only works in demo mode
     * @param {Object} notification - Notification object
     */
    createNotification(notification) {
      if (!this.options.demoMode) {
        this._log('Create notification only works in demo mode');
        return;
      }
      
      const newNotification = {
        id: Date.now().toString(),
        title: notification.title || 'Notification',
        description: notification.description || '',
        source: notification.source || 'demo',
        sourceId: notification.sourceId || '',
        type: notification.type || 'info',
        timestamp: notification.timestamp || new Date().toISOString(),
        actionable: !!notification.actionable,
        link: notification.link || null,
        read: false
      };
      
      this.notifications.unshift(newNotification);
      this._notifyListeners(newNotification);
    }
    
    /**
     * Attempt to reconnect to the server
     * @private
     */
    _reconnect() {
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      
      this.connectionAttempts++;
      
      if (this.connectionAttempts < this.maxConnectionAttempts) {
        const delay = Math.min(1000 * (Math.pow(2, this.connectionAttempts) - 1), 30000);
        
        this._log(`Reconnecting in ${delay}ms (attempt ${this.connectionAttempts} of ${this.maxConnectionAttempts})`);
        
        this.reconnectTimeout = setTimeout(() => {
          this.connect().catch(() => {
            // Error handling is done in connect()
          });
        }, delay);
      } else {
        this._log('Max reconnection attempts reached, falling back to polling');
        this._startPolling();
      }
    }
    
    /**
     * Start polling for notifications
     * @private
     */
    _startPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }
      
      this._log('Starting polling for notifications');
      
      // Poll immediately, then at regular intervals
      this._pollForNotifications();
      
      this.pollingInterval = setInterval(() => {
        this._pollForNotifications();
      }, 30000); // Poll every 30 seconds
    }
    
    /**
     * Poll for new notifications
     * @private
     */
    _pollForNotifications() {
      // In demo mode, do nothing
      if (this.options.demoMode) {
        return;
      }
      
      this._makeApiRequest('/api/notifications', {
        method: 'GET'
      })
        .then(data => {
          if (Array.isArray(data)) {
            data.forEach(notification => {
              // Check if we already have this notification
              const exists = this.notifications.some(n => n.id === notification.id);
              if (!exists) {
                this.notifications.unshift(notification);
                this._notifyListeners(notification);
              }
            });
          }
        })
        .catch(err => {
          this._log('Error polling for notifications:', err);
        });
    }
    
    /**
     * Handle a message from the server
     * @param {Object} data - Message data
     * @private
     */
    _handleServerMessage(data) {
      if (!data || !data.type) {
        return;
      }
      
      switch (data.type) {
        case 'notification':
          if (data.payload) {
            this.notifications.unshift(data.payload);
            this._notifyListeners(data.payload);
          }
          break;
        
        case 'ping':
          this._sendMessage({
            type: 'pong'
          });
          break;
        
        case 'registered':
          this._log('Registered with server');
          this._triggerEvent('registered');
          break;
        
        default:
          this._log('Unknown message type:', data.type);
      }
    }
    
    /**
     * Send a message to the server
     * @param {Object} message - Message to send
     * @private
     */
    _sendMessage(message) {
      if (!this.connected || !this.socket) {
        this._log('Cannot send message: not connected');
        return;
      }
      
      try {
        this.socket.send(JSON.stringify(message));
      } catch (err) {
        this._log('Error sending message:', err);
      }
    }
    
    /**
     * Make an API request
     * @param {string} path - API path
     * @param {Object} options - Fetch options
     * @returns {Promise} Resolves with response data
     * @private
     */
    _makeApiRequest(path, options = {}) {
      const baseUrl = this._getApiBaseUrl();
      const url = `${baseUrl}${path}`;
      
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      if (this.options.apiKey) {
        defaultOptions.headers['X-API-Key'] = this.options.apiKey;
        defaultOptions.headers['X-App-ID'] = this.appId;
      }
      
      const fetchOptions = Object.assign(defaultOptions, options);
      
      return fetch(url, fetchOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
          }
          return response.json();
        });
    }
    
    /**
     * Get the default WebSocket server URL
     * @returns {string} WebSocket server URL
     * @private
     */
    _getDefaultServerUrl() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      return `${protocol}//${host}/ws`;
    }
    
    /**
     * Get the API base URL
     * @returns {string} API base URL
     * @private
     */
    _getApiBaseUrl() {
      return window.location.origin;
    }
    
    /**
     * Generate a unique app ID
     * @returns {string} Unique app ID
     * @private
     */
    _generateAppId() {
      return 'jf-app-' + Math.random().toString(36).substring(2, 15);
    }
    
    /**
     * Notify all listeners of a new notification
     * @param {Object} notification - Notification object
     * @private
     */
    _notifyListeners(notification) {
      this.listeners.forEach(listener => {
        try {
          listener.callback(notification);
        } catch (err) {
          this._log('Error in notification listener:', err);
        }
      });
      
      this._triggerEvent('notification', notification);
    }
    
    /**
     * Trigger an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     * @private
     */
    _triggerEvent(event, data) {
      const customEvent = new CustomEvent(`jfnotification:${event}`, {
        detail: data
      });
      
      window.dispatchEvent(customEvent);
    }
    
    /**
     * Log a message
     * @param {...*} args - Log arguments
     * @private
     */
    _log(...args) {
      if (window.console && window.console.log) {
        window.console.log('[JFNotificationClient]', ...args);
      }
    }
    
    /**
     * Load sample notifications (for demo mode)
     * @private
     */
    _loadSampleNotifications() {
      this.notifications = [
        {
          id: '1',
          title: 'New Order Received',
          description: 'A new custom frame order has been placed for 8x10 standard frame.',
          source: 'orders-app',
          sourceId: '12345',
          type: 'success',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          actionable: true,
          link: '/orders/12345',
          read: false
        },
        {
          id: '2',
          title: 'Low Inventory Alert',
          description: 'Black metal frame (16x20) is running low. Current stock: 5 units',
          source: 'inventory-app',
          sourceId: 'inv-12345',
          type: 'warning',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          actionable: true,
          link: '/inventory/restock',
          read: false
        },
        {
          id: '3',
          title: 'Customer Support Request',
          description: 'John Smith has a question about order #33456',
          source: 'support-app',
          sourceId: 'ticket-12345',
          type: 'info',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          actionable: true,
          link: '/support/tickets/2345',
          read: true
        },
        {
          id: '4',
          title: 'Payment Processing Failed',
          description: 'Unable to process payment for Order #78901. Please contact customer.',
          source: 'payment-app',
          sourceId: 'payment-12345',
          type: 'error',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          actionable: true,
          link: '/payments/failed/78901',
          read: true
        }
      ];
    }
  }
  
  // Export to global scope
  global.JFNotificationClient = JFNotificationClient;
  
})(typeof window !== 'undefined' ? window : this);