import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  orders, type Order, type InsertOrder,
  frameOptions, type FrameOption, type InsertFrameOption,
  matOptions, type MatOption, type InsertMatOption,
  revealSizes, type RevealSize, type InsertRevealSize,
  glassOptions, type GlassOption, type InsertGlassOption,
  chatMessages, type ChatMessage, type InsertChatMessage,
  blogCategories, type BlogCategory, type InsertBlogCategory,
  blogPosts, type BlogPost, type InsertBlogPost,
  appointments, type Appointment, type InsertAppointment,
  serviceAvailability, type ServiceAvailability, type InsertServiceAvailability
} from "@shared/schema";

import { db } from "./db";
import { eq, desc, and, like, sql, asc, lte, gte, isNull, not } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Inventory operations
  updateProductStock(id: number, quantity: number): Promise<Product | undefined>;
  getLowStockProducts(): Promise<Product[]>;

  // Order operations
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string, stage?: string): Promise<Order | undefined>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  getOrdersByStatus(status: string): Promise<Order[]>;
  getRecentOrders(limit?: number): Promise<Order[]>;

  // Frame options operations
  getFrameOptions(): Promise<FrameOption[]>;
  getFrameOptionById(id: number): Promise<FrameOption | undefined>;
  createFrameOption(option: InsertFrameOption): Promise<FrameOption>;

  // Mat options operations
  getMatOptions(): Promise<MatOption[]>;
  getMatOptionById(id: number): Promise<MatOption | undefined>;
  createMatOption(option: InsertMatOption): Promise<MatOption>;

  // Reveal size options operations
  getRevealSizes(): Promise<RevealSize[]>;
  getRevealSizeById(id: number): Promise<RevealSize | undefined>;
  createRevealSize(size: InsertRevealSize): Promise<RevealSize>;

  // Glass options operations
  getGlassOptions(): Promise<GlassOption[]>;
  getGlassOptionById(id: number): Promise<GlassOption | undefined>;
  createGlassOption(option: InsertGlassOption): Promise<GlassOption>;

  // Chat messages operations
  getChatMessagesBySessionId(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Blog Category operations
  getBlogCategories(): Promise<BlogCategory[]>;
  getBlogCategoryById(id: number): Promise<BlogCategory | undefined>;
  getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined>;
  createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory>;
  updateBlogCategory(id: number, category: Partial<InsertBlogCategory>): Promise<BlogCategory | undefined>;
  deleteBlogCategory(id: number): Promise<boolean>;

  // Blog Post operations
  getBlogPosts(limit?: number, offset?: number): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostsByCategory(categoryId: number, limit?: number, offset?: number): Promise<BlogPost[]>;
  getBlogPostsByStatus(status: string, limit?: number, offset?: number): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  publishBlogPost(id: number): Promise<BlogPost | undefined>;

  // Appointment operations
  getAppointments(): Promise<Appointment[]>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  getAppointmentsByUserId(userId: number): Promise<Appointment[]>;
  getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]>;
  getAppointmentsByStatus(status: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  markAppointmentReminderSent(id: number): Promise<Appointment | undefined>;

  // Service Availability operations
  getServiceAvailability(): Promise<ServiceAvailability[]>;
  getAvailabilityByDay(dayOfWeek: number): Promise<ServiceAvailability | undefined>;
  getAvailabilityByDate(date: Date): Promise<ServiceAvailability | undefined>;
  createAvailability(availability: InsertServiceAvailability): Promise<ServiceAvailability>;
  updateAvailability(id: number, availability: Partial<InsertServiceAvailability>): Promise<ServiceAvailability | undefined>;
  deleteAvailability(id: number): Promise<boolean>;
  getAvailableTimeSlots(date: Date): Promise<{startTime: Date, endTime: Date, available: boolean}[]>;
}

class DatabaseStorage implements IStorage {
  // Helper method to check if database is available
  private async checkDb(): Promise<boolean> {
    if (!db) {
      console.warn("Database connection not available");
      return false;
    }
    return true;
  }

