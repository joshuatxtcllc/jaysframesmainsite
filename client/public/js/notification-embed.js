/**
 * Jay's Frames Notification Embed Script
 * 
 * This script allows you to add Jay's Frames notifications to any application.
 * It loads the notification client and provides a simple API for sending and receiving notifications.
 * 
 * Usage:
 * 1. Add this script to your HTML:
 *    <script id="jf-notification-script" src="https://jaysframes.com/js/notification-embed.js"></script>
 * 
 * 2. Configure options (optional):
 *    <script>
 *      var jfNotificationOptions = {
 *        apiKey: 'your-api-key',        // Your API key for authentication (if required)
 *        autoConnect: true,             // Automatically connect on page load (default: true)
 *        target: '#notification-bell',  // CSS selector for notification bell element (optional)
 *        styles: true                   // Include default styles (default: true)
 *      };
 *    </script>
 * 
 * 3. Listen for notifications:
 *    <script>
 *      document.getElementById('jf-notification-script').onClientLoaded = function(client) {
 *        client.onNotification(function(notification) {
 *          console.log('New notification:', notification);
 *        });
 *      };
 *    </script>
 */

(function() {
  let notificationsLoaded = false;
  let clientScript = null;
  let notificationElement = null;
  let notificationBadge = null;
  let notificationDropdown = null;
  let notificationCount = 0;
  let notifications = [];
  
  // Set defaults for configuration
  const options = window.jfNotificationOptions || {};
  options.apiKey = options.apiKey || 'embedded-app';
  options.autoConnect = options.autoConnect !== false;
  options.target = options.target || null;
  options.styles = options.styles !== false;
  options.dashboardUrl = options.dashboardUrl || window.location.origin;

  // Make options globally available
  window.jfNotificationOptions = options;
  
  // Find the script element
  const scripts = document.getElementsByTagName('script');
  let scriptElement;
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.includes('notification-embed.js')) {
      scriptElement = scripts[i];
      break;
    }
  }

  // Default to the current script if not found
  if (!scriptElement) {
    scriptElement = document.currentScript;
  }
  
  // Load the notification client script
  function loadClient() {
    if (notificationsLoaded) return;
    
    const basePath = getScriptBasePath();
    
    // Create script element for notifications client
    clientScript = document.createElement('script');
    clientScript.src = basePath + 'notification-client.js';
    clientScript.async = true;
    
    clientScript.onload = function() {
      notificationsLoaded = true;
      console.log('[JF Notifications] Client loaded');
      
      // Apply styles if enabled
      if (options.styles) {
        addStyles();
      }
      
      // Create notification element if target is specified
      if (options.target) {
        createNotificationElement(options.target);
      }
      
      // Initialize the client if auto-connect is enabled
      if (options.autoConnect) {
        window.jfNotifications.init(options.apiKey, {
          dashboardUrl: options.dashboardUrl,
          onConnect: function() {
            console.log('[JF Notifications] Connected to notification system');
            
            // Set up notification handler to update badge count
            window.jfNotifications.onNotification(function(notification) {
              notificationCount++;
              notifications.unshift(notification);
              updateNotificationBadge();
              
              // Limit stored notifications to 10
              if (notifications.length > 10) {
                notifications.pop();
              }
            });
            
            // Fire the onClientLoaded callback if it exists
            if (typeof scriptElement.onClientLoaded === 'function') {
              scriptElement.onClientLoaded(window.jfNotifications);
            }
          }
        });
      }
    };
    
    clientScript.onerror = function() {
      console.error('[JF Notifications] Failed to load client');
    };
    
    document.head.appendChild(clientScript);
  }
  
  // Get the base path for the script
  function getScriptBasePath() {
    let basePath = '/js/';
    
    if (scriptElement && scriptElement.src) {
      const srcPath = scriptElement.src;
      const lastSlash = srcPath.lastIndexOf('/');
      if (lastSlash !== -1) {
        basePath = srcPath.substring(0, lastSlash + 1);
      }
    }
    
    return basePath;
  }
  
  // Add styles for notification elements
  function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .jf-notification-bell {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 40px;
        cursor: pointer;
      }
      .jf-notification-bell svg {
        width: 24px;
        height: 24px;
        fill: currentColor;
      }
      .jf-notification-badge {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #f44336;
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
      .jf-notification-dropdown {
        position: absolute;
        top: 45px;
        right: 0;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 300px;
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
      }
      .jf-notification-dropdown.active {
        display: block;
      }
      .jf-notification-header {
        padding: 10px 15px;
        font-weight: bold;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .jf-notification-clear {
        font-size: 12px;
        color: #666;
        cursor: pointer;
      }
      .jf-notification-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .jf-notification-item {
        padding: 10px 15px;
        border-bottom: 1px solid #eee;
      }
      .jf-notification-item:last-child {
        border-bottom: none;
      }
      .jf-notification-item.info {
        border-left: 3px solid #2196F3;
      }
      .jf-notification-item.success {
        border-left: 3px solid #4CAF50;
      }
      .jf-notification-item.warning {
        border-left: 3px solid #FF9800;
      }
      .jf-notification-item.error {
        border-left: 3px solid #f44336;
      }
      .jf-notification-title {
        font-weight: bold;
        margin-bottom: 5px;
      }
      .jf-notification-description {
        color: #666;
        font-size: 14px;
        margin-bottom: 5px;
      }
      .jf-notification-meta {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #999;
      }
      .jf-notification-empty {
        padding: 20px;
        text-align: center;
        color: #999;
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  // Create notification bell element
  function createNotificationElement(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) {
      console.error(`[JF Notifications] Target element not found: ${targetSelector}`);
      return;
    }
    
    // Create notification bell
    notificationElement = document.createElement('div');
    notificationElement.className = 'jf-notification-bell';
    notificationElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    `;
    
    // Create notification badge
    notificationBadge = document.createElement('div');
    notificationBadge.className = 'jf-notification-badge';
    notificationBadge.style.display = 'none';
    notificationElement.appendChild(notificationBadge);
    
    // Create notification dropdown
    notificationDropdown = document.createElement('div');
    notificationDropdown.className = 'jf-notification-dropdown';
    
    // Dropdown header
    const header = document.createElement('div');
    header.className = 'jf-notification-header';
    header.innerHTML = `
      <span>Notifications</span>
      <span class="jf-notification-clear">Clear All</span>
    `;
    notificationDropdown.appendChild(header);
    
    // Notification list
    const list = document.createElement('ul');
    list.className = 'jf-notification-list';
    notificationDropdown.appendChild(list);
    
    // Add empty state
    renderNotifications();
    
    notificationElement.appendChild(notificationDropdown);
    
    // Toggle dropdown on click
    notificationElement.addEventListener('click', function(event) {
      event.stopPropagation();
      notificationDropdown.classList.toggle('active');
      
      // Reset badge count when dropdown is opened
      if (notificationDropdown.classList.contains('active')) {
        notificationCount = 0;
        updateNotificationBadge();
      }
    });
    
    // Clear notifications on clear all click
    header.querySelector('.jf-notification-clear').addEventListener('click', function(event) {
      event.stopPropagation();
      notifications = [];
      renderNotifications();
      notificationCount = 0;
      updateNotificationBadge();
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
      notificationDropdown.classList.remove('active');
    });
    
    // Prevent dropdown from closing when clicking inside it
    notificationDropdown.addEventListener('click', function(event) {
      event.stopPropagation();
    });
    
    // Add to target element
    target.appendChild(notificationElement);
  }
  
  // Update notification badge count
  function updateNotificationBadge() {
    if (!notificationBadge) return;
    
    if (notificationCount > 0) {
      notificationBadge.textContent = notificationCount > 9 ? '9+' : notificationCount;
      notificationBadge.style.display = 'flex';
    } else {
      notificationBadge.style.display = 'none';
    }
    
    // Update notification list
    renderNotifications();
  }
  
  // Render notification list
  function renderNotifications() {
    if (!notificationDropdown) return;
    
    const list = notificationDropdown.querySelector('.jf-notification-list');
    if (!list) return;
    
    if (notifications.length === 0) {
      list.innerHTML = '<div class="jf-notification-empty">No notifications</div>';
      return;
    }
    
    list.innerHTML = '';
    
    notifications.forEach(notification => {
      const item = document.createElement('li');
      item.className = `jf-notification-item ${notification.type}`;
      
      const title = document.createElement('div');
      title.className = 'jf-notification-title';
      title.textContent = notification.title;
      
      const description = document.createElement('div');
      description.className = 'jf-notification-description';
      description.textContent = notification.description;
      
      const meta = document.createElement('div');
      meta.className = 'jf-notification-meta';
      
      const source = document.createElement('span');
      source.textContent = notification.source;
      
      const time = document.createElement('span');
      time.textContent = formatTimestamp(notification.timestamp);
      
      meta.appendChild(source);
      meta.appendChild(time);
      
      item.appendChild(title);
      item.appendChild(description);
      item.appendChild(meta);
      
      // Add click handler for actionable notifications
      if (notification.actionable && notification.link) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
          window.open(notification.link, '_blank');
        });
      }
      
      list.appendChild(item);
    });
  }
  
  // Format timestamp for display
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin}m ago`;
    } else if (diffHour < 24) {
      return `${diffHour}h ago`;
    } else if (diffDay < 7) {
      return `${diffDay}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  // Load the client on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadClient);
  } else {
    loadClient();
  }
})();