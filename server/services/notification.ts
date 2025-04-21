import nodemailer from 'nodemailer';
import { twilioClient } from '../index';

// Email transporter configuration
let transporter: nodemailer.Transporter;
let emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
};

/**
 * Initialize the email transporter
 */
export async function initializeEmailTransporter() {
  try {
    // If we have email credentials, use them
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport(emailConfig);
      console.log('Email transporter initialized');
    } else {
      // Otherwise, create a test account for development
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log('Using test account. Emails can be viewed at https://ethereal.email');
    }
  } catch (error) {
    console.error('Failed to initialize email transporter:', error);
  }
}

// Initialize the email transporter when the service starts
initializeEmailTransporter();

/**
 * Notification types
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * Notification request interface
 */
export interface NotificationRequest {
  title: string;
  description: string;
  source?: string;
  sourceId?: string;
  type?: NotificationType;
  actionable?: boolean;
  link?: string;
  recipient?: string;
  smsEnabled?: boolean;
  smsRecipient?: string;
}

/**
 * Send an email notification
 * @param to Recipient email address
 * @param subject Email subject
 * @param text Plain text content
 * @param html HTML content (optional)
 * @returns Success status and message URL if available
 */
export async function sendEmail(to: string, subject: string, text: string, html?: string): Promise<{success: boolean, messageUrl?: string}> {
  try {
    if (!transporter) {
      await initializeEmailTransporter();
    }
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Jay\'s Frames <no-reply@jaysframes.com>',
      to,
      subject,
      text,
      html: html || text
    });
    
    console.log(`Email sent: ${info.messageId}`);
    
    // For development, log the URL where the message can be viewed
    if (info.messageUrl) {
      console.log(`Email preview URL: ${info.messageUrl}`);
    }
    
    return { 
      success: true, 
      messageUrl: info.messageUrl 
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false };
  }
}

/**
 * Send an SMS notification
 * @param message SMS message content
 * @param to Recipient phone number
 * @returns Success status
 */
export async function sendSmsNotification(message: string, to: string): Promise<boolean> {
  try {
    if (!twilioClient) {
      console.error('Twilio client not initialized. SMS notification not sent.');
      return false;
    }
    
    if (!process.env.TWILIO_PHONE_NUMBER) {
      console.error('Twilio phone number not configured. SMS notification not sent.');
      return false;
    }
    
    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    console.log(`SMS sent: ${response.sid}`);
    return true;
  } catch (error) {
    console.error('SMS sending error:', error);
    return false;
  }
}

/**
 * Generate HTML email template for notifications
 * @param title Notification title
 * @param message Notification message
 * @param type Notification type (info, success, warning, error)
 * @param actionLink Optional action link
 * @param actionText Optional action button text
 * @returns HTML string
 */
function generateEmailTemplate(
  title: string, 
  message: string, 
  type: NotificationType = 'info',
  actionLink?: string,
  actionText: string = 'View Details'
): string {
  // Colors based on notification type
  const colors = {
    info: '#2563EB',     // Blue
    success: '#10B981',  // Green
    warning: '#F59E0B',  // Amber/Orange
    error: '#EF4444'     // Red
  };
  
  const color = colors[type] || colors.info;
  
  // Create the action button if a link is provided
  const actionButton = actionLink ? `
    <tr>
      <td align="center" style="padding: 20px 0;">
        <a href="${actionLink}" style="background-color: ${color}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">${actionText}</a>
      </td>
    </tr>
  ` : '';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; color: #333333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <tr>
          <td style="text-align: center; padding: 20px 0;">
            <img src="https://jaysframes.com/logo.png" alt="Jay's Frames Logo" style="max-width: 150px; height: auto;">
          </td>
        </tr>
        <tr>
          <td style="background-color: ${color}; padding: 10px; text-align: center; color: white; font-weight: bold;">
            ${title}
          </td>
        </tr>
        <tr>
          <td style="background-color: #f9f9f9; padding: 20px; border-left: 1px solid #ddd; border-right: 1px solid #ddd; border-bottom: 1px solid #ddd;">
            <p>${message}</p>
          </td>
        </tr>
        ${actionButton}
        <tr>
          <td style="text-align: center; padding-top: 20px; color: #666666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Jay's Frames. All rights reserved.</p>
            <p>123 Frame Street, Artsville, AR 12345</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Send a notification via multiple channels as configured
 * @param notification Notification details
 * @returns Success status
 */
export async function sendNotification(notification: NotificationRequest): Promise<boolean> {
  const {
    title,
    description,
    type = 'info',
    actionable = false,
    link,
    recipient,
    smsEnabled = false,
    smsRecipient
  } = notification;
  
  let success = false;
  
  // Log the notification for debugging
  console.log(`Sending notification: ${title} - ${description}`);
  
  // Send email if recipient is provided
  if (recipient) {
    // Generate email HTML with template
    const html = generateEmailTemplate(
      title,
      description,
      type as NotificationType,
      actionable && link ? link : undefined
    );
    
    // Send the email
    const emailResult = await sendEmail(
      recipient,
      title,
      description,
      html
    );
    
    success = emailResult.success;
  }
  
  // Send SMS if enabled and recipient is provided
  if (smsEnabled && smsRecipient) {
    const smsMessage = `${title}: ${description}${actionable && link ? ` - ${link}` : ''}`;
    const smsResult = await sendSmsNotification(smsMessage, smsRecipient);
    
    // Only set success to true if both channels succeed, or if email wasn't sent
    success = recipient ? (success && smsResult) : smsResult;
  }
  
  // Add to the web UI notification system (would be implemented in a real system)
  // This might involve WebSockets, server-sent events, or a database table
  
  return success;
}

/**
 * Format for order status notifications using order data
 * @param orderInfo Order information
 * @param type Notification type
 * @returns Formatted notification request
 */
export function formatOrderStatusNotification(
  orderInfo: any,
  statusMessage: string,
  type: NotificationType = 'info'
): NotificationRequest {
  return {
    title: `Order #${orderInfo.id} Update`,
    description: statusMessage,
    source: 'order-processing',
    sourceId: orderInfo.id.toString(),
    type,
    actionable: true,
    link: `/order-status?orderId=${orderInfo.id}`,
    recipient: orderInfo.customerEmail,
    smsEnabled: orderInfo.smsEnabled,
    smsRecipient: orderInfo.customerPhone
  };
}