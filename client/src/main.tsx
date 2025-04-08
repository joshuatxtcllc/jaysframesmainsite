import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { toast } from "@/hooks/use-toast";

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
