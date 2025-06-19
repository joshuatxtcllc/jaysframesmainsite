/**
 * External API Integration Service
 * Handles connections to Kanban app and POS system
 */

export interface KanbanOrderStatus {
  orderId: string;
  status: string;
  stage: string;
  estimatedCompletion?: string;
  notes?: string;
  lastUpdated: string;
}

export interface POSOrderData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{
    productId?: number;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  orderDate: string;
  specialInstructions?: string;
}

export interface ExternalAPIConfig {
  kanbanApiUrl?: string;
  kanbanApiKey?: string;
  posApiUrl?: string;
  posApiKey?: string;
  timeout?: number;
}

class ExternalAPIService {
  private config: ExternalAPIConfig;

  constructor(config: ExternalAPIConfig = {}) {
    this.config = {
      kanbanApiUrl: process.env.KANBAN_API_URL,
      kanbanApiKey: process.env.KANBAN_API_KEY,
      posApiUrl: process.env.POS_API_URL,
      posApiKey: process.env.POS_API_KEY,
      timeout: 10000, // 10 seconds
      ...config
    };
  }

  /**
   * Retrieve order status from Kanban app
   */
  async getOrderStatusFromKanban(orderId: string): Promise<KanbanOrderStatus | null> {
    if (!this.config.kanbanApiUrl || !this.config.kanbanApiKey) {
      console.warn('Kanban API configuration missing. Set KANBAN_API_URL and KANBAN_API_KEY environment variables.');
      return null;
    }

    try {
      const response = await fetch(`${this.config.kanbanApiUrl}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.kanbanApiKey}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Order not found
        }
        throw new Error(`Kanban API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        orderId: data.id || orderId,
        status: data.status || 'unknown',
        stage: data.stage || data.current_stage || 'pending',
        estimatedCompletion: data.estimated_completion || data.estimatedCompletion,
        notes: data.notes || data.description,
        lastUpdated: data.last_updated || data.updatedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching order status from Kanban:', error);
      throw new Error(`Failed to retrieve order status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Push order to POS system for records and pricing
   */
  async pushOrderToPOS(orderData: POSOrderData): Promise<{ success: boolean; posOrderId?: string; message?: string }> {
    if (!this.config.posApiUrl || !this.config.posApiKey) {
      console.warn('POS API configuration missing. Set POS_API_URL and POS_API_KEY environment variables.');
      return { success: false, message: 'POS API not configured' };
    }

    try {
      const response = await fetch(`${this.config.posApiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.posApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: {
            name: orderData.customerName,
            email: orderData.customerEmail,
            phone: orderData.customerPhone
          },
          items: orderData.items,
          total_amount: orderData.totalAmount,
          order_date: orderData.orderDate,
          special_instructions: orderData.specialInstructions,
          source: 'website'
        }),
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      if (!response.ok) {
        throw new Error(`POS API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        posOrderId: result.id || result.order_id,
        message: result.message || 'Order successfully pushed to POS'
      };
    } catch (error) {
      console.error('Error pushing order to POS:', error);
      return {
        success: false,
        message: `Failed to push order to POS: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Test Kanban API connection
   */
  async testKanbanConnection(): Promise<{ connected: boolean; message: string }> {
    if (!this.config.kanbanApiUrl || !this.config.kanbanApiKey) {
      return { connected: false, message: 'Kanban API not configured' };
    }

    try {
      const response = await fetch(`${this.config.kanbanApiUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.kanbanApiKey}`
        },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        return { connected: true, message: 'Kanban API connection successful' };
      } else {
        return { connected: false, message: `Kanban API returned ${response.status}` };
      }
    } catch (error) {
      return { 
        connected: false, 
        message: `Kanban API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Test POS API connection
   */
  async testPOSConnection(): Promise<{ connected: boolean; message: string }> {
    if (!this.config.posApiUrl || !this.config.posApiKey) {
      return { connected: false, message: 'POS API not configured' };
    }

    try {
      const response = await fetch(`${this.config.posApiUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.posApiKey}`
        },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        return { connected: true, message: 'POS API connection successful' };
      } else {
        return { connected: false, message: `POS API returned ${response.status}` };
      }
    } catch (error) {
      return { 
        connected: false, 
        message: `POS API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Get configuration status
   */
  getConfigurationStatus() {
    return {
      kanban: {
        configured: !!(this.config.kanbanApiUrl && this.config.kanbanApiKey),
        url: this.config.kanbanApiUrl ? '***configured***' : 'not set',
        apiKey: this.config.kanbanApiKey ? '***configured***' : 'not set'
      },
      pos: {
        configured: !!(this.config.posApiUrl && this.config.posApiKey),
        url: this.config.posApiUrl ? '***configured***' : 'not set',
        apiKey: this.config.posApiKey ? '***configured***' : 'not set'
      }
    };
  }

  /**
   * Update configuration
   */
  updateConfiguration(newConfig: Partial<ExternalAPIConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const externalAPIService = new ExternalAPIService();

// Export for testing or alternative configurations
export { ExternalAPIService };