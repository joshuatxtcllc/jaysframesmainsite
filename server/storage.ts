import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  orders, type Order, type InsertOrder,
  frameOptions, type FrameOption, type InsertFrameOption,
  matOptions, type MatOption, type InsertMatOption,
  glassOptions, type GlassOption, type InsertGlassOption,
  chatMessages, type ChatMessage, type InsertChatMessage,
  blogCategories, type BlogCategory, type InsertBlogCategory,
  blogPosts, type BlogPost, type InsertBlogPost,
  appointments, type Appointment, type InsertAppointment,
  serviceAvailability, type ServiceAvailability, type InsertServiceAvailability
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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private frameOptions: Map<number, FrameOption>;
  private matOptions: Map<number, MatOption>;
  private glassOptions: Map<number, GlassOption>;
  private chatMessages: ChatMessage[];
  private blogCategories: Map<number, BlogCategory>;
  private blogPosts: Map<number, BlogPost>;

  private userCounter: number;
  private productCounter: number;
  private orderCounter: number;
  private frameOptionCounter: number;
  private matOptionCounter: number;
  private glassOptionCounter: number;
  private chatMessageCounter: number;
  private blogCategoryCounter: number;
  private blogPostCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.frameOptions = new Map();
    this.matOptions = new Map();
    this.glassOptions = new Map();
    this.chatMessages = [];
    this.blogCategories = new Map();
    this.blogPosts = new Map();

    this.userCounter = 1;
    this.productCounter = 1;
    this.orderCounter = 1;
    this.frameOptionCounter = 1;
    this.matOptionCounter = 1;
    this.glassOptionCounter = 1;
    this.chatMessageCounter = 1;
    this.blogCategoryCounter = 1;
    this.blogPostCounter = 1;

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

  // Blog Category operations
  async getBlogCategories(): Promise<BlogCategory[]> {
    return Array.from(this.blogCategories.values());
  }

  async getBlogCategoryById(id: number): Promise<BlogCategory | undefined> {
    return this.blogCategories.get(id);
  }

  async getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined> {
    return Array.from(this.blogCategories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory> {
    const id = this.blogCategoryCounter++;
    const createdAt = new Date().toISOString();
    const newCategory: BlogCategory = { ...category, id, createdAt };
    this.blogCategories.set(id, newCategory);
    return newCategory;
  }

  async updateBlogCategory(id: number, categoryUpdate: Partial<InsertBlogCategory>): Promise<BlogCategory | undefined> {
    const category = this.blogCategories.get(id);
    if (!category) return undefined;

    const updatedCategory: BlogCategory = { ...category, ...categoryUpdate };
    this.blogCategories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteBlogCategory(id: number): Promise<boolean> {
    return this.blogCategories.delete(id);
  }
  
  // Blog Post operations
  async getBlogPosts(limit?: number, offset?: number): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    
    if (offset !== undefined) {
      posts = posts.slice(offset);
    }
    
    if (limit !== undefined) {
      posts = posts.slice(0, limit);
    }
    
    return posts;
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }

  async getBlogPostsByCategory(categoryId: number, limit?: number, offset?: number): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values()).filter(
      (post) => post.categoryId === categoryId
    );
    
    if (offset !== undefined) {
      posts = posts.slice(offset);
    }
    
    if (limit !== undefined) {
      posts = posts.slice(0, limit);
    }
    
    return posts;
  }

  async getBlogPostsByStatus(status: string, limit?: number, offset?: number): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values()).filter(
      (post) => post.status === status
    );
    
    if (offset !== undefined) {
      posts = posts.slice(offset);
    }
    
    if (limit !== undefined) {
      posts = posts.slice(0, limit);
    }
    
    return posts;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostCounter++;
    const now = new Date().toISOString();
    const newPost: BlogPost = { 
      ...post, 
      id, 
      createdAt: now, 
      updatedAt: now,
      publishedAt: post.status === 'published' ? now : null
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: number, postUpdate: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;

    const now = new Date().toISOString();
    const updatedPost: BlogPost = { 
      ...post, 
      ...postUpdate,
      updatedAt: now
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async publishBlogPost(id: number): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;

    const now = new Date().toISOString();
    const publishedPost: BlogPost = { 
      ...post, 
      status: 'published',
      publishedAt: now,
      updatedAt: now
    };
    this.blogPosts.set(id, publishedPost);
    return publishedPost;
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
    
    // Create sample blog categories and posts directly
    // Sample blog categories
    const categories: InsertBlogCategory[] = [
      {
        name: "Custom Framing Tips",
        slug: "custom-framing-tips",
        description: "Expert advice and tips for custom framing projects in Houston and beyond."
      },
      {
        name: "Art Preservation",
        slug: "art-preservation",
        description: "Learn about museum-quality conservation techniques and how to preserve your valuable artwork."
      },
      {
        name: "Frame Design Inspiration",
        slug: "frame-design-inspiration",
        description: "Get inspired with creative framing ideas and design concepts from our experts."
      },
      {
        name: "Houston Art Scene",
        slug: "houston-art-scene",
        description: "Discover the vibrant art community in Houston, including galleries, events, and local artists."
      },
      {
        name: "Art Installation",
        slug: "art-installation",
        description: "Professional guidance on art installation, hanging techniques, and display solutions."
      }
    ];

    // Create categories
    categories.forEach(category => {
      const id = this.blogCategoryCounter++;
      const createdAt = new Date().toISOString();
      this.blogCategories.set(id, { ...category, id, createdAt });
    });
    
    // Sample blog posts with SEO-rich content
    const posts: InsertBlogPost[] = [
      {
        title: "The Ultimate Guide to Custom Framing in Houston",
        slug: "ultimate-guide-custom-framing-houston",
        excerpt: "Everything you need to know about custom framing services in Houston, from choosing the right frame to preserving your artwork.",
        content: `
# The Ultimate Guide to Custom Framing in Houston

Houston's vibrant art scene deserves the very best in custom framing. Whether you're looking to preserve a family heirloom, showcase a new piece of art, or frame a special memento, finding the right framing solution is essential.

## Why Choose Custom Framing?

Unlike mass-produced frames, custom framing offers several significant advantages:

- **Perfect sizing for your specific artwork**
- **Materials selected specifically for preservation**
- **Professional design guidance to complement your piece**
- **Quality craftsmanship that lasts generations**

## Houston's Custom Framing Process

At Jay's Frames in Houston, we follow a collaborative approach throughout the framing process:

1. **Initial Consultation**: We discuss your artwork's needs, your style preferences, and where the piece will be displayed.
2. **Material Selection**: Choose from premium frame materials, conservation glass options, and archival matting.
3. **Expert Design Guidance**: Our framing experts provide recommendations based on your artwork's specific needs.
4. **Precision Craftsmanship**: Your frame is crafted with meticulous attention to detail.
5. **Final Review & Installation**: Review your finished piece and get professional installation if needed.

## Preservation Considerations for Houston's Climate

Houston's unique climate presents special challenges for artwork preservation. Our high humidity and temperature fluctuations can damage artwork over time if not properly framed.

Our museum-quality framing techniques include:

- **UV-protective glass** that blocks up to 99% of harmful rays
- **Acid-free matting** to prevent deterioration
- **Conservation backing** that prevents moisture damage
- **Sealed framing packages** to protect against Houston's humidity

## Finding the Right Custom Framing Service in Houston

When searching for "custom framing Houston," consider these factors:

- **Experience with preservation techniques**
- **Quality of materials used**
- **Design expertise**
- **Customer reviews and testimonials**
- **Turnaround time**

At Jay's Frames, we pride ourselves on addressing all these concerns with our expert custom framing services.

## Ready to Frame Your Special Piece?

Visit our Houston Heights location to experience the difference professional custom framing makes. Our team is dedicated to preserving and enhancing your artwork with museum-quality framing techniques.
        `,
        metaTitle: "The Ultimate Guide to Custom Framing in Houston | Jay's Frames",
        metaDescription: "Learn everything about custom framing in Houston from the experts at Jay's Frames. Museum-quality preservation, design expertise, and professional service.",
        keywords: "custom framing Houston, Houston frame shop, museum quality framing, art preservation framing, Houston Heights framing",
        status: "published",
        categoryId: 1,
        authorId: 1
      },
      {
        title: "5 Museum-Quality Preservation Techniques for Your Valuable Artwork",
        slug: "museum-quality-preservation-techniques-valuable-artwork",
        excerpt: "Discover the professional preservation methods that museums use to protect artwork, and how we implement these same techniques for your precious pieces.",
        content: `
# 5 Museum-Quality Preservation Techniques for Your Valuable Artwork

When it comes to preserving valuable artwork, museums employ specific conservation techniques that have been refined over decades. At Jay's Frames, we bring these same museum-quality preservation methods to every framing project we undertake.

## 1. UV Protection Glass

Ultraviolet light is one of the greatest enemies of artwork, causing fading, yellowing, and deterioration over time. Museums address this by using specialized glazing that blocks harmful UV rays.

**Our approach:** We offer conservation-grade glass and acrylic options that block up to 99% of UV radiation while maintaining optical clarity. This museum-standard protection helps your artwork maintain its vibrant colors and prevents premature aging.

## 2. Acid-Free Matting and Mounting

Acids from poor-quality materials can cause discoloration, brittleness, and deterioration of artwork over time.

**Our approach:** We use only conservation-grade, acid-free, and lignin-free matting materials that meet museum standards. These materials are pH neutral or slightly alkaline, ensuring they won't damage your artwork over time.

## 3. Reversible Mounting Techniques

Museums always ensure that any conservation work can be reversed without damaging the original piece.

**Our approach:** Our proprietary Moonmount™ technique uses conservation-grade, reversible mounting methods that secure artwork without permanent adhesives. This allows for future conservation work without risking damage to the piece.

## 4. Sealed Frame Packages

Environmental contaminants including dust, insects, and pollutants can damage artwork over time.

**Our approach:** We create sealed frame packages using conservation-grade sealing tape and backing materials, establishing a protective microenvironment around your artwork similar to museum display cases.

## 5. Climate Considerations

Museums carefully control temperature and humidity to prevent artwork deterioration.

**Our approach:** We design our custom frames with Houston's specific climate challenges in mind, incorporating moisture barriers and allowing for slight dimensional changes that occur with seasonal humidity fluctuations.

## Why Museum-Quality Preservation Matters in Houston

Houston's unique climate presents particular challenges for artwork preservation. Our high humidity, temperature fluctuations, and air quality issues make proper framing even more critical for long-term preservation.

By implementing these museum-quality techniques in all our custom framing projects, we ensure that your valuable artwork, memorabilia, and keepsakes will be protected for generations to come.

Visit Jay's Frames to learn more about our conservation framing services and how we can help preserve your most precious pieces.
        `,
        metaTitle: "Museum-Quality Art Preservation Techniques | Jay's Frames Houston",
        metaDescription: "Learn the 5 essential museum-quality preservation techniques we use to protect valuable artwork from Houston's climate challenges.",
        keywords: "museum quality framing, art preservation Houston, conservation framing, archival framing services, UV protection framing",
        status: "published",
        categoryId: 2,
        authorId: 1
      },
      {
        title: "Professional Art Installation Services in Houston: What to Expect",
        slug: "professional-art-installation-services-houston",
        excerpt: "Learn about our comprehensive art installation services in Houston and why professional installation makes a difference for your valuable artwork.",
        content: `
# Professional Art Installation Services in Houston: What to Expect

Proper art installation is the final crucial step in showcasing your valuable artwork. At Jay's Frames, we don't just create beautiful custom frames—we ensure your artwork is displayed perfectly with our professional installation services.

## Why Professional Installation Matters

Many Houston homeowners and businesses underestimate the importance of professional art installation. Here's why it should never be an afterthought:

- **Damage Prevention:** Improper hanging can damage both your artwork and your walls
- **Security:** Properly installed artwork is securely mounted to prevent accidents
- **Optimal Viewing:** Professional installers understand the principles of height, lighting, and spacing
- **Special Mounting Needs:** Heavy pieces, groupings, and unusual spaces require specialized hardware and techniques
- **Wall Material Considerations:** Different wall materials require specific mounting approaches

## Our Houston Art Installation Process

### 1. Initial Consultation and Site Assessment

Our installation experts begin by evaluating your space, considering:

- **Wall construction** (drywall, plaster, concrete, brick)
- **Lighting conditions** throughout the day
- **Furniture placement** and traffic patterns
- **Visibility from different angles** and seating areas
- **Special considerations** like humidity from nearby bathrooms or kitchens

### 2. Placement Planning

Before any hardware is installed, we:

- Use laser levels to mark exact placement
- Consider eye-level viewing height (typically 57-60 inches from floor to center)
- Provide temporary placement to visualize the final result
- Accommodate groupings and gallery walls with precision spacing

### 3. Professional Installation

Our installation team comes equipped with:

- **Specialized hardware** appropriate for your specific wall type and artwork weight
- **Protective materials** to prevent damage to walls and artwork
- **Precision tools** for accurate measurement and placement
- **Security hardware** for valuable pieces when needed

### 4. Final Adjustments

Once installed, we make final adjustments to ensure:

- Perfect leveling
- Proper lighting
- Secure attachment
- Protection from environmental factors

## Beyond Basic Installation: Our Additional Services

- **Gallery wall design and installation**
- **Museum-style hanging systems** for easy rotation of artwork
- **Specialty lighting installation** to highlight your artwork
- **Corporate and commercial installation** for offices and businesses
- **Earthquake/child safety securing** for added protection

## The Houston Difference

Houston's unique environment presents specific challenges for art installation. Our high humidity, occasional seismic activity, and varied building construction methods require specialized knowledge for proper installation.

Our team understands these local challenges and implements techniques to ensure your artwork remains secure and perfectly positioned despite these environmental factors.

## Ready to Display Your Artwork Perfectly?

Contact Jay's Frames to schedule a professional art installation service. Our expert team will ensure your valuable artwork is displayed at its best while being properly protected.
        `,
        metaTitle: "Professional Art Installation Services in Houston | Jay's Frames",
        metaDescription: "Discover our comprehensive art installation services in Houston. Expert hanging, security hardware, and perfect placement for your valuable artwork.",
        keywords: "art installation services Houston, professional art hanging, gallery wall installation, artwork display solutions, custom framing installation",
        status: "published",
        categoryId: 5,
        authorId: 1
      }
    ];

    // Create posts
    posts.forEach(post => {
      const id = this.blogPostCounter++;
      const now = new Date().toISOString();
      this.blogPosts.set(id, { 
        ...post, 
        id, 
        createdAt: now, 
        updatedAt: now,
        publishedAt: post.status === 'published' ? now : null
      });
    });

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
        color: "#000000",
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
      },
      {
        name: "Cherry Wood",
        color: "#6E2C00",
        material: "Wood",
        pricePerInch: 165, // $1.65 per inch
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Brushed Silver",
        color: "#C0C0C0",
        material: "Metal",
        pricePerInch: 195, // $1.95 per inch
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Mahogany",
        color: "#4E1500",
        material: "Wood",
        pricePerInch: 175, // $1.75 per inch
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Bronze",
        color: "#CD7F32",
        material: "Metal",
        pricePerInch: 185, // $1.85 per inch
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Distressed Blue",
        color: "#4A6D8C",
        material: "Wood",
        pricePerInch: 160, // $1.60 per inch
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Espresso Dark",
        color: "#3C2A21",
        material: "Wood",
        pricePerInch: 155, // $1.55 per inch
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Midnight Blue",
        color: "#191970",
        material: "Metal",
        pricePerInch: 170, // $1.70 per inch
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
        color: "#000000",
        price: 4000, // $40.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Ivory",
        color: "#FFFFF0",
        price: 3500, // $35.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Cream",
        color: "#FFF8DC",
        price: 3500, // $35.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Light Beige",
        color: "#F5F5DC",
        price: 3500, // $35.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Charcoal",
        color: "#36454F",
        price: 4000, // $40.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Navy Blue",
        color: "#000080",
        price: 4200, // $42.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Forest Green",
        color: "#228B22",
        price: 4200, // $42.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Burgundy",
        color: "#800020",
        price: 4200, // $42.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Sage Green",
        color: "#8A9A5B",
        price: 4000, // $40.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Slate Blue",
        color: "#6A5ACD",
        price: 4200, // $42.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Blush Pink",
        color: "#FFB6C1",
        price: 4000, // $40.00
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Light Taupe",
        color: "#B9AB9C",
        price: 3800, // $38.00
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
      // Black Shadowboxes
      {
        name: "Shadowbox - Black (16×20)",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 22500,
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "16\" × 20\" × 2\"",
          color: "Black",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      {
        name: "Shadowbox - Black (18×24)",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 24500,
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "18\" × 24\" × 2\"",
          color: "Black",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      {
        name: "Shadowbox - Black (24×36)",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 29500,
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "24\" × 36\" × 2\"",
          color: "Black",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      {
        name: "Shadowbox - Black (36×48)",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 34500,
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "36\" × 48\" × 2\"",
          color: "Black",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      // White Shadowboxes
      {
        name: "Shadowbox - White (16×20)",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 22500,
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "16\" × 20\" × 2\"",
          color: "White",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      {
        name: "Shadowbox - White (18×24)",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 24500,
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "18\" × 24\" × 2\"",
          color: "White",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      {
        name: "Shadowbox - White (24×36)",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 29500,
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "24\" × 36\" × 2\"",
          color: "White",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      {
        name: "Shadowbox - White (36×48)",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 34500,
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "36\" × 48\" × 2\"",
          color: "White",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      // Brown Shadowboxes
      {
        name: "Shadowbox - Brown (16×20)",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 22500,
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "16\" × 20\" × 2\"",
          color: "Brown",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      {
        name: "Shadowbox - Brown (18×24)",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 24500,
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "18\" × 24\" × 2\"",
          color: "Brown",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      {
        name: "Shadowbox - Brown (24×36)",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 29500,
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "24\" × 36\" × 2\"",
          color: "Brown",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      {
        name: "Shadowbox - Brown (36×48)",
        description: "Showcase memorabilia, 3D objects, and keepsakes in our custom shadowbox frames.",
        price: 34500,
        category: "shadowbox",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        details: {
          dimensions: "36\" × 48\" × 2\"",
          color: "Brown",
          material: "Wood",
          glassType: "UV Protection"
        }
      },
      {
        name: "Moonmount™ - 8×10\"",
        description: "Our proprietary, patented museum mounting method that preserves your artwork for generations.",
        price: 4500, // $45.00
        category: "moonmount",
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
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
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
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
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
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



import { db } from "./db";
import { eq, desc, and, like, sql, asc, lte, gte, isNull, not } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // Helper method to check if database is available
  private async checkDb(): Promise<boolean> {
    if (!db) {
      console.warn("Database connection not available");
      return false;
    }
    return true;
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
      
      // If status is 'completed', update the completedAt date
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