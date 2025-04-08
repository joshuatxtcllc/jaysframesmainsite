import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import compression from "compression";

const app = express();
// Enable compression middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// HTTP to HTTPS redirect and www handling middleware for production
app.use((req, res, next) => {
  // Only apply in production environment
  if (process.env.NODE_ENV === 'production') {
    // Check if it's HTTP (not HTTPS)
    if (req.headers['x-forwarded-proto'] === 'http') {
      // Redirect to HTTPS
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
    }

    // Standardize on www or non-www (in this case, we're standardizing on non-www)
    const host = req.headers.host || '';
    if (host.startsWith('www.')) {
      // Redirect from www to non-www
      return res.redirect(301, `https://${host.substring(4)}${req.originalUrl}`);
    }
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Initialize WebSocket server
  try {
    const { getWebSocketServer } = await import('./services/websocket');
    getWebSocketServer(server);
    log('WebSocket notification system initialized');
  } catch (err) {
    log('Failed to initialize WebSocket server: ' + err, 'error');
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  // Handle 404 for API routes - must come after all API route definitions
  app.use('/api/*', (req, res) => {
    res.status(404).json({ message: "API endpoint not found" });
  });

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
