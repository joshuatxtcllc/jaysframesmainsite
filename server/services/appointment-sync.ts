
import { storage } from '../storage';
import { calendarService } from './calendar-integration';
import { Appointment, InsertAppointment } from '../../shared/schema';

export interface UserCalendarConfig {
  userId: number;
  accessToken: string;
  refreshToken?: string;
  calendarId?: string;
  syncEnabled: boolean;
  lastSync?: Date;
}

export class AppointmentSyncService {
  private userConfigs = new Map<number, UserCalendarConfig>();

  /**
   * Configure calendar sync for a user
   */
  setUserCalendarConfig(config: UserCalendarConfig): void {
    this.userConfigs.set(config.userId, config);
  }

  /**
   * Create appointment with calendar sync
   */
  async createAppointmentWithSync(
    appointmentData: InsertAppointment,
    userEmail: string,
    userId?: number
  ): Promise<Appointment> {
    // Create appointment in local database
    const appointment = await storage.createAppointment(appointmentData);

    // Sync to calendar if user has it configured
    if (userId && this.userConfigs.has(userId)) {
      const config = this.userConfigs.get(userId)!;
      if (config.syncEnabled) {
        try {
          calendarService.setCredentials(config.accessToken, config.refreshToken);
          const calendarEventId = await calendarService.syncAppointmentToCalendar(appointment, userEmail);
          
          // Update appointment with calendar event ID
          await storage.updateAppointment(appointment.id, {
            notes: `${appointment.notes || ''}\nGoogle Calendar Event ID: ${calendarEventId}`
          });
        } catch (error) {
          console.error('Failed to sync appointment to calendar:', error);
          // Don't fail the appointment creation if calendar sync fails
        }
      }
    }

    return appointment;
  }

  /**
   * Update appointment with calendar sync
   */
  async updateAppointmentWithSync(
    appointmentId: number,
    updates: Partial<InsertAppointment>,
    userId?: number
  ): Promise<Appointment | undefined> {
    const appointment = await storage.updateAppointment(appointmentId, updates);
    
    if (appointment && userId && this.userConfigs.has(userId)) {
      const config = this.userConfigs.get(userId)!;
      if (config.syncEnabled) {
        try {
          calendarService.setCredentials(config.accessToken, config.refreshToken);
          
          // Extract calendar event ID from notes
          const eventIdMatch = appointment.notes?.match(/Google Calendar Event ID: (.+)/);
          if (eventIdMatch) {
            const calendarEventId = eventIdMatch[1];
            await calendarService.updateCalendarEvent(calendarEventId, {
              summary: appointment.title,
              description: appointment.description || '',
              start: {
                dateTime: new Date(appointment.startTime).toISOString(),
                timeZone: 'America/Chicago'
              },
              end: {
                dateTime: new Date(appointment.endTime).toISOString(),
                timeZone: 'America/Chicago'
              }
            });
          }
        } catch (error) {
          console.error('Failed to sync appointment update to calendar:', error);
        }
      }
    }

    return appointment;
  }

  /**
   * Cancel appointment with calendar sync
   */
  async cancelAppointmentWithSync(appointmentId: number, userId?: number): Promise<boolean> {
    const appointment = await storage.getAppointmentById(appointmentId);
    
    if (appointment && userId && this.userConfigs.has(userId)) {
      const config = this.userConfigs.get(userId)!;
      if (config.syncEnabled) {
        try {
          calendarService.setCredentials(config.accessToken, config.refreshToken);
          
          // Extract calendar event ID from notes
          const eventIdMatch = appointment.notes?.match(/Google Calendar Event ID: (.+)/);
          if (eventIdMatch) {
            const calendarEventId = eventIdMatch[1];
            await calendarService.deleteCalendarEvent(calendarEventId);
          }
        } catch (error) {
          console.error('Failed to cancel calendar event:', error);
        }
      }
    }

    // Update local appointment status
    await storage.updateAppointment(appointmentId, { status: 'cancelled' });
    return true;
  }

  /**
   * Check for calendar conflicts before scheduling
   */
  async checkCalendarConflicts(
    startTime: Date,
    endTime: Date,
    userId?: number
  ): Promise<boolean> {
    if (!userId || !this.userConfigs.has(userId)) {
      return false;
    }

    const config = this.userConfigs.get(userId)!;
    if (!config.syncEnabled) {
      return false;
    }

    try {
      calendarService.setCredentials(config.accessToken, config.refreshToken);
      return await calendarService.checkForConflicts(startTime, endTime);
    } catch (error) {
      console.error('Failed to check calendar conflicts:', error);
      return false;
    }
  }
}

export const appointmentSyncService = new AppointmentSyncService();
