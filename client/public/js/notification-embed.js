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
  // Default options
  var options = {
    apiKey: null,
    autoConnect: true,
    target: null,
    styles: true
  };
  
  // Merge user options
  if (typeof window.jfNotificationOptions === 'object') {
    for (var key in window.jfNotificationOptions) {
      options[key] = window.jfNotificationOptions[key];
    }
  }
  
  // Add notification client script
  function loadClient() {
    var script = document.createElement('script');
    script.src = 'https://jaysframes.com/js/notification-client.js';
    script.async = true;
    script.onload = function() {
      console.log('[JF Notifications] Client script loaded');
      
      if (options.target) {
        createNotificationElement(options.target);
      }
    };
    document.head.appendChild(script);
  }
  
  // Add default styles if enabled
  if (options.styles) {
    var style = document.createElement('style');
    style.textContent = `
      .jf-notification-bell {
        position: relative;
        cursor: pointer;
        display: inline-block;
      }
      .jf-notification-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: #e11d48;
        color: white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        animation: jf-pulse 1.5s infinite;
      }
      .jf-notification-popup {
        position: absolute;
        top: 100%;
        right: 0;
        width: 300px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 1000;
        overflow: hidden;
        margin-top: 10px;
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
        transition: all 0.2s ease-in-out;
      }
      .jf-notification-popup.show {
        opacity: 1;
        transform: translateY(0);
        pointer-events: all;
      }
      .jf-notification-header {
        padding: 12px 16px;
        border-bottom: 1px solid #f1f5f9;
        font-weight: bold;
      }
      .jf-notification-body {
        max-height: 300px;
        overflow-y: auto;
      }
      .jf-notification-item {
        padding: 12px 16px;
        border-bottom: 1px solid #f1f5f9;
      }
      .jf-notification-item:last-child {
        border-bottom: none;
      }
      .jf-notification-title {
        font-weight: bold;
        margin-bottom: 4px;
      }
      .jf-notification-message {
        font-size: 14px;
        color: #64748b;
      }
      .jf-notification-footer {
        padding: 8px 16px;
        text-align: center;
        background: #f8fafc;
        font-size: 12px;
      }
      @keyframes jf-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create and mount notification bell element
  function createNotificationElement(targetSelector) {
    var target = document.querySelector(targetSelector);
    if (!target) {
      console.error('[JF Notifications] Target element not found:', targetSelector);
      return;
    }
    
    var notifications = [];
    var hasUnread = false;
    
    // Create bell container
    var bell = document.createElement('div');
    bell.className = 'jf-notification-bell';
    bell.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
      </svg>
      <span class="jf-notification-badge" style="display: none"></span>
      <div class="jf-notification-popup">
        <div class="jf-notification-header">Notifications</div>
        <div class="jf-notification-body">
          <div class="jf-notification-empty" style="padding: 32px 16px; text-align: center; color: #94a3b8;">
            No notifications yet
          </div>
        </div>
        <div class="jf-notification-footer">
          <a href="https://jaysframes.com/notifications" style="color: #0284c7; text-decoration: none;">
            View all notifications
          </a>
        </div>
      </div>
    `;
    
    target.appendChild(bell);
    
    // Get elements
    var badge = bell.querySelector('.jf-notification-badge');
    var popup = bell.querySelector('.jf-notification-popup');
    var body = bell.querySelector('.jf-notification-body');
    
    // Toggle popup on click
    bell.addEventListener('click', function(e) {
      e.stopPropagation();
      popup.classList.toggle('show');
      if (popup.classList.contains('show')) {
        hasUnread = false;
        badge.style.display = 'none';
        renderNotifications();
      }
    });
    
    // Close popup when clicking outside
    document.addEventListener('click', function() {
      popup.classList.remove('show');
    });
    
    // Prevent popup from closing when clicking inside it
    popup.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    
    // Render notifications
    function renderNotifications() {
      if (notifications.length === 0) {
        body.innerHTML = `
          <div class="jf-notification-empty" style="padding: 32px 16px; text-align: center; color: #94a3b8;">
            No notifications yet
          </div>
        `;
        return;
      }
      
      body.innerHTML = '';
      
      notifications.slice(0, 5).forEach(function(notification) {
        var item = document.createElement('div');
        item.className = 'jf-notification-item';
        
        // Color based on notification type
        var colors = {
          info: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        };
        
        var typeColor = colors[notification.type] || colors.info;
        
        item.innerHTML = `
          <div class="jf-notification-title" style="color: ${typeColor}">
            ${notification.title}
          </div>
          <div class="jf-notification-message">
            ${notification.description}
          </div>
        `;
        
        if (notification.actionable && notification.link) {
          item.style.cursor = 'pointer';
          item.addEventListener('click', function() {
            window.location.href = notification.link;
          });
        }
        
        body.appendChild(item);
      });
    }
    
    // Listen for notifications
    if (window.jfNotifications) {
      window.jfNotifications.onNotification(function(notification) {
        notifications.unshift(notification);
        hasUnread = true;
        badge.style.display = 'flex';
        
        if (popup.classList.contains('show')) {
          renderNotifications();
        }
      });
    }
  }
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadClient);
  } else {
    loadClient();
  }
})();