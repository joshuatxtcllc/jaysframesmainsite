import { storage } from '../storage';
import { sendNotification, NotificationType } from './notification';
import { CronJob } from 'cron';

// Configuration state for automation
let automationConfig = {
  enabled: true,
  intervalMinutes: 30,
  batchSize: 20,
  lastRun: null as Date | null,
  processedCount: 0,
  successCount: 0,
  errorCount: 0,
  nextRunTime: null as Date | null,
};

/**
 * Process orders automatically based on their status and requirements
 * @param batchSize Maximum number of orders to process in a single run
 * @returns Processing statistics
 */
export async function processOrders(batchSize: number = 20) {
  console.log(`Starting automatic order processing (batch size: ${batchSize})...`);
  
  try {
    // Get pending orders up to the batch size
    const pendingOrders = await storage.getOrdersByStatus("pending");
    const ordersToProcess = pendingOrders.slice(0, batchSize);
    
    console.log(`Found ${pendingOrders.length} pending orders, processing ${ordersToProcess.length}...`);
    
    let processed = 0;
    let succeeded = 0;
    let failed = 0;
    
    // Process each order
    for (const order of ordersToProcess) {
      try {
        processed++;
        
        // Get items for inventory check
        const items = Array.isArray(order.items) ? order.items : [];
        
        // Check inventory for each item
        let inventoryAvailable = true;
        
        for (const item of items) {
          // Skip if this is a non-product item or doesn't have a product ID
          if (!item.productId) continue;
          
          // Check product inventory
          const product = await storage.getProductById(item.productId);
          if (product && product.stockQuantity !== undefined && product.stockQuantity !== null) {
            // If product exists and stock is below the ordered quantity
            if (product.stockQuantity < item.quantity) {
              inventoryAvailable = false;
              break;
            }
          }
        }
        
        // Update order status based on inventory availability
        if (inventoryAvailable) {
          await storage.updateOrderStatus(
            order.id, 
            "in_progress", 
            "materials_verified"
          );
          
          // Decrement inventory
          for (const item of items) {
            if (!item.productId) continue;
            
            const product = await storage.getProductById(item.productId);
            if (product && product.stockQuantity !== undefined && product.stockQuantity !== null) {
              await storage.updateProductStock(
                item.productId,
                Math.max(0, product.stockQuantity - item.quantity)
              );
            }
          }
          
          // Send notifications
          if (order.customerEmail) {
            await sendNotification({
              title: `Order #${order.id} Update`,
              description: "Your order has been verified and is now being processed.",
              source: 'auto-processor',
              sourceId: order.id.toString(),
              type: "success",
              actionable: true,
              link: `/order-status?orderId=${order.id}`,
              recipient: order.customerEmail
            });
          }
          
          succeeded++;
        } else {
          // Mark as delayed due to inventory issues
          await storage.updateOrderStatus(
            order.id, 
            "in_progress", 
            "delayed_inventory"
          );
          
          // Send inventory issue notification
          if (order.customerEmail) {
            await sendNotification({
              title: `Order #${order.id} Update`,
              description: "There's a slight delay with your order due to inventory verification. We'll contact you shortly.",
              source: 'auto-processor',
              sourceId: order.id.toString(),
              type: "warning",
              actionable: true,
              link: `/order-status?orderId=${order.id}`,
              recipient: order.customerEmail
            });
          }
          
          // Also send alert to admin (would be a specific email in production)
          await sendNotification({
            title: `Inventory Alert: Order #${order.id}`,
            description: "Order has inventory issues and requires attention.",
            source: 'system',
            sourceId: order.id.toString(),
            type: "error",
            actionable: true,
            link: `/admin/dashboard`,
            recipient: "admin@jaysframes.com" // This would be the admin email in a real system
          });
          
          failed++;
        }
      } catch (error) {
        console.error(`Error processing order ${order.id}:`, error);
        failed++;
      }
    }
    
    // Update automation stats
    automationConfig.lastRun = new Date();
    automationConfig.processedCount += processed;
    automationConfig.successCount += succeeded;
    automationConfig.errorCount += failed;
    
    // Calculate next run time
    const nextRun = new Date();
    nextRun.setMinutes(nextRun.getMinutes() + automationConfig.intervalMinutes);
    automationConfig.nextRunTime = nextRun;
    
    console.log(`Auto-processing complete. Processed: ${processed}, Succeeded: ${succeeded}, Failed: ${failed}`);
    
    // Return processing results
    return {
      processed,
      succeeded,
      failed,
      totalPending: pendingOrders.length - processed
    };
  } catch (error) {
    console.error("Error in auto-processing:", error);
    throw error;
  }
}

/**
 * Get the current automation system status and configuration
 */
export function getAutomationStatus() {
  return automationConfig;
}

/**
 * Update automation system settings
 * @param settings New settings to apply
 */
export function updateAutomationSettings(settings: {
  enabled?: boolean;
  intervalMinutes?: number;
  batchSize?: number;
}) {
  // Update configuration with new settings
  if (settings.enabled !== undefined) {
    automationConfig.enabled = settings.enabled;
  }
  
  if (settings.intervalMinutes !== undefined) {
    automationConfig.intervalMinutes = settings.intervalMinutes;
  }
  
  if (settings.batchSize !== undefined) {
    automationConfig.batchSize = settings.batchSize;
  }
  
  // Calculate next run time based on the new interval
  const nextRun = new Date();
  nextRun.setMinutes(nextRun.getMinutes() + automationConfig.intervalMinutes);
  automationConfig.nextRunTime = nextRun;
  
  return {
    ...automationConfig,
    settings: {
      enabled: automationConfig.enabled,
      intervalMinutes: automationConfig.intervalMinutes,
      batchSize: automationConfig.batchSize
    },
    message: "Automation settings updated"
  };
}

// Initialize a cron job for automated order processing
let automationCronJob: CronJob | null = null;

/**
 * Start the automation system
 */
export function startAutomationSystem() {
  if (automationCronJob) {
    // Stop existing job if it's running
    automationCronJob.stop();
  }
  
  // Create a cron job that runs based on the configured interval
  // Default is every 30 minutes (*/30 * * * *)
  const cronTime = `*/${automationConfig.intervalMinutes} * * * *`;
  
  console.log(`Starting automated order processing cron job (runs every ${automationConfig.intervalMinutes} minutes)`);
  
  automationCronJob = new CronJob(
    cronTime,
    async function() {
      // Only run if automation is enabled
      if (automationConfig.enabled) {
        try {
          await processOrders(automationConfig.batchSize);
        } catch (error) {
          console.error("Error in automated order processing:", error);
        }
      } else {
        console.log("Automated order processing is currently disabled");
      }
    },
    null, // onComplete
    true, // start
    'UTC' // timezone
  );
  
  // Calculate initial next run time
  const nextRun = new Date();
  nextRun.setMinutes(nextRun.getMinutes() + automationConfig.intervalMinutes);
  automationConfig.nextRunTime = nextRun;
  
  return true;
}

/**
 * Stop the automation system
 */
export function stopAutomationSystem() {
  if (automationCronJob) {
    automationCronJob.stop();
    automationCronJob = null;
    console.log("Automated order processing system stopped");
    return true;
  }
  return false;
}