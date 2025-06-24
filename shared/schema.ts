import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  isAdmin: boolean("is_admin").default(false),
  role: text("role").default("customer"), // customer, admin, staff
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
  address: jsonb("address"), // For shipping/billing addresses
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
  isAdmin: true,
});

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in cents
  salePrice: integer("sale_price"), // Sale price in cents
  category: text("category").notNull(), // 'frame', 'shadowbox', 'moonmount'
  subcategory: text("subcategory"),
  imageUrl: text("image_url"),
  images: jsonb("images"), // Array of additional images
  details: jsonb("details"), // For specific product details like dimensions, colors, etc.
  stockQuantity: integer("stock_quantity").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  sku: text("sku").unique(), // Stock Keeping Unit
  barcode: text("barcode"), // UPC, EAN, etc.
  weight: integer("weight"), // Weight in grams
  dimensions: jsonb("dimensions"), // {length, width, height} in cm or inches
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  tags: jsonb("tags"), // Array of tags for filtering and search
  relatedProductIds: jsonb("related_product_ids"), // Array of related product IDs
  supplierInfo: jsonb("supplier_info"), // Information about the supplier
  reorderPoint: integer("reorder_point").default(3), // When to reorder
  reorderQuantity: integer("reorder_quantity").default(10), // How much to reorder
  lastRestockDate: timestamp("last_restock_date"),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastRestockDate: true,
});

// Order model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  status: text("status").notNull().default("pending"), // pending, processing, completed, shipped, delivered, cancelled
  totalAmount: integer("total_amount").notNull(), // Total amount in cents
  items: jsonb("items").notNull(), // Array of order items
  shippingAddress: jsonb("shipping_address"),
  billingAddress: jsonb("billing_address"),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, refunded, failed
  paymentMethod: text("payment_method"), // credit_card, paypal, etc.
  paymentId: text("payment_id"), // ID from payment processor
  trackingNumber: text("tracking_number"),
  shippingMethod: text("shipping_method"),
  shippingCost: integer("shipping_cost").default(0), // Shipping cost in cents
  taxAmount: integer("tax_amount").default(0), // Tax amount in cents
  discount: integer("discount").default(0), // Discount amount in cents
  couponCode: text("coupon_code"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  estimatedDeliveryDate: timestamp("estimated_delivery_date"),
  currentStage: text("current_stage").notNull().default("order_received"), // order_received, design, production, quality_check, packaging, shipped
  stageHistory: jsonb("stage_history").default([]), // Array of stage changes with timestamps
  notes: text("notes"),
  adminNotes: text("admin_notes"), // Notes visible only to admins/staff
});

export const insertOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number(),
    price: z.number(),
    name: z.string().optional(),
    details: z.any().optional()
  })),
  totalAmount: z.number(),
  status: z.string().default("pending"),
  shippingAddress: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string()
  }).optional(),
  notes: z.string().optional(),
  paymentIntentId: z.string().optional()
});

// Frame options model
export const frameOptions = pgTable("frame_options", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  material: text("material").notNull(),
  pricePerInch: integer("price_per_inch").notNull(), // Price per inch in cents
  imageUrl: text("image_url"),
  width: integer("width").default(25), // Default frame width in pixels for display
  details: jsonb("details"), // For Larson Juhl catalog properties (collection, style, sku, etc.)
});

export const insertFrameOptionSchema = createInsertSchema(frameOptions).omit({
  id: true,
});

// Mat options model
export const matOptions = pgTable("mat_options", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  price: integer("price").notNull(), // Price in cents
  imageUrl: text("image_url"),
});

export const insertMatOptionSchema = createInsertSchema(matOptions).omit({
  id: true,
});

// Reveal sizes for mats
export const revealSizes = pgTable("reveal_sizes", {
  id: serial("id").primaryKey(),
  size: text("size").notNull(), // e.g. "1/8 inch", "1/4 inch", "1/2 inch", "3/4 inch", "1 inch"
  sizeInches: integer("size_inches").notNull(), // Size in 1/8 inch increments (1 = 1/8, 8 = 1 inch)
  displayName: text("display_name").notNull(), // e.g. "1/8\"", "1/4\"", etc.
});

export const insertRevealSizeSchema = createInsertSchema(revealSizes).omit({
  id: true,
});

// Glass options model
export const glassOptions = pgTable("glass_options", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in cents
});

export const insertGlassOptionSchema = createInsertSchema(glassOptions).omit({
  id: true,
});

// Define chat message schema
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type FrameOption = typeof frameOptions.$inferSelect;
export type InsertFrameOption = z.infer<typeof insertFrameOptionSchema>;

export type MatOption = typeof matOptions.$inferSelect;
export type InsertMatOption = z.infer<typeof insertMatOptionSchema>;

export type RevealSize = typeof revealSizes.$inferSelect;
export type InsertRevealSize = z.infer<typeof insertRevealSizeSchema>;

export type GlassOption = typeof glassOptions.$inferSelect;
export type InsertGlassOption = z.infer<typeof insertGlassOptionSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// Blog Categories
export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBlogCategorySchema = createInsertSchema(blogCategories).omit({
  id: true,
  createdAt: true,
});

