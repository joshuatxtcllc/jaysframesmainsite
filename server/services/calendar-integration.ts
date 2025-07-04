
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { storage } from '../storage';
import { Appointment } from '../../shared/schema';

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

export class CalendarIntegrationService {
  private oauth2Client: OAuth2Client;
  private calendar: any;

  constructor() {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  /**
   * Set user credentials from stored tokens
   */
  setCredentials(accessToken: string, refreshToken?: string) {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
  }

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  /**
   * Create event in Google Calendar
   */
  async createCalendarEvent(event: CalendarEvent): Promise<string> {
    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      return response.data.id;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  /**
   * Update event in Google Calendar
   */
  async updateCalendarEvent(eventId: string, event: Partial<CalendarEvent>): Promise<void> {
    try {
      await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event
      });
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Failed to update calendar event');
    }
  }

  /**
   * Delete event from Google Calendar
   */
  async deleteCalendarEvent(eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }
  }

  /**
   * Sync local appointment to Google Calendar
   */
  async syncAppointmentToCalendar(appointment: Appointment, userEmail: string): Promise<string> {
    const event: CalendarEvent = {
      summary: appointment.title,
      description: appointment.description || '',
      start: {
        dateTime: new Date(appointment.startTime).toISOString(),
        timeZone: 'America/Chicago' // Houston timezone
      },
      end: {
        dateTime: new Date(appointment.endTime).toISOString(),
        timeZone: 'America/Chicago'
      },
      attendees: [
        {
          email: userEmail,
          displayName: 'Customer'
        },
        {
          email: 'jay@jaysframes.com', // Business email
          displayName: 'Jay\'s Frames'
        }
      ]
    };

    return await this.createCalendarEvent(event);
  }

  /**
   * Check for calendar conflicts
   */
  async checkForConflicts(startTime: Date, endTime: Date): Promise<boolean> {
    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.data.items && response.data.items.length > 0;
    } catch (error) {
      console.error('Error checking calendar conflicts:', error);
      return false;
    }
  }

  /**
   * Get free/busy information
   */
  async getFreeBusy(startTime: Date, endTime: Date): Promise<any> {
    try {
      const response = await this.calendar.freebusy.query({
        resource: {
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          items: [{ id: 'primary' }]
        }
      });

      return response.data.calendars.primary;
    } catch (error) {
      console.error('Error getting free/busy:', error);
      return null;
    }
  }
}

export const calendarService = new CalendarIntegrationService();
