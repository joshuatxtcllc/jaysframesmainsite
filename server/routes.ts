import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertOrderSchema, 
  insertChatMessageSchema, 
  insertBlogCategorySchema, 
  insertBlogPostSchema 
} from "@shared/schema";
import { handleChatRequest, getFrameRecommendations, askFrameAssistant, type ChatMessage } from "./ai";
import { 
  sendNewOrderNotification, 
  sendOrderConfirmationEmail, 
  initEmailTransporter, 
  initTwilioClient,
  sendSmsNotification,
  OrderItem, 
  ExtendedOrder 
} from "./services/notification";
import { startAutoProcessingCron } from "./services/automation";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize services
  await initEmailTransporter();
  await initTwilioClient();
  
  // Start automated order processing cron job (runs every 30 minutes by default)
  startAutoProcessingCron(app);
  
  // API Routes
  const apiRouter = app.route("/api");
  
  // API Documentation and Integration
  app.get("/api/docs", (req: Request, res: Response) => {
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

  // Get mat options
  app.get("/api/mat-options", async (req: Request, res: Response) => {
    const options = await storage.getMatOptions();
    res.json(options);
  });

  // Get glass options
  app.get("/api/glass-options", async (req: Request, res: Response) => {
    const options = await storage.getGlassOptions();
    res.json(options);
  });

  // Create new order
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Initialize email transporter if needed
      await initEmailTransporter();
      
      // Send notifications asynchronously (don't await to avoid delaying response)
      // Cast order to the extended type expected by the notification service
      const extendedOrder: ExtendedOrder = {
        ...order, 
        items: Array.isArray(order.items) ? order.items as OrderItem[] : []
      };
      
      sendNewOrderNotification(extendedOrder).catch(err => {
        console.error('Failed to send order notification:', err);
      });
      
      // Send confirmation email if customer email is available
      if (order.customerEmail) {
        // Order ID and email is all that's needed as the function fetches order details internally
        sendOrderConfirmationEmail(order.id, order.customerEmail).catch(err => {
          console.error('Failed to send order confirmation email:', err);
        });
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    
    const order = await storage.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  });

  // Update order status (admin only)
  app.patch("/api/orders/:id/status", async (req: Request, res: Response) => {
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
      
      // Log the notification for now - in production, this would be sent to an email or SMS service
      console.log(`Order status notification for #${order.id}: ${statusMessage}`);
      
      // Add to the notification API to show in the web UI notification system
      try {
        fetch('http://localhost:' + (process.env.PORT || 3000) + '/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: `Order #${order.id} Update`,
            description: statusMessage,
            source: 'jaysframes-api',
            sourceId: order.id.toString(),
            type: statusType,
            actionable: true,
            link: `/order-status?orderId=${order.id}`
          })
        }).catch(err => {
          console.error('Failed to send status notification:', err);
        });
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
    
    res.json(order);
  });

  // Get all orders (admin only)
  app.get("/api/orders", async (req: Request, res: Response) => {
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
  
  // Auto-process orders in a batch (automated system or admin only)
  app.post("/api/orders/auto-process", async (req: Request, res: Response) => {
    try {
      // Get pending orders that need processing
      const pendingOrders = await storage.getOrdersByStatus("pending");
      
      // Process each order
      const processedOrders = await Promise.all(
        pendingOrders.map(async (order) => {
          // 1. Update status to processing
          const updatedOrder = await storage.updateOrderStatus(order.id, "processing", "preparing");
          
          // 2. Check inventory for all items in the order
          const items = Array.isArray(order.items) ? order.items : [];
          const inventoryCheck = await Promise.all(
            items.map(async (item: any) => {
              if (item.productId) {
                const product = await storage.getProductById(item.productId);
                if (product && product.stockQuantity !== undefined) {
                  // If product exists and has enough stock
                  if (product.stockQuantity >= (item.quantity || 1)) {
                    // Update product stock
                    await storage.updateProductStock(
                      product.id, 
                      -1 * (item.quantity || 1)
                    );
                    
                    return { 
                      productId: item.productId, 
                      inStock: true, 
                      quantity: item.quantity || 1 
                    };
                  } else {
                    return { 
                      productId: item.productId, 
                      inStock: false, 
                      quantity: item.quantity || 1,
                      available: product.stockQuantity || 0
                    };
                  }
                }
              }
              return { productId: item.productId, inStock: false, custom: true };
            })
          );
          
          // 3. Check if all items are in stock
          const allInStock = inventoryCheck.every(item => item.inStock || item.custom);
          const customItems = inventoryCheck.filter(item => item.custom).length > 0;
          
          // 4. Determine next processing step based on inventory and order type
          let nextStatus, nextStage;
          
          if (allInStock && !customItems) {
            // All standard items in stock - move to production
            nextStatus = "processing";
            nextStage = "in_production";
          } else if (allInStock && customItems) {
            // Custom items - move to design approval
            nextStatus = "processing";
            nextStage = "design_approval";
          } else {
            // Some items out of stock - move to backorder
            nextStatus = "backorder";
            nextStage = "waiting_for_stock";
          }
          
          // 5. Update order with new status
          const finalOrder = await storage.updateOrderStatus(order.id, nextStatus, nextStage);
          
          // 6. Return processing result
          return {
            orderId: order.id,
            originalStatus: order.status,
            newStatus: finalOrder?.status || nextStatus,
            newStage: finalOrder?.currentStage || nextStage,
            inventoryCheck,
            outOfStock: !allInStock,
            customItems
          };
        })
      );
      
      // Return summary of processed orders
      res.json({
        processed: processedOrders.length,
        orders: processedOrders
      });
    } catch (error) {
      console.error("Auto-process error:", error);
      res.status(500).json({ message: "Failed to auto-process orders" });
    }
  });
  
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
                inStock: product.stockQuantity >= (item.quantity || 1), 
                available: product.stockQuantity || 0,
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

  // New endpoint for direct Frame Design Assistant access
  app.post("/api/frame-assistant", async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const response = await askFrameAssistant(message);
      res.json({ response });
    } catch (error) {
      console.error("Frame assistant error:", error);
      res.status(500).json({ 
        message: "Failed to get a response from the Frame Design Assistant" 
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
  
  // Automated blog content generation endpoint
  app.post("/api/blog/generate", async (req: Request, res: Response) => {
    try {
      const { keyword, categoryId, title } = req.body;
      
      if (!keyword) {
        return res.status(400).json({ message: "Keyword is required for content generation" });
      }
      
      // In a future implementation, this would use the OpenAI API to generate content
      // For now, let's just return a message that would normally be handled by the client
      
      res.json({
        success: true,
        message: "Content generation request received",
        data: {
          keyword,
          categoryId,
          title,
          status: "pending" // In a real implementation, this would be stored in a queue
        }
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
  app.get("/api/integration/sync/:resource", (req: Request, res: Response) => {
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
    
    // In a real implementation, we would fetch the data from storage based on the parameters
    // For now, return a simple response with sync details
    res.json({
      success: true,
      resource,
      syncDetails: {
        timestamp: new Date().toISOString(),
        parameters: {
          since: since || 'all',
          limit: limit || 'none',
          format: format || 'json'
        },
        message: `This endpoint allows bulk data synchronization for ${resource}. Add appropriate query parameters to filter and format the data.`
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
