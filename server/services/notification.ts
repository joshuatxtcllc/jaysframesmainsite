import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import { Order } from '@shared/schema';
import { storage } from '../storage';
import { Readable } from 'stream';
import twilio from 'twilio';

// Email configuration
// Note: In production, use environment variables for these sensitive values
let transporter: nodemailer.Transporter | null = null;

// Twilio configuration for SMS messaging
let twilioClient: twilio.Twilio | null = null;

/**
 * Initialize the Twilio client for sending SMS messages
 */
export async function initTwilioClient() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (!accountSid || !authToken) {
      console.log('Twilio credentials not found. SMS functionality will be disabled.');
      return;
    }
    
    twilioClient = twilio(accountSid, authToken);
    console.log('Twilio client initialized for SMS messaging');
  } catch (error) {
    console.error('Failed to initialize Twilio client:', error);
  }
}

export async function initEmailTransporter() {
  try {
    // Create a test account if no email credentials are provided
    // This will use Ethereal for testing (development only)
    // In production, real email credentials should be used
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || testAccount.user,
        pass: process.env.EMAIL_PASS || testAccount.pass,
      },
    });
    
    console.log('Email transporter initialized');
    if (testAccount.user) {
      console.log('Using test account. Emails can be viewed at https://ethereal.email');
    }
  } catch (error) {
    console.error('Failed to initialize email transporter:', error);
  }
}

/**
 * Sends an order confirmation email to the customer
 */
