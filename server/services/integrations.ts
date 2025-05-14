
import { storage } from "../storage";
import { NotificationType } from "./notification";

/**
 * Integration types for external applications
 */
export type IntegrationType = 'notification' | 'data_sync' | 'webhook';

/**
 * Integration status
 */
export type IntegrationStatus = 'active' | 'inactive' | 'pending';

/**
 * Integration connection details
 */
export interface IntegrationConnection {
  id: string;
  name: string;
  appId: string;
  type: IntegrationType;
  status: IntegrationStatus;
  apiKey: string;
  endpoint?: string;
  webhookUrl?: string;
  eventTypes?: string[];
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Integration service for connecting with external applications
 */
export class IntegrationService {
  /**
   * Register a new application integration
   */
  async registerIntegration(
    name: string,
    appId: string,
    type: IntegrationType,
    apiKey: string,
    options: {
      endpoint?: string;
      webhookUrl?: string;
      eventTypes?: string[];
    } = {}
  ): Promise<IntegrationConnection> {
    // In a real implementation, this would save to the database
    // For now, we'll return a mock integration
    
    const integration: IntegrationConnection = {
      id: `int_${Date.now()}`,
      name,
      appId,
      type,
      status: 'active',
      apiKey,
      endpoint: options.endpoint,
      webhookUrl: options.webhookUrl,
      eventTypes: options.eventTypes,
      lastSync: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log(`Registered new integration: ${name} (${appId})`);
    return integration;
  }
  
  /**
   * Send data to all registered integrations
   */
  async broadcastEvent(
    eventType: string,
    data: any,
    sourceAppId?: string
  ): Promise<void> {
    // In a real implementation, this would fetch integrations from the database
    // and send the event to all registered integrations
    console.log(`Broadcasting event: ${eventType} to all integrations`);
  }
  
  /**
   * Get data for synchronization with external applications
   */
  async getSyncData(
    resource: string,
    since?: Date,
    limit?: number
  ): Promise<any[]> {
    // Get data based on the resource type
    switch (resource) {
      case 'products':
        return await storage.getProducts();
      case 'orders':
        return await storage.getOrders();
      case 'frame-options':
        return await storage.getFrameOptions();
      case 'mat-options':
        return await storage.getMatOptions();
      case 'glass-options':
        return await storage.getGlassOptions();
      default:
        throw new Error(`Unknown resource type: ${resource}`);
    }
  }
}

// Create and export the integration service
export const integrationService = new IntegrationService();
