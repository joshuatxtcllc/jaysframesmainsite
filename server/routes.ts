import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertOrderSchema, insertChatMessageSchema } from "@shared/schema";
import { handleChatRequest, getFrameRecommendations, askFrameAssistant, type ChatMessage } from "./ai";
import { sendNewOrderNotification, sendOrderConfirmationEmail, initEmailTransporter, OrderItem, ExtendedOrder } from "./services/notification";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = app.route("/api");

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
        const notificationData = {
          title: `Order #${order.id} Update`,
          description: statusMessage,
          source: 'jaysframes-api',
          sourceId: order.id.toString(),
          type: statusType,
          actionable: true,
          link: `/order-status?orderId=${order.id}`
        };
        
        // Use the WebSocket directly rather than making a fetch request to self
        const { getWebSocketServer } = await import('./services/websocket');
        const wsServer = getWebSocketServer();
        wsServer.broadcastNotification({
          id: Date.now().toString(),
          ...notificationData,
          timestamp: new Date().toISOString(),
          smsEnabled: false
        });
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
    
    res.json(order);
  });

  // Get all orders (admin only)
  app.get("/api/orders", async (req: Request, res: Response) => {
    const orders = await storage.getOrders();
    res.json(orders);
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
      
      // Create the notification object
      const notification = {
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
      };
      
      // Log the notification
      console.log(`Notification received: ${title} - ${description}`);
      
      // Return a success response with a notification ID
      res.status(201).json({ 
        success: true, 
        notification
      });
      
      // Import WebSocket service dynamically to avoid circular imports
      const { getWebSocketServer } = await import('./services/websocket');
      
      // Broadcast notification to all connected WebSocket clients
      // This will be available after the server is fully initialized
      try {
        const wsServer = getWebSocketServer(httpServer);
        wsServer.broadcastNotification(notification);
      } catch (wsError) {
        console.error("Error broadcasting notification:", wsError);
      }
    } catch (error) {
      console.error("Notification error:", error);
      res.status(500).json({ message: "Failed to process notification" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
