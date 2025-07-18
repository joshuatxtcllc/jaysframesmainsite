import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Block WebSocket connections at the main level too
if (typeof window !== 'undefined' && window.WebSocket) {
  const originalWebSocket = window.WebSocket;
  window.WebSocket = function(url: string | URL, protocols?: string | string[]) {
    console.warn('WebSocket connection blocked:', url);
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
  };
}

// Ultra-minimal main.tsx to avoid any complex dependencies
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
