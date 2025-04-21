import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { storage } from '../storage';
import type { Order } from '@shared/schema';

// Email configuration
let transporter: nodemailer.Transporter;

// Twilio configuration
let twilioClient: twilio.Twilio;

// Define extended order type with strong typing for items
export interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  options?: {
    frameId?: number;
    matId?: number;
    glassId?: number;
    width?: number;
    height?: number;
    frameColor?: string;
    matColor?: string;
    customText?: string;
  };
}

export interface ExtendedOrder extends Order {
  items: OrderItem[];
}

// Initialize email transporter
export async function initEmailTransporter(): Promise<void> {
  if (transporter) {
    console.log("Email transporter already initialized");
    return;
  }

  try {
    // Check if we have actual SendGrid credentials
    if (process.env.SENDGRID_API_KEY) {
      // Use SendGrid transport
      transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      });
      
      console.log("Email transporter initialized with SendGrid");
    } else {
      // Create a test account at ethereal.email for development
      const testAccount = await nodemailer.createTestAccount();
  
      // Create reusable transporter with ethereal.email
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      
      console.log("Email transporter initialized");
      console.log("Using test account. Emails can be viewed at https://ethereal.email");
    }
  } catch (error) {
    console.error("Failed to initialize email transporter:", error);
    throw error;
  }
}

// Initialize Twilio client
export async function initTwilioClient(): Promise<void> {
  if (twilioClient) {
    console.log("Twilio client already initialized");
    return;
  }

  try {
    // Check if we have actual Twilio credentials
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      
      console.log("Twilio client initialized for SMS messaging");
    } else {
      // Create a mock Twilio client for development
      twilioClient = {
        messages: {
          create: async (params: any) => {
            console.log("MOCK SMS:", params);
            return {
              sid: 'mock-sid-' + Date.now(),
              status: 'sent',
              dateCreated: new Date()
            };
          }
        }
      } as any;
      
      console.log("Twilio client initialized for SMS messaging");
      console.log("Using mock client. SMS messages will be logged to console.");
    }
  } catch (error) {
    console.error("Failed to initialize Twilio client:", error);
    throw error;
  }
}