export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  authorId: integer("author_id").references(() => users.id),
  categoryId: integer("category_id").references(() => blogCategories.id),
  status: varchar("status", { length: 20 }).default("draft").notNull(),
  metaTitle: varchar("meta_title", { length: 200 }),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// Appointments for consultation and pickups
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // consultation, pickup, measurement, etc.
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location").default("store"), // store, customer_location, virtual
  address: jsonb("address"), // If location is customer_location
  virtualMeetingUrl: text("virtual_meeting_url"), // If location is virtual
  status: text("status").default("scheduled"), // scheduled, confirmed, completed, cancelled, no_show
  notes: text("notes"),
  customerNotes: text("customer_notes"), // Notes from the customer
  staffNotes: text("staff_notes"), // Notes only visible to staff
  reminderSent: boolean("reminder_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  orderId: integer("order_id").references(() => orders.id), // If associated with an order
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  reminderSent: true,
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

// Service availability (business hours and special days)
export const serviceAvailability = pgTable("service_availability", {
  id: serial("id").primaryKey(),
  dayOfWeek: integer("day_of_week"), // 0 = Sunday, 1 = Monday, etc. (null for specific date)
  specificDate: timestamp("specific_date"), // For holidays or special days (null for regular weekday)
  openTime: text("open_time"), // Format: HH:MM in 24-hour format
  closeTime: text("close_time"), // Format: HH:MM in 24-hour format
  maxAppointments: integer("max_appointments").default(5), // Max appointments per slot
  slotDuration: integer("slot_duration").default(60), // Duration of each appointment slot in minutes
  isAvailable: boolean("is_available").default(true), // Set to false for holidays or days off
  notes: text("notes"), // E.g., "Holiday hours", "Staff training day"
});

export const insertServiceAvailabilitySchema = createInsertSchema(serviceAvailability).omit({
  id: true,
});

export type ServiceAvailability = typeof serviceAvailability.$inferSelect;
export type InsertServiceAvailability = z.infer<typeof insertServiceAvailabilitySchema>;

// Design Achievements/Badges
export const designAchievements = pgTable("design_achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  category: text("category").notNull(), // frame, mat, glass, completion, etc.
  points: integer("points").default(10).notNull(),
  rarity: text("rarity").default("common"), // common, uncommon, rare, epic, legendary
  criteria: jsonb("criteria").notNull(), // JSON object with conditions to earn this achievement
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDesignAchievementSchema = createInsertSchema(designAchievements).omit({
  id: true,
  createdAt: true,
});

// User Design Progress
export const userDesignProgress = pgTable("user_design_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  designId: text("design_id").notNull(), // Unique identifier for the current design session
  stepsCompleted: jsonb("steps_completed").default([]).notNull(), // Array of completed step IDs
  currentStep: text("current_step"), // Current step in the design process
  totalPoints: integer("total_points").default(0).notNull(),
  designChoices: jsonb("design_choices").default({}), // User's current design selections
  frameSelected: boolean("frame_selected").default(false),
  matSelected: boolean("mat_selected").default(false),
  glassSelected: boolean("glass_selected").default(false),
  hasCustomSize: boolean("has_custom_size").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastInteractionAt: timestamp("last_interaction_at").defaultNow(),
});

export const insertUserDesignProgressSchema = createInsertSchema(userDesignProgress).omit({
  id: true,
  totalPoints: true,
  createdAt: true,
  updatedAt: true,
  lastInteractionAt: true,
});

// User Achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => designAchievements.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
  designId: text("design_id"), // Associated design if applicable
  pointsEarned: integer("points_earned").notNull(),
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earnedAt: true,
});

// Design Steps (predefined steps in the design journey)
export const designSteps = pgTable("design_steps", {
  id: serial("id").primaryKey(),
  stepKey: text("step_key").notNull().unique(), // unique identifier for the step
  name: text("name").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(), // For ordering steps in the UI
  points: integer("points").default(5).notNull(), // Points earned for completing this step
  isRequired: boolean("is_required").default(true),
  category: text("category").notNull(), // frame, mat, glass, sizing, etc.
  tips: jsonb("tips"), // Array of helpful tips for this step
});

export const insertDesignStepSchema = createInsertSchema(designSteps).omit({
  id: true,
});

// Discount Codes
export const discountCodes = pgTable("discount_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  percentage: integer("percentage").notNull(), // Discount percentage (0-100)
  minOrderAmount: integer("min_order_amount"), // Minimum order amount in cents
  maxDiscountAmount: integer("max_discount_amount"), // Maximum discount amount in cents
  usageLimit: integer("usage_limit"), // Maximum number of uses (null for unlimited)
  usedCount: integer("used_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"), // Expiration date (null for no expiration)
  createdBy: integer("created_by").references(() => users.id),
});

export const insertDiscountCodeSchema = createInsertSchema(discountCodes).omit({
  id: true,
  usedCount: true,
  createdAt: true,
});

// Export types for the new schemas
export type DesignAchievement = typeof designAchievements.$inferSelect;
export type InsertDesignAchievement = z.infer<typeof insertDesignAchievementSchema>;

export type UserDesignProgress = typeof userDesignProgress.$inferSelect;
export type InsertUserDesignProgress = z.infer<typeof insertUserDesignProgressSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type DesignStep = typeof designSteps.$inferSelect;
export type InsertDesignStep = z.infer<typeof insertDesignStepSchema>;

export type DiscountCode = typeof discountCodes.$inferSelect;
export type InsertDiscountCode = z.infer<typeof insertDiscountCodeSchema>;