import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertOrderSchema, insertChatMessageSchema } from "@shared/schema";
import { handleChatRequest, getFrameRecommendations, type ChatMessage } from "./ai";

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
      let recommendedProducts = [];
      if (chatResponse.productRecommendations && chatResponse.productRecommendations.length > 0) {
        recommendedProducts = await Promise.all(
          chatResponse.productRecommendations.map(async (id) => {
            return await storage.getProductById(id);
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
        recommendations.recommendedFrames.map(async (id) => {
          return await storage.getFrameOptionById(id);
        })
      );
      
      const recommendedMats = await Promise.all(
        recommendations.recommendedMats.map(async (id) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