// Send notification to store owner about new order
export async function sendNewOrderNotification(order: ExtendedOrder): Promise<boolean> {
  try {
    // Format items table
    const itemsTable = order.items
      .map(item => {
        const frameInfo = item.options?.frameId 
          ? `\nFrame: ID ${item.options.frameId} (${item.options.frameColor || 'N/A'})` 
          : '';
        const matInfo = item.options?.matId 
          ? `\nMat: ID ${item.options.matId} (${item.options.matColor || 'N/A'})` 
          : '';
        const sizeInfo = (item.options?.width && item.options?.height) 
          ? `\nSize: ${item.options.width}″ × ${item.options.height}″` 
          : '';
        
        return `- ${item.quantity}x ${item.name} ($${item.unitPrice.toFixed(2)} each)${frameInfo}${matInfo}${sizeInfo}`;
      })
      .join('\n\n');
    
    // Send email to store owner
    const mailOptions = {
      from: '"Jay\'s Frames Order System" <orders@jaysframes.com>',
      to: process.env.ADMIN_EMAIL || 'admin@jaysframes.com',
      subject: `New Order #${order.id} - $${order.totalAmount?.toFixed(2) || '0.00'}`,
      text: `
New order received!

Order #${order.id}
Date: ${new Date(order.createdAt || new Date()).toLocaleString()}
Customer: ${order.customerName}
Email: ${order.customerEmail}
Phone: ${order.customerPhone}
Total: $${order.totalAmount?.toFixed(2) || '0.00'}

Items:
${itemsTable}

Notes: ${order.customerNotes || 'None'}

Click here to process this order: https://${process.env.DOMAIN || 'jaysframes.example.com'}/admin/orders/${order.id}
      `,
      html: `
<h1>New Order Received!</h1>
<p><strong>Order #${order.id}</strong></p>
<p><strong>Date:</strong> ${new Date(order.createdAt || new Date()).toLocaleString()}</p>
<p><strong>Customer:</strong> ${order.customerName}</p>
<p><strong>Email:</strong> ${order.customerEmail}</p>
<p><strong>Phone:</strong> ${order.customerPhone}</p>
<p><strong>Total:</strong> $${order.totalAmount?.toFixed(2) || '0.00'}</p>

<h2>Items:</h2>
<ul>
  ${order.items.map(item => {
    const frameInfo = item.options?.frameId 
      ? `<br>Frame: ID ${item.options.frameId} (${item.options.frameColor || 'N/A'})` 
      : '';
    const matInfo = item.options?.matId 
      ? `<br>Mat: ID ${item.options.matId} (${item.options.matColor || 'N/A'})` 
      : '';
    const sizeInfo = (item.options?.width && item.options?.height) 
      ? `<br>Size: ${item.options.width}″ × ${item.options.height}″` 
      : '';
    
    return `<li><strong>${item.quantity}x ${item.name}</strong> ($${item.unitPrice.toFixed(2)} each)${frameInfo}${matInfo}${sizeInfo}</li>`;
  }).join('')}
</ul>

<p><strong>Notes:</strong> ${order.customerNotes || 'None'}</p>

<p>
  <a href="https://${process.env.DOMAIN || 'jaysframes.example.com'}/admin/orders/${order.id}" 
     style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">
    Process This Order
  </a>
</p>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`New order notification email sent: ${info.messageId}`);
    
    // If using Ethereal, provide link to view the email
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    // If phone notifications are enabled and Twilio is set up, send SMS
    if (process.env.ADMIN_PHONE) {
      await sendSmsNotification(
        process.env.ADMIN_PHONE,
        `New Order #${order.id} received from ${order.customerName} - $${order.totalAmount?.toFixed(2) || '0.00'}. Log in to process.`
      );
    }
    
    return true;
  } catch (error) {
    console.error('Failed to send new order notification:', error);
    return false;
  }
}