export async function sendOrderConfirmationEmail(orderId: number, customerEmail: string): Promise<boolean> {
  try {
    // Get the order details
    const order = await storage.getOrderById(orderId);
    if (!order) {
      throw new Error(`Order #${orderId} not found`);
    }
    
    // Cast order to ExtendedOrder for type safety
    const extendedOrder: ExtendedOrder = {
      ...order,
      items: Array.isArray(order.items) ? order.items as OrderItem[] : []
    };
    
    // Generate invoice PDF
    const invoicePdf = await generateInvoicePdf(extendedOrder);
    
    // Build email content
    const emailContent = buildOrderConfirmationEmail(extendedOrder);
    
    if (!transporter) {
      await initEmailTransporter();
    }
    
    if (!transporter) {
      throw new Error('Email transporter not initialized');
    }
    
    // Send the email
    const info = await transporter.sendMail({
      from: `"Jay's Frames" <${process.env.EMAIL_FROM || 'orders@jaysframes.com'}>`,
      to: customerEmail,
      subject: `Order Confirmation #${orderId}`,
      html: emailContent,
      attachments: [
        {
          filename: `invoice-${orderId}.pdf`,
          content: invoicePdf,
          contentType: 'application/pdf',
        },
      ],
    });
    
    console.log(`Order confirmation email sent to ${customerEmail}. Message ID: ${info.messageId}`);
    
    // For test accounts, log the preview URL
    if (info.messageId && nodemailer.getTestMessageUrl(info)) {
      console.log(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to send order confirmation email for order #${orderId}:`, error);
    return false;
  }
}

/**
 * Sends a notification to the business owner about a new order
 */
export interface OrderItem {
  productId: number;
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

// Extending the Order type with proper typing for items
export interface ExtendedOrder extends Order {
  items: OrderItem[];
}

export async function sendNewOrderNotification(order: ExtendedOrder): Promise<boolean> {
  try {
    if (!transporter) {
      await initEmailTransporter();
    }
    
    if (!transporter) {
      throw new Error('Email transporter not initialized');
    }
    
    // Store owner's email
    const storeEmail = process.env.STORE_EMAIL || 'notifications@jaysframes.com';
    
    // Build email content
    const emailContent = `
      <h1>New Order Received! #${order.id}</h1>
      <p>A new order has been placed on Jay's Frames website.</p>
      
      <h2>Order Details:</h2>
      <p><strong>Order ID:</strong> #${order.id}</p>
      <p><strong>Customer:</strong> ${order.customerName}</p>
      <p><strong>Email:</strong> ${order.customerEmail}</p>
      <p><strong>Amount:</strong> $${(order.totalAmount / 100).toFixed(2)}</p>
      <p><strong>Date:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString()}</p>
      
      <h3>Items:</h3>
      <ul>
        ${order.items.map(item => `
          <li>
            ${item.quantity}x ${item.name} - $${(item.price * item.quantity / 100).toFixed(2)}
            ${item.details ? `<br>Details: ${JSON.stringify(item.details)}` : ''}
          </li>
        `).join('')}
      </ul>
      
      <p>Please log in to the admin dashboard to process this order.</p>
    `;
    
    // Send the email
    const info = await transporter.sendMail({
      from: `"Jay's Frames Website" <${process.env.EMAIL_FROM || 'orders@jaysframes.com'}>`,
      to: storeEmail,
      subject: `New Order #${order.id} - $${(order.totalAmount / 100).toFixed(2)}`,
      html: emailContent,
    });
    
    console.log(`New order notification sent to ${storeEmail}. Message ID: ${info.messageId}`);
    
    // For test accounts, log the preview URL
    if (info.messageId && nodemailer.getTestMessageUrl(info)) {
      console.log(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to send new order notification for order #${order.id}:`, error);
    return false;
  }
}

/**
 * Generates a PDF invoice for an order
 */
export async function generateInvoicePdf(order: ExtendedOrder): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a PDF document
      const doc = new PDFDocument({ margin: 50 });
      
      // Collect the PDF data chunks
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      
      // Add business information
      doc.fontSize(20).text("Jay's Frames", { align: 'center' });
      doc.fontSize(10).text('1440 1/2 Yale St. Houston TX 77008', { align: 'center' });
      doc.text('Phone: (832) 893-3794', { align: 'center' });
      doc.text('Email: info@jaysframes.com', { align: 'center' });
      doc.moveDown();
      
      // Add invoice header
      doc.fontSize(16).text('INVOICE', { align: 'center' });
      doc.moveDown();
      
      // Add order information
      doc.fontSize(12).text(`Invoice Number: #${order.id}`);
      doc.text(`Date: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}`);
      doc.text(`Customer: ${order.customerName}`);
      doc.text(`Email: ${order.customerEmail}`);
      doc.moveDown();
      
      // Add table header
      const invoiceTableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Item', 50, invoiceTableTop);
      doc.text('Quantity', 250, invoiceTableTop);
      doc.text('Price', 350, invoiceTableTop);
      doc.text('Total', 450, invoiceTableTop);
      
      // Add table content
      let tableRowY = invoiceTableTop + 20;
      doc.font('Helvetica');
      
      // Calculate subtotal
      let subtotal = 0;
      
      // Add items to the table
      order.items.forEach((item, i) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        doc.text(item.name, 50, tableRowY);
        doc.text(item.quantity.toString(), 250, tableRowY);
        doc.text(`$${(item.price / 100).toFixed(2)}`, 350, tableRowY);
        doc.text(`$${(itemTotal / 100).toFixed(2)}`, 450, tableRowY);
        
        // Add item details if available
        if (item.details) {
          tableRowY += 15;
          let detailsText = '';
          
          if (item.details.width && item.details.height) {
            detailsText += `Size: ${item.details.width}" × ${item.details.height}"`;
          }
          
          if (item.details.frameColor) {
            detailsText += detailsText ? ', ' : '';
            detailsText += `Frame: ${item.details.frameColor}`;
          }
          
          if (item.details.matColor) {
            detailsText += detailsText ? ', ' : '';
            detailsText += `Mat: ${item.details.matColor}`;
          }
          
          if (item.details.glassType) {
            detailsText += detailsText ? ', ' : '';
            detailsText += `Glass: ${item.details.glassType}`;
          }
          
          if (detailsText) {
            doc.fontSize(9).text(detailsText, 70, tableRowY, { width: 300 });
            doc.fontSize(12);
          }
        }
        
        tableRowY += 20;
      });
      
      // Add table footer
      doc.moveDown();
      tableRowY += 20;
      
      // Calculate tax and shipping
      const shipping = order.totalAmount > 10000 ? 0 : 1500;
      const tax = Math.round(subtotal * 0.0825);
      const total = subtotal + shipping + tax;
      
      doc.text('Subtotal:', 350, tableRowY);
      doc.text(`$${(subtotal / 100).toFixed(2)}`, 450, tableRowY);
      tableRowY += 20;
      
      doc.text('Shipping:', 350, tableRowY);
      doc.text(shipping === 0 ? 'Free' : `$${(shipping / 100).toFixed(2)}`, 450, tableRowY);
      tableRowY += 20;
      
      doc.text('Tax (8.25%):', 350, tableRowY);
      doc.text(`$${(tax / 100).toFixed(2)}`, 450, tableRowY);
      tableRowY += 20;
      
      doc.font('Helvetica-Bold');
      doc.text('Total:', 350, tableRowY);
      doc.text(`$${(total / 100).toFixed(2)}`, 450, tableRowY);
      
      // Add footer
      doc.fontSize(10).text('Thank you for your business!', 50, doc.page.height - 100, { align: 'center' });
      
      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Sends an SMS notification
 * @param message The message content
 * @param recipient The phone number to send the SMS to
 * @returns Promise<boolean> Success status
 */
export async function sendSmsNotification(message: string, recipient: string): Promise<boolean> {
  try {
    if (!twilioClient) {
      await initTwilioClient();
    }
    
    if (!twilioClient) {
      console.error('SMS notification could not be sent: Twilio client not initialized');
      return false;
    }
    
    // Validate phone number format (basic validation)
    if (!recipient.match(/^\+?[1-9]\d{1,14}$/)) {
      console.error(`Invalid phone number format: ${recipient}`);
      return false;
    }
    
    // Ensure phone number is in E.164 format (starts with +)
    const formattedRecipient = recipient.startsWith('+') ? recipient : `+${recipient}`;
    
    // Send the SMS
    const twilioMessage = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER || '',
      to: formattedRecipient
    });
    
    console.log(`SMS notification sent to ${recipient}. SID: ${twilioMessage.sid}`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS notification:', error);
    return false;
  }
}

/**
 * Builds HTML content for order confirmation email
 */
function buildOrderConfirmationEmail(order: ExtendedOrder): string {
  // Calculate totals
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 10000 ? 0 : 1500;
  const tax = Math.round(subtotal * 0.0825);
  const total = subtotal + shipping + tax;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.5; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        .logo { font-size: 24px; font-weight: bold; color: #4a6cf7; }
        .order-info { padding: 20px 0; }
        .order-details { padding: 20px 0; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 10px; border-bottom: 1px solid #eee; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .item-details { font-size: 12px; color: #666; }
        .totals { padding: 20px 0; }
        .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
        .grand-total { font-weight: bold; font-size: 18px; padding-top: 10px; }
        .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Jay's Frames</div>
          <div>1440 1/2 Yale St. Houston TX 77008</div>
          <div>(832) 893-3794</div>
        </div>
        
        <div class="order-info">
          <h1>Thank You for Your Order!</h1>
          <p>Dear ${order.customerName},</p>
          <p>Your order has been received and is being processed. Your order details are below:</p>
          <p><strong>Order Number:</strong> #${order.id}</p>
          <p><strong>Order Date:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="order-details">
          <h2>Order Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>
                    ${item.name}
                    ${item.details ? `
                      <div class="item-details">
                        ${item.details.width && item.details.height ? 
                          `Size: ${item.details.width}" × ${item.details.height}"<br>` : ''}
                        ${item.details.frameColor ? `Frame: ${item.details.frameColor}<br>` : ''}
                        ${item.details.matColor ? `Mat: ${item.details.matColor}<br>` : ''}
                        ${item.details.glassType ? `Glass: ${item.details.glassType}` : ''}
                      </div>
                    ` : ''}
                  </td>
                  <td>${item.quantity}</td>
                  <td>$${(item.price / 100).toFixed(2)}</td>
                  <td>$${((item.price * item.quantity) / 100).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="totals">
          <div class="total-row">
            <div>Subtotal</div>
            <div>$${(subtotal / 100).toFixed(2)}</div>
          </div>
          <div class="total-row">
            <div>Shipping</div>
            <div>${shipping === 0 ? 'Free' : `$${(shipping / 100).toFixed(2)}`}</div>
          </div>
          <div class="total-row">
            <div>Tax (8.25%)</div>
            <div>$${(tax / 100).toFixed(2)}</div>
          </div>
          <div class="total-row grand-total">
            <div>Total</div>
            <div>$${(total / 100).toFixed(2)}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>A copy of your invoice is attached to this email. Please keep it for your records.</p>
          <p>If you have any questions about your order, please contact us at <a href="mailto:info@jaysframes.com">info@jaysframes.com</a> or call us at (832) 893-3794.</p>
          <p>&copy; ${new Date().getFullYear()} Jay's Frames. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}