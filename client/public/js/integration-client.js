
/**
 * Jay's Frames Integration Client
 * Use this client to integrate your application with Jay's Frames
 */

(function() {
  const JFIntegration = function() {
    this.apiKey = null;
    this.appId = null;
    this.baseUrl = null;
    this.websocket = null;
    this.connected = false;
    this.listeners = {};
    
    // Initialize the integration client
    this.init = (config) => {
      if (!config || !config.apiKey || !config.appId) {
        console.error('Jay\'s Frames Integration: Missing required configuration (apiKey, appId)');
        return;
      }
      
      this.apiKey = config.apiKey;
      this.appId = config.appId;
      this.baseUrl = config.baseUrl || window.location.origin;
      
      console.log(`Jay's Frames Integration Client initialized for ${this.appId}`);
      
      // Connect to the WebSocket server if enabled
      if (config.enableRealtime !== false) {
        this.connectWebSocket();
      }
      
      // Register this app with the integration system
      this.registerApp();
      
      return this;
    };
    
    // Register this app with the integration system
    this.registerApp = async () => {
      try {
        const response = await fetch(`${this.baseUrl}/api/integration/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey
          },
          body: JSON.stringify({
            name: this.appId,
            appId: this.appId,
            type: 'notification',
            apiKey: this.apiKey
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Jay\'s Frames Integration: App registered successfully', data);
          return true;
        } else {
          console.error('Jay\'s Frames Integration: Failed to register app', await response.text());
          return false;
        }
      } catch (err) {
        console.error('Jay\'s Frames Integration: Error registering app', err);
        return false;
      }
    };
    
    // Connect to the WebSocket server
    this.connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${this.baseUrl.replace(/^https?:\/\//, '')}/api/ws`;
      
      this.websocket = new WebSocket(wsUrl);
      
      this.websocket.onopen = () => {
        this.connected = true;
        console.log('Jay\'s Frames Integration: WebSocket connected');
        
        // Register this app with the WebSocket server
        this.websocket.send(JSON.stringify({
          type: 'register',
          appId: this.appId,
          apiKey: this.apiKey
        }));
        
        // Setup ping to keep connection alive
        this.pingInterval = setInterval(() => {
          if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
        
        // Trigger connected event
        this.trigger('connected');
      };
      
      this.websocket.onclose = () => {
        this.connected = false;
        console.log('Jay\'s Frames Integration: WebSocket disconnected');
        
        // Clean up ping interval
        if (this.pingInterval) {
          clearInterval(this.pingInterval);
        }
        
        // Try to reconnect after a delay
        setTimeout(() => {
          this.connectWebSocket();
        }, 5000);
        
        // Trigger disconnected event
        this.trigger('disconnected');
      };
      
      this.websocket.onerror = (error) => {
        console.error('Jay\'s Frames Integration: WebSocket error', error);
        // Trigger error event
        this.trigger('error', error);
      };
      
      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle pong response
          if (data.type === 'pong') {
            return;
          }
          
          // Handle connection established
          if (data.type === 'connection_established') {
            console.log('Jay\'s Frames Integration: Connection established');
            return;
          }
          
          // Handle notification events
          if (data.type === 'notification' || 
              (data.type === 'event' && data.event === 'new_notification')) {
            // Trigger notification event
            this.trigger('notification', data.payload || data);
            return;
          }
          
          // Handle unknown message types
          console.log('Jay\'s Frames Integration: Received message', data);
          // Trigger message event
          this.trigger('message', data);
        } catch (err) {
          console.error('Jay\'s Frames Integration: Error processing WebSocket message', err);
        }
      };
    };
    
    // Send a message through the WebSocket
    this.send = (type, data) => {
      if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
        console.error('Jay\'s Frames Integration: WebSocket not connected');
        return false;
      }
      
      this.websocket.send(JSON.stringify({
        type,
        appId: this.appId,
        apiKey: this.apiKey,
        payload: data
      }));
      
      return true;
    };
    
    // Event handling
    this.on = (event, callback) => {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      
      this.listeners[event].push(callback);
      
      // Return a function to remove the listener
      return () => {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      };
    };
    
    // Trigger an event
    this.trigger = (event, data) => {
      if (!this.listeners[event]) {
        return;
      }
      
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (err) {
          console.error(`Jay's Frames Integration: Error in ${event} listener`, err);
        }
      });
    };
    
    // Sync data from Jay's Frames
    this.syncData = async (resource, options = {}) => {
      try {
        // Build the URL with query parameters
        let url = `${this.baseUrl}/api/integration/sync/${resource}`;
        const params = new URLSearchParams();
        
        if (options.since) {
          params.append('since', options.since);
        }
        
        if (options.limit) {
          params.append('limit', options.limit.toString());
        }
        
        if (options.format) {
          params.append('format', options.format);
        }
        
        // Add query parameters to the URL
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        // Make the request
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          console.error('Jay\'s Frames Integration: Failed to sync data', await response.text());
          return null;
        }
      } catch (err) {
        console.error('Jay\'s Frames Integration: Error syncing data', err);
        return null;
      }
    };
    
    // Send a notification to Jay's Frames
    this.sendNotification = async (title, description, type = 'info', options = {}) => {
      try {
        const response = await fetch(`${this.baseUrl}/api/notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey
          },
          body: JSON.stringify({
            title,
            description,
            source: this.appId,
            sourceId: options.sourceId || `${this.appId}-${Date.now()}`,
            type, // 'info', 'success', 'warning', 'error'
            actionable: options.actionable || false,
            link: options.link || '',
            smsEnabled: options.smsEnabled || false,
            smsRecipient: options.smsRecipient || ''
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          console.error('Jay\'s Frames Integration: Failed to send notification', await response.text());
          return null;
        }
      } catch (err) {
        console.error('Jay\'s Frames Integration: Error sending notification', err);
        return null;
      }
    };
  };
  
  // Create global integration instance
  window.jfIntegration = new JFIntegration();
})();
