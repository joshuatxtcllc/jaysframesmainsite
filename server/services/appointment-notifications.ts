import cron from 'cron';
import { storage } from '../storage';
import { sendNotification, sendSmsNotification } from './notification';
import { appointments } from '@shared/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

/**
 * Appointment Notification Service
 * Handles automated reminders and notifications for scheduled appointments
 */

export interface AppointmentNotificationConfig {
  reminderHours: number[];
  enableSms: boolean;
  enableEmail: boolean;
  staffPhone?: string;
  staffEmail?: string;
}

const defaultConfig: AppointmentNotificationConfig = {
  reminderHours: [24, 2], // Send reminders 24 hours and 2 hours before
  enableSms: true,
  enableEmail: true,
  staffPhone: process.env.STAFF_PHONE,
  staffEmail: process.env.STAFF_EMAIL || 'Frames@Jaysframes.com'
};

let config = defaultConfig;
let reminderJob: cron.CronJob | null = null;

/**
 * Initialize the appointment notification system
 */
export function initializeAppointmentNotifications(customConfig?: Partial<AppointmentNotificationConfig>) {
  if (customConfig) {
    config = { ...defaultConfig, ...customConfig };
  }

  // Stop existing job if running
  if (reminderJob) {
    reminderJob.stop();
  }

  // Run reminder check every 30 minutes
  reminderJob = new cron.CronJob('0 */30 * * * *', async () => {
    await checkAndSendReminders();
  });

  reminderJob.start();
  console.log('Appointment notification system initialized');
  console.log(`Reminders will be sent at: ${config.reminderHours.join(', ')} hours before appointments`);
}

/**
 * Check for upcoming appointments and send reminders
 */
