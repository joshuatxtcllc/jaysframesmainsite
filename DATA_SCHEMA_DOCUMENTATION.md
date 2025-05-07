# Data Schema Documentation for Jay's Frames

## Overview
This document describes the core data schemas used in the Jay's Frames e-commerce platform. These schemas define the structure of entities like products, orders, frame options, and other core data types used throughout the application.

## Core Data Types

### User
```typescript
// From shared/schema.ts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
```

### Product
```typescript
// From shared/schema.ts
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in cents
  category: text("category").notNull(),
  details: jsonb("details"),
  imageUrl: text("image_url"),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// From client/src/types/index.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  details?: any;
}
```

### Order
```typescript
// From shared/schema.ts
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  status: text("status").notNull().default("pending"),
  totalAmount: integer("total_amount").notNull(), // Total in cents
  items: jsonb("items").notNull(), // Array of OrderItems
  createdAt: timestamp("created_at").defaultNow(),
  currentStage: text("current_stage").notNull().default("design"),
  notes: text("notes"),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// From client/src/types/index.ts
export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  currentStage: string;
  notes?: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  details?: any;
}
```

### Frame Option
```typescript
// From shared/schema.ts
export const frameOptions = pgTable("frame_options", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  material: text("material").notNull(),
  pricePerInch: integer("price_per_inch").notNull(), // Price per inch in cents
  imageUrl: text("image_url"),
  width: integer("width").default(25), // Default frame width in pixels for display
  details: jsonb("details"), // For Larson Juhl catalog properties
});

export type FrameOption = typeof frameOptions.$inferSelect;
export type InsertFrameOption = z.infer<typeof insertFrameOptionSchema>;

// From client/src/types/index.ts
export interface FrameOption {
  id: number;
  name: string;
  color: string;
  material: string;
  pricePerInch: number;
  imageUrl?: string;
  width?: number;
  details?: {
    collection?: string;
    style?: string;
    sku?: string;
    description?: string;
    details?: {
      width?: number;
    }
  }
}
```

### Mat Option
```typescript
// From shared/schema.ts
export const matOptions = pgTable("mat_options", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  price: integer("price").notNull(), // Price in cents
  imageUrl: text("image_url"),
});

export type MatOption = typeof matOptions.$inferSelect;
export type InsertMatOption = z.infer<typeof insertMatOptionSchema>;

// From client/src/types/index.ts
export interface MatOption {
  id: number;
  name: string;
  color: string;
  price: number;
  imageUrl?: string;
}
```

### Glass Option
```typescript
// From shared/schema.ts
export const glassOptions = pgTable("glass_options", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in cents
});

export type GlassOption = typeof glassOptions.$inferSelect;
export type InsertGlassOption = z.infer<typeof insertGlassOptionSchema>;

// From client/src/types/index.ts
export interface GlassOption {
  id: number;
  name: string;
  description: string;
  price: number;
}
```

### Chat Message
```typescript
// From shared/schema.ts
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  role: text("role").notNull(), // "user" | "assistant"
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// From client/src/types/index.ts
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
```

### Cart Item
```typescript
// From client/src/types/index.ts
export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  details?: {
    width?: number;
    height?: number;
    frameId?: number;
    matId?: number;
    glassId?: number;
    dimensions?: string;
    frameColor?: string;
    matColor?: string;
    glassType?: string;
    [key: string]: any;
  };
}
```

### AI Recommendation
```typescript
// From client/src/types/index.ts
export interface AIRecommendation {
  frames: FrameOption[];
  mats: MatOption[];
  explanation: string;
}

// From server/ai.ts
export type ChatResponse = {
  message: string;
  productRecommendations?: ProductInfo[];
  orderInfo?: OrderInfo;
};
```

## Storage Interface
The application uses a storage interface to abstract database operations. Here's the interface definition:

```typescript
// From server/storage.ts
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
```

## Implementation Notes

### In-Memory Storage
The current implementation uses an in-memory storage (MemStorage) which implements the IStorage interface:

```typescript
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private frameOptions: Map<number, FrameOption>;
  private matOptions: Map<number, MatOption>;
  private glassOptions: Map<number, GlassOption>;
  private chatMessages: ChatMessage[];
  
  // Counters for auto-incrementing IDs
  private userCounter: number;
  private productCounter: number;
  private orderCounter: number;
  private frameOptionCounter: number;
  private matOptionCounter: number;
  private glassOptionCounter: number;
  private chatMessageCounter: number;
  
  // Implementation of all interface methods...
}
```

### Sample Data
The storage implementation includes sample data initialization for testing:

```typescript
private initializeSampleData() {
  // Sample users
  const adminUser: User = {
    id: 1,
    username: 'admin',
    passwordHash: 'admin123', // In a real app, this would be hashed
    email: 'admin@jaysframes.com',
    isAdmin: true
  };
  this.users.set(adminUser.id, adminUser);
  
  // Sample products
  // Sample frame options
  // Sample mat options
  // Sample glass options
  // etc.
}
```

## Larson Juhl Frame Details

The Larson Juhl frame catalog is imported into the system with additional details stored in the `details` field of the `frameOptions` table. This allows for categorization and filtering by collection.

### Collection Hierarchy

Frames are organized by collections:
- Academie
- Allure
- Metro 
- Biltmore
- Linea
- Hanover

Each collection contains multiple frame styles with their own SKUs and descriptions.

### Frame Details Structure

```json
{
  "collection": "Collection name (e.g., 'Academie', 'Allure', 'Metro')",
  "style": "Style description (e.g., 'traditional', 'contemporary', 'modern')",
  "sku": "Stock keeping unit identifier (e.g., 'ACAD-001')",
  "description": "Detailed description of the frame",
  "details": {
    "width": "Width of the frame in millimeters"
  }
}
```

## Type Inconsistencies and Known Issues

1. **Optional vs. Required Fields**:
   - In the schema.ts definitions, certain fields like `details` in products are required, but in the frontend types they're optional.
   - The `details` field in frameOptions is now used for Larson Juhl catalog information.

2. **Date Handling**:
   - The schema defines `createdAt` as a timestamp, but it's handled as a string in some parts of the code.

3. **Image URL Handling**:
   - The imageUrl field is defined as possibly undefined in some types but not others.

4. **Type Safety in AI Functions**:
   - Some AI functions use `any` types for parameters and return values, which could be more strongly typed.

## Migration Considerations

If migrating to a database in the future:
1. The schema definitions in `shared/schema.ts` can be used directly with Drizzle ORM
2. The storage interface should continue to be used to abstract the database implementation
3. Special attention should be paid to JSON fields like `details` in products and `items` in orders
4. Date/timestamp handling would need to be standardized across the application