  // Initialize frame options with sample data
  private async initializeFrameOptions() {
    if (!await this.checkDb()) return;

    try {
      // Check if frame options table has data
      const existingOptions = await db.select().from(frameOptions);
      if (existingOptions.length > 0) {
        console.log(`Frame options table already has ${existingOptions.length} entries`);
        return;
      }

      // Initialize with sample data
      const sampleFrameOptions: InsertFrameOption[] = [
        {
          name: "Walnut Classic",
          color: "#8B4513",
          material: "Wood",
          pricePerInch: 150, //$1.50 per inch
          imageUrl: "/images/frames/walnut.png",
          width: 25
        },
        {
          name: "Gold Leaf",
          color: "#D4B996",
          material: "Metal",
          pricePerInch: 200, // $2.00 per inch
          imageUrl: "/images/frames/gold.png",
          width: 25
        },
        {
          name: "Matte Black",
          color: "#000000",
          material: "Wood",
          pricePerInch: 125, // $1.25 per inch
          imageUrl: "/images/frames/black.png",
          width: 25
        },
        {
          name: "White Gallery",
          color: "#FFFFFF",
          material: "Wood",
          pricePerInch: 175, // $1.75 per inch
          imageUrl: "/images/frames/white.png",
          width: 25
        },
        {
          name: "Natural Maple",
          color: "#E5DCC5",
          material: "Wood",
          pricePerInch: 150, // $1.50 per inch
          imageUrl: "/images/frames/maple.png",
          width: 25
        },
        {
          name: "Cherry Wood",
          color: "#6E2C00",
          material: "Wood",
          pricePerInch: 165, // $1.65 per inch
          imageUrl: "/images/frames/cherry.png",
          width: 25
        }
      ];

      // Insert sample data
      await db.insert(frameOptions).values(sampleFrameOptions);
      console.log(`Initialized frame options table with ${sampleFrameOptions.length} entries`);
    } catch (error) {
      console.error("Error initializing frame options:", error);
    }
  }

  // Initialize mat options with sample data
  private async initializeMatOptions() {
    if (!await this.checkDb()) return;

    try {
      // Check if mat options table has data
      const existingOptions = await db.select().from(matOptions);
      if (existingOptions.length > 0) {
        console.log(`Mat options table already has ${existingOptions.length} entries`);
        return;
      }

      // Initialize with sample data
      const sampleMatOptions: InsertMatOption[] = [
        {
          name: "White",
          color: "#FFFFFF",
          price: 3500, // $35.00
          imageUrl: "/images/mats/white.png"
        },
        {
          name: "Off-White",
          color: "#F5F5F5",
          price: 3500, // $35.00
          imageUrl: "/images/mats/off-white.png"
        },
        {
          name: "Light Gray",
          color: "#E5E9F0",
          price: 3500, // $35.00
          imageUrl: "/images/mats/light-gray.png"
        },
        {
          name: "Black",
          color: "#000000",
          price: 4000, // $40.00
          imageUrl: "/images/mats/black.png"
        },
        {
          name: "Ivory",
          color: "#FFFFF0",
          price: 3500, // $35.00
          imageUrl: "/images/mats/ivory.png"
        },
        {
          name: "Cream",
          color: "#FFF8DC",
          price: 3500, // $35.00
          imageUrl: "/images/mats/cream.png"
        }
      ];

      // Insert sample data
      await db.insert(matOptions).values(sampleMatOptions);
      console.log(`Initialized mat options table with ${sampleMatOptions.length} entries`);
    } catch (error) {
      console.error("Error initializing mat options:", error);
    }
  }

  // Initialize glass options with sample data
  private async initializeGlassOptions() {
    if (!await this.checkDb()) return;

    try {
      // Check if glass options table has data
      const existingOptions = await db.select().from(glassOptions);
      if (existingOptions.length > 0) {
        console.log(`Glass options table already has ${existingOptions.length} entries`);
        return;
      }

      // Initialize with sample data
      const sampleGlassOptions: InsertGlassOption[] = [
        {
          name: "Standard Glass",
          description: "Clear glass with basic protection",
          price: 2500 // $25.00
        },
        {
          name: "UV-Protection Glass",
          description: "Blocks 99% of harmful UV rays to prevent fading",
          price: 5000 // $50.00
        },
        {
          name: "Anti-Glare Glass",
          description: "Reduces reflections for better visibility",
          price: 6000 // $60.00
        },
        {
          name: "Museum Glass",
          description: "Premium glass with UV protection and anti-glare properties",
          price: 9000 // $90.00
        }
      ];

      // Insert sample data
      await db.insert(glassOptions).values(sampleGlassOptions);
      console.log(`Initialized glass options table with ${sampleGlassOptions.length} entries`);
    } catch (error) {
      console.error("Error initializing glass options:", error);
    }
  }

