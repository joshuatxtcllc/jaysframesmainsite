// Product related types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  details?: any;
}

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
  };
  // Backward compatibility for older code
  collection?: string;
  collectionInfo?: {
    style: string;
    features: string;
    bestFor: string;
    description: string;
  };
  finish?: string;
}

export interface MatOption {
  id: number;
  name: string;
  color: string;
  price: number;
  imageUrl?: string;
  // Enhanced properties from catalog data
  matType?: string;
  matInfo?: {
    texture: string;
    finish: string;
    conservation: boolean;
    bestFor: string;
    description: string;
  };
  texture?: string;
}

export interface GlassOption {
  id: number;
  name: string;
  description: string;
  price: number;
}

// Cart related types
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

// Order related types
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

// Chat related types
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIRecommendation {
  frames: FrameOption[];
  mats: MatOption[];
  explanation: string;
}
