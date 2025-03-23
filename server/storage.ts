import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  orders, type Order, type InsertOrder,
  frameOptions, type FrameOption, type InsertFrameOption,
  matOptions, type MatOption, type InsertMatOption,
  glassOptions, type GlassOption, type InsertGlassOption,
  chatMessages, type ChatMessage, type InsertChatMessage
} from "@shared/schema";

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
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string, stage?: string): Promise<Order | undefined>;
  
  // Frame options operations
  getFrameOptions(): Promise<FrameOption[]>;
  getFrameOptionById(id: number): Promise<FrameOption | undefined>;
  createFrameOption(option: InsertFrameOption): Promise<FrameOption>;
  
  // Mat options operations
  getMatOptions(): Promise<MatOption[]>;
  getMatOptionById(id: number): Promise<MatOption | undefined>;
  createMatOption(option: InsertMatOption): Promise<MatOption>;
  
  // Glass options operations
  getGlassOptions(): Promise<GlassOption[]>;
  getGlassOptionById(id: number): Promise<GlassOption | undefined>;
  createGlassOption(option: InsertGlassOption): Promise<GlassOption>;
  
  // Chat messages operations
  getChatMessagesBySessionId(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private frameOptions: Map<number, FrameOption>;
  private matOptions: Map<number, MatOption>;
  private glassOptions: Map<number, GlassOption>;
  private chatMessages: ChatMessage[];
  
  private userCounter: number;
  private productCounter: number;
  private orderCounter: number;
  private frameOptionCounter: number;
  private matOptionCounter: number;
  private glassOptionCounter: number;
  private chatMessageCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.frameOptions = new Map();
    this.matOptions = new Map();
    this.glassOptions = new Map();
    this.chatMessages = [];
    
    this.userCounter = 1;
    this.productCounter = 1;
    this.orderCounter = 1;
    this.frameOptionCounter = 1;
    this.matOptionCounter = 1;
    this.glassOptionCounter = 1;
    this.chatMessageCounter = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }
  
  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productCounter++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderCounter++;
    const createdAt = new Date().toISOString();
    const newOrder: Order = { ...order, id, createdAt };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string, stage?: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { 
      ...order, 
      status,
      ...(stage ? { currentStage: stage } : {})
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Frame options operations
  async getFrameOptions(): Promise<FrameOption[]> {
    return Array.from(this.frameOptions.values());
  }
  
  async getFrameOptionById(id: number): Promise<FrameOption | undefined> {
    return this.frameOptions.get(id);
  }
  
  async createFrameOption(option: InsertFrameOption): Promise<FrameOption> {
    const id = this.frameOptionCounter++;
    const newOption: FrameOption = { ...option, id };
    this.frameOptions.set(id, newOption);
    return newOption;
  }
  
  // Mat options operations
  async getMatOptions(): Promise<MatOption[]> {
    return Array.from(this.matOptions.values());
  }
  
  async getMatOptionById(id: number): Promise<MatOption | undefined> {
    return this.matOptions.get(id);
  }
  
  async createMatOption(option: InsertMatOption): Promise<MatOption> {
    const id = this.matOptionCounter++;
    const newOption: MatOption = { ...option, id };
    this.matOptions.set(id, newOption);
    return newOption;
  }
  
  // Glass options operations
  async getGlassOptions(): Promise<GlassOption[]> {
    return Array.from(this.glassOptions.values());
  }
  
  async getGlassOptionById(id: number): Promise<GlassOption | undefined> {
    return this.glassOptions.get(id);
  }
  
  async createGlassOption(option: InsertGlassOption): Promise<GlassOption> {
    const id = this.glassOptionCounter++;
    const newOption: GlassOption = { ...option, id };
    this.glassOptions.set(id, newOption);
    return newOption;
  }
  
  // Chat messages operations
  async getChatMessagesBySessionId(sessionId: string): Promise<ChatMessage[]> {
    return this.chatMessages.filter(msg => msg.sessionId === sessionId);
  }
  
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageCounter++;
    const timestamp = new Date().toISOString();
    const newMessage: ChatMessage = { ...message, id, timestamp };
    this.chatMessages.push(newMessage);
    return newMessage;
  }
  
  // Initialize sample data
  private initializeSampleData() {
    // Create admin user
    const adminUser: User = {
      id: this.userCounter++,
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    };
    this.users.set(adminUser.id, adminUser);
    
    // Create frame options
    const frameOptions: InsertFrameOption[] = [
      {
        name: "Walnut Classic",
        color: "#8B4513",
        material: "Wood",
        pricePerInch: 150, // $1.50 per inch
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Gold Leaf",
        color: "#D4B996",
        material: "Metal",
        pricePerInch: 200, // $2.00 per inch
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Matte Black",
        color: "#2C3E50",
        material: "Wood",
        pricePerInch: 125, // $1.25 per inch
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "White Gallery",
        color: "#FFFFFF",
        material: "Wood",
        pricePerInch: 175, // $1.75 per inch
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Natural Maple",
        color: "#E5DCC5",
        material: "Wood",
        pricePerInch: 150, // $1.50 per inch
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    ];
    
    frameOptions.forEach(option => {
      const id = this.frameOptionCounter++;
      this.frameOptions.set(id, { ...option, id });
    });
    
    // Create mat options
    const matOptions: InsertMatOption[] = [
      {
        name: "White",
        color: "#FFFFFF",
        price: 3500, // $35.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Off-White",
        color: "#F5F5F5",
        price: 3500, // $35.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Light Gray",
        color: "#E5E9F0",
        price: 3500, // $35.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Black",
        color: "#2C3E50",
        price: 4000, // $40.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Ivory",
        color: "#FFFFF0",
        price: 3500, // $35.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    ];
    
    matOptions.forEach(option => {
      const id = this.matOptionCounter++;
      this.matOptions.set(id, { ...option, id });
    });
    
    // Create glass options
    const glassOptions: InsertGlassOption[] = [
      {
        name: "Standard Clear",
        description: "Basic clear glass with no UV protection",
        price: 2500 // $25.00
      },
      {
        name: "UV Protection",
        description: "Blocks up to 97% of UV rays to protect your artwork",
        price: 4500 // $45.00
      },
      {
        name: "Museum Glass (99% UV)",
        description: "Museum-quality glass with 99% UV protection and anti-glare properties",
        price: 8500 // $85.00
      },
      {
        name: "Non-Glare",
        description: "Etched glass that reduces glare but slightly reduces clarity",
        price: 3500 // $35.00
      }
    ];
    
    glassOptions.forEach(option => {
      const id = this.glassOptionCounter++;
      this.glassOptions.set(id, { ...option, id });
    });
    
    // Create products
    const products: InsertProduct[] = [
      {
        name: "Custom Frame",
        description: "Tailor-made frames designed for your specific artwork with expert guidance from our AI assistant.",
        price: 19400, // $194.00
        category: "frame",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          sizes: ["8x10", "11x14", "16x20", "18x24", "24x36"],
          frameOptions: [1, 2, 3, 4, 5],
          matOptions: [1, 2, 3, 4, 5],
          glassOptions: [1, 2, 3, 4]
        }
      },
      {
        name: "Shadowbox - Black",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 22500, // $225.00
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "12\" × 12\" × 2\"",
          color: "Black",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      {
        name: "Shadowbox - Walnut",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 22500, // $225.00
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "12\" × 12\" × 2\"",
          color: "Walnut",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      {
        name: "Moonmount™ - 8×10\"",
        description: "Our proprietary, patented museum mounting method that preserves your artwork for generations.",
        price: 4500, // $45.00
        category: "moonmount",
        imageUrl: "https://images.unsplash.com/photo-1577083553330-2b96be7af8fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "8\" × 10\"",
          type: "Museum Mount Only",
          archivalQuality: true
        }
      },
      {
        name: "Moonmount™ - 11×14\"",
        description: "Our proprietary, patented museum mounting method that preserves your artwork for generations.",
        price: 5500, // $55.00
        category: "moonmount",
        imageUrl: "https://images.unsplash.com/photo-1577083553330-2b96be7af8fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "11\" × 14\"",
          type: "Museum Mount Only",
          archivalQuality: true
        }
      },
      {
        name: "Moonmount™ - 16×20\"",
        description: "Our proprietary, patented museum mounting method that preserves your artwork for generations.",
        price: 6500, // $65.00
        category: "moonmount",
        imageUrl: "https://images.unsplash.com/photo-1577083553330-2b96be7af8fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "16\" × 20\"",
          type: "Museum Mount Only",
          archivalQuality: true
        }
      }
    ];
    
    products.forEach(product => {
      const id = this.productCounter++;
      this.products.set(id, { ...product, id });
    });
    
    // Create sample orders
    const orders: InsertOrder[] = [
      {
        customerName: "Sarah Johnson",
        customerEmail: "sarah.johnson@example.com",
        status: "in_progress",
        totalAmount: 19400, // $194.00
        items: [
          {
            productId: 1,
            name: "Custom Frame - Gold w/ White Mat",
            price: 19400,
            quantity: 1,
            details: {
              width: 16,
              height: 20,
              frameId: 2,
              matId: 1,
              glassId: 2
            }
          }
        ],
        currentStage: "frame_cutting",
        notes: "Customer wants it ready by end of next week if possible."
      }
    ];
    
    orders.forEach(order => {
      const id = this.orderCounter++;
      const createdAt = new Date().toISOString();
      this.orders.set(id, { ...order, id, createdAt });
    });
  }
}

export const storage = new MemStorage();
