import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Ultra-minimal main.tsx to avoid any complex dependencies
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
