import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in cents
  category: text("category").notNull(), // 'frame', 'shadowbox', 'moonmount'
  imageUrl: text("image_url"),
  details: jsonb("details"), // For specific product details like dimensions, colors, etc.
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

// Order model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, etc.
  totalAmount: integer("total_amount").notNull(), // Total amount in cents
  items: jsonb("items").notNull(), // Array of order items
  createdAt: timestamp("created_at").defaultNow(),
  currentStage: text("current_stage").notNull().default("order_received"), // For tracking the current stage in the production process
  notes: text("notes"),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

// Frame options model
export const frameOptions = pgTable("frame_options", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  material: text("material").notNull(),
  pricePerInch: integer("price_per_inch").notNull(), // Price per inch in cents
  imageUrl: text("image_url"),
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

export type GlassOption = typeof glassOptions.$inferSelect;
export type InsertGlassOption = z.infer<typeof insertGlassOptionSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
