import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { toast } from "@/hooks/use-toast";

// Handle WebSocket connection issues gracefully
if (typeof window !== 'undefined') {
  const originalWebSocket = window.WebSocket;
  window.WebSocket = function(url: string | URL, protocols?: string | string[]) {
    const urlString = url.toString();
    if (urlString.includes('localhost:undefined') || urlString.includes('wss://localhost:undefined')) {
      console.warn('Blocked problematic WebSocket connection:', urlString);
      // Return a mock WebSocket that appears closed
      return {
        readyState: 3, // CLOSED
        close: () => {},
        send: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        onopen: null,
        onclose: null,
        onmessage: null,
        onerror: null
      } as any;
    }
    return new originalWebSocket(url, protocols);
  };
}

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('WebSocket') || 
      event.reason?.message?.includes('wss://localhost:undefined')) {
    console.warn('Suppressed WebSocket error');
    event.preventDefault();
    return;
  }
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

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