async function checkAndSendReminders() {
  try {
    const now = new Date();
    const maxLookAhead = Math.max(...config.reminderHours);
    const lookAheadTime = new Date(now.getTime() + maxLookAhead * 60 * 60 * 1000);

    // Get upcoming appointments
    const upcomingAppointments = await storage.getAppointmentsByDateRange(now, lookAheadTime);
    
    for (const appointment of upcomingAppointments) {
      // Skip cancelled or completed appointments
      if (appointment.status === 'cancelled' || appointment.status === 'completed') {
        continue;
      }

      const appointmentTime = new Date(appointment.startTime);
      const timeDiffHours = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Check if we should send a reminder
      for (const reminderHour of config.reminderHours) {
        const shouldSendReminder = 
          timeDiffHours <= reminderHour && 
          timeDiffHours > (reminderHour - 0.5) && // 30-minute window
          !appointment.reminderSent;

        if (shouldSendReminder) {
          await sendAppointmentReminder(appointment, reminderHour);
          
          // Mark reminder as sent if this is the last reminder
          if (reminderHour === Math.min(...config.reminderHours)) {
            await storage.markAppointmentReminderSent(appointment.id);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking appointment reminders:', error);
  }
}

/**
 * Send appointment reminder to customer and staff
 */
async function sendAppointmentReminder(appointment: any, hoursBeforeAppointment: number) {
  const appointmentDate = new Date(appointment.startTime);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = appointmentDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  // Get customer contact info
  let customerEmail = '';
  let customerPhone = '';
  let customerName = appointment.title || 'Customer';

  // Try to extract contact info from appointment notes or get from user
  if (appointment.userId) {
    try {
      const user = await storage.getUser(appointment.userId);
      if (user) {
        customerEmail = user.email;
        customerPhone = user.phone || '';
        customerName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
      }
    } catch (error) {
      console.error('Error getting user details for appointment reminder:', error);
    }
  }

  // Parse customer info from appointment description if user not found
  if (!customerEmail && appointment.description) {
    const emailMatch = appointment.description.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const phoneMatch = appointment.description.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
    
    if (emailMatch) customerEmail = emailMatch[0];
    if (phoneMatch) customerPhone = phoneMatch[0];
  }

  const reminderType = hoursBeforeAppointment >= 24 ? 'day-before' : 'day-of';
  const timeUntil = hoursBeforeAppointment >= 24 ? 'tomorrow' : `in ${hoursBeforeAppointment} hours`;

  // Customer reminder
  if (config.enableEmail && customerEmail) {
    try {
      await sendNotification({
        title: `Appointment Reminder - ${appointment.type} ${timeUntil}`,
        description: `Hi ${customerName}! This is a reminder that your ${appointment.type} appointment is scheduled for ${formattedDate} at ${formattedTime}. We're located at 218 W 27th St., Houston Heights, TX 77008. If you need to reschedule, please call us at (713) 123-4567.`,
        source: 'appointment-system',
        sourceId: appointment.id.toString(),
        type: 'info',
        actionable: true,
        link: '/contact',
        recipient: customerEmail
      });

      console.log(`Appointment reminder sent to customer: ${customerEmail} for appointment ${appointment.id}`);
    } catch (error) {
      console.error(`Failed to send email reminder to customer ${customerEmail}:`, error);
    }
  }

  // Customer SMS reminder
  if (config.enableSms && customerPhone && process.env.TWILIO_PHONE_NUMBER) {
    try {
      await sendSmsNotification(
        `Jay's Frames Reminder: Your ${appointment.type} appointment is ${timeUntil} (${formattedDate} at ${formattedTime}). 218 W 27th St, Houston Heights. Call (713) 123-4567 to reschedule.`,
        customerPhone
      );

      console.log(`SMS reminder sent to customer: ${customerPhone} for appointment ${appointment.id}`);
    } catch (error) {
      console.error(`Failed to send SMS reminder to customer ${customerPhone}:`, error);
    }
  }

  // Staff notification
  if (config.enableEmail && config.staffEmail) {
    try {
      await sendNotification({
        title: `Staff Alert: Upcoming Appointment - ${appointment.type}`,
        description: `Appointment reminder: ${customerName} has a ${appointment.type} appointment ${timeUntil} (${formattedDate} at ${formattedTime}). Customer: ${customerEmail || 'No email'}, ${customerPhone || 'No phone'}. Notes: ${appointment.customerNotes || 'None'}`,
        source: 'appointment-system',
        sourceId: appointment.id.toString(),
        type: 'info',
        actionable: true,
        link: `/admin/appointments/${appointment.id}`,
        recipient: config.staffEmail
      });

      console.log(`Staff notification sent for appointment ${appointment.id}`);
    } catch (error) {
      console.error('Failed to send staff email notification:', error);
    }
  }

  // Staff SMS notification
  if (config.enableSms && config.staffPhone && reminderType === 'day-of') {
    try {
      await sendSmsNotification(
        `Jay's Frames: ${customerName} appointment in ${hoursBeforeAppointment}h - ${appointment.type} at ${formattedTime}. Customer: ${customerPhone || 'No phone'}`,
        config.staffPhone
      );

      console.log(`Staff SMS sent for appointment ${appointment.id}`);
    } catch (error) {
      console.error('Failed to send staff SMS notification:', error);
    }
  }
}

/**
 * Send immediate notification for new appointment
 */
export async function sendNewAppointmentNotification(appointment: any, customerInfo: { name: string; email: string; phone?: string; message?: string }) {
  const appointmentDate = new Date(appointment.startTime);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = appointmentDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  // Send confirmation to customer
  if (config.enableEmail && customerInfo.email) {
    try {
      await sendNotification({
        title: `Appointment Confirmed - ${appointment.type}`,
        description: `Thank you ${customerInfo.name}! Your ${appointment.type} consultation is confirmed for ${formattedDate} at ${formattedTime}. We're located at 218 W 27th St., Houston Heights, TX 77008. We'll send you reminders as your appointment approaches. If you need to reschedule, please call us at (713) 123-4567.`,
        source: 'appointment-system',
        sourceId: appointment.id.toString(),
        type: 'success',
        actionable: true,
        link: '/contact',
        recipient: customerInfo.email
      });
    } catch (error) {
      console.error('Failed to send customer confirmation:', error);
    }
  }

  // Send notification to staff
  if (config.enableEmail && config.staffEmail) {
    try {
      await sendNotification({
        title: `New Appointment Scheduled - ${appointment.type}`,
        description: `${customerInfo.name} scheduled a ${appointment.type} consultation for ${formattedDate} at ${formattedTime}. Contact: ${customerInfo.email}, ${customerInfo.phone || 'No phone'}. Message: ${customerInfo.message || 'None'}`,
        source: 'appointment-system',
        sourceId: appointment.id.toString(),
        type: 'info',
        actionable: true,
        link: `/admin/appointments/${appointment.id}`,
        recipient: config.staffEmail
      });
    } catch (error) {
      console.error('Failed to send staff notification:', error);
    }
  }

  // Send SMS to staff
  if (config.enableSms && config.staffPhone) {
    try {
      await sendSmsNotification(
        `New consultation: ${customerInfo.name} - ${appointment.type} on ${formattedDate} at ${formattedTime}. Phone: ${customerInfo.phone || 'None'}`,
        config.staffPhone
      );
    } catch (error) {
      console.error('Failed to send staff SMS:', error);
    }
  }

  console.log(`New appointment notifications sent for appointment ${appointment.id}`);
}

/**
 * Send notification when appointment status changes
 */
export async function sendAppointmentStatusNotification(appointment: any, oldStatus: string, newStatus: string) {
  const appointmentDate = new Date(appointment.startTime);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = appointmentDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  let customerEmail = '';
  let customerName = appointment.title || 'Customer';

  // Get customer details
  if (appointment.userId) {
    try {
      const user = await storage.getUser(appointment.userId);
      if (user) {
        customerEmail = user.email;
        customerName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
      }
    } catch (error) {
      console.error('Error getting user details for status notification:', error);
    }
  }

  let notificationTitle = '';
  let notificationMessage = '';
  let notificationType: 'info' | 'success' | 'warning' | 'error' = 'info';

  switch (newStatus) {
    case 'confirmed':
      notificationTitle = 'Appointment Confirmed';
      notificationMessage = `Your ${appointment.type} appointment for ${formattedDate} at ${formattedTime} has been confirmed. We look forward to seeing you!`;
      notificationType = 'success';
      break;
    case 'cancelled':
      notificationTitle = 'Appointment Cancelled';
      notificationMessage = `Your ${appointment.type} appointment for ${formattedDate} at ${formattedTime} has been cancelled. Please contact us to reschedule.`;
      notificationType = 'warning';
      break;
    case 'completed':
      notificationTitle = 'Thank You for Your Visit!';
      notificationMessage = `Thank you for visiting Jay's Frames! Your ${appointment.type} appointment has been completed. We hope to see you again soon.`;
      notificationType = 'success';
      break;
    case 'no_show':
      notificationTitle = 'Missed Appointment';
      notificationMessage = `We missed you at your ${appointment.type} appointment on ${formattedDate} at ${formattedTime}. Please contact us to reschedule.`;
      notificationType = 'warning';
      break;
    default:
      return; // Don't send notification for other status changes
  }

  // Send notification to customer
  if (config.enableEmail && customerEmail) {
    try {
      await sendNotification({
        title: notificationTitle,
        description: notificationMessage,
        source: 'appointment-system',
        sourceId: appointment.id.toString(),
        type: notificationType,
        actionable: true,
        link: '/contact',
        recipient: customerEmail
      });
    } catch (error) {
      console.error('Failed to send status change notification to customer:', error);
    }
  }

  console.log(`Status change notification sent for appointment ${appointment.id}: ${oldStatus} -> ${newStatus}`);
}

/**
 * Get notification configuration
 */
export function getNotificationConfig(): AppointmentNotificationConfig {
  return config;
}

/**
 * Update notification configuration
 */
export function updateNotificationConfig(newConfig: Partial<AppointmentNotificationConfig>) {
  config = { ...config, ...newConfig };
  console.log('Appointment notification configuration updated');
}

/**
 * Stop the notification system
 */
export function stopAppointmentNotifications() {
  if (reminderJob) {
    reminderJob.stop();
    reminderJob = null;
    console.log('Appointment notification system stopped');
  }
}

/**
 * Get upcoming appointments for dashboard
 */
export async function getUpcomingAppointments(daysAhead: number = 7) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  
  return await storage.getAppointmentsByDateRange(now, futureDate);
}

/**
 * Send test notification (for setup verification)
 */
export async function sendTestNotification(testEmail?: string, testPhone?: string) {
  const testAppointment = {
    id: 'TEST',
    type: 'consultation',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    title: 'Test Customer'
  };

  console.log('Sending test notifications...');

  if (testEmail) {
    try {
      await sendNotification({
        title: 'Test Appointment Notification',
        description: 'This is a test notification to verify your appointment notification system is working correctly.',
        source: 'appointment-system',
        sourceId: 'TEST',
        type: 'info',
        actionable: false,
        recipient: testEmail
      });
      console.log(`Test email sent to ${testEmail}`);
    } catch (error) {
      console.error(`Failed to send test email to ${testEmail}:`, error);
    }
  }

  if (testPhone && process.env.TWILIO_PHONE_NUMBER) {
    try {
      await sendSmsNotification(
        'Test SMS from Jay\'s Frames appointment system. Your notifications are working correctly!',
        testPhone
      );
      console.log(`Test SMS sent to ${testPhone}`);
    } catch (error) {
      console.error(`Failed to send test SMS to ${testPhone}:`, error);
    }
  }
}