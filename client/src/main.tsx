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

// Force app to render even if there are connection issues
setTimeout(() => {
  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(<App />);
  }
}, 0);