// Send order confirmation email to customer
export async function sendOrderConfirmationEmail(orderId: number, customerEmail: string): Promise<boolean> {
  try {
    // Fetch the full order details
    const order = await storage.getOrderById(orderId);
    if (!order) {
      throw new Error(`Order #${orderId} not found`);
    }
    
    // Format items into a table
    const items = Array.isArray(order.items) ? order.items : [];
    const itemsTable = items
      .map((item: any) => {
        const frameInfo = item.options?.frameId 
          ? `\nFrame: ${item.options.frameColor || 'Custom'}` 
          : '';
        const matInfo = item.options?.matId 
          ? `\nMat: ${item.options.matColor || 'Custom'}` 
          : '';
        const sizeInfo = (item.options?.width && item.options?.height) 
          ? `\nSize: ${item.options.width}″ × ${item.options.height}″` 
          : '';
        
        return `- ${item.quantity}x ${item.name} ($${item.unitPrice?.toFixed(2) || '0.00'} each)${frameInfo}${matInfo}${sizeInfo}`;
      })
      .join('\n\n');
    
    // Send email to customer
    const mailOptions = {
      from: '"Jay\'s Frames" <orders@jaysframes.com>',
      to: customerEmail,
      subject: `Order Confirmation - Jay's Frames #${orderId}`,
      text: `
Thank you for your order with Jay's Frames!

Order #${orderId}
Date: ${new Date(order.createdAt || new Date()).toLocaleString()}
Status: ${order.status || 'Received'}
Total: $${order.totalAmount?.toFixed(2) || '0.00'}

Items:
${itemsTable}

We've received your order and are working on it. You'll receive updates as your order progresses.

Track your order here: https://${process.env.DOMAIN || 'jaysframes.example.com'}/order-status?orderId=${orderId}

If you have any questions about your order, please reply to this email or call us at (555) 123-4567.

Thank you for choosing Jay's Frames for your custom framing needs!

Jay's Frames Team
123 Frame Street
Frameville, ST 12345
(555) 123-4567
info@jaysframes.com
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #4a6741; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0;">Thank You for Your Order!</h1>
  </div>
  
  <div style="padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
    <p>Dear ${order.customerName},</p>
    
    <p>We've received your order and are working on it. You'll receive updates as your order progresses.</p>
    
    <div style="background-color: white; border: 1px solid #ddd; padding: 15px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #4a6741;">Order Summary</h2>
      <p><strong>Order #${orderId}</strong></p>
      <p><strong>Date:</strong> ${new Date(order.createdAt || new Date()).toLocaleString()}</p>
      <p><strong>Status:</strong> ${order.status || 'Received'}</p>
      <p><strong>Total:</strong> $${order.totalAmount?.toFixed(2) || '0.00'}</p>
      
      <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 10px;">Items</h3>
      <ul style="list-style-type: none; padding-left: 0;">
        ${items.map((item: any) => {
          const frameInfo = item.options?.frameId 
            ? `<br><em>Frame:</em> ${item.options.frameColor || 'Custom'}` 
            : '';
          const matInfo = item.options?.matId 
            ? `<br><em>Mat:</em> ${item.options.matColor || 'Custom'}` 
            : '';
          const sizeInfo = (item.options?.width && item.options?.height) 
            ? `<br><em>Size:</em> ${item.options.width}″ × ${item.options.height}″` 
            : '';
          
          return `<li style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dotted #eee;">
                    <strong>${item.quantity}x ${item.name}</strong> ($${item.unitPrice?.toFixed(2) || '0.00'} each)
                    ${frameInfo}${matInfo}${sizeInfo}
                  </li>`;
        }).join('')}
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://${process.env.DOMAIN || 'jaysframes.example.com'}/order-status?orderId=${orderId}" 
         style="display: inline-block; background-color: #4a6741; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">
        Track Your Order
      </a>
    </div>
    
    <p>If you have any questions about your order, please reply to this email or call us at (555) 123-4567.</p>
    
    <p>Thank you for choosing Jay's Frames for your custom framing needs!</p>
    
    <p style="margin-top: 30px;">
      <strong>Jay's Frames Team</strong><br>
      123 Frame Street<br>
      Frameville, ST 12345<br>
      (555) 123-4567<br>
      info@jaysframes.com
    </p>
  </div>
  
  <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    <p>© ${new Date().getFullYear()} Jay's Frames. All rights reserved.</p>
  </div>
</div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent: ${info.messageId}`);
    
    // If using Ethereal, provide link to view the email
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return false;
  }
}

// Send SMS notification
export async function sendSmsNotification(phone: string, message: string): Promise<boolean> {
  try {
    // Ensure we have a valid phone number format
    const formattedPhone = phone.startsWith('+') ? phone : `+1${phone.replace(/\D/g, '')}`;
    
    // Send SMS via Twilio
    const twilioMessage = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER || '+15551234567',
      to: formattedPhone
    });
    
    console.log(`SMS notification sent: ${twilioMessage.sid}`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS notification:', error);
    return false;
  }
}

