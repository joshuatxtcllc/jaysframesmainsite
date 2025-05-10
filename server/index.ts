import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import compression from "compression";
import fileUpload from "express-fileupload";
import twilio from 'twilio';
import { startAutomationSystem } from './services/automation';
import { larsonJuhlCatalogService } from './services/catalog'; // Import the service
import { db } from './db';
import { blogCategories, blogPosts } from '../shared/schema'; // Import blog schema


// Initialize Twilio client for SMS notifications
export let twilioClient: any = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  console.log('Twilio client initialized for SMS messaging');
}

const app = express();
// Enable compression middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
// Setup file upload middleware
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  abortOnLimit: true,
  createParentPath: true,
  useTempFiles: false
}));

// HTTP to HTTPS redirect and www handling middleware for production
app.use((req, res, next) => {
  // Only apply in production environment
  if (process.env.NODE_ENV === 'production') {
    // Check if it's HTTP (not HTTPS)
    if (req.headers['x-forwarded-proto'] === 'http') {
      // Redirect to HTTPS
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }

    // Standardize on www or non-www (in this case, we're standardizing on non-www)
    const host = req.headers.host || '';
    if (host.startsWith('www.')) {
      // Redirect from www to non-www
      return res.redirect(301, `https://${host.substring(4)}${req.url}`);
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

  // Add a catch-all route for client-side routing
  // This will ensure that all non-API routes are handled by the client-side router
  app.use('*', (req, res, next) => {
    const path = req.originalUrl;
    // Skip this middleware for assets and API requests
    if (path.startsWith('/assets/') || path.startsWith('/api/')) {
      return next();
    }
    // Handle client-side routing by sending the main HTML file
    if (app.get("env") === "development") {
      // In development, let Vite handle it
      next();
    } else {
      // In production, serve the static index.html
      res.sendFile('index.html', { root: './dist/public' });
    }
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

    // Start the automation system after server is running
    startAutomationSystem();
  });
})();

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // In a production app, you might want to notify an admin or log to a service
  // process.exit(1); // Uncomment this in production to restart the service
});

// Initialize Larson Juhl catalog and blog tables
(async () => {
  try {
    // Initialize the Larson Juhl catalog
    console.log('Initializing Larson Juhl catalog...');
    await larsonJuhlCatalogService.importCatalog();

    // Initialize blog tables if they don't exist
    console.log('Checking and initializing blog tables...');
    try {
      // Check if blog categories table exists by doing a simple query
      await db.select().from(blogCategories).limit(1);
      console.log('Blog categories table exists');
    } catch (error) {
      console.log('Creating blog tables...');
      // Initialize blog sample data
      await db.initializeBlogData(); 
      console.log('Blog tables initialized with sample data');
    }
  } catch (error) {
    console.error('Error during initialization:', error);
  }
})();

const PORT = process.env.PORT || 5000;