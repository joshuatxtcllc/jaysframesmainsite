/**
 * Jay's Frames Notification Client
 * A unified notification system for Jay's Frames applications
 */

(function() {
  const JFNotifications = function() {
    this.notificationQueue = [];
    this.listeners = [];
    this.connected = false;
    
    // Initialize notification client
    this.init = () => {
      console.log('Jay\'s Frames Notification Client initialized');
      
      // Try to connect to the notification backend
      this.connected = true;
      
      // Dispatch all queued notifications if we're now connected
      if (this.connected && this.notificationQueue.length > 0) {
        console.log(`Processing ${this.notificationQueue.length} queued notifications`);
        this.notificationQueue.forEach(notification => {
          this.dispatchNotification(notification);
        });
        this.notificationQueue = [];
      }
    };
    
    // Send a notification through the system
    this.sendNotification = async (title, description, type = 'info', options = {}) => {
      const notification = {
        title,
        description,
        type,
        timestamp: new Date().toISOString(),
        source: options.source || 'jaysframes-web',
        sourceId: options.sourceId || `notification-${Date.now()}`,
        actionable: options.actionable || false,
        link: options.link || '',
        ...options
      };
      
      if (this.connected) {
        return await this.dispatchNotification(notification);
      } else {
        // Queue notification for later
        this.notificationQueue.push(notification);
        console.log('Notification queued for later delivery');
        return false;
      }
    };
    
    // Dispatch a notification to all listeners and the API
    this.dispatchNotification = async (notification) => {
      // First, notify all registered listeners
      this.listeners.forEach(listener => {
        try {
          listener(notification);
        } catch (err) {
          console.error('Error in notification listener:', err);
        }
      });
      
      // Then, try to send to the API
      try {
        const apiEndpoint = '/api/notifications';
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notification)
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Notification sent successfully:', data);
          return true;
        } else {
          console.error('Failed to send notification:', await response.text());
          return false;
        }
      } catch (err) {
        console.error('Error sending notification to API:', err);
        return false;
      }
    };
    
    // Register a notification listener
    this.onNotification = (listener) => {
      if (typeof listener !== 'function') {
        console.error('Notification listener must be a function');
        return;
      }
      
      this.listeners.push(listener);
      console.log(`Notification listener registered (total: ${this.listeners.length})`);
      
      // Return a function to unregister the listener
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
        console.log(`Notification listener unregistered (total: ${this.listeners.length})`);
      };
    };
  };
  
  // Create global notification instance
  window.jfNotifications = new JFNotifications();
  
  // Initialize when the page loads
  window.addEventListener('DOMContentLoaded', () => {
    window.jfNotifications.init();
    
    // Add this script to the embedded script if found
    const embeddedScript = document.getElementById('jf-notification-script');
    if (embeddedScript && typeof embeddedScript.onClientLoaded === 'function') {
      embeddedScript.onClientLoaded(window.jfNotifications);
    }
  });
})();