// Send order status update notification
export async function sendOrderStatusUpdateEmail(
  orderId: number, 
  status: string, 
  stage: string,
  customerEmail: string
): Promise<boolean> {
  try {
    // Get user-friendly status message based on the stage
    let statusMessage = "Your order status has been updated.";
    
    switch (stage) {
      case "preparing":
        statusMessage = "Your order is now being prepared.";
        break;
      case "in_production":
        statusMessage = "Your order is now in production. Our framing experts are crafting your piece with care.";
        break;
      case "ready_for_pickup":
        statusMessage = "Great news! Your order is ready for pickup at our store. We're open Monday-Saturday, 10am-6pm.";
        break;
      case "shipped":
        statusMessage = "Your order has been shipped! You should receive a tracking number shortly.";
        break;
      case "delivered":
        statusMessage = "Your order has been delivered! We hope you love your custom framed piece.";
        break;
      case "delayed":
        statusMessage = "There's been a slight delay with your order. We apologize for the inconvenience and are working to resolve this as quickly as possible.";
        break;
      default:
        statusMessage = `Your order is now in the ${stage} stage.`;
    }
    
    // Send email to customer
    const mailOptions = {
      from: '"Jay\'s Frames" <orders@jaysframes.com>',
      to: customerEmail,
      subject: `Order #${orderId} Update - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      text: `
Order Status Update

Order #${orderId}
New Status: ${status.charAt(0).toUpperCase() + status.slice(1)}

${statusMessage}

Track your order here: https://${process.env.DOMAIN || 'jaysframes.example.com'}/order-status?orderId=${orderId}

If you have any questions, please reply to this email or call us at (555) 123-4567.

Thank you for choosing Jay's Frames!

Jay's Frames Team
123 Frame Street
Frameville, ST 12345
(555) 123-4567
info@jaysframes.com
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #4a6741; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0;">Order Status Update</h1>
  </div>
  
  <div style="padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
    <h2 style="color: #4a6741;">Order #${orderId}</h2>
    <p><strong>New Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
    
    <div style="background-color: white; border: 1px solid #ddd; padding: 15px; margin: 20px 0;">
      <p>${statusMessage}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://${process.env.DOMAIN || 'jaysframes.example.com'}/order-status?orderId=${orderId}" 
         style="display: inline-block; background-color: #4a6741; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">
        Track Your Order
      </a>
    </div>
    
    <p>If you have any questions, please reply to this email or call us at (555) 123-4567.</p>
    
    <p>Thank you for choosing Jay's Frames!</p>
    
    <p style="margin-top: 30px;">
      <strong>Jay's Frames Team</strong><br>
      123 Frame Street<br>
      Frameville, ST 12345<br>
      (555) 123-4567<br>
      info@jaysframes.com
    </p>
  </div>
  
  <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    <p>© ${new Date().getFullYear()} Jay's Frames. All rights reserved.</p>
  </div>
</div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent: ${info.messageId}`);
    
    // If using Ethereal, provide link to view the email
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    // If stage is ready_for_pickup, shipped, or delivered, also send SMS if we have a phone number
    const order = await storage.getOrderById(orderId);
    
    if (order && order.customerPhone && ['ready_for_pickup', 'shipped', 'delivered'].includes(stage)) {
      await sendSmsNotification(
        order.customerPhone,
        `Jay's Frames: ${statusMessage} Order #${orderId}. See details at https://${process.env.DOMAIN || 'jaysframes.example.com'}/order-status?orderId=${orderId}`
      );
    }
    
    return true;
  } catch (error) {
    console.error('Failed to send order status update email:', error);
    return false;
  }
}

