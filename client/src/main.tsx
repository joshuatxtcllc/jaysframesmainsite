import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { toast } from "@/hooks/use-toast";

// Handle unhandled promise rejections early
window.addEventListener('unhandledrejection', (event) => {
  // Suppress WebSocket HMR connection errors that are blocking the app
  if (event.reason?.message?.includes('WebSocket') || 
      event.reason?.message?.includes('wss://localhost:undefined') ||
      event.reason?.stack?.includes('WebSocket')) {
    console.warn('Suppressing WebSocket HMR connection error - app will continue without hot reload');
    event.preventDefault();
    return;
  }
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Override WebSocket constructor to prevent HMR connection attempts
if (typeof window !== 'undefined') {
  const originalWebSocket = window.WebSocket;
  window.WebSocket = class extends originalWebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      const urlString = url.toString();
      if (urlString.includes('localhost:undefined') || urlString.includes('wss://localhost:undefined')) {
        console.warn('Blocked invalid WebSocket connection attempt:', urlString);
        // Create a dummy WebSocket that doesn't actually connect
        const dummySocket = Object.create(WebSocket.prototype);
        dummySocket.readyState = WebSocket.CONNECTING;
        setTimeout(() => {
          dummySocket.readyState = WebSocket.CLOSED;
          if (dummySocket.onclose) dummySocket.onclose({ code: 1006, reason: 'Blocked invalid connection' });
        }, 100);
        return dummySocket;
      }
      super(url, protocols);
    }
  };
}

// Handle uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
});

// Export the toast function to the window object for the notification system
window.showToast = ({ title, description, variant = 'default', duration = 5000 }) => {
  toast({
    title,
    description,
    variant: variant as any,
    duration
  });
};

// Test basic functionality first
console.log("main.tsx is loading...");
console.log("DOM state:", document.readyState);
console.log("Root element exists:", !!document.getElementById("root"));

// Simple test render
const root = document.getElementById("root");
if (root) {
  console.log("Attempting to render app...");
  try {
    root.innerHTML = '<div style="min-height: 100vh; background: black; color: white; display: flex; align-items: center; justify-content: center; font-family: Arial;"><div><h1 style="color: teal;">Jay\'s Frames Test</h1><p>Direct HTML render working</p></div></div>';
    console.log("HTML render successful");
    
    // Now try React
    setTimeout(() => {
      console.log("Attempting React render...");
      createRoot(root).render(<App />);
    }, 100);
  } catch (error) {
    console.error("Render error:", error);
    root.innerHTML = '<div style="color: red; padding: 20px;">Error: ' + error.message + '</div>';
  }
} else {
  console.error("Root element not found");
}
