import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { WebSocketServer, WebSocket } from 'ws';
import cookieParser from 'cookie-parser';
import { AuthService, registerSchema, loginSchema } from './services/auth';
import { authenticateToken, requireAdmin, requireStaff, optionalAuth } from './middleware/auth';
import { 
  insertOrderSchema, 
  insertChatMessageSchema, 
  insertBlogCategorySchema, 
  insertBlogPostSchema 
} from "@shared/schema";
import { handleChatRequest, getFrameRecommendations, askFrameAssistant, analyzeArtworkImage, generateAIResponse, type ChatMessage } from "./ai";
import { 
  sendNotification,
  sendEmail,
  sendSmsNotification,
  initializeEmailTransporter,
  NotificationType,
  formatOrderStatusNotification
} from "./services/notification";
import { 
  processOrders, 
  getAutomationStatus, 
  updateAutomationSettings, 
  startAutomationSystem, 
  stopAutomationSystem 
} from "./services/automation";
import { handleRedirects } from "./redirects";
import { larsonJuhlCatalogService } from "./services/catalog";
import { integrationService } from "./services/integrations";
import { contentManager } from "./services/content-manager";
import { createAutomatedBlogPost, previewNextBlogPost } from "./blog-automation";
import { blogScheduler } from "./blog-scheduler";
import Stripe from "stripe";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found. Payment processing will be disabled.');
}
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Utility function for price formatting
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price / 100);
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize services
  await initializeEmailTransporter();

  // Add cookie parser middleware
  app.use(cookieParser());

  // Start automated order processing is handled in server/index.ts

  // API Routes
  const apiRouter = app.route("/api");

  // Authentication routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const result = await AuthService.register(req.body);

      if (result.success && result.token) {
        // Set JWT token as httpOnly cookie
        res.cookie('auth-token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
          success: true,
          user: result.user,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Registration route error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const result = await AuthService.login(req.body);

      if (result.success && result.token) {
        // Set JWT token as httpOnly cookie
        res.cookie('auth-token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
          success: true,
          user: result.user,
          message: result.message
        });
      } else {
        res.status(401).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Login route error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    res.clearCookie('auth-token');
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });

  app.get("/api/auth/profile", authenticateToken, async (req: Request, res: Response) => {
    try {
      const user = await AuthService.getProfile(req.user!.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Profile route error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  app.patch("/api/auth/profile", authenticateToken, async (req: Request, res: Response) => {
    try {
      const result = await AuthService.updateProfile(req.user!.id, req.body);

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Update profile route error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  app.get("/api/auth/check", optionalAuth, (req: Request, res: Response) => {
    res.json({
      authenticated: !!req.user,
      user: req.user || null
    });
  });

  // API Documentation and Integration
  app.get("/api/docs", (req: Request, res: Response) => {

  // Health check endpoint for root path
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });


    const apiDocs = {
      version: "1.0.0",
      baseUrl: `${req.protocol}://${req.get('host')}/api`,
      authentication: "API Key (add 'X-API-Key' header to requests)",
      endpoints: [
        {
          path: "/products",
          method: "GET",
          description: "Get all products",
          parameters: {},
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: "number",
                name: "string",
                description: "string",
                price: "number",
                category: "string",
                imageUrl: "string | null",
                details: "object | null"
              }
            }
          }
        },
        {
          path: "/products/category/:category",
          method: "GET",
          description: "Get products by category",
          parameters: {
            category: "string - Category name (e.g. 'readymade', 'custom', 'shadowbox')"
          }
        },
        {
          path: "/products/:id",
          method: "GET",
          description: "Get product by ID",
          parameters: {
            id: "number"
          }
        },
        {
          path: "/frame-options",
          method: "GET",
          description: "Get all available frame options",
          parameters: {}
        },
        {
          path: "/mat-options",
          method: "GET",
          description: "Get all available mat options",
          parameters: {}
        },
        {
          path: "/glass-options",
          method: "GET",
          description: "Get all available glass options",
          parameters: {}
        },
        {
          path: "/orders",
          method: "GET",
          description: "Get all orders (requires authentication)",
          parameters: {}
        },
        {
          path: "/orders/:id",
          method: "GET",
          description: "Get order by ID (requires authentication)",
          parameters: {
            id: "number"
          }
        },
        {
          path: "/orders",
          method: "POST",
          description: "Create a new order",
          parameters: {
            customerName: "string",
            customerEmail: "string",
            customerPhone: "string",
            items: "array of order items",
            status: "string",
            totalAmount: "number"
          }
        },
        {
          path: "/frame-recommendations",
          method: "POST",
          description: "Get AI frame recommendations",
          parameters: {
            artworkDescription: "string",
            colors: "array of strings (optional)",
            style: "string (optional)",
            budget: "number (optional)"
          }
        },
        {
          path: "/frame-assistant",
          method: "POST",
          description: "Direct questions to the Frame Design Assistant AI",
          parameters: {
            message: "string - User's question about framing"
          }
        },
        {
          path: "/integration/status",
          method: "GET",
          description: "Check the status of the API system and available endpoints",
          parameters: {}
        },
        {
          path: "/integration/webhooks",
          method: "POST",
          description: "Register a webhook URL to receive notifications",
          parameters: {
            url: "string - The URL that will receive webhook events",
            events: "array - Array of event types to subscribe to",
            description: "string (optional) - Description of this webhook",
            apiKey: "string - Your API key for authentication"
          }
        },
        {
          path: "/integration/sync/:resource",
          method: "GET",
          description: "Retrieve bulk data for synchronization with external systems",
          parameters: {
            resource: "string - Resource type (products, orders, frame-options, etc.)",
            since: "string (optional) - ISO date to filter by creation date",
            limit: "number (optional) - Maximum number of records to return",
            format: "string (optional) - Response format (json or csv)"
          }
        }
      ]
    };

    res.json(apiDocs);
  });

  // Get all products
  app.get("/api/products", async (req: Request, res: Response) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req: Request, res: Response) => {
    const { category } = req.params;
    const products = await storage.getProductsByCategory(category);
    res.json(products);
  });

  // Get single product
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await storage.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  });

  // Get frame options
  app.get("/api/frame-options", async (req: Request, res: Response) => {
    const options = await storage.getFrameOptions();
    res.json(options);
  });

  // Get Larson Juhl frame catalog
  app.get("/api/catalog/larson-juhl", async (req: Request, res: Response) => {
    try {
      const frames = await larsonJuhlCatalogService.getFrames();
      res.json(frames);
    } catch (error) {
      console.error("Error fetching Larson Juhl catalog:", error);
      res.status(500).json({ message: "Failed to fetch Larson Juhl catalog" });
    }
  });

  // Get Larson Juhl collection list
  app.get("/api/catalog/larson-juhl/collections", async (req: Request, res: Response) => {
    try {
      const collections = await larsonJuhlCatalogService.getCollections();
      res.json(collections);
    } catch (error) {
      console.error("Error fetching Larson Juhl collections:", error);
      res.status(500).json({ message: "Failed to fetch Larson Juhl collections" });
    }
  });

  // Get frames by collection
  app.get("/api/catalog/larson-juhl/collections/:collection", async (req: Request, res: Response) => {
    try {
      const { collection } = req.params;
      const frames = await larsonJuhlCatalogService.getFramesByCollection(collection);
      res.json(frames);
    } catch (error) {
      console.error("Error fetching frames by collection:", error);
      res.status(500).json({ message: "Failed to fetch frames by collection" });
    }
  });

  // Import Larson Juhl catalog (admin only)
  app.post("/api/catalog/larson-juhl/import", async (req: Request, res: Response) => {
    try {
      // In a real implementation, this would be protected by authentication
      const importedFrames = await larsonJuhlCatalogService.importCatalog();
      res.json({ 
        success: true, 
        message: `Successfully imported ${importedFrames.length} frames from Larson Juhl catalog`,
        frames: importedFrames
      });
    } catch (error) {
      console.error("Error importing Larson Juhl catalog:", error);
      res.status(500).json({ message: "Failed to import Larson Juhl catalog" });
    }
  });

  // Get mat options
  app.get("/api/mat-options", async (req: Request, res: Response) => {
    const options = await storage.getMatOptions();
    res.json(options);
  });

  // Get reveal size options
  app.get("/api/reveal-sizes", async (req: Request, res: Response) => {
    const options = await storage.getRevealSizes();
    res.json(options);
  });

  // Get glass options
  app.get("/api/glass-options", async (req: Request, res: Response) => {
    const options = await storage.getGlassOptions();
    res.json(options);
  });

  // Apply redirect middleware before the static file handler
  app.use(handleRedirects);

  // CONTENT MANAGEMENT ROUTES

  // Get all content
  app.get("/api/content", async (req: Request, res: Response) => {
    try {
      const { page, section } = req.query;

      let content;
      if (page && section) {
        content = await contentManager.getContentBySection(page.toString(), section.toString());
      } else if (page) {
        content = await contentManager.getContentByPage(page.toString());
      } else {
        content = await contentManager.getAllContent();
      }

      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // Get single content block
  app.get("/api/content/:key", async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const content = await contentManager.getContent(key);

      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // Update content block
  app.patch("/api/content/:key", async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const updates = req.body;

      const content = await contentManager.updateContent(key, updates);

      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      res.json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  // Create new content block
  app.post("/api/content", async (req: Request, res: Response) => {
    try {
      const contentData = req.body;
      const content = await contentManager.createContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({ message: "Failed to create content" });
    }
  });

  // Delete content block
  app.delete("/api/content/:key", async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const success = await contentManager.deleteContent(key);

      if (!success) {
        return res.status(404).json({ message: "Content not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  // Get content structure (pages and sections)
  app.get("/api/content-structure", async (req: Request, res: Response) => {
    try {
      const structure = await contentManager.getContentStructure();
      res.json(structure);
    } catch (error) {
      console.error("Error fetching content structure:", error);
      res.status(500).json({ message: "Failed to fetch content structure" });
    }
  });

  // IMAGE MANAGEMENT ROUTES

  // Upload image
  app.post("/api/images/upload", async (req: Request, res: Response) => {
    try {
      // Note: You'll need to set up multer middleware for file uploads
      // For now, this is a placeholder that expects base64 data
      const { imageData, filename, alt } = req.body;

      if (!imageData || !filename) {
        return res.status(400).json({ message: "Image data and filename are required" });
      }

      // Convert base64 to buffer
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const file = {
        buffer,
        originalname: filename,
        size: buffer.length,
        mimetype: 'image/jpeg' // You might want to detect this
      };

      const image = await contentManager.uploadImage(file, alt || '');
      res.status(201).json(image);
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Get all images
  app.get("/api/images", async (req: Request, res: Response) => {
    try {
      const images = await contentManager.getAllImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  // Get single image
  app.get("/api/images/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const image = await contentManager.getImage(id);

      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.json(image);
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ message: "Failed to fetch image" });
    }
  });

  // Delete image
  app.delete("/api/images/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await contentManager.deleteImage(id);

      if (!success) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  });

  // GALLERY ROUTES

  // Get all gallery images
  app.get("/api/gallery/images", async (req: Request, res: Response) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  // Upload gallery image  
  app.post("/api/gallery/images", async (req: Request, res: Response) => {
    try {
      // Handle multipart form data (need to add multer middleware)
      const multer = require('multer');
      const path = require('path');

      const storage_config = multer.diskStorage({
        destination: (req: any, file: any, cb: any) => {
          cb(null, path.join(process.cwd(), 'client/public/uploads/gallery'));
        },
        filename: (req: any, file: any, cb: any) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
        }
      });

      const upload = multer({ 
        storage: storage_config,
        fileFilter: (req: any, file: any, cb: any) => {
          if (file.mimetype.startsWith('image/')) {
            cb(null, true);
          } else {
            cb(new Error('Only image files are allowed'));
          }
        },
        limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
      }).single('image');

      upload(req, res, async (err: any) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ message: "No image file provided" });
        }

        const { title, description, category, featured } = req.body;

        const galleryImage = await storage.createGalleryImage({
          filename: req.file.filename,
          originalName: req.file.originalname,
          url: `/uploads/gallery/${req.file.filename}`,
          alt: title || 'Gallery image',
          title: title || '',
          description: description || '',
          category: category || '',
          featured: featured === 'on' || featured === 'true',
          size: req.file.size,
          mimeType: req.file.mimetype
        });

        res.status(201).json(galleryImage);
      });
    } catch (error) {
      console.error("Error uploading gallery image:", error);
      res.status(500).json({ message: "Failed to upload gallery image" });
    }
  });

  // Delete gallery image
  app.delete("/api/gallery/images/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteGalleryImage(id);

      if (!success) {
        return res.status(404).json({ message: "Gallery image not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      res.status(500).json({ message: "Failed to delete gallery image" });
    }
  });

  // Create new order
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);

      // Push order to POS system for records and pricing
      try {
        const { externalAPIService } = await import('./services/external-api');

        const posOrderData = {
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone || undefined,
          items: Array.isArray(order.items) ? order.items.map((item: any) => ({
            productId: item.productId,
            name: item.name || item.productName || 'Custom Frame',
            description: item.description || '',
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || item.price || 0,
            totalPrice: item.totalPrice || (item.price * item.quantity) || 0
          })) : [],
          totalAmount: order.totalAmount,
          orderDate: order.createdAt?.toISOString() || new Date().toISOString(),
          specialInstructions: order.notes || undefined
        };

        const posResult = await externalAPIService.pushOrderToPOS(posOrderData);

        if (posResult.success && posResult.posOrderId) {
          // Update order with POS reference
          await storage.updateOrder(order.id, {
            adminNotes: `POS Order ID: ${posResult.posOrderId}${order.adminNotes ? '\n' + order.adminNotes : ''}`
          });
          console.log(`Order ${order.id} successfully pushed to POS with ID: ${posResult.posOrderId}`);
        }
      } catch (posError) {
        console.error('Failed to push order to POS system:', posError);
        // Don't fail the order creation if POS push fails
      }

      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get order by ID (enhanced with Kanban status)
  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    console.log(`Order lookup request for ID: ${id} (raw: ${req.params.id})`);
    
    if (isNaN(id)) {
      console.log(`Invalid order ID provided: ${req.params.id}`);
      return res.status(400).json({ 
        message: "Invalid order ID - must be a number",
        error: "ORDER_ID_INVALID",
        provided: req.params.id
      });
    }

    // Set a timeout for the entire request
    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        console.error(`Request timeout for order ${id}`);
        res.status(408).json({
          message: "Request timeout",
          error: "REQUEST_TIMEOUT",
          orderId: id
        });
      }
    }, 7000); // 7 second timeout

    try {
      console.log(`Searching for order ${id} in local database...`);
      const order = await storage.getOrderById(id);
      
      if (!order) {
        clearTimeout(timeoutId);
        console.log(`Order ${id} not found in local database`);
        return res.status(404).json({ 
          message: "Order not found",
          error: "ORDER_NOT_FOUND",
          orderId: id
        });
      }

      console.log(`Found order ${id} in local database:`, {
        customerName: order.customerName,
        status: order.status,
        totalAmount: order.totalAmount
      });

      // Try to get real-time status from Kanban app with shorter timeout
      const kanbanPromise = (async () => {
        try {
          console.log(`Attempting to get Kanban status for order ${id}...`);
          const { externalAPIService } = await import('./services/external-api');
          
          // Race between kanban request and timeout
          return await Promise.race([
            externalAPIService.getOrderStatusFromKanban(id.toString()),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Kanban timeout')), 3000)
            )
          ]);
        } catch (kanbanError) {
          console.warn(`Kanban lookup failed for order ${id}:`, kanbanError instanceof Error ? kanbanError.message : kanbanError);
          return null;
        }
      })();

      try {
        const kanbanStatus = await kanbanPromise;
        
        clearTimeout(timeoutId);
        
        if (!res.headersSent) {
          if (kanbanStatus) {
            console.log(`Successfully retrieved Kanban status for order ${id}:`, kanbanStatus.stage);
            // Merge Kanban status with local order data
            const enhancedOrder = {
              ...order,
              kanbanStatus: {
                status: kanbanStatus.status,
                stage: kanbanStatus.stage,
                estimatedCompletion: kanbanStatus.estimatedCompletion,
                notes: kanbanStatus.notes,
                lastUpdated: kanbanStatus.lastUpdated
              }
            };
            res.json(enhancedOrder);
          } else {
            console.log(`No Kanban status found for order ${id}, returning local data only`);
            // Return local order data if Kanban lookup returns null
            res.json({
              ...order,
              kanbanError: 'Real-time status temporarily unavailable'
            });
          }
        }
      } catch (kanbanError) {
        clearTimeout(timeoutId);
        if (!res.headersSent) {
          console.warn(`Kanban lookup failed for order ${id}:`, kanbanError instanceof Error ? kanbanError.message : kanbanError);
          // Return local order data if Kanban lookup fails
          res.json({
            ...order,
            kanbanError: 'Real-time status temporarily unavailable'
          });
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (!res.headersSent) {
        console.error(`Error fetching order ${id}:`, error);
        res.status(500).json({ 
          message: "Internal server error while fetching order",
          error: "SERVER_ERROR",
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  });

  // Update order status (admin only)
  app.patch("/api/orders/:id/status", authenticateToken, requireStaff, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const { status, stage } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await storage.updateOrderStatus(id, status, stage);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send a notification about the order status update (if customer email is available)
    if (order.customerEmail) {
      // Get a user-friendly status message based on the stage
      let statusMessage = "Your order status has been updated.";
      let statusType = "info";

      if (stage) {
        switch (stage) {
          case "preparing":
            statusMessage = "Your order is now being prepared.";
            break;
          case "in_production":
            statusMessage = "Your order is now in production.";
            break;
          case "ready_for_pickup":
            statusMessage = "Your order is ready for pickup!";
            statusType = "success";
            break;
          case "shipped":
            statusMessage = "Your order has been shipped!";
            statusType = "success";
            break;
          case "delivered":
            statusMessage = "Your order has been delivered!";
            statusType = "success";
            break;
          case "delayed":
            statusMessage = "Your order has been delayed. We apologize for the inconvenience.";
            statusType = "warning";
            break;
          default:
            statusMessage = `Your order is now in the ${stage} stage.`;
        }
      }

      // Send notification with our notification service
      try {
        sendNotification({
          title: `Order #${order.id} Update`,
          description: statusMessage,
          source: 'order-system',
          sourceId: order.id.toString(),
          type: statusType as NotificationType,
          actionable: true,
          link: `/order-status?orderId=${order.id}`,
          recipient: order.customerEmail
        }).catch(error => {
          console.error('Failed to send status notification:', error);
        });
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }

    res.json(order);
  });

  // AUTOMATION ROUTES

  // Auto-process orders
  app.post("/api/orders/auto-process", async (req: Request, res: Response) => {
    const { batchSize = 20 } = req.body;

    try {
      // Get pending orders up to the batch size
      const pendingOrders = await storage.getOrdersByStatus("pending");
      const ordersToProcess = pendingOrders.slice(0, batchSize);

      console.log(`Auto-processing ${ordersToProcess.length} orders...`);

      let processed = 0;
      let succeeded = 0;
      let failed = 0;

      // Process each order
      for (const order of ordersToProcess) {
        try {
          processed++;

          // Get items for inventory check
          const items = Array.isArray(order.items) ? order.items : [];

          // Check inventory for each item
          let inventoryAvailable = true;

          for (const item of items) {
            // Skip if this is a non-product item or doesn't have a product ID
            if (!item.productId) continue;

            // Check product inventory
            const product = await storage.getProductById(item.productId);
            if (product && product.stockQuantity !== undefined && product.stockQuantity !== null) {
              // If product exists and stock is below the ordered quantity
              if (product.stockQuantity < item.quantity) {
                inventoryAvailable = false;
                break;
              }
            }
          }

          // Update order status based on inventory availability
          if (inventoryAvailable) {
            await storage.updateOrderStatus(
              order.id, 
              "in_progress", 
              "materials_verified"
            );

            // Decrement inventory
            for (const item of items) {
              if (!item.productId) continue;

              const product = await storage.getProductById(item.productId);
              if (product && product.stockQuantity !== undefined && product.stockQuantity !== null) {
                await storage.updateProductStock(
                  item.productId,
                  Math.max(0, product.stockQuantity - item.quantity)
                );
              }
            }

            // Send notifications
            if (order.customerEmail) {
              try {
                sendNotification({
                  title: `Order #${order.id} Update`,
                  description: "Your order has been verified and is now being processed.",
                  source: 'auto-processor',
                  sourceId: order.id.toString(),
                  type: "success",
                  actionable: true,
                  link: `/order-status?orderId=${order.id}`,
                  recipient: order.customerEmail
                }).catch(error => {
                  console.error('Error sending notification:', error);
                });
              } catch (error) {
                console.error('Error sending notification:', error);
              }
            }

            succeeded++;
          } else {
            // Mark as delayed due to inventory issues
            await storage.updateOrderStatus(
              order.id, 
              "in_progress", 
              "delayed_inventory"
            );

            // Send inventory issue notification
            if (order.customerEmail) {
              try {
                sendNotification({
                  title: `Order #${order.id} Update`,
                  description: "There's a slight delay with your order due to inventory verification. We'll contact you shortly.",
                  source: 'auto-processor',
                  sourceId: order.id.toString(),
                  type: "warning",
                  actionable: true,
                  link: `/order-status?orderId=${order.id}`,
                  recipient: order.customerEmail
                }).catch(error => {
                  console.error('Error sending notification:', error);
                });

                // Also notify admin
                sendNotification({
                  title: `Inventory Alert: Order #${order.id}`,
                  description: "Order has inventory issues and requires attention.",
                  source: 'auto-processor',
                  sourceId: order.id.toString(),
                  type: "error",
                  actionable: true,
                  link: `/admin/orders/${order.id}`,
                  recipient: "admin@jaysframes.com" // This would be the admin email in a real system
                }).catch(error => {
                  console.error('Error sending admin notification:', error);
                });
              } catch (error) {
                console.error('Error sending notification:', error);
              }
            }

            failed++;
          }
        } catch (error) {
          console.error(`Error processing order ${order.id}:`, error);
          failed++;
        }
      }

      // Return processing results
      res.json({
        processed,
        succeeded,
        failed,
        totalPending: pendingOrders.length - processed
      });
    } catch (error) {
      console.error("Error in auto-processing:", error);
      res.status(500).json({ 
        message: "Error processing orders", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get automation status
  app.get("/api/automation/status", async (req: Request, res: Response) => {
    try {
      // Get automation status from a configuration store or database
      // For now, we'll return default values

      // Calculate next run time based on the cron interval (default: 30 minutes)
      const now = new Date();
      const nextRunTime = new Date(now);
      nextRunTime.setMinutes(now.getMinutes() + 30);

      res.json({
        enabled: true,
        intervalMinutes: 30,
        batchSize: 20,
        lastRun: null, // Would be stored in a database in a real implementation
        processedCount: 0,
        successCount: 0,
        errorCount: 0,
        nextRunTime: nextRunTime.toISOString()
      });
    } catch (error) {
      console.error("Error getting automation status:", error);
      res.status(500).json({ 
        message: "Error getting automation status", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Update automation settings
  app.post("/api/automation/settings", async (req: Request, res: Response) => {
    try {
      const { enabled, intervalMinutes, batchSize } = req.body;

      // Validate inputs
      if (typeof enabled !== 'boolean') {
        return res.status(400).json({ message: "enabled must be a boolean" });
      }

      if (isNaN(intervalMinutes) || intervalMinutes < 5 || intervalMinutes > 120) {
        return res.status(400).json({ message: "intervalMinutes must be between 5 and 120" });        }

      if (isNaN(batchSize) || batchSize < 1 || batchSize > 100) {
        return res.status(400).json({ message: "batchSize must be between 1 and 100" });
      }

      // In a real implementation, we would update these settings in the database
      // For now, we'll just return success

      // Calculate next run time based on the new interval
      const now = new Date();
      const nextRunTime = new Date(now);
      nextRunTime.setMinutes(now.getMinutes() + intervalMinutes);

      res.json({
        success: true,
        message: "Automation settings updated",
        settings: {
          enabled,
          intervalMinutes,
          batchSize
        },
        nextRunTime: nextRunTime.toISOString()
      });
    } catch (error) {
      console.error("Error updating automation settings:", error);
      res.status(500).json({ 
        message: "Error updating automation settings", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get all orders (admin only)
  app.get("/api/orders", authenticateToken, requireStaff, async (req: Request, res: Response) => {
    // Check for query parameters for filtering
    const { status, userId, limit } = req.query;

    let orders;

    if (status) {
      // Get orders by status
      orders = await storage.getOrdersByStatus(status.toString());
    } else if (userId) {
      // Get orders by user ID
      const userIdNum = parseInt(userId.toString());
      if (isNaN(userIdNum)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      orders = await storage.getOrdersByUserId(userIdNum);
    } else if (limit) {
      // Get recent orders with limit
      const limitNum = parseInt(limit.toString());
      if (isNaN(limitNum)) {
        return res.status(400).json({ message: "Invalid limit" });
      }
      orders = await storage.getRecentOrders(limitNum);
    } else {
      // Get all orders
      orders = await storage.getOrders();
    }

    res.json(orders);
  });

  // Get recent orders (admin only)
  app.get("/api/orders/recent", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
    const orders = await storage.getRecentOrders(limit);
    res.json(orders);
  });

  // Create new appointment
  app.post('/api/appointments', async (req: Request, res: Response) => {
    try {
      const { name, email, phone, service, date, time, message, location = 'store' } = req.body;

      // Parse date and time into proper datetime
      const appointmentDate = new Date(`${date} ${time}`);
      const endTime = new Date(appointmentDate.getTime() + 60 * 60 * 1000); // 1 hour duration

      // Create appointment data
      const appointmentData = {
        title: `${service} - ${name}`,
        description: `Customer: ${name}, Email: ${email}, Phone: ${phone || 'Not provided'}, Message: ${message || 'None'}`,
        type: service,
        startTime: appointmentDate,
        endTime: endTime,
        location: location,
        status: 'scheduled',
        customerNotes: message || null,
        notes: `Contact: ${email}, ${phone || 'No phone'}`
      };

      // Create appointment in database
      const appointment = await storage.createAppointment(appointmentData);

      res.json({ 
        success: true, 
        message: 'Appointment scheduled successfully',
        appointmentId: appointment.id,
        appointment: appointment
      });
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      res.status(500).json({ error: 'Failed to schedule appointment' });
    }
  });

  // CALENDAR INTEGRATION ROUTES

  // Get Google Calendar authorization URL
  app.get('/api/calendar/auth-url', async (req: Request, res: Response) => {
    try {
      const { calendarService } = await import('./services/calendar-integration');
      const authUrl = calendarService.getAuthUrl();
      res.json({ authUrl });
    } catch (error) {
      console.error('Error getting auth URL:', error);
      res.status(500).json({ error: 'Failed to get authorization URL' });
    }
  });

  // Handle OAuth callback
  app.get('/api/calendar/callback', async (req: Request, res: Response) => {
    try {
      const { code } = req.query;
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: 'Authorization code required' });
      }

      const { calendarService } = await import('./services/calendar-integration');
      const tokens = await calendarService.getTokens(code);
      
      // In a real app, you'd store these tokens associated with the user
      // For now, we'll store them in session or temporary storage
      req.session.calendarTokens = tokens;
      
      res.send('<script>window.close();</script>');
    } catch (error) {
      console.error('Error handling calendar callback:', error);
      res.status(500).json({ error: 'Authorization failed' });
    }
  });

  // Check calendar connection status
  app.get('/api/calendar/status', async (req: Request, res: Response) => {
    try {
      const connected = !!req.session.calendarTokens;
      const syncEnabled = req.session.calendarSyncEnabled || false;
      res.json({ connected, syncEnabled });
    } catch (error) {
      console.error('Error checking calendar status:', error);
      res.status(500).json({ error: 'Failed to check status' });
    }
  });

  // Toggle calendar sync
  app.post('/api/calendar/toggle-sync', async (req: Request, res: Response) => {
    try {
      const { enabled } = req.body;
      req.session.calendarSyncEnabled = enabled;
      res.json({ success: true, syncEnabled: enabled });
    } catch (error) {
      console.error('Error toggling calendar sync:', error);
      res.status(500).json({ error: 'Failed to toggle sync' });
    }
  });

  // Disconnect calendar
  app.post('/api/calendar/disconnect', async (req: Request, res: Response) => {
    try {
      delete req.session.calendarTokens;
      delete req.session.calendarSyncEnabled;
      res.json({ success: true });
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      res.status(500).json({ error: 'Failed to disconnect' });
    }
  });

  // EXTERNAL API INTEGRATION ROUTES

  // Get order status from Kanban app
  app.get('/api/external/kanban/orders/:orderId', async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const { externalAPIService } = await import('./services/external-api');

      const orderStatus = await externalAPIService.getOrderStatusFromKanban(orderId);

      if (!orderStatus) {
        return res.status(404).json({ 
          message: 'Order not found in Kanban system',
          orderId 
        });
      }

      res.json(orderStatus);
    } catch (error) {
      console.error('Error fetching order from Kanban:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve order status from Kanban',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Push order to POS system
  app.post('/api/external/pos/orders', async (req: Request, res: Response) => {
    try {
      const orderData = req.body;
      const { externalAPIService } = await import('./services/external-api');

      const result = await externalAPIService.pushOrderToPOS(orderData);

      if (result.success) {
        res.json({
          success: true,
          posOrderId: result.posOrderId,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Error pushing order to POS:', error);
      res.status(500).json({ 
        error: 'Failed to push order to POS',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Test external API connections
  app.get('/api/external/status', async (req: Request, res: Response) => {
    try {
      const { externalAPIService } = await import('./services/external-api');

      const [kanbanStatus, posStatus] = await Promise.all([
        externalAPIService.testKanbanConnection(),
        externalAPIService.testPOSConnection()
      ]);

      const configStatus = externalAPIService.getConfigurationStatus();

      res.json({
        configuration: configStatus,
        connections: {
          kanban: kanbanStatus,
          pos: posStatus
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error testing external APIs:', error);
      res.status(500).json({ 
        error: 'Failed to test external API connections',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Debug endpoint for order lookup troubleshooting
  app.get('/api/debug/orders/:orderId', async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const id = parseInt(orderId);
      
      if (isNaN(id)) {
        return res.json({
          orderId,
          error: 'Invalid order ID - not a number',
          timestamp: new Date().toISOString()
        });
      }

      // Check if order exists in database
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return res.json({
          orderId,
          found: false,
          message: 'Order not found in local database',
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        orderId,
        found: true,
        order: {
          id: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Debug order lookup error:', error);
      res.status(500).json({
        orderId: req.params.orderId,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Debug endpoint for testing Kanban order lookup
  app.get('/api/debug/kanban/:orderId', async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const { externalAPIService } = await import('./services/external-api');

      const configStatus = externalAPIService.getConfigurationStatus();
      
      if (!configStatus.kanban.configured) {
        return res.json({
          orderId,
          error: 'Kanban API not configured',
          configuration: configStatus.kanban,
          message: 'Set KANBAN_API_URL and KANBAN_API_KEY environment variables'
        });
      }

      const kanbanStatus = await externalAPIService.getOrderStatusFromKanban(orderId);
      
      res.json({
        orderId,
        kanbanStatus,
        configuration: configStatus.kanban,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Debug Kanban lookup error:', error);
      res.status(500).json({
        orderId: req.params.orderId,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Update external API configuration (admin only)
  app.patch('/api/external/config', authenticateToken, requireStaff, async (req: Request, res: Response) => {
    try {
      const { kanbanApiUrl, kanbanApiKey, posApiUrl, posApiKey } = req.body;
      const { externalAPIService } = await import('./services/external-api');

      externalAPIService.updateConfiguration({
        kanbanApiUrl,
        kanbanApiKey,
        posApiUrl,
        posApiKey
      });

      res.json({ 
        success: true, 
        message: 'External API configuration updated' 
      });
    } catch (error) {
      console.error('Error updating external API config:', error);
      res.status(500).json({ 
        error: 'Failed to update external API configuration',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Removed duplicate auto-process route as it's already defined above

  // Update order inventory and check status
  app.post("/api/orders/:id/inventory-check", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      // Get order
      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Get items from order
      const items = Array.isArray(order.items) ? order.items : [];

      // Check inventory for all items in the order
      const inventoryCheck = await Promise.all(
        items.map(async (item: any) => {
          if (item.productId) {
            const product = await storage.getProductById(item.productId);
            if (product && product.stockQuantity !== undefined) {
              return { 
                productId: item.productId, 
                inStock: (product.stockQuantity ?? 0) >= (item.quantity || 1), 
                available: product.stockQuantity ?? 0,
                quantity: item.quantity || 1 
              };
            }
          }
          return { productId: item.productId, inStock: false, custom: true };
        })
      );

      // Return inventory check results
      res.json({
        orderId: id,
        items: inventoryCheck,
        allInStock: inventoryCheck.every(item => item.inStock || item.custom),
        customItems: inventoryCheck.filter(item => item.custom).length > 0
      });
    } catch (error) {
      console.error("Inventory check error:", error);
      res.status(500).json({ message: "Failed to check inventory" });
    }
  });

  // Validate discount code
app.post("/api/validate-discount", async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: "Discount code is required" });
    }

    // Get discount by code from database
    const discount = await storage.getDiscountByCode(code.toUpperCase());

    if (!discount) {
      return res.status(404).json({ error: "Invalid discount code" });
    }

    // Check if discount is active
    if (!discount.isActive) {
      return res.status(400).json({ error: "Discount code is not active" });
    }

    // Check if discount has expired
    if (discount.expiresAt && new Date() > new Date(discount.expiresAt)) {
      return res.status(400).json({ error: "Discount code has expired" });
    }

    // Check minimum order amount
    if (discount.minOrderAmount && orderTotal < discount.minOrderAmount) {
      const formattedMinAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(discount.minOrderAmount / 100);
      return res.status(400).json({ 
        error: `Minimum order amount of ${formattedMinAmount} required` 
      });
    }

    // Check usage limit
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      return res.status(400).json({ error: "Discount code usage limit reached" });
    }

    res.json({
      code: discount.code,
      percentage: discount.percentage,
      description: discount.description
    });
  } catch (error) {
    console.error("Error validating discount:", error);
    res.status(500).json({ error: "Failed to validate discount code" });
  }
});

  // AI Chatbot endpoint
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { sessionId, message, orderNumber } = req.body;

      if (!sessionId || !message) {
        return res.status(400).json({ message: "Session ID and message are required" });
      }

      // Save user message
      const userMessage: ChatMessage = { role: "user", content: message };
      await storage.createChatMessage({
        sessionId,
        role: "user",
        content: message
      });

      // Get order info if orderNumber is provided
      let orderInfo = undefined;
      if (orderNumber) {
        const id = parseInt(orderNumber);
        if (!isNaN(id)) {
          orderInfo = await storage.getOrderById(id);
        }
      }

      // Get message history
      const messageHistory = await storage.getChatMessagesBySessionId(sessionId);
      const chatHistory: ChatMessage[] = messageHistory.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }));

      // Get products for recommendations
      const products = await storage.getProducts();

      // Process with AI
      const chatResponse = await handleChatRequest(
        [...chatHistory.slice(-10), userMessage], // Use last 10 messages + current
        products,
        orderInfo ? [orderInfo] : undefined
      );

      // Save assistant message
      await storage.createChatMessage({
        sessionId,
        role: "assistant",
        content: chatResponse.message
      });

      // Get recommended products if any
      let recommendedProducts: any[] = [];
      if (chatResponse.productRecommendations && chatResponse.productRecommendations.length > 0) {
        recommendedProducts = await Promise.all(
          chatResponse.productRecommendations.map(async (product) => {
            // If it's just an ID (number), fetch the product
            if (typeof product === 'number') {
              return await storage.getProductById(product);
            }
            // If it's already a product object with an ID, fetch the full product
            else if (product && typeof product.id === 'number') {
              return await storage.getProductById(product.id);
            }
            return undefined;
          })
        );

        // Filter out undefined products
        recommendedProducts = recommendedProducts.filter(p => p !== undefined);
      }

      res.json({
        message: chatResponse.message,
        recommendations: recommendedProducts,
        orderInfo: chatResponse.orderInfo
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Frame recommendations
  app.post("/api/frame-recommendations", async (req: Request, res: Response) => {
    try {
      const { artworkDescription } = req.body;

      if (!artworkDescription) {
        return res.status(400).json({ message: "Artwork description is required" });
      }

      const frameOptions = await storage.getFrameOptions();
      const matOptions = await storage.getMatOptions();

      const recommendations = await getFrameRecommendations(
        artworkDescription,
        frameOptions,
        matOptions
      );

      // Get detailed frame and mat options for the recommendations
      const recommendedFrames = await Promise.all(
        recommendations.recommendedFrames.map(async (id: number) => {
          return await storage.getFrameOptionById(id);
        })
      );

      const recommendedMats = await Promise.all(
        recommendations.recommendedMats.map(async (id: number) => {
          return await storage.getMatOptionById(id);
        })
      );

      res.json({
        frames: recommendedFrames.filter(f => f !== undefined),
        mats: recommendedMats.filter(m => m !== undefined),
        explanation: recommendations.explanation
      });
    } catch (error) {
      console.error("Frame recommendation error:", error);
      res.status(500).json({ message: "Failed to generate frame recommendations" });
    }
  });

  // Frame fitting assistant with image analysis
  app.post("/api/frame-fitting-assistant", async (req: Request, res: Response) => {
    try {
      let imageData: string | Buffer;

      // Check if the request is multipart/form-data (file upload)
      if (req.is('multipart/form-data') && req.files && Object.keys(req.files).length > 0) {
        // Handle file upload
        const imageFile = req.files.image as any;
        if (!imageFile) {
          return res.status(400).json({ message: "Artwork image file is required" });
        }

        imageData = imageFile.data; // This is a Buffer
      } else {
        // Handle JSON request with base64 image
        const { imageBase64 } = req.body;
        if (!imageBase64) {
          return res.status(400).json({ message: "Artwork image is required" });
        }

        imageData = imageBase64;
      }

      // Get framing options from the database
      const frameOptions = await storage.getFrameOptions();
      const matOptions = await storage.getMatOptions();
      const glassOptions = await storage.getGlassOptions();

      // Analyze the image using our AI function
      const analysis = await analyzeArtworkImage(
        imageData,
        frameOptions,
        matOptions,
        glassOptions
      );

      // Send the results directly back to the client
      res.json(analysis);
    } catch (error) {
      console.error("Frame fitting assistant error:", error);
      res.status(500).json({ 
        message: "Failed to analyze image and generate frame recommendations",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // New endpoint for direct Frame Design Assistant access
  app.post("/api/frame-assistant", async (req: Request, res: Response) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Try to get a response without database access if possible
      try {
        const response = await askFrameAssistant(message);
        return res.json({ response });
      } catch (aiError) {
        console.error("Frame assistant AI error:", aiError);

        // Fallback response for database errors
        const errorMessage = aiError instanceof Error ? aiError.message : String(aiError);
        if (errorMessage.includes("column") && errorMessage.includes("does not exist")) {
          return res.json({ 
            response: "I'm currently experiencing database issues and can't access all my frame information. " +
                      "I can still answer general framing questions. Could you please try again with a simple framing question?" 
          });
        }

        // Re-throw for other errors
        throw aiError;
      }
    } catch (error) {
      console.error("Frame assistant error:", error);
      res.status(500).json({ 
        message: "Failed to get a response from the Frame Design Assistant due to a server error. Please try again later." 
      });
    }
  });

  // Notification API endpoint for sending external notifications
  app.post("/api/notifications", async (req: Request, res: Response) => {
    try {
      const { 
        title, 
        description, 
        source, 
        sourceId, 
        type, 
        actionable, 
        link, 
        smsEnabled, 
        smsRecipient 
      } = req.body;

      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required" });
      }

      // Validate notification type
      const validTypes = ['info', 'success', 'warning', 'error'];
      if (type && !validTypes.includes(type)) {
        return res.status(400).json({ message: "Invalid notification type" });
      }

      // Send SMS if enabled and recipient is provided
      if (smsEnabled && smsRecipient) {
        const smsMessage = `${title}: ${description}`;
        sendSmsNotification(smsMessage, smsRecipient)
          .then(success => {
            if (success) {
              console.log(`SMS notification sent to ${smsRecipient}`);
            } else {
              console.error(`Failed to send SMS to ${smsRecipient}`);
            }
          })
          .catch(error => {
            console.error('SMS notification error:', error);
          });
      }

      // Log the notification
      console.log(`Notification received: ${title} - ${description}`);

      // Return a success response with a notification ID
      res.status(201).json({ 
        success: true, 
        notification: {
          id: Date.now().toString(),
          title,
          description,
          source: source || 'jaysframes-api',
          sourceId: sourceId || '',
          type: type || 'info',
          timestamp: new Date().toISOString(),
          actionable: actionable || false,
          link: link || '',
          smsEnabled: smsEnabled || false,
          smsRecipient: smsRecipient || ''
        }
      });
    } catch (error) {
      console.error("Notification error:", error);
      res.status(500).json({ message: "Failed to process notification" });
    }
  });

  // Blog Category endpoints
  app.get("/api/blog/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getBlogCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      res.status(500).json({ message: "Failed to fetch blog categories" });
    }
  });

  app.get("/api/blog/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const category = await storage.getBlogCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      console.error("Error fetching blog category:", error);
      res.status(500).json({ message: "Failed to fetch blog category" });
    }
  });

  app.get("/api/blog/categories/slug/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const category = await storage.getBlogCategoryBySlug(slug);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      console.error("Error fetching blog category by slug:", error);
      res.status(500).json({ message: "Failed to fetch blog category" });
    }
  });

  app.post("/api/blog/categories", async (req: Request, res: Response) => {
    try {
      const categoryData = insertBlogCategorySchema.parse(req.body);
      const category = await storage.createBlogCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      console.error("Error creating blog category:", error);
      res.status(500).json({ message: "Failed to create blog category" });
    }
  });

  app.patch("/api/blog/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const categoryUpdate = req.body;
      const category = await storage.updateBlogCategory(id, categoryUpdate);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      console.error("Error updating blog category:", error);
      res.status(500).json({ message: "Failed to update blog category" });
    }
  });

  app.delete("/api/blog/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const success = await storage.deleteBlogCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog category:", error);
      res.status(500).json({ message: "Failed to delete blog category" });
    }
  });

  // Blog Post endpoints
  app.get("/api/blog/posts", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      const status = req.query.status as string;

      let posts;
      if (status) {
        posts = await storage.getBlogPostsByStatus(status, limit, offset);
      } else {
        posts = await storage.getBlogPosts(limit, offset);
      }

      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await storage.getBlogPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog/posts/slug/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog/posts/category/:categoryId", async (req: Request, res: Response) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

      const posts = await storage.getBlogPostsByCategory(categoryId, limit, offset);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts by category:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/blog/posts", async (req: Request, res: Response) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.patch("/api/blog/posts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const postUpdate = req.body;
      const post = await storage.updateBlogPost(id, postUpdate);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/posts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  app.post("/api/blog/posts/:id/publish", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post = await storage.publishBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error) {
      console.error("Error publishing blog post:", error);
      res.status(500).json({ message: "Failed to publish blog post" });
    }
  });

  // AI Blog Assistant Chat endpoint
  app.post("/api/blog/ai-chat", async (req: Request, res: Response) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

    // Add custom framing expertise context
    const framingExpertContext = `You are a custom framing specialist and blog content expert for Jay's Frames in Houston, Texas. 
    You have deep knowledge of:
    - Picture framing techniques and materials
    - Art preservation and conservation
    - Frame and mat selection
    - Glass options (regular, UV-protective, museum glass)
    - Shadow box and dimensional framing
    - Mounting techniques
    - Color theory for framing
    - Houston art scene and local preferences

    Provide helpful, professional advice about custom framing topics. If asked about blog content creation, 
    suggest specific framing-related topics that would be valuable for customers. Always maintain a professional 
    yet approachable tone.`;

    const contextualMessage = `${framingExpertContext}\n\nCustomer question: ${message}`;

    const response = await generateAIResponse(contextualMessage);

    res.json({ response });
  } catch (error) {
    console.error("Error in AI chat:", error);
    res.status(500).json({ message: "Failed to generate AI response" });
  }
});

  // Automated Blog Post Generation endpoints
  app.post("/api/blog/automated/create", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
      const success = await createAutomatedBlogPost();
      
      if (success) {
        res.json({ 
          success: true, 
          message: "Automated blog post created successfully" 
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: "Failed to create automated blog post - may already exist" 
        });
      }
    } catch (error) {
      console.error("Error creating automated blog post:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to create automated blog post" 
      });
    }
  });

  app.get("/api/blog/automated/preview", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
      const preview = await previewNextBlogPost();
      
      if (preview) {
        res.json({ 
          success: true, 
          preview 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to generate blog post preview" 
        });
      }
    } catch (error) {
      console.error("Error generating blog post preview:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate blog post preview" 
      });
    }
  });

  // Blog Scheduler Management endpoints
  app.get("/api/blog/scheduler/status", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
      const status = blogScheduler.getStatus();
      res.json({ success: true, status });
    } catch (error) {
      console.error("Error getting scheduler status:", error);
      res.status(500).json({ success: false, message: "Failed to get scheduler status" });
    }
  });

  app.post("/api/blog/scheduler/trigger", authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
      const success = await blogScheduler.triggerManualPost();
      res.json({ success, message: success ? "Blog post generated successfully" : "Blog post already exists for this period" });
    } catch (error) {
      console.error("Error triggering manual blog post:", error);
      res.status(500).json({ success: false, message: "Failed to trigger blog post generation" });
    }
  });

  // AI Blog Generation with Chat Response endpoint
  app.post("/api/blog/ai-generate", async (req: Request, res: Response) => {
    try {
      const { prompt, includeGeneration } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Add custom framing context to the prompt
    const framingContext = `You are a custom framing expert writing for Jay's Frames, a professional framing shop in Houston, Texas. 
    Focus on topics related to picture framing, art preservation, conservation, frame selection, mat selection, glass options, 
    shadow boxes, and professional framing techniques. Include practical advice and emphasize quality craftsmanship.`;

    const contextualPrompt = `${framingContext}\n\nUser request: ${prompt}`;

    // Generate AI response
    const aiResponse = await generateAIResponse(contextualPrompt);

    let generatedPost = null;
    if (includeGeneration) {
      // Generate actual blog post content with framing focus
      const postPrompt = `${framingContext}

      Generate a complete blog post based on this request: "${prompt}". 

      Requirements:
      - Title should be engaging and SEO-friendly for custom framing
      - Content should be 600-1000 words, informative and professional
      - Include practical tips and professional insights
      - Mention Jay's Frames naturally where appropriate
      - Include a brief excerpt (100-150 words) that summarizes the key points
      - Provide relevant SEO keywords related to custom framing
      - Focus on Houston/local market when relevant

      Format the response as JSON with properties: title, content, excerpt, keywords, categoryId (use 1 for general framing topics).

      Example topics to cover could include: frame materials, preservation techniques, mat selection, glass options, mounting methods, etc.`;

      const postResponse = await generateAIResponse(postPrompt);

      try {
        // Try to parse the AI response as JSON
        generatedPost = JSON.parse(postResponse);
        generatedPost.categoryId = generatedPost.categoryId || 1;
      } catch (parseError) {
        // If JSON parsing fails, create a structured post from the text response
        const title = prompt.toLowerCase().includes('frame') || prompt.toLowerCase().includes('mat') || prompt.toLowerCase().includes('art') 
          ? `Professional Guide: ${prompt.charAt(0).toUpperCase() + prompt.slice(1).toLowerCase()}`
          : `Custom Framing: ${prompt.charAt(0).toUpperCase() + prompt.slice(1).toLowerCase()}`;

        generatedPost = {
          title: title,
          content: postResponse,
          excerpt: postResponse.substring(0, 150) + "...",
          keywords: "custom framing, picture frames, art preservation, professional framing, Houston framing, mat selection, frame selection",
          categoryId: 1
        };
      }
    }

    res.json({ 
      response: aiResponse,
      generatedPost 
    });
  } catch (error) {
    console.error("Error in AI blog generation:", error);
    res.status(500).json({ message: "Failed to generate AI response" });
  }
});

  // Automated blog content generation endpoint
  app.post("/api/blog/generate", async (req: Request, res: Response) => {
    try {
      const { keyword, categoryId, title } = req.body;

      if (!keyword) {
        return res.status(400).json({ message: "Keyword is required for content generation" });
      }

      // Create a slug from the title
      const slug = title
        ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : `blog-post-${Date.now()}`;

      // Generate simple content based on the keyword
      const content = `# ${title || `Blog Post About ${keyword}`}

## Introduction
This is an automatically generated blog post about ${keyword}. Custom framing provides numerous benefits for your artwork.

## Benefits of Custom Framing for ${keyword}
1. Enhanced visual appeal
2. Proper protection from environmental factors
3. Preservation of value
4. Perfect fit for your specific piece

## Conclusion
When it comes to ${keyword}, investing in quality custom framing is always worthwhile. Visit Jay's Frames to explore your options!
      `;

      // Create a new blog post
      const newPost = await storage.createBlogPost({
        title: title || `All About ${keyword}`,
        slug,
        excerpt: `Learn all about ${keyword} and how custom framing can enhance your experience.`,
        content,
        metaTitle: `${title || keyword} | Jay's Frames Blog`,
        metaDescription: `Expert information about ${keyword} from Houston's premier custom framing studio.`,
        keywords: keyword,
        status: "draft",
        categoryId: categoryId || 1,
        authorId: 1
      });

      res.json({
        success: true,
        message: "Blog post generated successfully",
        data: newPost
      });
    } catch (error) {
      console.error("Error in blog content generation:", error);
      res.status(500).json({ message: "Failed to process content generation request" });
    }
  });

  // API Integration endpoints
  // Allows third-party apps to easily connect to Jay's Frames systems
  app.get("/api/integration/status", (req: Request, res: Response) => {
    res.json({
      status: "operational",
      version: "1.0.0",
      serverTime: new Date().toISOString(),
      endpoints: {
        docs: "/api/docs",
        products: "/api/products",
        frameOptions: "/api/frame-options",
        orders: "/api/orders",
        chat: "/api/chat",
        frameRecommendations: "/api/frame-recommendations",
        frameAssistant: "/api/frame-assistant"
      }
    });
  });

  // Webhook registration endpoint for receiving notifications
  app.post("/api/integration/webhooks", (req: Request, res: Response) => {
    try {
      const { url, events, description, apiKey } = req.body;

      if (!url || !events || !Array.isArray(events) || events.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "URL and at least one event type are required" 
        });
      }

      // Validate URL format
      try {
        new URL(url);
      } catch (error) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid URL format" 
        });
      }

      // Validate event types
      const validEvents = ['order.created', 'order.updated', 'product.created', 'product.updated'];
      const invalidEvents = events.filter(event => !validEvents.includes(event));

      if (invalidEvents.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid event types: ${invalidEvents.join(', ')}`,
          validEvents
        });
      }

      // In a real implementation, we would store the webhook in a database
      // For now, we'll just return a success response with a fake webhook ID
      const webhookId = `wh_${Date.now()}`;

      console.log(`Webhook registered: ${url} for events: ${events.join(', ')}`);

      res.status(201).json({
        success: true,
        webhook: {
          id: webhookId,
          url,
          events,
          description: description || 'Third-party integration',
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Webhook registration error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to register webhook" 
      });
    }
  });

  // API data sync endpoint for bulk data export
  app.get("/api/integration/sync/:resource", async (req: Request, res: Response) => {
    const { resource } = req.params;
    const { since, limit, format } = req.query;

    // Validate resource type
    const validResources = ['products', 'orders', 'frame-options', 'mat-options', 'glass-options'];

    if (!validResources.includes(resource)) {
      return res.status(400).json({
        success: false,
        message: `Invalid resource type: ${resource}`,
        validResources
      });
    }

    try {
      // Parse parameters
      const sinceDate = since ? new Date(since.toString()) : undefined;
      const limitNum = limit ? parseInt(limit.toString()) : undefined;

      // Get data from integration service
      const data = await integrationService.getSyncData(
        resource,
        sinceDate,
        limitNum
      );

      // Format the response
      if (format === 'csv') {
        // In a real implementation, we would convert the data to CSV
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${resource}.csv`);
        // For now, just return a simple CSV header
        res.send(`id,name,description,created_at,updated_at\n`);
      } else {
        // Default to JSON
        res.json({
          success: true,
          resource,
          data,
          syncDetails: {
            timestamp: new Date().toISOString(),
            totalRecords: data.length,
            parameters: {
              since: since || 'all',
              limit: limitNum || 'none',
              format: format || 'json'
            }
          }
        });
      }
    } catch (error) {
      console.error(`Error syncing ${resource}:`, error);
      res.status(500).json({
        success: false,
        message: `Error syncing ${resource}`,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Register a new app integration
  app.post("/api/integration/register", async (req: Request, res: Response) => {
    try {
      const { name, appId, type, apiKey, endpoint, webhookUrl, eventTypes } = req.body;

      if (!name || !appId || !type || !apiKey) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: name, appId, type, apiKey"
        });
      }

      // Validate integration type
      const validTypes = ['notification', 'data_sync', 'webhook'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid integration type: ${type}`,
          validTypes
        });
      }

      // Register the integration
      const integration = await integrationService.registerIntegration(
        name,
        appId,
        type,
        apiKey,
        { endpoint, webhookUrl, eventTypes }
      );

      res.status(201).json({
        success: true,
        message: "Integration registered successfully",
        integration
      });
    } catch (error) {
      console.error("Error registering integration:", error);
      res.status(500).json({
        success: false,
        message: "Failed to register integration",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Stripe Payment Routes
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          message: "Payment processing is not configured. Contact support." 
        });
      }

      const { amount, currency = "usd", metadata = {} } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ 
          message: "Invalid amount provided" 
        });
      }

      // Enhanced metadata for better tracking
      const enhancedMetadata = {
        ...metadata,
        timestamp: new Date().toISOString(),
        source: 'jaysframes-checkout',
        amount_dollars: (amount / 100).toString()
      };

      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount should already be in cents from frontend
        currency,
        metadata: enhancedMetadata,
        automatic_payment_methods: {
          enabled: true,
        },
        receipt_email: metadata.customerEmail || undefined,
        description: `Jay's Frames Order - Custom Framing Services`,
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Payment confirmation endpoint
  app.post("/api/confirm-payment", async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          message: "Payment processing is not configured" 
        });
      }

      const { paymentIntentId, orderId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({ 
          message: "Payment intent ID is required" 
        });
      }

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        // Update order status to paid if orderId provided
        if (orderId) {
          try {
            await storage.updateOrderStatus(parseInt(orderId), 'paid');
          } catch (error) {
            console.error("Error updating order status:", error);
          }
        }

        res.json({ 
          success: true,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100 // Convert back to dollars
        });
      } else {
        res.json({ 
          success: false,
          status: paymentIntent.status,
          message: "Payment not completed"
        });
      }
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ 
        message: "Error confirming payment: " + error.message 
      });
    }
  });

  // Stripe webhook endpoint for payment confirmations
  app.post("/api/webhooks/stripe", async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          message: "Payment processing is not configured" 
        });
      }

      const sig = req.headers['stripe-signature'];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!sig || !endpointSecret) {
        return res.status(400).json({ 
          message: "Missing Stripe signature or webhook secret" 
        });
      }

      let event;

      try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ 
          message: `Webhook signature verification failed: ${err.message}` 
        });
      }

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('Payment succeeded:', paymentIntent.id);

          // Extract order information from metadata
          if (paymentIntent.metadata && paymentIntent.metadata.orderId) {
            try {
              await storage.updateOrderStatus(
                parseInt(paymentIntent.metadata.orderId), 
                'paid',
                'payment_confirmed'
              );

              // Send confirmation notification
              if (paymentIntent.metadata.customerEmail) {
                sendNotification({
                  title: `Payment Confirmed - Order #${paymentIntent.metadata.orderId}`,
                  description: "Your payment has been successfully processed.",
                  source: 'stripe-webhook',
                  sourceId: paymentIntent.metadata.orderId,
                  type: "success",
                  actionable: true,
                  link: `/order-status?orderId=${paymentIntent.metadata.orderId}`,
                  recipient: paymentIntent.metadata.customerEmail
                }).catch(error => {
                  console.error('Failed to send payment confirmation notification:', error);
                });
              }
            } catch (error) {
              console.error('Error updating order after payment:', error);
            }
          }
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          console.log('Payment failed:', failedPayment.id);

          // Handle failed payment
          if (failedPayment.metadata && failedPayment.metadata.orderId) {
            try {
              await storage.updateOrderStatus(
                parseInt(failedPayment.metadata.orderId), 
                'payment_failed',
                'payment_error'
              );

              // Send failure notification
              if (failedPayment.metadata.customerEmail) {
                sendNotification({
                  title: `Payment Failed - Order #${failedPayment.metadata.orderId}`,
                  description: "Your payment could not be processed. Please try again or contact support.",
                  source: 'stripe-webhook',
                  sourceId: failedPayment.metadata.orderId,
                  type: "error",
                  actionable: true,
                  link: `/order-status?orderId=${failedPayment.metadata.orderId}`,
                  recipient: failedPayment.metadata.customerEmail
                }).catch(error => {
                  console.error('Failed to send payment failure notification:', error);
                });
              }
            } catch (error) {
              console.error('Error updating order after payment failure:', error);
            }
          }
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(500).json({ 
        message: "Webhook error: " + error.message 
      });
    }
  });

  // Admin discount codes routes
app.get("/api/admin/discount-codes", authenticateToken, requireStaff, async (req: Request, res: Response) => {
  try {
    const discountCodes = await storage.getDiscountCodes();
    res.json(discountCodes);
  } catch (error) {
    console.error("Error fetching discount codes:", error);
    res.status(500).json({ message: "Failed to fetch discount codes" });
  }
});

app.post("/api/admin/discount-codes", authenticateToken, requireStaff, async (req: Request, res: Response) => {
  try {
    const discountData = req.body;
    const newDiscount = await storage.createDiscountCode(discountData);
    res.status(201).json(newDiscount);
  } catch (error) {
    console.error("Error creating discount code:", error);
    res.status(500).json({ message: "Failed to create discount code" });
  }
});

app.put("/api/admin/discount-codes/:id", authenticateToken, requireStaff, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    const discount = await storage.updateDiscountCode(id, updates);
    res.json(discount);
  } catch (error) {
    console.error("Error updating discount code:", error);
    res.status(500).json({ message: "Failed to update discount code" });
  }
});

app.delete("/api/admin/discount-codes/:id", authenticateToken, requireStaff, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteDiscountCode(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting discount code:", error);
    res.status(500).json({ message: "Failed to delete discount code" });
  }
});
  // Admin routes
  app.get("/api/admin/orders", authenticateToken, requireStaff, async (req: Request, res: Response) => {
    // Check for query parameters for filtering
    const { status, userId, limit } = req.query;

    let orders;

    if (status) {
      // Get orders by status
      orders = await storage.getOrdersByStatus(status.toString());
    } else if (userId) {
      // Get orders by user ID
      const userIdNum = parseInt(userId.toString());
      if (isNaN(userIdNum)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      orders = await storage.getOrdersByUserId(userIdNum);
    } else if (limit) {
      // Get recent orders with limit
      const limitNum = parseInt(limit.toString());
      if (isNaN(limitNum)) {
        return res.status(400).json({ message: "Invalid limit" });
      }
      orders = await storage.getRecentOrders(limitNum);
    } else {
      // Get all orders
      orders = await storage.getOrders();
    }

    res.json(orders);
  });

  const httpServer = createServer(app);

  // Create WebSocket server for real-time voice assistant communication
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/api/ws',
    // Explicitly set these handlers to prevent connection issues
    verifyClient: () => true,
    clientTracking: true,
    // Add higher timeout values for better connection stability
    perMessageDeflate: {
      zlibDeflateOptions: {
        chunkSize: 1024,
        memLevel: 7,
        level: 3
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024
      },
      serverNoContextTakeover: true,
      clientNoContextTakeover: true,
      concurrencyLimit: 10,
      threshold: 1024
    }
  });

  // Add a ping interval to keep connections alive
  const pingInterval = setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(JSON.stringify({ type: 'ping' }));
        } catch (err) {
          console.error('Error sending ping:', err);
        }
      }
    });
  }, 30000); // Ping every 30 seconds

  console.log('WebSocket server initialized at path: /ws');

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    // Send a welcome message to confirm the connection is working
    try {
      ws.send(JSON.stringify({
        type: 'connection_established',
        message: 'Voice assistant connection established'
      }));
    } catch (err) {
      console.error('Error sending welcome message:', err);
    }

    // Handle incoming messages
    ws.on('message', async (message) => {
      console.log('Received WebSocket message:', message.toString().substring(0, 100) + '...');

      try {
        // Parse the message as JSON
        let data;
        try {
          data = JSON.parse(message.toString());
        } catch (parseError) {
          console.error('WebSocket message parse error:', parseError);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format. Expected JSON.'
          }));
          return;
        }

        // Handle voice command messages
        if (data.type === 'voice_command') {
          console.log('Processing voice command:', data.message);
          try {
            // Process the voice command using our AI assistant
            const response = await askFrameAssistant(data.message);

            // Send the response back to the client
            ws.send(JSON.stringify({
              type: 'voice_response',
              response
            }));
          } catch (aiError) {
            console.error('AI assistant error:', aiError);
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Failed to process your voice command'
            }));
          }
        }

        // Handle image analysis requests
        else if (data.type === 'analyze_image' && data.imageData) {
          console.log('Processing image analysis request');
          try {
            // Get framing options from the database
            const frameOptions = await storage.getFrameOptions();
            const matOptions = await storage.getMatOptions();
            const glassOptions = await storage.getGlassOptions();

            // Analyze the image using our AI function
            const analysis = await analyzeArtworkImage(
              data.imageData,
              frameOptions,
              matOptions,
              glassOptions
            );

            // Send the analysis results back to the client
            ws.send(JSON.stringify({
              type: 'image_analysis_result',
              analysis
            }));
          } catch (analysisError) {
            console.error('Image analysis error:', analysisError);
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Failed to analyze the image'
            }));
          }
        }

        // Handle order status requests
        else if (data.type === 'order_status' && data.orderNumber) {
          console.log('Processing order status request for order:', data.orderNumber);
          try {
            const orderId = parseInt(data.orderNumber);
            if (!isNaN(orderId)) {
              const order = await storage.getOrderById(orderId);
              if (order) {
                ws.send(JSON.stringify({
                  type: 'order_status_result',
                  order
                }));
              } else {
                ws.send(JSON.stringify({
                  type: 'error',
                  message: `Order #${orderId} not found`
                }));
              }
            } else {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid order number'
              }));
            }
          } catch (orderError) {
            console.error('Order status error:', orderError);
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Error retrieving order information'
            }));
          }
        }

        // Handle ping messages to keep the connection alive
        else if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }

        // Handle unknown message types
        else {
          console.warn('Unknown WebSocket message type:', data.type);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type'
          }));
        }
      } catch (error) {
        console.error('WebSocket message processing error:', error);
        try {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to process your request'
          }));
        } catch (sendError) {
          console.error('Error sending error message:', sendError);
        }
      }
    });

    // Handle connection errors
    ws.on('error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Handle connection close
    ws.on('close', (code, reason) => {
      console.log(`WebSocket client disconnected. Code: ${code}, Reason: ${reason}`);
    });
  });

  // Handle WebSocket server errors
  wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });

  return httpServer;
}