// Send appointment reminder 
export async function sendAppointmentReminder(
  appointmentId: number, 
  customerEmail: string,
  customerPhone?: string
): Promise<boolean> {
  try {
    // Fetch appointment details
    const appointment = await storage.getAppointmentById(appointmentId);
    if (!appointment) {
      throw new Error(`Appointment #${appointmentId} not found`);
    }
    
    // Format date and time for display
    const appointmentDate = new Date(appointment.startTime);
    const dateFormatted = appointmentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const timeFormatted = appointmentDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
    
    // Send email reminder
    const mailOptions = {
      from: '"Jay\'s Frames" <appointments@jaysframes.com>',
      to: customerEmail,
      subject: `Appointment Reminder - Jay's Frames`,
      text: `
Appointment Reminder

Hello ${appointment.customerName},

This is a reminder that you have an appointment at Jay's Frames tomorrow:

Date: ${dateFormatted}
Time: ${timeFormatted}
Type: ${appointment.type || 'Consultation'}

Location:
Jay's Frames
123 Frame Street
Frameville, ST 12345

If you need to reschedule, please call us at (555) 123-4567 or reply to this email.

We look forward to seeing you!

Jay's Frames Team
(555) 123-4567
info@jaysframes.com
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #4a6741; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0;">Appointment Reminder</h1>
  </div>
  
  <div style="padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
    <p>Hello ${appointment.customerName},</p>
    
    <p>This is a reminder that you have an appointment at Jay's Frames tomorrow:</p>
    
    <div style="background-color: white; border: 1px solid #ddd; padding: 15px; margin: 20px 0; text-align: center;">
      <h2 style="margin-top: 0; color: #4a6741;">${appointment.type || 'Consultation'}</h2>
      <p style="font-size: 18px;"><strong>${dateFormatted}</strong></p>
      <p style="font-size: 18px;"><strong>${timeFormatted}</strong></p>
    </div>
    
    <div style="background-color: #f5f5f5; padding: 15px; margin-bottom: 20px;">
      <h3 style="margin-top: 0;">Location</h3>
      <p style="margin-bottom: 0;">
        <strong>Jay's Frames</strong><br>
        123 Frame Street<br>
        Frameville, ST 12345
      </p>
    </div>
    
    <p>If you need to reschedule, please call us at (555) 123-4567 or reply to this email.</p>
    
    <p>We look forward to seeing you!</p>
    
    <p style="margin-top: 30px;">
      <strong>Jay's Frames Team</strong><br>
      (555) 123-4567<br>
      info@jaysframes.com
    </p>
  </div>
  
  <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    <p>© ${new Date().getFullYear()} Jay's Frames. All rights reserved.</p>
  </div>
</div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Appointment reminder email sent: ${info.messageId}`);
    
    // If using Ethereal, provide link to view the email
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    // Send SMS reminder if phone number is available
    if (customerPhone) {
      await sendSmsNotification(
        customerPhone,
        `Reminder: You have an appointment at Jay's Frames tomorrow, ${dateFormatted} at ${timeFormatted}. Need to reschedule? Call (555) 123-4567.`
      );
    }
    
    // Mark the reminder as sent in the database
    await storage.markAppointmentReminderSent(appointmentId);
    
    return true;
  } catch (error) {
    console.error('Failed to send appointment reminder:', error);
    return false;
  }
}

// Send low stock notification to admin
export async function sendLowStockNotification(lowStockItems: any[]): Promise<boolean> {
  try {
    if (!lowStockItems.length) {
      return false;
    }
    
    // Format items into a list
    const itemsList = lowStockItems
      .map(item => `- ${item.name}: ${item.stockQuantity} remaining (reorder at ${item.reorderThreshold})`)
      .join('\n');
    
    // Send email notification
    const mailOptions = {
      from: '"Jay\'s Frames Inventory System" <inventory@jaysframes.com>',
      to: process.env.ADMIN_EMAIL || 'admin@jaysframes.com',
      subject: `Low Stock Alert - ${lowStockItems.length} Items Need Attention`,
      text: `
Low Stock Alert

The following items are low in stock and may need to be reordered:

${itemsList}

Click here to manage inventory: https://${process.env.DOMAIN || 'jaysframes.example.com'}/admin/inventory

Jay's Frames Inventory System
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #e74c3c; color: white; padding: 20px; text-align: center;">
    <h1 style="margin: 0;">Low Stock Alert</h1>
  </div>
  
  <div style="padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
    <p>The following items are low in stock and may need to be reordered:</p>
    
    <div style="background-color: white; border: 1px solid #ddd; padding: 15px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
            <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Current Stock</th>
            <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Reorder Threshold</th>
          </tr>
        </thead>
        <tbody>
          ${lowStockItems.map(item => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
              <td style="padding: 10px; text-align: center; border-bottom: 1px solid #eee; color: ${item.stockQuantity === 0 ? '#e74c3c' : '#f39c12'};">
                <strong>${item.stockQuantity}</strong>
              </td>
              <td style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">
                ${item.reorderThreshold}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://${process.env.DOMAIN || 'jaysframes.example.com'}/admin/inventory" 
         style="display: inline-block; background-color: #4a6741; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">
        Manage Inventory
      </a>
    </div>
  </div>
  
  <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    <p>© ${new Date().getFullYear()} Jay's Frames Inventory System</p>
  </div>
</div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Low stock notification email sent: ${info.messageId}`);
    
    // If using Ethereal, provide link to view the email
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to send low stock notification:', error);
    return false;
  }
}