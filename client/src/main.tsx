import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { toast } from "@/hooks/use-toast";

// Handle unhandled promise rejections early
window.addEventListener('unhandledrejection', (event) => {
  // Suppress WebSocket HMR connection errors that are blocking the app
  if (event.reason?.message?.includes('WebSocket') || event.reason?.message?.includes('wss://localhost:undefined')) {
    console.warn('Suppressing WebSocket HMR connection error - app will continue without hot reload');
    event.preventDefault();
    return;
  }
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

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

createRoot(document.getElementById("root")!).render(<App />);
