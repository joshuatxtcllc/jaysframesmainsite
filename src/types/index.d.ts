import { type FrameOption as DrizzleFrameOption } from "@shared/schema";
import { type MatOption as DrizzleMatOption } from "@shared/schema";
import { type GlassOption as DrizzleGlassOption } from "@shared/schema";

declare global {
  interface Window {
    jfNotifications?: {
      init: (options?: JFNotificationOptions) => void;
      onNotification: (callback: (notification: JFNotification) => void) => () => void;
      sendNotification: (notification: Omit<JFNotification, "id" | "timestamp">) => Promise<string>;
    };
  }
}

export type JFNotification = {
  id: string;
  title: string;
  description: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  source: string;
  sourceId: string;
  actionable: boolean;
  link?: string;
  smsEnabled: boolean;
  smsRecipient: string;
};

export type JFNotificationOptions = {
  apiKey?: string;
  autoConnect?: boolean;
  target?: string;
  styles?: boolean;
};

export interface FrameOption {
  id: number;
  name: string;
  color: string;
  material: string;
  pricePerInch: number;
  imageUrl?: string;
}

export interface MatOption {
  id: number;
  name: string;
  color: string;
  material: string;
  pricePerInch: number;
  imageUrl?: string;
}

export interface GlassOption {
  id: number;
  name: string;
  type: string;
  pricePerInch: number;
  antiGlare: boolean;
  uvProtection: boolean;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  type: "frame" | "custom";
  productId?: number;
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

export interface AIRecommendation {
  frames: FrameOption[];
  mats: MatOption[];
  explanation: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
}

export interface Order {
  id: number;
  customerId?: number;
  customerName: string;
  customerEmail: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  currentStage?: string;
  estimatedCompletion?: string | Date;
  paymentMethod?: string;
  paymentStatus?: string;
}

export interface OrderItem {
  id?: number;
  orderId?: number;
  productId?: number;
  name: string;
  price: number;
  quantity: number;
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

export interface ARFrameConfig {
  frameId: number;
  matId: number;
  glassId: number;
  width: number;
  height: number;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  opacity: number;
}