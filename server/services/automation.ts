import type { Express } from "express";
import fetch from "node-fetch";

interface AutoProcessingConfig {
  // How often to run the auto-processing job (in minutes)
  intervalMinutes: number;
  
  // Maximum number of orders to process in a single batch
  batchSize: number;
  
  // Whether to automatically send notifications for processed orders
  sendNotifications: boolean;
  
  // Webhook URL to call after processing (if any)
  webhookUrl?: string;
}

// Default configuration
const DEFAULT_CONFIG: AutoProcessingConfig = {
  intervalMinutes: 30,
  batchSize: 20,
  sendNotifications: true
};

// Store active timers for cleanup
let activeTimers: NodeJS.Timeout[] = [];

/**
 * Start the automated order processing cron job
 * @param app Express application instance
 * @param config Optional configuration overrides
 */
export function startAutoProcessingCron(
  app: Express, 
  config: Partial<AutoProcessingConfig> = {}
): void {
  // Merge default config with any overrides
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Log startup
  console.log(`Starting automated order processing cron job (runs every ${mergedConfig.intervalMinutes} minutes)`);
  
  // Define the processing function
  const processOrders = async () => {
    try {
      console.log(`[Auto-Processing] Running automated order processing job at ${new Date().toISOString()}`);
      
      // Call the auto-process endpoint
      const response = await fetch(`http://localhost:${process.env.PORT || 3000}/api/orders/auto-process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add internal authentication header to bypass auth checks
          'X-Internal-Auth': 'automation-system'
        },
        body: JSON.stringify({ 
          batchSize: mergedConfig.batchSize 
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`[Auto-Processing] Processed ${result.processed} orders successfully`);
        
        // Call webhook if configured
        if (mergedConfig.webhookUrl && result.processed > 0) {
          try {
            await fetch(mergedConfig.webhookUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                event: 'orders.processed',
                data: result
              })
            });
            console.log(`[Auto-Processing] Webhook notification sent successfully`);
          } catch (error) {
            console.error(`[Auto-Processing] Failed to send webhook notification: ${error}`);
          }
        }
      } else {
        console.error(`[Auto-Processing] Failed to process orders: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`[Auto-Processing] Error in automated order processing: ${error}`);
    }
  };
  
  // Run immediately on startup if needed
  // processOrders();
  
  // Schedule regular processing
  const intervalMs = mergedConfig.intervalMinutes * 60 * 1000;
  const timer = setInterval(processOrders, intervalMs);
  
  // Save the timer for potential cleanup
  activeTimers.push(timer);
  
  // Add cleanup handler for application shutdown
  process.on('SIGINT', stopAutoProcessingCron);
  process.on('SIGTERM', stopAutoProcessingCron);
}

/**
 * Stop all automated processing jobs
 */
export function stopAutoProcessingCron(): void {
  console.log(`Stopping ${activeTimers.length} automated processing jobs`);
  
  activeTimers.forEach(timer => {
    clearInterval(timer);
  });
  
  activeTimers = [];
}

/**
 * Check low stock items and generate reorder alerts
 */
export async function checkInventoryLevels(app: Express): Promise<void> {
  try {
    console.log(`[Inventory Check] Running automated inventory check at ${new Date().toISOString()}`);
    
    // Call inventory check endpoint (this would use the /api/products/low-stock endpoint)
    const response = await fetch(`http://localhost:${process.env.PORT || 3000}/api/products/low-stock`, {
      method: 'GET',
      headers: {
        'X-Internal-Auth': 'automation-system'
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      
      if (result.items && result.items.length > 0) {
        console.log(`[Inventory Check] Found ${result.items.length} items with low stock`);
        
        // Generate reorder notifications or alerts
        // This would typically call a notification system or send emails to staff
      } else {
        console.log(`[Inventory Check] No low stock items found`);
      }
    }
  } catch (error) {
    console.error(`[Inventory Check] Error checking inventory levels: ${error}`);
  }
}

/**
 * Automated reminder system for upcoming orders and appointments
 */
export async function sendReminders(app: Express): Promise<void> {
  try {
    console.log(`[Reminders] Sending automated reminders at ${new Date().toISOString()}`);
    
    // Call reminder endpoints (would be implemented as needed)
    const orderRemindersResponse = await fetch(`http://localhost:${process.env.PORT || 3000}/api/reminders/orders`, {
      method: 'POST',
      headers: {
        'X-Internal-Auth': 'automation-system'
      }
    });
    
    const appointmentRemindersResponse = await fetch(`http://localhost:${process.env.PORT || 3000}/api/reminders/appointments`, {
      method: 'POST',
      headers: {
        'X-Internal-Auth': 'automation-system'
      }
    });
    
    if (orderRemindersResponse.ok) {
      const orderResult = await orderRemindersResponse.json();
      console.log(`[Reminders] Sent ${orderResult.sent} order reminders`);
    }
    
    if (appointmentRemindersResponse.ok) {
      const appointmentResult = await appointmentRemindersResponse.json();
      console.log(`[Reminders] Sent ${appointmentResult.sent} appointment reminders`);
    }
  } catch (error) {
    console.error(`[Reminders] Error sending reminders: ${error}`);
  }
}