  // Initialize reveal sizes with sample data
  private async initializeRevealSizes() {
    if (!await this.checkDb()) return;

    try {
      // Check if reveal sizes table has data
      const existingSizes = await db.select().from(revealSizes);
      if (existingSizes.length > 0) {
        console.log(`Reveal sizes table already has ${existingSizes.length} entries`);
        return;
      }

      // Initialize with sample data
      const sampleRevealSizes: InsertRevealSize[] = [
        { size: "1/8 inch", sizeInches: 1, displayName: "1/8\"" },
        { size: "1/4 inch", sizeInches: 2, displayName: "1/4\"" },
        { size: "3/8 inch", sizeInches: 3, displayName: "3/8\"" },
        { size: "1/2 inch", sizeInches: 4, displayName: "1/2\"" },
        { size: "5/8 inch", sizeInches: 5, displayName: "5/8\"" },
        { size: "3/4 inch", sizeInches: 6, displayName: "3/4\"" },
        { size: "7/8 inch", sizeInches: 7, displayName: "7/8\"" },
        { size: "1 inch", sizeInches: 8, displayName: "1\"" }
      ];

      // Insert sample data
      await db.insert(revealSizes).values(sampleRevealSizes);
      console.log(`Initialized reveal sizes table with ${sampleRevealSizes.length} entries`);
    } catch (error) {
      console.error("Error initializing reveal sizes:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    if (!await this.checkDb()) return undefined;
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!await this.checkDb()) return undefined;
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!await this.checkDb()) throw new Error("Database connection not available");
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user"); 
    }
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    if (!await this.checkDb()) return [];
    try {
      return await db.select().from(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  // Inventory operations
  async updateProductStock(id: number, quantity: number): Promise<Product | undefined> {
    const [existingProduct] = await db.select().from(products).where(eq(products.id, id));

    if (!existingProduct) return undefined;

    const newStockQuantity = Math.max(0, (existingProduct.stockQuantity || 0) + quantity);

    const [updatedProduct] = await db
      .update(products)
      .set({
        stockQuantity: newStockQuantity,
        lastRestockDate: quantity > 0 ? new Date() : undefined,
        updatedAt: new Date()
      })
      .where(eq(products.id, id))
      .returning();

    return updatedProduct;
  }

  async getLowStockProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        and(
          // Only consider active products
          eq(products.isActive, true),
          // Stock is below the low stock threshold
          sql`${products.stockQuantity} <= ${products.lowStockThreshold}`
        )
      );
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    if (!await this.checkDb()) return [];
    try {
      return await db.select().from(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    if (!await this.checkDb()) return undefined;
    try {
      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      return order;
    } catch (error) {
      console.error(`Error fetching order by id ${id}:`, error);
      return undefined;
    }
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    if (!await this.checkDb()) throw new Error("Database connection not available");
    try {
      const [newOrder] = await db.insert(orders).values(order).returning();
      return newOrder;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  }

  async updateOrderStatus(id: number, status: string, stage?: string): Promise<Order | undefined> {
    if (!await this.checkDb()) return undefined;

    try {
      const updateValues: Partial<Order> = { status };
      if (stage) {
        updateValues.currentStage = stage;

        // Add to stage history if it exists
        const [existingOrder] = await db.select().from(orders).where(eq(orders.id, id));
        if (existingOrder) {
          const stageHistory = existingOrder.stageHistory as any[] || [];
          updateValues.stageHistory = [
            ...stageHistory,
            {
              stage,
              timestamp: new Date(),
              previousStage: existingOrder.currentStage
            }
          ];
        }
      }

      // Update the updatedAt timestamp
      updateValues.updatedAt = new Date();

      // If status is 'completed', update thecompletedAt date
      if (status === 'completed' && !updateValues.completedAt) {
        updateValues.completedAt = new Date();
      }

      const [updatedOrder] = await db
        .update(orders)
        .set(updateValues)
        .where(eq(orders.id, id))
        .returning();

      return updatedOrder;
    } catch (error) {
      console.error(`Error updating order status for order ${id}:`, error);
      return undefined;
    }
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.status, status))
      .orderBy(desc(orders.createdAt));
  }

  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit);
  }

  // Frame options operations
  async getFrameOptions(): Promise<FrameOption[]> {
    return await db.select().from(frameOptions);
  }

  async getFrameOptionById(id: number): Promise<FrameOption | undefined> {
    const [option] = await db.select().from(frameOptions).where(eq(frameOptions.id, id));
    return option;
  }

  async createFrameOption(option: InsertFrameOption): Promise<FrameOption> {
    const [newOption] = await db.insert(frameOptions).values(option).returning();
    return newOption;
  }

  // Mat options operations
  async getMatOptions(): Promise<MatOption[]> {
    return await db.select().from(matOptions);
  }

  async getMatOptionById(id: number): Promise<MatOption | undefined> {
    const [option] = await db.select().from(matOptions).where(eq(matOptions.id, id));
    return option;
  }

  async createMatOption(option: InsertMatOption): Promise<MatOption> {
    const [newOption] = await db.insert(matOptions).values(option).returning();
    return newOption;
  }

  // Reveal size operations
  async getRevealSizes(): Promise<RevealSize[]> {
    if (!await this.checkDb()) return [];
    try {
      return await db.select().from(revealSizes).orderBy(asc(revealSizes.sizeInches));
    } catch (error) {
      console.error("Error fetching reveal sizes:", error);
      return [];
    }
  }

  async getRevealSizeById(id: number): Promise<RevealSize | undefined> {
    if (!await this.checkDb()) return undefined;
    try {
      const [size] = await db.select().from(revealSizes).where(eq(revealSizes.id, id));
      return size;
    } catch (error) {
      console.error("Error fetching reveal size by id:", error);
      return undefined;
    }
  }

  async createRevealSize(size: InsertRevealSize): Promise<RevealSize> {
    if (!await this.checkDb()) throw new Error("Database connection not available");
    try {
      const [newSize] = await db.insert(revealSizes).values(size).returning();
      return newSize;
    } catch (error) {
      console.error("Error creating reveal size:", error);
      throw new Error("Failed to create reveal size");
    }
  }

  // Glass options operations
  async getGlassOptions(): Promise<GlassOption[]> {
    return await db.select().from(glassOptions);
  }

  async getGlassOptionById(id: number): Promise<GlassOption | undefined> {
    const [option] = await db.select().from(glassOptions).where(eq(glassOptions.id, id));
    return option;
  }

  async createGlassOption(option: InsertGlassOption): Promise<GlassOption> {
    const [newOption] = await db.insert(glassOptions).values(option).returning();
    return newOption;
  }

  // Chat messages operations
  async getChatMessagesBySessionId(sessionId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(asc(chatMessages.timestamp));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  // Blog Category operations
  async getBlogCategories(): Promise<BlogCategory[]> {
    return await db.select().from(blogCategories);
  }

  async getBlogCategoryById(id: number): Promise<BlogCategory | undefined> {
    const [category] = await db.select().from(blogCategories).where(eq(blogCategories.id, id));
    return category;
  }

  async getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined> {
    const [category] = await db.select().from(blogCategories).where(eq(blogCategories.slug, slug));
    return category;
  }

  async createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory> {
    const [newCategory] = await db.insert(blogCategories).values(category).returning();
    return newCategory;
  }

  async updateBlogCategory(id: number, category: Partial<InsertBlogCategory>): Promise<BlogCategory | undefined> {
    const [updatedCategory] = await db
      .update(blogCategories)
      .set(category)
      .where(eq(blogCategories.id, id))
      .returning();

    return updatedCategory;
  }

  async deleteBlogCategory(id: number): Promise<boolean> {
    const result = await db.delete(blogCategories).where(eq(blogCategories.id, id));
    return !!result;
  }

  // Blog Post operations
  async getBlogPosts(limit?: number, offset?: number): Promise<BlogPost[]> {
    let query = db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    if (offset !== undefined) {
      query = query.offset(offset);
    }

    return await query;
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPostsByCategory(categoryId: number, limit?: number, offset?: number): Promise<BlogPost[]> {
    let query = db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.categoryId, categoryId))
      .orderBy(desc(blogPosts.createdAt));

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    if (offset !== undefined) {
      query = query.offset(offset);
    }

    return await query;
  }

  async getBlogPostsByStatus(status: string, limit?: number, offset?: number): Promise<BlogPost[]> {
    let query = db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, status))
      .orderBy(desc(blogPosts.createdAt));

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    if (offset !== undefined) {
      query = query.offset(offset);
    }

    return await query;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({
        ...post,
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();

    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return !!result;
  }

  async publishBlogPost(id: number): Promise<BlogPost | undefined> {
    const now = new Date();
    const [publishedPost] = await db
      .update(blogPosts)
      .set({
        status: 'published',
        publishedAt: now,
        updatedAt: now
      })
      .where(eq(blogPosts.id, id))
      .returning();

    return publishedPost;
  }

  // Appointment operations
  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments).orderBy(asc(appointments.startTime));
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async getAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(asc(appointments.startTime));
  }

  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(
        and(
          gte(appointments.startTime, startDate),
          lte(appointments.startTime, endDate)
        )
      )
      .orderBy(asc(appointments.startTime));
  }

  async getAppointmentsByStatus(status: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.status, status))
      .orderBy(asc(appointments.startTime));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async updateAppointment(id: number, appointmentUpdate: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({
        ...appointmentUpdate,
        updatedAt: new Date()
      })
      .where(eq(appointments.id, id))
      .returning();

    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id));
    return !!result;
  }

  async markAppointmentReminderSent(id: number): Promise<Appointment | undefined> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({
        reminderSent: true,
        updatedAt: new Date()
      })
      .where(eq(appointments.id, id))
      .returning();

    return updatedAppointment;
  }

  // Service Availability operations
  async getServiceAvailability(): Promise<ServiceAvailability[]> {
    return await db.select().from(serviceAvailability);
  }

  async getAvailabilityByDay(dayOfWeek: number): Promise<ServiceAvailability | undefined> {
    const [availability] = await db
      .select()
      .from(serviceAvailability)
      .where(
        and(
          eq(serviceAvailability.dayOfWeek, dayOfWeek),
          isNull(serviceAvailability.specificDate)
        )
      );

    return availability;
  }

  async getAvailabilityByDate(date: Date): Promise<ServiceAvailability | undefined> {
    // Format the date to just get the date part without time
    const dateOnly = new Date(date.toDateString());

    // First check for specific date override
    const [specificAvailability] = await db
      .select()
      .from(serviceAvailability)
      .where(eq(serviceAvailability.specificDate, dateOnly));

    if (specificAvailability) {
      return specificAvailability;
    }

    // If no specific date found, fall back to day of week
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

    return this.getAvailabilityByDay(dayOfWeek);
  }

  async createAvailability(availability: InsertServiceAvailability): Promise<ServiceAvailability> {
    const [newAvailability] = await db.insert(serviceAvailability).values(availability).returning();
    return newAvailability;
  }

  async updateAvailability(id: number, availabilityUpdate: Partial<InsertServiceAvailability>): Promise<ServiceAvailability | undefined> {
    const [updatedAvailability] = await db
      .update(serviceAvailability)
      .set(availabilityUpdate)
      .where(eq(serviceAvailability.id, id))
      .returning();

    return updatedAvailability;
  }

  async deleteAvailability(id: number): Promise<boolean> {
    const result = await db.delete(serviceAvailability).where(eq(serviceAvailability.id, id));
    return !!result;
  }

  async getAvailableTimeSlots(date: Date): Promise<{startTime: Date, endTime: Date, available: boolean}[]> {
    // Get availability settings for the date
    const availability = await this.getAvailabilityByDate(date);

    if (!availability || !availability.isAvailable) {
      return []; // No slots available for this date
    }

    // Parse open and close times
    const [openHour, openMinute] = availability.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = availability.closeTime.split(':').map(Number);

    // Set up start and end datetime objects
    const startDate = new Date(date);
    startDate.setHours(openHour, openMinute, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(closeHour, closeMinute, 0, 0);

    // Get appointment duration in minutes
    const slotDuration = availability.slotDuration || 60; // Default to 1 hour

    // Calculate number of slots
    const totalMinutes = (endDate.getTime() - startDate.getTime()) / (60 * 1000);
    const numSlots = Math.floor(totalMinutes / slotDuration);

    // Get existing appointments for this date
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);

    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    const existingAppointments = await this.getAppointmentsByDateRange(dateStart, dateEnd);

    // Generate time slots
    const timeSlots: {startTime: Date, endTime: Date, available: boolean}[] = [];

    for (let i = 0; i < numSlots; i++) {
      const slotStart = new Date(startDate.getTime() + i * slotDuration * 60 * 1000);
      const slotEnd = new Date(slotStart.getTime() + slotDuration * 60 * 1000);

      // Check if the slot conflicts with any existing appointments
      const conflictingAppointments = existingAppointments.filter(appointment => {
        const appointmentStart = new Date(appointment.startTime);
        const appointmentEnd = new Date(appointment.endTime);

        // Check if appointment overlaps with this slot
        return (
          (appointmentStart < slotEnd && appointmentEnd > slotStart) &&
          appointment.status !== 'cancelled'
        );
      });

      // Count active appointments in this slot
      const activeAppointmentsInSlot = conflictingAppointments.length;

      // Slot is available if number of appointments is less than the max allowed
      const maxAllowed = availability.maxAppointments || 1;
      const isAvailable = activeAppointmentsInSlot < maxAllowed;

      timeSlots.push({
        startTime: slotStart,
        endTime: slotEnd,
        available: isAvailable
      });
    }

    return timeSlots;
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();